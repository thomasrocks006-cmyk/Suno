/**
 * WAR ROOM COMPONENT (v5 Architecture)
 * 
 * The user approval interface for the execution plan.
 * 
 * Features:
 * - Display each proposed change
 * - Approve/Veto individual changes
 * - Rhyme dependency warnings
 * - Manual instruction input
 * - Execute button (explicit user action)
 * 
 * @see BOARD_DIRECTIVE_v5_FINAL.md for architecture
 */

import React, { useState, useCallback, useMemo } from 'react';
import { DeepAnalysisReport, LineImprovement } from '../services/analystAgent';
import { JudgeSummary, JudgeDecision } from '../services/judgeAgent';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface ExecutionPlanChange {
  id: string;
  priority: number;
  type: 'mandate' | 'improvement' | 'manual';
  source: string; // "Judge Mandate" or "Analyst Suggestion" or "User"
  
  // The change itself
  affectedLines: number[];
  original: string;
  proposed: string;
  rationale: string;
  
  // Dependencies
  dependencyGroup?: number[]; // Lines that must change together (rhyme)
  
  // Impact
  expectedImpact: string;
  category?: string;
  
  // User decision
  status: 'pending' | 'approved' | 'vetoed' | 'modified';
  userModification?: string;
}

export interface ExecutionPlan {
  songTitle: string;
  currentScore: number;
  targetScore: number;
  changes: ExecutionPlanChange[];
  manualInstructions: string[];
}

interface WarRoomProps {
  plan: ExecutionPlan;
  rhymePairs: Array<[number, number]>;
  onApprove: (changeId: string) => void;
  onVeto: (changeId: string) => void;
  onModify: (changeId: string, newText: string) => void;
  onAddManualInstruction: (instruction: string) => void;
  onExecute: (approvedChanges: ExecutionPlanChange[]) => void;
  onReconsider: (changeId: string) => void;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export const WarRoom: React.FC<WarRoomProps> = ({
  plan,
  rhymePairs,
  onApprove,
  onVeto,
  onModify,
  onAddManualInstruction,
  onExecute,
  onReconsider
}) => {
  const [manualInput, setManualInput] = useState('');
  const [expandedChange, setExpandedChange] = useState<string | null>(null);
  const [editingChange, setEditingChange] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  
  // Calculate stats
  const stats = useMemo(() => {
    const approved = plan.changes.filter(c => c.status === 'approved').length;
    const vetoed = plan.changes.filter(c => c.status === 'vetoed').length;
    const pending = plan.changes.filter(c => c.status === 'pending').length;
    const total = plan.changes.length;
    return { approved, vetoed, pending, total };
  }, [plan.changes]);
  
  // Get rhyme warning for a change
  const getRhymeWarning = useCallback((change: ExecutionPlanChange): string | null => {
    for (const line of change.affectedLines) {
      const pair = rhymePairs.find(([a, b]) => a === line || b === line);
      if (pair) {
        const otherLine = pair[0] === line ? pair[1] : pair[0];
        if (!change.affectedLines.includes(otherLine)) {
          return `⚠️ Line ${line} rhymes with line ${otherLine}. Changing one may break the rhyme.`;
        }
      }
    }
    return null;
  }, [rhymePairs]);
  
  // Handle approve all
  const handleApproveAll = useCallback(() => {
    plan.changes
      .filter(c => c.status === 'pending')
      .forEach(c => onApprove(c.id));
  }, [plan.changes, onApprove]);
  
  // Handle execute
  const handleExecute = useCallback(() => {
    const approvedChanges = plan.changes.filter(c => 
      c.status === 'approved' || c.status === 'modified'
    );
    onExecute(approvedChanges);
  }, [plan.changes, onExecute]);
  
  // Handle add manual instruction
  const handleAddInstruction = useCallback(() => {
    if (manualInput.trim()) {
      onAddManualInstruction(manualInput.trim());
      setManualInput('');
    }
  }, [manualInput, onAddManualInstruction]);
  
  // Start editing
  const handleStartEdit = useCallback((change: ExecutionPlanChange) => {
    setEditingChange(change.id);
    setEditText(change.proposed);
  }, []);
  
  // Save edit
  const handleSaveEdit = useCallback((changeId: string) => {
    onModify(changeId, editText);
    setEditingChange(null);
    setEditText('');
  }, [editText, onModify]);
  
  return (
    <div className="war-room bg-suno-surface rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🎖️ War Room
          </h2>
          <p className="text-suno-text-secondary mt-1">
            Review and approve the execution plan before rewriting
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-suno-primary">
            {plan.currentScore} → {plan.targetScore}
          </div>
          <div className="text-sm text-suno-text-secondary">
            Projected Score Improvement
          </div>
        </div>
      </div>
      
      {/* Stats Bar */}
      <div className="flex gap-4 p-4 bg-black/20 rounded-lg">
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
          <div className="text-xs text-suno-text-secondary">Approved</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.vetoed}</div>
          <div className="text-xs text-suno-text-secondary">Vetoed</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
          <div className="text-xs text-suno-text-secondary">Pending</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-suno-text-secondary">Total</div>
        </div>
      </div>
      
      {/* Changes List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Proposed Changes</h3>
          <button
            onClick={handleApproveAll}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm transition-colors"
          >
            ✅ Approve All Pending
          </button>
        </div>
        
        {plan.changes.map((change, index) => {
          const rhymeWarning = getRhymeWarning(change);
          const isExpanded = expandedChange === change.id;
          const isEditing = editingChange === change.id;
          
          return (
            <div
              key={change.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                change.status === 'approved' ? 'bg-green-900/20 border-green-500/50' :
                change.status === 'vetoed' ? 'bg-red-900/20 border-red-500/50' :
                change.status === 'modified' ? 'bg-blue-900/20 border-blue-500/50' :
                'bg-black/20 border-white/10'
              }`}
            >
              {/* Change Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      change.priority === 1 ? 'bg-red-500 text-white' :
                      change.priority === 2 ? 'bg-orange-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      P{change.priority}
                    </span>
                    <span className="text-sm text-suno-text-secondary">
                      {change.source}
                    </span>
                    {change.category && (
                      <span className="text-xs px-2 py-0.5 bg-suno-primary/20 text-suno-primary rounded">
                        {change.category}
                      </span>
                    )}
                  </div>
                  
                  <p className="mt-2 text-white font-medium">
                    Lines {change.affectedLines.join(', ')}
                  </p>
                  
                  <p className="mt-1 text-sm text-suno-text-secondary">
                    {change.rationale}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {change.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => onApprove(change.id)}
                        className="p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                        title="Approve"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => onVeto(change.id)}
                        className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                        title="Veto"
                      >
                        ❌
                      </button>
                      <button
                        onClick={() => handleStartEdit(change)}
                        className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      change.status === 'approved' ? 'bg-green-500 text-white' :
                      change.status === 'vetoed' ? 'bg-red-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {change.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Rhyme Warning */}
              {rhymeWarning && (
                <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-500/50 rounded text-sm text-yellow-200">
                  {rhymeWarning}
                </div>
              )}
              
              {/* Change Details (Expandable) */}
              <div className="mt-3">
                <button
                  onClick={() => setExpandedChange(isExpanded ? null : change.id)}
                  className="text-sm text-suno-primary hover:underline"
                >
                  {isExpanded ? '▼ Hide Details' : '▶ Show Details'}
                </button>
                
                {isExpanded && (
                  <div className="mt-3 space-y-3">
                    <div className="p-3 bg-red-900/20 rounded">
                      <div className="text-xs text-red-400 mb-1">Original:</div>
                      <div className="text-white font-mono text-sm">{change.original}</div>
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-3 bg-black/50 border border-blue-500 rounded text-white font-mono text-sm"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(change.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingChange(null)}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-green-900/20 rounded">
                        <div className="text-xs text-green-400 mb-1">Proposed:</div>
                        <div className="text-white font-mono text-sm">
                          {change.userModification || change.proposed}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-sm text-suno-text-secondary">
                      <strong>Expected Impact:</strong> {change.expectedImpact}
                    </div>
                    
                    {change.dependencyGroup && change.dependencyGroup.length > 0 && (
                      <div className="text-sm text-yellow-400">
                        ⚠️ Rhyme group: Lines {change.dependencyGroup.join(', ')} must change together
                      </div>
                    )}
                    
                    <button
                      onClick={() => onReconsider(change.id)}
                      className="text-sm text-suno-primary hover:underline"
                    >
                      🔄 Ask Planner to Reconsider
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Manual Instructions */}
      <div className="p-4 bg-black/20 rounded-lg space-y-3">
        <h3 className="text-lg font-semibold text-white">📝 Add Manual Instruction</h3>
        <p className="text-sm text-suno-text-secondary">
          Add your own instructions for the rewrite agent
        </p>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="e.g., 'Make the bridge more uplifting'"
            className="flex-1 px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500"
          />
          <button
            onClick={handleAddInstruction}
            disabled={!manualInput.trim()}
            className="px-4 py-2 bg-suno-primary hover:bg-suno-primary/80 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
        
        {plan.manualInstructions.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-suno-text-secondary">Your instructions:</div>
            {plan.manualInstructions.map((inst, i) => (
              <div key={i} className="p-2 bg-suno-primary/10 border border-suno-primary/30 rounded text-sm text-white">
                {inst}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Execute Button */}
      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <div className="text-sm text-suno-text-secondary">
          {stats.approved + (plan.changes.filter(c => c.status === 'modified').length)} changes will be applied
        </div>
        
        <button
          onClick={handleExecute}
          disabled={stats.approved === 0 && plan.changes.filter(c => c.status === 'modified').length === 0}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg text-lg shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          ▶️ EXECUTE APPROVED CHANGES
        </button>
      </div>
    </div>
  );
};

// ============================================================
// HELPER: Create Execution Plan from Analysis
// ============================================================

export function createExecutionPlanFromAnalysis(
  deepAnalysis: DeepAnalysisReport,
  judgeSummary: JudgeSummary,
  songTitle: string
): ExecutionPlan {
  const changes: ExecutionPlanChange[] = [];
  let priority = 1;
  
  // Add Judge mandates as high priority
  for (const decision of judgeSummary.decisions) {
    for (const mandate of decision.mandates) {
      changes.push({
        id: `judge-${priority}`,
        priority,
        type: 'mandate',
        source: `Judge Mandate: ${decision.topic}`,
        affectedLines: [], // Would need to be determined from mandate text
        original: '',
        proposed: mandate,
        rationale: decision.rationale,
        expectedImpact: `Confidence: ${decision.confidence}`,
        status: 'pending'
      });
      priority++;
    }
  }
  
  // Add Analyst line improvements
  for (const improvement of deepAnalysis.lineByLineImprovements) {
    changes.push({
      id: `analyst-${improvement.lineNumber}`,
      priority: improvement.priority === 'high' ? priority : priority + 10,
      type: 'improvement',
      source: `Analyst (${improvement.category})`,
      affectedLines: [improvement.lineNumber],
      original: improvement.original,
      proposed: improvement.suggestion,
      rationale: improvement.rationale,
      expectedImpact: `Improves ${improvement.category}`,
      category: improvement.category,
      status: 'pending'
    });
    priority++;
  }
  
  // Sort by priority
  changes.sort((a, b) => a.priority - b.priority);
  
  return {
    songTitle,
    currentScore: deepAnalysis.overallScore,
    targetScore: deepAnalysis.projectedScore,
    changes,
    manualInstructions: []
  };
}

// ============================================================
// EXPORTS
// ============================================================

export default WarRoom;
