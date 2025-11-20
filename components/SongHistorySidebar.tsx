
import React from 'react';
import { GeneratedSong } from '../types';

interface SongHistorySidebarProps {
  history: GeneratedSong[];
  onSelectSong: (song: GeneratedSong) => void;
  currentSongId?: string;
  onClearHistory: () => void;
}

export const SongHistorySidebar: React.FC<SongHistorySidebarProps> = ({ 
  history, 
  onSelectSong, 
  currentSongId,
  onClearHistory
}) => {
  return (
    <div className="w-full lg:w-64 shrink-0 flex flex-col h-[500px] lg:h-auto lg:min-h-[calc(100vh-8rem)] bg-suno-card border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4 text-suno-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Session History
        </h3>
        {history.length > 0 && (
          <button 
            onClick={onClearHistory} 
            className="text-[10px] text-red-400 hover:text-red-300"
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-xs text-center p-4">
            <p>No songs generated yet.</p>
            <p className="mt-1">Create your first hit!</p>
          </div>
        ) : (
          history.map((song) => (
            <div 
              key={song.id}
              onClick={() => onSelectSong(song)}
              className={`p-3 rounded-lg cursor-pointer transition-all group relative overflow-hidden ${
                currentSongId === song.id 
                  ? 'bg-suno-primary/10 border border-suno-primary/40' 
                  : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Mini Cover */}
                <div className="w-10 h-10 rounded bg-black/50 shrink-0 overflow-hidden border border-white/10 relative">
                  {song.coverImageBase64 ? (
                    <img src={`data:image/jpeg;base64,${song.coverImageBase64}`} alt="cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🎵</div>
                  )}
                </div>
                
                <div className="min-w-0 flex-grow">
                  <div className="flex justify-between items-start">
                      <h4 className={`text-sm font-bold truncate pr-1 ${currentSongId === song.id ? 'text-suno-primary' : 'text-gray-200'}`}>
                        {song.title}
                      </h4>
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">{song.stylePrompt}</p>
                  
                  <div className="flex justify-between items-center mt-1">
                     <span className="text-[9px] text-gray-600">
                        {new Date(song.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </span>
                     {/* Indicators */}
                     <div className="flex gap-1">
                        {song.hasAdvancedLogic && (
                            <div className="w-1.5 h-1.5 rounded-full bg-suno-primary" title="Advanced Lyric Logic"></div>
                        )}
                        {song.hasMetaphorLogic && (
                            <div className="w-1.5 h-1.5 rounded-full bg-suno-accent" title="Metaphor Logic"></div>
                        )}
                     </div>
                  </div>
                </div>
              </div>
              
              {song.analysis && (
                <div className="absolute top-1 right-1">
                  <div className={`text-[9px] font-bold px-1.5 rounded ${
                    song.analysis.overallScore >= 80 ? 'bg-green-500/20 text-green-400' :
                    song.analysis.overallScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {song.analysis.overallScore}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
