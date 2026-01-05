
import React from 'react';
import { SentenceStructure } from '../types';

interface SkeletonViewProps {
  skeleton: SentenceStructure['skeleton'];
}

const SkeletonView: React.FC<SkeletonViewProps> = ({ skeleton }) => {
  return (
    <div className="flex items-center space-x-2 text-xs mono text-slate-500 bg-white/50 p-2 rounded border border-slate-100">
      <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">S: {skeleton.subject}</span>
      <span className="text-slate-300">→</span>
      <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-medium">V: {skeleton.verb}</span>
      {skeleton.object && (
        <>
          <span className="text-slate-300">→</span>
          <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">O: {skeleton.object}</span>
        </>
      )}
    </div>
  );
};

export default SkeletonView;
