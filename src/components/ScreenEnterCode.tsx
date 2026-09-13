'use client';

import React, { useState } from 'react';
import { ArrowLeft, KeyRound, ArrowRight } from 'lucide-react';

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
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative">
        <button
          id="btn-back-to-home"
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer mb-4"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/10">
            <KeyRound className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-1.5">
            Código do Grupo
          </h2>
          <p className="text-xs sm:text-sm text-slate-300/80">
            Insira o código de 4 caracteres fornecido pelo líder do grupo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="group-code-input"
              className="block text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2"
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
              className="w-full py-3.5 px-4 bg-slate-950/80 border-2 border-white/15 focus:border-cyan-400 rounded-2xl text-center text-3xl font-black tracking-[0.3em] text-cyan-300 placeholder:text-slate-700 outline-none transition-all shadow-inner"
            />
          </div>

          {errorMessage && (
            <div
              id="code-error-msg"
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center animate-in shake"
            >
              {errorMessage}
            </div>
          )}

          <button
            id="btn-submit-code"
            type="submit"
            disabled={loading || code.trim().length < 3}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-base shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Verificando Sala...' : 'Avançar'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
