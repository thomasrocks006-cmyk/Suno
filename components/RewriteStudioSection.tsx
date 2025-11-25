import React from 'react';
import { GeneratedSong, RewritePlanProposal } from '../types';
import { LiveRewritePlan } from './LiveRewritePlan';

interface RewriteStudioSectionProps {
  song: GeneratedSong;
  parentSong?: GeneratedSong;
  proposedPlan: RewritePlanProposal | null;
  isGeneratingPlan: boolean;
  useAdvancedLogic: boolean;
  useMetaphorLogic: boolean;
  useCommercialMode: boolean;
  useAgentDebate: boolean;
  onToggleAdvancedLogic: () => void;
  onToggleMetaphorLogic: () => void;
  onToggleCommercialMode: () => void;
  onToggleAgentDebate: () => void;
  onGeneratePlan: () => void;
  onApprovePlan: () => void;
  onRejectPlan: () => void;
  onTextHighlight: (text: string) => void;
}

/**
 * Rewrite Studio Section
 * Displays the rewrite plan, execution history, and rewrite controls
 */
export const RewriteStudioSection: React.FC<RewriteStudioSectionProps> = ({
  song,
  parentSong,
  proposedPlan,
  isGeneratingPlan,
  useAdvancedLogic,
  useMetaphorLogic,
  useCommercialMode,
  useAgentDebate,
  onToggleAdvancedLogic,
  onToggleMetaphorLogic,
  onToggleCommercialMode,
  onToggleAgentDebate,
  onGeneratePlan,
  onApprovePlan,
  onRejectPlan,
  onTextHighlight
}) => {
  if (!song.analysis) return null;

  return (
    <div className="space-y-4">
      {/* LIVE REWRITE PLAN - Always visible, auto-updates */}
      <LiveRewritePlan
        plan={proposedPlan}
        song={song}
        parentSong={parentSong}
        isGenerating={isGeneratingPlan}
        onApprove={onApprovePlan}
        onReject={onRejectPlan}
        onSectionClick={(section) => {
          onTextHighlight(`${section} section`);
        }}
      />

      {/* Enhanced Rewrite Studio */}
      <div className="pt-4 md:pt-6 border-t border-white/10">
        {/* Show Execution Plan if it exists (from last rewrite) */}
        {song.executionPlan && (
          <ExecutedPlanDisplay 
            song={song} 
            parentSong={parentSong} 
          />
        )}

        <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/10">
          <h3 className="text-xs md:text-sm font-bold text-white mb-2 md:mb-3 flex items-center gap-2">
            <span className="text-suno-primary">{'⚡'}</span> Create Rewrite Plan
          </h3>
          
          {/* AI Advice */}
          {song.analysis.rewriteAdvice && (
            <div className="mb-3 md:mb-4 bg-black/30 p-2 md:p-3 rounded text-[10px] md:text-xs text-gray-300 border-l-2 border-suno-accent">
              <strong className="text-suno-accent block mb-1">AI Recommendation:</strong>
              {song.analysis.rewriteAdvice.reasoning}
            </div>
          )}

          {/* Feature Toggles */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-3 md:mb-4">
            <label className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-300 cursor-pointer">
              <input 
                type="checkbox" 
                checked={useAdvancedLogic} 
                onChange={onToggleAdvancedLogic}
                className="rounded bg-black/50 border-gray-600 text-suno-primary focus:ring-0"
              />
              Advanced Lyric Logic
            </label>
            <label className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-300 cursor-pointer">
              <input 
                type="checkbox" 
                checked={useMetaphorLogic} 
                onChange={onToggleMetaphorLogic}
                className="rounded bg-black/50 border-gray-600 text-suno-accent focus:ring-0"
              />
              Central Metaphor Logic
            </label>
            <label className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-300 cursor-pointer">
              <input 
                type="checkbox" 
                checked={useCommercialMode} 
                onChange={onToggleCommercialMode}
                className="rounded bg-black/50 border-gray-600 text-green-500 focus:ring-0"
              />
              Commercial Mode
            </label>
            <label 
              className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-purple-300 cursor-pointer"
              title="Enable dual-agent debate: Songwriter vs Producer"
            >
              <input 
                type="checkbox" 
                checked={useAgentDebate} 
                onChange={onToggleAgentDebate}
                className="rounded bg-black/50 border-gray-600 text-purple-500 focus:ring-0"
              />
              {'🎭'} Agent Debate
            </label>
          </div>

          {/* PROPOSED PLAN DISPLAY */}
          {proposedPlan ? (
            <ProposedPlanDisplay 
              proposedPlan={proposedPlan}
              song={song}
              isGeneratingPlan={isGeneratingPlan}
              onApprovePlan={onApprovePlan}
              onRejectPlan={onRejectPlan}
            />
          ) : (
            <button 
              onClick={onGeneratePlan}
              disabled={isGeneratingPlan || !song.analysis}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-bold py-2 md:py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 text-sm md:text-base"
            >
              {isGeneratingPlan ? (
                <>
                  <span className="animate-spin">{'⏳'}</span> Generating Comprehensive Plan...
                </>
              ) : (
                <>
                  <span>{'📋'}</span> Generate Rewrite Plan for Review
                </>
              )}
            </button>
          )}

          <p className="text-[10px] text-gray-500 mt-2 text-center">
            The plan will integrate all analysis data (scores, sonic issues, DNA match insights, chat discussion) for your review before execution.
          </p>
        </div>
      </div>
    </div>
  );
};

// Sub-component: Executed Plan Display
const ExecutedPlanDisplay: React.FC<{ song: GeneratedSong; parentSong?: GeneratedSong }> = ({ song, parentSong }) => {
  if (!song.executionPlan || !song.analysis) return null;

  const sourceColors: Record<string, string> = {
    'LineByLine': 'bg-blue-500/20 text-blue-300',
    'Phonetic': 'bg-purple-500/20 text-purple-300',
    'DNAMatch': 'bg-amber-500/20 text-amber-300',
    'ChatAgent': 'bg-indigo-500/20 text-indigo-300',
    'Density': 'bg-pink-500/20 text-pink-300'
  };

  return (
    <div className="mb-6 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-xl p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{'📋'}</span>
        <h3 className="text-sm md:text-base font-bold text-emerald-300">Executed Rewrite Plan {song.parentId ? '(V2)' : ''}</h3>
        {song.parentId && (
          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Rewritten Song</span>
        )}
      </div>
      
      {/* Target Score vs Actual Achievement */}
      <div className="bg-black/30 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Target Score:</span>
          <span className="text-xl font-bold text-emerald-400">{song.executionPlan.targetScore}/100</span>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-gray-500">
            Actual Score Achieved: <span className="font-bold text-white">{song.analysis.overallScore}/100</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-500">Impact: </span>
            <span className={`font-bold ${
              song.analysis.overallScore >= song.executionPlan.targetScore 
                ? 'text-green-400' 
                : song.analysis.overallScore > (parentSong?.analysis?.overallScore || 0)
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}>
              {song.analysis.overallScore >= song.executionPlan.targetScore 
                ? '\u2713 Target Met!' 
                : song.analysis.overallScore > (parentSong?.analysis?.overallScore || 0)
                ? '\u26A0 Improved but below target'
                : '\u2717 Score decreased'}
            </span>
          </div>
          {parentSong?.analysis && (
            <div className="text-xs text-gray-500 pt-2 border-t border-white/5 mt-2">
              V1 Score: {parentSong.analysis.overallScore} {'→'} V2 Score: {song.analysis.overallScore}
              <span className={`ml-2 font-bold ${song.analysis.overallScore > parentSong.analysis.overallScore ? 'text-green-400' : 'text-red-400'}`}>
                ({song.analysis.overallScore > parentSong.analysis.overallScore ? '+' : ''}{song.analysis.overallScore - parentSong.analysis.overallScore})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Category Improvements with DNA Insights */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Category Improvements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {song.executionPlan.scoreImprovementsByCategory.map((cat, i) => {
            const actualScore = song.analysis?.scoreBreakdown.find(s => s.category === cat.category)?.score;
            const targetMet = actualScore && actualScore >= cat.targetScore;
            return (
              <div key={i} className="bg-black/40 p-2 rounded border border-white/5">
                <div className="text-xs font-bold text-white mb-1 flex items-center justify-between">
                  <span>{cat.category}</span>
                  {actualScore && (
                    <span className={`text-[10px] ${targetMet ? 'text-green-400' : 'text-yellow-400'}`}>
                      {targetMet ? '\u2713' : '\u26A0'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400">{cat.currentScore}/10</span>
                  <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                  <span className="text-xs font-bold text-green-400">{cat.targetScore}/10</span>
                  {actualScore && (
                    <>
                      <span className="text-xs text-gray-500">{'→'}</span>
                      <span className={`text-xs font-bold ${targetMet ? 'text-green-400' : 'text-yellow-400'}`}>
                        {actualScore}/10
                      </span>
                    </>
                  )}
                </div>
                <div className="text-[10px] text-gray-500 italic mb-1">{cat.strategy}</div>
                {cat.dnaInsightApplied && (
                  <div className="text-[9px] text-amber-400 bg-amber-900/20 px-2 py-1 rounded mt-1">
                    {'🧬'} {cat.dnaInsightApplied}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DNA Match Insights Actually Applied */}
      {song.executionPlan.dnaMatchInsights && (
        <div className="mb-4 bg-amber-900/20 border border-amber-500/30 p-3 rounded">
          <h4 className="text-xs font-bold text-amber-300 uppercase mb-2">{'🧬'} A-Tier Techniques Applied</h4>
          <div className="space-y-2 text-[10px] text-gray-300">
            {song.executionPlan.dnaMatchInsights.structural.length > 0 && (
              <div>
                <div className="font-bold text-amber-400">{'📐'} Structural ({song.executionPlan.dnaMatchInsights.structural.length})</div>
                <ul className="ml-3 space-y-1 mt-1">
                  {song.executionPlan.dnaMatchInsights.structural.map((item, i) => (
                    <li key={i}>{'•'} {item}</li>
                  ))}
                </ul>
              </div>
            )}
            {song.executionPlan.dnaMatchInsights.wordSpacing.length > 0 && (
              <div>
                <div className="font-bold text-amber-400">{'🎤'} Word Spacing ({song.executionPlan.dnaMatchInsights.wordSpacing.length})</div>
                <ul className="ml-3 space-y-1 mt-1">
                  {song.executionPlan.dnaMatchInsights.wordSpacing.map((item, i) => (
                    <li key={i}>{'•'} {item}</li>
                  ))}
                </ul>
              </div>
            )}
            {song.executionPlan.dnaMatchInsights.sonic.length > 0 && (
              <div>
                <div className="font-bold text-amber-400">{'🎧'} Sonic ({song.executionPlan.dnaMatchInsights.sonic.length})</div>
                <ul className="ml-3 space-y-1 mt-1">
                  {song.executionPlan.dnaMatchInsights.sonic.map((item, i) => (
                    <li key={i}>{'•'} {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Line Changes with Source Analysis */}
      {song.executionPlan.lineLevelChanges && song.executionPlan.lineLevelChanges.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Line Changes Executed ({song.executionPlan.lineLevelChanges.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {song.executionPlan.lineLevelChanges.map((change, i) => (
              <div key={i} className="bg-black/40 p-2 rounded border border-white/5 text-xs">
                <div className="flex justify-between items-start mb-1 flex-wrap gap-1">
                  <span className="text-gray-500">Line {change.lineNumber}</span>
                  <div className="flex gap-1">
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">{change.categoryImproved}</span>
                    {change.sourceAnalysis && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${sourceColors[change.sourceAnalysis] || 'bg-gray-500/20 text-gray-300'}`}>
                        {change.sourceAnalysis}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-red-300/70 line-through mb-1">{change.originalLine}</div>
                <div className="text-green-400 mb-1">{change.newLine}</div>
                <div className="text-[10px] text-gray-500 italic">{change.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phonetic Fixes */}
      {song.executionPlan.phoneticFixes && song.executionPlan.phoneticFixes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Phonetic Fixes</h4>
          {song.executionPlan.phoneticFixes.map((fix, i) => (
            <div key={i} className="bg-black/40 p-2 rounded border border-white/5 text-xs mb-2">
              <div className="text-red-300 mb-1">{'\u26A0\uFE0F'} {fix.issue}</div>
              <div className="text-green-400">{'\u2713'} {fix.fix}</div>
            </div>
          ))}
        </div>
      )}

      {/* Furniture Additions */}
      {song.executionPlan.furnitureAdditions && song.executionPlan.furnitureAdditions.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Furniture/Objects Added</h4>
          <div className="flex flex-wrap gap-2">
            {song.executionPlan.furnitureAdditions.map((obj, i) => (
              <span key={i} className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">
                {obj}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Proposed Plan Display
const ProposedPlanDisplay: React.FC<{
  proposedPlan: RewritePlanProposal;
  song: GeneratedSong;
  isGeneratingPlan: boolean;
  onApprovePlan: () => void;
  onRejectPlan: () => void;
}> = ({ proposedPlan, song, isGeneratingPlan, onApprovePlan, onRejectPlan }) => {
  if (!song.analysis) return null;

  return (
    <div className="mb-4 border border-yellow-500/30 rounded-lg overflow-hidden">
      <div className="bg-yellow-900/20 px-3 py-2 border-b border-yellow-500/30">
        <h4 className="text-xs font-bold text-yellow-300">{'📋'} Comprehensive Rewrite Plan (Awaiting Approval)</h4>
      </div>
      <div className="p-3 bg-black/30 max-h-96 overflow-y-auto custom-scrollbar space-y-3">
        {/* Target Score */}
        <div className="bg-black/40 p-3 rounded">
          <div className="text-xs text-gray-400 mb-1">Target Score:</div>
          <div className="text-2xl font-bold text-yellow-400">{proposedPlan.executionPlan.targetScore}/100</div>
          <div className="text-[10px] text-gray-500 mt-1">
            Current: {song.analysis.overallScore} {'→'} Target: {proposedPlan.executionPlan.targetScore} 
            <span className="text-green-400 ml-2 font-bold">
              (+{proposedPlan.executionPlan.targetScore - song.analysis.overallScore})
            </span>
          </div>
        </div>

        {/* Rationale */}
        <div className="bg-black/40 p-3 rounded">
          <div className="text-xs font-bold text-blue-400 mb-2">Plan Rationale:</div>
          <p className="text-xs text-gray-300 leading-relaxed">{proposedPlan.rationale}</p>
        </div>

        {/* Expected Impact */}
        <div className="bg-black/40 p-3 rounded">
          <div className="text-xs font-bold text-green-400 mb-2">Expected Impact:</div>
          <p className="text-xs text-gray-300 leading-relaxed">{proposedPlan.expectedImpact}</p>
        </div>

        {/* Data Sources */}
        <div className="bg-black/40 p-3 rounded">
          <div className="text-xs font-bold text-purple-400 mb-2">Based On:</div>
          <div className="flex flex-wrap gap-2">
            {proposedPlan.basedOn.originalAnalysis && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Original Analysis</span>}
            {proposedPlan.basedOn.dnaMatchInsights && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-1 rounded">DNA Match Insights</span>}
            {proposedPlan.basedOn.chatDiscussion && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">Chat Discussion</span>}
          </div>
        </div>

        {/* Line Changes Count */}
        <div className="bg-black/40 p-3 rounded">
          <div className="text-xs text-gray-400">
            {'📝'} <span className="font-bold">{proposedPlan.executionPlan.lineLevelChanges.length}</span> line changes planned
            {proposedPlan.executionPlan.phoneticFixes && proposedPlan.executionPlan.phoneticFixes.length > 0 && (
              <> {'•'} {'🎤'} <span className="font-bold">{proposedPlan.executionPlan.phoneticFixes.length}</span> phonetic fixes</>
            )}
            {proposedPlan.executionPlan.furnitureAdditions && proposedPlan.executionPlan.furnitureAdditions.length > 0 && (
              <> {'•'} {'🪑'} <span className="font-bold">{proposedPlan.executionPlan.furnitureAdditions.length}</span> objects added</>
            )}
          </div>
        </div>

        {/* DNA Match Insights Applied */}
        {proposedPlan.executionPlan.dnaMatchInsights && (
          <div className="bg-amber-900/20 border border-amber-500/30 p-3 rounded">
            <div className="text-xs font-bold text-amber-300 mb-2">{'🧬'} A-Tier Techniques Applied:</div>
            <div className="space-y-1 text-[10px] text-gray-300">
              {proposedPlan.executionPlan.dnaMatchInsights.structural.length > 0 && (
                <div>{'📐'} Structural: {proposedPlan.executionPlan.dnaMatchInsights.structural.length} techniques</div>
              )}
              {proposedPlan.executionPlan.dnaMatchInsights.wordSpacing.length > 0 && (
                <div>{'🎤'} Word Spacing: {proposedPlan.executionPlan.dnaMatchInsights.wordSpacing.length} techniques</div>
              )}
              {proposedPlan.executionPlan.dnaMatchInsights.sonic.length > 0 && (
                <div>{'🎧'} Sonic: {proposedPlan.executionPlan.dnaMatchInsights.sonic.length} techniques</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Approval Buttons */}
      <div className="p-3 bg-black/20 border-t border-white/5 flex gap-2">
        <button 
          onClick={onApprovePlan}
          disabled={isGeneratingPlan}
          className="flex-grow bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isGeneratingPlan ? (
            <>Executing Plan...</>
          ) : (
            <>
              <span>{'\u2713'}</span> Approve & Execute
            </>
          )}
        </button>
        <button 
          onClick={onRejectPlan}
          disabled={isGeneratingPlan}
          className="px-4 bg-red-600/50 hover:bg-red-600 disabled:bg-gray-700 text-white font-bold py-2 rounded-lg transition"
        >
          {'\u2717'} Reject
        </button>
      </div>
    </div>
  );
};

export default RewriteStudioSection;
