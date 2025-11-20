import React, { useState, useEffect } from 'react';

interface StyleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (styleString: string) => void;
  initialStyle: string;
}

const TAG_CATEGORIES = [
  {
    name: "Core Genres",
    tags: ["Pop", "Rock", "Hip Hop", "Electronic", "R&B", "Jazz", "Country", "Classical", "Metal", "Folk", "Blues", "Soul"]
  },
  {
    name: "Electronic & Synth",
    tags: ["Synthpop", "Darkwave", "Future Bass", "Techno", "House", "Trance", "Dubstep", "IDM", "Vaporwave", "Cyberpunk", "Retrowave", "Eurobeat"]
  },
  {
    name: "Rock & Metal",
    tags: ["Indie Rock", "Alt Rock", "Punk", "Pop Punk", "Grunge", "Shoegaze", "Nu-Metal", "Djent", "Black Metal", "Progressive Rock", "Math Rock"]
  },
  {
    name: "Urban & Rhythm",
    tags: ["Trap", "Drill", "Boom Bap", "Neo-Soul", "Funk", "Disco", "Afrobeats", "Reggaeton", "Dancehall", "Gospel"]
  },
  {
    name: "Atmosphere",
    tags: ["Ethereal", "Cinematic", "Epic", "Dark", "Melancholic", "Upbeat", "Chill", "Aggressive", "Dreamy", "Psychedelic", "Haunting", "Energetic"]
  },
  {
    name: "Instruments",
    tags: ["Synthesizer", "Electric Guitar", "Acoustic Guitar", "Piano", "Strings", "Violin", "Saxophone", "808 Drums", "Orchestra", "Bass Guitar", "Brass"]
  },
  {
    name: "Production & Era",
    tags: ["Lo-fi", "High Fidelity", "1980s", "1990s", "2000s", "Vintage", "Live Recording", "Studio Quality", "Heavy Bass", "Wide Stereo", "Clean"]
  }
];

export const StyleBuilderModal: React.FC<StyleBuilderModalProps> = ({ isOpen, onClose, onApply, initialStyle }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(TAG_CATEGORIES[0].name);
  const [customTag, setCustomTag] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Initialize tags from existing string, splitting by commas
      const existing = initialStyle
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      setSelectedTags(existing);
    }
  }, [isOpen, initialStyle]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const addCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag("");
    }
  };

  const handleApply = () => {
    onApply(selectedTags.join(', '));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-suno-card border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-suno-accent">✨</span> Style Prompt Builder
            </h3>
            <p className="text-sm text-gray-400 mt-1">Select tags to build a rich, complex Suno v5 style prompt.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          {/* Sidebar Categories */}
          <div className="w-full md:w-1/4 bg-black/20 overflow-y-auto border-b md:border-b-0 md:border-r border-white/10">
            {TAG_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`w-full text-left px-6 py-4 text-sm font-medium transition-all ${
                  activeCategory === cat.name 
                    ? 'bg-suno-primary/10 text-suno-primary border-l-4 border-suno-primary' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Tags Grid */}
          <div className="w-full md:w-3/4 p-6 overflow-y-auto custom-scrollbar bg-suno-dark">
            <div className="flex flex-wrap gap-2 mb-8">
              {TAG_CATEGORIES.find(c => c.name === activeCategory)?.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform active:scale-95 ${
                    selectedTags.includes(tag)
                      ? 'bg-suno-primary text-white shadow-lg shadow-suno-primary/20'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {tag} {selectedTags.includes(tag) && '✓'}
                </button>
              ))}
            </div>

            {/* Manual Add */}
            <form onSubmit={addCustomTag} className="mt-auto pt-4 border-t border-white/10">
              <label className="block text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">Add Custom Tag</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="e.g., Gregorian Chant"
                  className="flex-grow bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-suno-accent outline-none"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer / Preview */}
        <div className="p-6 border-t border-white/10 bg-black/40">
          <label className="block text-xs font-bold text-suno-accent uppercase tracking-wider mb-2">
            Current Style Prompt
          </label>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-grow w-full bg-black/50 border border-white/10 rounded-lg p-3 min-h-[3rem] flex flex-wrap gap-2">
              {selectedTags.length === 0 ? (
                <span className="text-gray-600 text-sm italic">Select tags to build your style...</span>
              ) : (
                selectedTags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-suno-primary/20 text-suno-primary text-xs rounded border border-suno-primary/20">
                    {tag}
                    <button onClick={() => toggleTag(tag)} className="hover:text-white">×</button>
                  </span>
                ))
              )}
            </div>
            <div className="flex gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={onClose}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-suno-primary to-suno-secondary shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all"
              >
                Apply Style
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};