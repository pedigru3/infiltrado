'use client';

import React, { useState, useEffect } from 'react';
import { THEMES, Theme } from '@/data/themes';
import { Lock, ArrowLeft, X, ChevronRight, Lightbulb, ShieldAlert, Sparkles } from 'lucide-react';
import { GameMode } from '@/lib/roomStore';

interface SettingsModalProps {
  isOpen: boolean;
  selectedThemeId: string;
  impostorCount: number;
  gameMode?: GameMode;
  playerCount: number;
  onSelectTheme: (themeId: string) => void;
  onSelectImpostorCount: (count: number) => void;
  onSelectGameMode: (mode: GameMode) => void;
  onClose: () => void;
  isHost?: boolean;
  initialView?: 'menu' | 'themes';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  selectedThemeId,
  impostorCount = 1,
  gameMode = 'classic',
  playerCount = 0,
  onSelectTheme,
  onSelectImpostorCount,
  onSelectGameMode,
  onClose,
  isHost = true,
  initialView = 'menu'
}) => {
  const [view, setView] = useState<'menu' | 'themes'>(initialView);

  // Sincroniza view quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const currentTheme = THEMES.find((t) => t.id === selectedThemeId) || THEMES[0];

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[32px] bg-white p-6 sm:p-7 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-[#141518]/6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-3 border-b border-[#141518]/6 mb-3">
          <div className="flex items-center gap-2">
            {view === 'themes' && initialView === 'menu' && (
              <button
                id="btn-back-to-settings-menu"
                onClick={() => setView('menu')}
                className="w-8 h-8 rounded-full bg-[#f5f5f0] hover:bg-[#e8e8e2] flex items-center justify-center text-sm font-bold text-[#141518] transition-colors cursor-pointer mr-1"
                aria-label="Voltar para configurações"
                title="Voltar"
              >
                <ArrowLeft className="w-4 h-4 text-[#141518]" />
              </button>
            )}
            <h3 className="font-extrabold text-lg text-[#141518]">
              {view === 'menu' ? 'Configurações da Sala' : 'Escolher Tema'}
            </h3>
          </div>

          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f0] hover:bg-[#e8e8e2] flex items-center justify-center text-[#141518] transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4 text-[#141518]" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: MENU PRINCIPAL DE OPÇÕES                                          */}
        {/* ========================================================================= */}
        {view === 'menu' && (
          <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-1">
            <div className="space-y-3.5">
              {!isHost && (
                <div className="p-2.5 rounded-2xl bg-[#f5f5f0] border border-[#141518]/6 text-xs text-[#6b6f7b] font-medium flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-[#141518]/70 shrink-0" />
                  <span>Apenas o líder pode alterar as configurações.</span>
                </div>
              )}

              {/* Opção 1: Modo de Jogo */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b6f7b] mb-1.5">
                  Modo de Jogo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="btn-mode-classic"
                    disabled={!isHost}
                    onClick={() => {
                      if (isHost) onSelectGameMode('classic');
                    }}
                    className={`p-3 rounded-2xl text-left flex flex-col justify-between transition-all ${
                      gameMode === 'classic'
                        ? 'bg-[#141518] text-white shadow-md ring-2 ring-[#c8f560]/40'
                        : 'bg-[#f5f5f0] text-[#141518] hover:bg-[#eaeae4]'
                    } ${!isHost ? 'cursor-default opacity-80' : 'cursor-pointer active:scale-95'}`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-black">Clássico</span>
                      <ShieldAlert className={`w-3.5 h-3.5 ${gameMode === 'classic' ? 'text-[#c8f560]' : 'text-[#6b6f7b]'}`} />
                    </div>
                    <span className={`text-[10px] leading-tight ${gameMode === 'classic' ? 'text-[#9498a4]' : 'text-[#6b6f7b]'}`}>
                      Infiltrado não tem palavra e precisa blefar.
                    </span>
                  </button>

                  <button
                    id="btn-mode-undercover"
                    disabled={!isHost}
                    onClick={() => {
                      if (isHost) onSelectGameMode('undercover');
                    }}
                    className={`p-3 rounded-2xl text-left flex flex-col justify-between transition-all ${
                      gameMode === 'undercover'
                        ? 'bg-[#141518] text-white shadow-md ring-2 ring-[#c8f560]/40'
                        : 'bg-[#f5f5f0] text-[#141518] hover:bg-[#eaeae4]'
                    } ${!isHost ? 'cursor-default opacity-80' : 'cursor-pointer active:scale-95'}`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-black">Avançado</span>
                      <Sparkles className={`w-3.5 h-3.5 ${gameMode === 'undercover' ? 'text-[#c8f560]' : 'text-[#6b6f7b]'}`} />
                    </div>
                    <span className={`text-[10px] leading-tight ${gameMode === 'undercover' ? 'text-[#9498a4]' : 'text-[#6b6f7b]'}`}>
                      Infiltrado recebe palavra similar sem saber.
                    </span>
                  </button>
                </div>
              </div>

              {/* Opção 2: Trocar Tema */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b6f7b] mb-1.5">
                  Tema das Palavras
                </label>
                <button
                  id="btn-nav-to-themes"
                  onClick={() => setView('themes')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#f5f5f0] hover:bg-[#eaeae4] transition-all cursor-pointer text-left group border border-transparent hover:border-[#141518]/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                      {currentTheme.emoji}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-[#141518] flex items-center gap-1.5">
                        <span>{currentTheme.name}</span>
                      </div>
                      <div className="text-xs text-[#6b6f7b] truncate max-w-[170px] sm:max-w-[190px]">
                        {currentTheme.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-xs font-extrabold text-[#141518] shadow-xs group-hover:bg-[#c8f560] transition-colors">
                    <span>Trocar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>

              {/* Opção 3: Quantidade de Infiltrados */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b6f7b]">
                    Quantidade de Infiltrados
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((count) => {
                    const isSelected = impostorCount === count;
                    return (
                      <button
                        key={count}
                        id={`btn-impostor-count-${count}`}
                        disabled={!isHost}
                        onClick={() => {
                          if (isHost) onSelectImpostorCount(count);
                        }}
                        className={`py-2.5 px-2 rounded-2xl text-center flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#141518] text-[#c8f560] shadow-md ring-2 ring-[#c8f560]/30 font-black'
                            : 'bg-[#f5f5f0] text-[#141518] hover:bg-[#eaeae4] font-bold'
                        } ${!isHost ? 'cursor-default opacity-80' : 'cursor-pointer active:scale-95'}`}
                      >
                        <span className="text-base font-black">{count}</span>
                        <span className="text-[10px] uppercase tracking-wider opacity-80">
                          {count === 1 ? 'Infiltrado' : 'Infiltrados'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Dica de equilíbrio recomendada */}
                <div className="mt-2 px-3 py-1.5 rounded-xl bg-[#f5f5f0]/80 text-[11px] text-[#6b6f7b] leading-tight flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    {playerCount < 6 ? (
                      <span>Recomendado: <strong>1 infiltrado</strong> para até 5 jogadores.</span>
                    ) : playerCount < 8 ? (
                      <span>Recomendado: <strong>2 infiltrados</strong> para 6 ou mais jogadores.</span>
                    ) : (
                      <span>Recomendado: <strong>2 ou 3 infiltrados</strong> para grupos grandes (8+ jogadores).</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-[#141518]/6">
              <button
                id="btn-close-settings"
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-full bg-[#141518] hover:bg-[#23252b] text-[#c8f560] font-extrabold text-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                Pronto
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: LISTA DE TEMAS                                                    */}
        {/* ========================================================================= */}
        {view === 'themes' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <p className="text-xs text-[#6b6f7b] mb-3">
              {isHost
                ? 'Selecione uma categoria para as palavras da rodada:'
                : 'Tema atualmente configurado pelo líder:'}
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-4">
              {THEMES.map((theme: Theme) => {
                const isSelected = theme.id === selectedThemeId;
                return (
                  <button
                    key={theme.id}
                    id={`theme-option-${theme.id}`}
                    disabled={!isHost}
                    onClick={() => {
                      if (isHost) onSelectTheme(theme.id);
                    }}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all ${
                      isSelected
                        ? 'bg-[#c8f560] text-[#141518] shadow-sm font-bold'
                        : 'bg-[#f5f5f0] text-[#141518] hover:bg-[#eaeae4]'
                    } ${!isHost ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}`}
                  >
                    <div className="text-2xl w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                      {theme.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-sm flex items-center gap-2">
                        {theme.name}
                        {isSelected && (
                          <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">
                            Ativo
                          </span>
                        )}
                      </div>
                      <div className="text-xs opacity-75 truncate mt-0.5">
                        {theme.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              id="btn-confirm-theme"
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-full bg-[#141518] hover:bg-[#23252b] text-[#c8f560] font-extrabold text-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              Confirmar Tema
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
