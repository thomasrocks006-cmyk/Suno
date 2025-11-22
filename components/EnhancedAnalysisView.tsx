import React from 'react';
import { SongAnalysis } from '../types';
import { RadarChart } from './RadarChart';

interface EnhancedAnalysisViewProps {
  analysis: SongAnalysis;
  onOpenSmartEditor: () => void;
}

export const EnhancedAnalysisView: React.FC<EnhancedAnalysisViewProps> = ({ 
  analysis, 
  onOpenSmartEditor 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400 border-green-500/50';
    if (score >= 70) return 'text-cyan-400 border-cyan-500/50';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/50';
    return 'text-red-400 border-red-500/50';
  };

  const getGradeFromScore = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    return 'D';
  };

  // Fun analysis insights
  const getFunInsights = () => {
    const insights: string[] = [];
    
    if (analysis.sonicAnalysis.cinemaAudit.objectCount >= 7) {
      insights.push("🎬 Cinematic Master - Your lyrics paint vivid pictures!");
    }
    if (analysis.overallScore >= 85) {
      insights.push("🔥 Hit Material - This has serious potential!");
    }
    if (analysis.lineByLineImprovements.length === 0) {
      insights.push("✨ Flawless - No improvements needed!");
    }
    if (analysis.sonicAnalysis.phonetics.toLowerCase().includes('open vowel')) {
      insights.push("🎤 Singable - Easy on the vocal cords!");
    }

    return insights;
  };

  const funInsights = getFunInsights();

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Hero Score Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="relative p-8 flex flex-col md:flex-row items-center gap-8">
          {/* Score Display */}
          <div className="flex-shrink-0">
            <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 ${getScoreColor(analysis.overallScore)} bg-black/50 backdrop-blur-sm shadow-2xl relative`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 animate-pulse"></div>
              <span className={`text-5xl font-bold ${getScoreColor(analysis.overallScore).split(' ')[0]} relative z-10`}>
                {analysis.overallScore}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider relative z-10">
                {getGradeFromScore(analysis.overallScore)}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2 justify-center md:justify-start">
              <span>Analysis Report</span>
              {analysis.projectedScore > analysis.overallScore && (
                <span className="text-sm font-normal text-cyan-400">
                  → Potential: {analysis.projectedScore}
                </span>
              )}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-2xl">
              {analysis.summary}
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="bg-black/40 px-4 py-2 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400">Commercial Appeal</div>
                <div className="text-sm font-bold text-white">
                  {analysis.commercialViability.split(' ').slice(0, 3).join(' ')}
                </div>
              </div>
              <div className="bg-black/40 px-4 py-2 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400">Improvements Found</div>
                <div className="text-sm font-bold text-cyan-400">
                  {analysis.lineByLineImprovements.length}
                </div>
              </div>
              <div className="bg-black/40 px-4 py-2 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400">Cinema Score</div>
                <div className="text-sm font-bold text-purple-400">
                  {analysis.sonicAnalysis.cinemaAudit.score}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fun Insights Section */}
      {funInsights.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
            <span>🎉</span> Fun Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {funInsights.map((insight, i) => (
              <div key={i} className="bg-black/30 px-4 py-3 rounded-lg text-sm text-gray-300 flex items-center gap-3">
                <span className="text-2xl">{insight.split(' ')[0]}</span>
                <span>{insight.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Radar Chart */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
        <h4 className="text-sm uppercase font-bold text-gray-400 mb-6 text-center">
          Performance Breakdown
        </h4>
        <RadarChart data={analysis.scoreBreakdown.map(item => ({
          category: item.category,
          score: item.score
        }))} />
      </div>

      {/* Detailed Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.scoreBreakdown.map((item, i) => (
          <div 
            key={i} 
            className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 p-5 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <h5 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                {item.category}
              </h5>
              <span className={`text-2xl font-bold ${getScoreColor(item.score * 10).split(' ')[0]}`}>
                {item.score}/10
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{item.reason}</p>
          </div>
        ))}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6">
          <h4 className="text-sm uppercase font-bold text-green-400 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Strengths
          </h4>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-green-400">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-6">
          <h4 className="text-sm uppercase font-bold text-red-400 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            Areas to Improve
          </h4>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-red-400">•</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Theme & Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-900/20 border border-purple-500/30 p-5 rounded-xl">
          <h5 className="text-xs uppercase font-bold text-purple-400 mb-2 flex items-center gap-2">
            <span>🎭</span> Theme Analysis
          </h5>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.themeAnalysis}</p>
        </div>
        <div className="bg-cyan-900/20 border border-cyan-500/30 p-5 rounded-xl">
          <h5 className="text-xs uppercase font-bold text-cyan-400 mb-2 flex items-center gap-2">
            <span>📖</span> Story Arc
          </h5>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.storyArc}</p>
        </div>
      </div>

      {/* Sonic Analysis */}
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-xl overflow-hidden">
        <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center gap-3">
          <span className="text-2xl">🎧</span>
          <h4 className="text-sm font-bold text-white">Sonic & Structural Analysis</h4>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-24 text-xs font-bold text-gray-400 uppercase shrink-0 pt-1">Phonetics</div>
            <p className="text-sm text-gray-300 flex-1">{analysis.sonicAnalysis.phonetics}</p>
          </div>
          <div className="flex gap-4 items-start border-t border-white/5 pt-4">
            <div className="w-24 text-xs font-bold text-gray-400 uppercase shrink-0 pt-1">Density</div>
            <p className="text-sm text-gray-300 flex-1">{analysis.sonicAnalysis.density}</p>
          </div>
          <div className="flex gap-4 items-start border-t border-white/5 pt-4">
            <div className="w-24 text-xs font-bold text-gray-400 uppercase shrink-0 pt-1">Cinema Audit</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  analysis.sonicAnalysis.cinemaAudit.score === 'A' ? 'bg-green-500/20 text-green-400' : 
                  analysis.sonicAnalysis.cinemaAudit.score === 'B' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  Grade: {analysis.sonicAnalysis.cinemaAudit.score}
                </span>
                <span className="text-xs text-gray-500">
                  {analysis.sonicAnalysis.cinemaAudit.objectCount} Physical Objects
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-3">{analysis.sonicAnalysis.cinemaAudit.analysis}</p>
              <div className="flex flex-wrap gap-2">
                {analysis.sonicAnalysis.cinemaAudit.objects.map((obj, i) => (
                  <span key={i} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-gray-300 transition-colors">
                    {obj}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Improvements */}
      <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm uppercase font-bold text-blue-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
            Line-by-Line Improvements ({analysis.lineByLineImprovements.length})
          </h4>
          <button 
            onClick={onOpenSmartEditor}
            className="text-xs bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-4 py-2 rounded-lg transition-all font-medium hover:scale-105"
          >
            Open Smart Editor
          </button>
        </div>
        <div className="space-y-3">
          {analysis.lineByLineImprovements.map((item, i) => (
            <div 
              key={i} 
              className={`bg-black/40 p-4 rounded-lg border ${
                item.source === 'User' ? 'border-cyan-500/40' : 'border-white/5'
              } hover:border-white/20 transition-colors`}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="text-red-300/70 text-sm line-through flex-1">{item.original}</div>
                {item.source === 'User' && (
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded font-bold">
                    YOUR EDIT
                  </span>
                )}
              </div>
              <div className="text-green-400 text-sm font-medium mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
                {item.improved}
              </div>
              <div className="text-xs text-gray-500 italic">{item.reason}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Commercial Viability */}
      <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-6">
        <h4 className="text-sm uppercase font-bold text-yellow-400 mb-3 flex items-center gap-2">
          <span>💰</span> Commercial Viability
        </h4>
        <p className="text-sm text-gray-300 leading-relaxed">{analysis.commercialViability}</p>
      </div>
    </div>
  );
};
