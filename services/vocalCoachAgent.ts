/**
 * VOCAL COACH AGENT
 * 
 * Specialized agent focused on singability, breath control, and vocal performance
 * Part of the 5-agent analysis system
 * 
 * OWNERSHIP: Vocal Playability, Melodic & Phonetic Flow (Rhythmic Flow)
 * MODEL: Gemini 2.0 Flash Experimental
 * BUDGET: 8192 tokens
 */

import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedSong, ScoreComponent } from "../types";

// @ts-ignore - Vite env types
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

/**
 * VOCAL COACH GROUNDING PRINCIPLES
 * Evidence-based rules for vocal performance and singability
 */
const VOCAL_COACH_PRINCIPLES = {
  breath_control: [
    "Ideal phrase length: 8-12 syllables before breath - backed by: Vocal pedagogy studies",
    "Natural breath points (commas, line breaks) prevent awkward phrasing - backed by: Singing technique guides",
    "Genre affects breath capacity - Pop: 12 syl, Rap: 20 syl, Ballad: 8 syl - backed by: Genre analysis",
    "Breath markers improve vocal performance - backed by: Studio recording practices"
  ],
  
  phonetic_flow: [
    "Open vowels (ah, oh, ay) work best on sustained notes - backed by: Vocal formant research",
    "Consonant clusters slow delivery and hurt clarity - backed by: Phonetics studies",
    "Alliteration aids memorability but hurts speed - backed by: Tongue-twister research",
    "Rhyme scheme affects vocal rhythm - AABB feels bouncy, ABAB feels balanced"
  ],
  
  melodic_fit: [
    "Stressed syllables should align with strong beats - backed by: Prosody research",
    "Monosyllabic words give flexibility for melody - backed by: Songwriting analysis",
    "Multisyllabic words work better in verses than hooks - backed by: Hit song analysis",
    "Word stress patterns create natural rhythm - backed by: Linguistic rhythm studies"
  ],
  
  performance: [
    "Emotional words need vocal space (fewer syllables) - backed by: Performance coaching",
    "Fast sections need simpler consonants - backed by: Articulation studies",
    "Repetition builds muscle memory for live performance - backed by: Motor learning research",
    "Awkward phoneme transitions cause vocal strain - backed by: Speech pathology"
  ]
};

export interface VocalCoachAnalysis {
  vocalPlayability: {
    category: 'Vocal Playability';
    score: number;
    reasoning: string;
    breathIssues: { lineNumber: number; issue: string; suggestion: string }[];
    singabilityRating: string; // "Easy", "Moderate", "Challenging"
  };
  
  melodicFlow: {
    category: 'Melodic & Phonetic Flow';
    score: number;
    reasoning: string;
    rhythmicStrengths: string[];
    flowIssues: string[];
  };
  
  groundingPrinciples: string[];
  overallVocalScore: number;
  performanceNotes: string[];
}

/**
 * Analyze song from vocal coach perspective
 * Focuses on breath control, phonetic flow, and vocal performance
 */
export const analyzeVocalCoach = async (
  song: GeneratedSong,
  inputs: any,
  programmaticScores?: { vocalPlayability?: any }
): Promise<VocalCoachAnalysis> => {
  
  const prompt = `
You are the VOCAL COACH AGENT - a specialist in vocal performance and singability.

**YOUR EXPERTISE:**
- Breath control and phrasing
- Phonetic flow and consonant issues
- Melodic compatibility (syllable stress, rhythm)
- Live performance feasibility

**VOCAL COACH PRINCIPLES (cite these in your reasoning):**
${JSON.stringify(VOCAL_COACH_PRINCIPLES, null, 2)}

**SONG TO ANALYZE:**
Title: ${song.title}
Genre: ${inputs.genre}
Mood: ${inputs.mood}

Lyrics:
${song.lyrics}

${programmaticScores?.vocalPlayability ? `
**PROGRAMMATIC ANALYSIS (for context):**
Vocal Playability: ${programmaticScores.vocalPlayability.score}/10
Issues: ${programmaticScores.vocalPlayability.breakdown}
Breath markers: Lines ${programmaticScores.vocalPlayability.breathMarkers?.join(', ') || 'none'}
` : ''}

**YOUR TASK:**
Analyze this song across TWO vocal dimensions (each 0-10):

1. **VOCAL PLAYABILITY** (0-10):
   - Are phrase lengths manageable for breathing?
   - Any awkward consonant clusters (3+ consonants)?
   - Genre-appropriate syllable density?
   - Overall singability rating: Easy/Moderate/Challenging?
   - Identify specific lines that need breath points

2. **MELODIC & PHONETIC FLOW** (0-10):
   - Do syllable stresses create natural rhythm?
   - Are vowel sounds conducive to melody?
   - Good rhyme scheme for vocal rhythm?
   - Any tongue-twisting phrases?
   - Flow strengths and weaknesses

**SCORING GUIDE (for each category):**
- 9-10: Exceptional - Professional vocalist ready
- 7-8: Strong - Minor issues, mostly singable
- 5-6: Adequate - Workable with adjustments
- 3-4: Weak - Multiple vocal challenges
- 0-2: Poor - Difficult to perform

**OUTPUT REQUIREMENTS:**
- Quote specific lines with breath/flow issues
- Provide line numbers for breath markers
- Give concrete suggestions ("add comma after X", "replace Y with simpler word")
- Cite vocal principles that support your analysis

Return JSON with both analyses plus performance assessment.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vocalPlayability: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              breathIssues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    lineNumber: { type: Type.NUMBER },
                    issue: { type: Type.STRING },
                    suggestion: { type: Type.STRING }
                  }
                }
              },
              singabilityRating: { type: Type.STRING }
            },
            required: ['score', 'reasoning', 'breathIssues', 'singabilityRating']
          },
          melodicFlow: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              rhythmicStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              flowIssues: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['score', 'reasoning', 'rhythmicStrengths', 'flowIssues']
          },
          groundingPrinciples: { type: Type.ARRAY, items: { type: Type.STRING } },
          overallVocalScore: { type: Type.NUMBER },
          performanceNotes: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['vocalPlayability', 'melodicFlow', 'groundingPrinciples', 'overallVocalScore', 'performanceNotes']
      },
      systemInstruction: `You are a professional vocal coach with studio recording experience. Be specific about breath points and phonetic issues. Think like a singer performing this live - what would be difficult? Provide actionable feedback.`,
      temperature: 0.7,
      maxOutputTokens: 8192
    }
  });

  if (!response.text) throw new Error("Vocal Coach agent analysis failed");
  const analysis = JSON.parse(response.text);
  
  return {
    vocalPlayability: {
      category: 'Vocal Playability',
      ...analysis.vocalPlayability
    },
    melodicFlow: {
      category: 'Melodic & Phonetic Flow',
      ...analysis.melodicFlow
    },
    groundingPrinciples: analysis.groundingPrinciples,
    overallVocalScore: analysis.overallVocalScore,
    performanceNotes: analysis.performanceNotes
  };
};

/**
 * Get vocal coach opinion on a proposed change
 */
export const vocalCoachDebate = async (
  song: GeneratedSong,
  originalLine: string,
  proposedLine: string,
  context: string
): Promise<{ position: 'SUPPORT' | 'OPPOSE' | 'COMPROMISE'; reasoning: string; alternative?: string }> => {
  
  const prompt = `
You are the VOCAL COACH AGENT reviewing a proposed line change.

**VOCAL COACH PRINCIPLES:**
${JSON.stringify(VOCAL_COACH_PRINCIPLES, null, 2)}

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
Evaluate from vocal performance perspective:
1. Is the new line easier to sing?
2. Does it have better breath points?
3. Are phonetic flow improvements?
4. Is syllable stress more natural?

Return JSON with:
- position: "SUPPORT" | "OPPOSE" | "COMPROMISE"
- reasoning: string (vocal/phonetic analysis)
- alternative: string | undefined (if COMPROMISE, suggest singable hybrid)
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

  if (!response.text) throw new Error("Vocal Coach debate response failed");
  return JSON.parse(response.text);
};
