'use client';

import React, { useState } from 'react';
import { Copy, Check, Settings, Users, Play, Crown, LogOut, HeartHandshake, ShieldAlert } from 'lucide-react';
import { ClientRoomState } from '@/lib/roomStore';
import { THEMES } from '@/data/themes';

interface ScreenLobbyProps {
  roomState: ClientRoomState;
  onOpenThemes: () => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  startingGame: boolean;
}

export const ScreenLobby: React.FC<ScreenLobbyProps> = ({
  roomState,
  onOpenThemes,
  onStartGame,
  onLeaveRoom,
  startingGame
}) => {
  const [copied, setCopied] = useState(false);

  const currentTheme = THEMES.find((t) => t.id === roomState.selectedThemeId) || THEMES[0];
  const isTwinMode = roomState.gameMode === 'twin';
  const minPlayers = isTwinMode ? 2 : 3;
  const playerCount = roomState.players.length;
  const canStart = playerCount >= minPlayers;

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(roomState.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-300">
      {/* Top Header Card with Code, Copy, Gear */}
      <div className="space-y-3 mb-4">
        {/* Mode Pill */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            {isTwinMode ? (
              <>
                <HeartHandshake className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300">Modo: Palavra Gêmea (2 Jogadores)</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300">Modo: Infiltrado (3+ Jogadores)</span>
              </>
            )}
          </div>
          <span className="text-[11px] font-mono font-semibold text-slate-400">
            {playerCount}/{minPlayers} {playerCount >= minPlayers ? 'Pronto!' : ''}
          </span>
        </div>

        <div className="glass-panel-glow rounded-3xl p-4 sm:p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400/80">
              Código da Sala
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-white">
                {roomState.code}
              </span>
              <button
                id="btn-copy-code"
                onClick={handleCopyCode}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-cyan-300 active:scale-95 transition-all cursor-pointer"
                title="Copiar código"
                aria-label="Copiar código da sala"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Right side: Gear for themes */}
          <div className="flex items-center gap-2">
            <button
              id="btn-open-themes"
              onClick={onOpenThemes}
              className="w-12 h-12 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-md shadow-indigo-500/10"
              title="Selecionar Temas"
              aria-label="Selecionar temas"
            >
              <Settings className="w-6 h-6 animate-spin-slow" />
            </button>
          </div>
        </div>

        {/* Selected Theme Quick Badge */}
        <div
          onClick={onOpenThemes}
          className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/15 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{currentTheme.emoji}</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tema {isTwinMode ? 'Inicial da Conexão' : 'Selecionado'}
              </span>
              <span className="text-xs font-bold text-white">{currentTheme.name}</span>
            </div>
          </div>
          <span className="text-xs text-indigo-400 font-semibold">Alterar ⚙️</span>
        </div>
      </div>

      {/* Middle: Online Players List */}
      <div className="glass-panel rounded-3xl p-5 flex-1 flex flex-col min-h-[220px] mb-4 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Jogadores Conectados</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-xs font-bold text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-online" />
            <span>{playerCount} online</span>
          </div>
        </div>

        {/* Player Cards */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1" id="players-list-container">
          {roomState.players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                player.isCurrent
                  ? 'bg-cyan-500/10 border-cyan-400/40 shadow-sm'
                  : 'bg-slate-900/50 border-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                    <span>{player.name}</span>
                    {player.isHost && (
                      <span className="flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md font-semibold border border-amber-500/30">
                        <Crown className="w-3 h-3" /> Líder
                      </span>
                    )}
                    {player.isCurrent && (
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-md font-semibold border border-cyan-500/30">
                        Você
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Conectado</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {playerCount < minPlayers && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-xs text-amber-300/90 font-medium">
            {isTwinMode
              ? `Aguardando 2º jogador entrar na sala (${playerCount}/2).`
              : `Mínimo de 3 jogadores online para iniciar (${playerCount}/3).`}
          </div>
        )}
      </div>

      {/* Bottom: Centralized JOGAR Button */}
      <div className="space-y-2.5">
        <button
          id="btn-start-game"
          onClick={onStartGame}
          disabled={startingGame || !canStart}
          className={`w-full py-4 px-6 rounded-2xl text-white font-black text-lg tracking-wide shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            isTwinMode
              ? 'bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500 shadow-purple-500/30'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 shadow-teal-500/30'
          }`}
        >
          <Play className="w-6 h-6 fill-white" />
          <span>{startingGame ? 'Preparando...' : isTwinMode ? 'Iniciar Conexão' : 'Jogar'}</span>
        </button>

        <div className="flex justify-center">
          <button
            id="btn-leave-room"
            onClick={onLeaveRoom}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors py-1 px-3 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da Sala</span>
          </button>
        </div>
      </div>
    </div>
  );
};
