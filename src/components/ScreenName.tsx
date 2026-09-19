'use client';

import React, { useState } from 'react';

interface ScreenNameProps {
  isHost: boolean;
  roomCode: string;
  onBack: () => void;
  onSubmitName: (name: string) => void;
  loading: boolean;
  errorMessage?: string | null;
}

export const ScreenName: React.FC<ScreenNameProps> = ({
  isHost,
  roomCode,
  onBack,
  onSubmitName,
  loading,
  errorMessage
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmitName(name.trim());
    }
  };

  const buttonText = isHost ? 'Iniciar Sala' : 'Entrar na Sala';

  return (
    <div className="flex-1 flex flex-col justify-center my-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] p-7 sm:p-8 shadow-soft border border-[#141518]/6">
        <button
          id="btn-back-from-name"
          onClick={onBack}
          className="text-xs font-bold text-[#6b6f7b] hover:text-[#141518] transition-colors cursor-pointer mb-5 flex items-center gap-1.5"
          aria-label="Voltar"
        >
          <span>← Voltar</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="user-name-input"
              className="block text-2xl font-bold tracking-wider mb-2"
            >
              Insira o seu nome
            </label>
            <input
              id="user-name-input"
              type="text"
              maxLength={20}
              placeholder="Digite seu apelido..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              autoComplete="name"
              required
              className="w-full py-4 px-5 bg-[#f5f5f0] border-2 border-transparent focus:border-[#141518] focus:bg-white rounded-2xl text-base font-bold text-[#141518] placeholder:text-[#a0a4b0] outline-none transition-all"
            />
          </div>

          {errorMessage && (
            <div
              id="name-error-msg"
              className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center"
            >
              {errorMessage}
            </div>
          )}

          <button
            id="btn-submit-name"
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-4 px-6 rounded-full bg-[#c8f560] hover:bg-[#b8ec4b] text-[#141518] font-extrabold text-base transition-all active:scale-[0.98] cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Conectando...' : buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};
