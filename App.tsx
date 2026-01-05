
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
    } catch (error: any) {
      console.error("Decoding error:", error);
      alert(error.message || "Failed to analyze text. Try a shorter snippet.");
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
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-xl font-black text-slate-800 tracking-tighter">
              SYMBOL<span className="text-rose-600">DECODER</span>
            </div>
          </div>
          
          {decodedData && (
            <div className="flex items-center space-x-3 bg-slate-100 p-1 rounded-full shadow-inner">
              <button 
                onClick={() => setShowSkeleton(!showSkeleton)}
                className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all ${showSkeleton ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Structure View
              </button>
              <button 
                onClick={handleClear}
                className="px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-rose-600 transition-all"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {!decodedData ? (
          <div className="space-y-8 mt-4">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-800 italic">Cognitive Offloading.</h2>
              <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
                Symbol Decoder visualizes English syntax to help your brain skip the "decoding" phase and jump straight to deep comprehension.
              </p>
            </div>
            
            <div className="relative group">
              <textarea
                className="w-full h-80 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/40 focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 outline-none transition-all resize-none text-lg leading-relaxed text-slate-700"
                placeholder="Paste English text (e.g. news, academic papers, essays)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                onClick={handleDecode}
                disabled={isLoading || !inputText.trim()}
                className="absolute bottom-6 right-6 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold px-10 py-4 rounded-2xl shadow-lg shadow-rose-200 transition-all transform active:scale-95 flex items-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing Syntax...</span>
                  </>
                ) : (
                  <span>Decode Analysis</span>
                )}
              </button>
            </div>
            <div className="flex flex-col items-center space-y-2">
               <p className="text-xs text-slate-400">Works best with 300-500 word snippets. Longer text may be truncated for stability.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-wrap gap-x-8 gap-y-3 bg-white/90 backdrop-blur border border-slate-100 p-5 rounded-2xl shadow-sm sticky top-20 z-30">
               <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Nouns</span>
               </div>
               <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Verbs</span>
               </div>
               <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Adjectives</span>
               </div>
               <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Connectors</span>
               </div>
               <div className="flex items-center space-x-2">
                 <span className="w-4 h-2 rounded-sm bg-amber-100 border-b border-amber-300"></span>
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Phrases</span>
               </div>
               <div className="ml-auto text-[10px] font-bold text-slate-300 italic">Hover for context</div>
            </div>

            <div className="prose prose-slate max-w-none">
              <div className="text-xl leading-[2] text-slate-800 font-normal tracking-tight whitespace-pre-wrap">
                {decodedData.sentences.map((sentence, sIdx) => (
                  <span key={sIdx} className="inline group/sentence relative">
                    {sentence.tokens.map((token, tIdx) => (
                      <React.Fragment key={tIdx}>
                        <Token token={token} />
                        {tIdx < sentence.tokens.length - 1 && !sentence.tokens[tIdx+1].text.match(/^[.,!?;:']/) && ' '}
                      </React.Fragment>
                    ))}
                    {showSkeleton && sentence.skeleton.subject && (
                      <div className="my-3 block animate-in slide-in-from-left-2 duration-300">
                        <SkeletonView skeleton={sentence.skeleton} />
                      </div>
                    )}
                    {' '}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-16 pb-20 border-t border-slate-100 flex flex-col items-center space-y-4">
              <button 
                onClick={handleClear}
                className="bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-all"
              >
                New Analysis
              </button>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest">End of Decoded Stream</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
