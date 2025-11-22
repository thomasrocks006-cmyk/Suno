import React, { useState, useEffect } from 'react';
import { generateSongAssets, analyzeGeneratedSong, generateSongVariations } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { Sidebar } from './components/Sidebar';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayerView } from './components/FullPlayerView';
import { SongInputs, GeneratedSong, StructureType } from './types';

const INITIAL_INPUTS: SongInputs = {
  artistReference: '',
  songReference: '',
  topic: '',
  mood: '',
  genre: '',
  vocals: '',
  instruments: [],
  structure: StructureType.AUTO,
  customInstructions: '',
  syllablePattern: '',
  advancedLyricLogic: false,
  centralMetaphorLogic: false,
  model: 'V4',
  instrumental: false
};

export default function App() {
  const [inputs, setInputs] = useState<SongInputs>(INITIAL_INPUTS);
  const [history, setHistory] = useState<GeneratedSong[]>([]);
  const [currentSong, setCurrentSong] = useState<GeneratedSong | null>(null);
  
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInputPanelOpen, setIsInputPanelOpen] = useState(true);

  // Handle persistence of history
  useEffect(() => {
    const savedHistory = localStorage.getItem('suno_architect_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        if (parsed.length > 0) {
          setCurrentSong(parsed[0]);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('suno_architect_history', JSON.stringify(history));
  }, [history]);

  const handleSubmit = async () => {
    setLoadingStatus('Architecting Song...');
    setError(null);

    try {
      // 1. Generate the Base Song
      const newSong = await generateSongAssets(inputs);
      
      // IMMEDIATE UPDATE: Show the song to the user now
      setHistory(prev => [newSong, ...prev]);
      setCurrentSong(newSong);
      setIsInputPanelOpen(false); // Close input panel to show results
      
      // 2. Run Deep Analysis in the background
      triggerBackgroundAnalysis(newSong);

    } catch (err) {
      setError("Failed to generate song assets. Please check your API key and try again.");
      console.error(err);
    } finally {
      setLoadingStatus(null);
    }
  };

  // Helper to run analysis and update state when done
  const triggerBackgroundAnalysis = async (songToAnalyze: GeneratedSong) => {
    try {
      // Check if this is a V2/Revision and find parent for comparison
      let parentLyrics: string | undefined;
      
      if (songToAnalyze.parentId) {
          const parent = history.find(h => h.id === songToAnalyze.parentId);
          if (parent) parentLyrics = parent.lyrics;
      }

      const analysis = await analyzeGeneratedSong(songToAnalyze, parentLyrics);
      
      // Update the song in history and current view
      const updatedSong = { ...songToAnalyze, analysis };
      
      setHistory(prev => prev.map(s => s.id === songToAnalyze.id ? updatedSong : s));
      
      // Only update currentSong if the user is still looking at it
      setCurrentSong(current => current?.id === songToAnalyze.id ? updatedSong : current);
      
    } catch (analysisError) {
      console.warn("Background analysis failed:", analysisError);
    }
  };

  const handleUpdateSong = (updatedSong: GeneratedSong) => {
    // Update the song in history and current view (In-place update)
    const newHistory = history.map(s => s.id === updatedSong.id ? updatedSong : s);
    setHistory(newHistory);
    setCurrentSong(updatedSong);
  };

  const handleCreateVersion = (
    baseSong: GeneratedSong, 
    newLyrics: string, 
    technicalExplanation: string,
    advancedLogic: boolean,
    metaphorLogic: boolean
  ) => {
    // Determine version number
    let versionNum = 2;
    if (baseSong.title.includes('(V')) {
        const match = baseSong.title.match(/\(V(\d+)\)/);
        if (match) versionNum = parseInt(match[1]) + 1;
    }

    // 1. Create a new V2 song entry
    const newVersion: GeneratedSong = {
      ...baseSong,
      id: crypto.randomUUID(),
      parentId: baseSong.id, // Link to parent for comparison
      title: baseSong.title.replace(/\s\(V\d+\)/, '') + ` (V${versionNum})`,
      createdAt: Date.now(),
      lyrics: newLyrics,
      technicalExplanation: technicalExplanation,
      // Clear analysis and variations as they apply to the old lyrics
      analysis: undefined,
      variations: undefined,
      stylePrompt: baseSong.stylePrompt, 
      coverImageBase64: baseSong.coverImageBase64, 
      coverArtPrompt: baseSong.coverArtPrompt,
      hasAdvancedLogic: advancedLogic,
      hasMetaphorLogic: metaphorLogic,
      negativePrompt: baseSong.negativePrompt
    };

    // 2. Switch view immediately
    setHistory(prev => [newVersion, ...prev]);
    setCurrentSong(newVersion);

    // 3. Trigger analysis for the NEW version immediately
    triggerBackgroundAnalysis(newVersion);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your song history?")) {
      setHistory([]);
      setCurrentSong(null);
    }
  };
  
  const handleSelectSong = (song: GeneratedSong) => {
    setCurrentSong(song);
    setIsInputPanelOpen(false);
  };

  // Find parent song if available
  const parentSong = currentSong?.parentId 
    ? history.find(h => h.id === currentSong.parentId) 
    : undefined;

  return (
    <div className="min-h-screen bg-suno-dark text-gray-100 font-sans selection:bg-suno-primary selection:text-white flex flex-col">
      {/* Navbar */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-suno-primary to-suno-accent flex items-center justify-center font-bold text-white">
              S
            </div>
            <span className="text-xl font-bold tracking-tight">Suno v5 <span className="text-suno-primary font-light">Architect</span></span>
          </div>
          <div className="text-xs text-gray-500 font-mono hidden md:block">
            Powered by Gemini 3.0 Pro
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 1. Unified Sidebar (Left) */}
        <Sidebar 
          history={history} 
          onSelectSong={handleSelectSong} 
          currentSongId={currentSong?.id}
          onClearHistory={handleClearHistory}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden relative">
          
          {/* 2. Input Column (Dynamic) */}
          {isInputPanelOpen && (
            <div className="flex-shrink-0 bg-black/10 border-r border-white/5 overflow-y-auto custom-scrollbar w-full max-w-4xl mx-auto border-none bg-transparent">
              <div className="p-4 md:p-8 max-w-3xl mx-auto">
                {currentSong && (
                   <button 
                      onClick={() => setIsInputPanelOpen(false)}
                      className="mb-4 flex items-center gap-2 text-xs text-gray-400 hover:text-white"
                   >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                      Back to Current Song
                   </button>
                )}
                <InputForm 
                  inputs={inputs} 
                  setInputs={setInputs} 
                  onSubmit={handleSubmit} 
                  loadingStatus={loadingStatus}
                />
                {error && (
                  <div className="mt-3 md:mt-4 p-3 md:p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-xs md:text-sm animate-pulse">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Result Column (Main View) */}
          {currentSong && !isInputPanelOpen && (
            <div className="flex-1 overflow-hidden bg-suno-surface/30 relative flex flex-col">
              {/* Header Bar with New Song Button */}
              <div className="flex-shrink-0 border-b border-white/5 bg-black/20 backdrop-blur-sm px-4 md:px-6 py-3 flex items-center justify-between z-20">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Song Details</h2>
                <button 
                  onClick={() => setIsInputPanelOpen(true)}
                  className="bg-suno-primary hover:bg-suno-primary/80 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  New Song
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
                <ResultDisplay 
                  key={currentSong.id}
                  song={currentSong} 
                  parentSong={parentSong}
                  onUpdateSong={handleUpdateSong}
                  onCreateVersion={handleCreateVersion}
                />
              </div>
            </div>
          )}
        </main>
      </div>
      <MiniPlayer />
      <FullPlayerView />
    </div>
  );
}
