
import React, { useState } from 'react';
import { evaluateLineChange } from '../services/geminiService';
import { EvaluationResult } from '../types';

interface SmartLineEditorProps {
  originalLine: string;
  songContext: string;
  onSave: (newLine: string) => void;
  onCancel: () => void;
}

export const SmartLineEditor: React.FC<SmartLineEditorProps> = ({
  originalLine,
  songContext,
  onSave,
  onCancel
}) => {
  const [newLine, setNewLine] = useState(originalLine);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const handleEvaluate = async () => {
    if (newLine === originalLine) return;
    setIsEvaluating(true);
    try {
      const result = await evaluateLineChange(originalLine, newLine, songContext);
      setEvaluation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSave = () => {
    onSave(newLine);
  };

  return (
    <div className="bg-suno-card border border-suno-primary/50 rounded-lg p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="text-suno-accent">✨</span> Smart Line Editor
        </h4>
        <button onClick={onCancel} className="text-gray-500 hover:text-white text-xs">Cancel</button>
      </div>

      <div className="mb-3">
        <label className="block text-[10px] text-gray-500 uppercase mb-1">Original</label>
        <div className="text-sm text-gray-400 line-through bg-black/20 p-2 rounded border border-white/5">
          {originalLine}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[10px] text-gray-500 uppercase mb-1">Your Edit</label>
        <input
          type="text"
          value={newLine}
          onChange={(e) => { setNewLine(e.target.value); setEvaluation(null); }}
          className="w-full bg-black/50 border border-suno-primary/50 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-suno-primary"
          autoFocus
        />
      </div>

      {evaluation && (
        <div className={`mb-4 p-3 rounded border ${
          evaluation.verdict === 'Better' ? 'bg-green-500/10 border-green-500/30' :
          evaluation.verdict === 'Worse' ? 'bg-red-500/10 border-red-500/30' :
          'bg-yellow-500/10 border-yellow-500/30'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              evaluation.verdict === 'Better' ? 'bg-green-500 text-black' :
              evaluation.verdict === 'Worse' ? 'bg-red-500 text-white' :
              'bg-yellow-500 text-black'
            }`}>
              {evaluation.verdict}
            </span>
            <span className="text-xs text-gray-300">
              Score Impact: {evaluation.scoreChange > 0 ? '+' : ''}{evaluation.scoreChange}
            </span>
          </div>
          <p className="text-xs text-gray-300">{evaluation.explanation}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleEvaluate}
          disabled={isEvaluating || newLine === originalLine}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded transition disabled:opacity-50"
        >
          {isEvaluating ? 'Checking...' : 'Check with AI'}
        </button>
        <button
          onClick={handleSave}
          className="flex-1 bg-suno-primary hover:bg-suno-secondary text-white text-xs font-bold py-2 rounded transition"
        >
          Apply Change
        </button>
      </div>
    </div>
  );
};
