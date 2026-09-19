'use client';

import React from 'react';
import { THEMES, Theme } from '@/data/themes';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[32px] bg-white p-6 sm:p-7 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-[#141518]/6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#141518]/6 mb-3">
          <h3 className="font-extrabold text-lg text-[#141518]">Escolher Tema</h3>
          <button
            id="btn-close-theme-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f0] hover:bg-[#e8e8e2] flex items-center justify-center text-xs font-extrabold text-[#141518] transition-colors"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-[#6b6f7b] mb-4">
          {isHost
            ? 'Escolha a categoria das palavras secretas:'
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
                className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition-all ${
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
          className="w-full py-4 px-4 rounded-full bg-[#141518] hover:bg-[#23252b] text-[#c8f560] font-extrabold text-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          Confirmar Tema
        </button>
      </div>
    </div>
  );
};
