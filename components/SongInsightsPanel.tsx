import React, { useMemo } from 'react';
import { GeneratedSong } from '../types';

interface SongInsightsPanelProps {
  song: GeneratedSong;
}

interface Insight {
  icon: string;
  title: string;
  value: string;
  explanation: string;
  category: 'structure' | 'style' | 'technique' | 'comparison';
}

export const SongInsightsPanel: React.FC<SongInsightsPanelProps> = ({ song }) => {
  
  const insights = useMemo(() => {
    const results: Insight[] = [];
    const lyrics = song.lyrics;
    
    // Word count
    const wordCount = lyrics.split(/\s+/).filter(w => w.length > 0).length;
    results.push({
      icon: '📝',
      title: 'Word Count',
      value: `${wordCount} words`,
      explanation: getWordCountComparison(wordCount),
      category: 'structure'
    });
    
    // Line count
    const lines = lyrics.split('\n').filter(l => l.trim().length > 0 && !l.trim().startsWith('['));
    results.push({
      icon: '📏',
      title: 'Total Lines',
      value: `${lines.length} lines`,
      explanation: `Average line length: ${Math.round(wordCount / lines.length)} words`,
      category: 'structure'
    });
    
    // Rhyme analysis
    const rhymeAnalysis = analyzeRhymes(lyrics);
    if (rhymeAnalysis.slantRhymePercentage > 0) {
      results.push({
        icon: '🎵',
        title: 'Rhyme Style',
        value: `${rhymeAnalysis.slantRhymePercentage}% Slant Rhymes`,
        explanation: 'Used by poets like Emily Dickinson and modern songwriters for a sophisticated sound',
        category: 'style'
      });
    }
    
    // Open vowel endings (for singability)
    const openVowelEndings = countOpenVowelEndings(lyrics);
    if (openVowelEndings.percentage > 50) {
      results.push({
        icon: '🎤',
        title: 'Belting Potential',
        value: `${openVowelEndings.percentage}% Open Vowels`,
        explanation: 'Lines ending with A, O, I are perfect for powerful vocal delivery',
        category: 'technique'
      });
    }
    
    // Concrete objects (furniture audit)
    const objects = extractConcreteObjects(lyrics);
    results.push({
      icon: '🎨',
      title: 'Visual Imagery',
      value: `${objects.length} Concrete Objects`,
      explanation: getImageryExplanation(objects.length),
      category: 'technique'
    });
    
    // Metaphor detection
    const metaphors = detectMetaphors(lyrics);
    if (metaphors.length > 0) {
      results.push({
        icon: '🌟',
        title: 'Metaphorical Depth',
        value: `${metaphors.length} Extended Metaphors`,
        explanation: 'Consistent imagery creates memorable, cohesive storytelling',
        category: 'style'
      });
    }
    
    // Structure analysis
    const structure = analyzeStructure(lyrics);
    results.push({
      icon: '🏗️',
      title: 'Song Structure',
      value: structure.format,
      explanation: structure.explanation,
      category: 'structure'
    });
    
    // Repetition analysis
    const repetition = analyzeRepetition(lyrics);
    if (repetition.hookLine) {
      results.push({
        icon: '🔁',
        title: 'Hook Repetition',
        value: `"${repetition.hookLine.slice(0, 30)}..."`,
        explanation: `Repeated ${repetition.count} times - proven technique for catchiness`,
        category: 'technique'
      });
    }
    
    // Energy arc
    const energyArc = analyzeEnergyArc(lyrics);
    if (energyArc.hasDynamicRange) {
      results.push({
        icon: '⚡',
        title: 'Dynamic Energy',
        value: `${energyArc.range} Energy Levels`,
        explanation: 'Clear energy progression keeps listeners engaged',
        category: 'structure'
      });
    }
    
    // DNA match insight (if available)
    if (song.analysis?.dnaMatch) {
      const match = song.analysis.dnaMatch;
      results.push({
        icon: '🧬',
        title: 'DNA Match',
        value: `${match.referenceSong}`,
        explanation: `${match.matchScore}% similarity - shares ${Object.keys(match.matchReasons).length} key traits`,
        category: 'comparison'
      });
    }
    
    // Commercial viability insights
    if (song.analysis?.overallScore && song.analysis.overallScore > 80) {
      results.push({
        icon: '🎯',
        title: 'Hit Potential',
        value: `${song.analysis.overallScore}/100 Score`,
        explanation: 'Above 80 indicates strong commercial viability',
        category: 'comparison'
      });
    }
    
    return results;
  }, [song]);
  
  const categories = {
    structure: insights.filter(i => i.category === 'structure'),
    style: insights.filter(i => i.category === 'style'),
    technique: insights.filter(i => i.category === 'technique'),
    comparison: insights.filter(i => i.category === 'comparison'),
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💡</span>
        <h3 className="text-xl font-bold text-white">Song Insights</h3>
      </div>
      
      {Object.entries(categories).map(([category, items]) => {
        if (items.length === 0) return null;
        
        return (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              {category}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((insight, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {insight.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-400 mb-1">{insight.title}</div>
                      <div className="text-white font-semibold mb-2">{insight.value}</div>
                      <div className="text-xs text-gray-400 leading-relaxed">
                        {insight.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      {/* Pro Tips Section */}
      <div className="mt-6 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-lg p-4 border border-amber-500/20">
        <div className="flex items-start gap-2">
          <span className="text-xl">💡</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-amber-300 mb-2">Did You Know?</div>
            <div className="text-xs text-gray-300 space-y-1">
              {getRandomProTip(song)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions

function getWordCountComparison(count: number): string {
  if (count < 200) return "Concise like 'Imagine' by John Lennon (115 words)";
  if (count < 300) return "Similar to 'Hotel California' by Eagles (249 words)";
  if (count < 400) return "Comparable to 'Bohemian Rhapsody' by Queen (355 words)";
  return "Epic length, like 'American Pie' by Don McLean (872 words)";
}

function analyzeRhymes(lyrics: string): { slantRhymePercentage: number } {
  // Simplified rhyme detection
  const lines = lyrics.split('\n').filter(l => l.trim() && !l.startsWith('['));
  const lastWords = lines.map(l => l.trim().split(/\s+/).pop()?.toLowerCase() || '');
  
  let slantRhymes = 0;
  for (let i = 0; i < lastWords.length - 1; i++) {
    const w1 = lastWords[i];
    const w2 = lastWords[i + 1];
    if (w1 && w2 && w1.slice(-2) !== w2.slice(-2) && w1.slice(-1) === w2.slice(-1)) {
      slantRhymes++;
    }
  }
  
  return {
    slantRhymePercentage: Math.round((slantRhymes / lines.length) * 100)
  };
}

function countOpenVowelEndings(lyrics: string): { count: number; percentage: number } {
  const lines = lyrics.split('\n').filter(l => l.trim() && !l.startsWith('['));
  const openVowels = ['a', 'o', 'i', 'ay', 'oy', 'igh'];
  
  let count = 0;
  lines.forEach(line => {
    const lastWord = line.trim().split(/\s+/).pop()?.toLowerCase() || '';
    if (openVowels.some(v => lastWord.endsWith(v))) {
      count++;
    }
  });
  
  return {
    count,
    percentage: Math.round((count / lines.length) * 100)
  };
}

function extractConcreteObjects(lyrics: string): string[] {
  // Common concrete nouns (simplified list)
  const concretePatterns = [
    /\b(car|house|door|window|street|road|sky|sun|moon|star|coffee|glass|bottle|phone|picture|wall|floor|table|chair|bed|room|mirror|light|shadow|rain|snow|fire|smoke|water|river|ocean|mountain|tree|flower|bird|heart|hand|eye|face|smile|tear|blood|knife|gun|crown|ring|key|lock|chain|bridge|train|plane|boat|ship|bicycle)\b/gi
  ];
  
  const matches = new Set<string>();
  concretePatterns.forEach(pattern => {
    const found = lyrics.match(pattern) || [];
    found.forEach(m => matches.add(m.toLowerCase()));
  });
  
  return Array.from(matches);
}

function getImageryExplanation(count: number): string {
  if (count < 4) return "Abstract style - consider adding more concrete imagery";
  if (count < 7) return "Good balance of concrete and abstract imagery";
  if (count < 10) return "Rich visual landscape - above average for hit songs";
  return "Highly immersive storytelling with vivid imagery";
}

function detectMetaphors(lyrics: string): string[] {
  // Look for section headers mentioning specific metaphors
  const metaphors: string[] = [];
  const lines = lyrics.split('\n');
  
  lines.forEach(line => {
    if (line.includes('metaphor') || line.includes('like') || line.includes('as')) {
      metaphors.push(line.trim());
    }
  });
  
  return metaphors;
}

function analyzeStructure(lyrics: string): { format: string; explanation: string } {
  const sections = lyrics.split('\n').filter(l => l.startsWith('[')).map(l => {
    const match = l.match(/\[(.*?)\]/);
    return match ? match[1].split('–')[0].trim() : '';
  });
  
  const hasVerse = sections.some(s => s.includes('Verse'));
  const hasChorus = sections.some(s => s.includes('Chorus'));
  const hasBridge = sections.some(s => s.includes('Bridge'));
  
  if (hasVerse && hasChorus && hasBridge) {
    return {
      format: 'V-C-V-C-B-C',
      explanation: 'Classic pop structure - proven commercial format'
    };
  } else if (hasVerse && hasChorus) {
    return {
      format: 'V-C-V-C',
      explanation: 'Simple verse-chorus form - radio-friendly'
    };
  }
  
  return {
    format: 'Custom',
    explanation: `${sections.length} unique sections`
  };
}

function analyzeRepetition(lyrics: string): { hookLine: string | null; count: number } {
  const lines = lyrics.split('\n').filter(l => l.trim() && !l.startsWith('['));
  const lineCounts = new Map<string, number>();
  
  lines.forEach(line => {
    const clean = line.trim().toLowerCase();
    if (clean.length > 10) { // Only count substantial lines
      lineCounts.set(clean, (lineCounts.get(clean) || 0) + 1);
    }
  });
  
  let maxCount = 0;
  let hookLine: string | null = null;
  
  lineCounts.forEach((count, line) => {
    if (count > maxCount && count >= 2) {
      maxCount = count;
      hookLine = line;
    }
  });
  
  return { hookLine, count: maxCount };
}

function analyzeEnergyArc(lyrics: string): { hasDynamicRange: boolean; range: number } {
  const energyLevels = new Set<number>();
  const sections = lyrics.split('\n').filter(l => l.startsWith('['));
  
  sections.forEach(section => {
    const match = section.match(/(\d+)\/10/);
    if (match) {
      energyLevels.add(parseInt(match[1]));
    }
  });
  
  const range = energyLevels.size;
  return {
    hasDynamicRange: range >= 3,
    range
  };
}

function getRandomProTip(song: GeneratedSong): string {
  const tips = [
    "Songs with 3-4 word titles chart 2x higher on Billboard",
    "The bridge should offer a new perspective or realization",
    "Professional songwriters use 'furniture' (concrete objects) to ground emotions",
    "Slant rhymes (near rhymes) sound more sophisticated than perfect rhymes",
    "Open vowels (A, O, I) at line endings make songs easier to sing powerfully",
    "The most memorable songs repeat their hook 3-4 times",
    "Commercial hits average 200-300 words total",
    "Energy should build throughout the song, peaking at the final chorus"
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}

export default SongInsightsPanel;
