import React from 'react';
import { V5DeepAnalysisReport } from '../types';

interface V5DeepAnalysisSectionProps {
  v5Analysis: V5DeepAnalysisReport;
  expandedScoreItem: number | null;
  onExpandScoreItem: (index: number | null) => void;
}

/**
 * V5 Deep Analysis Section
 * Displays the 8-agent system analysis results including:
 * - 10-category score grid
 * - Story arc visualization
 * - Phonetic flow analysis
 * - Imagery & sensory audit
 */
export const V5DeepAnalysisSection: React.FC<V5DeepAnalysisSectionProps> = ({
  v5Analysis: deepAnalysis,
  expandedScoreItem,
  onExpandScoreItem
}) => {
  if (!deepAnalysis) return null;

  return (
    <div className="bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-indigo-900/30 border border-purple-500/30 rounded-xl p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">{'🔬'}</span>
        <div>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            V5 Deep Analysis Report
            <span className="text-xs bg-purple-600 px-2 py-0.5 rounded-full">8-AGENT SYSTEM</span>
          </h4>
          <p className="text-xs text-gray-400 mt-1">Comprehensive multi-dimensional song analysis</p>
        </div>
      </div>

      {/* 10 Score Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {deepAnalysis.scoreBreakdown.map((scoreItem, idx) => (
          <div 
            key={idx}
            className="bg-black/40 rounded-lg p-3 border border-white/10 text-center hover:border-purple-500/50 transition-all cursor-pointer"
            onClick={() => onExpandScoreItem(expandedScoreItem === idx ? null : idx)}
          >
            <div className={`text-2xl font-bold ${
              scoreItem.score >= 8 ? 'text-green-400' :
              scoreItem.score >= 6 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {scoreItem.score}
            </div>
            <div className="text-xs text-gray-400 mt-1 leading-tight">{scoreItem.category}</div>
          </div>
        ))}
      </div>

      {/* Expanded Score Details */}
      {expandedScoreItem !== null && deepAnalysis.scoreBreakdown[expandedScoreItem] && (
        <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20 mb-6 animate-fade-in">
          <h5 className="text-sm font-bold text-purple-300 mb-2">
            {deepAnalysis.scoreBreakdown[expandedScoreItem].category}
          </h5>
          <p className="text-xs text-gray-300">
            {deepAnalysis.scoreBreakdown[expandedScoreItem].justification}
          </p>
        </div>
      )}

      {/* Story Arc Visualization */}
      {deepAnalysis.storyArcAnalysis && (
        <div className="bg-black/30 rounded-lg p-4 border border-blue-500/20 mb-4">
          <h5 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
            <span>📖</span> Story Arc Analysis
          </h5>
          <div className="flex items-center justify-between gap-2 mb-2">
            {deepAnalysis.storyArcAnalysis.narrativeType && (
              <span className="text-xs bg-blue-600/30 text-blue-200 px-2 py-1 rounded">
                {deepAnalysis.storyArcAnalysis.narrativeType}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="bg-blue-900/20 rounded p-2">
              <div className="text-blue-400 font-bold mb-1">Structure</div>
              <div className="text-gray-400">{deepAnalysis.storyArcAnalysis.structure || 'N/A'}</div>
            </div>
            <div className="bg-purple-900/20 rounded p-2">
              <div className="text-purple-400 font-bold mb-1">Climax</div>
              <div className="text-gray-400">Line {deepAnalysis.storyArcAnalysis.climaxLine || 'N/A'}</div>
            </div>
            <div className="bg-green-900/20 rounded p-2">
              <div className="text-green-400 font-bold mb-1">Resolution</div>
              <div className="text-gray-400">Line {deepAnalysis.storyArcAnalysis.resolutionLine || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Phonetic Flow Analysis */}
      {deepAnalysis.phoneticAnalysis && (
        <div className="bg-black/30 rounded-lg p-4 border border-green-500/20 mb-4">
          <h5 className="text-sm font-bold text-green-300 mb-3 flex items-center gap-2">
            <span>🎵</span> Phonetic Flow Analysis
          </h5>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-green-400 font-bold mb-2">Flow Score</div>
              <div className="text-2xl font-bold text-green-300">
                {deepAnalysis.phoneticAnalysis.vowelFlowScore || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold mb-2">Breath Points</div>
              <div className="text-gray-400">
                {deepAnalysis.phoneticAnalysis.breathPointRecommendations?.length || 0} recommended
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Imagery Audit */}
      {deepAnalysis.imageryAudit && (
        <div className="bg-black/30 rounded-lg p-4 border border-pink-500/20">
          <h5 className="text-sm font-bold text-pink-300 mb-3 flex items-center gap-2">
            <span>🖼️</span> Imagery & Sensory Audit
          </h5>
          <div className="flex flex-wrap gap-2 mb-3">
            {deepAnalysis.imageryAudit.concreteObjects?.slice(0, 5).map((img, i) => (
              <span key={i} className="text-xs bg-pink-600/20 text-pink-200 px-2 py-1 rounded">
                {img}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-gray-400">Cinema Score:</span>
              <span className="text-pink-300 font-bold ml-1">{deepAnalysis.imageryAudit.cinemaScore}/10</span>
            </div>
            <div>
              <span className="text-gray-400">Abstract/Concrete:</span>
              <span className="text-pink-300 font-bold ml-1">{deepAnalysis.imageryAudit.abstractVsConcreteRatio}</span>
            </div>
          </div>
          {deepAnalysis.imageryAudit.clicheCount > 0 && (
            <div className="mt-3 text-xs text-orange-400">
              ⚠️ {deepAnalysis.imageryAudit.clicheCount} clichés detected
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default V5DeepAnalysisSection;
