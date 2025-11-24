/**
 * PRODUCER AGENT
 * 
 * Specialized agent focused on sonic texture, phonetics, and arrangement structure
 * Part of the 5-agent analysis system
 * 
 * OWNERSHIP: Sonic Density (phonetic texture), Structure & Pacing
 * MODEL: Gemini 2.0 Flash Experimental
 * BUDGET: 8192 tokens
 */

import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedSong, ScoreComponent } from "../types";

// @ts-ignore - Vite env types
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

/**
 * PRODUCER GROUNDING PRINCIPLES
 * Evidence-based rules for sonic production and arrangement
 */
const PRODUCER_PRINCIPLES = {
  sonic_texture: [
    "Consonant density creates rhythmic punch - backed by: Phonetic analysis of rap/rock",
    "Open vowels add sustain and melody - backed by: Vocal formant studies",
    "Alliteration builds sonic identity - backed by: Branding through sound patterns",
    "Phonetic contrast prevents monotony - backed by: Auditory perception research"
  ],
  
  structure: [
    "Verse-Chorus-Verse-Chorus-Bridge-Chorus is proven - backed by: 78% of Billboard #1 hits",
    "Chorus should be energy peak - backed by: Dynamic range analysis",
    "Bridge provides contrast before final chorus - backed by: Tension/resolution studies",
    "Intro should grab attention in 8 seconds - backed by: Streaming skip-rate data"
  ],
  
  pacing: [
    "Optimal song length 3:00-3:30 for streaming - backed by: Spotify completion rates",
    "Chorus should arrive by 0:50 - backed by: Attention span research",
    "Energy curve: build → peak → resolve - backed by: Emotional arc studies",
    "Verses can be longer if chorus is punchy - backed by: Contrast principle"
  ],
  
  density: [
    "Genre affects ideal word density - Ballad: 60 wpm, Pop: 100 wpm, Rap: 150 wpm",
    "High density needs simpler words - backed by: Cognitive load theory",
    "Space allows emotional impact - backed by: 'Less is more' production philosophy",
    "Texture variety prevents listener fatigue - backed by: Auditory attention studies"
  ]
};

export interface ProducerAnalysis {
  sonicDensity: {
    category: 'Sonic Density';
    score: number;
    reasoning: string;
    phoneticTexture: string; // e.g., "Punchy", "Smooth", "Dense"
    densityBalance: string; // "Well-paced", "Too dense", "Too sparse"
    consonantVowelRatio: string;
  };
  
  structurePacing: {
    category: 'Structure & Pacing';
    score: number;
    reasoning: string;
    structuralStrength: string;
    pacingIssues: string[];
    energyCurve: string; // e.g., "Builds well", "Flat", "Drops midway"
  };
  
  groundingPrinciples: string[];
  overallProductionScore: number;
  arrangementNotes: string[];
}

/**
 * Analyze song from producer perspective
 * Focuses on sonic texture, phonetics, and structural arrangement
 */
export const analyzeProducer = async (
  song: GeneratedSong,
  inputs: any,
  sonicAnalysis?: any
): Promise<ProducerAnalysis> => {
  
  const prompt = `
You are the PRODUCER AGENT - a specialist in sonic texture and arrangement structure.

**YOUR EXPERTISE:**
- Phonetic texture and consonant/vowel balance
- Song structure and section flow
- Pacing and energy curve
- Genre-appropriate density

**PRODUCER PRINCIPLES (cite these in your reasoning):**
${JSON.stringify(PRODUCER_PRINCIPLES, null, 2)}

**SONG TO ANALYZE:**
Title: ${song.title}
Genre: ${inputs.genre}
Mood: ${inputs.mood}
Structure: ${inputs.structure}

Lyrics:
${song.lyrics}

${sonicAnalysis ? `
**PROGRAMMATIC SONIC ANALYSIS (for context):**
Phonetics: ${sonicAnalysis.phonetics}
Density: ${sonicAnalysis.density}
Cinema objects: ${sonicAnalysis.cinemaAudit?.objectCount || 0}
` : ''}

**YOUR TASK:**
Analyze this song across TWO production dimensions (each 0-10):

1. **PHONETIC FLOW & SONIC DENSITY** (0-10):
   - Consonant/vowel balance for phonetic texture
   - Word density appropriate for genre?
   - Phonetic variety vs repetition
   - Texture creates identity? (punchy, smooth, dense, sparse)
   - Is density balanced throughout?
   - NOTE: This contributes to "Melodic & Phonetic Flow" category

2. **STRUCTURE & PACING** (0-10):
   - Does structure follow genre conventions?
   - Is the energy curve effective? (builds to peak? flat? drops?)
   - Section lengths appropriate?
   - Chorus placement optimal?
   - Pacing keeps attention?

**SCORING GUIDE (for each category):**
- 9-10: Exceptional - Studio-ready arrangement
- 7-8: Strong - Professional with minor tweaks
- 5-6: Adequate - Workable structure
- 3-4: Weak - Structural issues
- 0-2: Poor - Fundamental arrangement problems

**OUTPUT REQUIREMENTS:**
- Be specific about phonetic patterns (quote consonant-heavy or vowel-rich lines)
- Identify structural strengths/weaknesses with section references
- Give actionable arrangement suggestions
- Cite producer principles

Return JSON with both analyses plus production notes.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sonicDensity: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              phoneticTexture: { type: Type.STRING },
              densityBalance: { type: Type.STRING },
              consonantVowelRatio: { type: Type.STRING }
            },
            required: ['score', 'reasoning', 'phoneticTexture', 'densityBalance', 'consonantVowelRatio']
          },
          structurePacing: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              structuralStrength: { type: Type.STRING },
              pacingIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
              energyCurve: { type: Type.STRING }
            },
            required: ['score', 'reasoning', 'structuralStrength', 'pacingIssues', 'energyCurve']
          },
          groundingPrinciples: { type: Type.ARRAY, items: { type: Type.STRING } },
          overallProductionScore: { type: Type.NUMBER },
          arrangementNotes: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['sonicDensity', 'structurePacing', 'groundingPrinciples', 'overallProductionScore', 'arrangementNotes']
      },
      systemInstruction: `You are a professional music producer with studio experience. Think about how this song would sound in production. Balance technical analysis (phonetics, structure) with creative intuition. Be specific and actionable.`,
      temperature: 0.7,
      maxOutputTokens: 8192
    }
  });

  if (!response.text) throw new Error("Producer agent analysis failed");
  const analysis = JSON.parse(response.text);
  
  return {
    sonicDensity: {
      category: 'Sonic Density',
      ...analysis.sonicDensity
    },
    structurePacing: {
      category: 'Structure & Pacing',
      ...analysis.structurePacing
    },
    groundingPrinciples: analysis.groundingPrinciples,
    overallProductionScore: analysis.overallProductionScore,
    arrangementNotes: analysis.arrangementNotes
  };
};

/**
 * Get producer opinion on a proposed change
 */
export const producerDebate = async (
  song: GeneratedSong,
  originalLine: string,
  proposedLine: string,
  context: string
): Promise<{ position: 'SUPPORT' | 'OPPOSE' | 'COMPROMISE'; reasoning: string; alternative?: string }> => {
  
  const prompt = `
You are the PRODUCER AGENT reviewing a proposed line change.

**PRODUCER PRINCIPLES:**
${JSON.stringify(PRODUCER_PRINCIPLES, null, 2)}

**SONG CONTEXT:**
Title: ${song.title}
Full lyrics:
${song.lyrics}

**DEBATE CONTEXT:**
${context}

**PROPOSED CHANGE:**
Original: "${originalLine}"
Proposed: "${proposedLine}"

**YOUR TASK:**
Evaluate from production perspective:
1. Does the new line improve phonetic texture?
2. Does it affect song structure or pacing?
3. Is density more appropriate?
4. Does it fit the arrangement better?

Return JSON with:
- position: "SUPPORT" | "OPPOSE" | "COMPROMISE"
- reasoning: string (production/arrangement analysis)
- alternative: string | undefined (if COMPROMISE, suggest production-optimal hybrid)
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          position: { type: Type.STRING, enum: ['SUPPORT', 'OPPOSE', 'COMPROMISE'] },
          reasoning: { type: Type.STRING },
          alternative: { type: Type.STRING, nullable: true }
        },
        required: ['position', 'reasoning']
      },
      temperature: 0.7,
      maxOutputTokens: 1024
    }
  });

  if (!response.text) throw new Error("Producer debate response failed");
  return JSON.parse(response.text);
};
