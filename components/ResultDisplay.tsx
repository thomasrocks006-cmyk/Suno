
import React, { useState, useEffect } from 'react';
import { GeneratedSong, SongVariation, SongAnalysis } from '../types';
import { analyzeGeneratedSong, generateSongVariations, rewriteSongWithImprovements } from '../services/geminiService';
import { SmartLineEditor } from './SmartLineEditor';
import { ComparisonView } from './ComparisonView';

interface ResultDisplayProps {
  song: GeneratedSong;
  parentSong?: GeneratedSong; // Passed from App.tsx
  onUpdateSong: (updatedSong: GeneratedSong) => void;
  onCreateVersion: (baseSong: GeneratedSong, newLyrics: string, technicalExplanation: string, advancedLogic: boolean, metaphorLogic: boolean) => void;
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

const CreativeForgeLoader = () => (
    <div className="absolute inset-0 bg-suno-dark/95 z-50 flex flex-col items-center justify-center backdrop-blur-md">
        <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-suno-primary/20 animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-suno-primary animate-[spin_3s_linear_infinite]"></div>
            <div className="absolute inset-4 rounded-full border-4 border-suno-secondary/20 animate-[spin_8s_linear_infinite_reverse]"></div>
            <div className="absolute inset-4 rounded-full border-t-4 border-suno-secondary animate-[spin_2s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 flex items-center justify-center text-3xl">🎵</div>
        </div>
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-suno-primary to-suno-secondary mb-2">
            Forging Version 2
        </h3>
        <p className="text-gray-400 text-sm animate-pulse">Applying Lyric Logic & Metaphor Anchors...</p>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ song, parentSong, onUpdateSong, onCreateVersion }) => {
  const [activeTab, setActiveTab] = useState<Tab>('lyrics');
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  
  // Smart Editor State
  const [editingLineIndex, setEditingLineIndex] = useState<number | null>(null);
  const [isSmartEditorOpen, setIsSmartEditorOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Rewrite Options
  const [useAdvancedLogic, setUseAdvancedLogic] = useState(song.hasAdvancedLogic);
  const [useMetaphorLogic, setUseMetaphorLogic] = useState(song.hasMetaphorLogic);

  useEffect(() => {
      // Update toggles if advice comes in
      if (song.analysis?.rewriteAdvice) {
          setUseAdvancedLogic(song.analysis.rewriteAdvice.shouldUseAdvancedLogic);
          setUseMetaphorLogic(song.analysis.rewriteAdvice.shouldUseMetaphorLogic);
      }
  }, [song.analysis]);

  const handleAnalyze = async () => {
    if (song.analysis) return;
    try {
      const analysis = await analyzeGeneratedSong(song, parentSong?.lyrics); 
      onUpdateSong({ ...song, analysis });
    } catch (e) {
      console.error(e);
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
      const updatedData = await rewriteSongWithImprovements(song, useAdvancedLogic, useMetaphorLogic);
      onCreateVersion(song, updatedData.lyrics, updatedData.technicalExplanation, useAdvancedLogic, useMetaphorLogic);
      setActiveTab('lyrics'); 
    } catch (e) {
      console.error(e);
    } finally {
      setIsRewriting(false);
    }
  }

  const handleSmartEditSave = (newLine: string) => {
      if (editingLineIndex === null) return;
      
      const originalLine = song.lyrics.split('\n')[editingLineIndex];
      const lines = song.lyrics.split('\n');
      lines[editingLineIndex] = newLine;
      const newLyrics = lines.join('\n');
      
      // Create the updated song object
      const updatedSong = { ...song, lyrics: newLyrics };

      // If we have analysis, we should add this manual edit to the improvements grid
      if (updatedSong.analysis) {
          const manualImprovement = {
              original: originalLine,
              improved: newLine,
              reason: "Manual Smart Edit by User",
              source: 'User' as const
          };
          
          updatedSong.analysis = {
              ...updatedSong.analysis,
              lineByLineImprovements: [manualImprovement, ...updatedSong.analysis.lineByLineImprovements]
          };
      }

      onUpdateSong(updatedSong);
      setEditingLineIndex(null);
      setIsSmartEditorOpen(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400 border-green-500/50';
    if (score >= 70) return 'text-suno-primary border-suno-primary/50';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/50';
    return 'text-red-400 border-red-500/50';
  };

  return (
    <div className="h-full flex flex-col relative">
      {isRewriting && <CreativeForgeLoader />}
      {isComparisonOpen && parentSong && (
          <ComparisonView 
            currentSong={song} 
            parentSong={parentSong} 
            onClose={() => setIsComparisonOpen(false)} 
          />
      )}
      
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
          Lyrics {isSmartEditorOpen && <span className="ml-2 text-xs bg-white/20 px-1 rounded">Edit Mode</span>}
        </button>
        
        <button 
          onClick={() => { setActiveTab('analysis'); handleAnalyze(); }}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-suno-accent text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          Deep Analysis
          {!song.analysis ? (
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          ) : (
            <span className="text-[10px] bg-black/30 px-1.5 rounded text-white">{song.analysis.overallScore}</span>
          )}
        </button>

        <button 
          onClick={() => setActiveTab('variations')}
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
            <div className="flex justify-between items-center absolute top-4 right-6 z-10 gap-2">
                 <button 
                    onClick={() => setIsSmartEditorOpen(!isSmartEditorOpen)}
                    className={`text-xs px-3 py-1.5 rounded font-bold transition-colors ${isSmartEditorOpen ? 'bg-suno-primary text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                 >
                    {isSmartEditorOpen ? 'Done Editing' : '✨ Smart Edit'}
                 </button>
                 <CopyButton text={song.lyrics} />
            </div>

             <div className="font-mono text-sm md:text-base text-gray-200 whitespace-pre-wrap leading-relaxed pb-20">
               {song.lyrics.split('\n').map((line, i) => {
                 const isHeader = line.trim().startsWith('[') && line.trim().endsWith(']');
                 const isMeta = line.trim().startsWith('(') && line.trim().endsWith(')');
                 
                 if (editingLineIndex === i && isSmartEditorOpen) {
                     return (
                         <div key={i} className="my-2">
                             <SmartLineEditor 
                                originalLine={line}
                                songContext={`${song.stylePrompt} - ${song.title}`}
                                onSave={handleSmartEditSave}
                                onCancel={() => setEditingLineIndex(null)}
                             />
                         </div>
                     )
                 }

                 return (
                    <div 
                        key={i}
                        onClick={() => isSmartEditorOpen && !isHeader && line.trim() && setEditingLineIndex(i)}
                        className={`
                            ${isHeader ? 'text-suno-accent font-bold mt-6 mb-2' : ''}
                            ${isMeta ? 'text-purple-400 italic' : ''}
                            ${isSmartEditorOpen && !isHeader && line.trim() ? 'hover:bg-white/10 cursor-pointer p-1 rounded border border-transparent hover:border-white/20' : 'min-h-[1.5em]'}
                        `}
                    >
                        {line}
                    </div>
                 );
               })}
             </div>
          </div>
        )}

        {/* TAB: ANALYSIS */}
        {activeTab === 'analysis' && (
          <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
            {!song.analysis ? (
              <ProgressBar isRunning={true} label="Analyzing Structure..." />
            ) : (
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

                {/* COMPARISON REVIEW CARD (Only show if review data exists AND we have a parent to compare to) */}
                {song.analysis.comparisonReview && parentSong && (
                    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-5 flex justify-between items-center">
                        <div>
                            <h5 className="text-sm font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                                Version Comparison Available
                            </h5>
                            <p className="text-xs text-gray-400 mt-1">
                                Verdict: <span className="text-white font-bold">{song.analysis.comparisonReview.verdict}</span>
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsComparisonOpen(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-transform hover:scale-105"
                        >
                            View Full Comparison
                        </button>
                    </div>
                )}

                {/* Detailed Score Breakdown */}
                <div className="bg-white/5 p-4 rounded-lg">
                    <h5 className="text-xs uppercase font-bold text-gray-400 mb-3">Score Breakdown</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {song.analysis.scoreBreakdown.map((item, i) => (
                            <div key={i} className="flex justify-between items-center bg-black/20 p-2 rounded border border-white/5">
                                <div>
                                    <span className="text-xs font-bold text-gray-300 block">{item.category}</span>
                                    <span className="text-[10px] text-gray-500 truncate max-w-[200px]">{item.reason}</span>
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
                            Theme Analysis
                        </h5>
                        <p className="text-sm text-gray-300 leading-relaxed">{song.analysis.themeAnalysis}</p>
                    </div>
                    <div className="bg-suno-primary/10 border border-suno-primary/20 p-4 rounded-lg">
                        <h5 className="text-xs uppercase font-bold text-suno-primary mb-2 flex items-center gap-2">
                             Story Arc
                        </h5>
                        <p className="text-sm text-gray-300 leading-relaxed">{song.analysis.storyArc}</p>
                    </div>
                </div>

                {/* Sonic Analysis */}
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 rounded-lg overflow-hidden">
                    <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
                        <span className="text-lg">🎧</span>
                        <h5 className="text-sm font-bold text-white">Sonic & Structural Analysis (Producer's Ear)</h5>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex gap-4 items-start">
                             <div className="w-16 text-[10px] font-bold text-gray-400 uppercase shrink-0 pt-1">Phonetics</div>
                             <p className="text-sm text-gray-300">{song.analysis.sonicAnalysis.phonetics}</p>
                        </div>
                        <div className="flex gap-4 items-start border-t border-white/5 pt-4">
                             <div className="w-16 text-[10px] font-bold text-gray-400 uppercase shrink-0 pt-1">Density</div>
                             <p className="text-sm text-gray-300">{song.analysis.sonicAnalysis.density}</p>
                        </div>
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
                  <div className="flex justify-between items-center mb-2">
                      <h5 className="text-xs uppercase font-bold text-blue-400">Line-by-Line Improvements</h5>
                      <button 
                         onClick={() => { setActiveTab('lyrics'); setIsSmartEditorOpen(true); }}
                         className="text-[10px] bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-2 py-1 rounded transition"
                      >
                          Open Smart Editor
                      </button>
                  </div>
                  <div className="space-y-3">
                    {song.analysis.lineByLineImprovements.map((item, i) => (
                      <div key={i} className={`bg-black/40 p-3 rounded border ${item.source === 'User' ? 'border-suno-primary/40' : 'border-white/5'}`}>
                        <div className="flex justify-between items-start">
                            <div className="text-red-300/70 text-xs line-through mb-1">{item.original}</div>
                            {item.source === 'User' && <span className="text-[9px] bg-suno-primary/20 text-suno-primary px-1 rounded">Manual Edit</span>}
                        </div>
                        <div className="text-green-400 text-sm font-medium mb-1 flex items-center gap-2">
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                           {item.improved}
                        </div>
                        <div className="text-[10px] text-gray-500 italic">{item.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Rewrite Studio */}
                <div className="pt-6 border-t border-white/10">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <span className="text-suno-primary">⚡</span> Rewrite Studio
                        </h3>
                        
                        {/* AI Advice */}
                        {song.analysis.rewriteAdvice && (
                            <div className="mb-4 bg-black/30 p-3 rounded text-xs text-gray-300 border-l-2 border-suno-accent">
                                <strong className="text-suno-accent block mb-1">AI Recommendation:</strong>
                                {song.analysis.rewriteAdvice.reasoning}
                            </div>
                        )}

                        <div className="flex gap-4 mb-4">
                             <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                                 <input 
                                    type="checkbox" 
                                    checked={useAdvancedLogic} 
                                    onChange={e => setUseAdvancedLogic(e.target.checked)}
                                    className="rounded bg-black/50 border-gray-600 text-suno-primary focus:ring-0"
                                 />
                                 Advanced Lyric Logic
                             </label>
                             <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                                 <input 
                                    type="checkbox" 
                                    checked={useMetaphorLogic} 
                                    onChange={e => setUseMetaphorLogic(e.target.checked)}
                                    className="rounded bg-black/50 border-gray-600 text-suno-accent focus:ring-0"
                                 />
                                 Central Metaphor Logic
                             </label>
                        </div>

                        <button 
                            onClick={handleRewrite}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                            Generate Version {song.title.includes('V') ? parseInt(song.title.split('V')[1]) + 1 : 2}
                        </button>
                    </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: VARIATIONS */}
        {activeTab === 'variations' && (
          <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
            {isGeneratingVariations ? (
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
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-gray-400 text-sm mb-4">No variations generated yet.</p>
                    <button 
                        onClick={handleGenerateVariations}
                        className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-suno-secondary hover:bg-pink-600 shadow-lg transition-all"
                    >
                        Generate 2 Variations
                    </button>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
