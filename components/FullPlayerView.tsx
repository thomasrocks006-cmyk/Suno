import React from 'react';
import { useAudio } from '../contexts/AudioContext';

export const FullPlayerView: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, progress, duration, seek, isFullPlayerOpen, setFullPlayerOpen } = useAudio();

  if (!currentSong || !isFullPlayerOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
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
    <div className="fixed inset-0 z-[60] bg-gray-900 text-white flex flex-col animate-fade-in">
      {/* Background Blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {coverSrc ? (
           <img src={coverSrc} className="w-full h-full object-cover opacity-20 blur-3xl scale-110" alt="" />
        ) : (
           <div className="w-full h-full bg-gradient-to-br from-suno-primary/20 to-purple-900/20 blur-3xl" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button 
          onClick={() => setFullPlayerOpen(false)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Now Playing</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row gap-8 p-6 md:p-12 overflow-hidden">
        
        {/* Left Column: Art & Controls */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full">
          {/* Album Art */}
          <div className="w-full aspect-square max-w-md bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8 border border-white/10 relative group">
             {coverSrc ? (
                <img src={coverSrc} alt={currentSong.title} className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <span className="text-6xl">🎵</span>
                </div>
             )}
             {/* Play Overlay on Hover */}
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={togglePlay}>
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {isPlaying ? (
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                </div>
             </div>
          </div>

          {/* Metadata */}
          <div className="text-center mb-8 w-full">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 truncate">{currentSong.title}</h1>
            <p className="text-lg text-gray-400 truncate">{currentSong.stylePrompt}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full mb-6 group">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-suno-primary hover:accent-suno-primary/80"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-8">
            <button className="text-gray-400 hover:text-white transition-colors">
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
            </button>
            <button 
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/20"
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
            </button>
          </div>
        </div>

        {/* Right Column: Lyrics */}
        <div className="flex-1 bg-black/20 rounded-3xl p-6 md:p-8 overflow-y-auto custom-scrollbar backdrop-blur-sm border border-white/5">
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-6 sticky top-0 bg-transparent backdrop-blur-md py-2">Lyrics</h3>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-300 font-medium whitespace-pre-wrap">
            {currentSong.lyrics ? (
                currentSong.lyrics.split('\n').map((line, i) => (
                    <p key={i} className={`transition-colors duration-300 hover:text-white ${line.startsWith('[') ? 'text-suno-primary text-sm font-bold mt-6 mb-2' : ''}`}>
                        {line}
                    </p>
                ))
            ) : (
                <p className="text-gray-500 italic">No lyrics available.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
