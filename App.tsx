
import React, { useState, useEffect } from 'react';
import { generateSongAssets, analyzeGeneratedSong, generateSongVariations } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { TipsSidebar } from './components/TipsSidebar';
import { SongHistorySidebar } from './components/SongHistorySidebar';
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
  centralMetaphorLogic: false
};

export default function App() {
  const [inputs, setInputs] = useState<SongInputs>(INITIAL_INPUTS);
  const [history, setHistory] = useState<GeneratedSong[]>([]);
  const [currentSong, setCurrentSong] = useState<GeneratedSong | null>(null);
  
  // Replaced boolean isLoading with string status to show progress stages
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      
      // 2. Run Deep Analysis automatically
      setLoadingStatus('Deep Analysis (Gemini 3.0 Pro)...');
      try {
        const analysis = await analyzeGeneratedSong(newSong);
        newSong.analysis = analysis;
      } catch (analysisError) {
        console.warn("Auto-analysis failed:", analysisError);
        // Continue without analysis if it fails
      }

      // 3. Generate Variations automatically
      setLoadingStatus('Dreaming Variations...');
      try {
        const variations = await generateSongVariations(newSong);
        newSong.variations = variations;
      } catch (varError) {
        console.warn("Auto-variations failed:", varError);
        // Continue without variations if it fails
      }

      // Save complete object
      setHistory(prev => [newSong, ...prev]);
      setCurrentSong(newSong);
    } catch (err) {
      setError("Failed to generate song assets. Please check your API key and try again.");
      console.error(err);
    } finally {
      setLoadingStatus(null);
    }
  };

  const handleUpdateSong = (updatedSong: GeneratedSong) => {
    // Update the song in history and current view (In-place update)
    const newHistory = history.map(s => s.id === updatedSong.id ? updatedSong : s);
    setHistory(newHistory);
    setCurrentSong(updatedSong);
  };

  const handleCreateVersion = (baseSong: GeneratedSong, newLyrics: string, technicalExplanation: string) => {
    // Create a new V2 song entry
    const newVersion: GeneratedSong = {
      ...baseSong,
      id: crypto.randomUUID(),
      title: `${baseSong.title} (V2 - Deep Analysis)`,
      createdAt: Date.now(),
      lyrics: newLyrics,
      technicalExplanation: technicalExplanation,
      // Clear analysis and variations as they apply to the old lyrics
      analysis: undefined,
      variations: undefined
    };

    setHistory(prev => [newVersion, ...prev]);
    setCurrentSong(newVersion);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your song history?")) {
      setHistory([]);
      setCurrentSong(null);
    }
  };

  return (
    <div className="min-h-screen bg-suno-dark text-gray-100 font-sans selection:bg-suno-primary selection:text-white flex flex-col">
      {/* Navbar */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
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

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 md:px-6 flex flex-col lg:flex-row gap-6">
        {/* 1. History Sidebar (Left) */}
        <SongHistorySidebar 
          history={history} 
          onSelectSong={setCurrentSong} 
          currentSongId={currentSong?.id}
          onClearHistory={handleClearHistory}
        />

        {/* 2. Input Column (Middle-Left) */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <InputForm 
            inputs={inputs} 
            setInputs={setInputs} 
            onSubmit={handleSubmit} 
            loadingStatus={loadingStatus}
          />
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm animate-pulse">
              {error}
            </div>
          )}
        </div>

        {/* 3. Result Column (Middle-Right/Main) */}
        <div className="w-full flex-grow min-h-[600px] lg:h-[calc(100vh-8rem)]">
          {currentSong ? (
            <ResultDisplay 
              song={currentSong} 
              onUpdateSong={handleUpdateSong}
              onCreateVersion={handleCreateVersion}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-suno-card rounded-2xl border border-white/10 border-dashed text-center p-8 opacity-50">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                 <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                 </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">Studio Ready</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                Fill out the form to generate your next track, or select a song from history.
              </p>
            </div>
          )}
        </div>

        {/* 4. Tips (Far Right - Desktop only) */}
        <TipsSidebar />
      </main>
    </div>
  );
}
