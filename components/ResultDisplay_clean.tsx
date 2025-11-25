
import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { GeneratedSong, SongVariation, SongAnalysis, SunoModel, ChatMessage, RewritePlanProposal } from '../types';
import { analyzeGeneratedSong, generateSongVariations, rewriteSongWithImprovements, generateRewritePlan, chatWithAnalysisAgent } from '../services/geminiService';
import { generateSongFromArchitect, checkTaskStatus } from '../services/sunoService';
import { fetchDNAMatchLyrics } from '../services/dnaLyricsFetchService';
import { analyzeAgentCoverage, type AgentCoverageReport } from '../services/agentCoverageService';
import { ComparisonView } from './ComparisonView';
import { FloatingAnalysisAgent } from './FloatingAnalysisAgent';
import { SongMetadataCard } from './SongMetadataCard';
import { TabNavigation } from './TabNavigation';
import { LyricsView } from './LyricsView';
import { AnalysisView } from './AnalysisView';
import { AudioGenerationView } from './AudioGenerationView';
import { VariationsView } from './VariationsView';

interface ResultDisplayProps {
  song: GeneratedSong;
  parentSong?: GeneratedSong;
  onUpdateSong: (updatedSong: GeneratedSong) => void;
  onCreateVersion: (baseSong: GeneratedSong, newLyrics: string, technicalExplanation: string, advancedLogic: boolean, metaphorLogic: boolean, commercialMode: boolean) => void;
}

type Tab = 'lyrics' | 'analysis' | 'variations' | 'audio';

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

const MODELS: { value: SunoModel; label: string; desc: string }[] = [
  { value: 'V3_5', label: 'v3.5', desc: 'Fast, Creative' },
  { value: 'V4', label: 'v4.0', desc: 'High Quality' },
  { value: 'V5', label: 'v5.0', desc: 'Newest, Best Audio' },
];

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ song, parentSong, onUpdateSong, onCreateVersion }) => {
  const { playSong, currentSong: globalCurrentSong, isPlaying } = useAudio();
  const [activeTab, setActiveTab] = useState<Tab>('lyrics');
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Smart Editor State
  const [editingLineIndex, setEditingLineIndex] = useState<number | null>(null);
  const [isSmartEditorOpen, setIsSmartEditorOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Rewrite Options
  const [useAdvancedLogic, setUseAdvancedLogic] = useState(song.hasAdvancedLogic);
  const [useMetaphorLogic, setUseMetaphorLogic] = useState(song.hasMetaphorLogic);
  const [useCommercialMode, setUseCommercialMode] = useState(song.hasCommercialMode);
  const [useAgentDebate, setUseAgentDebate] = useState(false); // Dual-agent debate system

  // Audio Generation Options
  const [selectedModel, setSelectedModel] = useState<SunoModel>(song.model || 'V4');
  const [isInstrumental, setIsInstrumental] = useState<boolean>(song.instrumental || false);

  // Floating Agent State
  const [isAgentVisible, setIsAgentVisible] = useState(false);
  const [agentFocusedSection, setAgentFocusedSection] = useState<'score' | 'lyrics' | 'sonic' | 'dnaMatch' | 'lineByLine' | 'general'>('general');
  const [highlightedText, setHighlightedText] = useState('');

  // Rewrite Plan State
  const [proposedPlan, setProposedPlan] = useState<RewritePlanProposal | null>(song.proposedPlan || null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [expandedScoreItem, setExpandedScoreItem] = useState<number | null>(null);
  
  // DNA Lyrics Fetching State
  const [isFetchingDNALyrics, setIsFetchingDNALyrics] = useState(false);
  const [dnaLyricsError, setDNALyricsError] = useState<string | null>(null);
  
  // Agent Coverage Report State
  const [coverageReport, setCoverageReport] = useState<AgentCoverageReport | null>(null);

  useEffect(() => {
    setSelectedModel(song.model || 'V4');
    setIsInstrumental(song.instrumental || false);
  }, [song.id, song.model, song.instrumental]);
  
  // Calculate coverage when plan is available
  useEffect(() => {
    if (proposedPlan) {
      const report = analyzeAgentCoverage(proposedPlan);
      setCoverageReport(report);
    }
  }, [proposedPlan]);

  useEffect(() => {
      // Update toggles if advice comes in
      if (song.analysis?.rewriteAdvice) {
          setUseAdvancedLogic(song.analysis.rewriteAdvice.shouldUseAdvancedLogic);
          setUseMetaphorLogic(song.analysis.rewriteAdvice.shouldUseMetaphorLogic);
      }
      
      // AUTO-GENERATE PLAN: When analysis completes, immediately generate execution plan
      if (song.analysis && !song.proposedPlan && !proposedPlan && !isGeneratingPlan) {
          console.log('[ResultDisplay] Analysis complete - auto-generating execution plan...');
          handleGeneratePlan();
      }
  }, [song.analysis]);

  // Auto-analyze V2+ songs (songs with parentId) to generate comparison review
  useEffect(() => {
    if (song.parentId && parentSong && !song.analysis) {
      console.log('[ResultDisplay] Auto-analyzing V2+ song for comparison...');
      handleAnalyze();
    }
  }, [song.id, song.parentId]);

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
      const updatedData = await rewriteSongWithImprovements(song, useAdvancedLogic, useMetaphorLogic, useCommercialMode);
      onCreateVersion(song, updatedData.lyrics, updatedData.technicalExplanation, useAdvancedLogic, useMetaphorLogic, useCommercialMode);
      setActiveTab('lyrics'); 
    } catch (e) {
      console.error(e);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      // TODO: Integrate chat insights when chat system is implemented
      const chatInsights: string[] = [];
      
      const plan = await generateRewritePlan(song, useAdvancedLogic, useMetaphorLogic, useCommercialMode, chatInsights);
      setProposedPlan(plan);
      onUpdateSong({ ...song, proposedPlan: plan });
    } catch (e) {
      console.error('Plan generation failed:', e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };
  
  const handleFetchDNALyrics = async () => {
    if (!song.analysis?.dnaMatch) return;
    setIsFetchingDNALyrics(true);
    setDNALyricsError(null);
    try {
      const updatedMatch = await fetchDNAMatchLyrics(song.analysis.dnaMatch);
      const updatedAnalysis = { ...song.analysis, dnaMatch: updatedMatch };
      onUpdateSong({ ...song, analysis: updatedAnalysis });
    } catch (e: any) {
      console.error('DNA lyrics fetch failed:', e);
      setDNALyricsError(e.message || 'Failed to fetch lyrics');
    } finally {
      setIsFetchingDNALyrics(false);
    }
  };

  const handleApprovePlan = async () => {
    if (!proposedPlan) return;
    setIsRewriting(true);
    try {
      // Execute the approved plan by creating a V2
      const updatedData = await rewriteSongWithImprovements(song, useAdvancedLogic, useMetaphorLogic, useCommercialMode);
      onCreateVersion(song, updatedData.lyrics, updatedData.technicalExplanation, useAdvancedLogic, useMetaphorLogic, useCommercialMode);
      setActiveTab('lyrics');
    } catch (e) {
      console.error(e);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleRejectPlan = () => {
    setProposedPlan(null);
    onUpdateSong({ ...song, proposedPlan: null });
  };

  const handleGenerateAudio = async () => {
    if (song.sunoTaskId) return; // Already generated or generating
    setIsGeneratingAudio(true);
    setGenerationError(null);
    try {
      // Update song with latest choices before generating
      const updatedSong = { ...song, model: selectedModel, instrumental: isInstrumental };
      onUpdateSong(updatedSong);

      const taskId = await generateSongFromArchitect(updatedSong);
      onUpdateSong({ ...updatedSong, sunoTaskId: taskId, audioStatus: 'PENDING' });
      setActiveTab('audio');
    } catch (e: any) {
      console.error("Audio generation failed:", e);
      const errorMessage = e?.message || "Unknown error occurred";
      setGenerationError(errorMessage);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Poll for audio status
  useEffect(() => {
    if (song.sunoTaskId && (song.audioStatus === 'PENDING' || song.audioStatus === 'GENERATING' || song.audioStatus === 'TEXT_SUBMITTING' || song.audioStatus === 'TEXT_SUCCESS')) {
      console.log('[Audio] Starting polling for task:', song.sunoTaskId);
      const interval = setInterval(async () => {
        try {
          const statusData = await checkTaskStatus(song.sunoTaskId!);
          console.log('[Audio] Status update:', statusData.status, 'TaskID:', statusData.taskId);
          
          // TEXT_SUCCESS means generation is complete
          if ((statusData.status === 'SUCCESS' || statusData.status === 'TEXT_SUCCESS') && statusData.response?.sunoData?.[0]) {
            const audioData = statusData.response.sunoData[0];
            // Use streamAudioUrl if audioUrl is empty
            const finalAudioUrl = audioData.audioUrl || audioData.streamAudioUrl;
            const actualModel = audioData.model; // Capture the actual model used
            console.log('[Audio] SUCCESS! Audio URL:', finalAudioUrl);
            console.log('[Audio] 🎵 VERIFIED MODEL USED:', actualModel);
            if (finalAudioUrl) {
              onUpdateSong({ 
                ...song, 
                audioStatus: 'SUCCESS', 
                audioUrl: finalAudioUrl,
                actualModel: actualModel // Store the verified model
              });
              clearInterval(interval);
            } else {
              console.warn('[Audio] No audio URL available yet, continuing to poll...');
            }
          } else if (statusData.status === 'FAILED') {
            console.error('[Audio] Generation FAILED. Error:', statusData.errorMessage);
            onUpdateSong({ ...song, audioStatus: 'FAILED' });
            clearInterval(interval);
          } else {
             // Still generating, update status if needed
             if (song.audioStatus !== statusData.status) {
                 console.log('[Audio] Status changed to:', statusData.status);
                 onUpdateSong({ ...song, audioStatus: statusData.status as any });
             }
          }
        } catch (e: any) {
          console.error("[Audio] Error checking status:", e);
        }
      }, 5000); // Check every 5 seconds

      return () => {
        console.log('[Audio] Stopping polling');
        clearInterval(interval);
      };
    }
  }, [song.sunoTaskId, song.audioStatus]);

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

  if (!song || !song.lyrics) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="text-red-400 text-xl font-bold mb-2">Song Data Error</div>
            <p className="text-gray-400">The song data seems to be incomplete. Please try generating again.</p>
            <button 
                onClick={() => onUpdateSong({ ...song, lyrics: "[Lyrics missing]" })}
                className="mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded"
            >
                Attempt to Render Anyway
            </button>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {isRewriting && <CreativeForgeLoader />}
      {isComparisonOpen && parentSong ? (
          <ComparisonView 
            currentSong={song} 
            parentSong={parentSong} 
            onClose={() => {
              console.log('[ResultDisplay] Closing comparison view');
              setIsComparisonOpen(false);
            }} 
          />
      ) : isComparisonOpen ? (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center">
            <div className="bg-red-500/20 border border-red-500 p-6 rounded-xl text-white">
              <h3 className="font-bold mb-2">Error: No Parent Song</h3>
              <p className="text-sm mb-4">Cannot show comparison without a parent song.</p>
              <button 
                onClick={() => setIsComparisonOpen(false)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
      ) : null}
      
      {/* Top Card: Metadata & Cover */}
      <SongMetadataCard song={song} />

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        song={song}
        isSmartEditorOpen={isSmartEditorOpen}
        onTabChange={setActiveTab}
        onAnalyzeClick={handleAnalyze}
        getScoreColor={getScoreColor}
      />

      {/* Tab Content */}
      <div className="flex-grow overflow-hidden relative flex flex-col">

        
        {/* TAB: AUDIO */}
        {activeTab === 'audio' && (
          <AudioGenerationView
            song={song}
            selectedModel={selectedModel}
            isInstrumental={isInstrumental}
            isGeneratingAudio={isGeneratingAudio}
            generationError={generationError}
            onModelChange={setSelectedModel}
            onInstrumentalToggle={() => setIsInstrumental(!isInstrumental)}
            onGenerateAudio={handleGenerateAudio}
            onUpdateSong={onUpdateSong}
          />
        )}

        {/* TAB: LYRICS */}
        {activeTab === 'lyrics' && (
          <LyricsView
            song={song}
            isSmartEditorOpen={isSmartEditorOpen}
            editingLineIndex={editingLineIndex}
            onToggleSmartEditor={() => setIsSmartEditorOpen(!isSmartEditorOpen)}
            onLineClick={setEditingLineIndex}
            onSmartEditSave={handleSmartEditSave}
            onCancelEdit={() => setEditingLineIndex(null)}
            onTextHighlight={(text) => {
              setHighlightedText(text);
              setIsAgentVisible(true);
              setAgentFocusedSection('lyrics');
            }}
          />
        )}

        {/* TAB: ANALYSIS */}
        {activeTab === 'analysis' && (
          <AnalysisView
            song={song}
            parentSong={parentSong}
            proposedPlan={proposedPlan}
            coverageReport={coverageReport}
            expandedScoreItem={expandedScoreItem}
            useAdvancedLogic={useAdvancedLogic}
            useMetaphorLogic={useMetaphorLogic}
            useCommercialMode={useCommercialMode}
            useAgentDebate={useAgentDebate}
            isGeneratingPlan={isGeneratingPlan}
            isFetchingDNALyrics={isFetchingDNALyrics}
            dnaLyricsError={dnaLyricsError}
            v5Analysis={song.v5Analysis}
            onExpandScoreItem={setExpandedScoreItem}
            onToggleAdvancedLogic={() => setUseAdvancedLogic(!useAdvancedLogic)}
            onToggleMetaphorLogic={() => setUseMetaphorLogic(!useMetaphorLogic)}
            onToggleCommercialMode={() => setUseCommercialMode(!useCommercialMode)}
            onToggleAgentDebate={() => setUseAgentDebate(!useAgentDebate)}
            onGeneratePlan={handleGeneratePlan}
            onApprovePlan={handleApprovePlan}
            onRejectPlan={handleRejectPlan}
            onFetchDNALyrics={handleFetchDNALyrics}
            onTextHighlight={(text) => {
              setHighlightedText(text);
              setIsAgentVisible(true);
              setAgentFocusedSection('general');
            }}
            onShowComparison={() => setIsComparisonOpen(true)}
            getScoreColor={getScoreColor}
          />
        )}

        {/* TAB: VARIATIONS */}
        {activeTab === 'variations' && (
          <VariationsView
            song={song}
            isGeneratingVariations={isGeneratingVariations}
            onGenerateVariations={handleGenerateVariations}
          />
        )}
      </div>
      {/* Floating Analysis Agent - Orchestrator */}
      <FloatingAnalysisAgent
        song={song}
        onUpdateSong={onUpdateSong}
        onPlanUpdate={(plan) => {
          setProposedPlan(plan);
          onUpdateSong({ ...song, proposedPlan: plan });
        }}
        isVisible={isAgentVisible}
        onToggle={() => setIsAgentVisible(!isAgentVisible)}
        focusedSection={agentFocusedSection}
        highlightedText={highlightedText}
        onClearHighlight={() => setHighlightedText('')}
      />
    </div>
  );
};
