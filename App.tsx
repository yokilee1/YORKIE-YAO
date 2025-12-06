
import React, { useState, useRef, useEffect } from 'react';
import { HexagramDisplay } from './components/HexagramDisplay';
import { CoinStage } from './components/CoinStage';
import { Interpretation } from './components/Interpretation';
import { LineValue } from './types';
import { analyzeHexagram } from './services/geminiService';
import { RotateCcw, ArrowRight } from 'lucide-react';

const TOTAL_LINES = 6;

export default function App() {
  const [question, setQuestion] = useState<string>('');
  const [lines, setLines] = useState<LineValue[]>([]);
  const [isTossing, setIsTossing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Capture the start time of divination
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleTossComplete = (newLine: LineValue) => {
    setLines((prev) => [...prev, newLine]);
    setIsTossing(false);
  };

  const startToss = () => {
    if (lines.length >= TOTAL_LINES || isTossing) return;
    
    // Set start time on first toss
    if (lines.length === 0 && !startTime) {
        setStartTime(new Date());
    }
    
    setIsTossing(true);
  };

  const resetDivination = () => {
    setLines([]);
    setAnalysis(null);
    setIsAnalyzing(false);
    setQuestion('');
    setStartTime(null);
  };

  const handleAnalyze = async () => {
    if (!question.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Use current time if somehow missed, but prefer start time
      const dateContext = startTime || new Date();
      const result = await analyzeHexagram(lines, question, dateContext);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysis("系统连接中断，请检查网络或稍后重试。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (lines.length === TOTAL_LINES && bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines]);

  useEffect(() => {
    if (analysis && bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analysis]);


  const progress = (lines.length / TOTAL_LINES) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center text-gray-800 p-4 md:p-12 overflow-x-hidden font-sans bg-[#fafafa]">
      
      {/* Header - Minimal Magazine Header */}
      <header className="w-full max-w-5xl flex justify-between items-end mb-16 border-b border-gray-200 pb-6 fade-in">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-gray-900 mb-2">
            六爻 · 灵感
          </h1>
          <p className="text-xs md:text-sm text-gray-400 tracking-[0.2em] uppercase font-sans">
            I Ching Divination
          </p>
        </div>
        <div className="flex items-center gap-4">
            {startTime && (
                <div className="hidden md:block text-right">
                    <span className="block text-[10px] text-gray-400 uppercase tracking-widest">起卦时间</span>
                    <span className="block text-xs font-serif text-gray-600">
                        {startTime.toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            )}
            <button 
              onClick={resetDivination}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
              title="重置"
            >
              <RotateCcw size={18} />
            </button>
        </div>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 fade-in" style={{animationDelay: '0.1s'}}>
        
        {/* Left Column: Interaction */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Question Input - Clean minimal style */}
          <div className="ins-card p-8 rounded-3xl relative group">
             <div className="relative">
                <label className="block text-xs font-bold text-gray-300 mb-4 uppercase tracking-widest">
                  问 询 · Inquiry
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="在此输入您的疑惑..."
                  className="w-full bg-transparent border-none p-0 text-xl font-serif text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-0 resize-none leading-relaxed"
                  rows={3}
                  disabled={lines.length > 0 && lines.length < TOTAL_LINES} 
                />
                <div className="h-px w-full bg-gray-100 mt-4 group-focus-within:bg-gray-300 transition-colors"></div>
             </div>
          </div>

          {/* Coin Stage */}
          <div className="ins-card p-8 rounded-3xl flex flex-col items-center justify-center flex-1 min-h-[400px]">
            {lines.length < TOTAL_LINES ? (
              <>
                 <div className="w-full flex justify-between items-center mb-12">
                    <span className="text-xs font-serif text-gray-400 italic">第 {lines.length + 1} 爻</span>
                    <div className="h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gray-800 transition-all duration-700 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                 </div>
                 
                 <div className="flex-1 flex items-center justify-center w-full">
                     <CoinStage 
                        isTossing={isTossing} 
                        onTossComplete={handleTossComplete}
                        triggerToss={startToss}
                     />
                 </div>

                 <button
                    onClick={startToss}
                    disabled={isTossing || !question}
                    className={`mt-12 px-10 py-4 rounded-full font-sans text-sm tracking-widest uppercase transition-all duration-500 w-full md:w-auto
                      ${!question 
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                        : isTossing
                            ? 'bg-white border border-gray-200 text-gray-400'
                            : 'bg-gray-900 text-white hover:bg-black hover:scale-105 shadow-lg shadow-gray-200'
                      }
                    `}
                 >
                    {isTossing ? '...' : '掷 币 · Toss'}
                 </button>
                 {!question && <p className="text-[10px] text-gray-300 mt-4 tracking-widest">请先输入问题</p>}
              </>
            ) : (
               <div className="text-center py-10 flex flex-col items-center justify-center h-full fade-in">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-800">
                    <span className="font-serif text-2xl">完</span>
                  </div>
                  <h3 className="text-xl font-serif text-gray-800 mb-2">卦象已成</h3>
                  <p className="text-gray-400 text-xs tracking-widest mb-10">
                    Ready for interpretation
                  </p>
                  
                  {!analysis && !isAnalyzing && (
                    <button
                        onClick={handleAnalyze}
                        className="w-full px-8 py-4 bg-gray-900 text-white rounded-full text-sm tracking-widest shadow-xl shadow-gray-200 hover:bg-black transition-all flex items-center justify-center gap-2 group"
                    >
                        <span>开始解读</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
               </div>
            )}
          </div>
        </div>

        {/* Right Column: Hexagram Display */}
        <div className="lg:col-span-7 h-full min-h-[600px]">
            <HexagramDisplay lines={lines} dateContext={startTime || undefined} />
        </div>

      </main>

      {/* Analysis Section */}
      {(isAnalyzing || analysis) && (
        <section ref={bottomRef} className="w-full max-w-4xl mt-12 mb-24 fade-in">
            <Interpretation 
                loading={isAnalyzing} 
                content={analysis || ''} 
            />
        </section>
      )}
      
      <footer className="mt-20 text-center text-gray-300 text-[10px] font-sans tracking-widest uppercase">
        Designed for Clarity · AI Powered
      </footer>
    </div>
  );
}
