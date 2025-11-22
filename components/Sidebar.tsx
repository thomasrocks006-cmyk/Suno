import React, { useState } from 'react';
import { GeneratedSong } from '../types';
import { SongHistorySidebar } from './SongHistorySidebar';
import { TipsSidebar } from './TipsSidebar';

interface SidebarProps {
  history: GeneratedSong[];
  onSelectSong: (song: GeneratedSong) => void;
  currentSongId?: string;
  onClearHistory: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  history,
  onSelectSong,
  currentSongId,
  onClearHistory,
  isOpen,
  onToggle
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'tips'>('history');

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-suno-card border-r border-white/10 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-72'}
      `}>
        {/* Sidebar Header / Tabs */}
        <div className="h-16 flex items-center border-b border-white/10 px-2 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
              activeTab === 'history' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
              activeTab === 'tips' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            Pro Tips
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'history' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
             <SongHistorySidebar 
                history={history}
                onSelectSong={(s) => { onSelectSong(s); if(window.innerWidth < 1024) onToggle(); }}
                currentSongId={currentSongId}
                onClearHistory={onClearHistory}
             />
          </div>
          <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'tips' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
             <div className="h-full overflow-y-auto custom-scrollbar">
                <TipsSidebar />
             </div>
          </div>
        </div>
        
        {/* Footer / Branding */}
        <div className="p-4 border-t border-white/10 text-[10px] text-gray-600 text-center">
            Suno v5 Architect &copy; 2024
        </div>
      </div>
    </>
  );
};
