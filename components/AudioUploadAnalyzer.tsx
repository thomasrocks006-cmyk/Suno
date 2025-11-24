import React, { useState, useRef } from 'react';
import { analyzeAudioFile, validateAudioFile, estimateAnalysisCost, AudioAnalysis } from '../services/audioAnalysisService';

interface AudioUploadAnalyzerProps {
  apiKey: string;
  songContext?: {
    title?: string;
    genre?: string;
    lyrics?: string;
  };
  onAnalysisComplete?: (analysis: AudioAnalysis) => void;
}

export const AudioUploadAnalyzer: React.FC<AudioUploadAnalyzerProps> = ({
  apiKey,
  songContext,
  onAnalysisComplete
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AudioAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setAnalysis(null);

    const validation = validateAudioFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const result = await analyzeAudioFile(selectedFile, apiKey, songContext);
      
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysis(result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    if (score >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        🎧 Deep Audio Listening
      </h3>

      {/* Upload Section */}
      {!analysis && (
        <div className="space-y-4">
          <div className="bg-black/40 rounded-lg p-4 border-2 border-dashed border-purple-500/30">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,.mp3,.wav"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="w-full py-8 text-center hover:bg-purple-500/10 transition rounded-lg"
            >
              <div className="text-4xl mb-2">🎵</div>
              <div className="text-white font-semibold mb-1">
                {selectedFile ? selectedFile.name : 'Click to upload audio file'}
              </div>
              <div className="text-gray-400 text-sm">
                MP3 or WAV • Max 50MB
              </div>
              {selectedFile && (
                <div className="text-gray-500 text-xs mt-2">
                  {formatFileSize(selectedFile.size)} • Estimated cost: ${estimateAnalysisCost(selectedFile.size).toFixed(2)}
                </div>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
              ⚠️ {error}
            </div>
          )}

          {selectedFile && !error && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isAnalyzing ? '🔄 Analyzing...' : '▶️ Analyze Audio'}
            </button>
          )}

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 text-center">
                Analyzing audio with Gemini multimodal AI... {progress}%
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <div>💡 This feature uses Gemini 2.0 Pro multimodal analysis</div>
            <div>🎯 Analyzes vocal tone, production quality, mixing, and commercial readiness</div>
            <div>💰 Cost: ~$0.05 per song analysis</div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4 animate-fadeIn">
          {/* Overall Score */}
          <div className="bg-black/60 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-white">Overall Audio Score</h4>
              <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore.toFixed(1)}/10
              </div>
            </div>
            
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getScoreBgColor(analysis.overallScore)} transition-all`}
                style={{ width: `${analysis.overallScore * 10}%` }}
              ></div>
            </div>
          </div>

          {/* 5 Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vocal Tone */}
            <div className="bg-black/40 rounded-lg p-4 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-bold text-blue-300">🎤 Vocal Tone</h5>
                <span className={`text-xl font-bold ${getScoreColor(analysis.scores.vocalTone.score)}`}>
                  {analysis.scores.vocalTone.score.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-3">{analysis.scores.vocalTone.reasoning}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Clarity:</span>
                  <span className="text-white">{analysis.scores.vocalTone.details.clarity}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Emotion:</span>
                  <span className="text-white">{analysis.scores.vocalTone.details.emotion}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Technique:</span>
                  <span className="text-white">{analysis.scores.vocalTone.details.technique}/10</span>
                </div>
                <div className="text-gray-400 mt-2">
                  Timbre: <span className="text-purple-300">{analysis.scores.vocalTone.details.timbre}</span>
                </div>
              </div>
            </div>

            {/* Production Quality */}
            <div className="bg-black/40 rounded-lg p-4 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-bold text-green-300">🎛️ Production Quality</h5>
                <span className={`text-xl font-bold ${getScoreColor(analysis.scores.productionQuality.score)}`}>
                  {analysis.scores.productionQuality.score.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-3">{analysis.scores.productionQuality.reasoning}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Cleanliness:</span>
                  <span className="text-white">{analysis.scores.productionQuality.details.cleanliness}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Polish:</span>
                  <span className="text-white">{analysis.scores.productionQuality.details.polish}/10</span>
                </div>
                {analysis.scores.productionQuality.details.artifacts.length > 0 && (
                  <div className="text-red-300 mt-2 text-[10px]">
                    Issues: {analysis.scores.productionQuality.details.artifacts.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Mixing Balance */}
            <div className="bg-black/40 rounded-lg p-4 border border-yellow-500/20">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-bold text-yellow-300">🎚️ Mixing Balance</h5>
                <span className={`text-xl font-bold ${getScoreColor(analysis.scores.mixingBalance.score)}`}>
                  {analysis.scores.mixingBalance.score.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-3">{analysis.scores.mixingBalance.reasoning}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Vocal Prominence:</span>
                  <span className="text-white">{analysis.scores.mixingBalance.details.vocalProminence}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Instrument Balance:</span>
                  <span className="text-white">{analysis.scores.mixingBalance.details.instrumentBalance}/10</span>
                </div>
                <div className="text-gray-400 mt-2 text-[10px]">
                  {analysis.scores.mixingBalance.details.frequencyDistribution}
                </div>
              </div>
            </div>

            {/* Sonic Coherence */}
            <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-bold text-purple-300">🎼 Sonic Coherence</h5>
                <span className={`text-xl font-bold ${getScoreColor(analysis.scores.sonicCoherence.score)}`}>
                  {analysis.scores.sonicCoherence.score.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-3">{analysis.scores.sonicCoherence.reasoning}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Genre Alignment:</span>
                  <span className="text-white">{analysis.scores.sonicCoherence.details.genreAlignment}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mood Consistency:</span>
                  <span className="text-white">{analysis.scores.sonicCoherence.details.moodConsistency}/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Commercial Readiness */}
          <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 rounded-lg p-4 border border-orange-500/30">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-bold text-orange-300">📻 Commercial Readiness</h5>
              <span className={`text-xl font-bold ${getScoreColor(analysis.scores.commercialReadiness.score)}`}>
                {analysis.scores.commercialReadiness.score.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-gray-300 mb-3">{analysis.scores.commercialReadiness.reasoning}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`px-2 py-1 rounded ${analysis.scores.commercialReadiness.details.radioReady ? 'bg-green-500/30 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                {analysis.scores.commercialReadiness.details.radioReady ? '✓' : '✗'} Radio Ready
              </span>
              <span className={`px-2 py-1 rounded ${analysis.scores.commercialReadiness.details.streamingOptimized ? 'bg-green-500/30 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                {analysis.scores.commercialReadiness.details.streamingOptimized ? '✓' : '✗'} Streaming Optimized
              </span>
              <span className={`px-2 py-1 rounded ${analysis.scores.commercialReadiness.details.industryStandard ? 'bg-green-500/30 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                {analysis.scores.commercialReadiness.details.industryStandard ? '✓' : '✗'} Industry Standard
              </span>
            </div>
          </div>

          {/* Strengths & Issues */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
              <h5 className="text-sm font-bold text-green-300 mb-2">✨ Strengths</h5>
              <ul className="space-y-1 text-xs text-gray-300">
                {analysis.strengths.map((strength, idx) => (
                  <li key={idx}>• {strength}</li>
                ))}
              </ul>
            </div>

            {analysis.technicalIssues.length > 0 && (
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <h5 className="text-sm font-bold text-red-300 mb-2">⚠️ Technical Issues</h5>
                <ul className="space-y-1 text-xs text-gray-300">
                  {analysis.technicalIssues.map((issue, idx) => (
                    <li key={idx}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
            <h5 className="text-sm font-bold text-blue-300 mb-2">💡 Recommendations</h5>
            <ul className="space-y-1 text-xs text-gray-300">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx}>• {rec}</li>
              ))}
            </ul>
          </div>

          {/* Cost Info */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-white/10">
            Analysis cost: ${analysis.estimatedCost.toFixed(2)} • Powered by Gemini 2.0 Pro
          </div>

          {/* Analyze Another */}
          <button
            onClick={() => {
              setAnalysis(null);
              setSelectedFile(null);
              setError(null);
            }}
            className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm"
          >
            ← Analyze Another File
          </button>
        </div>
      )}
    </div>
  );
};
