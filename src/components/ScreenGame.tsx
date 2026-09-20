'use client';

import React, { useState, useEffect } from 'react';
import { ClientRoomState } from '@/lib/roomStore';
import confetti from 'canvas-confetti';
import { Eye, EyeOff } from 'lucide-react';

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
        // Ignorado se indisponível
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
        <div className="bg-[#141518] rounded-[32px] p-8 sm:p-10 w-full max-w-sm flex flex-col items-center justify-center shadow-card-dark relative overflow-hidden">
          {/* Radar spinner limpo */}
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-white/10 border-t-[#c8f560] animate-spin-clean" />
            <div className="text-2xl">🎲</div>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
            Sorteando palavra...
          </h2>
          <p className="text-xs sm:text-sm text-[#9498a4]">
            Definindo papéis secretos e preparando a rodada...
          </p>

          <div className="mt-6 px-4 py-1.5 rounded-full bg-white/10 text-xs font-mono font-bold text-[#c8f560]">
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
        <div className="bg-[#141518] rounded-[32px] p-7 sm:p-9 text-center shadow-card-dark text-white relative overflow-hidden">
          {/* Badge Neutro */}
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-[#c8f560] text-xs font-extrabold uppercase tracking-wider mb-5">
            Informação da Rodada
          </div>

          {/* Tema */}
          <div className="mb-4">
            <span className="block text-[11px] font-bold uppercase tracking-widest text-[#9498a4] mb-0.5">
              Tema da Rodada
            </span>
            <span className="text-lg font-black text-[#c8f560]">
              {roomState.themeName || 'Geral'}
            </span>
          </div>

          {/* Caixa da Palavra Secreta / Infiltrado (Estrutura idêntica) */}
          <div className="my-5 p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
            <div className="space-y-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9498a4]">
                Sua Palavra Secreta
              </span>
              <div className="py-2 min-h-[56px] flex items-center justify-center">
                {showSecret ? (
                  roomState.secretWord ? (
                    <span
                      id="secret-word-display"
                      className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white select-none"
                    >
                      {roomState.secretWord}
                    </span>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span
                        id="secret-word-display"
                        className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white select-none"
                      >
                        {(roomState.impostorCount || 1) > 1 ? 'Você é um dos Infiltrados' : 'Você é o Infiltrado'}
                      </span>
                      <span className="text-xs text-[#9498a4] font-medium">
                        Tente não ser pego!
                      </span>
                    </div>
                  )
                ) : (
                  <span className="text-2xl sm:text-3xl font-mono text-[#6b6f7b] select-none">
                    ••••••••••••
                  </span>
                )}
              </div>

              <button
                type="button"
                id="btn-toggle-secret"
                onClick={() => setShowSecret(!showSecret)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer transition-all active:scale-95"
              >
                {showSecret ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ocultar</span>
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
            <div className="mt-4 p-4 rounded-2xl bg-[#fde5cd] text-[#9a3412] text-sm font-extrabold animate-in fade-in space-y-2">
              <div>
                {roomState.impostorNames && roomState.impostorNames.length > 1
                  ? 'Os infiltrados eram: '
                  : 'O infiltrado era: '}
                <span className="underline">{roomState.impostorName}</span>!
              </div>

              {roomState.gameMode === 'undercover' && roomState.civilianWord && roomState.impostorWord && (
                <div className="pt-2 border-t border-[#9a3412]/20 text-xs font-bold text-[#9a3412] flex flex-col gap-1">
                  <div>
                    👥 Maioria: <span className="font-extrabold underline">{roomState.civilianWord}</span>
                  </div>
                  <div>
                    🕵️ Infiltrado: <span className="font-extrabold underline">{roomState.impostorWord}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ações da Rodada (Exclusivas do Líder) */}
      <div className="space-y-2.5 mt-4">
        {roomState.isHost ? (
          <>
            {roomState.status !== 'ended' && (
              <button
                id="btn-reveal-impostor"
                onClick={onRevealImpostor}
                className="w-full py-3.5 px-4 rounded-full bg-[#ff4572] hover:bg-[#fa3c6e] text-white font-extrabold text-sm transition-all active:scale-[0.98] cursor-pointer shadow-sm"
              >
                {(roomState.impostorCount || 1) > 1 ? 'Revelar Infiltrados' : 'Revelar Infiltrado'}
              </button>
            )}

            <button
              id="btn-reset-round"
              onClick={onResetRound}
              className="w-full py-4 px-6 rounded-full bg-[#c8f560] hover:bg-[#b8ec4b] text-[#141518] font-extrabold text-base transition-all active:scale-[0.98] cursor-pointer shadow-sm"
            >
              Nova Rodada / Voltar ao Lobby
            </button>
          </>
        ) : (
          <div className="w-full py-3.5 px-4 rounded-full bg-white border border-[#141518]/10 text-[#6b6f7b] font-bold text-xs text-center shadow-xs flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              {roomState.status === 'ended'
                ? 'Aguardando o líder iniciar a próxima rodada...'
                : 'Partida em andamento.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
