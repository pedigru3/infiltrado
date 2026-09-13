'use client';

import React, { useState, useEffect } from 'react';
import { ClientRoomState } from '@/lib/roomStore';
import { Eye, EyeOff, ShieldAlert, Sparkles, RotateCcw, HelpCircle, Trophy, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScreenGameProps {
  roomState: ClientRoomState;
  onResetRound: () => void;
  onRevealImpostor: () => void;
  isHost: boolean;
}

export const ScreenGame: React.FC<ScreenGameProps> = ({
  roomState,
  onResetRound,
  onRevealImpostor,
}) => {
  const [isDrawing, setIsDrawing] = useState(true);
  const [showSecret, setShowSecret] = useState(true);
  const [drawingSecondsLeft, setDrawingSecondsLeft] = useState(3);

  const isImpostor = roomState.myRole === 'impostor';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDrawing(false);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // Ignorado se não disponível
      }
    }, 3200);

    const interval = setInterval(() => {
      setDrawingSecondsLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // 1. Fase de Sorteio (Animação de Suspense)
  if (isDrawing) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-center my-auto animate-in fade-in duration-300">
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-10 w-full max-w-sm flex flex-col items-center justify-center relative overflow-hidden">
          {/* Radar spinner animado */}
          <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-indigo-500 animate-spin-fast" />
            <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-rose-500 border-l-purple-500 animate-spin-reverse" />
            <div className="text-3xl animate-pulse-slow">🎲</div>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Sorteando palavra...
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Definindo papéis secretos e preparando a rodada...
          </p>

          <div className="mt-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
            <span>Aguarde {drawingSecondsLeft}s</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Fase de Revelação do Papel (Design 100% idêntico para não chamar atenção)
  return (
    <div className="flex-1 flex flex-col justify-between animate-in zoom-in-95 duration-300">
      <div className="flex-1 flex flex-col justify-center my-auto">
        <div className="rounded-3xl p-6 sm:p-8 text-center bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-2 border-cyan-400/40 shadow-2xl shadow-cyan-950/40 transition-all">
          {/* Badge Neutro Idêntico */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-5 shadow-md">
            <span className="flex items-center gap-1.5 text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 px-3.5 py-1 rounded-full">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Informação da Rodada
            </span>
          </div>

          {/* Tema */}
          <div className="mb-4">
            <span className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">
              Tema da Rodada
            </span>
            <span className="text-base font-black text-cyan-300">
              {roomState.themeName || 'Geral'}
            </span>
          </div>

          {/* Caixa da Palavra Secreta / Infiltrado (Estrutura idêntica) */}
          <div className="my-5 p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/10 relative overflow-hidden">
            <div className="space-y-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sua Palavra Secreta
              </span>
              <div className="py-2 min-h-[56px] flex items-center justify-center">
                {showSecret ? (
                  isImpostor ? (
                    <div className="flex flex-col items-center gap-1">
                      <span
                        id="secret-word-display"
                        className="text-2xl sm:text-3xl font-black tracking-tight text-white select-none drop-shadow-md"
                      >
                        Você é o Infiltrado
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Tente não ser pego!
                      </span>
                    </div>
                  ) : (
                    <span
                      id="secret-word-display"
                      className="text-3xl sm:text-4xl font-black tracking-tight text-white select-none drop-shadow-md"
                    >
                      {roomState.secretWord}
                    </span>
                  )
                ) : (
                  <span className="text-2xl sm:text-3xl font-mono text-slate-600 select-none">
                    ••••••••••••
                  </span>
                )}
              </div>

              <button
                type="button"
                id="btn-toggle-secret"
                onClick={() => setShowSecret(!showSecret)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 cursor-pointer transition-all active:scale-95"
              >
                {showSecret ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ocultar para não espiarem</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Mostrar Palavra</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Se a rodada foi finalizada e revelada */}
          {roomState.status === 'ended' && roomState.impostorName && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-sm font-bold animate-in fade-in">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Revelação Final</span>
              </div>
              <div>
                O infiltrado era: <span className="text-white underline">{roomState.impostorName}</span>!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ações da Rodada */}
      <div className="space-y-2.5 mt-4">
        {roomState.status !== 'ended' && (
          <button
            id="btn-reveal-impostor"
            onClick={onRevealImpostor}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-sm shadow-md shadow-rose-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Revelar Infiltrado</span>
          </button>
        )}

        <button
          id="btn-reset-round"
          onClick={onResetRound}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Voltar ao Lobby / Nova Rodada</span>
        </button>
      </div>
    </div>
  );
};
