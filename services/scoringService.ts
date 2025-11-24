/**
 * SCORING UTILITIES SERVICE
 * Programmatic scoring functions for quantifiable metrics
 * Used to augment AI analysis with precise measurements
 */

import { SENSORY_DATABASE, getSensoryWord, SensoryWord } from './sensoryWordDatabase';

/**
 * Calculate Hook Factor score (0-10)
 * Measures catchiness and memorability based on:
 * - Title repetition in lyrics
 * - Chorus repetition frequency
 * - Syllable simplicity (easier to remember)
 * - Early hook placement
 */
export function calculateHookFactor(
  lyrics: string,
  title: string
): { score: number; breakdown: string; suggestions: string[] } {
  const lines = lyrics.split('\n').filter(l => l.trim());
  const lowerLyrics = lyrics.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  let score = 0;
  const reasons: string[] = [];
  const suggestions: string[] = [];
  
  // 1. Title Repetition (0-3 points)
  const titleOccurrences = (lowerLyrics.match(new RegExp(lowerTitle, 'g')) || []).length;
  if (titleOccurrences >= 4) {
    score += 3;
    reasons.push(`Title appears ${titleOccurrences}x (excellent repetition)`);
  } else if (titleOccurrences >= 2) {
    score += 2;
    reasons.push(`Title appears ${titleOccurrences}x (good repetition)`);
  } else if (titleOccurrences === 1) {
    score += 1;
    reasons.push(`Title appears only 1x (weak hook)`);
    suggestions.push('Repeat title in chorus for stronger hook');
  } else {
    reasons.push('Title not found in lyrics (missing hook)');
    suggestions.push('Include song title as primary hook phrase');
  }
  
  // 2. Chorus Identification & Repetition (0-3 points)
  const chorusMatches = lyrics.match(/\[Chorus\]/gi) || [];
  const chorusCount = chorusMatches.length;
  if (chorusCount >= 3) {
    score += 3;
    reasons.push(`${chorusCount} chorus sections (strong repetition)`);
  } else if (chorusCount === 2) {
    score += 2;
    reasons.push(`${chorusCount} chorus sections (adequate)`);
    suggestions.push('Add 3rd chorus for commercial appeal');
  } else if (chorusCount === 1) {
    score += 1;
    reasons.push('Only 1 chorus (weak structure)');
    suggestions.push('Repeat chorus at least 3 times');
  } else {
    reasons.push('No labeled chorus sections');
    suggestions.push('Define clear chorus with hook phrase');
  }
  
  // 3. Syllable Simplicity (0-2 points)
  const words = lyrics.split(/\s+/).filter(w => w.length > 0);
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  // Rough syllable estimate: 1 syllable per 3 chars on average
  const avgSyllables = avgWordLength / 3;
  if (avgSyllables <= 1.5) {
    score += 2;
    reasons.push('Simple, memorable words (1-2 syllables avg)');
  } else if (avgSyllables <= 2) {
    score += 1;
    reasons.push('Moderate word complexity');
  } else {
    reasons.push('Complex words (harder to remember)');
    suggestions.push('Use simpler 1-2 syllable words in hook');
  }
  
  // 4. Early Hook Placement (0-2 points)
  const firstTitleIndex = lowerLyrics.indexOf(lowerTitle);
  const lyricsLength = lyrics.length;
  if (firstTitleIndex >= 0 && firstTitleIndex < lyricsLength * 0.25) {
    score += 2;
    reasons.push('Hook appears in first 25% (immediate impact)');
  } else if (firstTitleIndex >= 0 && firstTitleIndex < lyricsLength * 0.5) {
    score += 1;
    reasons.push('Hook appears before midpoint');
  } else {
    reasons.push('Hook delayed (late introduction)');
    suggestions.push('Move hook to first verse or chorus');
  }
  
  const breakdown = reasons.join('; ');
  return { score: Math.min(10, score), breakdown, suggestions };
}

/**
 * Calculate Vocal Playability score (0-10)
 * Measures singability based on:
 * - Breath point frequency (punctuation, line breaks)
 * - Syllable density between breaths
 * - Consonant cluster difficulty
 * - Genre-specific thresholds
 */
export function calculateVocalPlayability(
  lyrics: string,
  genre: string
): { score: number; breakdown: string; suggestions: string[]; breathMarkers: number[] } {
  const lines = lyrics.split('\n').filter(l => l.trim());
  
  let score = 10; // Start at perfect, deduct for issues
  const reasons: string[] = [];
  const suggestions: string[] = [];
  const breathMarkers: number[] = []; // Line numbers needing breath
  
  // Genre-specific syllable thresholds (max between breaths)
  const thresholds: Record<string, number> = {
    'pop': 12,
    'rock': 15,
    'hiphop': 20,
    'rap': 20,
    'edm': 10,
    'electronic': 10,
    'country': 14,
    'folk': 14,
    'rnb': 13,
    'soul': 13,
    'indie': 14,
    'metal': 18,
    'jazz': 12,
    'acoustic': 12
  };
  
  const maxSyllables = thresholds[genre.toLowerCase()] || 15;
  
  let totalBreathIssues = 0;
  let totalConsonantClusters = 0;
  
  lines.forEach((line, idx) => {
    if (!line.trim() || line.startsWith('[')) return; // Skip empty/labels
    
    // Check for natural breath points
    const hasBreathPoint = /[,;.!?\-]/.test(line);
    
    // Estimate syllables (rough: count vowel groups)
    const syllables = (line.match(/[aeiouy]+/gi) || []).length;
    
    // Check consonant clusters (3+ consonants in a row)
    const consonantClusters = (line.match(/[bcdfghjklmnpqrstvwxyz]{3,}/gi) || []).length;
    
    if (syllables > maxSyllables) {
      totalBreathIssues++;
      breathMarkers.push(idx);
      score -= 0.5;
      if (totalBreathIssues === 1) {
        reasons.push(`${totalBreathIssues} line exceeds ${maxSyllables} syllables (breath issue)`);
        suggestions.push(`Add punctuation or split line ${idx + 1} (${syllables} syllables)`);
      }
    }
    
    if (consonantClusters > 0) {
      totalConsonantClusters += consonantClusters;
      score -= 0.3 * consonantClusters;
    }
  });
  
  // Final reasoning
  if (totalBreathIssues === 0) {
    reasons.push(`All lines within ${maxSyllables} syllable limit (excellent pacing)`);
  } else if (totalBreathIssues <= 2) {
    reasons.push(`${totalBreathIssues} lines need breath points (minor issue)`);
  } else {
    reasons.push(`${totalBreathIssues} lines exceed breath capacity (${maxSyllables} syl limit)`);
    suggestions.push(`${genre} genre: aim for max ${maxSyllables} syllables between breaths`);
  }
  
  if (totalConsonantClusters > 0) {
    reasons.push(`${totalConsonantClusters} difficult consonant clusters`);
    suggestions.push('Replace tongue-twisting consonant groups with smoother sounds');
  } else {
    reasons.push('No difficult consonant clusters (smooth delivery)');
  }
  
  const breakdown = reasons.join('; ');
  return { 
    score: Math.max(0, Math.min(10, Math.round(score * 10) / 10)), 
    breakdown, 
    suggestions,
    breathMarkers 
  };
}

/**
 * Calculate Imagery & Sensory Detail score (0-10)
 * Measures concrete vs abstract language using comprehensive sensory word database
 * 
 * Scoring criteria:
 * - Sensory word density (per 10 lines)
 * - Sense variety (using 5+ different senses = excellent)
 * - Intensity distribution (vivid words score higher)
 * - Genre-appropriate expectations
 */
export function calculateImagerySensory(lyrics: string): { score: number; breakdown: string } {
  const lines = lyrics.split('\n').filter(l => l.trim() && !l.trim().startsWith('['));
  const words = lyrics.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  // Track detected sensory words
  const detectedWords: SensoryWord[] = [];
  const senseCount = new Map<string, number>();
  let intensityScore = 0;
  
  // Detect sensory words from database
  words.forEach(word => {
    // Remove punctuation for matching
    const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
    const sensoryWord = getSensoryWord(cleanWord);
    
    if (sensoryWord) {
      detectedWords.push(sensoryWord);
      senseCount.set(sensoryWord.sense, (senseCount.get(sensoryWord.sense) || 0) + 1);
      
      // Weight by intensity
      if (sensoryWord.intensity === 'vivid') intensityScore += 3;
      else if (sensoryWord.intensity === 'moderate') intensityScore += 2;
      else intensityScore += 1;
    }
  });
  
  // Calculate metrics
  const totalSensoryWords = detectedWords.length;
  const sensoryDensity = (totalSensoryWords / Math.max(lines.length, 1)) * 10; // per 10 lines
  const senseVariety = senseCount.size; // how many different senses used
  const avgIntensity = totalSensoryWords > 0 ? intensityScore / totalSensoryWords : 0;
  
  // Score calculation (0-10)
  let score = 0;
  const reasons: string[] = [];
  
  // 1. Density score (0-4 points)
  if (sensoryDensity >= 8) {
    score += 4;
    reasons.push(`Excellent density: ${sensoryDensity.toFixed(1)} sensory words per 10 lines`);
  } else if (sensoryDensity >= 5) {
    score += 3;
    reasons.push(`Good density: ${sensoryDensity.toFixed(1)} sensory words per 10 lines`);
  } else if (sensoryDensity >= 3) {
    score += 2;
    reasons.push(`Moderate density: ${sensoryDensity.toFixed(1)} sensory words per 10 lines`);
  } else if (sensoryDensity >= 1) {
    score += 1;
    reasons.push(`Low density: ${sensoryDensity.toFixed(1)} sensory words per 10 lines`);
  } else {
    reasons.push(`Very sparse imagery: ${sensoryDensity.toFixed(1)} sensory words per 10 lines`);
  }
  
  // 2. Sense variety score (0-3 points)
  if (senseVariety >= 5) {
    score += 3;
    reasons.push(`Excellent variety: ${senseVariety}/6 senses engaged`);
  } else if (senseVariety >= 3) {
    score += 2;
    reasons.push(`Good variety: ${senseVariety}/6 senses engaged`);
  } else if (senseVariety >= 2) {
    score += 1;
    reasons.push(`Limited variety: ${senseVariety}/6 senses engaged`);
  } else if (senseVariety === 1) {
    reasons.push(`Single sense: only ${Array.from(senseCount.keys())[0]} words used`);
  } else {
    reasons.push('No sensory language detected');
  }
  
  // 3. Intensity score (0-3 points)
  if (avgIntensity >= 2.5) {
    score += 3;
    reasons.push('Vivid, evocative imagery (high intensity words)');
  } else if (avgIntensity >= 2.0) {
    score += 2;
    reasons.push('Strong imagery (moderate-vivid words)');
  } else if (avgIntensity >= 1.5) {
    score += 1;
    reasons.push('Adequate imagery (mostly moderate words)');
  } else if (avgIntensity > 0) {
    reasons.push('Subtle imagery (low intensity words)');
  }
  
  // Sense distribution breakdown (for detailed feedback)
  const senseBreakdown: string[] = [];
  if (senseCount.get('visual')) senseBreakdown.push(`Visual: ${senseCount.get('visual')}`);
  if (senseCount.get('auditory')) senseBreakdown.push(`Auditory: ${senseCount.get('auditory')}`);
  if (senseCount.get('tactile')) senseBreakdown.push(`Tactile: ${senseCount.get('tactile')}`);
  if (senseCount.get('olfactory')) senseBreakdown.push(`Olfactory: ${senseCount.get('olfactory')}`);
  if (senseCount.get('gustatory')) senseBreakdown.push(`Gustatory: ${senseCount.get('gustatory')}`);
  if (senseCount.get('kinesthetic')) senseBreakdown.push(`Kinesthetic: ${senseCount.get('kinesthetic')}`);
  
  if (senseBreakdown.length > 0) {
    reasons.push(`Distribution: ${senseBreakdown.join(', ')}`);
  }
  
  const breakdown = reasons.join('; ');
  return { score: Math.min(10, score), breakdown };
}

/**
 * Calculate Narrative Arc score (0-10)
 * Measures story progression using sentiment analysis and temporal markers
 * 
 * Scoring criteria:
 * - Clear three-act structure (Setup → Conflict → Resolution)
 * - Emotional progression tracking
 * - Sentiment peaks and valleys
 * - Genre-appropriate arc shapes (Pop = high peak, Indie = can be flat)
 */
export function calculateNarrativeArc(lyrics: string): { score: number; breakdown: string } {
  const sections = lyrics.split(/\n/).filter(l => l.trim());
  
  // Sentiment word lists (expanded)
  const positiveWords = [
    'love', 'happy', 'joy', 'bright', 'hope', 'dream', 'free', 'smile', 'light', 'beautiful',
    'wonder', 'amazing', 'perfect', 'heaven', 'paradise', 'bliss', 'ecstasy', 'celebrate',
    'victorious', 'triumph', 'win', 'success', 'glory', 'radiant', 'golden', 'sunshine',
    'laughter', 'dancing', 'flying', 'soaring', 'alive', 'electric', 'magic', 'sparkling'
  ];
  
  const negativeWords = [
    'lost', 'dark', 'pain', 'broken', 'tear', 'cry', 'lonely', 'empty', 'fear', 'cold',
    'nightmare', 'shadow', 'scar', 'hurt', 'bleeding', 'dying', 'dead', 'grave', 'hell',
    'fallen', 'shattered', 'crushed', 'defeated', 'failure', 'trapped', 'prison', 'chains',
    'drowning', 'sinking', 'suffocating', 'numb', 'hollow', 'void', 'abyss', 'despair'
  ];
  
  const conflictWords = [
    'but', 'yet', 'however', 'though', 'still', 'never', 'can\'t', 'won\'t', 'don\'t',
    'against', 'versus', 'fight', 'battle', 'struggle', 'resist', 'challenge', 'question',
    'doubt', 'wondering', 'searching', 'trying', 'chase', 'running', 'escape', 'flee'
  ];
  
  const resolutionWords = [
    'now', 'finally', 'found', 'realize', 'understand', 'know', 'learned', 'changed',
    'become', 'transformed', 'healed', 'recovered', 'survived', 'overcome', 'resolved',
    'peace', 'calm', 'settled', 'accepting', 'embracing', 'letting go', 'moving on'
  ];
  
  const setupWords = [
    'once', 'when', 'first', 'began', 'started', 'remember', 'used to', 'back then',
    'yesterday', 'before', 'long ago', 'beginning', 'introduced', 'met', 'saw'
  ];
  
  const lowerLyrics = lyrics.toLowerCase();
  
  // Track sentiment by section
  const sentimentBySection: number[] = [];
  sections.forEach(line => {
    if (line.trim().startsWith('[')) return; // Skip structure labels
    
    const lowerLine = line.toLowerCase();
    let sentiment = 0;
    
    positiveWords.forEach(w => {
      if (lowerLine.includes(w)) sentiment += 1;
    });
    negativeWords.forEach(w => {
      if (lowerLine.includes(w)) sentiment -= 1;
    });
    
    sentimentBySection.push(sentiment);
  });
  
  // Detect narrative elements
  const hasSetup = setupWords.some(w => lowerLyrics.includes(w));
  const hasConflict = conflictWords.some(w => lowerLyrics.includes(w));
  const hasResolution = resolutionWords.some(w => lowerLyrics.includes(w));
  
  // Detect emotional progression
  const firstThird = sentimentBySection.slice(0, Math.floor(sentimentBySection.length / 3));
  const middleThird = sentimentBySection.slice(
    Math.floor(sentimentBySection.length / 3),
    Math.floor(sentimentBySection.length * 2 / 3)
  );
  const lastThird = sentimentBySection.slice(Math.floor(sentimentBySection.length * 2 / 3));
  
  const avgFirst = firstThird.reduce((a, b) => a + b, 0) / firstThird.length || 0;
  const avgMiddle = middleThird.reduce((a, b) => a + b, 0) / middleThird.length || 0;
  const avgLast = lastThird.reduce((a, b) => a + b, 0) / lastThird.length || 0;
  
  // Detect arc shape
  let arcShape = 'flat';
  if (avgMiddle < avgFirst && avgLast > avgMiddle) {
    arcShape = 'V-shape (conflict then resolution)';
  } else if (avgMiddle > avgFirst && avgMiddle > avgLast) {
    arcShape = 'peak (rise then fall)';
  } else if (avgMiddle < avgFirst && avgMiddle < avgLast) {
    arcShape = 'valley (fall then rise)';
  } else if (avgLast > avgFirst) {
    arcShape = 'ascending (hopeful)';
  } else if (avgLast < avgFirst) {
    arcShape = 'descending (tragic)';
  }
  
  // Calculate score
  let score = 0;
  const elements: string[] = [];
  
  // Three-act structure (0-6 points)
  if (hasSetup) { score += 2; elements.push('Setup'); }
  if (hasConflict) { score += 2; elements.push('Conflict'); }
  if (hasResolution) { score += 2; elements.push('Resolution'); }
  
  // Emotional arc detection (0-4 points)
  if (arcShape !== 'flat') {
    if (arcShape.includes('V-shape') || arcShape.includes('valley')) {
      score += 4; // Classic three-act arc
      elements.push(`Strong arc: ${arcShape}`);
    } else {
      score += 2;
      elements.push(`Emotional movement: ${arcShape}`);
    }
  } else {
    if (Math.abs(avgFirst) > 0.5 || Math.abs(avgMiddle) > 0.5 || Math.abs(avgLast) > 0.5) {
      score += 1; // At least there's emotion, even if flat
      elements.push('Consistent emotion (static arc)');
    } else {
      elements.push('Flat emotional arc');
    }
  }
  
  const breakdown = elements.length > 0
    ? `${elements.join(' → ')} (${score}/10)`
    : 'No clear narrative progression';
  
  return { score: Math.min(10, score), breakdown };
}
