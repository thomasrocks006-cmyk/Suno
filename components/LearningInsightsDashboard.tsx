/**
 * LEARNING INSIGHTS DASHBOARD
 * Shows user's learned preferences and feedback patterns
 * Displays style signature, top patterns, analytics
 */

import React, { useState, useEffect } from 'react';
import {
  getUserProfile,
  getFeedbackHistory,
  getLearningAnalytics,
  clearFeedbackHistory,
  UserPreferenceProfile
} from '../services/historicalLearningService';

interface LearningInsightsDashboardProps {
  onClose: () => void;
}

export const LearningInsightsDashboard: React.FC<LearningInsightsDashboardProps> = ({ onClose }) => {
  const [profile, setProfile] = useState<UserPreferenceProfile | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'style' | 'categories'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProfile(getUserProfile());
    setAnalytics(getLearningAnalytics());
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all learning data? This cannot be undone.')) {
      clearFeedbackHistory();
      loadData();
    }
  };

  const getStyleBarColor = (value: number): string => {
    if (value > 0.7) return 'bg-green-500';
    if (value > 0.5) return 'bg-blue-500';
    if (value > 0.3) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  if (!profile || !analytics) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-xl font-semibold text-white mb-4">
            No Learning Data Yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start accepting, rejecting, or modifying suggestions to build your personalized preference profile. 
            The system will learn from your choices and adapt future suggestions to match your style.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="border-b border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🧠 Learning Insights
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Your personalized preference profile based on {analytics.totalFeedback} interactions
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
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-700">
            {['overview', 'patterns', 'style', 'categories'].map(tab => (
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
                  <div className="text-gray-400 text-sm mb-1">Total Interactions</div>
                  <div className="text-3xl font-bold text-blue-400">
                    {analytics.totalFeedback}
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Acceptance Rate</div>
                  <div className="text-3xl font-bold text-green-400">
                    {analytics.acceptanceRate}%
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Modification Rate</div>
                  <div className="text-3xl font-bold text-yellow-400">
                    {analytics.modificationRate}%
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Learning Trend</div>
                  <div className={`text-3xl font-bold ${analytics.improvementTrend > 0 ? 'text-green-400' : 'text-orange-400'}`}>
                    {analytics.improvementTrend > 0 ? '+' : ''}{analytics.improvementTrend}%
                  </div>
                </div>
              </div>

              {/* Top Patterns */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  🎯 Top Learned Patterns
                </h3>
                {analytics.topPatterns.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    Not enough data yet. Keep interacting to discover patterns!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {analytics.topPatterns.map((pattern: any) => (
                      <div key={pattern.patternId} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{pattern.description}</span>
                          <span className={`text-sm font-semibold ${getConfidenceColor(pattern.confidence)}`}>
                            {Math.round(pattern.confidence * 100)}% confidence
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {pattern.occurrences} occurrences • {pattern.patternType}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Style Signature Preview */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  ✨ Your Style Signature
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(profile.styleSignature).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span className="text-white capitalize">{key}</span>
                        <span className="text-gray-400">{Math.round((value as number) * 100)}%</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div 
                          className={`${getStyleBarColor(value as number)} h-full rounded-full transition-all`}
                          style={{ width: `${(value as number) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Patterns Tab */}
          {activeTab === 'patterns' && (
            <div className="space-y-4">
              {profile.patterns.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-400">No patterns detected yet. Keep using the system!</p>
                </div>
              ) : (
                profile.patterns.map(pattern => (
                  <div key={pattern.patternId} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{pattern.description}</h4>
                        <div className="flex gap-3 mt-1 text-sm">
                          <span className="text-gray-400 capitalize">
                            {pattern.patternType === 'preference' && '✓ Preference'}
                            {pattern.patternType === 'avoidance' && '✗ Avoidance'}
                            {pattern.patternType === 'style' && '🎨 Style'}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{pattern.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getConfidenceColor(pattern.confidence)}`}>
                          {Math.round(pattern.confidence * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">confidence</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-3 mt-3">
                      <div className="text-sm text-gray-400 mb-2">
                        {pattern.occurrences} occurrences
                      </div>
                      {pattern.examples.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 mb-2">Examples:</div>
                          <div className="space-y-1">
                            {pattern.examples.slice(0, 2).map((ex, i) => (
                              <div key={i} className="text-sm text-gray-300 italic">
                                "{ex}"
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Style Tab */}
          {activeTab === 'style' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  🎨 Style Signature Analysis
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Based on {analytics.totalFeedback} interactions, we've identified your stylistic preferences:
                </p>
                
                <div className="space-y-6">
                  {Object.entries(profile.styleSignature).map(([key, value]) => {
                    const percentage = Math.round((value as number) * 100);
                    let description = '';
                    
                    if (key === 'formality') {
                      description = percentage > 70 ? 'Highly formal, structured language' :
                                   percentage > 50 ? 'Balanced formality' :
                                   'Casual, conversational tone';
                    } else if (key === 'complexity') {
                      description = percentage > 70 ? 'Complex vocabulary, sophisticated' :
                                   percentage > 50 ? 'Moderate complexity' :
                                   'Simple, accessible language';
                    } else if (key === 'imagery') {
                      description = percentage > 70 ? 'Heavy use of metaphors and sensory details' :
                                   percentage > 50 ? 'Balanced literal and figurative' :
                                   'Direct, literal descriptions';
                    } else if (key === 'emotion') {
                      description = percentage > 70 ? 'Intense emotional expression' :
                                   percentage > 50 ? 'Moderate emotional content' :
                                   'Subdued, restrained emotion';
                    }
                    
                    return (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-white font-semibold capitalize">{key}</span>
                            <p className="text-sm text-gray-400 mt-1">{description}</p>
                          </div>
                          <span className="text-2xl font-bold text-blue-400">{percentage}%</span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-3">
                          <div 
                            className={`${getStyleBarColor(value as number)} h-full rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vocabulary Preferences */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-3">✓ Preferred Words</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.vocabularyPreferences.preferredWords.slice(0, 15).map(word => (
                      <span key={word} className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-3">✗ Avoided Words</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.vocabularyPreferences.avoidedWords.slice(0, 15).map(word => (
                      <span key={word} className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-sm">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                📊 Category Performance
              </h3>
              {profile.categoryPreferences.map(cat => (
                <div key={cat.category} className="bg-gray-800 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-white mb-4">{cat.category}</h4>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Acceptance Rate</div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-full rounded-full"
                            style={{ width: `${cat.acceptanceRate * 100}%` }}
                          />
                        </div>
                        <span className="text-xl font-bold text-green-400">
                          {Math.round(cat.acceptanceRate * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Modification Rate</div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-yellow-500 h-full rounded-full"
                            style={{ width: `${cat.avgModificationRate * 100}%` }}
                          />
                        </div>
                        <span className="text-xl font-bold text-yellow-400">
                          {Math.round(cat.avgModificationRate * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reset Button */}
          <div className="border-t border-gray-700 pt-6 mt-6 text-center">
            <button
              onClick={handleReset}
              className="bg-red-900/30 hover:bg-red-900/50 text-red-400 px-6 py-2 rounded-lg text-sm"
            >
              🗑️ Clear All Learning Data
            </button>
            <p className="text-xs text-gray-500 mt-2">
              This will reset your preference profile and start fresh
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
