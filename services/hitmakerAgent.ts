/**
 * HITMAKER AGENT
 * 
 * Specialized agent focused on commercial appeal and hook catchiness
 * Part of the 5-agent analysis system
 * 
 * OWNERSHIP: Hook Factor, Commercial Potential
 * MODEL: Gemini 2.0 Flash Experimental
 * BUDGET: 2048 tokens (smallest scope - pattern matching focused)
 */

import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedSong, ScoreComponent } from "../types";

// @ts-ignore - Vite env types
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

/**
 * HITMAKER GROUNDING PRINCIPLES
 * Evidence-based rules for commercial success and memorability
 */
const HITMAKER_PRINCIPLES = {
  hook_factor: [
    "Title should repeat 3-5x for memorability - backed by: Billboard Top 100 analysis",
    "Hook in first 50 seconds captures streaming listeners - backed by: Skip-rate data",
    "Chorus repetition builds familiarity - backed by: 'Mere exposure effect' psychology",
    "Simple, monosyllabic hooks are most memorable - backed by: 'Hey Jude', 'Let It Be' analysis"
  ],
  
  commercial_patterns: [
    "Shorter songs (3:00-3:30) perform better on streaming - backed by: Spotify data",
    "Universal themes (love, heartbreak, celebration) have broad appeal - backed by: Hit song analysis",
    "4th grade reading level maximizes accessibility - backed by: Lyric complexity studies",
    "Emotional authenticity beats technical perfection - backed by: Audience connection research"
  ],
  
  memorability: [
    "Repetition of key phrases aids recall - backed by: Marketing psychology (rule of 7)",
    "Unexpected word pairings create stickiness - backed by: Cognitive surprise studies",
    "Phonetic catchiness beats semantic complexity - backed by: 'Earworm' research",
    "Call-and-response structures engage listeners - backed by: Participatory music studies"
  ],
  
  marketability: [
    "TikTok-friendly moments (15-30 sec clips) boost virality - backed by: Social media trends",
    "Genre-crossing elements widen audience - backed by: Crossover hit analysis",
    "Relatable specifics beat vague abstractions - backed by: Taylor Swift's relatability method",
    "Strong opening line hooks playlist curators - backed by: Playlist curator interviews"
  ]
};

export interface HitmakerAnalysis {
  hookFactor: {
    category: 'Hook Factor';
    score: number;
    reasoning: string;
    catchinessRating: string; // "Infectious", "Catchy", "Moderate", "Weak"
    hookStrengths: string[];
    hookWeaknesses: string[];
  };
  
  commercialPotential: {
    category: 'Commercial Potential';
    score: number;
    reasoning: string;
    marketViability: string; // "High", "Moderate", "Low"
    targetAudience: string;
    viralMoments: string[]; // Potential TikTok/social clips
  };
  
  groundingPrinciples: string[];
  overallHitScore: number;
  marketingNotes: string[];
}

/**
 * Analyze song from hitmaker perspective
 * Focuses on commercial appeal and memorability
 */
export const analyzeHitmaker = async (
  song: GeneratedSong,
  inputs: any,
  programmaticScores?: { hookFactor?: any }
): Promise<HitmakerAnalysis> => {
  
  const prompt = `
You are the HITMAKER AGENT - a specialist in commercial appeal and memorability.

**YOUR EXPERTISE:**
- Hook catchiness and title repetition
- Commercial viability and market fit
- Memorability and viral potential
- Streaming/TikTok optimization

**HITMAKER PRINCIPLES (cite these in your reasoning):**
${JSON.stringify(HITMAKER_PRINCIPLES, null, 2)}

**SONG TO ANALYZE:**
Title: ${song.title}
Genre: ${inputs.genre}

Lyrics:
${song.lyrics}

${programmaticScores?.hookFactor ? `
**PROGRAMMATIC ANALYSIS (for context):**
Hook Factor: ${programmaticScores.hookFactor.score}/10
Details: ${programmaticScores.hookFactor.breakdown}
` : ''}

**YOUR TASK:**
Analyze this song across TWO commercial dimensions (each 0-10):

1. **HOOK FACTOR** (0-10):
   - How catchy/memorable is the hook?
   - Title repetition effectiveness
   - Chorus stickiness
   - Earworm potential
   - Best hook moments?

2. **COMMERCIAL POTENTIAL** (0-10):
   - Market viability (radio, streaming, TikTok)
   - Universal appeal vs niche
   - Accessibility (language complexity)
   - Target audience fit
   - Viral moment potential (15-30 sec clips)

**SCORING GUIDE:**
- 9-10: Exceptional - Hit potential, highly commercial
- 7-8: Strong - Radio-ready, good market fit
- 5-6: Adequate - Niche appeal, needs work
- 3-4: Weak - Limited commercial appeal
- 0-2: Poor - Not market-ready

**OUTPUT REQUIREMENTS:**
- Quote specific hook moments
- Identify potential TikTok clips (with timestamps if possible)
- Be honest about commercial weaknesses
- Cite hitmaker principles

Return JSON with both analyses plus marketing assessment.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hookFactor: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              catchinessRating: { type: Type.STRING },
              hookStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              hookWeaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['score', 'reasoning', 'catchinessRating', 'hookStrengths', 'hookWeaknesses']
          },
          commercialPotential: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              marketViability: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              viralMoments: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['score', 'reasoning', 'marketViability', 'targetAudience', 'viralMoments']
          },
          groundingPrinciples: { type: Type.ARRAY, items: { type: Type.STRING } },
          overallHitScore: { type: Type.NUMBER },
          marketingNotes: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['hookFactor', 'commercialPotential', 'groundingPrinciples', 'overallHitScore', 'marketingNotes']
      },
      systemInstruction: `You are a hit songwriter and A&R executive. Think like a radio programmer and playlist curator. Be brutally honest about commercial potential - sugarcoating doesn't help artists. Focus on what makes songs sticky and memorable.`,
      temperature: 0.7,
      maxOutputTokens: 2048
    }
  });

  if (!response.text) throw new Error("Hitmaker agent analysis failed");
  const analysis = JSON.parse(response.text);
  
  return {
    hookFactor: {
      category: 'Hook Factor',
      ...analysis.hookFactor
    },
    commercialPotential: {
      category: 'Commercial Potential',
      ...analysis.commercialPotential
    },
    groundingPrinciples: analysis.groundingPrinciples,
    overallHitScore: analysis.overallHitScore,
    marketingNotes: analysis.marketingNotes
  };
};

/**
 * Get hitmaker opinion on a proposed change
 */
export const hitmakerDebate = async (
  song: GeneratedSong,
  originalLine: string,
  proposedLine: string,
  context: string
): Promise<{ position: 'SUPPORT' | 'OPPOSE' | 'COMPROMISE'; reasoning: string; alternative?: string }> => {
  
  const prompt = `
You are the HITMAKER AGENT reviewing a proposed line change.

**HITMAKER PRINCIPLES:**
${JSON.stringify(HITMAKER_PRINCIPLES, null, 2)}

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
Evaluate from commercial perspective:
1. Is the new line catchier/more memorable?
2. Does it improve hook factor?
3. Is it more accessible/relatable?
4. Does it have viral potential?

Return JSON with:
- position: "SUPPORT" | "OPPOSE" | "COMPROMISE"
- reasoning: string (commercial/memorability analysis)
- alternative: string | undefined (if COMPROMISE, suggest catchier hybrid)
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
      maxOutputTokens: 512
    }
  });

  if (!response.text) throw new Error("Hitmaker debate response failed");
  return JSON.parse(response.text);
};
