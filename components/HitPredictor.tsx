import React, { useState } from 'react';
import { SongAnalysis } from '../types';
import { predictHitPotential, HitPrediction, PersonaScore } from '../services/hitPredictorService';

interface HitPredictorProps {
  apiKey: string;
  songData: {
    title: string;
    genre: string;
    lyrics: string;
    analysis: SongAnalysis;
  };
  onPredictionComplete?: (prediction: HitPrediction) => void;
}

export const HitPredictor: React.FC<HitPredictorProps> = ({
  apiKey,
  songData,
  onPredictionComplete
}) => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<HitPrediction | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setIsPredicting(true);
    setError(null);
    setProgress(0);

    try {
      const result = await predictHitPotential(songData, apiKey, setProgress);
      setPrediction(result);
      
      if (onPredictionComplete) {
        onPredictionComplete(result);
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'Prediction failed');
    } finally {
      setIsPredicting(false);
      setProgress(0);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 30) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getConfidenceColor = (confidence: string): string => {
    if (confidence === 'High') return 'text-green-400';
    if (confidence === 'Medium') return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getPersonaIcon = (persona: string): string => {
    switch (persona) {
      case 'Radio PD': return '📻';
      case 'TikTok Influencer': return '📱';
      case 'Playlist Curator': return '🎵';
      case 'Label A&R': return '🎤';
      case 'Music Journalist': return '✍️';
      default: return '👤';
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-900/40 to-pink-900/40 border border-orange-500/30 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        🎯 Hit Predictor Simulation
      </h3>

      {!prediction && !isPredicting && (
        <div className="space-y-4">
          <div className="bg-black/40 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-4">
              Get hit potential predictions from 5 industry personas:
            </p>
            
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span>📻</span>
                <span>Radio Program Director - Mass appeal & rotation potential</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📱</span>
                <span>TikTok Influencer - Viral potential & Gen Z appeal</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎵</span>
                <span>Playlist Curator - Streaming fit & algorithm optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎤</span>
                <span>Label A&R - Commercial viability & long-term potential</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✍️</span>
                <span>Music Journalist - Artistic merit & cultural impact</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handlePredict}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition"
          >
            🎯 Predict Hit Potential
          </button>

          <div className="text-xs text-gray-500 space-y-1">
            <div>💰 Cost: ~$0.05 (5 personas × $0.01 each)</div>
            <div>⏱️ Duration: ~10-15 seconds</div>
            <div>🤖 Powered by Gemini 2.0 Flash</div>
          </div>
        </div>
      )}

      {isPredicting && (
        <div className="space-y-3">
          <div className="flex items-center justify-center py-8">
            <div className="text-4xl animate-pulse">🎯</div>
          </div>
          
          <div className="space-y-2">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 text-center">
              Consulting industry personas... {Math.round(progress)}%
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <div>🤔 Analyzing from 5 different perspectives</div>
            <div>⚡ This may take 10-15 seconds</div>
          </div>
        </div>
      )}

      {prediction && (
        <div className="space-y-4 animate-fadeIn">
          {/* Main Score */}
          <div className="bg-black/60 rounded-lg p-6 border border-orange-500/30 text-center">
            <div className="text-sm text-gray-400 mb-2">Hit Probability</div>
            <div className={`text-6xl font-bold ${getScoreColor(prediction.hitProbability)} mb-2`}>
              {prediction.hitProbability}%
            </div>
            <div className={`text-sm font-semibold ${getConfidenceColor(prediction.confidence)}`}>
              {prediction.confidence} Confidence
            </div>
            
            <div className="mt-4 h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getScoreBgColor(prediction.hitProbability)} transition-all`}
                style={{ width: `${prediction.hitProbability}%` }}
              ></div>
            </div>
          </div>

          {/* Market Fit */}
          <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
            <h4 className="text-sm font-bold text-purple-300 mb-2">📊 Market Assessment</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Market Fit:</span>
                <span className="text-white font-semibold">{prediction.consensus.marketFit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Target Audience:</span>
                <span className="text-white">{prediction.consensus.targetAudience}</span>
              </div>
            </div>
          </div>

          {/* Persona Scores */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">👥 Persona Predictions</h4>
            
            {prediction.personaScores.map((persona: PersonaScore, idx: number) => (
              <div key={idx} className="bg-black/40 rounded-lg p-4 border border-white/10">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getPersonaIcon(persona.persona)}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{persona.persona}</div>
                      <div className="text-xs text-gray-500">{persona.role}</div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(persona.score)}`}>
                    {persona.score}
                  </div>
                </div>
                
                <p className="text-xs text-gray-300 mb-3">{persona.reasoning}</p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {persona.keyFactors.positive.length > 0 && (
                    <div>
                      <div className="text-green-400 font-semibold mb-1">✓ Positives:</div>
                      <ul className="space-y-0.5 text-gray-400">
                        {persona.keyFactors.positive.map((factor, i) => (
                          <li key={i}>• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {persona.keyFactors.negative.length > 0 && (
                    <div>
                      <div className="text-red-400 font-semibold mb-1">✗ Negatives:</div>
                      <ul className="space-y-0.5 text-gray-400">
                        {persona.keyFactors.negative.map((factor, i) => (
                          <li key={i}>• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Confidence:</span>
                    <div className="flex-grow h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${persona.confidence * 10}%` }}
                      ></div>
                    </div>
                    <span>{persona.confidence}/10</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Breakdown Metrics */}
          <div className="bg-black/40 rounded-lg p-4 border border-blue-500/20">
            <h4 className="text-sm font-bold text-blue-300 mb-3">📈 Breakdown Metrics</h4>
            <div className="space-y-2">
              {Object.entries(prediction.breakdown).map(([key, value]) => {
                const score = typeof value === 'number' ? value : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className={`font-semibold ${getScoreColor(score)}`}>{score}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getScoreBgColor(score)}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consensus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prediction.consensus.strengths.length > 0 && (
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                <h5 className="text-sm font-bold text-green-300 mb-2">✨ Consensus Strengths</h5>
                <ul className="space-y-1 text-xs text-gray-300">
                  {prediction.consensus.strengths.map((strength, idx) => (
                    <li key={idx}>• {strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {prediction.consensus.weaknesses.length > 0 && (
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <h5 className="text-sm font-bold text-red-300 mb-2">⚠️ Consensus Weaknesses</h5>
                <ul className="space-y-1 text-xs text-gray-300">
                  {prediction.consensus.weaknesses.map((weakness, idx) => (
                    <li key={idx}>• {weakness}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
            <h5 className="text-sm font-bold text-blue-300 mb-2">💡 Strategic Recommendations</h5>
            <ul className="space-y-1 text-xs text-gray-300">
              {prediction.recommendations.map((rec, idx) => (
                <li key={idx}>• {rec}</li>
              ))}
            </ul>
          </div>

          {/* Cost Info */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-white/10">
            Analysis cost: ${prediction.estimatedCost.toFixed(2)} • 5 personas consulted
          </div>

          {/* Predict Again */}
          <button
            onClick={() => {
              setPrediction(null);
              setError(null);
            }}
            className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm"
          >
            ← Run New Prediction
          </button>
        </div>
      )}
    </div>
  );
};
