import React from 'react';
import { SongInputs } from '../types';
import { getContextualTips, SUNO_V5_KNOWLEDGE_BASE } from '../services/sunoV5Knowledge';

interface TipsSidebarProps {
  currentInputs?: SongInputs;
}

export const TipsSidebar: React.FC<TipsSidebarProps> = ({ currentInputs }) => {
  // Get contextual tips based on current inputs
  const tips = currentInputs 
    ? getContextualTips(
        currentInputs.genre,
        currentInputs.mood,
        currentInputs.advancedLyricLogic,
        currentInputs.commercialMode
      )
    : SUNO_V5_KNOWLEDGE_BASE.filter(k => k.confidence === 'verified').slice(0, 7);

  const getConfidenceBadge = (confidence: string) => {
    if (confidence === 'verified') return '✓ Verified';
    if (confidence === 'high') return '⚡ High Confidence';
    return '🧪 Experimental';
  };

  const getConfidenceColor = (confidence: string) => {
    if (confidence === 'verified') return 'text-green-400';
    if (confidence === 'high') return 'text-blue-400';
    return 'text-yellow-400';
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'model_behavior': return '🧠';
      case 'optimization': return '⚡';
      case 'bugs_workarounds': return '🔧';
      case 'advanced_techniques': return '🎯';
      case 'genre_specific': return '🎵';
      default: return '💡';
    }
  };

  return (
    <div className="w-full h-full p-4 overflow-y-auto custom-scrollbar">
      <div className="mb-4 px-2">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
          Suno V5 Pro Tips
        </h3>
        <p className="text-xs text-gray-500">
          {currentInputs?.genre || currentInputs?.advancedLyricLogic || currentInputs?.commercialMode
            ? 'Contextual tips for your current settings'
            : 'Essential Suno V5 knowledge for better results'}
        </p>
      </div>
      
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div 
            key={index} 
            className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-suno-primary/50 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-suno-accent font-bold text-sm flex items-center gap-2">
                <span>{getCategoryIcon(tip.category)}</span>
                {tip.title}
              </h4>
              <span className={`text-[10px] ${getConfidenceColor(tip.confidence)} font-semibold`}>
                {getConfidenceBadge(tip.confidence)}
              </span>
            </div>
            
            <p className="text-gray-400 text-xs leading-relaxed mb-2">
              {tip.userTip}
            </p>
            
            {tip.examples && tip.examples.length > 0 && (
              <details className="mt-2">
                <summary className="text-[10px] text-gray-500 cursor-pointer hover:text-gray-400">
                  View examples
                </summary>
                <div className="mt-2 space-y-1 pl-3 border-l-2 border-gray-700">
                  {tip.examples.map((example, i) => (
                    <div key={i} className="text-[10px] text-gray-500 font-mono">
                      {example}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>

      {/* Quick Reference */}
      <div className="mt-6 p-4 bg-suno-primary/10 rounded-lg border border-suno-primary/20">
        <h4 className="text-xs font-bold text-suno-primary mb-2">⚡ Quick Reference</h4>
        <div className="space-y-1 text-[10px] text-gray-400">
          <div>• Always end with [Outro] + [End]</div>
          <div>• Use 4-8 lines per section</div>
          <div>• Add energy markers (X/10)</div>
          <div>• Start with [Instrumental Intro]</div>
          <div>• Mark vocals: (M), (F), (M+F)</div>
        </div>
      </div>
    </div>
  );
};