'use client';

import React from 'react';

interface HeaderProps {
  onBackHome?: () => void;
  showHomeBtn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onBackHome, showHomeBtn }) => {
  return (
    <header className="flex items-center justify-between pb-3 mb-4 select-none">
      <div
        id="btn-brand-home"
        onClick={showHomeBtn ? onBackHome : undefined}
        className={`flex items-center gap-2 ${
          showHomeBtn ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#c8f560] border border-[#141518]/20" />
        <span className="font-extrabold text-lg tracking-tight text-[#141518]">
          infiltrado
        </span>
      </div>

      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#141518]/8 text-[11px] font-bold text-[#6b6f7b] tracking-wider uppercase shadow-xs">
        <span>Party Game</span>
      </div>
    </header>
  );
};
