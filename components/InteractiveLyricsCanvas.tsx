import React, { useState, useMemo } from 'react';
import { SongAnalysis } from '../types';
import {
  mapScoresToLineCritiques,
  generateTooltip,
  calculateHighlightStats,
  findPriorityLines,
  groupCritiquesByAgent,
  LineCritique,
  TooltipData,
  HighlightColor
} from '../services/interactiveLyricsService';

interface InteractiveLyricsCanvasProps {
  lyrics: string;
  analysis: SongAnalysis;
  onLineClick?: (lineNumber: number) => void;
}

export const InteractiveLyricsCanvas: React.FC<InteractiveLyricsCanvasProps> = ({
  lyrics,
  analysis,
  onLineClick
}) => {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning'>('all');

  // Process line critiques
  const lineCritiques = useMemo(() => 
    mapScoresToLineCritiques(lyrics, analysis),
    [lyrics, analysis]
  );

  const highlightStats = useMemo(() => 
    calculateHighlightStats(lineCritiques),
    [lineCritiques]
  );

  const priorityLines = useMemo(() => 
    findPriorityLines(lineCritiques, 5),
    [lineCritiques]
  );

  const agentGroups = useMemo(() => 
    groupCritiquesByAgent(lineCritiques),
    [lineCritiques]
  );

  // Filter lines based on severity
  const filteredCritiques = useMemo(() => {
    if (filterSeverity === 'all') return lineCritiques;
    if (filterSeverity === 'critical') {
      return lineCritiques.filter(lc => lc.color === 'critical');
    }
    return lineCritiques.filter(lc => lc.color === 'critical' || lc.color === 'warning');
  }, [lineCritiques, filterSeverity]);

  // Get tooltip data for hovered or selected line
  const activeTooltip: TooltipData | null = useMemo(() => {
    const lineNum = selectedLine !== null ? selectedLine : hoveredLine;
    if (lineNum === null) return null;
    
    const critique = lineCritiques.find(lc => lc.lineNumber === lineNum);
    return critique ? generateTooltip(critique) : null;
  }, [hoveredLine, selectedLine, lineCritiques]);

  // Color mapping for highlights
  const getHighlightClass = (color: HighlightColor): string => {
    const colorMap: Record<HighlightColor, string> = {
      critical: 'bg-red-500/20 border-red-500/40 hover:bg-red-500/30',
      warning: 'bg-yellow-500/20 border-yellow-500/40 hover:bg-yellow-500/30',
      creative: 'bg-purple-500/20 border-purple-500/40 hover:bg-purple-500/30',
      performance: 'bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30',
      strength: 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20'
    };
    return colorMap[color];
  };

  const getColorIndicator = (color: HighlightColor): string => {
    const colorMap: Record<HighlightColor, string> = {
      critical: '🔴',
      warning: '⚠️',
      creative: '🎨',
      performance: '🎤',
      strength: '✨'
    };
    return colorMap[color];
  };

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber === selectedLine ? null : lineNumber);
    onLineClick?.(lineNumber);
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Main Lyrics Canvas */}
      <div className="flex-grow bg-black/20 rounded-lg p-4 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">Interactive Lyrics</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterSeverity('all')}
                className={`text-xs px-3 py-1 rounded transition ${
                  filterSeverity === 'all' ? 'bg-blue-500 text-white' : 'bg-black/30 text-gray-400 hover:text-white'
                }`}
              >
                All ({lineCritiques.length})
              </button>
              <button
                onClick={() => setFilterSeverity('warning')}
                className={`text-xs px-3 py-1 rounded transition ${
                  filterSeverity === 'warning' ? 'bg-yellow-500 text-white' : 'bg-black/30 text-gray-400 hover:text-white'
                }`}
              >
                Issues ({highlightStats.criticalLines + highlightStats.warningLines})
              </button>
              <button
                onClick={() => setFilterSeverity('critical')}
                className={`text-xs px-3 py-1 rounded transition ${
                  filterSeverity === 'critical' ? 'bg-red-500 text-white' : 'bg-black/30 text-gray-400 hover:text-white'
                }`}
              >
                Critical ({highlightStats.criticalLines})
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500/40"></span>
              {highlightStats.criticalLines} Critical
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500/40"></span>
              {highlightStats.warningLines} Warnings
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-purple-500/40"></span>
              {highlightStats.infoLines} Creative
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500/40"></span>
              {highlightStats.strengthLines} Strong
            </div>
            <div className="ml-auto">
              {highlightStats.coveragePercentage}% Coverage
            </div>
          </div>
        </div>

        {/* Lyrics Lines */}
        <div className="space-y-1 font-mono text-sm">
          {filteredCritiques.map(critique => {
            const isHovered = hoveredLine === critique.lineNumber;
            const isSelected = selectedLine === critique.lineNumber;
            const isActive = isHovered || isSelected;

            return (
              <div
                key={critique.lineNumber}
                className={`
                  flex items-start gap-3 p-2 rounded-lg border cursor-pointer transition-all
                  ${getHighlightClass(critique.color)}
                  ${isActive ? 'ring-2 ring-white/20 shadow-lg scale-[1.02]' : 'border-white/10'}
                `}
                onMouseEnter={() => setHoveredLine(critique.lineNumber)}
                onMouseLeave={() => setHoveredLine(null)}
                onClick={() => handleLineClick(critique.lineNumber)}
              >
                {/* Line Number & Color Indicator */}
                <div className="flex-shrink-0 w-12 text-right">
                  <div className="text-gray-500 text-xs">{critique.lineNumber}</div>
                  <div className="text-lg">{getColorIndicator(critique.color)}</div>
                </div>

                {/* Line Text */}
                <div className="flex-grow">
                  <div className="text-white leading-relaxed">
                    {critique.lineText || '(empty line)'}
                  </div>
                  
                  {/* Quick Preview of Issues (on hover) */}
                  {isActive && critique.highlights.length > 0 && (
                    <div className="mt-2 text-xs text-gray-400">
                      {critique.highlights.length} issue{critique.highlights.length > 1 ? 's' : ''} from{' '}
                      {[...new Set(critique.agentOpinions.map(o => o.agent))].join(', ')}
                    </div>
                  )}
                </div>

                {/* Issue Count Badge */}
                {critique.highlights.length > 0 && (
                  <div className="flex-shrink-0">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${critique.overallSeverity === 'error' ? 'bg-red-500 text-white' :
                        critique.overallSeverity === 'warning' ? 'bg-yellow-500 text-black' :
                        'bg-blue-500 text-white'}
                    `}>
                      {critique.highlights.length}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Critique Sidebar */}
      <div className="w-80 flex flex-col gap-3">
        {/* Active Tooltip */}
        {activeTooltip ? (
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-indigo-300">Line {activeTooltip.lineNumber}</h4>
              <button
                onClick={() => setSelectedLine(null)}
                className="text-gray-400 hover:text-white transition text-xs"
              >
                ✕
              </button>
            </div>
            
            <div className="text-xs text-gray-300 mb-3">
              {activeTooltip.summary}
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              {activeTooltip.critiques.map((critique, i) => (
                <div key={i} className="bg-black/40 p-2 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-300">{critique.agent}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                      critique.severity === 'error' ? 'bg-red-500/30 text-red-300' :
                      critique.severity === 'warning' ? 'bg-yellow-500/30 text-yellow-300' :
                      'bg-blue-500/30 text-blue-300'
                    }`}>
                      {critique.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-300 mb-2">{critique.message}</div>
                  
                  {critique.quickFixes && critique.quickFixes.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] text-gray-500 font-semibold">Quick Fixes:</div>
                      {critique.quickFixes.map(fix => (
                        <button
                          key={fix.id}
                          className="w-full text-left text-[10px] bg-green-500/20 hover:bg-green-500/30 text-green-300 p-2 rounded transition"
                        >
                          <div className="font-semibold mb-0.5">{fix.label}</div>
                          <div className="text-gray-400">{fix.scoreImpact}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-black/20 border border-white/10 rounded-lg p-4 text-center">
            <div className="text-4xl mb-2">💡</div>
            <div className="text-xs text-gray-400">
              Click or hover over a line to see detailed feedback
            </div>
          </div>
        )}

        {/* Priority Lines */}
        <div className="bg-black/20 border border-white/10 rounded-lg p-3">
          <h4 className="text-xs font-bold text-yellow-400 mb-2">🎯 Priority Lines</h4>
          <div className="space-y-2">
            {priorityLines.map(line => (
              <button
                key={line.lineNumber}
                onClick={() => {
                  setSelectedLine(line.lineNumber);
                  // Scroll to line (would need ref implementation)
                }}
                className="w-full text-left bg-black/40 hover:bg-black/60 p-2 rounded transition text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400">Line {line.lineNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] ${
                    line.overallSeverity === 'error' ? 'bg-red-500/30 text-red-300' :
                    'bg-yellow-500/30 text-yellow-300'
                  }`}>
                    {line.highlights.length} issues
                  </span>
                </div>
                <div className="text-gray-300 truncate">{line.lineText}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Agent Activity */}
        <div className="bg-black/20 border border-white/10 rounded-lg p-3">
          <h4 className="text-xs font-bold text-purple-400 mb-2">🎭 Agent Activity</h4>
          <div className="space-y-2">
            {agentGroups.map(group => (
              <div key={group.agent} className="bg-black/40 p-2 rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">{group.agent}</span>
                  <span className="text-[10px] text-gray-400">
                    {group.totalCritiques} critiques
                  </span>
                </div>
                <div className="flex gap-2 text-[9px] mb-1">
                  {group.criticalCount > 0 && (
                    <span className="bg-red-500/30 text-red-300 px-1.5 py-0.5 rounded">
                      {group.criticalCount} critical
                    </span>
                  )}
                  {group.warningCount > 0 && (
                    <span className="bg-yellow-500/30 text-yellow-300 px-1.5 py-0.5 rounded">
                      {group.warningCount} warnings
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-gray-500">
                  Top: {group.topCategories.map(c => c.category).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-black/20 border border-white/10 rounded-lg p-3">
          <h4 className="text-xs font-bold text-gray-400 mb-2">Color Legend</h4>
          <div className="space-y-1 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔴</span>
              <span className="text-gray-400">Critical - Must fix</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span className="text-gray-400">Warning - Should improve</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎨</span>
              <span className="text-gray-400">Creative - Consider options</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎤</span>
              <span className="text-gray-400">Performance - Vocal notes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <span className="text-gray-400">Strength - Working well</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
