
import React, { useState } from 'react';
import { WordToken } from '../types';
import { POS_COLORS } from '../constants';

interface TokenProps {
  token: WordToken;
}

const Token: React.FC<TokenProps> = ({ token }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span 
      className="relative inline-block group cursor-default transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`
        ${POS_COLORS[token.pos]} 
        ${token.isPhrase ? 'bg-amber-50/50 border-b-2 border-amber-200/50 px-0.5 rounded-sm' : ''}
        transition-colors duration-200
      `}>
        {token.text}
      </span>
      
      {isHovered && token.explanation && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-white border border-slate-200 text-slate-700 text-[11px] p-3 rounded-lg shadow-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-slate-100">
            <span className={`font-bold uppercase tracking-wider text-[9px] ${POS_COLORS[token.pos]}`}>
              {token.pos}
            </span>
            {token.isPhrase && <span className="text-[9px] bg-amber-100 text-amber-700 px-1 rounded font-bold uppercase">Phrase</span>}
          </div>
          <p className="leading-normal font-normal">{token.explanation}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
        </div>
      )}
    </span>
  );
};

export default Token;
