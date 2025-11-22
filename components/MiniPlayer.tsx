import React from 'react';
import { useAudio } from '../contexts/AudioContext';

export const MiniPlayer: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, progress, duration, setFullPlayerOpen } = useAudio();

  if (!currentSong) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCoverImageSrc = (song: any) => {
    if (song.imageUrl) return song.imageUrl;
    if (song.coverImageBase64) {
      return song.coverImageBase64.startsWith('data:') 
        ? song.coverImageBase64 
        : `data:image/jpeg;base64,${song.coverImageBase64}`;
    }
    return null;
  };

  const coverSrc = getCoverImageSrc(currentSong);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-white/10 p-3 flex items-center justify-between z-50 backdrop-blur-md bg-opacity-90">
      {/* Song Info */}
      <div 
        className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
        onClick={() => setFullPlayerOpen(true)}
      >
        <div className="w-10 h-10 bg-gray-700 rounded overflow-hidden flex-shrink-0 relative group">
          {coverSrc ? (
            <img src={coverSrc} alt={currentSong.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              🎵
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
             <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
          </div>
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-white truncate">{currentSong.title}</h4>
          <p className="text-xs text-gray-400 truncate">{currentSong.stylePrompt || currentSong.style}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center flex-1 max-w-md px-4">
        <div className="flex items-center gap-4 mb-1">
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>
          <button 
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>
        <div className="w-full flex items-center gap-2 text-[10px] text-gray-400">
          <span>{formatTime(progress)}</span>
          <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/80" 
              style={{ width: `${(progress / (duration || 1)) * 100}%` }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Extra Actions */}
      <div className="flex-1 flex justify-end">
        <button className="text-gray-400 hover:text-white p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>
  );
};
