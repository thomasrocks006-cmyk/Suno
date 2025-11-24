import React, { useState, useMemo } from 'react';
import {
  analyzeSyllableStress,
  analyzeConsonantClusters,
  analyzeRhymeScheme,
  SyllableStress,
  ConsonantCluster,
  RhymeScheme
} from '../services/rhythmVisualizationService';

interface RhythmVisualizationOverlayProps {
  lyrics: string;
}

export const RhythmVisualizationOverlay: React.FC<RhythmVisualizationOverlayProps> = ({
  lyrics
}) => {
  const [activeView, setActiveView] = useState<'stress' | 'clusters' | 'rhyme' | 'all'>('all');
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  // Analyze rhythm features
  const syllableStress = useMemo(() => analyzeSyllableStress(lyrics), [lyrics]);
  const consonantClusters = useMemo(() => analyzeConsonantClusters(lyrics), [lyrics]);
  const rhymeScheme = useMemo(() => analyzeRhymeScheme(lyrics), [lyrics]);

  const lines = lyrics.split('\n');

  // Color for consonant cluster density
  const getClusterColor = (density: number): string => {
    if (density >= 8) return 'bg-red-500';
    if (density >= 6) return 'bg-orange-500';
    if (density >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Get rhyme letter color
  const getRhymeColor = (letter: string): string => {
    const colors = [
      'text-blue-400',
      'text-purple-400',
      'text-pink-400',
      'text-green-400',
      'text-yellow-400',
      'text-cyan-400',
      'text-red-400',
      'text-orange-400'
    ];
    const index = letter.charCodeAt(0) - 65; // 'A' = 0
    return colors[index % colors.length];
  };

  // Get data for specific line
  const getLineData = (lineNumber: number) => {
    return {
      stress: syllableStress.find(s => s.lineNumber === lineNumber),
      cluster: consonantClusters.find(c => c.lineNumber === lineNumber),
      rhyme: rhymeScheme.sections.flatMap(s => s.patterns).find(p => p.lineNumber === lineNumber)
    };
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Main Visualization */}
      <div className="flex-grow bg-black/20 rounded-lg p-4 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="mb-4 pb-3 border-b border-white/10">
          <h3 className="text-lg font-bold text-white mb-3">🎵 Rhythm & Sonic Visualization</h3>
          
          {/* View Controls */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveView('stress')}
              className={`text-xs px-3 py-1 rounded transition ${
                activeView === 'stress' ? 'bg-blue-500 text-white' : 'bg-black/30 text-gray-400'
              }`}
            >
              📊 Syllable Stress
            </button>
            <button
              onClick={() => setActiveView('clusters')}
              className={`text-xs px-3 py-1 rounded transition ${
                activeView === 'clusters' ? 'bg-orange-500 text-white' : 'bg-black/30 text-gray-400'
              }`}
            >
              🔥 Consonant Density
            </button>
            <button
              onClick={() => setActiveView('rhyme')}
              className={`text-xs px-3 py-1 rounded transition ${
                activeView === 'rhyme' ? 'bg-purple-500 text-white' : 'bg-black/30 text-gray-400'
              }`}
            >
              🎭 Rhyme Scheme
            </button>
            <button
              onClick={() => setActiveView('all')}
              className={`text-xs px-3 py-1 rounded transition ${
                activeView === 'all' ? 'bg-green-500 text-white' : 'bg-black/30 text-gray-400'
              }`}
            >
              ✨ All Features
            </button>
          </div>
        </div>

        {/* Lyrics with Overlays */}
        <div className="space-y-2 font-mono text-sm">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const trimmed = line.trim();
            
            if (!trimmed) return <div key={index} className="h-2"></div>;
            
            // Section headers
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
              const section = rhymeScheme.sections.find(s => s.sectionName === trimmed.slice(1, -1));
              
              return (
                <div key={index} className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-400 font-bold">{trimmed}</div>
                    {section && activeView !== 'stress' && activeView !== 'clusters' && (
                      <div className="text-xs text-gray-400">
                        Rhyme: {section.scheme} ({section.quality})
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            const { stress, cluster, rhyme } = getLineData(lineNumber);
            const isSelected = selectedLine === lineNumber;

            return (
              <div
                key={index}
                onClick={() => setSelectedLine(isSelected ? null : lineNumber)}
                className={`
                  flex items-start gap-3 p-2 rounded-lg border cursor-pointer transition-all
                  ${isSelected ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/50' : 'bg-black/20 border-white/10 hover:bg-black/40'}
                `}
              >
                {/* Line Number */}
                <div className="flex-shrink-0 w-8 text-right text-xs text-gray-500">
                  {lineNumber}
                </div>

                {/* Syllable Stress Pattern (if active) */}
                {(activeView === 'stress' || activeView === 'all') && stress && (
                  <div className="flex-shrink-0 w-32">
                    <div className="flex gap-0.5 mb-1">
                      {stress.syllables.map((syl, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-4 rounded ${
                            syl.stress === 'strong' ? 'bg-blue-500' : 'bg-gray-600'
                          }`}
                          title={`${syl.text || ''} (${syl.stress})`}
                        ></div>
                      ))}
                    </div>
                    <div className="text-[9px] text-gray-500 truncate" title={stress.patternType}>
                      {stress.patternType}
                    </div>
                  </div>
                )}

                {/* Consonant Cluster Heatmap (if active) */}
                {(activeView === 'clusters' || activeView === 'all') && cluster && (
                  <div className="flex-shrink-0 w-12">
                    <div className="h-4 rounded overflow-hidden">
                      <div
                        className={`h-full ${getClusterColor(cluster.overallDensity)} transition-all`}
                        style={{ width: `${Math.min(cluster.overallDensity * 10, 100)}%` }}
                        title={`Consonant Density: ${cluster.overallDensity.toFixed(1)}/10`}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Line Text */}
                <div className="flex-grow min-w-0">
                  <div className={`leading-relaxed ${
                    (activeView === 'rhyme' || activeView === 'all') && rhyme
                      ? getRhymeColor(rhyme.rhymeLetter)
                      : 'text-white'
                  }`}>
                    {trimmed}
                  </div>
                  
                  {/* Details on Select */}
                  {isSelected && (
                    <div className="mt-2 text-xs space-y-2">
                      {stress && (activeView === 'stress' || activeView === 'all') && (
                        <div className="bg-black/40 p-2 rounded">
                          <div className="text-blue-400 font-semibold mb-1">📊 Syllable Stress</div>
                          <div className="text-gray-300">
                            Pattern: {stress.pattern} ({stress.patternType})
                          </div>
                          <div className="text-gray-400 text-[10px] mt-1">
                            {stress.syllables.length} syllables
                          </div>
                        </div>
                      )}
                      
                      {cluster && (activeView === 'clusters' || activeView === 'all') && (
                        <div className="bg-black/40 p-2 rounded">
                          <div className="text-orange-400 font-semibold mb-1">🔥 Consonant Clusters</div>
                          <div className="text-gray-300">
                            Density: {cluster.overallDensity.toFixed(1)}/10
                          </div>
                          {cluster.clusters.length > 0 && (
                            <div className="text-gray-400 text-[10px] mt-1">
                              Found: {cluster.clusters.map(c => c.text).join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {rhyme && (activeView === 'rhyme' || activeView === 'all') && (
                        <div className="bg-black/40 p-2 rounded">
                          <div className="text-purple-400 font-semibold mb-1">🎭 Rhyme Pattern</div>
                          <div className="text-gray-300">
                            Letter: {rhyme.rhymeLetter} • End word: "{rhyme.endWord}"
                          </div>
                          {rhyme.rhymesWith.length > 0 && (
                            <div className="text-gray-400 text-[10px] mt-1">
                              Rhymes with line{rhyme.rhymesWith.length > 1 ? 's' : ''}: {rhyme.rhymesWith.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Rhyme Letter Badge */}
                {(activeView === 'rhyme' || activeView === 'all') && rhyme && (
                  <div className="flex-shrink-0">
                    <span className={`text-lg font-bold ${getRhymeColor(rhyme.rhymeLetter)}`}>
                      {rhyme.rhymeLetter}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Analysis Sidebar */}
      <div className="w-80 flex flex-col gap-3">
        {/* Syllable Stress Summary */}
        {(activeView === 'stress' || activeView === 'all') && (
          <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-blue-300 mb-3">📊 Metrical Patterns</h4>
            
            <div className="space-y-2 text-xs">
              {['iambic', 'trochaic', 'anapestic', 'dactylic', 'mixed', 'irregular'].map(type => {
                const count = syllableStress.filter(s => s.patternType === type).length;
                if (count === 0) return null;
                
                return (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-gray-300 capitalize">{type}:</span>
                    <span className="text-white font-semibold">{count} lines</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-3 pt-3 border-t border-blue-500/20 text-[10px] text-gray-400">
              <div>💡 Blue bars = stressed syllables</div>
              <div>⚪ Gray bars = unstressed syllables</div>
            </div>
          </div>
        )}

        {/* Consonant Cluster Summary */}
        {(activeView === 'clusters' || activeView === 'all') && (
          <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-orange-300 mb-3">🔥 Consonant Density</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-300">High difficulty (8-10):</span>
                <span className="text-red-300">
                  {consonantClusters.filter(c => c.overallDensity >= 8).length} lines
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Medium (5-7):</span>
                <span className="text-yellow-300">
                  {consonantClusters.filter(c => c.overallDensity >= 5 && c.overallDensity < 8).length} lines
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Easy (0-4):</span>
                <span className="text-green-300">
                  {consonantClusters.filter(c => c.overallDensity < 5).length} lines
                </span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-orange-500/20 text-[10px] text-gray-400">
              <div>🔴 Red = Very difficult</div>
              <div>🟡 Yellow = Moderate</div>
              <div>🟢 Green = Easy</div>
            </div>
          </div>
        )}

        {/* Rhyme Scheme Summary */}
        {(activeView === 'rhyme' || activeView === 'all') && (
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-purple-300 mb-3">🎭 Rhyme Scheme</h4>
            
            <div className="space-y-2">
              {rhymeScheme.sections.map((section, idx) => (
                <div key={idx} className="bg-black/40 p-2 rounded">
                  <div className="text-xs font-semibold text-white mb-1">{section.sectionName}</div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-400">Scheme:</span>
                    <span className="text-purple-300 font-mono">{section.scheme}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-400">Quality:</span>
                    <span className={`capitalize ${
                      section.quality === 'perfect' ? 'text-green-400' :
                      section.quality === 'near' ? 'text-yellow-400' :
                      'text-gray-400'
                    }`}>
                      {section.quality}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-purple-500/20 text-[10px] text-gray-400">
              Overall: {rhymeScheme.overallPattern}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-black/20 border border-white/10 rounded-lg p-3">
          <h4 className="text-xs font-bold text-gray-400 mb-2">Legend</h4>
          <div className="space-y-1 text-[9px]">
            {(activeView === 'stress' || activeView === 'all') && (
              <div className="flex items-center gap-2">
                <span>📊</span>
                <span className="text-gray-400">Blue = Strong syllable</span>
              </div>
            )}
            {(activeView === 'clusters' || activeView === 'all') && (
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <span className="text-gray-400">Bar = Consonant difficulty</span>
              </div>
            )}
            {(activeView === 'rhyme' || activeView === 'all') && (
              <div className="flex items-center gap-2">
                <span>🎭</span>
                <span className="text-gray-400">Letter = Rhyme group</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
