import { SongAnalysis } from '../types';

// Syllable stress patterns
export type StressPattern = 'strong' | 'weak';

export interface SyllableStress {
  lineNumber: number;
  syllables: {
    text: string;
    stress: StressPattern;
    position: number; // Position in line
  }[];
  pattern: string; // e.g., "SW SW SW" (Strong-Weak-Strong-Weak-Strong-Weak)
  patternType: 'iambic' | 'trochaic' | 'anapestic' | 'dactylic' | 'mixed' | 'irregular';
}

// Consonant cluster analysis
export interface ConsonantCluster {
  lineNumber: number;
  clusters: {
    text: string; // e.g., "str", "thr", "scr"
    position: number;
    density: number; // 1-10 how difficult to pronounce
  }[];
  overallDensity: number; // Average density for the line
}

// Rhyme scheme
export interface RhymeScheme {
  sections: {
    sectionName: string;
    lineRange: [number, number];
    scheme: string; // e.g., "AABB", "ABAB", "ABCB"
    quality: 'perfect' | 'near' | 'assonance' | 'consonance' | 'none';
    patterns: {
      lineNumber: number;
      rhymeLetter: string;
      endWord: string;
      rhymesWith: number[]; // Line numbers it rhymes with
    }[];
  }[];
  overallPattern: string; // e.g., "Verse: ABAB, Chorus: AABB"
}

// Estimate syllable count and stress for a word
const estimateSyllableStress = (word: string): { count: number; pattern: StressPattern[] } => {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanWord) return { count: 0, pattern: [] };

  // Simple heuristic: count vowel groups
  const vowelGroups = cleanWord.match(/[aeiouy]+/g) || [];
  const count = vowelGroups.length || 1;

  // Basic stress pattern (first syllable usually stressed in English)
  const pattern: StressPattern[] = Array(count).fill('weak');
  if (count > 0) pattern[0] = 'strong';
  
  // Two-syllable words: often first stressed
  // Multi-syllable: alternating pattern (simplification)
  if (count > 2) {
    for (let i = 0; i < count; i += 2) {
      pattern[i] = 'strong';
    }
  }

  return { count, pattern };
};

// Determine metrical pattern type
const determineMetricalPattern = (stresses: StressPattern[]): SyllableStress['patternType'] => {
  const patternStr = stresses.join('');
  
  // Iambic: weak-strong (wS wS wS)
  if (/^(wS)+$/.test(patternStr)) return 'iambic';
  
  // Trochaic: strong-weak (Sw Sw Sw)
  if (/^(Sw)+$/.test(patternStr)) return 'trochaic';
  
  // Anapestic: weak-weak-strong (wwS wwS)
  if (/^(wwS)+$/.test(patternStr)) return 'anapestic';
  
  // Dactylic: strong-weak-weak (Sww Sww)
  if (/^(Sww)+$/.test(patternStr)) return 'dactylic';
  
  // Mixed: some regularity
  if (patternStr.length >= 6 && (
    patternStr.includes('wS') || patternStr.includes('Sw')
  )) return 'mixed';
  
  return 'irregular';
};

// Analyze syllable stress patterns
export function analyzeSyllableStress(lyrics: string): SyllableStress[] {
  const lines = lyrics.split('\n');
  const stressPatterns: SyllableStress[] = [];
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || (trimmed.startsWith('[') && trimmed.endsWith(']'))) return;
    
    const words = trimmed.split(/\s+/);
    const syllables: SyllableStress['syllables'] = [];
    const allStresses: StressPattern[] = [];
    
    let position = 0;
    words.forEach(word => {
      const { count, pattern } = estimateSyllableStress(word);
      
      // Split word into rough syllables
      for (let i = 0; i < count; i++) {
        syllables.push({
          text: i === 0 ? word : '', // Only show word on first syllable
          stress: pattern[i],
          position: position++
        });
        allStresses.push(pattern[i]);
      }
    });
    
    const patternStr = allStresses.map(s => s === 'strong' ? 'S' : 'w').join('');
    const patternType = determineMetricalPattern(allStresses);
    
    stressPatterns.push({
      lineNumber: index + 1,
      syllables,
      pattern: patternStr,
      patternType
    });
  });
  
  return stressPatterns;
}

// Analyze consonant clusters
export function analyzeConsonantClusters(lyrics: string): ConsonantCluster[] {
  const lines = lyrics.split('\n');
  const clusters: ConsonantCluster[] = [];
  
  // Common difficult consonant clusters
  const difficultClusters = [
    { pattern: /spr|scr|str|thr/g, density: 9 },
    { pattern: /spl|squ|sch/g, density: 8 },
    { pattern: /pr|tr|br|dr|cr|gr|fr|pl|cl|bl|fl|gl|sl/g, density: 6 },
    { pattern: /st|sp|sk|sm|sn|sw/g, density: 5 },
    { pattern: /th|sh|ch|ph|wh/g, density: 3 }
  ];
  
  lines.forEach((line, index) => {
    const trimmed = line.trim().toLowerCase().replace(/[^a-z\s]/g, '');
    if (!trimmed || (line.trim().startsWith('[') && line.trim().endsWith(']'))) return;
    
    const foundClusters: ConsonantCluster['clusters'] = [];
    let totalDensity = 0;
    
    difficultClusters.forEach(({ pattern, density }) => {
      const matches = trimmed.matchAll(pattern);
      for (const match of matches) {
        if (match.index !== undefined) {
          foundClusters.push({
            text: match[0],
            position: match.index,
            density
          });
          totalDensity += density;
        }
      }
    });
    
    const overallDensity = foundClusters.length > 0 
      ? totalDensity / foundClusters.length 
      : 0;
    
    clusters.push({
      lineNumber: index + 1,
      clusters: foundClusters,
      overallDensity
    });
  });
  
  return clusters;
}

// Extract end word for rhyme detection
const getEndWord = (line: string): string => {
  const words = line.trim().toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  return words[words.length - 1] || '';
};

// Check if two words rhyme (simplified)
const doWordsRhyme = (word1: string, word2: string): { rhymes: boolean; quality: RhymeScheme['sections'][0]['quality'] } => {
  if (!word1 || !word2 || word1 === word2) return { rhymes: false, quality: 'none' };
  
  const end1 = word1.slice(-3);
  const end2 = word2.slice(-3);
  
  // Perfect rhyme: last 2+ chars match
  if (end1 === end2 || word1.slice(-2) === word2.slice(-2)) {
    return { rhymes: true, quality: 'perfect' };
  }
  
  // Near rhyme: last char matches
  if (word1.slice(-1) === word2.slice(-1)) {
    return { rhymes: true, quality: 'near' };
  }
  
  // Assonance: vowel sounds match
  const vowel1 = word1.match(/[aeiouy][^aeiouy]*$/)?.[0];
  const vowel2 = word2.match(/[aeiouy][^aeiouy]*$/)?.[0];
  if (vowel1 && vowel2 && vowel1[0] === vowel2[0]) {
    return { rhymes: true, quality: 'assonance' };
  }
  
  // Consonance: ending consonants match
  const cons1 = word1.match(/[^aeiouy]+$/)?.[0];
  const cons2 = word2.match(/[^aeiouy]+$/)?.[0];
  if (cons1 && cons2 && cons1 === cons2) {
    return { rhymes: true, quality: 'consonance' };
  }
  
  return { rhymes: false, quality: 'none' };
};

// Analyze rhyme scheme
export function analyzeRhymeScheme(lyrics: string): RhymeScheme {
  const lines = lyrics.split('\n');
  const sections: RhymeScheme['sections'] = [];
  let currentSection: { name: string; startLine: number; lines: { lineNumber: number; text: string }[] } | null = null;
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Section header
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      // Save previous section
      if (currentSection && currentSection.lines.length > 0) {
        sections.push(analyzeSection(currentSection));
      }
      
      // Start new section
      currentSection = {
        name: trimmed.slice(1, -1),
        startLine: index + 1,
        lines: []
      };
    } else if (trimmed && currentSection) {
      currentSection.lines.push({
        lineNumber: index + 1,
        text: trimmed
      });
    }
  });
  
  // Save last section
  if (currentSection && currentSection.lines.length > 0) {
    sections.push(analyzeSection(currentSection));
  }
  
  // Overall pattern summary
  const overallPattern = sections
    .map(s => `${s.sectionName}: ${s.scheme}`)
    .join(', ');
  
  return {
    sections,
    overallPattern
  };
}

// Analyze a single section's rhyme scheme
function analyzeSection(section: { name: string; startLine: number; lines: { lineNumber: number; text: string }[] }): RhymeScheme['sections'][0] {
  const endWords = section.lines.map(l => getEndWord(l.text));
  const rhymeLetters: string[] = [];
  const rhymeGroups: Map<string, number[]> = new Map();
  let nextLetter = 65; // 'A'
  
  // Assign rhyme letters
  endWords.forEach((word, idx) => {
    let assigned = false;
    
    // Check if it rhymes with previous lines
    for (let i = 0; i < idx; i++) {
      const { rhymes } = doWordsRhyme(endWords[i], word);
      if (rhymes) {
        rhymeLetters[idx] = rhymeLetters[i];
        assigned = true;
        break;
      }
    }
    
    // Assign new letter
    if (!assigned) {
      rhymeLetters[idx] = String.fromCharCode(nextLetter++);
    }
    
    // Track rhyme groups
    const letter = rhymeLetters[idx];
    if (!rhymeGroups.has(letter)) {
      rhymeGroups.set(letter, []);
    }
    rhymeGroups.get(letter)!.push(section.lines[idx].lineNumber);
  });
  
  const scheme = rhymeLetters.join('');
  
  // Determine overall quality
  let quality: RhymeScheme['sections'][0]['quality'] = 'none';
  const rhymeQualities: RhymeScheme['sections'][0]['quality'][] = [];
  
  for (let i = 0; i < endWords.length; i++) {
    for (let j = i + 1; j < endWords.length; j++) {
      if (rhymeLetters[i] === rhymeLetters[j]) {
        const { quality: q } = doWordsRhyme(endWords[i], endWords[j]);
        rhymeQualities.push(q);
      }
    }
  }
  
  // Pick best quality
  if (rhymeQualities.includes('perfect')) quality = 'perfect';
  else if (rhymeQualities.includes('near')) quality = 'near';
  else if (rhymeQualities.includes('assonance')) quality = 'assonance';
  else if (rhymeQualities.includes('consonance')) quality = 'consonance';
  
  // Build patterns array
  const patterns = section.lines.map((line, idx) => ({
    lineNumber: line.lineNumber,
    rhymeLetter: rhymeLetters[idx],
    endWord: endWords[idx],
    rhymesWith: rhymeGroups.get(rhymeLetters[idx])!.filter(n => n !== line.lineNumber)
  }));
  
  return {
    sectionName: section.name,
    lineRange: [section.startLine, section.lines[section.lines.length - 1].lineNumber],
    scheme,
    quality,
    patterns
  };
}
