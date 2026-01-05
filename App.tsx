
import React, { useState } from 'react';
import { decodeText } from './services/geminiService';
import { DecodedText } from './types';
import Token from './components/Token';
import SkeletonView from './components/SkeletonView';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [decodedData, setDecodedData] = useState<DecodedText | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const handleDecode = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const data = await decodeText(inputText);
      setDecodedData(data);
    } catch (error) {
      console.error("Decoding error:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setDecodedData(null);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Immersive Header */}
      <header className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-black text-slate-800 tracking-tighter">
            SYMBOL<span className="text-blue-600">DECODER</span>
          </div>
        </div>
        
        {decodedData && (
          <div className="flex items-center space-x-3 bg-white border border-slate-200 p-1 rounded-full shadow-sm">
            <button 
              onClick={() => setShowSkeleton(!showSkeleton)}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${showSkeleton ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Skeleton
            </button>
            <button 
              onClick={handleClear}
              className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-all"
            >
              Reset
            </button>
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-6">
        {!decodedData ? (
          <div className="space-y-8 mt-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-800">Accelerate your reading.</h2>
              <p className="text-slate-500 font-medium">Bypass linguistic decoding lag with AI-powered semantic mapping.</p>
            </div>
            
            <div className="relative group">
              <textarea
                className="w-full h-64 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none text-lg leading-relaxed text-slate-700"
                placeholder="Paste English text to decode..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                onClick={handleDecode}
                disabled={isLoading || !inputText.trim()}
                className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-blue-200 transition-all transform active:scale-95 flex items-center space-x-2"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>Analyze Text</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-16 mt-4">
            {/* The Legend is now integrated as a subtle guide */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-slate-100 pb-6">
               <div className="flex items-center space-x-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Entities</span>
               </div>
               <div className="flex items-center space-x-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Actions</span>
               </div>
               <div className="flex items-center space-x-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Modifiers</span>
               </div>
               <div className="flex items-center space-x-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Logic Connectors</span>
               </div>
            </div>

            <div className="space-y-10 animate-in fade-in duration-1000">
              {decodedData.sentences.map((sentence, sIdx) => (
                <div key={sIdx} className="space-y-4">
                  <div className="text-2xl leading-[1.6] text-slate-800 font-normal tracking-tight whitespace-pre-wrap">
                    {sentence.tokens.map((token, tIdx) => (
                      <React.Fragment key={tIdx}>
                        <Token token={token} />
                        {/* Add space between tokens if not punctuation */}
                        {tIdx < sentence.tokens.length - 1 && !sentence.tokens[tIdx+1].text.match(/^[.,!?;:]/) && ' '}
                      </React.Fragment>
                    ))}
                  </div>

                  {showSkeleton && (
                    <div className="animate-in slide-in-from-left-2 duration-300">
                      <SkeletonView skeleton={sentence.skeleton} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-32 py-12 text-center text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
        Designed for cognitive offloading & reading speed
      </footer>
    </div>
  );
};

export default App;
