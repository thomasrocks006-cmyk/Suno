import React, { useState } from 'react';
import { GeneratedSong, RewritePlanProposal, V5AnalysisResult } from '../types';
import { type AgentCoverageReport } from '../services/agentCoverageService';
import { SongInsightsPanel } from './SongInsightsPanel';
import { V5DeepAnalysisSection } from './V5DeepAnalysisSection';
import { ScoreBreakdownSection } from './ScoreBreakdownSection';
import { SonicAnalysisSection } from './SonicAnalysisSection';
import { RewriteStudioSection } from './RewriteStudioSection';

interface ProgressBarProps {
  isRunning: boolean;
  label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isRunning, label }) => {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
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

interface AnalysisViewProps {
  song: GeneratedSong;
  parentSong?: GeneratedSong;
  proposedPlan: RewritePlanProposal | null;
  coverageReport: AgentCoverageReport | null;
  expandedScoreItem: number | null;
  useAdvancedLogic: boolean;
  useMetaphorLogic: boolean;
  useCommercialMode: boolean;
  useAgentDebate: boolean;
  isGeneratingPlan: boolean;
  isFetchingDNALyrics: boolean;
  dnaLyricsError: string | null;
  v5Analysis?: V5AnalysisResult | null;
  onExpandScoreItem: (index: number | null) => void;
  onToggleAdvancedLogic: () => void;
  onToggleMetaphorLogic: () => void;
  onToggleCommercialMode: () => void;
  onToggleAgentDebate: () => void;
  onGeneratePlan: () => void;
  onApprovePlan: () => void;
  onRejectPlan: () => void;
  onFetchDNALyrics: () => void;
  onTextHighlight: (text: string) => void;
  onShowComparison: () => void;
  getScoreColor: (score: number) => string;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  song,
  parentSong,
  proposedPlan,
  coverageReport,
  expandedScoreItem,
  useAdvancedLogic,
  useMetaphorLogic,
  useCommercialMode,
  useAgentDebate,
  isGeneratingPlan,
  isFetchingDNALyrics,
  dnaLyricsError,
  v5Analysis,
  onExpandScoreItem,
  onToggleAdvancedLogic,
  onToggleMetaphorLogic,
  onToggleCommercialMode,
  onToggleAgentDebate,
  onGeneratePlan,
  onApprovePlan,
  onRejectPlan,
  onFetchDNALyrics,
  onTextHighlight,
  onShowComparison,
  getScoreColor
}) => {
  const hasV5Analysis = !!v5Analysis?.deepAnalysis;
  
  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar p-3 md:p-6">
      {!song.analysis ? (
        <ProgressBar isRunning={true} label="Analyzing Structure..." />
      ) : (
        <div className="space-y-3 md:space-y-6 animate-fade-in pb-12 md:pb-20">
          
          {/* 5-Agent System Info Banner */}
          <AgentSystemBanner />

          {/* V5 Deep Analysis Report (8-Agent Architecture) */}
          {hasV5Analysis && v5Analysis?.deepAnalysis && (
            <V5DeepAnalysisSection
              v5Analysis={v5Analysis.deepAnalysis}
              expandedScoreItem={expandedScoreItem}
              onExpandScoreItem={onExpandScoreItem}
            />
          )}

          {/* Agent Coverage Report */}
          {coverageReport && (
            <AgentCoverageDisplay coverageReport={coverageReport} />
          )}

          {/* Song Insights Panel */}
          <div className="bg-gradient-to-br from-purple-900/10 to-blue-900/10 p-4 md:p-6 rounded-lg border border-purple-500/10">
            <SongInsightsPanel song={song} />
          </div>

          {/* Score Breakdown Section */}
          <ScoreBreakdownSection
            song={song}
            parentSong={parentSong}
            expandedScoreItem={expandedScoreItem}
            onExpandScoreItem={onExpandScoreItem}
            onShowComparison={onShowComparison}
            onTextHighlight={onTextHighlight}
            getScoreColor={getScoreColor}
          />

          {/* Sonic Analysis Section */}
          <SonicAnalysisSection
            song={song}
            isFetchingDNALyrics={isFetchingDNALyrics}
            dnaLyricsError={dnaLyricsError}
            onFetchDNALyrics={onFetchDNALyrics}
            onTextHighlight={onTextHighlight}
          />

          {/* Rewrite Studio Section */}
          <RewriteStudioSection
            song={song}
            parentSong={parentSong}
            proposedPlan={proposedPlan}
            isGeneratingPlan={isGeneratingPlan}
            useAdvancedLogic={useAdvancedLogic}
            useMetaphorLogic={useMetaphorLogic}
            useCommercialMode={useCommercialMode}
            useAgentDebate={useAgentDebate}
            onToggleAdvancedLogic={onToggleAdvancedLogic}
            onToggleMetaphorLogic={onToggleMetaphorLogic}
            onToggleCommercialMode={onToggleCommercialMode}
            onToggleAgentDebate={onToggleAgentDebate}
            onGeneratePlan={onGeneratePlan}
            onApprovePlan={onApprovePlan}
            onRejectPlan={onRejectPlan}
            onTextHighlight={onTextHighlight}
          />
        </div>
      )}
    </div>
  );
};

// Sub-component: 5-Agent System Banner
const AgentSystemBanner: React.FC = () => (
  <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-lg p-3 md:p-4">
    <div className="flex items-start gap-3">
      <span className="text-2xl">{'🎭'}</span>
      <div className="flex-grow">
        <h4 className="text-sm font-bold text-white mb-1">5-Agent Specialized Analysis</h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          Your song was analyzed by 5 specialized AI agents in parallel, each bringing unique expertise. 
          Scores are evidence-based and grounded in music industry research.
        </p>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[10px]">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded p-2">
            <span className="font-bold text-purple-400">{'✍️'} Lyricist:</span>
            <span className="text-gray-300 ml-1">Word craft, clichés, originality</span>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2">
            <span className="font-bold text-blue-400">{'📖'} Storyteller:</span>
            <span className="text-gray-300 ml-1">Narrative, imagery, emotion, themes</span>
          </div>
          <div className="bg-pink-500/10 border border-pink-500/20 rounded p-2">
            <span className="font-bold text-pink-400">{'🎤'} Vocal Coach:</span>
            <span className="text-gray-300 ml-1">Singability, breath, phonetics</span>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
            <span className="font-bold text-green-400">{'🎚️'} Producer:</span>
            <span className="text-gray-300 ml-1">Structure, pacing, sonic texture</span>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
            <span className="font-bold text-yellow-400">{'⭐'} Hitmaker:</span>
            <span className="text-gray-300 ml-1">Hook factor, commercial appeal</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Sub-component: Agent Coverage Display
const AgentCoverageDisplay: React.FC<{ coverageReport: AgentCoverageReport }> = ({ coverageReport }) => (
  <div className="bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border border-cyan-500/30 rounded-lg p-4">
    <div className="flex items-start gap-3 mb-3">
      <span className="text-2xl">{'📊'}</span>
      <div className="flex-grow">
        <h4 className="text-sm font-bold text-cyan-300 mb-1">Agent Coverage Analysis</h4>
        <p className="text-xs text-gray-300">Quality assurance for rewrite plan</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-cyan-400">{coverageReport.coveragePercentage}%</div>
        <div className="text-xs text-gray-400">Reviewed</div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="bg-black/30 rounded p-3 border border-cyan-500/20">
        <div className="text-xs font-bold text-cyan-400 mb-2">Agent Participation</div>
        <div className="space-y-1 text-xs">
          {Object.entries(coverageReport.agentParticipation).map(([agent, lines]) => (
            <div key={agent} className="flex justify-between">
              <span className="text-gray-300">{agent}:</span>
              <span className="text-white font-medium">{lines}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-black/30 rounded p-3 border border-cyan-500/20">
        <div className="text-xs font-bold text-cyan-400 mb-2">
          Uncovered {coverageReport.uncoveredLines.length > 0 && `(${coverageReport.uncoveredLines.length})`}
        </div>
        {coverageReport.uncoveredLines.length === 0 ? (
          <div className="text-xs text-green-400">{'\u2713'} All reviewed</div>
        ) : (
          <div className="space-y-1 text-xs max-h-24 overflow-y-auto">
            {coverageReport.uncoveredLines.slice(0, 3).map((item, i) => (
              <div key={i} className="text-gray-300 text-[10px]">
                L{item.lineNumber}: {item.reason}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-black/30 rounded p-3 border border-cyan-500/20">
        <div className="text-xs font-bold text-cyan-400 mb-2">
          Debates {coverageReport.debateHotspots.length > 0 && `(${coverageReport.debateHotspots.length})`}
        </div>
        {coverageReport.debateHotspots.length === 0 ? (
          <div className="text-xs text-gray-400">No disagreements</div>
        ) : (
          <div className="space-y-1 text-xs max-h-24 overflow-y-auto">
            {coverageReport.debateHotspots.slice(0, 3).map((item, i) => (
              <div key={i} className="text-gray-300 text-[10px]">
                L{item.lineNumber}: {item.agentCount} agents
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
