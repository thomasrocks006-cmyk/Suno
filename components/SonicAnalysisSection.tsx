import React from 'react';
import { GeneratedSong } from '../types';

interface SonicAnalysisSectionProps {
  song: GeneratedSong;
  isFetchingDNALyrics: boolean;
  dnaLyricsError: string | null;
  onFetchDNALyrics: () => void;
  onTextHighlight: (text: string) => void;
}

/**
 * Sonic Analysis Section
 * Displays Theme/Narrative, Sonic Analysis, Line-by-Line Improvements, and DNA Match
 */
export const SonicAnalysisSection: React.FC<SonicAnalysisSectionProps> = ({
  song,
  isFetchingDNALyrics,
  dnaLyricsError,
  onFetchDNALyrics,
  onTextHighlight
}) => {
  if (!song.analysis) return null;

  return (
    <div className="space-y-4">
      {/* Theme & Narrative Arc */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-suno-secondary/10 border border-suno-secondary/20 p-3 md:p-4 rounded-lg">
          <h5 className="text-[10px] md:text-xs uppercase font-bold text-suno-secondary mb-1.5 md:mb-2 flex items-center gap-2">
            Theme Analysis
          </h5>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">{song.analysis.themeAnalysis}</p>
        </div>
        <div className="bg-suno-primary/10 border border-suno-primary/20 p-3 md:p-4 rounded-lg">
          <h5 className="text-[10px] md:text-xs uppercase font-bold text-suno-primary mb-1.5 md:mb-2 flex items-center gap-2">
            Story Arc
          </h5>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">{song.analysis.storyArc}</p>
        </div>
      </div>

      {/* Sonic Analysis */}
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 rounded-lg overflow-hidden">
        <div className="bg-white/5 px-3 md:px-4 py-1.5 md:py-2 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg">{'🎧'}</span>
            <h5 className="text-xs md:text-sm font-bold text-white">Sonic & Structural Analysis (Producer's Ear)</h5>
          </div>
          <button 
            onClick={() => onTextHighlight(song.analysis?.sonicAnalysis?.phonetics || '')}
            className="text-[10px] bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-2 py-1 rounded transition"
          >
            Discuss with Agent
          </button>
        </div>
        <div className="p-3 md:p-4 space-y-3 md:space-y-4">
          <div className="flex gap-2 md:gap-4 items-start">
            <div className="w-12 md:w-16 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase shrink-0 pt-1">Phonetics</div>
            <p className="text-xs md:text-sm text-gray-300">{song.analysis.sonicAnalysis.phonetics}</p>
          </div>
          <div className="flex gap-2 md:gap-4 items-start border-t border-white/5 pt-3 md:pt-4">
            <div className="w-12 md:w-16 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase shrink-0 pt-1">Density</div>
            <p className="text-xs md:text-sm text-gray-300">{song.analysis.sonicAnalysis.density}</p>
          </div>
          <div className="flex gap-2 md:gap-4 items-start border-t border-white/5 pt-3 md:pt-4">
            <div className="w-12 md:w-16 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase shrink-0 pt-1">Cinema Audit</div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-1.5 md:gap-2 mb-1 flex-wrap">
                <span className={`text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded ${song.analysis.sonicAnalysis.cinemaAudit.score === 'A' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  Grade: {song.analysis.sonicAnalysis.cinemaAudit.score}
                </span>
                <span className="text-[9px] md:text-xs text-gray-500">({song.analysis.sonicAnalysis.cinemaAudit.objectCount} Physical Objects)</span>
              </div>
              <p className="text-xs md:text-sm text-gray-300 mb-2 line-clamp-3">{song.analysis.sonicAnalysis.cinemaAudit.analysis}</p>
              <div className="flex flex-wrap gap-2">
                {song.analysis.sonicAnalysis.cinemaAudit.objects.map((obj, i) => (
                  <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">{obj}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line-by-Line Improvements */}
      <div className="bg-blue-900/20 border border-blue-500/30 p-3 md:p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2 gap-2">
          <h5 className="text-[10px] md:text-xs uppercase font-bold text-blue-400">Line-by-Line Improvements</h5>
          <div className="flex gap-2">
            <button 
              onClick={() => onTextHighlight('Line-by-line improvements')}
              className="text-[10px] bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-2 py-1 rounded transition"
            >
              Discuss with Agent
            </button>
          </div>
        </div>
        <div className="space-y-2 md:space-y-3">
          {song.analysis.lineByLineImprovements.map((item, i) => (
            <div key={i} className={`bg-black/40 p-2 md:p-3 rounded border ${item.source === 'User' ? 'border-suno-primary/40' : 'border-white/5'}`}>
              <div className="flex justify-between items-start gap-2">
                <div className="text-red-300/70 text-[10px] md:text-xs line-through mb-1 break-words">{item.original}</div>
                {item.source === 'User' && <span className="text-[9px] bg-suno-primary/20 text-suno-primary px-1 rounded">Manual Edit</span>}
              </div>
              <div className="text-green-400 text-xs md:text-sm font-medium mb-1 flex items-center gap-2 break-words">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
                {item.improved}
              </div>
              <div className="text-[10px] text-gray-500 italic">{item.reason}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DNA MATCH - Real World Hit Comparison */}
      {song.analysis.dnaMatch && (
        <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/40 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600/30 to-orange-600/30 px-4 py-3 border-b border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{'🧬'}</span>
              <div>
                <h3 className="text-sm md:text-base font-bold text-amber-200">Song DNA Match</h3>
                <p className="text-xs text-amber-300/70">Closest Real-World Hit Comparison</p>
              </div>
            </div>
            <button 
              onClick={() => onTextHighlight(song.analysis?.dnaMatch?.referenceSong || '')}
              className="text-[10px] bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 px-2 py-1 rounded transition whitespace-nowrap"
            >
              Discuss with Agent
            </button>
          </div>
          
          <div className="p-4 md:p-6 space-y-4">
            {/* Reference Song Card */}
            <div className="bg-black/40 rounded-lg p-4 border border-amber-500/20">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-lg font-bold text-white mb-1">"{song.analysis.dnaMatch.referenceSong}"</div>
                  <div className="text-sm text-amber-300">{song.analysis.dnaMatch.artist}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-400">{song.analysis.dnaMatch.matchScore}%</div>
                  <div className="text-xs text-gray-400">Match Score</div>
                </div>
              </div>
              
              {/* Credibility Factors */}
              <div className="flex flex-wrap gap-2 mb-3">
                {song.analysis.dnaMatch.credibilityFactors.map((factor, i) => (
                  <span key={i} className="text-xs bg-amber-500/20 text-amber-200 px-2 py-1 rounded border border-amber-500/30">
                    {'⭐'} {factor}
                  </span>
                ))}
              </div>
              
              <div className="text-sm text-gray-300 bg-black/30 p-3 rounded border border-white/5">
                <div className="font-bold text-amber-300 mb-2">Why This Is A-Tier:</div>
                <p className="text-xs leading-relaxed">{song.analysis.dnaMatch.whatTheyDidBetter}</p>
              </div>
              
              {/* Fetch Reference Lyrics Button */}
              {!song.analysis.dnaMatch.referenceLyrics && (
                <button
                  onClick={onFetchDNALyrics}
                  disabled={isFetchingDNALyrics}
                  className="w-full mt-3 bg-amber-500/20 hover:bg-amber-500/30 disabled:bg-amber-500/10 text-amber-300 px-4 py-2 rounded border border-amber-500/30 transition text-sm font-medium disabled:cursor-not-allowed"
                >
                  {isFetchingDNALyrics ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">{'⏳'}</span> Fetching Reference Lyrics...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {'📜'} Fetch Reference Lyrics for Structural Comparison
                    </span>
                  )}
                </button>
              )}
              
              {dnaLyricsError && (
                <div className="mt-3 bg-red-500/20 border border-red-500/40 rounded p-3 text-sm text-red-300">
                  {'⚠️'} {dnaLyricsError}
                </div>
              )}
              
              {/* Display Fetched Lyrics */}
              {song.analysis.dnaMatch.referenceLyrics && (
                <div className="mt-3 bg-amber-900/20 border border-amber-500/30 rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-amber-300 text-sm">Reference Lyrics</div>
                  </div>
                  <div className="text-xs text-gray-300 whitespace-pre-line max-h-64 overflow-y-auto bg-black/30 p-3 rounded border border-white/5">
                    {song.analysis.dnaMatch.referenceLyrics}
                  </div>
                </div>
              )}
            </div>

            {/* Match Reasons Grid */}
            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase mb-2">Why They Match</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-black/40 p-3 rounded border border-white/5">
                  <div className="text-xs font-bold text-amber-400 mb-1">{'🎵'} Vibe/Energy</div>
                  <p className="text-xs text-gray-300">{song.analysis.dnaMatch.matchReasons.vibe}</p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-white/5">
                  <div className="text-xs font-bold text-amber-400 mb-1">{'🏗️'} Structure</div>
                  <p className="text-xs text-gray-300">{song.analysis.dnaMatch.matchReasons.structure}</p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-white/5">
                  <div className="text-xs font-bold text-amber-400 mb-1">{'✍️'} Lyrical Style</div>
                  <p className="text-xs text-gray-300">{song.analysis.dnaMatch.matchReasons.lyricalStyle}</p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-white/5">
                  <div className="text-xs font-bold text-amber-400 mb-1">{'💫'} Emotional Arc</div>
                  <p className="text-xs text-gray-300">{song.analysis.dnaMatch.matchReasons.emotional}</p>
                </div>
                <div className="bg-black/40 p-3 rounded border border-white/5 md:col-span-2">
                  <div className="text-xs font-bold text-amber-400 mb-1">{'⏱️'} Pacing</div>
                  <p className="text-xs text-gray-300">{song.analysis.dnaMatch.matchReasons.pacing}</p>
                </div>
              </div>
            </div>

            {/* Improvements Section */}
            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase mb-2">What You Can Learn From This Hit</h4>
              <div className="space-y-3">
                {/* Structural */}
                {song.analysis.dnaMatch.improvements.structural.length > 0 && (
                  <div className="bg-black/40 p-3 rounded border border-white/5">
                    <div className="text-xs font-bold text-green-400 mb-2 flex items-center gap-2">
                      <span>{'📐'}</span> Structural Improvements
                    </div>
                    <ul className="space-y-1">
                      {song.analysis.dnaMatch.improvements.structural.map((imp, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                          <span className="text-green-400 shrink-0">{'•'}</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Word Spacing */}
                {song.analysis.dnaMatch.improvements.wordSpacing.length > 0 && (
                  <div className="bg-black/40 p-3 rounded border border-white/5">
                    <div className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-2">
                      <span>{'🎤'}</span> Word Spacing & Phrasing
                    </div>
                    <ul className="space-y-1">
                      {song.analysis.dnaMatch.improvements.wordSpacing.map((imp, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                          <span className="text-blue-400 shrink-0">{'•'}</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Metaphorical */}
                {song.analysis.dnaMatch.improvements.metaphorical.length > 0 && (
                  <div className="bg-black/40 p-3 rounded border border-white/5">
                    <div className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-2">
                      <span>{'🎭'}</span> Metaphorical Depth
                    </div>
                    <ul className="space-y-1">
                      {song.analysis.dnaMatch.improvements.metaphorical.map((imp, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                          <span className="text-purple-400 shrink-0">{'•'}</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Narrative */}
                {song.analysis.dnaMatch.improvements.narrative.length > 0 && (
                  <div className="bg-black/40 p-3 rounded border border-white/5">
                    <div className="text-xs font-bold text-yellow-400 mb-2 flex items-center gap-2">
                      <span>{'📖'}</span> Narrative & Storytelling
                    </div>
                    <ul className="space-y-1">
                      {song.analysis.dnaMatch.improvements.narrative.map((imp, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                          <span className="text-yellow-400 shrink-0">{'•'}</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Sonic */}
                {song.analysis.dnaMatch.improvements.sonic.length > 0 && (
                  <div className="bg-black/40 p-3 rounded border border-white/5">
                    <div className="text-xs font-bold text-pink-400 mb-2 flex items-center gap-2">
                      <span>{'🎧'}</span> Sonic & Phonetic
                    </div>
                    <ul className="space-y-1">
                      {song.analysis.dnaMatch.improvements.sonic.map((imp, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                          <span className="text-pink-400 shrink-0">{'•'}</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SonicAnalysisSection;
