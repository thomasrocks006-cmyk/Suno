import React, { useState } from 'react';
import { GeneratedSong } from '../types';

interface RewriteStudioProps {
  song: GeneratedSong;
  onRewrite: (useAdvancedLogic: boolean, useMetaphorLogic: boolean) => void;
}

export const RewriteStudio: React.FC<RewriteStudioProps> = ({ song, onRewrite }) => {
  const [useAdvancedLogic, setUseAdvancedLogic] = useState(song.hasAdvancedLogic);
  const [useMetaphorLogic, setUseMetaphorLogic] = useState(song.hasMetaphorLogic);

  const handleRewrite = () => {
    onRewrite(useAdvancedLogic, useMetaphorLogic);
  };

  // Get version number for button
  const getNextVersion = () => {
    if (song.title.includes('(V')) {
      const match = song.title.match(/\(V(\d+)\)/);
      if (match) return parseInt(match[1]) + 1;
    }
    return 2;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 rounded-2xl border border-white/10 p-6 mt-6 animate-scale-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Rewrite Studio</h3>
          <p className="text-xs text-gray-400">Generate an improved version based on analysis</p>
        </div>
      </div>

      {/* AI Recommendation */}
      {song.analysis?.rewriteAdvice && (
        <div className="mb-5 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-cyan-400 mb-1">AI Recommendation</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {song.analysis.rewriteAdvice.reasoning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Logic Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <label className="relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-slate-800/50 to-slate-900/50 ${useAdvancedLogic ? 'border-cyan-500 bg-cyan-900/20' : 'border-white/10 hover:border-white/20'}">
          <input 
            type="checkbox" 
            checked={useAdvancedLogic} 
            onChange={e => setUseAdvancedLogic(e.target.checked)}
            className="mt-1 rounded bg-black/50 border-gray-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
          />
          <div className="flex-1">
            <div className="text-sm font-bold text-white mb-1">Advanced Lyric Logic</div>
            <p className="text-xs text-gray-400">
              Strict formatting with section headers, vocal cues, and concrete imagery ("furniture rule")
            </p>
            {useAdvancedLogic && (
              <div className="mt-2 flex items-center gap-1 text-cyan-400 text-xs font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Enabled
              </div>
            )}
          </div>
        </label>

        <label className={`relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-slate-800/50 to-slate-900/50 ${useMetaphorLogic ? 'border-purple-500 bg-purple-900/20' : 'border-white/10 hover:border-white/20'}`}>
          <input 
            type="checkbox" 
            checked={useMetaphorLogic} 
            onChange={e => setUseMetaphorLogic(e.target.checked)}
            className="mt-1 rounded bg-black/50 border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
          />
          <div className="flex-1">
            <div className="text-sm font-bold text-white mb-1">Central Metaphor Logic</div>
            <p className="text-xs text-gray-400">
              Anchor all imagery to one central metaphor for thematic cohesion
            </p>
            {useMetaphorLogic && (
              <div className="mt-2 flex items-center gap-1 text-purple-400 text-xs font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Enabled
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Generate Button */}
      <button 
        onClick={handleRewrite}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/20 active:scale-95"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span className="text-lg">Generate Version {getNextVersion()}</span>
      </button>

      {/* Info Footer */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
        </svg>
        <span>This will apply all suggested improvements and create a new version</span>
      </div>
    </div>
  );
};
