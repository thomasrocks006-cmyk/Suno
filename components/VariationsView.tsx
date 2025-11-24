import React, { useState } from 'react';
import { GeneratedSong, SongVariation } from '../types';

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

interface ProgressBarProps {
  isRunning: boolean;
  label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isRunning, label }) => {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (!isRunning) {
      setProgress(0);
      return;
    }
    
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + Math.random() * 15 : prev));
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning]);

  if (!isRunning) return null;

  return (
    <div className="flex flex-col items-center justify-center h-64 w-full animate-fade-in">
      <div className="w-64 mb-2 flex justify-between text-xs uppercase font-bold text-suno-accent">
         <span>{label}</span>
         <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-64 bg-black/50 rounded-full h-2 overflow-hidden border border-white/10">
        <div 
          className="bg-gradient-to-r from-suno-primary to-suno-accent h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-500 text-xs mt-4 animate-pulse">Consulting Gemini 3.0 Pro...</p>
    </div>
  );
};

interface VariationsViewProps {
  song: GeneratedSong;
  isGeneratingVariations: boolean;
  onGenerateVariations: () => void;
}

export const VariationsView: React.FC<VariationsViewProps> = ({
  song,
  isGeneratingVariations,
  onGenerateVariations
}) => {
  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
      <div className="mb-6 flex justify-center">
        <button 
          onClick={onGenerateVariations}
          disabled={isGeneratingVariations}
          className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-suno-secondary hover:bg-pink-600 shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingVariations ? (
            <>
              <span className="animate-spin">⏳</span> Dreaming...
            </>
          ) : (
            <>
              <span>✨</span> Generate 2 New Variations
            </>
          )}
        </button>
      </div>

      {isGeneratingVariations ? (
        <ProgressBar isRunning={true} label="Dreaming up Variations..." />
      ) : song.variations ? (
        <div className="space-y-8 pb-20">
          {song.variations.map((variation, idx) => (
            <div key={idx} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="bg-black/30 p-3 border-b border-white/10 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-suno-secondary uppercase tracking-wider">Variation {idx + 1}</span>
                  <h4 className="text-white font-bold text-sm">{variation.type}</h4>
                </div>
                <CopyButton text={variation.lyrics} />
              </div>
              <div className="p-4 bg-suno-secondary/5 text-xs text-gray-300 italic border-b border-white/5">
                "{variation.explanation}"
              </div>
              <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar bg-black/20">
                <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">{variation.lyrics}</pre>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 text-center opacity-50">
          <p className="text-gray-400 text-sm">No variations generated yet.</p>
        </div>
      )}
    </div>
  );
};
