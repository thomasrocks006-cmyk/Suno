import React, { useState } from 'react';
import { GeneratedSong } from '../types';
import { SmartLineEditor } from './SmartLineEditor';

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

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

interface LyricsViewProps {
  song: GeneratedSong;
  isSmartEditorOpen: boolean;
  editingLineIndex: number | null;
  onToggleSmartEditor: () => void;
  onLineClick: (index: number) => void;
  onSmartEditSave: (newLine: string) => void;
  onCancelEdit: () => void;
  onTextHighlight: (text: string) => void;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  song,
  isSmartEditorOpen,
  editingLineIndex,
  onToggleSmartEditor,
  onLineClick,
  onSmartEditSave,
  onCancelEdit,
  onTextHighlight
}) => {
  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar p-6 relative">
      <div className="flex justify-between items-center absolute top-4 right-6 z-10 gap-2">
        <button 
          onClick={onToggleSmartEditor}
          className={`text-xs px-3 py-1.5 rounded font-bold transition-colors ${isSmartEditorOpen ? 'bg-suno-primary text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}
        >
          {isSmartEditorOpen ? 'Done Editing' : '✨ Smart Edit'}
        </button>
        <CopyButton text={song.lyrics} />
      </div>

      <div 
        className="font-mono text-xs md:text-sm lg:text-base text-gray-200 whitespace-pre-wrap leading-relaxed pb-12 md:pb-20"
        onMouseUp={(e) => {
          const selection = window.getSelection();
          const selectedText = selection?.toString().trim();
          if (selectedText && selectedText.length > 5) {
            onTextHighlight(selectedText);
          }
        }}
      >
        {song.lyrics.split('\n').map((line, i) => {
          const isHeader = line.trim().startsWith('[') && line.trim().endsWith(']');
          const isMeta = line.trim().startsWith('(') && line.trim().endsWith(')');
          
          if (editingLineIndex === i && isSmartEditorOpen) {
            return (
              <div key={i} className="my-2">
                <SmartLineEditor 
                  originalLine={line}
                  songContext={`${song.stylePrompt} - ${song.title}`}
                  onSave={onSmartEditSave}
                  onCancel={onCancelEdit}
                />
              </div>
            );
          }

          return (
            <div 
              key={i}
              onClick={() => isSmartEditorOpen && !isHeader && line.trim() && onLineClick(i)}
              className={`
                ${isHeader ? 'text-suno-accent font-bold mt-6 mb-2' : ''}
                ${isMeta ? 'text-purple-400 italic' : ''}
                ${isSmartEditorOpen && !isHeader && line.trim() ? 'hover:bg-white/10 cursor-pointer p-1 rounded border border-transparent hover:border-white/20' : 'min-h-[1.5em]'}
              `}
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
};
