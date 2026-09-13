'use client';

import React, { useState } from 'react';
import { PlusCircle, LogIn, Users, ShieldAlert, HeartHandshake, Sparkles } from 'lucide-react';
import { GameMode } from '@/lib/roomStore';

interface ScreenHomeProps {
  onCreateGroup: (mode: GameMode) => void;
  onGoToEnterCode: () => void;
  loading: boolean;
}

export const ScreenHome: React.FC<ScreenHomeProps> = ({
  onCreateGroup,
  onGoToEnterCode,
  loading
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('infiltrado');

  return (
    <div className="flex-1 flex flex-col justify-center my-auto animate-in fade-in duration-300">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-black/40 border border-white/10 mb-6">
          <button
            id="tab-mode-infiltrado"
            type="button"
            onClick={() => setSelectedMode('infiltrado')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedMode === 'infiltrado'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Infiltrado (3+)</span>
          </button>

          <button
            id="tab-mode-twin"
            type="button"
            onClick={() => setSelectedMode('twin')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedMode === 'twin'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Palavra Gêmea (2)</span>
          </button>
        </div>

        {selectedMode === 'infiltrado' ? (
          <>
            <div className="w-18 h-18 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/10">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Jogo do Infiltrado
            </h1>
            <p className="text-sm text-slate-300/80 mb-7 leading-relaxed max-w-xs mx-auto">
              Um dos jogadores é o impostor e não sabe a palavra secreta. Façam perguntas e descubram quem é!
            </p>
          </>
        ) : (
          <>
            <div className="w-18 h-18 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-cyan-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-lg shadow-purple-500/10">
              <HeartHandshake className="w-9 h-9" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Palavra Gêmea
            </h1>
            <p className="text-sm text-slate-300/80 mb-7 leading-relaxed max-w-xs mx-auto">
              Modo Dupla! Digitem palavras e tentem conectar pensamentos até falarem exatamente o mesmo termo.
            </p>
          </>
        )}

        <div className="flex flex-col gap-3.5">
          <button
            id="btn-create-group"
            onClick={() => onCreateGroup(selectedMode)}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl text-white font-extrabold text-base shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedMode === 'infiltrado'
                ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-cyan-500/30'
                : 'bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500 shadow-purple-500/30'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>
              {loading
                ? 'Criando Sala...'
                : selectedMode === 'infiltrado'
                ? 'Criar Grupo (Infiltrado)'
                : 'Criar Sala (Dupla)'}
            </span>
          </button>

          <button
            id="btn-join-group"
            onClick={onGoToEnterCode}
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-white font-bold text-base active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn className="w-5 h-5 text-cyan-400" />
            <span>Entrar com Código</span>
          </button>
        </div>

        <div className="mt-7 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>
            {selectedMode === 'infiltrado'
              ? 'Recomendado para 3 a 12 jogadores'
              : 'Perfeito para 2 pessoas'}
          </span>
        </div>
      </div>
    </div>
  );
};
