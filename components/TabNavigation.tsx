import React from 'react';
import { GeneratedSong } from '../types';

type Tab = 'lyrics' | 'analysis' | 'variations' | 'audio';

interface TabNavigationProps {
  activeTab: Tab;
  song: GeneratedSong;
  isSmartEditorOpen: boolean;
  onTabChange: (tab: Tab) => void;
  onAnalyzeClick: () => void;
  getScoreColor: (score: number) => string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  song,
  isSmartEditorOpen,
  onTabChange,
  onAnalyzeClick,
  getScoreColor
}) => {
  return (
    <div className="flex items-center gap-2 mb-4 px-1 shrink-0 overflow-x-auto pb-2 border-b border-white/5">
      <button 
        onClick={() => onTabChange('lyrics')}
        className={`px-4 py-2 rounded-t-lg text-sm font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === 'lyrics' ? 'border-suno-primary text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
      >
        Lyrics {isSmartEditorOpen && <span className="ml-2 text-[10px] bg-suno-primary/20 text-suno-primary px-1.5 rounded">Editing</span>}
      </button>
      
      <button 
        onClick={() => { 
          onTabChange('analysis'); 
          onAnalyzeClick(); 
        }}
        className={`px-4 py-2 rounded-t-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${activeTab === 'analysis' ? 'border-suno-accent text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
      >
        Deep Analysis
        {!song.analysis ? (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-suno-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-suno-accent"></span>
          </span>
        ) : (
          <span className={`text-[10px] px-1.5 rounded text-white ${getScoreColor(song.analysis.overallScore).split(' ')[0].replace('text-', 'bg-').replace('-400', '-500')}`}>
            {song.analysis.overallScore}
          </span>
        )}
      </button>

      <button 
        onClick={() => onTabChange('variations')}
        className={`px-4 py-2 rounded-t-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${activeTab === 'variations' ? 'border-suno-secondary text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
      >
        Variations
        {song.variations && <span className="text-[10px] bg-white/10 px-1.5 rounded text-white">{song.variations.length}</span>}
      </button>

      <button 
        onClick={() => onTabChange('audio')}
        className={`px-4 py-2 rounded-t-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${activeTab === 'audio' ? 'border-green-500 text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
      >
        Audio Studio
        {song.audioStatus === 'SUCCESS' && <span className="text-[10px] bg-green-500 text-white px-1.5 rounded">✓</span>}
      </button>
    </div>
  );
};
