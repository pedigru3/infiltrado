'use client';

import React, { useState, useEffect } from 'react';
import { ClientRoomState } from '@/lib/roomStore';
import { Sparkles, Send, CheckCircle2, Clock, Trophy, ArrowRight, RotateCcw, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScreenTwinGameProps {
  roomState: ClientRoomState;
  onSubmitWord: (word: string) => void;
  onNextRound: () => void;
  onResetGame: () => void;
  submitting: boolean;
}

export const ScreenTwinGame: React.FC<ScreenTwinGameProps> = ({
  roomState,
  onSubmitWord,
  onNextRound,
  onResetGame,
  submitting
}) => {
  const [wordInput, setWordInput] = useState('');

  const isMatched = roomState.status === 'twin_matched';
  const isRevealed = roomState.status === 'twin_revealed' || isMatched;
  const isWaiting = roomState.status === 'twin_playing';

  // Trigger confetti upon match
  useEffect(() => {
    if (isMatched) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }
    }
  }, [isMatched]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wordInput.trim()) {
      onSubmitWord(wordInput.trim());
      setWordInput('');
    }
  };

  // Get previous round words for the prompt (if round > 1)
  const lastHistory =
    roomState.twinHistory.length > 0
      ? roomState.twinHistory[roomState.twinHistory.length - 1]
      : null;

  return (
    <div className="flex-1 flex flex-col justify-between animate-in zoom-in-95 duration-300">
      <div className="flex-1 flex flex-col justify-center my-auto space-y-4">
        {/* Header da Rodada */}
        <div className="rounded-3xl p-6 sm:p-7 text-center bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-2 border-indigo-500/40 shadow-2xl shadow-indigo-950/40 relative overflow-hidden">
          {/* Badge da Rodada */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 shadow-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
            <HeartHandshake className="w-4 h-4 text-indigo-400" />
            <span>Palavra Gêmea • Rodada #{roomState.twinRound}</span>
          </div>

          {/* Prompt do Desafio */}
          {roomState.twinRound === 1 ? (
            <div className="mb-4">
              <span className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                Tema Inicial da Conexão
              </span>
              <span className="text-xl sm:text-2xl font-black text-cyan-300">
                {roomState.twinInitialPrompt || 'Tema Geral'}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Pense em uma palavra marcante deste tema. Seu parceiro tentará pensar na mesma!
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <span className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Conectem as duas palavras da rodada anterior:
              </span>
              {lastHistory && (
                <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
                  <span className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-extrabold text-sm sm:text-base">
                    {lastHistory.p1Word}
                  </span>
                  <span className="text-xs font-bold text-slate-500">+</span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-200 font-extrabold text-sm sm:text-base">
                    {lastHistory.p2Word}
                  </span>
                </div>
              )}
              <p className="text-xs text-slate-400">
                Pensem em uma palavra que sirva de elo entre as duas!
              </p>
            </div>
          )}

          {/* FASE 1: DIGITANDO OU AGUARDANDO PARCEIRO */}
          {isWaiting && (
            <div className="my-4 p-5 rounded-2xl bg-black/40 border border-white/10">
              {!roomState.twinSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="twin-word-input" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Sua Palavra Secreta
                    </label>
                    <input
                      id="twin-word-input"
                      type="text"
                      maxLength={25}
                      placeholder="Digite o que veio à sua mente..."
                      value={wordInput}
                      onChange={(e) => setWordInput(e.target.value)}
                      autoFocus
                      autoComplete="off"
                      required
                      className="w-full py-3.5 px-4 bg-slate-950/80 border-2 border-white/15 focus:border-indigo-400 rounded-2xl text-center text-lg font-black text-white placeholder:text-slate-600 outline-none transition-all shadow-inner"
                    />
                  </div>

                  <button
                    id="btn-submit-twin-word"
                    type="submit"
                    disabled={submitting || !wordInput.trim()}
                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Enviando...' : 'Confirmar Palavra'}</span>
                  </button>
                </form>
              ) : (
                <div className="py-4 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="font-extrabold text-base text-emerald-300">
                    Palavra enviada com sucesso!
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Clock className="w-4 h-4 animate-spin-slow text-indigo-400" />
                    <span>
                      {roomState.twinPartnerSubmitted
                        ? 'Revelando palavras...'
                        : 'Aguardando seu parceiro(a) digitar...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FASE 2: PALAVRAS REVELADAS OU VITÓRIA */}
          {isRevealed && roomState.twinCurrentWords && (
            <div className="my-4 space-y-4">
              {isMatched ? (
                /* VITÓRIA - SINTONIA MENTAL */
                <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-500/20 to-emerald-500/10 border-2 border-amber-400/60 shadow-xl space-y-2 animate-in zoom-in-95">
                  <div className="flex items-center justify-center gap-2 text-amber-300 font-extrabold text-sm uppercase tracking-wider">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>Sintonia Mental Perfeita!</span>
                  </div>
                  <div className="text-xs text-slate-300">Vocês pensaram exatamente no mesmo termo:</div>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-wide py-2 drop-shadow-lg">
                    {roomState.twinCurrentWords.p1Word}
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold border border-amber-400/40">
                    Conquistado em {roomState.twinRound} {roomState.twinRound === 1 ? 'rodada' : 'rodadas'}! 🎉
                  </div>
                </div>
              ) : (
                /* QUASE - PALAVRAS DIFERENTES */
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 animate-in fade-in">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Palavras desta Rodada
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex flex-col items-center">
                      <span className="text-[10px] text-cyan-300 font-bold truncate max-w-[120px]">
                        {roomState.twinCurrentWords.p1Name}
                      </span>
                      <span className="text-base sm:text-lg font-black text-white mt-0.5">
                        {roomState.twinCurrentWords.p1Word}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/30 flex flex-col items-center">
                      <span className="text-[10px] text-purple-300 font-bold truncate max-w-[120px]">
                        {roomState.twinCurrentWords.p2Name}
                      </span>
                      <span className="text-base sm:text-lg font-black text-white mt-0.5">
                        {roomState.twinCurrentWords.p2Word}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-medium">
                    Palavras diferentes! Na próxima rodada, tentem conectar essas duas palavras.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Histórico da Jornada */}
          {roomState.twinHistory.length > 0 && (
            <div className="pt-2 text-left">
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 text-center">
                Histórico de Conexões
              </span>
              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                {roomState.twinHistory.map((item) => (
                  <div
                    key={item.round}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                      item.matched
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
                        : 'bg-white/5 border border-white/5 text-slate-300'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-slate-400 font-bold">
                      #{item.round}
                    </span>
                    <div className="flex items-center gap-2 font-bold">
                      <span className="text-cyan-300">{item.p1Word}</span>
                      <span className="text-slate-500">↔</span>
                      <span className="text-purple-300">{item.p2Word}</span>
                    </div>
                    <span>{item.matched ? '🎯 Bateu!' : '❌'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ações Inferiores */}
      <div className="space-y-2.5 mt-4">
        {isRevealed && !isMatched && (
          <button
            id="btn-next-twin-round"
            onClick={onNextRound}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white font-extrabold text-base shadow-xl shadow-indigo-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Próxima Rodada (#{roomState.twinRound + 1})</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        <button
          id="btn-reset-twin"
          onClick={onResetGame}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Voltar ao Lobby / Novo Jogo</span>
        </button>
      </div>
    </div>
  );
};
