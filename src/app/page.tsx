'use client';

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
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

export default function HomePage() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [roomCode, setRoomCode] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);

  const storedPlayerId = useSyncExternalStore(subscribeToStorage, getPlayerIdSnapshot, () => '');
  const storedPlayerName = useSyncExternalStore(subscribeToStorage, getPlayerNameSnapshot, () => '');

  const [playerId, setPlayerId] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [roomState, setRoomState] = useState<ClientRoomState | null>(null);

  const activePlayerId = playerId || storedPlayerId;
  const activePlayerName = playerName || storedPlayerName;

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Heartbeat function to maintain presence online and receive game state
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

        // Transition between lobby and game if state changed
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
        setRoomState(null);
        setRoomCode('');
        setScreen('home');
      }
    } catch {
      // Network hiccup transitório, não desconecta
    }
  }, [roomCode, activePlayerId, activePlayerName, screen]);

  // Heartbeat interval every 2.5 seconds
  useEffect(() => {
    if (!roomCode || !activePlayerId || (screen !== 'lobby' && screen !== 'game')) {
      return;
    }

    const interval = setInterval(sendHeartbeat, 2500);
    return () => clearInterval(interval);
  }, [roomCode, activePlayerId, screen, sendHeartbeat]);

  // Desconectar imediatamente apenas ao fechar a aba ou sair do site
  useEffect(() => {
    if (!roomCode || !activePlayerId) return;

    const handleBeforeUnload = () => {
      try {
        const payload = JSON.stringify({ playerId: activePlayerId });
        if (navigator.sendBeacon) {
          navigator.sendBeacon(`/api/rooms/${roomCode}/leave`, payload);
        }
      } catch {
        // Ignorado no encerramento da página
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, [roomCode, activePlayerId]);

  // --- Actions ---

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

  // Tela 2: Inserir Nome e Iniciar/Entrar -> vai pra Tela 3 (Lobby)
  const handleSubmitName = async (name: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      localStorage.setItem('infiltrado_player_name', name);
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

  // Sair da Sala
  const handleLeaveRoom = async () => {
    if (roomCode && activePlayerId) {
      try {
        await fetch(`/api/rooms/${roomCode}/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId: activePlayerId })
        });
      } catch {
        // Ignored
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
            if (confirm('Deseja realmente voltar ao início?')) {
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

      {/* Screen 4: Jogo / Sorteio e Revelação */}
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
          isHost={true}
        />
      )}

      {/* Toast Notificação */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-800/95 border border-white/20 text-white text-xs font-bold shadow-2xl backdrop-blur-md animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}
    </>
  );
}
