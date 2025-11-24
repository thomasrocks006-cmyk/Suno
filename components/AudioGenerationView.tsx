import React from 'react';
import { GeneratedSong, SunoModel } from '../types';
import { useAudio } from '../contexts/AudioContext';

const MODELS: { value: SunoModel; label: string; desc: string }[] = [
  { value: 'V3_5', label: 'v3.5', desc: 'Fast, Creative' },
  { value: 'V4', label: 'v4.0', desc: 'High Quality' },
  { value: 'V5', label: 'v5.0', desc: 'Newest, Best Audio' },
];

interface AudioGenerationViewProps {
  song: GeneratedSong;
  selectedModel: SunoModel;
  isInstrumental: boolean;
  isGeneratingAudio: boolean;
  generationError: string | null;
  onModelChange: (model: SunoModel) => void;
  onInstrumentalToggle: () => void;
  onGenerateAudio: () => void;
  onUpdateSong: (song: GeneratedSong) => void;
}

export const AudioGenerationView: React.FC<AudioGenerationViewProps> = ({
  song,
  selectedModel,
  isInstrumental,
  isGeneratingAudio,
  generationError,
  onModelChange,
  onInstrumentalToggle,
  onGenerateAudio,
  onUpdateSong
}) => {
  const { playSong, currentSong: globalCurrentSong, isPlaying } = useAudio();

  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 md:p-8 rounded-3xl border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Suno Audio Studio</h3>
              <p className="text-sm text-gray-400">Transform your lyrics into professional-quality audio with Suno's AI music generation.</p>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        {!song.sunoTaskId && (
          <div className="bg-black/30 p-6 rounded-2xl border border-white/10 space-y-6">
            <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-suno-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
              Generation Settings
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Model Selector */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-300">Model Version</label>
                <div className="grid grid-cols-3 gap-2">
                  {MODELS.map(model => (
                    <button
                      key={model.value}
                      onClick={() => onModelChange(model.value)}
                      className={`group relative py-3 px-3 rounded-xl text-xs font-bold transition-all ${
                        selectedModel === model.value
                          ? 'bg-gradient-to-br from-suno-primary to-purple-600 text-white shadow-lg shadow-suno-primary/30 scale-105'
                          : 'bg-black/40 text-gray-400 hover:text-white hover:bg-black/60 border border-white/5'
                      }`}
                    >
                      <div className="text-base mb-1">{model.label}</div>
                      <div className="text-[9px] opacity-70">{model.desc}</div>
                      {selectedModel === model.value && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                  <span>V5 offers the highest audio quality and most realistic vocals.</span>
                </p>
              </div>

              {/* Vocal Settings */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-300">Vocal Settings</label>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">Instrumental Mode</div>
                      <div className="text-xs text-gray-500">Generate music without vocals</div>
                    </div>
                    <button
                      onClick={onInstrumentalToggle}
                      className={`w-14 h-7 rounded-full transition-all relative ${
                        isInstrumental ? 'bg-gradient-to-r from-suno-primary to-purple-600 shadow-lg' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform shadow-md flex items-center justify-center ${
                        isInstrumental ? 'translate-x-7' : 'translate-x-0'
                      }`}>
                        {isInstrumental ? (
                          <svg className="w-3 h-3 text-suno-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        ) : (
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                        )}
                      </div>
                    </button>
                  </div>
                  {isInstrumental && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-200 flex gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                      <span>Lyrics will be used for musical phrasing, but no vocals will be added.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {generationError && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              <div className="flex-1">
                <h4 className="text-red-400 font-bold text-sm mb-1">Generation Failed</h4>
                <p className="text-xs text-gray-300">{generationError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button or Status */}
        {!song.sunoTaskId ? (
          <button
            onClick={onGenerateAudio}
            disabled={isGeneratingAudio}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-green-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isGeneratingAudio ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending to Suno...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/></svg>
                <span>Generate Audio Now</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            {(song.audioStatus === 'SUCCESS' || song.audioStatus === 'TEXT_SUCCESS') && (song.audioUrl || song.streamAudioUrl) ? (
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border border-green-500/30">
                <div className="flex items-center justify-center gap-3 text-green-400 font-bold mb-6 text-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span>Generation Complete!</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                </div>
                
                <button 
                  onClick={() => playSong(song)}
                  className="w-full bg-gradient-to-r from-suno-primary to-purple-600 hover:from-suno-primary/90 hover:to-purple-600/90 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-suno-primary/30 mb-4"
                >
                  {globalCurrentSong?.id === song.id && isPlaying ? (
                    <>
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      <span>Pause Playback</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      <span>Play Song</span>
                    </>
                  )}
                </button>
                
                <div className="flex justify-center gap-4">
                  <a 
                    href={song.audioUrl || song.streamAudioUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-gray-300 hover:text-white underline flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    Open in New Tab
                  </a>
                  <a 
                    href={song.audioUrl || song.streamAudioUrl} 
                    download={`${song.title.replace(/[^a-z0-9]/gi, '_')}.mp3`}
                    className="text-sm text-gray-300 hover:text-white underline flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download MP3
                  </a>
                </div>
              </div>
            ) : song.audioStatus === 'FAILED' ? (
              <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/30">
                <div className="flex gap-3 mb-4">
                  <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                  <div>
                    <p className="text-red-400 font-bold mb-1">Generation Failed</p>
                    <p className="text-sm text-gray-400">
                      The Suno API encountered an error. Please try again later.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onUpdateSong({ ...song, sunoTaskId: undefined, audioStatus: undefined })}
                  className="w-full text-sm text-white bg-red-500/20 hover:bg-red-500/30 px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  Reset & Try Again
                </button>
              </div>
            ) : (
              <div className="py-6 md:py-8">
                <div className="w-12 h-12 md:w-16 md:h-16 border-2 md:border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto mb-3 md:mb-4" />
                <h4 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2">Generating Audio...</h4>
                <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6">
                  Suno v5 is composing your masterpiece. This usually takes 1-2 minutes.
                </p>
                <div className="max-w-xs mx-auto bg-black/50 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-green-500 animate-progress-indeterminate" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
