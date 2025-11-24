import React, { useState, useEffect } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { RewritePlanProposal, GeneratedSong } from '../types';
import { analyzeAgentCoverage, AgentCoverageReport } from '../services/agentCoverageService';

interface LiveRewritePlanProps {
  plan: RewritePlanProposal | null;
  song: GeneratedSong;
  parentSong?: GeneratedSong;
  isGenerating: boolean;
  onApprove: () => void;
  onReject: () => void;
  onSectionClick: (section: string) => void;
}

export const LiveRewritePlan: React.FC<LiveRewritePlanProps> = ({
  plan,
  song,
  parentSong,
  isGenerating,
  onApprove,
  onReject,
  onSectionClick
}) => {
  const [disclosureLevel, setDisclosureLevel] = useState<'level1' | 'level2' | 'level3'>('level1');
  const [coverageReport, setCoverageReport] = useState<AgentCoverageReport | null>(null);

  // Calculate coverage report when plan changes
  useEffect(() => {
    if (plan && plan.agentDebates && plan.agentDebates.length > 0) {
      const report = analyzeAgentCoverage(plan);
      setCoverageReport(report);
    } else {
      setCoverageReport(null);
    }
  }, [plan]);

  if (isGenerating) {
    return (
      <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/40 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h3 className="text-sm font-bold text-blue-300">Agent is Building Comprehensive Plan...</h3>
            <p className="text-xs text-gray-400">Integrating all analysis data and chat insights</p>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="bg-gradient-to-br from-gray-900/30 to-black/30 border border-gray-700/40 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">📋</div>
        <h3 className="text-sm font-bold text-gray-300 mb-2">No Rewrite Plan Yet</h3>
        <p className="text-xs text-gray-500 mb-4">
          The agent will automatically generate a plan as you discuss the analysis.
        </p>
        <p className="text-xs text-indigo-400">
          💡 Start chatting with the agent about the song to build a comprehensive rewrite strategy
        </p>
      </div>
    );
  }

  // Get top 3 recommendations for Level 1
  const topRecommendations = plan.executionPlan.scoreImprovementsByCategory
    .sort((a, b) => (b.targetScore - b.currentScore) - (a.targetScore - a.currentScore))
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-2 border-blue-500/40 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 px-4 py-3 border-b border-blue-500/30">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="text-sm md:text-base font-bold text-blue-200">Live Rewrite Plan</h3>
              <p className="text-xs text-blue-300/70">
                {plan.status === 'proposed' ? 'Awaiting your approval' : 'Auto-updating with agent insights'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Level Toggle */}
            <div className="flex bg-black/30 rounded-lg p-1 gap-1">
              <button
                onClick={() => setDisclosureLevel('level1')}
                className={`text-xs px-2 py-1 rounded transition ${
                  disclosureLevel === 'level1' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Quick
              </button>
              <button
                onClick={() => setDisclosureLevel('level2')}
                className={`text-xs px-2 py-1 rounded transition ${
                  disclosureLevel === 'level2' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Full
              </button>
              <button
                onClick={() => setDisclosureLevel('level3')}
                className={`text-xs px-2 py-1 rounded transition ${
                  disclosureLevel === 'level3' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Debug
              </button>
            </div>
            {plan.basedOn.dnaMatchInsights && <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">🧬 A-Tier</span>}
            {plan.basedOn.chatDiscussion && <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">💬 Chat</span>}
            {plan.basedOn.originalAnalysis && <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">📊 Analysis</span>}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
        {/* Target Score - Always visible */}
        <div 
          className="bg-black/40 p-3 rounded-lg cursor-pointer hover:bg-black/50 transition"
          onClick={() => onSectionClick('targetScore')}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Target Score:</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-blue-400">{plan.executionPlan.targetScore}/100</span>
              <span className="text-xs text-gray-500">
                (+{plan.executionPlan.targetScore - (song.analysis?.overallScore || 0)})
              </span>
            </div>
          </div>
          {song.analysis && (
            <div className="text-xs text-gray-500 mt-2">
              Current: {song.analysis.overallScore} → Projected: {plan.executionPlan.targetScore}
            </div>
          )}
        </div>

        {/* LEVEL 1: Quick View - Top 3 Recommendations */}
        {disclosureLevel === 'level1' && (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-3">
              <h4 className="text-xs font-bold text-green-400 mb-3 flex items-center gap-2">
                <span>🎯</span> Top 3 Improvements
              </h4>
              <div className="space-y-2">
                {topRecommendations.map((rec, i) => (
                  <div key={i} className="bg-black/30 p-2 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{rec.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{rec.currentScore}/10</span>
                        <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                        <span className="text-xs font-bold text-green-400">{rec.targetScore}/10</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 italic">{rec.strategy}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/40 p-3 rounded-lg">
              <h4 className="text-xs font-bold text-blue-400 mb-2">📝 Summary</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{plan.rationale}</p>
            </div>

            <div className="text-center">
              <button
                onClick={() => setDisclosureLevel('level2')}
                className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1 mx-auto"
              >
                <span>▼</span> View All Changes ({plan.executionPlan.lineLevelChanges.length} lines)
              </button>
            </div>
          </div>
        )}

        {/* LEVEL 2: Full View - All Changes */}
        {disclosureLevel === 'level2' && (
          <Accordion.Root type="multiple" className="space-y-2">
            {/* Plan Rationale & Impact */}
            <Accordion.Item value="overview" className="bg-black/40 rounded-lg overflow-hidden">
              <Accordion.Trigger className="w-full px-3 py-2 flex items-center justify-between hover:bg-black/50 transition group">
                <h4 className="text-xs font-bold text-blue-400">📋 Plan Overview</h4>
                <svg className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </Accordion.Trigger>
              <Accordion.Content className="px-3 pb-3 pt-2 space-y-2">
                <div>
                  <div className="text-xs font-semibold text-gray-400 mb-1">Rationale:</div>
                  <p className="text-xs text-gray-300 leading-relaxed">{plan.rationale}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 mb-1">Expected Impact:</div>
                  <p className="text-xs text-gray-300 leading-relaxed">{plan.expectedImpact}</p>
                </div>
              </Accordion.Content>
            </Accordion.Item>

            {/* Category Improvements */}
            <Accordion.Item value="categories" className="bg-black/40 rounded-lg overflow-hidden">
              <Accordion.Trigger className="w-full px-3 py-2 flex items-center justify-between hover:bg-black/50 transition group">
                <h4 className="text-xs font-bold text-purple-400">📊 All Category Improvements ({plan.executionPlan.scoreImprovementsByCategory.length})</h4>
                <svg className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </Accordion.Trigger>
              <Accordion.Content className="px-3 pb-3 pt-2 space-y-2">
                {plan.executionPlan.scoreImprovementsByCategory.map((cat, i) => (
                  <div key={i} className="bg-black/30 p-2 rounded border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{cat.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{cat.currentScore}/10</span>
                        <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                        <span className="text-xs font-bold text-green-400">{cat.targetScore}/10</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 italic">{cat.strategy}</p>
                    {cat.dnaInsightApplied && (
                      <div className="text-[9px] text-amber-400 bg-amber-900/20 px-2 py-1 rounded mt-1">
                        🧬 {cat.dnaInsightApplied}
                      </div>
                    )}
                  </div>
                ))}
              </Accordion.Content>
            </Accordion.Item>

            {/* Line Changes */}
            <Accordion.Item value="lines" className="bg-black/40 rounded-lg overflow-hidden">
              <Accordion.Trigger className="w-full px-3 py-2 flex items-center justify-between hover:bg-black/50 transition group">
                <h4 className="text-xs font-bold text-yellow-400">✏️ Line-by-Line Changes ({plan.executionPlan.lineLevelChanges.length})</h4>
                <svg className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </Accordion.Trigger>
              <Accordion.Content className="px-3 pb-3 pt-2 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                {plan.executionPlan.lineLevelChanges.map((change, i) => (
                  <div key={i} className="bg-black/30 p-2 rounded border border-white/5 text-xs">
                    <div className="flex justify-between items-start mb-1 flex-wrap gap-1">
                      <span className="text-gray-500">Line {change.lineNumber}</span>
                      <div className="flex gap-1 flex-wrap">
                        <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                          {change.categoryImproved}
                        </span>
                        {change.sourceAnalysis && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                            {change.sourceAnalysis}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-red-300/70 line-through mb-1 text-[10px]">{change.originalLine}</div>
                    <div className="text-green-400 mb-1 text-[10px]">{change.newLine}</div>
                    <div className="text-[9px] text-gray-500 italic">{change.reason}</div>
                  </div>
                ))}
              </Accordion.Content>
            </Accordion.Item>

            {/* DNA Match Insights */}
            {plan.executionPlan.dnaMatchInsights && (
              <Accordion.Item value="dna" className="bg-amber-900/20 border border-amber-500/30 rounded-lg overflow-hidden">
                <Accordion.Trigger className="w-full px-3 py-2 flex items-center justify-between hover:bg-amber-900/30 transition group">
                  <h4 className="text-xs font-bold text-amber-300">🧬 A-Tier Techniques Applied</h4>
                  <svg className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </Accordion.Trigger>
                <Accordion.Content className="px-3 pb-3 pt-2 space-y-2 text-[10px] text-gray-300">
                  {plan.executionPlan.dnaMatchInsights.structural.length > 0 && (
                    <div>
                      <div className="font-bold text-amber-400 mb-1">📐 Structural</div>
                      <ul className="ml-3 space-y-1">
                        {plan.executionPlan.dnaMatchInsights.structural.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {plan.executionPlan.dnaMatchInsights.wordSpacing.length > 0 && (
                    <div>
                      <div className="font-bold text-amber-400 mb-1">🎤 Word Spacing</div>
                      <ul className="ml-3 space-y-1">
                        {plan.executionPlan.dnaMatchInsights.wordSpacing.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Accordion.Content>
              </Accordion.Item>
            )}

            {/* Chat Insights */}
            {plan.executionPlan.chatAgentNotes && plan.executionPlan.chatAgentNotes.length > 0 && (
              <Accordion.Item value="chat" className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg overflow-hidden">
                <Accordion.Trigger className="w-full px-3 py-2 flex items-center justify-between hover:bg-indigo-900/30 transition group">
                  <h4 className="text-xs font-bold text-indigo-300">💬 Chat Insights</h4>
                  <svg className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </Accordion.Trigger>
                <Accordion.Content className="px-3 pb-3 pt-2">
                  <ul className="space-y-1 text-[10px] text-gray-300">
                    {plan.executionPlan.chatAgentNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-400 shrink-0">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </Accordion.Content>
              </Accordion.Item>
            )}

            <div className="text-center pt-2">
              <button
                onClick={() => setDisclosureLevel('level3')}
                className="text-xs text-purple-400 hover:text-purple-300 transition flex items-center gap-1 mx-auto"
              >
                <span>▼</span> View Debug Info (Agent Debates, Coverage)
              </button>
            </div>
          </Accordion.Root>
        )}

        {/* LEVEL 3: Debug View - Agent Debates & Coverage */}
        {disclosureLevel === 'level3' && (
          <Accordion.Root type="multiple" defaultValue={['debates', 'coverage']} className="space-y-2">
            {/* Debug Header */}
            <div className="text-xs text-purple-400 font-bold mb-2 flex items-center gap-2">
              <span>🔧</span> Debug Mode - Full Technical Details
            </div>

            {/* Workflow Validation */}
            {plan.workflowValidation && (
              <Accordion.Item value="validation" className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-lg overflow-hidden">
                <Accordion.Trigger className="w-full px-3 py-2 flex items-center justify-between hover:bg-purple-900/30 transition group">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-300">⚙️ Workflow Validation</span>
                    <span className="text-xs text-purple-400">
                      {Math.round(plan.workflowValidation.coherenceScore)}% Coherence
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </Accordion.Trigger>
                <Accordion.Content className="px-3 pb-3 pt-2">
                  <div className="flex gap-4 text-xs mb-2 text-gray-400">
                    Conflicts: <span className={plan.workflowValidation.totalConflicts > 0 ? 'text-yellow-400' : 'text-green-400'}>
                      {plan.workflowValidation.conflictsResolved}/{plan.workflowValidation.totalConflicts} Resolved
                    </span>
                  </div>
                  {plan.workflowValidation.warnings.length > 0 && (
                    <div className="mt-2 space-y-1 text-xs text-yellow-300/80 bg-black/40 p-2 rounded">
                      {plan.workflowValidation.warnings.map((warning, i) => (
                        <div key={i}>• {warning}</div>
                      ))}
                    </div>
                  )}
                </Accordion.Content>
              </Accordion.Item>
            )}

            {/* Agent Debates */}
            {plan.agentDebates && plan.agentDebates.length > 0 && (
              <Accordion.Item value="debates" className="bg-purple-900/20 border border-purple-500/30 rounded-lg overflow-hidden">
                <Accordion.Trigger className="w-full px-3 py-2 flex items-center justify-between hover:bg-purple-900/30 transition group">
                  <h4 className="text-xs font-bold text-purple-300">🎭 Agent Debates ({plan.agentDebates.length})</h4>
                  <svg className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </Accordion.Trigger>
                <Accordion.Content className="px-3 pb-3 pt-2 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                  {plan.agentDebates.map((debate, i) => {
                    const change = plan.executionPlan.lineLevelChanges.find(c => c.lineNumber === debate.lineNumber);
                    return (
                      <div key={i} className="bg-black/30 p-2 rounded border border-purple-500/20">
                        <div className="text-[10px] text-gray-400 mb-1">Line {debate.lineNumber}</div>
                        {change && (
                          <>
                            <div className="text-red-300/70 line-through mb-1 text-[9px]">{change.originalLine}</div>
                            <div className="text-green-400 mb-2 text-[9px]">{change.newLine}</div>
                          </>
                        )}
                        <div className="space-y-1 text-[9px]">
                          <div className="flex gap-2">
                            <span className="text-blue-300 font-semibold">✍️ Songwriter:</span>
                            <span className="text-gray-400">{debate.songwriterPosition}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-green-300 font-semibold">🎛️ Producer:</span>
                            <span className="text-gray-400">{debate.producerPosition}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-purple-300 font-semibold">⚖️ Decision:</span>
                            <span className="text-white font-bold">{debate.finalDecision}</span>
                          </div>
                          <div className="text-gray-500 italic mt-1">{debate.rationale}</div>
                        </div>
                      </div>
                    );
                  })}
                </Accordion.Content>
              </Accordion.Item>
            )}

            {/* Agent Coverage Report */}
            {coverageReport && (
              <Accordion.Item value="coverage" className="bg-purple-900/20 border border-purple-500/30 rounded-lg overflow-hidden">
                <Accordion.Trigger className="w-full px-3 py-2 flex items-center justify-between hover:bg-purple-900/30 transition group">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-purple-300">📊 Agent Coverage Report</h4>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      coverageReport.coveragePercentage >= 80 ? 'bg-green-500/20 text-green-300' :
                      coverageReport.coveragePercentage >= 50 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {coverageReport.coveragePercentage}% Coverage
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </Accordion.Trigger>
                <Accordion.Content className="px-3 pb-3 pt-2 space-y-3 text-xs">
                  {/* Coverage Stats */}
                  <div className="bg-black/30 p-2 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Lines Reviewed:</span>
                      <span className="text-white font-bold">{coverageReport.linesAnalyzed} / {coverageReport.totalLines}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          coverageReport.coveragePercentage >= 80 ? 'bg-green-500' :
                          coverageReport.coveragePercentage >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${coverageReport.coveragePercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Agent Participation */}
                  <div className="bg-black/30 p-2 rounded">
                    <div className="text-[10px] font-bold text-purple-300 mb-2">Agent Participation</div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-blue-300 text-[10px]">✍️ Songwriter</span>
                          <span className="text-gray-400 text-[10px]">
                            {coverageReport.agentParticipation.songwriter.linesReviewed} lines ({coverageReport.agentParticipation.songwriter.percentage}%)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-gray-500">
                          <span>Strong Opinions: {coverageReport.agentParticipation.songwriter.strongOpinions}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-green-300 text-[10px]">🎛️ Producer</span>
                          <span className="text-gray-400 text-[10px]">
                            {coverageReport.agentParticipation.producer.linesReviewed} lines ({coverageReport.agentParticipation.producer.percentage}%)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-gray-500">
                          <span>Strong Opinions: {coverageReport.agentParticipation.producer.strongOpinions}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Debate Hotspots */}
                  {coverageReport.debateHotspots.length > 0 && (
                    <div className="bg-black/30 p-2 rounded">
                      <div className="text-[10px] font-bold text-orange-300 mb-2">
                        🔥 Debate Hotspots ({coverageReport.debateHotspots.length})
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {coverageReport.debateHotspots.map((hotspot, i) => (
                          <div key={i} className="bg-orange-900/20 p-2 rounded border border-orange-500/20">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] text-gray-400">Line {hotspot.lineNumber}</span>
                              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                                hotspot.disagreementLevel === 'severe' ? 'bg-red-500/30 text-red-300' :
                                hotspot.disagreementLevel === 'moderate' ? 'bg-orange-500/30 text-orange-300' :
                                'bg-yellow-500/30 text-yellow-300'
                              }`}>
                                {hotspot.disagreementLevel}
                              </span>
                            </div>
                            <div className="text-[9px] text-gray-300 mb-1 line-through">{hotspot.originalLine}</div>
                            <div className="text-[9px] text-purple-300 font-semibold">→ {hotspot.finalDecision}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Uncovered Lines */}
                  {coverageReport.uncoveredLines.length > 0 && (
                    <div className="bg-black/30 p-2 rounded">
                      <div className="text-[10px] font-bold text-gray-300 mb-2">
                        🔍 Uncovered Lines ({coverageReport.uncoveredLines.length})
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {coverageReport.uncoveredLines.slice(0, 5).map((uncovered, i) => (
                          <div key={i} className="bg-gray-900/50 p-2 rounded border border-gray-700/30">
                            <div className="text-[9px] text-gray-400 mb-1">Line {uncovered.lineNumber}</div>
                            <div className="text-[9px] text-gray-300 mb-1">{uncovered.originalLine}</div>
                            <div className="text-[8px] text-gray-500 italic">{uncovered.reason}</div>
                          </div>
                        ))}
                        {coverageReport.uncoveredLines.length > 5 && (
                          <div className="text-[9px] text-gray-500 text-center">
                            + {coverageReport.uncoveredLines.length - 5} more uncovered lines
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {coverageReport.recommendations.length > 0 && (
                    <div className="bg-black/30 p-2 rounded">
                      <div className="text-[10px] font-bold text-purple-300 mb-2">💡 Recommendations</div>
                      <ul className="space-y-1">
                        {coverageReport.recommendations.map((rec, i) => (
                          <li key={i} className="text-[9px] text-gray-300 flex items-start gap-1">
                            <span className="shrink-0 mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Accordion.Content>
              </Accordion.Item>
            )}

            <div className="text-center pt-2">
              <button
                onClick={() => setDisclosureLevel('level1')}
                className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1 mx-auto"
              >
                <span>▲</span> Back to Quick View
              </button>
            </div>
          </Accordion.Root>
        )}
      </div>

      {/* Approval Actions */}
      {plan.status === 'proposed' && (
        <div className="p-4 bg-black/40 border-t border-white/10 flex gap-3">
          <button
            onClick={onApprove}
            className="flex-grow bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <span>✓</span> Approve & Execute Rewrite
          </button>
          <button
            onClick={onReject}
            className="px-6 bg-red-600/50 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition"
          >
            ✕ Reject
          </button>
        </div>
      )}
    </div>
  );
};
