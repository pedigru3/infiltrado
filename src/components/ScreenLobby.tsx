'use client';

import React, { useState } from 'react';
import { ClientRoomState } from '@/lib/roomStore';
import { THEMES } from '@/data/themes';

interface ScreenLobbyProps {
  roomState: ClientRoomState;
  onOpenThemes: () => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  startingGame: boolean;
}

const AVATAR_COLORS = [
  'bg-[#141518] text-white', // Carvão
  'bg-[#fde5cd] text-[#9a3412]', // Pêssego
  'bg-[#c8f560] text-[#141518]', // Lima
  'bg-[#e2e8f0] text-[#334155]', // Slate Neutro
  'bg-[#fce7f3] text-[#9d174d]', // Rosa Suave
];

export const ScreenLobby: React.FC<ScreenLobbyProps> = ({
  roomState,
  onOpenThemes,
  onStartGame,
  onLeaveRoom,
  startingGame
}) => {
  const [copied, setCopied] = useState(false);

  const currentTheme = THEMES.find((t) => t.id === roomState.selectedThemeId) || THEMES[0];
  const playerCount = roomState.players.length;
  const canStart = playerCount >= 3;

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
      {/* Top Header & Code Card */}
      <div className="space-y-3 mb-4">
        {/* Dark Hero Card inspired by the reference balance card */}
        <div className="bg-[#141518] rounded-[28px] p-5 shadow-card-dark flex items-center justify-between text-white relative overflow-hidden">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#9498a4]">
              Código da Sala
            </span>
            <div className="flex items-center gap-2.5 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-white">
                {roomState.code}
              </span>
              <button
                id="btn-copy-code"
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-[#c8f560] transition-all cursor-pointer active:scale-95"
                title="Copiar código"
                aria-label="Copiar código do grupo"
              >
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Right side: Gear button for themes */}
          <button
            id="btn-open-themes"
            onClick={onOpenThemes}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg text-white transition-all cursor-pointer active:scale-95"
            title="Selecionar Temas"
            aria-label="Selecionar temas"
          >
            ⚙️
          </button>
        </div>

        {/* Selected Theme Badge */}
        <div
          onClick={onOpenThemes}
          className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#141518]/8 text-[#141518] cursor-pointer hover:border-[#141518]/20 transition-all shadow-xs"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentTheme.emoji}</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b6f7b]">
                Tema Selecionado
              </span>
              <span className="text-sm font-extrabold text-[#141518]">{currentTheme.name}</span>
            </div>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#f5f5f0] text-[#141518] hover:bg-[#141518] hover:text-[#c8f560] transition-colors">
            Trocar
          </span>
        </div>
      </div>

      {/* Middle: Online Players List */}
      <div className="bg-white rounded-[28px] p-5 shadow-soft border border-[#141518]/6 flex-1 flex flex-col min-h-[220px] mb-4 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#141518]/6 mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6b6f7b]">
            Jogadores Conectados
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f5f5f0] text-xs font-bold text-[#141518]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            <span>{playerCount} online</span>
          </div>
        </div>

        {/* Player Cards */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1" id="players-list-container">
          {roomState.players.map((player, index) => {
            const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  player.isCurrent
                    ? 'bg-[#f5f5f0] border-[#141518]/15'
                    : 'bg-white border-[#141518]/6'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm ${avatarColor}`}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-[#141518]">
                      <span>{player.name}</span>
                      {player.isHost && (
                        <span className="text-[10px] bg-[#c8f560] text-black px-2 py-0.5 rounded-full font-bold">
                          Líder
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {playerCount < 3 && (
          <div className="mt-3 p-3 rounded-2xl bg-[#f5f5f0] text-[#6b6f7b] text-center text-xs font-bold">
            Necessário 3 jogadores para iniciar ({playerCount}/3).
          </div>
        )}
      </div>

      {/* Bottom: Centralized JOGAR Button (Líder) ou Aguardando (Demais) */}
      <div className="space-y-2">
        {roomState.isHost ? (
          <button
            id="btn-start-game"
            onClick={onStartGame}
            disabled={startingGame || !canStart}
            className="w-full py-4 px-6 rounded-full bg-[#c8f560] hover:bg-[#b8ec4b] text-[#141518] font-black text-lg tracking-wide shadow-sm transition-all active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {startingGame ? 'Preparando...' : 'Jogar'}
          </button>
        ) : (
          <div className="w-full py-4 px-6 rounded-full bg-white border border-[#141518]/10 text-[#6b6f7b] font-bold text-sm text-center shadow-xs flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Aguardando o líder iniciar o jogo...</span>
          </div>
        )}

        <div className="flex justify-center">
          <button
            id="btn-leave-room"
            onClick={onLeaveRoom}
            className="text-xs font-bold text-[#6b6f7b] hover:text-rose-600 transition-colors py-1.5 px-4 cursor-pointer"
          >
            Sair do Grupo
          </button>
        </div>
      </div>
    </div>
  );
};
