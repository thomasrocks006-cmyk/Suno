
import React from 'react';
import { GeneratedSong, FIXED_SCORING_CATEGORIES } from '../types';

interface ComparisonViewProps {
  currentSong: GeneratedSong;
  parentSong: GeneratedSong;
  onClose: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ currentSong, parentSong, onClose }) => {
  const review = currentSong.analysis?.comparisonReview;

  if (!review) {
    console.warn('[ComparisonView] No comparison review data found');
    return null;
  }

  console.log('[ComparisonView] Rendering with review:', review);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fade-in">
      <div className="w-full max-w-6xl h-[90vh] bg-gray-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-black/20 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-blue-400">⚖️</span> Version Comparison
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Comparing <span className="text-gray-300 font-bold">{parentSong.title}</span> (V1) vs <span className="text-white font-bold">{currentSong.title}</span> (Current)
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className={`px-4 py-2 rounded-lg border flex flex-col items-center ${
                 review.verdict.includes('Upgrade') ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'
             }`}>
                 <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Verdict</span>
                 <span className={`font-bold text-sm ${review.verdict.includes('Upgrade') ? 'text-green-400' : 'text-yellow-400'}`}>
                     {review.verdict}
                 </span>
             </div>
             <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
             </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
            
            {/* Top Analysis Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-900/10 border border-green-500/20 p-5 rounded-xl">
                    <h3 className="text-green-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                        Improvements
                    </h3>
                    <ul className="space-y-2">
                        {(review.improvements || []).length > 0 ? (
                          review.improvements.map((item, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-green-500 mt-1">✓</span> {item}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500 text-sm italic">No improvements detected</li>
                        )}
                    </ul>
                </div>

                <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-xl">
                    <h3 className="text-red-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg>
                        Missed / Regressions
                    </h3>
                    <ul className="space-y-2">
                        {(review.missedOpportunities || []).length > 0 ? (
                          review.missedOpportunities.map((item, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-red-500 mt-1">⚠</span> {item}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500 text-sm italic">No issues found</li>
                        )}
                    </ul>
                </div>

                <div className="bg-blue-900/10 border border-blue-500/20 p-5 rounded-xl flex flex-col">
                    <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-3">Score Impact</h3>
                    <div className="flex-grow flex flex-col justify-center items-center">
                        <div className="text-5xl font-bold text-white mb-2">
                            {(review.scoreDelta || 0) > 0 ? `+${review.scoreDelta}` : (review.scoreDelta || 0)}
                        </div>
                        <div className="text-sm text-gray-400">Point Change</div>
                        <div className="w-full h-2 bg-gray-700 rounded-full mt-4 overflow-hidden relative">
                             <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20"></div>
                             <div 
                                className={`h-full transition-all ${(review.scoreDelta || 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ 
                                    width: `${Math.min(Math.abs(review.scoreDelta || 0) * 2, 50)}%`,
                                    marginLeft: (review.scoreDelta || 0) > 0 ? '50%' : `calc(50% - ${Math.min(Math.abs(review.scoreDelta || 0) * 2, 50)}%)`
                                }} 
                             />
                        </div>
                    </div>
                </div>
            </div>

            {/* Score Breakdown Comparison */}
            <div className="mb-8 bg-white/5 p-6 rounded-xl border border-white/5">
                <h3 className="text-gray-300 font-bold text-sm uppercase tracking-wider mb-4">Category Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FIXED_SCORING_CATEGORIES.map((cat) => {
                        const currentScore = currentSong.analysis?.scoreBreakdown.find(s => s.category === cat)?.score || 0;
                        // We assume V1 might not have the exact same structure if it was generated before this update, 
                        // but going forward they will. For now, we just show current score vs an imagined V1 if missing.
                        // Ideally, parentSong should have analysis too.
                        const parentScoreObj = parentSong.analysis?.scoreBreakdown.find(s => s.category === cat);
                        const parentScore = parentScoreObj ? parentScoreObj.score : 0; 
                        const diff = currentScore - parentScore;

                        return (
                            <div key={cat} className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase mb-1">{cat}</div>
                                    <div className="text-[10px] text-gray-500 truncate max-w-[150px]">
                                        {currentSong.analysis?.scoreBreakdown.find(s => s.category === cat)?.reason}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-white">{currentScore}/10</div>
                                    {parentScore > 0 && (
                                        <div className={`text-xs font-bold ${diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                                            {diff > 0 ? '+' : ''}{diff} vs V1
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Lyrics Diff View (Simplified) */}
            <div className="grid grid-cols-2 gap-6">
                 <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden">
                     <div className="bg-white/5 p-3 text-xs font-bold text-gray-400 uppercase border-b border-white/5">
                         Version 1 (Original)
                     </div>
                     <div className="p-4 text-sm font-mono text-gray-400 whitespace-pre-wrap h-96 overflow-y-auto custom-scrollbar opacity-70">
                         {parentSong.lyrics}
                     </div>
                 </div>
                 <div className="bg-black/30 rounded-xl border border-suno-primary/30 overflow-hidden">
                     <div className="bg-suno-primary/10 p-3 text-xs font-bold text-suno-primary uppercase border-b border-suno-primary/20">
                         Version 2 (Current)
                     </div>
                     <div className="p-4 text-sm font-mono text-gray-200 whitespace-pre-wrap h-96 overflow-y-auto custom-scrollbar">
                         {currentSong.lyrics}
                     </div>
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
};
