'use client';

import React from 'react';
import { THEMES, Theme } from '@/data/themes';
import { X, Check, Sparkles, SlidersHorizontal } from 'lucide-react';

interface ThemeModalProps {
  isOpen: boolean;
  selectedThemeId: string;
  onSelectTheme: (themeId: string) => void;
  onClose: () => void;
  isHost?: boolean;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  selectedThemeId,
  onSelectTheme,
  onClose,
  isHost = true
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="theme-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-slate-900/95 border border-white/15 p-6 shadow-2xl shadow-cyan-950/40 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-white">Temas de Palavras</h3>
          </div>
          <button
            id="btn-close-theme-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          {isHost
            ? 'Escolha uma categoria para as palavras secretas sorteadas na rodada:'
            : 'Tema atualmente configurado pelo criador da sala:'}
        </p>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mb-4">
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
                className={`w-full flex items-center gap-3.5 p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-400/80 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/70 hover:border-white/15'
                } ${!isHost ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}`}
              >
                <div className="text-2xl w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                  {theme.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    {theme.name}
                    {isSelected && (
                      <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded font-semibold">
                        Ativo
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 truncate mt-0.5">
                    {theme.description}
                  </div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-cyan-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        <button
          id="btn-confirm-theme"
          onClick={onClose}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};
