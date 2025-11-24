import { SongAnalysis } from '../types';

// Detect breath points in lyrics
export interface BreathPoint {
  lineNumber: number;
  position: 'start' | 'middle' | 'end';
  syllableCount: number;
  breathability: 'easy' | 'moderate' | 'difficult';
  reason: string;
}

// Imagery highlight data
export interface ImageryHighlight {
  lineNumber: number;
  text: string;
  sensoryType: 'visual' | 'auditory' | 'tactile' | 'olfactory' | 'gustatory' | 'emotional';
  intensity: number; // 0-10
  words: string[];
}

// Narrative arc progression
export interface NarrativeArcPoint {
  sectionName: string;
  sectionType: 'verse' | 'chorus' | 'bridge' | 'pre-chorus' | 'outro' | 'intro' | 'other';
  lineRange: [number, number];
  arcStage: 'setup' | 'rising-action' | 'climax' | 'falling-action' | 'resolution';
  emotionalIntensity: number; // 0-10
  thematicFocus: string;
}

// Energy curve data point
export interface EnergyCurvePoint {
  lineNumber: number;
  energy: number; // 0-10
  factors: {
    syllableDensity: number;
    punctuationImpact: number;
    wordIntensity: number;
    structuralPosition: number;
  };
}

// Analyze breath points
export function analyzeBreathPoints(lyrics: string): BreathPoint[] {
  const lines = lyrics.split('\n').filter(l => l.trim().length > 0);
  const breathPoints: BreathPoint[] = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    
    // Skip section headers
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      return;
    }

    // Count syllables (rough estimate)
    const syllableCount = estimateSyllables(trimmed);
    
    // Detect natural breath points
    const hasComma = trimmed.includes(',');
    const hasDash = trimmed.includes('—') || trimmed.includes(' - ');
    const hasEllipsis = trimmed.includes('...');
    const hasParenthetical = trimmed.includes('(');
    
    // Start of line breath
    breathPoints.push({
      lineNumber,
      position: 'start',
      syllableCount,
      breathability: syllableCount < 10 ? 'easy' : syllableCount < 15 ? 'moderate' : 'difficult',
      reason: syllableCount > 15 ? 'Long line - consider breaking' : 'Natural line start'
    });

    // Middle breath points
    if (hasComma || hasDash || hasEllipsis || hasParenthetical) {
      breathPoints.push({
        lineNumber,
        position: 'middle',
        syllableCount,
        breathability: 'easy',
        reason: 'Natural pause from punctuation'
      });
    }

    // End of line breath (if no continuation punctuation)
    const endsWithContinuation = trimmed.endsWith(',') || trimmed.endsWith('—');
    if (!endsWithContinuation) {
      breathPoints.push({
        lineNumber,
        position: 'end',
        syllableCount,
        breathability: 'easy',
        reason: 'Line ending - natural breath'
      });
    }
  });

  return breathPoints;
}

// Extract imagery highlights
export function extractImageryHighlights(lyrics: string): ImageryHighlight[] {
  const lines = lyrics.split('\n');
  const highlights: ImageryHighlight[] = [];

  // Sensory word database (simplified - expand as needed)
  const sensoryWords = {
    visual: ['see', 'look', 'bright', 'dark', 'color', 'shadow', 'light', 'gleam', 'shimmer', 'fade', 'crimson', 'golden', 'pale', 'glowing'],
    auditory: ['hear', 'sound', 'whisper', 'shout', 'echo', 'silence', 'loud', 'quiet', 'ring', 'hum', 'crash', 'thunder', 'voice'],
    tactile: ['feel', 'touch', 'rough', 'smooth', 'cold', 'hot', 'warm', 'soft', 'hard', 'sharp', 'gentle', 'tender'],
    olfactory: ['smell', 'scent', 'perfume', 'fragrance', 'stench', 'aroma', 'fresh', 'musty'],
    gustatory: ['taste', 'sweet', 'bitter', 'sour', 'salty', 'flavor', 'delicious'],
    emotional: ['burning', 'aching', 'drowning', 'soaring', 'breaking', 'melting', 'frozen', 'falling']
  };

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const lowerLine = line.toLowerCase();
    
    Object.entries(sensoryWords).forEach(([type, words]) => {
      const foundWords = words.filter(word => lowerLine.includes(word));
      
      if (foundWords.length > 0) {
        highlights.push({
          lineNumber,
          text: line.trim(),
          sensoryType: type as any,
          intensity: Math.min(10, foundWords.length * 3),
          words: foundWords
        });
      }
    });
  });

  return highlights;
}

// Build narrative arc progression
export function buildNarrativeArc(lyrics: string): NarrativeArcPoint[] {
  const lines = lyrics.split('\n');
  const arcPoints: NarrativeArcPoint[] = [];
  let currentSection: { name: string; type: NarrativeArcPoint['sectionType']; startLine: number } = { 
    name: 'Unknown', 
    type: 'other', 
    startLine: 1 
  };
  let lineNumber = 1;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Detect section markers
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      // Save previous section
      if (index > 0) {
        const sectionLines = index - currentSection.startLine + 1;
        const arcStage = determineArcStage(currentSection.name, sectionLines, lines.length);
        const intensity = calculateEmotionalIntensity(
          lines.slice(currentSection.startLine - 1, index).join(' ')
        );
        
        arcPoints.push({
          sectionName: currentSection.name,
          sectionType: currentSection.type,
          lineRange: [currentSection.startLine, lineNumber - 1],
          arcStage,
          emotionalIntensity: intensity,
          thematicFocus: extractTheme(lines.slice(currentSection.startLine - 1, index).join(' '))
        });
      }
      
      // Start new section
      const sectionName = trimmed.slice(1, -1);
      currentSection = {
        name: sectionName,
        type: determineSectionType(sectionName),
        startLine: lineNumber + 1
      };
    }
    
    lineNumber++;
  });

  // Add final section
  if (currentSection.startLine < lines.length) {
    const arcStage = determineArcStage(currentSection.name, lines.length - currentSection.startLine + 1, lines.length);
    const intensity = calculateEmotionalIntensity(
      lines.slice(currentSection.startLine - 1).join(' ')
    );
    
    arcPoints.push({
      sectionName: currentSection.name,
      sectionType: currentSection.type,
      lineRange: [currentSection.startLine, lines.length],
      arcStage,
      emotionalIntensity: intensity,
      thematicFocus: extractTheme(lines.slice(currentSection.startLine - 1).join(' '))
    });
  }

  return arcPoints;
}

// Calculate energy curve
export function calculateEnergyCurve(lyrics: string): EnergyCurvePoint[] {
  const lines = lyrics.split('\n').filter(l => l.trim().length > 0 && !l.trim().startsWith('['));
  const curve: EnergyCurvePoint[] = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    
    // Calculate factors
    const syllableDensity = estimateSyllables(trimmed) / Math.max(trimmed.length, 1) * 10;
    const punctuationImpact = (trimmed.match(/[!?]/g) || []).length * 2;
    const wordIntensity = calculateWordIntensity(trimmed);
    const structuralPosition = (lineNumber / lines.length) * 10;
    
    const energy = Math.min(10, (
      syllableDensity * 0.3 +
      punctuationImpact * 0.2 +
      wordIntensity * 0.4 +
      structuralPosition * 0.1
    ));

    curve.push({
      lineNumber,
      energy: Math.round(energy * 10) / 10,
      factors: {
        syllableDensity: Math.round(syllableDensity * 10) / 10,
        punctuationImpact,
        wordIntensity: Math.round(wordIntensity * 10) / 10,
        structuralPosition: Math.round(structuralPosition * 10) / 10
      }
    });
  });

  return curve;
}

// Helper: Estimate syllables
function estimateSyllables(text: string): number {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 0);
  return words.reduce((count, word) => {
    const matches = word.match(/[aeiouy]{1,2}/g);
    return count + (matches ? matches.length : 1);
  }, 0);
}

// Helper: Determine section type
function determineSectionType(sectionName: string): NarrativeArcPoint['sectionType'] {
  const lower = sectionName.toLowerCase();
  if (lower.includes('verse')) return 'verse';
  if (lower.includes('chorus') || lower.includes('hook')) return 'chorus';
  if (lower.includes('bridge')) return 'bridge';
  if (lower.includes('pre')) return 'pre-chorus';
  if (lower.includes('intro')) return 'intro';
  if (lower.includes('outro')) return 'outro';
  return 'verse';
}

// Helper: Determine arc stage
function determineArcStage(sectionName: string, sectionLines: number, totalLines: number): NarrativeArcPoint['arcStage'] {
  const position = sectionLines / totalLines;
  const lower = sectionName.toLowerCase();
  
  if (lower.includes('intro') || lower.includes('verse 1') || position < 0.2) return 'setup';
  if (lower.includes('chorus') && position < 0.5) return 'rising-action';
  if (lower.includes('bridge') || lower.includes('breakdown')) return 'climax';
  if (lower.includes('chorus') && position > 0.7) return 'falling-action';
  if (lower.includes('outro') || position > 0.9) return 'resolution';
  
  return 'rising-action';
}

// Helper: Calculate emotional intensity
function calculateEmotionalIntensity(text: string): number {
  const intensityWords = ['never', 'always', 'forever', 'dying', 'burning', 'breaking', 'falling', 'screaming', 'crying', 'bleeding'];
  const lower = text.toLowerCase();
  const count = intensityWords.filter(word => lower.includes(word)).length;
  const exclamations = (text.match(/!/g) || []).length;
  
  return Math.min(10, count * 2 + exclamations);
}

// Helper: Calculate word intensity
function calculateWordIntensity(text: string): number {
  const highIntensityWords = ['explode', 'shatter', 'scream', 'bleed', 'die', 'burn', 'crash', 'thunder'];
  const lower = text.toLowerCase();
  return highIntensityWords.filter(word => lower.includes(word)).length * 2.5;
}

// Helper: Extract theme
function extractTheme(text: string): string {
  const lower = text.toLowerCase();
  
  if (lower.includes('love') || lower.includes('heart')) return 'Love & Connection';
  if (lower.includes('pain') || lower.includes('hurt')) return 'Pain & Loss';
  if (lower.includes('hope') || lower.includes('light')) return 'Hope & Redemption';
  if (lower.includes('dark') || lower.includes('shadow')) return 'Darkness & Struggle';
  if (lower.includes('free') || lower.includes('fly')) return 'Freedom & Liberation';
  if (lower.includes('memory') || lower.includes('past')) return 'Memory & Nostalgia';
  
  return 'General Emotion';
}
