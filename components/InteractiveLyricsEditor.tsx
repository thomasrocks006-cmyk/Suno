import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SongAnalysis, SongInputs } from '../types';
import {
  mapScoresToLineCritiques,
  generateTooltip,
  calculateHighlightStats,
  LineCritique,
  HighlightColor
} from '../services/interactiveLyricsService';

interface EditHistoryEntry {
  lyrics: string;
  timestamp: number;
  description: string;
}

interface InteractiveLyricsEditorProps {
  initialLyrics: string;
  analysis: SongAnalysis;
  songInputs: SongInputs;
  onLyricsChange?: (newLyrics: string) => void;
  onReanalyze?: (newLyrics: string) => Promise<SongAnalysis>;
  syncWithDeepAnalysis?: boolean;
}

export const InteractiveLyricsEditor: React.FC<InteractiveLyricsEditorProps> = ({
  initialLyrics,
  analysis,
  songInputs,
  onLyricsChange,
  onReanalyze,
  syncWithDeepAnalysis = true
}) => {
  const [lyrics, setLyrics] = useState(initialLyrics);
  const [editingLine, setEditingLine] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [undoStack, setUndoStack] = useState<EditHistoryEntry[]>([
    { lyrics: initialLyrics, timestamp: Date.now(), description: 'Initial state' }
  ]);
  const [redoStack, setRedoStack] = useState<EditHistoryEntry[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(analysis);
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Process line critiques
  const lineCritiques = mapScoresToLineCritiques(lyrics, currentAnalysis);
  const highlightStats = calculateHighlightStats(lineCritiques);

  // Update lyrics when initialLyrics changes (bidirectional sync)
  useEffect(() => {
    if (syncWithDeepAnalysis && initialLyrics !== lyrics) {
      setLyrics(initialLyrics);
      setCurrentAnalysis(analysis);
    }
  }, [initialLyrics, analysis, syncWithDeepAnalysis, lyrics]);

  // Debounced re-analysis
  const scheduleReanalysis = useCallback((newLyrics: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (onReanalyze && newLyrics !== initialLyrics) {
        setIsReanalyzing(true);
        try {
          const newAnalysis = await onReanalyze(newLyrics);
          setCurrentAnalysis(newAnalysis);
        } catch (error) {
          console.error('Re-analysis failed:', error);
        } finally {
          setIsReanalyzing(false);
        }
      }
    }, 2000); // 2 second idle debounce
  }, [onReanalyze, initialLyrics]);

  // Handle line edit start
  const startEditingLine = (lineNumber: number, lineText: string) => {
    setEditingLine(lineNumber);
    setEditValue(lineText);
  };

  // Handle line edit save
  const saveLineEdit = () => {
    if (editingLine === null) return;

    const lines = lyrics.split('\n');
    const newLines = [...lines];
    newLines[editingLine - 1] = editValue;
    const newLyrics = newLines.join('\n');

    // Add to undo stack
    setUndoStack(prev => [...prev, {
      lyrics: newLyrics,
      timestamp: Date.now(),
      description: `Edited line ${editingLine}`
    }]);
    setRedoStack([]); // Clear redo stack on new edit

    setLyrics(newLyrics);
    setEditingLine(null);
    
    onLyricsChange?.(newLyrics);
    scheduleReanalysis(newLyrics);
  };

  // Handle line edit cancel
  const cancelLineEdit = () => {
    setEditingLine(null);
    setEditValue('');
  };

  // Undo
  const undo = () => {
    if (undoStack.length <= 1) return; // Can't undo initial state
    
    const current = undoStack[undoStack.length - 1];
    const previous = undoStack[undoStack.length - 2];
    
    setRedoStack(prev => [...prev, current]);
    setUndoStack(prev => prev.slice(0, -1));
    setLyrics(previous.lyrics);
    
    onLyricsChange?.(previous.lyrics);
    scheduleReanalysis(previous.lyrics);
  };

  // Redo
  const redo = () => {
    if (redoStack.length === 0) return;
    
    const next = redoStack[redoStack.length - 1];
    
    setUndoStack(prev => [...prev, next]);
    setRedoStack(prev => prev.slice(0, -1));
    setLyrics(next.lyrics);
    
    onLyricsChange?.(next.lyrics);
    scheduleReanalysis(next.lyrics);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      } else if (e.key === 'Escape' && editingLine !== null) {
        e.preventDefault();
        cancelLineEdit();
      } else if (e.key === 'Enter' && editingLine !== null && !e.shiftKey) {
        e.preventDefault();
        saveLineEdit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingLine, undoStack, redoStack, editValue]);

  // Color helper
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

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-black/30 border-b border-white/10 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white">Editable Lyrics</h3>
          {isReanalyzing && (
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              Re-analyzing...
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <button
            onClick={undo}
            disabled={undoStack.length <= 1}
            className={`text-xs px-3 py-1 rounded transition ${
              undoStack.length <= 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
            }`}
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className={`text-xs px-3 py-1 rounded transition ${
              redoStack.length === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
            }`}
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>

          {/* History indicator */}
          <div className="text-xs text-gray-500">
            {undoStack.length - 1} edit{undoStack.length - 1 !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-black/20 border-b border-white/10 p-2 flex gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500/40"></span>
          {highlightStats.criticalLines} Critical
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-yellow-500/40"></span>
          {highlightStats.warningLines} Warnings
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500/40"></span>
          {highlightStats.strengthLines} Strong
        </div>
        <div className="ml-auto text-blue-400">
          💡 Click any line to edit
        </div>
      </div>

      {/* Editor Area */}
      <div 
        ref={editorRef}
        className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-1"
      >
        {lineCritiques.map(critique => {
          const isEditing = editingLine === critique.lineNumber;

          return (
            <div
              key={critique.lineNumber}
              className={`
                flex items-center gap-3 p-2 rounded-lg border transition-all
                ${getHighlightClass(critique.color)}
                ${isEditing ? 'ring-2 ring-blue-500 shadow-lg' : 'border-white/10'}
              `}
            >
              {/* Line Number & Indicator */}
              <div className="flex-shrink-0 w-12 text-right">
                <div className="text-gray-500 text-xs">{critique.lineNumber}</div>
                <div className="text-lg">{getColorIndicator(critique.color)}</div>
              </div>

              {/* Line Content */}
              <div className="flex-grow">
                {isEditing ? (
                  // Edit mode
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full bg-black/50 text-white px-3 py-2 rounded border border-blue-500/50 focus:outline-none focus:border-blue-500"
                      autoFocus
                      placeholder="Enter line text..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveLineEdit}
                        className="text-xs bg-green-500/20 text-green-300 hover:bg-green-500/30 px-3 py-1 rounded transition"
                      >
                        ✓ Save (Enter)
                      </button>
                      <button
                        onClick={cancelLineEdit}
                        className="text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30 px-3 py-1 rounded transition"
                      >
                        ✕ Cancel (Esc)
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div
                    onClick={() => startEditingLine(critique.lineNumber, critique.lineText)}
                    className="cursor-pointer group"
                  >
                    <div className="text-white font-mono text-sm leading-relaxed group-hover:text-blue-300 transition">
                      {critique.lineText || '(empty line)'}
                    </div>
                    <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition mt-1">
                      Click to edit • {critique.highlights.length} suggestion{critique.highlights.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>

              {/* Issue Badge */}
              {critique.highlights.length > 0 && !isEditing && (
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

      {/* Footer Help */}
      <div className="bg-black/20 border-t border-white/10 p-2 text-xs text-gray-500 flex items-center justify-between">
        <div>
          Keyboard: <kbd className="bg-black/40 px-1.5 py-0.5 rounded">Ctrl+Z</kbd> Undo • 
          <kbd className="bg-black/40 px-1.5 py-0.5 rounded ml-1">Ctrl+Y</kbd> Redo • 
          <kbd className="bg-black/40 px-1.5 py-0.5 rounded ml-1">Esc</kbd> Cancel
        </div>
        <div className="text-blue-400">
          Auto-reanalysis after 2s idle
        </div>
      </div>
    </div>
  );
};
