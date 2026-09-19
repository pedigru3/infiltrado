'use client';

import React, { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { Header } from '@/components/Header';
import { ScreenHome } from '@/components/ScreenHome';
import { ScreenEnterCode } from '@/components/ScreenEnterCode';
import { ScreenName } from '@/components/ScreenName';
import { ScreenLobby } from '@/components/ScreenLobby';
import { ScreenGame } from '@/components/ScreenGame';
import { ThemeModal } from '@/components/ThemeModal';
import { ClientRoomState } from '@/lib/roomStore';

type AppScreen = 'home' | 'enter_code' | 'name' | 'lobby' | 'game';

function subscribeToStorage(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getPlayerIdSnapshot(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('infiltrado_player_id');
  if (!id) {
    id = 'usr_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('infiltrado_player_id', id);
  }
  return id;
}

function getPlayerNameSnapshot(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('infiltrado_player_name') || '';
}

function getSavedRoomCodeSnapshot(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('infiltrado_room_code') || '';
}

export default function HomePage() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [roomCode, setRoomCode] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);

  const storedPlayerId = useSyncExternalStore(subscribeToStorage, getPlayerIdSnapshot, () => '');
  const storedPlayerName = useSyncExternalStore(subscribeToStorage, getPlayerNameSnapshot, () => '');
  const savedRoomCode = useSyncExternalStore(subscribeToStorage, getSavedRoomCodeSnapshot, () => '');

  const [playerId, setPlayerId] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [roomState, setRoomState] = useState<ClientRoomState | null>(null);

  const activePlayerId = playerId || storedPlayerId;
  const activePlayerName = playerName || storedPlayerName;

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [hasAttemptedAutoRejoin, setHasAttemptedAutoRejoin] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Auto-recuperação de sessão do localStorage ao abrir/recarregar a página
  useEffect(() => {
    if (hasAttemptedAutoRejoin) return;
    setHasAttemptedAutoRejoin(true);

    if (savedRoomCode && activePlayerId && activePlayerName) {
      // Tenta reconectar diretamente à sala salva
      fetch(`/api/rooms/${savedRoomCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: activePlayerId,
          playerName: activePlayerName,
          isHost: false
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.state) {
            setRoomCode(savedRoomCode);
            setRoomState(data.state);
            if (data.state.status === 'drawing' || data.state.status === 'playing' || data.state.status === 'ended') {
              setScreen('game');
            } else {
              setScreen('lobby');
            }
          } else {
            // Sala expirada ou inválida, limpa o localStorage
            localStorage.removeItem('infiltrado_room_code');
          }
        })
        .catch(() => {
          // Erro de rede na reconexão inicial
        });
    }
  }, [savedRoomCode, activePlayerId, activePlayerName, hasAttemptedAutoRejoin]);

  // 2. Heartbeat contínuo para manter a presença online ativa e sincronizar estado
  const sendHeartbeat = useCallback(async () => {
    if (!roomCode || !activePlayerId || (screen !== 'lobby' && screen !== 'game')) {
      return;
    }

    try {
      const res = await fetch(`/api/rooms/${roomCode}/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: activePlayerId, playerName: activePlayerName })
      });

      const data = await res.json();
      if (data.success && data.state) {
        const state: ClientRoomState = data.state;
        setRoomState(state);

        // Transição suave entre lobby e tela de jogo
        if (state.status === 'drawing' || state.status === 'playing' || state.status === 'ended') {
          if (screen !== 'game') {
            setScreen('game');
          }
        } else if (state.status === 'lobby') {
          if (screen === 'game') {
            setScreen('lobby');
          }
        }
      } else if (res.status === 404 && data.message?.includes('não encontrada')) {
        showToast('A sala foi encerrada.');
        localStorage.removeItem('infiltrado_room_code');
        setRoomState(null);
        setRoomCode('');
        setScreen('home');
      }
    } catch {
      // Oscilação temporária de rede (mantém o jogador conectado e tenta no próximo tick)
    }
  }, [roomCode, activePlayerId, activePlayerName, screen]);

  // Intervalo do Heartbeat a cada 2.5s
  useEffect(() => {
    if (!roomCode || !activePlayerId || (screen !== 'lobby' && screen !== 'game')) {
      return;
    }

    const interval = setInterval(sendHeartbeat, 2500);
    return () => clearInterval(interval);
  }, [roomCode, activePlayerId, screen, sendHeartbeat]);

  // --- Ações do Jogo ---

  // Tela 1: Criar Grupo -> vai pra Tela 2
  const handleCreateGroup = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/rooms', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.roomCode) {
        setRoomCode(data.roomCode);
        setIsHost(true);
        setScreen('name'); // Tela 2
      } else {
        setErrorMessage(data.message || 'Erro ao criar grupo');
      }
    } catch {
      setErrorMessage('Erro de conexão ao criar grupo');
    } finally {
      setLoading(false);
    }
  };

  // Tela 1: Entrar em Grupo (abrir tela de digitar código)
  const handleGoToEnterCode = () => {
    setErrorMessage(null);
    setScreen('enter_code');
  };

  // Tela 1 sub: Inserir Código -> Valida e vai pra Tela 2
  const handleSubmitCode = async (code: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/rooms?code=${code}`);
      const data = await res.json();
      if (data.success) {
        setRoomCode(code);
        setIsHost(false);
        setScreen('name'); // Tela 2
      } else {
        setErrorMessage(data.message || 'Sala não encontrada. Verifique o código.');
      }
    } catch {
      setErrorMessage('Erro ao buscar sala');
    } finally {
      setLoading(false);
    }
  };

  // Tela 2: Inserir Nome e Iniciar/Entrar -> Salva no localStorage e vai pra Tela 3 (Lobby)
  const handleSubmitName = async (name: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      localStorage.setItem('infiltrado_player_name', name);
      localStorage.setItem('infiltrado_room_code', roomCode);
      setPlayerName(name);

      const res = await fetch(`/api/rooms/${roomCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: activePlayerId,
          playerName: name,
          isHost
        })
      });

      const data = await res.json();
      if (data.success && data.state) {
        setRoomState(data.state);
        setScreen('lobby'); // Tela 3
      } else {
        setErrorMessage(data.message || 'Erro ao entrar na sala');
      }
    } catch {
      setErrorMessage('Erro de comunicação ao entrar');
    } finally {
      setLoading(false);
    }
  };

  // Tela 3: Iniciar Partida (Jogar)
  const handleStartGame = async () => {
    if (!roomCode || !activePlayerId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/rooms/${roomCode}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: activePlayerId })
      });
      const data = await res.json();
      if (data.success && data.state) {
        setRoomState(data.state);
        setScreen('game'); // Tela 4
      } else {
        showToast(data.message || 'Erro ao iniciar');
      }
    } catch {
      showToast('Erro ao iniciar jogo');
    } finally {
      setLoading(false);
    }
  };

  // Alterar Tema
  const handleSelectTheme = async (themeId: string) => {
    if (!roomCode || !activePlayerId) return;
    try {
      const res = await fetch(`/api/rooms/${roomCode}/theme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: activePlayerId, themeId })
      });
      const data = await res.json();
      if (data.success && data.state) {
        setRoomState(data.state);
        showToast('Tema atualizado!');
      }
    } catch {
      showToast('Erro ao mudar tema');
    }
  };

  // Resetar para nova rodada / voltar ao lobby
  const handleResetRound = async () => {
    if (!roomCode) return;
    try {
      const res = await fetch(`/api/rooms/${roomCode}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: activePlayerId })
      });
      const data = await res.json();
      if (data.success && data.state) {
        setRoomState(data.state);
        setScreen('lobby');
      }
    } catch {
      showToast('Erro ao reiniciar');
    }
  };

  // Revelar infiltrado
  const handleRevealImpostor = async () => {
    if (!roomCode) return;
    try {
      const res = await fetch(`/api/rooms/${roomCode}/reveal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: activePlayerId })
      });
      const data = await res.json();
      if (data.success && data.state) {
        setRoomState(data.state);
      }
    } catch {
      showToast('Erro ao revelar');
    }
  };

  // Sair da Sala (limpa o localStorage e remove o jogador no servidor)
  const handleLeaveRoom = async () => {
    localStorage.removeItem('infiltrado_room_code');
    if (roomCode && activePlayerId) {
      try {
        await fetch(`/api/rooms/${roomCode}/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId: activePlayerId })
        });
      } catch {
        // Ignorado
      }
    }
    setRoomState(null);
    setRoomCode('');
    setScreen('home');
  };

  return (
    <>
      <Header
        onBackHome={() => {
          if (screen !== 'home') {
            if (confirm('Deseja realmente sair da sala e voltar ao início?')) {
              handleLeaveRoom();
            }
          }
        }}
        showHomeBtn={screen !== 'home'}
      />

      {/* Screen 1: Home (Criar ou Entrar) */}
      {screen === 'home' && (
        <ScreenHome
          onCreateGroup={handleCreateGroup}
          onGoToEnterCode={handleGoToEnterCode}
          loading={loading}
        />
      )}

      {/* Screen 1 Sub: Inserir Código */}
      {screen === 'enter_code' && (
        <ScreenEnterCode
          onBack={() => setScreen('home')}
          onSubmitCode={handleSubmitCode}
          loading={loading}
          errorMessage={errorMessage}
        />
      )}

      {/* Screen 2: Inserir Nome */}
      {screen === 'name' && (
        <ScreenName
          isHost={isHost}
          roomCode={roomCode}
          onBack={() => setScreen(isHost ? 'home' : 'enter_code')}
          onSubmitName={handleSubmitName}
          loading={loading}
          errorMessage={errorMessage}
        />
      )}

      {/* Screen 3: Lobby da Sala */}
      {screen === 'lobby' && roomState && (
        <ScreenLobby
          roomState={roomState}
          onOpenThemes={() => setIsThemeModalOpen(true)}
          onStartGame={handleStartGame}
          onLeaveRoom={handleLeaveRoom}
          startingGame={loading}
        />
      )}

      {/* Screen 4: Jogo Infiltrado / Sorteio e Revelação */}
      {screen === 'game' && roomState && (
        <ScreenGame
          key={roomState.roundStartedAt || 'game'}
          roomState={roomState}
          onResetRound={handleResetRound}
          onRevealImpostor={handleRevealImpostor}
          isHost={roomState.isHost}
        />
      )}

      {/* Modal de Temas */}
      {roomState && (
        <ThemeModal
          isOpen={isThemeModalOpen}
          selectedThemeId={roomState.selectedThemeId}
          onSelectTheme={handleSelectTheme}
          onClose={() => setIsThemeModalOpen(false)}
          isHost={roomState.isHost}
        />
      )}

      {/* Toast Notificação */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#141518] text-[#c8f560] text-xs font-extrabold shadow-xl border border-white/10 animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}
    </>
  );
}
