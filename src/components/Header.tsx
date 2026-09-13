'use client';

import React from 'react';
import { Eye, Sparkles } from 'lucide-react';

interface HeaderProps {
  onBackHome?: () => void;
  showHomeBtn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onBackHome, showHomeBtn }) => {
  return (
    <header className="flex items-center justify-between pb-3 mb-6 border-b border-white/10 select-none">
      <div
        id="btn-brand-home"
        onClick={showHomeBtn ? onBackHome : undefined}
        className={`flex items-center gap-2.5 ${
          showHomeBtn ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
        }`}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/15 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/10">
          <Eye className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            INFILTRADO
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>Mobile Party</span>
      </div>
    </header>
  );
};
