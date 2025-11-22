import React from 'react';
import { SunoTip } from '../types';

const TIPS: SunoTip[] = [
  {
    title: "The [Intro] Trick",
    content: "Start with [Instrumental Intro] before the first [Verse] to let the style establish itself for 10-15 seconds.",
    category: "structure"
  },
  {
    title: "Vocal Coloring",
    content: "Direct the AI's delivery using tags like [Whisper], [Shout], or [Spoken Word]. Use parentheticals like (Ohh-yeah) for ad-libs and backing vocals.",
    category: "style"
  },
  {
    title: "V5 Hallucinations",
    content: "If v5 starts ignoring lyrics, try adding 'clear vocals' to the style prompt or reduce the complexity of the genre fusion.",
    category: "style"
  },
  {
    title: "Phonetic Spelling",
    content: "If the AI mispronounces a word, spell it phonetically in the lyrics. (e.g., 'co-ordination' instead of 'coordination').",
    category: "meta"
  },
  {
    title: "The End Tag",
    content: "Always finish with [Outro] followed by [End] to prevent the song from looping or cutting off abruptly.",
    category: "structure"
  }
];

export const TipsSidebar: React.FC = () => {
  return (
    <div className="w-full h-full p-4">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Pro Tips</h3>
      <div className="space-y-4">
        {TIPS.map((tip, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-suno-primary/50 transition-colors">
            <h4 className="text-suno-accent font-bold text-sm mb-1">{tip.title}</h4>
            <p className="text-gray-400 text-xs leading-relaxed">{tip.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};