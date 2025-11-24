/**
 * VALIDATION STUDY DASHBOARD
 * Displays results from quality validation study
 * Shows A/B test results, expert consensus, statistical metrics
 */

import React, { useState } from 'react';
import { 
  runValidationStudy, 
  ValidationMetrics, 
  ABTestResult, 
  ExpertRating,
  getTestSongs,
  getExpertProfiles
} from '../services/qualityValidationService';

interface ValidationDashboardProps {
  onClose: () => void;
}

export const ValidationDashboard: React.FC<ValidationDashboardProps> = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [metrics, setMetrics] = useState<ValidationMetrics | null>(null);
  const [results, setResults] = useState<ABTestResult[]>([]);
  const [rawRatings, setRawRatings] = useState<ExpertRating[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'songs' | 'experts' | 'raw'>('overview');

  const handleRunStudy = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const studyResults = await runValidationStudy((prog, stat) => {
      setProgress(prog);
      setStatus(stat);
    });

    setMetrics(studyResults.metrics);
    setResults(studyResults.results);
    setRawRatings(studyResults.rawRatings);
    setIsRunning(false);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getImprovementColor = (improvement: number): string => {
    if (improvement >= 15) return 'text-green-400';
    if (improvement >= 10) return 'text-green-300';
    if (improvement >= 5) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="border-b border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🔬 Quality Validation Study
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              A/B Testing with Expert Ratings & Statistical Analysis
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Initial State */}
          {!metrics && !isRunning && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Run Validation Study
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Simulate a comprehensive quality validation study with {getTestSongs().length} test songs 
                rated by {getExpertProfiles().length} industry experts across multiple categories. 
                Includes A/B testing, statistical significance, and prediction accuracy analysis.
              </p>
              <button
                onClick={handleRunStudy}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                🚀 Start Validation Study
              </button>
              
              <div className="mt-8 bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto text-left">
                <h4 className="font-semibold text-white mb-3">Study Parameters:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ <strong>Test Songs:</strong> {getTestSongs().length} original + rewritten versions</li>
                  <li>✓ <strong>Experts:</strong> {getExpertProfiles().length} industry professionals (producers, lyricists, A&R, musicologists)</li>
                  <li>✓ <strong>Categories:</strong> 5 scoring dimensions per song</li>
                  <li>✓ <strong>Analysis:</strong> Statistical significance, confidence intervals, consensus metrics</li>
                  <li>✓ <strong>Validation:</strong> AI prediction accuracy vs. expert ratings</li>
                </ul>
              </div>
            </div>
          )}

          {/* Running State */}
          {isRunning && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-pulse">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Running Validation Study...
              </h3>
              <p className="text-gray-400 mb-6">{status}</p>
              
              <div className="max-w-md mx-auto">
                <div className="bg-gray-800 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-white mt-2 font-semibold">{Math.round(progress)}%</p>
              </div>
            </div>
          )}

          {/* Results State */}
          {metrics && !isRunning && (
            <>
              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-gray-700">
                {['overview', 'songs', 'experts', 'raw'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 font-semibold capitalize ${
                      activeTab === tab
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Average Improvement</div>
                      <div className={`text-3xl font-bold ${getImprovementColor(metrics.averageImprovement)}`}>
                        +{metrics.averageImprovement}%
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Expert Consensus</div>
                      <div className="text-3xl font-bold text-blue-400">
                        {Math.round(metrics.expertConsensus * 100)}%
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Statistical Significance</div>
                      <div className={`text-2xl font-bold ${metrics.statisticalSignificance.significant ? 'text-green-400' : 'text-red-400'}`}>
                        {metrics.statisticalSignificance.significant ? '✓ Yes' : '✗ No'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">p = {metrics.statisticalSignificance.pValue}</div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Total Ratings</div>
                      <div className="text-3xl font-bold text-purple-400">
                        {metrics.totalRatings}
                      </div>
                    </div>
                  </div>

                  {/* Category Performance */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      📊 Category Performance
                    </h3>
                    <div className="space-y-4">
                      {metrics.categoryPerformance.map(cat => (
                        <div key={cat.category}>
                          <div className="flex justify-between mb-2">
                            <span className="text-white font-medium">{cat.category}</span>
                            <span className={`font-semibold ${getImprovementColor(cat.improvement)}`}>
                              +{cat.improvement}%
                            </span>
                          </div>
                          <div className="flex gap-4 items-center">
                            <div className="flex-1">
                              <div className="text-xs text-gray-400 mb-1">Original: {cat.originalAvg}/10</div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gray-500 h-full rounded-full"
                                  style={{ width: `${cat.originalAvg * 10}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-gray-400 mb-1">Rewritten: {cat.rewrittenAvg}/10</div>
                              <div className="bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-full rounded-full"
                                  style={{ width: `${cat.rewrittenAvg * 10}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confidence Interval */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      📈 95% Confidence Interval
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      We can be 95% confident that the true mean score falls between:
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {metrics.confidenceInterval.lower}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Lower Bound</div>
                      </div>
                      <div className="text-gray-600 text-2xl">—</div>
                      <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {metrics.confidenceInterval.upper}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Upper Bound</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Songs Tab */}
              {activeTab === 'songs' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    🎵 A/B Test Results by Song
                  </h3>
                  {results.map(result => (
                    <div key={result.songId} className="bg-gray-800 rounded-lg p-6">
                      <h4 className="text-xl font-bold text-white mb-4">{result.songTitle}</h4>
                      
                      <div className="grid grid-cols-3 gap-6 mb-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-2">AI Prediction</div>
                          <div className="space-y-1">
                            <div>Original: <span className={getScoreColor(result.aiScore.original)}>{result.aiScore.original}</span></div>
                            <div>Rewritten: <span className={getScoreColor(result.aiScore.rewritten)}>{result.aiScore.rewritten}</span></div>
                            <div className="font-semibold text-blue-400">+{result.aiScore.predictedImprovement}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Expert Rating</div>
                          <div className="space-y-1">
                            <div>Original: <span className={getScoreColor(result.expertScore.original)}>{result.expertScore.original}</span></div>
                            <div>Rewritten: <span className={getScoreColor(result.expertScore.rewritten)}>{result.expertScore.rewritten}</span></div>
                            <div className="font-semibold text-green-400">+{result.expertScore.actualImprovement}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Prediction Accuracy</div>
                          <div className="text-3xl font-bold text-purple-400">
                            {result.predictionAccuracy}%
                          </div>
                        </div>
                      </div>

                      {result.discrepancies.length > 0 && (
                        <div className="border-t border-gray-700 pt-4 mt-4">
                          <div className="text-sm text-gray-400 mb-2">⚠️ Discrepancies:</div>
                          <ul className="text-sm text-orange-400 space-y-1">
                            {result.discrepancies.map((d, i) => (
                              <li key={i}>• {d}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Experts Tab */}
              {activeTab === 'experts' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    👥 Expert Profiles & Ratings
                  </h3>
                  {getExpertProfiles().map(expert => {
                    const expertRatings = rawRatings.filter(r => r.expertId === expert.id);
                    const avgScore = expertRatings.reduce((sum, r) => sum + r.overallScore, 0) / expertRatings.length;
                    
                    return (
                      <div key={expert.id} className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-white">{expert.name}</h4>
                            <p className="text-gray-400 capitalize">{expert.expertise}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Average Score</div>
                            <div className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>
                              {avgScore.toFixed(1)}/10
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          Rated {expertRatings.length} versions across {getTestSongs().length} songs
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Raw Data Tab */}
              {activeTab === 'raw' && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    📋 Raw Rating Data
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-700">
                        <tr className="text-left text-gray-400">
                          <th className="pb-2">Expert</th>
                          <th className="pb-2">Song ID</th>
                          <th className="pb-2">Version</th>
                          <th className="pb-2">Overall Score</th>
                          <th className="pb-2">Categories</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        {rawRatings.slice(0, 20).map((rating, i) => (
                          <tr key={i} className="border-b border-gray-700">
                            <td className="py-2">{rating.expertName}</td>
                            <td className="py-2 font-mono text-xs">{rating.songId}</td>
                            <td className="py-2 capitalize">{rating.versionRated}</td>
                            <td className="py-2">
                              <span className={getScoreColor(rating.overallScore)}>
                                {rating.overallScore}
                              </span>
                            </td>
                            <td className="py-2 text-xs">
                              {rating.ratings.map(r => `${r.category.split(' ')[0]}: ${r.score}`).join(', ')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {rawRatings.length > 20 && (
                      <p className="text-center text-gray-500 text-sm mt-4">
                        Showing 20 of {rawRatings.length} ratings
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Rerun Button */}
              <div className="text-center pt-6">
                <button
                  onClick={handleRunStudy}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  🔄 Run New Study
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
