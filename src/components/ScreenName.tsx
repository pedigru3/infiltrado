'use client';

import React, { useState } from 'react';
import { ArrowLeft, UserCircle2, ArrowRight, Play, LogIn } from 'lucide-react';

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

  // Botão Iniciar se for quem criou o grupo, ou Entrar se for convidado
  const buttonText = isHost ? 'Iniciar' : 'Entrar';

  return (
    <div className="flex-1 flex flex-col justify-center my-auto animate-in fade-in duration-300">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative">
        <button
          id="btn-back-from-name"
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer mb-4"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-md shadow-indigo-500/10">
            <UserCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-1.5">
            {isHost ? 'Criando Grupo' : `Entrando no Grupo`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300/80">
            {isHost
              ? 'Defina seu apelido para assumir a liderança da sala'
              : `Sala conectada: ${roomCode}`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="user-name-input"
              className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2"
            >
              insira o seu nome
            </label>
            <input
              id="user-name-input"
              type="text"
              maxLength={20}
              placeholder="Digite seu nome..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              autoComplete="name"
              required
              className="w-full py-4 px-5 bg-slate-950/80 border-2 border-white/15 focus:border-cyan-400 rounded-2xl text-base font-bold text-white placeholder:text-slate-600 outline-none transition-all shadow-inner"
            />
          </div>

          {errorMessage && (
            <div
              id="name-error-msg"
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center animate-in shake"
            >
              {errorMessage}
            </div>
          )}

          <button
            id="btn-submit-name"
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-base shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isHost ? <Play className="w-5 h-5 fill-white" /> : <LogIn className="w-5 h-5" />}
            <span>{loading ? 'Entrando...' : buttonText}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
