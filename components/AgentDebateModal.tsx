/**
 * AGENT DEBATE MODAL
 * 
 * Animated visualization showing 5 agents analyzing and debating the generated song.
 * Displays when advanced features are enabled and shows their impact on agent decisions.
 * 
 * FEATURES DISPLAYED:
 * - Advanced Lyric Logic: Sophisticated rhyme schemes, wordplay patterns
 * - Central Metaphor Logic: Extended metaphor consistency
 * - Commercial Mode: Radio-friendly structure and hooks
 * 
 * FLOW:
 * 1. Modal opens when analysis starts (song has no analysis yet)
 * 2. Shows "Analyzing..." with active features highlighted
 * 3. Analysis completes → debates appear with agent votes
 * 4. Shows consensus strengths
 * 5. Confetti celebration
 */

import React, { useState, useEffect } from 'react';
import { GeneratedSong, AgentDebate } from '../types';

interface AgentDebateModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: GeneratedSong;
  debates: AgentDebate[];
  consensusItems: string[];
  onComplete: () => void;
}

export function AgentDebateModal({
  isOpen,
  onClose,
  song,
  debates,
  consensusItems,
  onComplete
}: AgentDebateModalProps) {
  // Determine current stage based on available data
  const hasAnalysis = !!song.analysis;
  const hasDebates = debates.length > 0;
  
  const [stage, setStage] = useState<'analyzing' | 'debating' | 'consensus' | 'complete'>('analyzing');
  const [visibleDebates, setVisibleDebates] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Stage progression logic - immediate feedback
  useEffect(() => {
    if (!hasAnalysis) {
      setStage('analyzing');
    } else if (hasDebates && visibleDebates < debates.length) {
      setStage('debating');
      // Start showing debates immediately when data arrives
      if (visibleDebates === 0 && debates.length > 0) {
        setVisibleDebates(1);
      }
    } else if (hasDebates) {
      setStage('consensus');
      // Auto-advance to complete after showing consensus
      const timer = setTimeout(() => setStage('complete'), 2000);
      return () => clearTimeout(timer);
    } else if (hasAnalysis) {
      // No debates but analysis complete
      setStage('complete');
    }
  }, [hasAnalysis, hasDebates, visibleDebates, debates.length]);

  // Animate debates appearing one by one (faster for better UX)
  useEffect(() => {
    if (stage === 'debating' && visibleDebates > 0 && visibleDebates < debates.length) {
      const timer = setTimeout(() => {
        setVisibleDebates(prev => prev + 1);
      }, 600); // Faster animation
      return () => clearTimeout(timer);
    }
  }, [stage, visibleDebates, debates.length]);

  // Trigger confetti on complete
  useEffect(() => {
    if (stage === 'complete') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  if (!isOpen) return null;

  const agents = [
    { name: 'Hitmaker', icon: '🎯', color: 'from-yellow-500 to-orange-500' },
    { name: 'Lyricist', icon: '✍️', color: 'from-blue-500 to-cyan-500' },
    { name: 'Storyteller', icon: '📖', color: 'from-purple-500 to-pink-500' },
    { name: 'Vocal Coach', icon: '🎙️', color: 'from-green-500 to-teal-500' },
    { name: 'Producer', icon: '🎚️', color: 'from-red-500 to-pink-500' }
  ];

  const getAgentStatus = (agentName: string) => {
    if (stage === 'analyzing') return 'analyzing';
    if (stage === 'debating') {
      // Check if this agent has voted in visible debates
      const hasVoted = debates.slice(0, visibleDebates).some(debate => 
        debate.votes.some(v => v.agent === agentName)
      );
      return hasVoted ? 'complete' : 'analyzing';
    }
    return 'complete';
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'SUPPORT': return 'text-green-400';
      case 'OPPOSE': return 'text-red-400';
      case 'COMPROMISE': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'SUPPORT': return '✓';
      case 'OPPOSE': return '✗';
      case 'COMPROMISE': return '⚖';
      default: return '?';
    }
  };

  // Check which advanced features are enabled
  const activeFeatures = [];
  if (song.hasAdvancedLogic) activeFeatures.push({ name: 'Advanced Lyric Logic', icon: '🎭', desc: 'Complex rhyme schemes & wordplay' });
  if (song.hasMetaphorLogic) activeFeatures.push({ name: 'Central Metaphor', icon: '🌟', desc: 'Extended metaphor consistency' });
  if (song.hasCommercialMode) activeFeatures.push({ name: 'Commercial Mode', icon: '📻', desc: 'Radio-friendly optimization' });

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-purple-500/30 pointer-events-auto animate-slideInUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-black/40 px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">🎭</span>
                Agent Analysis
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {stage === 'analyzing' && 'Specialists evaluating your song...'}
                {stage === 'debating' && `Debating ${debates.length} tradeoff${debates.length > 1 ? 's' : ''}...`}
                {stage === 'consensus' && 'Reaching consensus on strengths...'}
                {stage === 'complete' && '✨ Analysis complete!'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
            
            {/* Active Features Banner (if any features enabled) */}
            {activeFeatures.length > 0 && (
              <div className="mb-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">⚡</span>
                  <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wide">Active Features</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeFeatures.map(feature => (
                    <div key={feature.name} className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{feature.icon}</span>
                        <span className="text-xs font-bold text-purple-200">{feature.name}</span>
                      </div>
                      <p className="text-xs text-gray-400">{feature.desc}</p>
                      {stage === 'analyzing' && (
                        <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-shimmer" style={{ width: '200%' }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3 italic">
                  ℹ️ Agents will consider these features when analyzing tradeoffs
                </p>
              </div>
            )}

            {/* Agent Cards */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {agents.map(agent => {
                const status = getAgentStatus(agent.name);
                return (
                  <div 
                    key={agent.name}
                    className="bg-black/30 rounded-xl p-3 border border-white/10 text-center"
                  >
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center text-3xl ${status === 'analyzing' ? 'animate-pulse' : ''}`}>
                      {agent.icon}
                    </div>
                    <p className="text-xs font-bold text-white mb-1">{agent.name}</p>
                    <div className="flex items-center justify-center gap-1">
                      {status === 'analyzing' && (
                        <>
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
                          <span className="text-xs text-yellow-400">Analyzing</span>
                        </>
                      )}
                      {status === 'complete' && (
                        <>
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                          <span className="text-xs text-green-400">Done</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stage Indicator */}
            <div className="mb-6 flex items-center justify-center gap-4">
              {['analyzing', 'debating', 'consensus', 'complete'].map((s, idx) => (
                <div key={s} className="flex items-center">
                  <div className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    stage === s 
                      ? 'bg-purple-600 text-white scale-110' 
                      : idx < ['analyzing', 'debating', 'consensus', 'complete'].indexOf(stage)
                      ? 'bg-green-900/50 text-green-400'
                      : 'bg-gray-800 text-gray-500'
                  }`}>
                    {s === 'analyzing' && '🔍 Analysis'}
                    {s === 'debating' && '💬 Debate'}
                    {s === 'consensus' && '🤝 Consensus'}
                    {s === 'complete' && '✅ Complete'}
                  </div>
                  {idx < 3 && (
                    <div className={`w-8 h-0.5 ${idx < ['analyzing', 'debating', 'consensus', 'complete'].indexOf(stage) ? 'bg-green-400' : 'bg-gray-700'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* ANALYZING PHASE: Show what agents are looking for */}
            {stage === 'analyzing' && (
              <div className="space-y-3 mb-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-2xl animate-pulse">🔍</span>
                  What Agents Are Evaluating...
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { agent: 'Lyricist', icon: '✍️', focus: 'Checking for clichés, originality, wordplay sophistication' },
                    { agent: 'Storyteller', icon: '📖', focus: 'Analyzing narrative arc, emotional journey, thematic cohesion' },
                    { agent: 'Vocal Coach', icon: '🎙️', focus: 'Testing vocal playability, phonetic flow, breath marks' },
                    { agent: 'Producer', icon: '🎚️', focus: 'Evaluating sonic density, structure, production cues' },
                    { agent: 'Hitmaker', icon: '🎯', focus: 'Measuring hook factor, commercial potential, memorability' }
                  ].map((item, idx) => (
                    <div 
                      key={item.agent}
                      className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-3 border border-purple-500/20 animate-slideInUp"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-purple-200 mb-1">{item.agent}</p>
                          <p className="text-xs text-gray-400">{item.focus}</p>
                        </div>
                      </div>
                      <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-shimmer" style={{ width: '200%' }} />
                      </div>
                    </div>
                  ))}
                </div>
                {activeFeatures.length > 0 && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-3">
                    <p className="text-xs text-yellow-200">
                      ⚡ Agents are considering your active features: <strong>{activeFeatures.map(f => f.name).join(', ')}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Debates Section */}
            {debates.length > 0 && (stage === 'debating' || stage === 'consensus' || stage === 'complete') && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">⚔️</span>
                  Tradeoff Debates ({debates.length})
                </h3>
                {debates.slice(0, visibleDebates).map((debate, idx) => (
                  <div 
                    key={idx}
                    className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl p-4 border border-orange-500/30 animate-slideInUp"
                  >
                    <h4 className="text-sm font-bold text-orange-200 mb-3">{debate.issue}</h4>
                    
                    {/* Vote Summary */}
                    <div className="flex items-center gap-4 mb-3 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-green-400 font-bold">{debate.votes.filter(v => v.position === 'SUPPORT').length}</span>
                        <span className="text-gray-400">Support</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-red-400 font-bold">{debate.votes.filter(v => v.position === 'OPPOSE').length}</span>
                        <span className="text-gray-400">Oppose</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 font-bold">{debate.votes.filter(v => v.position === 'COMPROMISE').length}</span>
                        <span className="text-gray-400">Compromise</span>
                      </div>
                    </div>

                    {/* Agent Votes */}
                    <div className="space-y-2 mb-3">
                      {debate.votes.map((vote, vIdx) => (
                        <div 
                          key={vIdx}
                          className="bg-black/40 rounded-lg p-2 border border-white/5 animate-fadeIn"
                          style={{ animationDelay: `${vIdx * 100}ms` }}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">
                              {agents.find(a => a.name === vote.agent)?.icon || '🤖'}
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-white">{vote.agent}</span>
                                <span className={`text-xs font-bold ${getPositionColor(vote.position)}`}>
                                  {getPositionIcon(vote.position)} {vote.position}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400">{vote.reasoning}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Resolution */}
                    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">⚖️</span>
                        <span className="text-xs font-bold text-purple-300">Resolution: {debate.resolution.decision}</span>
                      </div>
                      <p className="text-xs text-gray-300">{debate.resolution.rationale}</p>
                      {activeFeatures.length > 0 && (
                        <p className="text-xs text-purple-400 italic mt-2">
                          💡 Decision influenced by active features: {activeFeatures.map(f => f.name).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Debates Message */}
            {debates.length === 0 && (stage === 'consensus' || stage === 'complete') && (
              <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✨</span>
                  <h3 className="text-lg font-bold text-green-300">No Conflicts Detected</h3>
                </div>
                <p className="text-sm text-gray-300">
                  All agents are in agreement! The song achieves excellent balance across all scoring categories.
                  {activeFeatures.length > 0 && ' Your active features are working harmoniously together.'}
                </p>
              </div>
            )}

            {/* Consensus Strengths */}
            {consensusItems.length > 0 && (stage === 'consensus' || stage === 'complete') && (
              <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-xl p-4 border border-green-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💪</span>
                  <h3 className="text-lg font-bold text-green-300">Consensus Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {consensusItems.slice(0, 5).map((item, idx) => (
                    <li 
                      key={idx}
                      className="text-sm text-gray-300 flex items-start gap-2 animate-fadeIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Final Score (if available) */}
            {song.analysis && stage === 'complete' && (
              <div className="mt-6 text-center">
                <div className="inline-block bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl px-8 py-4">
                  <p className="text-sm text-purple-200 mb-1">Overall Score</p>
                  <p className="text-5xl font-bold text-white">{song.analysis.overallScore}</p>
                  <p className="text-xs text-purple-200 mt-1">/ 10</p>
                </div>
              </div>
            )}

            {/* Complete Button */}
            {stage === 'complete' && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    onComplete();
                    onClose();
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-lg"
                >
                  View Full Results
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                backgroundColor: ['#f59e0b', '#8b5cf6', '#10b981', '#3b82f6', '#ec4899'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes confetti {
          0% { 
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </>
  );
}

export default AgentDebateModal;
