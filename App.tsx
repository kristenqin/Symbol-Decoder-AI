
import React, { useState, useCallback } from 'react';
import { decodeText } from './services/geminiService';
import { DecodedText, PartOfSpeech } from './types';
import Token from './components/Token';
import SkeletonView from './components/SkeletonView';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [decodedData, setDecodedData] = useState<DecodedText | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const handleDecode = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const data = await decodeText(inputText);
      setDecodedData(data);
    } catch (error) {
      console.error("Decoding error:", error);
      alert("Failed to decode text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setDecodedData(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
            Σ
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Symbol Decoder</h1>
            <p className="text-xs text-slate-500">Accelerating English Semantic Mapping</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setShowLabels(!showLabels)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${showLabels ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              POS Labels
            </button>
            <button 
              onClick={() => setShowSkeleton(!showSkeleton)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${showSkeleton ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Skeleton
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Input Section */}
        {!decodedData && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Paste your complex English text</label>
            <textarea
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-800"
              placeholder="e.g., The persistent challenge of accurately decoding complex linguistic symbols often leads to cognitive overload for non-native English speakers..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={handleDecode}
              disabled={isLoading || !inputText.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing Syntax...</span>
                </>
              ) : (
                <span>Accelerate Decoding</span>
              )}
            </button>
          </div>
        )}

        {/* Legend */}
        {decodedData && (
          <div className="flex flex-wrap gap-4 items-center bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Guide:</span>
             <div className="flex items-center space-x-1">
               <span className="w-2 h-2 rounded-full bg-blue-600"></span>
               <span className="text-xs text-slate-600">Noun</span>
             </div>
             <div className="flex items-center space-x-1">
               <span className="w-2 h-2 rounded-full bg-rose-600"></span>
               <span className="text-xs text-slate-600">Verb</span>
             </div>
             <div className="flex items-center space-x-1">
               <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
               <span className="text-xs text-slate-600">Adj</span>
             </div>
             <div className="flex items-center space-x-1">
               <span className="w-2 h-2 rounded-full bg-purple-600"></span>
               <span className="text-xs text-slate-600">Conj</span>
             </div>
             <div className="flex items-center space-x-1 ml-auto">
               <span className="bg-yellow-50 border-b border-yellow-200 px-2 text-[10px] rounded">Phrase Highlight</span>
             </div>
          </div>
        )}

        {/* Results Section */}
        {decodedData && (
          <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {decodedData.sentences.map((sentence, sIdx) => (
              <div key={sIdx} className="group border-l-4 border-slate-100 pl-6 space-y-6 transition-all hover:border-blue-200">
                
                {/* Visual Tokens */}
                <div className="text-xl leading-relaxed text-slate-800 font-medium">
                  {sentence.tokens.map((token, tIdx) => (
                    <Token key={tIdx} token={token} showLabels={showLabels} />
                  ))}
                </div>

                {/* Cognitive Offloading Layers */}
                <div className="flex flex-col space-y-4">
                  {showSkeleton && (
                    <SkeletonView skeleton={sentence.skeleton} />
                  )}

                  {sentence.clauses && sentence.clauses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {sentence.clauses.map((clause, cIdx) => (
                        <div key={cIdx} className={`p-2 rounded-lg text-xs flex items-start space-x-2 border ${clause.type === 'main' ? 'bg-blue-50/50 border-blue-100 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                          <span className="font-bold opacity-50 uppercase mt-0.5">{clause.type[0]}</span>
                          <span>{clause.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button 
              onClick={handleClear}
              className="mx-auto block text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
            >
              Analyze New Text
            </button>
          </div>
        )}

        {/* Initial Prompt Info */}
        {!decodedData && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-100/50 border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2">Visual Mapping</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Instantly distinguish core actions from descriptors using neural-friendly color coding.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100/50 border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2">Structure Skeleton</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Bypass complex nesting. Our AI extracts the Subject-Verb-Object core for immediate grasp.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100/50 border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2">Phrase Recognition</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Identify idioms and fixed collocations automatically to prevent word-by-word misreading.</p>
            </div>
          </div>
        )}
      </main>

      {/* Persistent CTA */}
      {decodedData && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-slate-200 px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-4 z-50">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Decoding Active</p>
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 px-2"
          >
            Back to Top
          </button>
          <button 
            onClick={handleClear}
            className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            New Text
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
