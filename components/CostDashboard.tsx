import React, { useState, useEffect } from 'react';
import { costTracking, CostSummary, CostEntry } from '../services/costTrackingService';

interface CostDashboardProps {
  onClose: () => void;
}

export const CostDashboard: React.FC<CostDashboardProps> = ({ onClose }) => {
  const [summary, setSummary] = useState<CostSummary | null>(null);
  const [entries, setEntries] = useState<CostEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'breakdown'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSummary(costTracking.getSummary());
    setEntries(costTracking.getAllEntries().reverse()); // Most recent first
  };

  const handleExport = () => {
    const csv = costTracking.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suno-costs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all cost tracking data? This cannot be undone.')) {
      costTracking.clear();
      loadData();
    }
  };

  if (!summary) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-suno-surface rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-green-900/20 to-emerald-900/20">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              💰 Cost Dashboard
            </h2>
            <p className="text-sm text-gray-400 mt-1">Track your API usage and spending</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-4 bg-black/20 border-b border-white/5">
          {[
            { id: 'overview', label: '📊 Overview', emoji: '📊' },
            { id: 'history', label: '📜 History', emoji: '📜' },
            { id: 'breakdown', label: '📈 Breakdown', emoji: '📈' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-4 rounded-lg border border-green-500/20">
                  <div className="text-green-400 text-sm font-semibold mb-1">Total Spent</div>
                  <div className="text-3xl font-bold text-white">${summary.totalCost.toFixed(2)}</div>
                  <div className="text-xs text-gray-400 mt-1">All time</div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-4 rounded-lg border border-blue-500/20">
                  <div className="text-blue-400 text-sm font-semibold mb-1">Today</div>
                  <div className="text-3xl font-bold text-white">${summary.todayCost.toFixed(2)}</div>
                  <div className="text-xs text-gray-400 mt-1">Last 24 hours</div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-4 rounded-lg border border-purple-500/20">
                  <div className="text-purple-400 text-sm font-semibold mb-1">This Week</div>
                  <div className="text-3xl font-bold text-white">${summary.weekCost.toFixed(2)}</div>
                  <div className="text-xs text-gray-400 mt-1">Last 7 days</div>
                </div>

                <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 p-4 rounded-lg border border-orange-500/20">
                  <div className="text-orange-400 text-sm font-semibold mb-1">Avg per Song</div>
                  <div className="text-3xl font-bold text-white">${summary.averageCostPerSong.toFixed(3)}</div>
                  <div className="text-xs text-gray-400 mt-1">Generation + Analysis</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Total Operations</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {Object.values(summary.operationCounts).reduce((a: number, b: number) => a + b, 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Songs Generated</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {summary.operationCounts.generation || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Analyses Run</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {summary.operationCounts.analysis || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Rewrites</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {summary.operationCounts.rewrite || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Line Edits</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {summary.operationCounts.line_edit || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Chat Questions</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {summary.operationCounts.chat || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                <div className="text-sm text-gray-400">
                  Showing {Math.min(entries.length, 50)} of {entries.length} entries
                </div>
              </div>
              
              {entries.slice(0, 50).map(entry => (
                <div
                  key={entry.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {entry.operation === 'generation' && '✨'}
                          {entry.operation === 'analysis' && '🔍'}
                          {entry.operation === 'rewrite' && '✍️'}
                          {entry.operation === 'variation' && '🎭'}
                          {entry.operation === 'line_edit' && '✏️'}
                          {entry.operation === 'chat' && '💬'}
                          {entry.operation === 'image' && '🖼️'}
                        </span>
                        <div>
                          <div className="text-white font-semibold capitalize">
                            {entry.operation.replace('_', ' ')}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {entry.songTitle && (
                        <div className="text-sm text-gray-400 mt-1 ml-8">
                          Song: {entry.songTitle}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">
                        ${entry.estimatedCost.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-500">{entry.model}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Cost by Operation</h3>
                <div className="space-y-3">
                  {Object.entries(summary.operationCosts)
                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                    .map(([operation, cost]) => {
                      const count = summary.operationCounts[operation];
                      const costNum = cost as number;
                      const percentage = (costNum / summary.totalCost) * 100;
                      
                      return (
                        <div key={operation} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300 capitalize">
                              {operation.replace('_', ' ')} ({count}x)
                            </span>
                            <span className="text-white font-semibold">
                              ${costNum.toFixed(4)} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-500/20">
                <h3 className="text-lg font-bold text-white mb-3">💡 Cost Saving Tips</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Disable image generation to save ~$0.02 per song</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Use programmatic scoring instead of AI chat for quick checks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Edit lines manually instead of using AI suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Batch operations when possible to reduce overhead</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-black/20 border-t border-white/10">
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              📥 Export CSV
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-semibold transition-colors border border-red-500/30"
            >
              🗑️ Clear Data
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostDashboard;
