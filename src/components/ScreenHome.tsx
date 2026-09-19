'use client';

import React from 'react';

interface ScreenHomeProps {
  onCreateGroup: () => void;
  onGoToEnterCode: () => void;
  loading: boolean;
}

export const ScreenHome: React.FC<ScreenHomeProps> = ({
  onCreateGroup,
  onGoToEnterCode,
  loading
}) => {
  return (
    <div className="flex-1 flex flex-col justify-center my-auto animate-in fade-in duration-300">
      <div className="bg-[#141518] rounded-[32px] p-7 sm:p-9 text-left shadow-card-dark relative overflow-hidden flex flex-col justify-between min-h-[480px]">
        {/* Subtle Tactical Grid / Espionage Watermark */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Hero Spy / Espionage Graphic */}
        <div className="relative z-10 w-full my-3 pointer-events-none select-none flex items-center justify-between">
          {/* Main Spy Agent Character Illustration */}
          <div className="relative flex items-center justify-center">
            {/* Ambient Glow */}
            <div className="absolute w-28 h-28 rounded-full bg-[#c8f560]/10 blur-xl" />

            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="relative drop-shadow-md">
              {/* Outer Tactical Radar Ring */}
              <circle cx="60" cy="60" r="54" stroke="#c8f560" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="60" cy="60" r="46" fill="#1b1d22" stroke="#2a2d35" strokeWidth="1.5" />

              {/* Spy Hat Brim */}
              <ellipse cx="60" cy="46" rx="38" ry="8" fill="#c8f560" />

              {/* Spy Fedora Crown */}
              <path
                d="M36 46C37 26 45 22 60 22C75 22 83 26 84 46H36Z"
                fill="#c8f560"
              />
              {/* Hat Ribbon */}
              <path
                d="M38 42C43 40 51 39 60 39C69 39 77 40 82 42V46H38V42Z"
                fill="#141518"
              />

              {/* Sunglasses Frame */}
              <rect x="33" y="56" width="23" height="15" rx="5" fill="#2b66ff" />
              <rect x="64" y="56" width="23" height="15" rx="5" fill="#2b66ff" />
              {/* Bridge */}
              <rect x="54" y="59" width="12" height="4" rx="2" fill="#2b66ff" />

              {/* Polarized Lenses */}
              <rect x="36" y="59" width="17" height="9" rx="3" fill="#141518" />
              <rect x="67" y="59" width="17" height="9" rx="3" fill="#141518" />

              {/* Neon Lens Reflections */}
              <path d="M38 61L44 61" stroke="#c8f560" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M69 61L75 61" stroke="#c8f560" strokeWidth="1.5" strokeLinecap="round" />

              {/* Detective Trench Coat Collar */}
              <path
                d="M32 84L48 94L60 82L72 94L88 84L95 106H25L32 84Z"
                fill="#2b66ff"
              />
              {/* Tie Accent */}
              <path d="M57 85L60 96L63 85Z" fill="#c8f560" />
            </svg>
          </div>

          {/* Right Floating Secret Dossier Badges */}
          <div className="flex flex-col items-end gap-2.5">
            {/* Fingerprint / Mystery Scanner Box */}
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative backdrop-blur-sm p-2">
              <div
                className="w-16 h-16 bg-[#c8f560]"
                style={{
                  maskImage: 'url(/digital.svg)',
                  WebkitMaskImage: 'url(/digital.svg)',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            </div>

            {/* Players Pill */}
            <div className="text-[10px] font-medium text-[#9498a4] tracking-wide">
              3 a 12 jogadores
            </div>
          </div>
        </div>

        {/* Title & Copy */}
        <div className="relative z-10 mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.15] mb-2.5">
            Descubra o <br />
            <span className="text-[#c8f560]">Infiltrado</span> na sala.
          </h1>
          <p className="text-sm text-[#9498a4] leading-relaxed">
            Todos recebem a palavra secreta, exceto o espião. Façam perguntas discretas e descubram quem está fingindo!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col gap-3">
          <button
            id="btn-create-group"
            onClick={onCreateGroup}
            disabled={loading}
            className="w-full py-4 px-6 rounded-full bg-[#c8f560] hover:bg-[#b8ec4b] text-[#141518] font-extrabold text-base transition-all active:scale-[0.98] cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Criando Sala...' : 'Criar Grupo'}
          </button>

          <button
            id="btn-join-group"
            onClick={onGoToEnterCode}
            disabled={loading}
            className="w-full py-4 px-6 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-base border border-white/10 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Entrar em um Grupo
          </button>
        </div>
      </div>
    </div>
  );
};
