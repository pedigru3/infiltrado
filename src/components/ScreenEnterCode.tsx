'use client';

import React, { useState } from 'react';

interface ScreenEnterCodeProps {
  onBack: () => void;
  onSubmitCode: (code: string) => void;
  loading: boolean;
  errorMessage?: string | null;
}

export const ScreenEnterCode: React.FC<ScreenEnterCodeProps> = ({
  onBack,
  onSubmitCode,
  loading,
  errorMessage
}) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length >= 3) {
      onSubmitCode(code.trim().toUpperCase());
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center my-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] p-7 sm:p-8 shadow-soft border border-[#141518]/6">
        <button
          id="btn-back-to-home"
          onClick={onBack}
          className="text-xs font-bold text-[#6b6f7b] hover:text-[#141518] transition-colors cursor-pointer mb-5 flex items-center gap-1.5"
          aria-label="Voltar"
        >
          <span>← Voltar</span>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#141518] tracking-tight mb-1.5">
            Código do Grupo
          </h2>
          <p className="text-xs sm:text-sm text-[#6b6f7b]">
            Digite o código de 4 letras compartilhado pelo criador da sala.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="group-code-input"
              className="block text-xs font-bold text-[#6b6f7b] uppercase tracking-wider mb-2"
            >
              Código da Sala
            </label>
            <input
              id="group-code-input"
              type="text"
              maxLength={6}
              placeholder="ABCD"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              autoFocus
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck="false"
              required
              className="w-full py-4 px-4 bg-[#f5f5f0] border-2 border-transparent focus:border-[#141518] focus:bg-white rounded-2xl text-center text-3xl font-black tracking-[0.25em] text-[#141518] placeholder:text-[#a0a4b0] outline-none transition-all"
            />
          </div>

          {errorMessage && (
            <div
              id="code-error-msg"
              className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center"
            >
              {errorMessage}
            </div>
          )}

          <button
            id="btn-submit-code"
            type="submit"
            disabled={loading || code.trim().length < 3}
            className="w-full py-4 px-6 rounded-full bg-[#141518] hover:bg-[#23252b] text-[#c8f560] font-extrabold text-base transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Avançar'}
          </button>
        </form>
      </div>
    </div>
  );
};
