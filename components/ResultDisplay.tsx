
import React, { useState, useEffect } from 'react';
import { GeneratedSong, SongVariation, SongAnalysis } from '../types';
import { analyzeGeneratedSong, generateSongVariations, rewriteSongWithImprovements } from '../services/geminiService';

interface ResultDisplayProps {
  song: GeneratedSong;
  onUpdateSong: (updatedSong: GeneratedSong) => void;
  onCreateVersion: (baseSong: GeneratedSong, newLyrics: string, technicalExplanation: string) => void;
}

type Tab = 'lyrics' | 'analysis' | 'variations';

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-2 py-1 rounded transition flex items-center gap-1"
    >
      {copied ? <span className="text-green-400">Copied!</span> : <span>Copy</span>}
    </button>
  );
};

const ProgressBar: React.FC<{ isRunning: boolean; label: string }> = ({ isRunning, label }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      setProgress(0);
      return;
    }
    
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + Math.random() * 15 : prev));
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning]);

  if (!isRunning) return null;

  return (
    <div className="flex flex-col items-center justify-center h-64 w-full animate-fade-in">
      <div className="w-64 mb-2 flex justify-between text-xs uppercase font-bold text-suno-accent">
         <span>{label}</span>
         <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-64 bg-black/50 rounded-full h-2 overflow-hidden border border-white/10">
        <div 
          className="bg-gradient-to-r from-suno-primary to-suno-accent h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-500 text-xs mt-4 animate-pulse">Consulting Gemini 3.0 Pro...</p>
    </div>
  );
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ song, onUpdateSong, onCreateVersion }) => {
  const [activeTab, setActiveTab] = useState<Tab>('lyrics');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  const handleAnalyze = async () => {
    if (song.analysis) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeGeneratedSong(song);
      onUpdateSong({ ...song, analysis });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateVariations = async () => {
    if (song.variations && song.variations.length > 0) return;
    setIsGeneratingVariations(true);
    try {
      const variations = await generateSongVariations(song);
      onUpdateSong({ ...song, variations });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  const handleRewrite = async () => {
    setIsRewriting(true);
    try {
      // Generate improvements based on analysis
      const updatedData = await rewriteSongWithImprovements(song);
      
      // Instead of replacing, create a new version in history
      onCreateVersion(song, updatedData.lyrics, updatedData.technicalExplanation);
      
      // Reset view to lyrics (new song will be selected by parent component)
      setActiveTab('lyrics'); 
    } catch (e) {
      console.error(e);
    } finally {
      setIsRewriting(false);
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400 border-green-500/50';
    if (score >= 70) return 'text-suno-primary border-suno-primary/50';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/50';
    return 'text-red-400 border-red-500/50';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Card: Metadata & Cover */}
      <div className="bg-suno-card p-6 rounded-2xl border border-white/10 shadow-xl mb-4 shrink-0">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover Art */}
          <div className="shrink-0 group relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-black/50 flex items-center justify-center">
              {song.coverImageBase64 ? (
                <img 
                  src={`data:image/jpeg;base64,${song.coverImageBase64}`} 
                  alt="Album Cover" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="text-center p-2">
                   <div className="text-2xl mb-1">🎵</div>
                </div>
              )}
            </div>
          </div>

          {/* Song Details */}
          <div className="flex-grow min-w-0 relative">
             {/* Logic Feature Badges */}
             <div className="absolute top-0 right-0 flex gap-2">
                {song.hasAdvancedLogic && (
                    <span title="Written with Advanced Lyric Logic" className="flex items-center gap-1 text-[10px] font-bold bg-suno-primary/20 text-suno-primary border border-suno-primary/30 px-2 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/></svg>
                        Advanced Logic
                    </span>
                )}
                {song.hasMetaphorLogic && (
                    <span title="Written with Central Metaphor Logic" className="flex items-center gap-1 text-[10px] font-bold bg-suno-accent/20 text-suno-accent border border-suno-accent/30 px-2 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Metaphor
                    </span>
                )}
             </div>

             <h3 className="text-2xl font-bold text-white mb-1 truncate pr-24">{song.title}</h3>
             <p className="text-gray-400 text-xs italic mb-3 line-clamp-2 pr-20">{song.technicalExplanation}</p>
             
             <div className="grid grid-cols-1 gap-2">
              <div className="bg-black/30 p-2 rounded border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase font-bold text-suno-accent tracking-wider">Style</span>
                  <CopyButton text={song.stylePrompt} />
                </div>
                <p className="text-suno-secondary font-mono text-xs truncate">{song.stylePrompt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-2 px-1 shrink-0 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('lyrics')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'lyrics' ? 'bg-suno-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          Original Lyrics
        </button>
        
        <button 
          onClick={() => { setActiveTab('analysis'); handleAnalyze(); }}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-suno-accent text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          Deep Analysis
          {song.analysis && <span className="text-[10px] bg-black/30 px-1.5 rounded text-white">{song.analysis.overallScore}</span>}
        </button>

        <button 
          onClick={() => { setActiveTab('variations'); handleGenerateVariations(); }}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'variations' ? 'bg-suno-secondary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          Variations
          {song.variations && <span className="text-[10px] bg-black/30 px-1.5 rounded text-white">{song.variations.length}</span>}
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-suno-card rounded-2xl border border-white/10 shadow-xl flex-grow overflow-hidden relative flex flex-col">
        
        {/* TAB: LYRICS */}
        {activeTab === 'lyrics' && (
          <div className="flex-grow overflow-y-auto custom-scrollbar p-6 relative">
            {isRewriting && (
              <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
                 <ProgressBar isRunning={isRewriting} label="Rewriting Song..." />
              </div>
            )}
            <div className="absolute top-4 right-6 z-10">
              <CopyButton text={song.lyrics} />
            </div>
             <pre className="font-mono text-sm md:text-base text-gray-200 whitespace-pre-wrap leading-relaxed pb-20">
               {song.lyrics.split('\n').map((line, i) => {
                 if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
                   return <span key={i} className="text-suno-accent font-bold block mt-6 mb-2">{line}</span>;
                 }
                 if (line.trim().startsWith('(') && line.trim().endsWith(')')) {
                   return <span key={i} className="text-purple-400 italic block">{line}</span>;
                 }
                 return <span key={i} className="block min-h-[1.5em]">{line}</span>;
               })}
             </pre>
          </div>
        )}

        {/* TAB: ANALYSIS */}
        {activeTab === 'analysis' && (
          <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
            {isAnalyzing && !song.analysis ? (
              <ProgressBar isRunning={true} label="Analyzing Structure..." />
            ) : song.analysis ? (
              <div className="space-y-6 animate-fade-in pb-20">
                {/* Score Section */}
                <div className="flex items-center gap-6 bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className={`shrink-0 w-24 h-24 rounded-full flex items-center justify-center border-4 ${getScoreColor(song.analysis.overallScore)} shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                    <span className={`text-4xl font-bold ${getScoreColor(song.analysis.overallScore).split(' ')[0]}`}>
                      {song.analysis.overallScore}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Review Summary</h4>
                    <p className="text-sm text-gray-300 italic">{song.analysis.summary}</p>
                    <div className="mt-2 text-xs font-medium text-suno-accent flex items-center gap-2">
                        <span>Predicted Score after Fixes:</span>
                        <span className="bg-suno-accent text-white px-1.5 rounded">{song.analysis.projectedScore}</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Score Breakdown */}
                <div className="bg-white/5 p-4 rounded-lg">
                    <h5 className="text-xs uppercase font-bold text-gray-400 mb-3">Score Breakdown</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {song.analysis.scoreBreakdown.map((item, i) => (
                            <div key={i} className="flex justify-between items-center bg-black/20 p-2 rounded border border-white/5">
                                <div>
                                    <span className="text-xs font-bold text-gray-300 block">{item.category}</span>
                                    <span className="text-[10px] text-gray-500">{item.reason}</span>
                                </div>
                                <span className={`text-sm font-bold ${getScoreColor(item.score * 10).split(' ')[0]}`}>{item.score}/10</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Theme & Narrative Arc */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-suno-secondary/10 border border-suno-secondary/20 p-4 rounded-lg">
                        <h5 className="text-xs uppercase font-bold text-suno-secondary mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                            Theme Analysis
                        </h5>
                        <p className="text-sm text-gray-300 leading-relaxed">{song.analysis.themeAnalysis}</p>
                    </div>
                    <div className="bg-suno-primary/10 border border-suno-primary/20 p-4 rounded-lg">
                        <h5 className="text-xs uppercase font-bold text-suno-primary mb-2 flex items-center gap-2">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                             Story Arc
                        </h5>
                        <p className="text-sm text-gray-300 leading-relaxed">{song.analysis.storyArc}</p>
                    </div>
                </div>

                {/* Sonic Analysis (The Producer's Ear) */}
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 rounded-lg overflow-hidden">
                    <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
                        <span className="text-lg">🎧</span>
                        <h5 className="text-sm font-bold text-white">Sonic & Structural Analysis (Producer's Ear)</h5>
                    </div>
                    <div className="p-4 space-y-4">
                        {/* Phonetics */}
                        <div className="flex gap-4 items-start">
                             <div className="w-16 text-[10px] font-bold text-gray-400 uppercase shrink-0 pt-1">Phonetics</div>
                             <p className="text-sm text-gray-300">{song.analysis.sonicAnalysis.phonetics}</p>
                        </div>
                        {/* Density */}
                        <div className="flex gap-4 items-start border-t border-white/5 pt-4">
                             <div className="w-16 text-[10px] font-bold text-gray-400 uppercase shrink-0 pt-1">Density</div>
                             <p className="text-sm text-gray-300">{song.analysis.sonicAnalysis.density}</p>
                        </div>
                        {/* Cinema Audit */}
                        <div className="flex gap-4 items-start border-t border-white/5 pt-4">
                             <div className="w-16 text-[10px] font-bold text-gray-400 uppercase shrink-0 pt-1">Cinema Audit</div>
                             <div className="flex-grow">
                                 <div className="flex items-center gap-2 mb-1">
                                     <span className={`text-xs font-bold px-2 py-0.5 rounded ${song.analysis.sonicAnalysis.cinemaAudit.score === 'A' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                         Grade: {song.analysis.sonicAnalysis.cinemaAudit.score}
                                     </span>
                                     <span className="text-xs text-gray-500">({song.analysis.sonicAnalysis.cinemaAudit.objectCount} Physical Objects)</span>
                                 </div>
                                 <p className="text-sm text-gray-300 mb-2">{song.analysis.sonicAnalysis.cinemaAudit.analysis}</p>
                                 <div className="flex flex-wrap gap-2">
                                     {song.analysis.sonicAnalysis.cinemaAudit.objects.map((obj, i) => (
                                         <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">{obj}</span>
                                     ))}
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                  <h5 className="text-xs uppercase font-bold text-blue-400 mb-2">Line-by-Line Improvements</h5>
                  <div className="space-y-3">
                    {song.analysis.lineByLineImprovements.map((item, i) => (
                      <div key={i} className="bg-black/40 p-3 rounded border border-white/5">
                        <div className="text-red-300/70 text-xs line-through mb-1">{item.original}</div>
                        <div className="text-green-400 text-sm font-medium mb-1 flex items-center gap-2">
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                           {item.improved}
                        </div>
                        <div className="text-[10px] text-gray-500 italic">{item.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewrite Action */}
                <div className="pt-4 border-t border-white/10">
                    <button 
                        onClick={handleRewrite}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        Rewrite Song with Improvements
                    </button>
                    <p className="text-center text-[10px] text-gray-500 mt-2">
                        Applies phonetic fixes, creates density contrast, and adds concrete imagery. 
                        <span className="text-green-400 font-medium ml-1">Saves as new V2 file.</span>
                    </p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB: VARIATIONS */}
        {activeTab === 'variations' && (
          <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
            {isGeneratingVariations && !song.variations ? (
               <ProgressBar isRunning={true} label="Dreaming up Variations..." />
            ) : song.variations ? (
              <div className="space-y-8 pb-20">
                {song.variations.map((variation, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <div className="bg-black/30 p-3 border-b border-white/10 flex justify-between items-center">
                       <div>
                         <span className="text-xs font-bold text-suno-secondary uppercase tracking-wider">Variation {idx + 1}</span>
                         <h4 className="text-white font-bold text-sm">{variation.type}</h4>
                       </div>
                       <CopyButton text={variation.lyrics} />
                    </div>
                    <div className="p-4 bg-suno-secondary/5 text-xs text-gray-300 italic border-b border-white/5">
                       "{variation.explanation}"
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar bg-black/20">
                      <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">{variation.lyrics}</pre>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
