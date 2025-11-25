/**
 * STRUCTURAL SCAN SERVICE (v5 Architecture)
 * 
 * Purpose: Gather STRUCTURAL DATA about a song - NO SCORING
 * 
 * This replaces the scoring portion of base analysis.
 * Scoring is now handled ONLY by the Analyst Agent (PhD Musicologist).
 * 
 * Outputs:
 * - DNA Match (similar song comparison)
 * - Structure Map (verse, chorus, bridge detection)
 * - Syllable Counts (programmatic)
 * - Rhyme Scheme Detection
 * 
 * @see BOARD_DIRECTIVE_v5_FINAL.md for architecture
 */

import { GoogleGenAI, Type, Schema } from "@google/genai";

// @ts-ignore - Vite env types
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface DNAMatch {
  songTitle: string;
  artist: string;
  matchPercentage: number;
  structuralLessons: string[];
  thematicParallels: string[];
  whyItMatches: string;
}

export interface SongSection {
  type: 'verse' | 'chorus' | 'bridge' | 'pre-chorus' | 'outro' | 'intro' | 'hook' | 'breakdown';
  startLine: number;
  endLine: number;
  lines: string[];
  label?: string; // e.g., "Verse 1", "Chorus"
}

export interface StructureMap {
  sections: SongSection[];
  format: string; // e.g., "V-C-V-C-B-C"
  totalLines: number;
  hasIntro: boolean;
  hasOutro: boolean;
  hasBridge: boolean;
}

export interface SyllableAnalysis {
  perLine: number[];
  averagePerLine: number;
  variance: number;
  densestSection: string;
  sparsestSection: string;
}

export interface RhymePair {
  line1: number;
  line2: number;
  word1: string;
  word2: string;
  rhymeType: 'perfect' | 'slant' | 'assonance' | 'none';
}

export interface RhymeScheme {
  pattern: string; // e.g., "ABAB CDCD EFEF"
  rhymePairs: RhymePair[];
  internalRhymes: Array<{ line: number; words: string[] }>;
}

export interface StructuralScanResult {
  dnaMatch: DNAMatch;
  structure: StructureMap;
  syllables: SyllableAnalysis;
  rhymeScheme: RhymeScheme;
  
  // Metadata
  scanTime: number; // ms
  modelUsed: string;
  
  // ❌ NO SCORING - Analyst does this
}

// ============================================================
// SCHEMA FOR GEMINI RESPONSE
// ============================================================

const STRUCTURAL_SCAN_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    dnaMatch: {
      type: Type.OBJECT,
      properties: {
        songTitle: { type: Type.STRING, description: "Title of the matching hit song" },
        artist: { type: Type.STRING, description: "Artist of the matching song" },
        matchPercentage: { type: Type.NUMBER, description: "How similar (0-100)" },
        structuralLessons: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "What structural techniques this reference uses that could apply"
        },
        thematicParallels: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Similar themes or emotional arcs"
        },
        whyItMatches: { type: Type.STRING, description: "Brief explanation of why this song is the best match" }
      },
      required: ["songTitle", "artist", "matchPercentage", "structuralLessons", "whyItMatches"]
    },
    structure: {
      type: Type.OBJECT,
      properties: {
        sections: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { 
                type: Type.STRING, 
                enum: ["verse", "chorus", "bridge", "pre-chorus", "outro", "intro", "hook", "breakdown"]
              },
              startLine: { type: Type.NUMBER },
              endLine: { type: Type.NUMBER },
              label: { type: Type.STRING }
            },
            required: ["type", "startLine", "endLine"]
          }
        },
        format: { type: Type.STRING, description: "Section format like V-C-V-C-B-C" },
        totalLines: { type: Type.NUMBER },
        hasIntro: { type: Type.BOOLEAN },
        hasOutro: { type: Type.BOOLEAN },
        hasBridge: { type: Type.BOOLEAN }
      },
      required: ["sections", "format", "totalLines"]
    },
    rhymeScheme: {
      type: Type.OBJECT,
      properties: {
        pattern: { type: Type.STRING, description: "Rhyme pattern like ABAB CDCD" },
        rhymePairs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              line1: { type: Type.NUMBER },
              line2: { type: Type.NUMBER },
              word1: { type: Type.STRING },
              word2: { type: Type.STRING },
              rhymeType: { type: Type.STRING, enum: ["perfect", "slant", "assonance", "none"] }
            }
          }
        }
      },
      required: ["pattern", "rhymePairs"]
    }
  },
  required: ["dnaMatch", "structure", "rhymeScheme"]
};

// ============================================================
// PROGRAMMATIC SYLLABLE COUNTING
// ============================================================

/**
 * Count syllables in a word using vowel groups.
 * This is an approximation but works well for English.
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length === 0) return 0;
  if (word.length <= 3) return 1;
  
  // Count vowel groups
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const vowelMatches = word.match(/[aeiouy]{1,2}/g);
  return vowelMatches ? vowelMatches.length : 1;
}

/**
 * Count syllables per line in lyrics.
 * Programmatic - no AI needed.
 */
function analyzeSyllables(lyrics: string): SyllableAnalysis {
  const lines = lyrics.split('\n').filter(line => {
    const trimmed = line.trim();
    // Skip empty lines and metatags like [Verse 1]
    return trimmed.length > 0 && !trimmed.startsWith('[');
  });
  
  const perLine: number[] = lines.map(line => {
    const words = line.split(/\s+/).filter(w => w.length > 0);
    return words.reduce((sum, word) => sum + countSyllables(word), 0);
  });
  
  const total = perLine.reduce((a, b) => a + b, 0);
  const averagePerLine = perLine.length > 0 ? total / perLine.length : 0;
  
  // Calculate variance
  const squaredDiffs = perLine.map(count => Math.pow(count - averagePerLine, 2));
  const variance = squaredDiffs.length > 0 
    ? squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length 
    : 0;
  
  return {
    perLine,
    averagePerLine: Math.round(averagePerLine * 10) / 10,
    variance: Math.round(variance * 10) / 10,
    densestSection: 'TBD', // Will be filled by AI analysis
    sparsestSection: 'TBD'
  };
}

// ============================================================
// MAIN FUNCTION
// ============================================================

/**
 * Perform structural scan on lyrics.
 * 
 * This is Step 2 in the v5 architecture.
 * 
 * @param lyrics - The song lyrics to analyze
 * @param style - Genre/style information (for DNA matching)
 * @param title - Song title (for context)
 * @returns StructuralScanResult - Data only, NO scores
 */
export async function performStructuralScan(
  lyrics: string,
  style: string,
  title: string
): Promise<StructuralScanResult> {
  const startTime = Date.now();
  
  console.log('🔍 Starting structural scan (no scoring)...');
  
  // 1. Programmatic syllable analysis (instant, no API call)
  const syllableAnalysis = analyzeSyllables(lyrics);
  console.log(`  📊 Syllable analysis complete: avg ${syllableAnalysis.averagePerLine} per line`);
  
  // 2. AI-powered structure + DNA analysis (Gemini Flash for speed)
  const prompt = `You are a structural analyst. Analyze these lyrics for STRUCTURE ONLY.

## INSTRUCTIONS
- DO NOT SCORE the song
- DO NOT evaluate quality
- Just identify STRUCTURAL elements

## SONG INFO
Title: ${title}
Style: ${style}

## LYRICS
${lyrics}

## YOUR TASKS

### 1. DNA MATCH
Find ONE real-world hit song that is STRUCTURALLY similar:
- Similar section layout (verse/chorus pattern)
- Similar line lengths and rhythmic approach
- Similar genre/vibe
- Commercially successful (Billboard, Grammy, culturally significant)

Explain WHY it matches structurally (not just thematically).

### 2. STRUCTURE MAP
Identify each section:
- Verse, Chorus, Bridge, Pre-Chorus, Intro, Outro, etc.
- Start and end line numbers for each
- Overall format (e.g., "V-C-V-C-B-C")

Note: Line numbers are 1-indexed. Lines starting with [ are metatags and should be included in the section but indicate section starts.

### 3. RHYME SCHEME
- Identify the rhyme pattern (ABAB, AABB, etc.)
- List which lines rhyme with which
- Note the ending words that rhyme
- Classify rhymes as perfect, slant, or assonance

## OUTPUT
Return ONLY valid JSON matching the schema. No commentary.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: STRUCTURAL_SCAN_SCHEMA,
        systemInstruction: "You are a structural analyst. Provide data only, no quality judgments. Be precise with line numbers.",
        temperature: 0.3, // Low temperature for consistency
      }
    });
    
    if (!response.text) {
      throw new Error("Empty response from structural scan");
    }
    
    const aiResult = JSON.parse(response.text);
    
    // Extract lines for each section
    const lyricsLines = lyrics.split('\n');
    const sectionsWithLines: SongSection[] = aiResult.structure.sections.map((section: any) => ({
      ...section,
      lines: lyricsLines.slice(section.startLine - 1, section.endLine)
    }));
    
    // Determine densest/sparsest sections based on syllable counts
    if (sectionsWithLines.length > 0) {
      const sectionDensities = sectionsWithLines.map(section => {
        const sectionSyllables = syllableAnalysis.perLine.slice(section.startLine - 1, section.endLine);
        const avg = sectionSyllables.length > 0 
          ? sectionSyllables.reduce((a, b) => a + b, 0) / sectionSyllables.length 
          : 0;
        return { label: section.label || section.type, avg };
      });
      
      const sorted = [...sectionDensities].sort((a, b) => b.avg - a.avg);
      syllableAnalysis.densestSection = sorted[0]?.label || 'Unknown';
      syllableAnalysis.sparsestSection = sorted[sorted.length - 1]?.label || 'Unknown';
    }
    
    const scanTime = Date.now() - startTime;
    console.log(`✅ Structural scan complete in ${scanTime}ms`);
    
    return {
      dnaMatch: aiResult.dnaMatch,
      structure: {
        ...aiResult.structure,
        sections: sectionsWithLines
      },
      syllables: syllableAnalysis,
      rhymeScheme: aiResult.rhymeScheme || { pattern: 'Unknown', rhymePairs: [], internalRhymes: [] },
      scanTime,
      modelUsed: 'gemini-2.0-flash'
    };
    
  } catch (error) {
    console.error('❌ Structural scan failed:', error);
    
    // Return minimal result on failure
    return {
      dnaMatch: {
        songTitle: 'Unknown',
        artist: 'Unknown',
        matchPercentage: 0,
        structuralLessons: [],
        thematicParallels: [],
        whyItMatches: 'Analysis failed'
      },
      structure: {
        sections: [],
        format: 'Unknown',
        totalLines: lyrics.split('\n').length,
        hasIntro: false,
        hasOutro: false,
        hasBridge: false
      },
      syllables: syllableAnalysis,
      rhymeScheme: {
        pattern: 'Unknown',
        rhymePairs: [],
        internalRhymes: []
      },
      scanTime: Date.now() - startTime,
      modelUsed: 'gemini-2.0-flash'
    };
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Get rhyme dependency groups from rhyme scheme.
 * Lines that rhyme together must be changed together in rewrites.
 */
export function getRhymeDependencyGroups(rhymeScheme: RhymeScheme): number[][] {
  const groups: number[][] = [];
  const processed = new Set<number>();
  
  for (const pair of rhymeScheme.rhymePairs) {
    if (pair.rhymeType === 'perfect' || pair.rhymeType === 'slant') {
      // Find or create group for these lines
      const existingGroup = groups.find(g => g.includes(pair.line1) || g.includes(pair.line2));
      
      if (existingGroup) {
        if (!existingGroup.includes(pair.line1)) existingGroup.push(pair.line1);
        if (!existingGroup.includes(pair.line2)) existingGroup.push(pair.line2);
      } else if (!processed.has(pair.line1) && !processed.has(pair.line2)) {
        groups.push([pair.line1, pair.line2]);
      }
      
      processed.add(pair.line1);
      processed.add(pair.line2);
    }
  }
  
  return groups;
}

/**
 * Format structure for display.
 */
export function formatStructure(structure: StructureMap): string {
  return structure.sections
    .map(s => `${s.label || s.type.toUpperCase()} (lines ${s.startLine}-${s.endLine})`)
    .join(' → ');
}

// ============================================================
// EXPORTS
// ============================================================

// Types are already exported at definition via 'export interface'
// Main functions exported above
