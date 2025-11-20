
import React, { useState, useEffect } from 'react';

interface InstrumentSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInstruments: string[];
  onChange: (instruments: string[]) => void;
  suggestedInstruments?: string[];
}

const INSTRUMENT_CATEGORIES = [
  {
    name: "Essentials",
    instruments: ["Acoustic Guitar", "Electric Guitar", "Bass Guitar", "Piano", "Drums", "Vocals", "Synthesizer"]
  },
  {
    name: "Orchestral & Strings",
    instruments: ["Violin", "Cello", "Double Bass", "Viola", "String Section", "Harp", "Orchestra Hit", "Pizzicato Strings"]
  },
  {
    name: "Electronic & Synth",
    instruments: ["808 Bass", "Sawtooth Synth", "Pad", "Arpeggiator", "Sub Bass", "Drum Machine", "Sampler", "Vocoder"]
  },
  {
    name: "Brass & Woodwind",
    instruments: ["Saxophone", "Trumpet", "Trombone", "Brass Section", "Flute", "Clarinet", "Oboe"]
  },
  {
    name: "World & Folk",
    instruments: ["Banjo", "Mandolin", "Ukulele", "Sitar", "Koto", "Steel Drums", "Accordion", "Bagpipes", "Kalimba"]
  },
  {
    name: "Percussion",
    instruments: ["Congas", "Bongos", "Shaker", "Tambourine", "Timpani", "Chimes", "Clap", "Snap"]
  },
  {
    name: "Ambient & FX",
    instruments: ["Vinyl Crackle", "Rain", "White Noise", "Drone", "Tape Hiss", "Reverb Swell"]
  }
];

export const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({ 
  isOpen, 
  onClose, 
  selectedInstruments, 
  onChange, 
  suggestedInstruments = [] 
}) => {
  const [activeCategory, setActiveCategory] = useState("Essentials");

  const toggleInstrument = (inst: string) => {
    if (selectedInstruments.includes(inst)) {
      onChange(selectedInstruments.filter(i => i !== inst));
    } else {
      onChange([...selectedInstruments, inst]);
    }
  };

  const isSuggested = (inst: string) => {
    return suggestedInstruments.some(s => s.toLowerCase().includes(inst.toLowerCase()) || inst.toLowerCase().includes(s.toLowerCase()));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-suno-card border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-yellow-400">🎸</span> Instrument Selector
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Build your sound palette. Highlighted items match your inspiration.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          
          {/* Categories */}
          <div className="w-full md:w-1/4 bg-black/20 overflow-y-auto border-b md:border-b-0 md:border-r border-white/10">
            {INSTRUMENT_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat.name 
                    ? 'bg-white/10 text-white border-l-2 border-yellow-400' 
                    : 'text-gray-500 hover:bg-white/5 hover:text-gray-300 border-l-2 border-transparent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Instruments Grid */}
          <div className="w-full md:w-3/4 p-6 overflow-y-auto custom-scrollbar bg-suno-dark">
            <h4 className="text-white font-bold mb-4">{activeCategory}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {INSTRUMENT_CATEGORIES.find(c => c.name === activeCategory)?.instruments.map((inst) => {
                const suggested = isSuggested(inst);
                const selected = selectedInstruments.includes(inst);
                
                return (
                  <button
                    key={inst}
                    onClick={() => toggleInstrument(inst)}
                    className={`relative px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-all border ${
                      selected 
                        ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20'
                        : suggested
                          ? 'bg-yellow-500/10 text-yellow-200 border-yellow-500/50 hover:bg-yellow-500/20'
                          : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{inst}</span>
                      {selected && <span>✓</span>}
                      {suggested && !selected && <span className="text-[10px] text-yellow-500">★</span>}
                    </div>
                    {suggested && !selected && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar max-w-[70%]">
            {selectedInstruments.length === 0 ? (
              <span className="text-gray-500 text-xs italic py-1">No instruments selected</span>
            ) : (
              selectedInstruments.map(i => (
                <span key={i} className="shrink-0 px-2 py-1 rounded bg-white/10 text-white text-[10px] border border-white/10 flex items-center gap-1">
                  {i}
                  <button onClick={() => toggleInstrument(i)} className="hover:text-red-400">×</button>
                </span>
              ))
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
