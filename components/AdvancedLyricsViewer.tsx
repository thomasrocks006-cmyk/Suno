import React, { useState, useMemo } from 'react';
import { SongAnalysis } from '../types';
import {
  mapScoresToLineCritiques,
  calculateHighlightStats,
  LineCritique
} from '../services/interactiveLyricsService';
import {
  analyzeBreathPoints,
  extractImageryHighlights,
  buildNarrativeArc,
  calculateEnergyCurve,
  BreathPoint,
  ImageryHighlight,
  NarrativeArcPoint,
  EnergyCurvePoint
} from '../services/advancedLyricsFeatures';

interface AdvancedLyricsViewerProps {
  lyrics: string;
  analysis: SongAnalysis;
}

export const AdvancedLyricsViewer: React.FC<AdvancedLyricsViewerProps> = ({
  lyrics,
  analysis
}) => {
  const [showBreathMarkers, setShowBreathMarkers] = useState(true);
  const [showImagery, setShowImagery] = useState(true);
  const [showEnergyCurve, setShowEnergyCurve] = useState(true);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  // Process all advanced features
  const breathPoints = useMemo(() => analyzeBreathPoints(lyrics), [lyrics]);
  const imageryHighlights = useMemo(() => extractImageryHighlights(lyrics), [lyrics]);
  const narrativeArc = useMemo(() => buildNarrativeArc(lyrics), [lyrics]);
  const energyCurve = useMemo(() => calculateEnergyCurve(lyrics), [lyrics]);
  const lineCritiques = useMemo(() => mapScoresToLineCritiques(lyrics, analysis), [lyrics, analysis]);
  const highlightStats = useMemo(() => calculateHighlightStats(lineCritiques), [lineCritiques]);

  // Get data for specific line
  const getLineData = (lineNumber: number) => {
    const breathData = breathPoints.filter(bp => bp.lineNumber === lineNumber);
    const imageryData = imageryHighlights.find(ih => ih.lineNumber === lineNumber);
    const energyData = energyCurve.find(ec => ec.lineNumber === lineNumber);
    const critiqueData = lineCritiques.find(lc => lc.lineNumber === lineNumber);
    
    return { breathData, imageryData, energyData, critiqueData };
  };

  // Get narrative arc stage for a line
  const getArcStageForLine = (lineNumber: number): NarrativeArcPoint | null => {
    return narrativeArc.find(arc => 
      lineNumber >= arc.lineRange[0] && lineNumber <= arc.lineRange[1]
    ) || null;
  };

  // Energy curve color
  const getEnergyColor = (energy: number): string => {
    if (energy >= 8) return 'bg-red-500';
    if (energy >= 6) return 'bg-orange-500';
    if (energy >= 4) return 'bg-yellow-500';
    if (energy >= 2) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const lines = lyrics.split('\n');

  return (
    <div className="flex gap-4 h-full">
      {/* Main Lyrics Display */}
      <div className="flex-grow bg-black/20 rounded-lg p-4 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="mb-4 pb-3 border-b border-white/10">
          <h3 className="text-lg font-bold text-white mb-3">Advanced Lyrics Analysis</h3>
          
          {/* Toggle Controls */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowBreathMarkers(!showBreathMarkers)}
              className={`text-xs px-3 py-1 rounded transition ${
                showBreathMarkers ? 'bg-blue-500 text-white' : 'bg-black/30 text-gray-400'
              }`}
            >
              💨 Breath Markers
            </button>
            <button
              onClick={() => setShowImagery(!showImagery)}
              className={`text-xs px-3 py-1 rounded transition ${
                showImagery ? 'bg-purple-500 text-white' : 'bg-black/30 text-gray-400'
              }`}
            >
              🎨 Imagery
            </button>
            <button
              onClick={() => setShowEnergyCurve(!showEnergyCurve)}
              className={`text-xs px-3 py-1 rounded transition ${
                showEnergyCurve ? 'bg-orange-500 text-white' : 'bg-black/30 text-gray-400'
              }`}
            >
              ⚡ Energy Curve
            </button>
          </div>
        </div>

        {/* Lyrics Lines */}
        <div className="space-y-2 font-mono text-sm">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const trimmed = line.trim();
            
            // Skip empty lines
            if (!trimmed) return <div key={index} className="h-2"></div>;
            
            // Section headers
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
              const arcStage = narrativeArc.find(arc => arc.sectionName === trimmed.slice(1, -1));
              
              return (
                <div key={index} className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-400 font-bold">{trimmed}</div>
                    {arcStage && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded ${
                          arcStage.arcStage === 'climax' ? 'bg-red-500/30 text-red-300' :
                          arcStage.arcStage === 'setup' ? 'bg-blue-500/30 text-blue-300' :
                          arcStage.arcStage === 'resolution' ? 'bg-green-500/30 text-green-300' :
                          'bg-yellow-500/30 text-yellow-300'
                        }`}>
                          {arcStage.arcStage.replace('-', ' ')}
                        </span>
                        <span className="text-gray-500">
                          Intensity: {arcStage.emotionalIntensity}/10
                        </span>
                        <span className="text-gray-400">
                          {arcStage.thematicFocus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            const { breathData, imageryData, energyData, critiqueData } = getLineData(lineNumber);
            const isSelected = selectedLine === lineNumber;

            return (
              <div
                key={index}
                onClick={() => setSelectedLine(isSelected ? null : lineNumber)}
                className={`
                  flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all
                  ${isSelected ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/50' : 'bg-black/20 border-white/10 hover:bg-black/40'}
                `}
              >
                {/* Line Number */}
                <div className="flex-shrink-0 w-8 text-right text-xs text-gray-500">
                  {lineNumber}
                </div>

                {/* Energy Bar (if enabled) */}
                {showEnergyCurve && energyData && (
                  <div className="flex-shrink-0 w-12">
                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getEnergyColor(energyData.energy)} transition-all`}
                        style={{ width: `${energyData.energy * 10}%` }}
                        title={`Energy: ${energyData.energy}/10`}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Line Text with Highlights */}
                <div className="flex-grow">
                  <div className="text-white leading-relaxed">
                    {/* Breath markers */}
                    {showBreathMarkers && breathData.length > 0 && breathData.some(b => b.position === 'start') && (
                      <span className="text-blue-400 mr-1" title="Breath point">💨</span>
                    )}
                    
                    {/* Imagery highlight */}
                    {showImagery && imageryData ? (
                      <span
                        className="relative inline-block"
                        title={`${imageryData.sensoryType} imagery (${imageryData.intensity}/10)`}
                      >
                        <span className={`
                          ${imageryData.sensoryType === 'visual' ? 'text-purple-300' :
                            imageryData.sensoryType === 'auditory' ? 'text-blue-300' :
                            imageryData.sensoryType === 'tactile' ? 'text-green-300' :
                            imageryData.sensoryType === 'olfactory' ? 'text-yellow-300' :
                            imageryData.sensoryType === 'gustatory' ? 'text-pink-300' :
                            'text-red-300'}
                        `}>
                          {trimmed}
                        </span>
                        <span className="absolute -top-1 -right-1 text-xs">🎨</span>
                      </span>
                    ) : (
                      trimmed
                    )}
                    
                    {/* Breath markers - end */}
                    {showBreathMarkers && breathData.length > 0 && breathData.some(b => b.position === 'end') && (
                      <span className="text-blue-400 ml-1" title="Breath point">💨</span>
                    )}
                  </div>
                  
                  {/* Metadata on hover/select */}
                  {isSelected && (
                    <div className="mt-2 text-xs space-y-1">
                      {breathData.length > 0 && (
                        <div className="text-blue-400">
                          💨 {breathData.length} breath point{breathData.length > 1 ? 's' : ''} • 
                          {breathData[0].syllableCount} syllables • {breathData[0].breathability} breathing
                        </div>
                      )}
                      {imageryData && (
                        <div className="text-purple-400">
                          🎨 {imageryData.sensoryType} imagery ({imageryData.intensity}/10) • 
                          Words: {imageryData.words.join(', ')}
                        </div>
                      )}
                      {energyData && (
                        <div className="text-orange-400">
                          ⚡ Energy: {energyData.energy}/10 • 
                          Density: {energyData.factors.syllableDensity.toFixed(1)} • 
                          Intensity: {energyData.factors.wordIntensity.toFixed(1)}
                        </div>
                      )}
                      {critiqueData && critiqueData.highlights.length > 0 && (
                        <div className="text-yellow-400">
                          💡 {critiqueData.highlights.length} suggestion{critiqueData.highlights.length > 1 ? 's' : ''} from agents
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Visual Indicators */}
                <div className="flex-shrink-0 flex gap-1">
                  {showBreathMarkers && breathData.some(b => b.breathability === 'difficult') && (
                    <span className="text-red-400 text-xs" title="Difficult breathing">⚠️</span>
                  )}
                  {showImagery && imageryData && imageryData.intensity >= 7 && (
                    <span className="text-purple-400 text-xs" title="Strong imagery">✨</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrative Arc Sidebar */}
      <div className="w-80 flex flex-col gap-3">
        {/* Narrative Arc Progress */}
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-lg p-4">
          <h4 className="text-sm font-bold text-purple-300 mb-3">📖 Narrative Arc</h4>
          
          <div className="space-y-3">
            {narrativeArc.map((arc, index) => (
              <div key={index} className="bg-black/40 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{arc.sectionName}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded ${
                    arc.arcStage === 'climax' ? 'bg-red-500/30 text-red-300' :
                    arc.arcStage === 'setup' ? 'bg-blue-500/30 text-blue-300' :
                    arc.arcStage === 'resolution' ? 'bg-green-500/30 text-green-300' :
                    'bg-yellow-500/30 text-yellow-300'
                  }`}>
                    {arc.arcStage.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-[10px] text-gray-400 mb-2">
                  Lines {arc.lineRange[0]}-{arc.lineRange[1]}
                </div>
                
                {/* Emotional Intensity Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-[9px] text-gray-500 mb-1">
                    <span>Emotional Intensity</span>
                    <span>{arc.emotionalIntensity}/10</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${arc.emotionalIntensity * 10}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-[10px] text-purple-300">
                  {arc.thematicFocus}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Imagery Stats */}
        <div className="bg-black/20 border border-white/10 rounded-lg p-3">
          <h4 className="text-xs font-bold text-purple-400 mb-2">🎨 Imagery Breakdown</h4>
          
          <div className="space-y-1 text-[10px]">
            {['visual', 'auditory', 'tactile', 'emotional', 'olfactory', 'gustatory'].map(type => {
              const count = imageryHighlights.filter(h => h.sensoryType === type).length;
              if (count === 0) return null;
              
              return (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-gray-400 capitalize">{type}:</span>
                  <span className="text-white font-semibold">{count} lines</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Energy Curve Visualization */}
        {showEnergyCurve && (
          <div className="bg-black/20 border border-white/10 rounded-lg p-3">
            <h4 className="text-xs font-bold text-orange-400 mb-2">⚡ Energy Curve</h4>
            
            <div className="h-32 flex items-end gap-0.5">
              {energyCurve.map((point, index) => (
                <div
                  key={index}
                  className="flex-1 relative group"
                  title={`Line ${point.lineNumber}: ${point.energy}/10`}
                >
                  <div
                    className={`${getEnergyColor(point.energy)} transition-all hover:opacity-70 rounded-t`}
                    style={{ height: `${point.energy * 10}%` }}
                  ></div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black/90 text-white text-[8px] px-2 py-1 rounded whitespace-nowrap z-10">
                    L{point.lineNumber}: {point.energy}/10
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-[9px] text-gray-500 mt-2">
              <span>Start</span>
              <span>Middle</span>
              <span>End</span>
            </div>
          </div>
        )}

        {/* Breath Analysis Summary */}
        {showBreathMarkers && (
          <div className="bg-black/20 border border-white/10 rounded-lg p-3">
            <h4 className="text-xs font-bold text-blue-400 mb-2">💨 Breath Analysis</h4>
            
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Total breath points:</span>
                <span className="text-white">{breathPoints.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Difficult passages:</span>
                <span className="text-red-300">{breathPoints.filter(b => b.breathability === 'difficult').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Easy breathing:</span>
                <span className="text-green-300">{breathPoints.filter(b => b.breathability === 'easy').length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-black/20 border border-white/10 rounded-lg p-3">
          <h4 className="text-xs font-bold text-gray-400 mb-2">Legend</h4>
          <div className="space-y-1 text-[9px]">
            <div className="flex items-center gap-2">
              <span>💨</span>
              <span className="text-gray-400">Breath point</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎨</span>
              <span className="text-gray-400">Imagery highlight</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span className="text-gray-400">Energy level</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span className="text-gray-400">Difficult breathing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
