import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SongAnalysis, SongInputs } from '../types';
import {
  mapScoresToLineCritiques,
  calculateHighlightStats,
  findPriorityLines,
  LineCritique,
  HighlightColor
} from '../services/interactiveLyricsService';

interface PolishedLyricsEditorProps {
  initialLyrics: string;
  analysis: SongAnalysis;
  songInputs: SongInputs;
  onLyricsChange?: (newLyrics: string) => void;
  onReanalyze?: (newLyrics: string, inputs: SongInputs) => Promise<SongAnalysis>;
  isMobile?: boolean;
}

interface EditHistory {
  lyrics: string;
  timestamp: number;
  description: string;
}

export const PolishedLyricsEditor: React.FC<PolishedLyricsEditorProps> = ({
  initialLyrics,
  analysis,
  songInputs,
  onLyricsChange,
  onReanalyze,
  isMobile = false
}) => {
  const [lyrics, setLyrics] = useState(initialLyrics);
  const [editingLine, setEditingLine] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(analysis);
  const [lockedLines, setLockedLines] = useState<Set<number>>(new Set());
  const [showExplanations, setShowExplanations] = useState(true);
  const [showBatchMode, setShowBatchMode] = useState(false);
  const [selectedFixes, setSelectedFixes] = useState<Set<number>>(new Set());
  
  // Accessibility
  const [announceMessage, setAnnounceMessage] = useState('');
  
  // Edit history
  const [undoStack, setUndoStack] = useState<EditHistory[]>([
    { lyrics: initialLyrics, timestamp: Date.now(), description: 'Initial state' }
  ]);
  const [redoStack, setRedoStack] = useState<EditHistory[]>([]);
  
  // Debouncing
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Touch handling
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Process analysis
  const lineCritiques = useMemo(
    () => mapScoresToLineCritiques(lyrics, currentAnalysis),
    [lyrics, currentAnalysis]
  );
  
  const highlightStats = useMemo(
    () => calculateHighlightStats(lineCritiques),
    [lineCritiques]
  );
  
  const priorityLines = useMemo(
    () => findPriorityLines(lineCritiques),
    [lineCritiques]
  );

  // Sync with parent
  useEffect(() => {
    if (onLyricsChange) {
      onLyricsChange(lyrics);
    }
  }, [lyrics, onLyricsChange]);

  // Announce for screen readers
  const announce = useCallback((message: string) => {
    setAnnounceMessage(message);
    setTimeout(() => setAnnounceMessage(''), 3000);
  }, []);

  // Schedule re-analysis (debounced)
  const scheduleReanalysis = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(async () => {
      if (onReanalyze) {
        setIsReanalyzing(true);
        announce('Re-analyzing lyrics...');
        try {
          const newAnalysis = await onReanalyze(lyrics, songInputs);
          setCurrentAnalysis(newAnalysis);
          announce('Re-analysis complete');
        } catch (error) {
          console.error('Re-analysis failed:', error);
          announce('Re-analysis failed');
        } finally {
          setIsReanalyzing(false);
        }
      }
    }, 2000);
  }, [lyrics, songInputs, onReanalyze, announce]);

  // Save edit to history
  const saveEdit = useCallback((newLyrics: string, description: string) => {
    const newEntry: EditHistory = {
      lyrics: newLyrics,
      timestamp: Date.now(),
      description
    };
    
    setUndoStack(prev => [...prev, newEntry]);
    setRedoStack([]);
    setLyrics(newLyrics);
    scheduleReanalysis();
  }, [scheduleReanalysis]);

  // Undo/Redo
  const handleUndo = useCallback(() => {
    if (undoStack.length <= 1) return;
    
    const current = undoStack[undoStack.length - 1];
    const previous = undoStack[undoStack.length - 2];
    
    setRedoStack(prev => [...prev, current]);
    setUndoStack(prev => prev.slice(0, -1));
    setLyrics(previous.lyrics);
    announce(`Undone: ${current.description}`);
  }, [undoStack, announce]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const next = redoStack[redoStack.length - 1];
    
    setUndoStack(prev => [...prev, next]);
    setRedoStack(prev => prev.slice(0, -1));
    setLyrics(next.lyrics);
    announce(`Redone: ${next.description}`);
  }, [redoStack, announce]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Escape' && editingLine !== null) {
        e.preventDefault();
        setEditingLine(null);
        setEditValue('');
        announce('Edit cancelled');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, editingLine, announce]);

  // Line editing
  const startEditing = useCallback((lineNumber: number, currentText: string) => {
    if (lockedLines.has(lineNumber)) {
      announce('This line is locked');
      return;
    }
    
    setEditingLine(lineNumber);
    setEditValue(currentText);
    announce(`Editing line ${lineNumber}`);
  }, [lockedLines, announce]);

  const saveLineEdit = useCallback(() => {
    if (editingLine === null) return;
    
    const lines = lyrics.split('\n');
    lines[editingLine - 1] = editValue;
    const newLyrics = lines.join('\n');
    
    saveEdit(newLyrics, `Edited line ${editingLine}`);
    setEditingLine(null);
    setEditValue('');
    announce(`Line ${editingLine} saved`);
  }, [editingLine, editValue, lyrics, saveEdit, announce]);

  const cancelEdit = useCallback(() => {
    setEditingLine(null);
    setEditValue('');
    announce('Edit cancelled');
  }, [announce]);

  // Line locking
  const toggleLineLock = useCallback((lineNumber: number) => {
    setLockedLines(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lineNumber)) {
        newSet.delete(lineNumber);
        announce(`Line ${lineNumber} unlocked`);
      } else {
        newSet.add(lineNumber);
        announce(`Line ${lineNumber} locked`);
      }
      return newSet;
    });
  }, [announce]);

  // Batch fix mode
  const toggleFixSelection = useCallback((lineNumber: number) => {
    setSelectedFixes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lineNumber)) {
        newSet.delete(lineNumber);
      } else {
        newSet.add(lineNumber);
      }
      return newSet;
    });
  }, []);

  const applyBatchFixes = useCallback(() => {
    const lines = lyrics.split('\n');
    let changedCount = 0;
    
    selectedFixes.forEach(lineNumber => {
      const critique = lineCritiques.find(c => c.lineNumber === lineNumber);
      if (critique && critique.highlights.length > 0) {
        const firstQuickFix = critique.highlights[0].quickFixes?.[0];
        if (firstQuickFix) {
          lines[lineNumber - 1] = firstQuickFix.suggestedText;
          changedCount++;
        }
      }
    });
    
    if (changedCount > 0) {
      const newLyrics = lines.join('\n');
      saveEdit(newLyrics, `Applied ${changedCount} quick fixes`);
      setSelectedFixes(new Set());
      setShowBatchMode(false);
      announce(`Applied ${changedCount} quick fixes`);
    }
  }, [lyrics, selectedFixes, lineCritiques, saveEdit, announce]);

  // Touch handling for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent, lineNumber: number) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    setHoveredLine(lineNumber);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent, lineNumber: number, lineText: string) => {
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    const deltaTime = Date.now() - touchStartRef.current.time;
    
    // Long press (lock/unlock)
    if (deltaTime > 500 && deltaX < 10 && deltaY < 10) {
      toggleLineLock(lineNumber);
    }
    // Tap (select/edit)
    else if (deltaTime < 300 && deltaX < 10 && deltaY < 10) {
      if (selectedLine === lineNumber) {
        startEditing(lineNumber, lineText);
      } else {
        setSelectedLine(lineNumber);
      }
    }
    
    touchStartRef.current = null;
    setHoveredLine(null);
  }, [selectedLine, startEditing, toggleLineLock]);

  const lines = lyrics.split('\n');

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 h-full`}>
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announceMessage}
      </div>

      {/* Main Editor */}
      <div className="flex-grow bg-black/20 rounded-lg p-4 overflow-y-auto custom-scrollbar">
        {/* Toolbar */}
        <div className="mb-4 pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={undoStack.length <= 1}
              className="text-xs px-3 py-1.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Undo last change"
              title="Undo (Ctrl+Z)"
            >
              ↶ Undo
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="text-xs px-3 py-1.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Redo last undone change"
              title="Redo (Ctrl+Y)"
            >
              ↷ Redo
            </button>
            <div className="text-xs text-gray-500" aria-live="polite">
              {undoStack.length - 1} edits
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExplanations(!showExplanations)}
              className={`text-xs px-3 py-1.5 rounded transition ${
                showExplanations ? 'bg-purple-500 text-white' : 'bg-black/30 text-gray-400'
              }`}
              aria-pressed={showExplanations}
              aria-label="Toggle explanations"
            >
              {showExplanations ? '💡 Hide' : '💡 Show'} Explanations
            </button>
            
            <button
              onClick={() => {
                setShowBatchMode(!showBatchMode);
                if (!showBatchMode) setSelectedFixes(new Set());
              }}
              className={`text-xs px-3 py-1.5 rounded transition ${
                showBatchMode ? 'bg-orange-500 text-white' : 'bg-black/30 text-gray-400'
              }`}
              aria-pressed={showBatchMode}
              aria-label="Toggle batch fix mode"
            >
              ⚙️ Batch Mode
            </button>

            {showBatchMode && selectedFixes.size > 0 && (
              <button
                onClick={applyBatchFixes}
                className="text-xs px-3 py-1.5 rounded bg-green-500 text-white hover:bg-green-600 transition"
                aria-label={`Apply ${selectedFixes.size} selected fixes`}
              >
                ✓ Apply {selectedFixes.size} Fix{selectedFixes.size > 1 ? 'es' : ''}
              </button>
            )}

            {isReanalyzing && (
              <div className="text-xs text-yellow-400 flex items-center gap-1" role="status">
                <span className="animate-spin">⟳</span> Re-analyzing...
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-3 flex gap-4 text-xs flex-wrap" role="region" aria-label="Analysis statistics">
          <div className="text-red-400" aria-label={`${highlightStats.criticalLines} critical issues`}>
            🔴 {highlightStats.criticalLines} Critical
          </div>
          <div className="text-yellow-400" aria-label={`${highlightStats.warningLines} warnings`}>
            🟡 {highlightStats.warningLines} Warnings
          </div>
          <div className="text-gray-400" aria-label={`${highlightStats.coveragePercentage.toFixed(0)}% coverage`}>
            📊 {highlightStats.coveragePercentage.toFixed(0)}% Coverage
          </div>
          <div className="text-blue-400" aria-label={`${lockedLines.size} locked lines`}>
            🔒 {lockedLines.size} Locked
          </div>
        </div>

        {/* Lyrics Lines */}
        <div className="space-y-2 font-mono text-sm" role="list" aria-label="Lyrics editor">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const trimmed = line.trim();
            
            if (!trimmed) return <div key={index} className="h-2"></div>;
            
            // Section headers
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
              return (
                <div key={index} className="py-2" role="separator">
                  <div className="text-blue-400 font-bold text-base">{trimmed}</div>
                </div>
              );
            }

            const critique = lineCritiques.find(c => c.lineNumber === lineNumber);
            const isEditing = editingLine === lineNumber;
            const isSelected = selectedLine === lineNumber;
            const isHovered = hoveredLine === lineNumber;
            const isLocked = lockedLines.has(lineNumber);
            const isSelectedForFix = selectedFixes.has(lineNumber);
            
            const hasQuickFix = critique && critique.highlights.some(h => h.quickFixes && h.quickFixes.length > 0);

            return (
              <div
                key={index}
                role="listitem"
                aria-label={`Line ${lineNumber}: ${trimmed}${isLocked ? ' (locked)' : ''}${critique ? ` - ${critique.highlights.length} suggestions` : ''}`}
                className={`
                  flex items-start gap-3 p-3 rounded-lg border transition-all
                  ${isSelected ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/50' : 'bg-black/20 border-white/10'}
                  ${isHovered && !isEditing ? 'bg-black/40' : ''}
                  ${isLocked ? 'opacity-60' : ''}
                  ${isSelectedForFix ? 'ring-2 ring-green-500/50' : ''}
                `}
              >
                {/* Line Number */}
                <div className="flex-shrink-0 w-8 text-right text-xs text-gray-500 pt-1">
                  {lineNumber}
                </div>

                {/* Batch Mode Checkbox */}
                {showBatchMode && hasQuickFix && (
                  <div className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={isSelectedForFix}
                      onChange={() => toggleFixSelection(lineNumber)}
                      className="w-4 h-4 cursor-pointer"
                      aria-label={`Select line ${lineNumber} for batch fix`}
                    />
                  </div>
                )}

                {/* Line Content */}
                <div className="flex-grow min-w-0">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveLineEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="w-full px-2 py-1 bg-black/60 border border-blue-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        aria-label={`Editing line ${lineNumber}`}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveLineEdit}
                          className="text-xs px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition"
                          aria-label="Save edit"
                        >
                          ✓ Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-xs px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
                          aria-label="Cancel edit"
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div
                        className={`text-white leading-relaxed cursor-pointer ${
                          critique && critique.color !== 'strength' ? `text-${critique.color}-300` : ''
                        }`}
                        onClick={() => {
                          if (!isMobile) {
                            if (isSelected) {
                              startEditing(lineNumber, trimmed);
                            } else {
                              setSelectedLine(lineNumber);
                            }
                          }
                        }}
                        onMouseEnter={() => !isMobile && setHoveredLine(lineNumber)}
                        onMouseLeave={() => !isMobile && setHoveredLine(null)}
                        onTouchStart={(e) => isMobile && handleTouchStart(e, lineNumber)}
                        onTouchEnd={(e) => isMobile && handleTouchEnd(e, lineNumber, trimmed)}
                        tabIndex={0}
                        role="button"
                        aria-label={`${trimmed}. Click to ${isSelected ? 'edit' : 'select'}. ${isMobile ? 'Long press to lock/unlock' : ''}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (isSelected) {
                              startEditing(lineNumber, trimmed);
                            } else {
                              setSelectedLine(lineNumber);
                            }
                          }
                        }}
                      >
                        {trimmed}
                      </div>

                      {/* Explanations */}
                      {showExplanations && isSelected && critique && critique.highlights.length > 0 && (
                        <div className="mt-2 space-y-2 text-xs" role="region" aria-label="Suggestions">
                          {critique.highlights.map((highlight, idx) => (
                            <div key={idx} className="bg-black/40 p-2 rounded border-l-2 border-yellow-500">
                              <div className="text-gray-300 mb-1">{highlight.reason}</div>
                              {highlight.quickFixes && highlight.quickFixes.length > 0 && (
                                <div className="space-y-1">
                                  {highlight.quickFixes.map((fix, fixIdx) => (
                                    <button
                                      key={fixIdx}
                                      onClick={() => {
                                        const lines = lyrics.split('\n');
                                        lines[lineNumber - 1] = fix.suggestedText;
                                        const newLyrics = lines.join('\n');
                                        saveEdit(newLyrics, `Applied quick fix to line ${lineNumber}`);
                                      }}
                                      className="block w-full text-left px-2 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition"
                                      aria-label={`Apply suggestion: ${fix.explanation}`}
                                    >
                                      💡 {fix.explanation}: "{fix.suggestedText}"
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Icons */}
                <div className="flex-shrink-0 flex gap-2">
                  {isLocked && (
                    <span className="text-blue-400 text-sm" aria-label="Locked line">🔒</span>
                  )}
                  {!isEditing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLineLock(lineNumber);
                      }}
                      className="text-xs text-gray-500 hover:text-blue-400 transition p-1"
                      aria-label={isLocked ? `Unlock line ${lineNumber}` : `Lock line ${lineNumber}`}
                      title={isMobile ? 'Long press line to lock/unlock' : isLocked ? 'Unlock' : 'Lock'}
                    >
                      {isLocked ? '🔓' : '🔒'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Hints */}
        <div className="mt-4 pt-3 border-t border-white/10 text-xs text-gray-500 space-y-1" role="complementary">
          {isMobile ? (
            <>
              <div>📱 Tap to select, tap again to edit</div>
              <div>⏱️ Long press to lock/unlock line</div>
            </>
          ) : (
            <>
              <div>⌨️ Click to select, click again to edit | Esc to cancel | Enter to save</div>
              <div>⌨️ Ctrl+Z undo | Ctrl+Y redo</div>
              <div>🔒 Lock lines to prevent re-analysis</div>
            </>
          )}
          {onReanalyze && (
            <div>🔄 Changes auto-reanalyzed after 2s idle</div>
          )}
        </div>
      </div>

      {/* Priority Sidebar (desktop only) */}
      {!isMobile && (
        <div className="w-80 bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/30 rounded-lg p-4 overflow-y-auto custom-scrollbar">
          <h4 className="text-sm font-bold text-red-300 mb-3">🔥 Priority Issues</h4>
          
          {priorityLines.length === 0 ? (
            <div className="text-gray-400 text-xs">No major issues detected! 🎉</div>
          ) : (
            <div className="space-y-3">
              {priorityLines.slice(0, 5).map((critique) => (
                <button
                  key={critique.lineNumber}
                  onClick={() => {
                    setSelectedLine(critique.lineNumber);
                    document.querySelector(`[aria-label*="Line ${critique.lineNumber}:"]`)?.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'center' 
                    });
                  }}
                  className="w-full text-left bg-black/40 p-3 rounded hover:bg-black/60 transition"
                  aria-label={`Jump to line ${critique.lineNumber}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-mono text-gray-500">Line {critique.lineNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      critique.color === 'critical' ? 'bg-red-500/30 text-red-300' :
                      critique.color === 'warning' ? 'bg-yellow-500/30 text-yellow-300' :
                      'bg-blue-500/30 text-blue-300'
                    }`}>
                      {critique.highlights.length} issue{critique.highlights.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="text-xs text-white mb-2 font-mono truncate">
                    {lyrics.split('\n')[critique.lineNumber - 1]}
                  </div>
                  
                  {critique.highlights[0] && (
                    <div className="text-[10px] text-gray-400">
                      {critique.highlights[0].reason.slice(0, 80)}...
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
