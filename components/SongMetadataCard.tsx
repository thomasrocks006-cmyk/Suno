import React from 'react';
import { GeneratedSong } from '../types';

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-2 py-1 rounded transition flex items-center gap-1"
    >
      {copied ? <span className="text-green-400">Copied!</span> : <span>Copy</span>}
    </button>
  );
};

interface SongMetadataCardProps {
  song: GeneratedSong;
}

export const SongMetadataCard: React.FC<SongMetadataCardProps> = ({ song }) => {
  return (
    <div className="bg-suno-surface/50 p-4 md:p-6 rounded-2xl border border-white/5 shadow-xl mb-4 shrink-0 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Cover Art */}
        <div className="shrink-0 group relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 flex items-center justify-center relative">
            {song.coverImageBase64 ? (
              <img 
                src={`data:image/jpeg;base64,${song.coverImageBase64}`} 
                alt="Album Cover" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="text-center p-2">
                <div className="text-3xl mb-1 opacity-50">🎵</div>
              </div>
            )}
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs font-bold text-white">View</span>
            </div>
          </div>
        </div>

        {/* Song Details */}
        <div className="flex-grow min-w-0 relative flex flex-col justify-center">
          {/* Logic Feature Badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            {song.hasAdvancedLogic && (
              <span title="Written with Advanced Lyric Logic" className="flex items-center gap-1 text-[10px] font-bold bg-suno-primary/10 text-suno-primary border border-suno-primary/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/></svg>
                Advanced Logic
              </span>
            )}
            {song.hasMetaphorLogic && (
              <span title="Written with Central Metaphor Logic" className="flex items-center gap-1 text-[10px] font-bold bg-suno-accent/10 text-suno-accent border border-suno-accent/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Metaphor
              </span>
            )}
            {song.hasCommercialMode && (
              <span title="Written with Commercial Mode (Less is More)" className="flex items-center gap-1 text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Commercial
              </span>
            )}
            {song.actualModel && (
              <span title={`Verified: Generated with Suno ${song.actualModel}`} className="flex items-center gap-1 text-[10px] font-bold bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                {song.actualModel.toUpperCase()}
              </span>
            )}
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 truncate tracking-tight">{song.title}</h3>
          <p className="text-gray-400 text-xs italic mb-3 line-clamp-2 max-w-2xl">{song.technicalExplanation}</p>
          
          <div className="flex items-center gap-2">
            <div className="bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2 max-w-md">
              <span className="text-[10px] uppercase font-bold text-suno-secondary tracking-wider shrink-0">Style</span>
              <span className="text-gray-300 font-mono text-xs truncate">{song.stylePrompt}</span>
              <div className="ml-auto">
                <CopyButton text={song.stylePrompt} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
