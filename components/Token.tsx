
import React, { useState } from 'react';
import { WordToken, PartOfSpeech } from '../types';
import { POS_COLORS, POS_LABELS } from '../constants';

interface TokenProps {
  token: WordToken;
  showLabels: boolean;
}

const Token: React.FC<TokenProps> = ({ token, showLabels }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span 
      className="relative inline-block mx-0.5 group cursor-help transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`${POS_COLORS[token.pos]} ${token.isPhrase ? 'bg-yellow-50 px-0.5 rounded border-b-2 border-yellow-200' : ''}`}>
        {token.text}
      </span>
      
      {showLabels && (
        <span className="absolute -top-4 left-0 text-[8px] font-bold text-slate-400 opacity-60 uppercase tracking-tighter">
          {POS_LABELS[token.pos]}
        </span>
      )}

      {isHovered && token.explanation && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white text-xs p-2 rounded shadow-xl pointer-events-none">
          <div className="font-bold mb-1 border-b border-slate-700 pb-1 uppercase">{token.pos}</div>
          {token.explanation}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </span>
  );
};

export default Token;
