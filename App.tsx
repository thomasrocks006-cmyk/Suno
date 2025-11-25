import React, { useState, useEffect, lazy, Suspense } from 'react';
import { generateSongAssets, generateSongVariations } from './services/geminiService';
import { runV5AnalysisPipeline, generateExecutionPlan, executeApprovedRewrite, V5AnalysisResult } from './services/v5AnalysisPipeline';
import { DebateTurn } from './services/realDebateEngine';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { Sidebar } from './components/Sidebar';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayerView } from './components/FullPlayerView';
import { SkeletonLoader } from './components/SkeletonLoader';
import AgentDebateModal from './components/AgentDebateModal';
import { WarRoom } from './components/WarRoom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SongInputs, GeneratedSong, StructureType, V5AnalysisState, V5DebateTurn, V5ExecutionPlan, AgentDebate } from './types';

// Lazy load heavy modal components for better initial bundle size
const ValidationDashboard = lazy(() => import('./components/ValidationDashboard').then(m => ({ default: m.ValidationDashboard })));
const LearningInsightsDashboard = lazy(() => import('./components/LearningInsightsDashboard').then(m => ({ default: m.LearningInsightsDashboard })));
const CostDashboard = lazy(() => import('./components/CostDashboard').then(m => ({ default: m.default })));

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
  commercialMode: false,
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
  const [showValidationDashboard, setShowValidationDashboard] = useState(false);
  const [showLearningDashboard, setShowLearningDashboard] = useState(false);
  const [showCostDashboard, setShowCostDashboard] = useState(false);
  
  // Agent Debate Modal state
  const [showDebateModal, setShowDebateModal] = useState(false);
  const [debateSong, setDebateSong] = useState<GeneratedSong | null>(null);
  
  // V5 Analysis State
  const [v5State, setV5State] = useState<V5AnalysisState>({
    phase: 'idle',
    progress: 0,
    statusMessage: '',
    debateTurns: []
  });
  
  // War Room State
  const [showWarRoom, setShowWarRoom] = useState(false);
  const [warRoomPlan, setWarRoomPlan] = useState<V5ExecutionPlan | null>(null);
  const [warRoomSong, setWarRoomSong] = useState<GeneratedSong | null>(null);
  
  // Ref to track current song ID for race condition fix (BUG-001)
  const currentSongIdRef = React.useRef<string | null>(null);
  
  // Update ref whenever currentSong changes
  React.useEffect(() => {
    currentSongIdRef.current = currentSong?.id || null;
  }, [currentSong]);

  // Handle persistence of history
  useEffect(() => {
    const savedHistory = localStorage.getItem('suno_architect_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Limit history to 50 songs to prevent memory issues (ISSUE-001 fix)
        const limitedHistory = parsed.slice(0, 50);
        setHistory(limitedHistory);
        if (limitedHistory.length > 0) {
          setCurrentSong(limitedHistory[0]);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    // Limit history to 50 songs before saving (ISSUE-001 fix)
    const limitedHistory = history.slice(0, 50);
    localStorage.setItem('suno_architect_history', JSON.stringify(limitedHistory));
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

  // Helper to run V5 analysis pipeline and update state
  const triggerBackgroundAnalysis = async (songToAnalyze: GeneratedSong) => {
    const analyzingSongId = songToAnalyze.id;
    
    // Initialize v5 state
    setV5State({
      phase: 'structural-scan',
      progress: 0,
      statusMessage: 'Starting structural scan...',
      debateTurns: []
    });
    
    // Show debate modal immediately for real-time updates
    setDebateSong(songToAnalyze);
    setShowDebateModal(true);
    
    try {
      // Run v5 analysis pipeline with progress callbacks
      const result = await runV5AnalysisPipeline(
        songToAnalyze,
        // Progress callback
        (phase, progress, detail) => {
          setV5State(prev => ({
            ...prev,
            phase: phase as V5AnalysisState['phase'],
            progress,
            statusMessage: detail || `${phase} (${progress}%)`
          }));
        },
        // Real-time debate turn callback
        (turn: DebateTurn) => {
          const v5Turn: V5DebateTurn = {
            agent: turn.agent,
            statement: turn.statement,
            type: turn.type,
            timestamp: turn.timestamp || Date.now(),
            citedLines: turn.citedLines
          };
          setV5State(prev => ({
            ...prev,
            debateTurns: [...prev.debateTurns, v5Turn]
          }));
        }
      );
      
      // Convert v5 result to legacy format for compatibility
      const legacyAnalysis = convertV5ToLegacyAnalysis(result);
      const legacyDebates = convertV5ToLegacyDebates(result);
      
      // Update the song with both v5 and legacy data
      const updatedSong: GeneratedSong = {
        ...songToAnalyze,
        analysis: legacyAnalysis,
        agentDebates: legacyDebates,
        v5Analysis: result as any // Store full v5 result
      };
      
      setHistory(prev => prev.map(s => s.id === songToAnalyze.id ? updatedSong : s));
      
      // Only update currentSong if user is still viewing it
      if (currentSongIdRef.current === analyzingSongId) {
        setCurrentSong(updatedSong);
        setDebateSong(updatedSong);
      }
      
      // Update v5 state to complete
      setV5State(prev => ({
        ...prev,
        phase: 'complete',
        progress: 100,
        statusMessage: 'Analysis complete!',
        result: result as any
      }));
      
    } catch (analysisError) {
      console.error("V5 analysis failed:", analysisError);
      setV5State(prev => ({
        ...prev,
        phase: 'error',
        statusMessage: 'Analysis failed',
        error: String(analysisError)
      }));
      setError("Analysis failed. Some features may be unavailable.");
      setShowDebateModal(false);
    }
  };
  
  // Convert V5 analysis to legacy SongAnalysis format for backward compatibility
  const convertV5ToLegacyAnalysis = (result: V5AnalysisResult) => {
    const deepAnalysis = result.deepAnalysis;
    return {
      overallScore: deepAnalysis.overallScore,
      projectedScore: deepAnalysis.projectedScore,
      summary: deepAnalysis.executiveSummary,
      scoreBreakdown: deepAnalysis.scoreBreakdown.map(s => ({
        category: s.category as any,
        score: s.score,
        reason: s.reasoning
      })),
      themeAnalysis: deepAnalysis.storyArcAnalysis.structure,
      storyArc: deepAnalysis.storyArcAnalysis.narrativeType,
      sonicAnalysis: {
        phonetics: deepAnalysis.phoneticAnalysis?.vowelFlowScore?.toString() || 'N/A',
        density: deepAnalysis.imageryAudit.abstractVsConcreteRatio.toString(),
        cinemaAudit: {
          score: deepAnalysis.imageryAudit.cinemaScore >= 8 ? 'A' : deepAnalysis.imageryAudit.cinemaScore >= 6 ? 'B' : 'C',
          objectCount: deepAnalysis.imageryAudit.concreteObjects.length,
          objects: deepAnalysis.imageryAudit.concreteObjects,
          analysis: deepAnalysis.imageryAudit.metaphorSystems.join(', ')
        }
      },
      strengths: deepAnalysis.topPriorities,
      weaknesses: deepAnalysis.quickWins,
      lineByLineImprovements: deepAnalysis.lineByLineImprovements.map(imp => ({
        original: imp.original,
        improved: imp.suggestion,
        reason: imp.rationale
      })),
      commercialViability: deepAnalysis.scoreBreakdown.find(s => s.category === 'Commercial Potential')?.reasoning || 'N/A',
      consensusStrengths: deepAnalysis.topPriorities
    };
  };
  
  // Convert V5 debate transcript to legacy AgentDebate format
  const convertV5ToLegacyDebates = (result: V5AnalysisResult): AgentDebate[] => {
    const debates = result.debateTranscript.topics || [];
    return debates.map((topic: any) => ({
      issue: topic.topic,
      votes: topic.turns?.slice(0, 5).map((turn: any) => ({
        agent: turn.agent,
        position: (turn.type === 'agreement' ? 'SUPPORT' : turn.type === 'counter' ? 'OPPOSE' : 'COMPROMISE') as 'SUPPORT' | 'OPPOSE' | 'COMPROMISE',
        reasoning: turn.statement
      })) || [],
      resolution: {
        decision: (topic.outcome === 'consensus' ? 'KEEP' : 'COMPROMISE') as 'KEEP' | 'CHANGE' | 'COMPROMISE',
        rationale: topic.keyAgreements?.join('; ') || 'No resolution'
      }
    }));
  };
  
  // Handler for War Room approval
  const handleWarRoomApprove = async (approvedPlan: V5ExecutionPlan) => {
    if (!warRoomSong) return;
    
    setShowWarRoom(false);
    setLoadingStatus('Executing rewrite...');
    
    try {
      const rewriteResult = await executeApprovedRewrite(
        warRoomSong.lyrics,
        approvedPlan as any,
        warRoomSong.v5Analysis?.structuralScan,
        warRoomSong.v5Analysis?.judgeSummary,
        (phase, progress, detail) => {
          setLoadingStatus(`${phase}: ${detail || progress + '%'}`);
        }
      );
      
      // Create new version with rewritten lyrics
      const newVersion: GeneratedSong = {
        ...warRoomSong,
        id: crypto.randomUUID(),
        parentId: warRoomSong.id,
        title: warRoomSong.title.replace(/\s\(V\d+\)/, '') + ` (V${getVersionNumber(warRoomSong) + 1})`,
        createdAt: Date.now(),
        lyrics: rewriteResult.rewriteResult.rewrittenLyrics,
        v5ExecutionPlan: approvedPlan,
        v5RewriteResult: rewriteResult.rewriteResult as any,
        v5AuditReport: rewriteResult.auditReport as any,
        analysis: undefined // Clear old analysis
      };
      
      setHistory(prev => [newVersion, ...prev]);
      setCurrentSong(newVersion);
      
      // Trigger analysis on the new version
      triggerBackgroundAnalysis(newVersion);
      
    } catch (error) {
      console.error('Rewrite failed:', error);
      setError('Rewrite failed. Please try again.');
    } finally {
      setLoadingStatus(null);
      setWarRoomPlan(null);
      setWarRoomSong(null);
    }
  };
  
  // Helper to get version number from title
  const getVersionNumber = (song: GeneratedSong): number => {
    const match = song.title.match(/\(V(\d+)\)/);
    return match ? parseInt(match[1]) : 1;
  };
  
  // Handler to open War Room with execution plan
  const handleOpenWarRoom = async (song: GeneratedSong) => {
    if (!song.v5Analysis) {
      setError('No analysis available. Please wait for analysis to complete.');
      return;
    }
    
    setLoadingStatus('Generating execution plan...');
    
    try {
      const plan = await generateExecutionPlan(song.v5Analysis as any, song);
      setWarRoomPlan(plan as any);
      setWarRoomSong(song);
      setShowWarRoom(true);
    } catch (error) {
      console.error('Plan generation failed:', error);
      setError('Failed to generate execution plan.');
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

  const handleCreateVersion = (
    baseSong: GeneratedSong, 
    newLyrics: string, 
    technicalExplanation: string,
    advancedLogic: boolean,
    metaphorLogic: boolean,
    commercialMode: boolean
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
      hasCommercialMode: commercialMode,
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCostDashboard(true)}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-900/30 hover:bg-green-900/50 text-green-300 text-xs font-semibold transition-colors"
              title="View Cost Dashboard"
            >
              💰 Costs
            </button>
            <button
              onClick={() => setShowLearningDashboard(true)}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 text-xs font-semibold transition-colors"
              title="View Learning Insights"
            >
              🧠 Learning
            </button>
            <button
              onClick={() => setShowValidationDashboard(true)}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 text-xs font-semibold transition-colors"
              title="Quality Validation Study"
            >
              🔬 Validation
            </button>
            <div className="text-xs text-gray-500 font-mono hidden lg:block ml-2">
              Powered by Gemini 3.0 Pro
            </div>
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
          currentInputs={inputs}
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
          
          {/* Empty State - No Songs Yet */}
          {!currentSong && !isInputPanelOpen && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-6">🎵</div>
                <h2 className="text-2xl font-bold text-white mb-3">Ready to create?</h2>
                <p className="text-gray-400 mb-6">
                  Start by generating your first song or select one from the history sidebar.
                </p>
                <button 
                  onClick={() => setIsInputPanelOpen(true)}
                  className="bg-suno-primary hover:bg-suno-primary/80 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  Create New Song
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <MiniPlayer />
      <FullPlayerView />
      
      {/* Modal Overlays */}
      {showCostDashboard && (
        <Suspense fallback={<SkeletonLoader type="dashboard" />}>
          <CostDashboard onClose={() => setShowCostDashboard(false)} />
        </Suspense>
      )}
      {showValidationDashboard && (
        <Suspense fallback={<SkeletonLoader type="dashboard" />}>
          <ValidationDashboard onClose={() => setShowValidationDashboard(false)} />
        </Suspense>
      )}
      {showLearningDashboard && (
        <Suspense fallback={<SkeletonLoader type="dashboard" />}>
          <LearningInsightsDashboard onClose={() => setShowLearningDashboard(false)} />
        </Suspense>
      )}
      
      {/* Agent Debate Modal - Shows during analysis */}
      {showDebateModal && debateSong && (
        <ErrorBoundary fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 max-w-md text-center">
              <span className="text-5xl mb-4 block">⚠️</span>
              <h3 className="text-xl font-bold text-white mb-2">Analysis Error</h3>
              <p className="text-gray-300 mb-4">The agent debate system encountered an error</p>
              <button
                onClick={() => setShowDebateModal(false)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        }>
          <AgentDebateModal
            isOpen={showDebateModal}
            onClose={() => setShowDebateModal(false)}
            song={debateSong}
            debates={debateSong.agentDebates || []}
            consensusItems={debateSong.analysis?.consensusStrengths || []}
            onComplete={() => {
              setShowDebateModal(false);
            }}
            // V5 props for real-time streaming
            v5State={v5State}
            onOpenWarRoom={() => handleOpenWarRoom(debateSong)}
          />
        </ErrorBoundary>
      )}
      
      {/* War Room Modal - For approving execution plan */}
      {showWarRoom && warRoomPlan && warRoomSong && (
        <ErrorBoundary fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 max-w-md text-center">
              <span className="text-5xl mb-4 block">⚠️</span>
              <h3 className="text-xl font-bold text-white mb-2">War Room Error</h3>
              <p className="text-gray-300 mb-4">Failed to load the execution plan</p>
              <button
                onClick={() => setShowWarRoom(false)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        }>
          <WarRoom
            plan={warRoomPlan as any}
            songTitle={warRoomSong.title}
            originalLyrics={warRoomSong.lyrics}
            onApprove={handleWarRoomApprove as any}
            onCancel={() => {
              setShowWarRoom(false);
              setWarRoomPlan(null);
              setWarRoomSong(null);
            }}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}
