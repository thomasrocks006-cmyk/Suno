import React from 'react';
import { GeneratedSong } from '../types';

interface ScoreBreakdownSectionProps {
  song: GeneratedSong;
  parentSong?: GeneratedSong;
  expandedScoreItem: number | null;
  onExpandScoreItem: (index: number | null) => void;
  onShowComparison: () => void;
  onTextHighlight: (text: string) => void;
  getScoreColor: (score: number) => string;
}

// Agent badge configuration
const agentConfig: Record<string, { emoji: string; color: string; bg: string }> = {
  'Lyricist': { emoji: 'pen', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  'Storyteller': { emoji: 'book', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  'Vocal Coach': { emoji: 'mic', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  'Producer': { emoji: 'slider', color: 'text-green-400', bg: 'bg-green-500/10' },
  'Hitmaker': { emoji: 'star', color: 'text-yellow-400', bg: 'bg-yellow-500/10' }
};

/**
 * Score Breakdown Section
 * Displays the score summary, comparison card, and detailed score breakdown
 * with expandable cards showing agent attribution
 */
export const ScoreBreakdownSection: React.FC<ScoreBreakdownSectionProps> = ({
  song,
  parentSong,
  expandedScoreItem,
  onExpandScoreItem,
  onShowComparison,
  onTextHighlight,
  getScoreColor
}) => {
  if (!song.analysis) return null;

  // Get programmatic score helper
  const getProgrammaticScore = (category: string) => {
    if (!song.analysis?.programmaticScores) return null;
    const categoryMap: Record<string, keyof NonNullable<typeof song.analysis.programmaticScores>> = {
      'Hook Factor': 'hookFactor',
      'Vocal Playability': 'vocalPlayability',
      'Imagery & Sensory Detail': 'imagerySensory',
      'Narrative Arc': 'narrativeArc'
    };
    const key = categoryMap[category];
    return key ? song.analysis.programmaticScores[key] : null;
  };

  const getAgentEmoji = (agent: string) => {
    const icons: Record<string, string> = {
      'pen': '\u270D\uFE0F',
      'book': '\uD83D\uDCD6',
      'mic': '\uD83C\uDFA4',
      'slider': '\uD83C\uDF9A\uFE0F',
      'star': '\u2B50'
    };
    return icons[agentConfig[agent]?.emoji] || '\uD83E\uDD16';
  };

  return (
    <div className="space-y-4">
      {/* Score Section */}
      <div className="flex items-center gap-3 md:gap-6 bg-black/30 p-3 md:p-4 rounded-xl border border-white/5">
        <div className={`shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center border-2 md:border-4 ${getScoreColor(song.analysis.overallScore)} shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
          <span className={`text-2xl md:text-4xl font-bold ${getScoreColor(song.analysis.overallScore).split(' ')[0]}`}>
            {song.analysis.overallScore}
          </span>
        </div>
        <div>
          <h4 className="text-sm md:text-lg font-bold text-white mb-1">Review Summary</h4>
          <p className="text-xs md:text-sm text-gray-300 italic line-clamp-3">{song.analysis.summary}</p>
          <div className="mt-2 text-xs font-medium text-suno-accent flex items-center gap-2">
            <span>Predicted Score after Fixes:</span>
            <span className="bg-suno-accent text-white px-1.5 rounded">{song.analysis.projectedScore}</span>
          </div>
        </div>
      </div>

      {/* Comparison Review Card */}
      {song.analysis.comparisonReview && parentSong && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-5 flex justify-between items-center">
          <div>
            <h5 className="text-sm font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
              Version Comparison Available
            </h5>
            <p className="text-xs text-gray-400 mt-1">
              Verdict: <span className="text-white font-bold">{song.analysis.comparisonReview.verdict}</span>
            </p>
          </div>
          <button 
            onClick={onShowComparison}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-transform hover:scale-105"
          >
            View Full Comparison
          </button>
        </div>
      )}

      {/* Detailed Score Breakdown */}
      <div className="bg-white/5 p-4 rounded-lg">
        <h5 className="text-[10px] md:text-xs uppercase font-bold text-gray-400 mb-2 md:mb-3 flex items-center justify-between">
          <span>Score Breakdown - 5 Agent Analysis</span>
          <button 
            onClick={() => onTextHighlight('Score analysis discussion')}
            className="text-[10px] bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 px-2 py-1 rounded transition"
          >
            🤖 Discuss with Agent
          </button>
        </h5>
        
        {/* Agent Legend */}
        <div className="mb-3 p-2 bg-black/20 rounded border border-white/5">
          <div className="flex flex-wrap gap-2 text-[9px]">
            <span className="text-gray-500">Scored by:</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">✍️ Lyricist</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">📖 Storyteller</span>
            <span className="px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400">🎤 Vocal Coach</span>
            <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">🎚️ Producer</span>
            <span className="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400">⭐ Hitmaker</span>
          </div>
        </div>
        
        {/* Score Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          {song.analysis.scoreBreakdown.map((item, i) => {
            const agent = item.agent || 'Unknown';
            const agentStyle = agentConfig[agent as keyof typeof agentConfig] || { emoji: '🤖', color: 'text-gray-400', bg: 'bg-gray-500/10' };
            const programmaticScore = getProgrammaticScore(item.category);
            
            return (
              <div 
                key={i} 
                className="bg-black/20 p-2 md:p-3 rounded border border-white/5 cursor-pointer hover:border-indigo-500/50 transition"
                onClick={() => onExpandScoreItem(expandedScoreItem === i ? null : i)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-gray-300">{item.category}</span>
                      {item.agent && (
                        <span 
                          className={`text-[9px] px-1.5 py-0.5 rounded ${agentStyle.bg} ${agentStyle.color} font-medium flex items-center gap-1`}
                          title={`Scored by ${item.agent}`}
                        >
                          <span>{agentStyle.emoji}</span>
                          <span className="hidden sm:inline">{item.agent}</span>
                        </span>
                      )}
                      <svg 
                        className={`w-3 h-3 text-gray-400 transition-transform ${expandedScoreItem === i ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </div>
                    {expandedScoreItem === i ? (
                      <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed mt-2">{item.reason}</p>
                    ) : (
                      <p className="text-[9px] md:text-[10px] text-gray-500 line-clamp-1">{item.reason}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span 
                      className={`text-xs md:text-sm font-bold shrink-0 ${getScoreColor(item.score * 10).split(' ')[0]}`}
                      title={programmaticScore ? `AI Score: ${item.score}/10\nCalculated: ${programmaticScore.score}/10` : undefined}
                    >
                      {item.score}/10
                    </span>
                    {programmaticScore && (
                      <span 
                        className="text-[8px] text-gray-500 cursor-help"
                        title={`Programmatic Score: ${programmaticScore.score}/10\n${programmaticScore.breakdown}`}
                      >
                        📊 {programmaticScore.score}/10
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScoreBreakdownSection;
