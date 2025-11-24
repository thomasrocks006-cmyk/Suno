/**
 * STORYTELLER AGENT
 * 
 * Specialized agent focused on narrative structure, emotional depth, and thematic elements
 * Part of the 5-agent analysis system
 * 
 * OWNERSHIP: Narrative Arc, Imagery & Sensory Detail, Thematic Cohesion, Emotional Impact
 * MODEL: Gemini 3 Pro Preview (upgraded for complex multi-category synthesis)
 * BUDGET: 8192 tokens (largest scope - 4 categories)
 */

import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedSong, ScoreComponent } from "../types";

// @ts-ignore - Vite env types
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

/**
 * STORYTELLER GROUNDING PRINCIPLES
 * Evidence-based rules for narrative and emotional craft
 */
const STORYTELLER_PRINCIPLES = {
  narrative_arc: [
    "Three-act structure (Setup → Conflict → Resolution) creates satisfaction - backed by: Story theory",
    "Emotional progression should build to climax - backed by: Dramatic structure analysis",
    "Verses tell story, chorus delivers message - backed by: Pop songwriting convention",
    "Bridge provides perspective shift or revelation - backed by: 87% of #1 hits use bridge as turning point"
  ],
  
  imagery: [
    "Concrete sensory details beat abstract emotions - backed by: 'Show don't tell' principle",
    "Engage multiple senses (sight, sound, touch, smell, taste) - backed by: Memory studies",
    "Specific imagery creates universal connection - backed by: Ed Sheeran's 'Photograph' analysis",
    "Visual imagery works best for memorable lines - backed by: Cognitive processing studies"
  ],
  
  thematic_cohesion: [
    "Central metaphor anchors the song - backed by: Linguistic cohesion studies",
    "All verses should relate to core theme - backed by: Taylor Swift's 'All Too Well' breakdown",
    "Repetition of key imagery reinforces theme - backed by: Marketing psychology",
    "Mixed metaphors confuse listeners - backed by: Clarity in communication research"
  ],
  
  emotional_impact: [
    "Vulnerability creates connection - backed by: Brené Brown's research on authenticity",
    "Emotional specificity beats generic sentiment - backed by: Songwriting masterclasses",
    "Contrast enhances emotion (quiet → loud, sad → hopeful) - backed by: Dynamic range studies",
    "Universal experiences expressed through personal lens - backed by: Relatability analysis"
  ]
};

export interface StorytellerAnalysis {
  narrativeArc: {
    category: 'Narrative Arc';
    score: number;
    reasoning: string;
    arcShape: string; // e.g., "V-shape", "ascending", "peak"
    structure: string; // Three-act breakdown
  };
  
  imagerySensory: {
    category: 'Imagery & Sensory Detail';
    score: number;
    reasoning: string;
    sensesEngaged: string[]; // visual, auditory, tactile, etc.
    bestExamples: string[];
  };
  
  thematicCohesion: {
    category: 'Thematic Cohesion';
    score: number;
    reasoning: string;
    centralTheme: string;
    cohesionIssues: string[];
  };
  
  emotionalImpact: {
    category: 'Emotional Impact';
    score: number;
    reasoning: string;
    emotionalPeaks: string[];
    connectionStrength: string; // e.g., "Strong", "Moderate", "Weak"
  };
  
  groundingPrinciples: string[];
  overallStorytellingScore: number;
  recommendations: string[];
}

/**
 * Analyze song from storyteller perspective
 * Focuses on narrative structure, imagery, themes, and emotional resonance
 */
export const analyzeStoryteller = async (
  song: GeneratedSong,
  inputs: any,
  programmaticScores?: { narrativeArc?: any; imagerySensory?: any }
): Promise<StorytellerAnalysis> => {
  
  const prompt = `
You are the STORYTELLER AGENT - a specialist in narrative craft, imagery, and emotional depth.

**YOUR EXPERTISE:**
- Narrative arc structure (Setup → Conflict → Resolution)
- Sensory imagery and concrete language
- Thematic cohesion and central metaphors
- Emotional resonance and vulnerability

**STORYTELLER PRINCIPLES (cite these in your reasoning):**
${JSON.stringify(STORYTELLER_PRINCIPLES, null, 2)}

**SONG TO ANALYZE:**
Title: ${song.title}
Genre: ${inputs.genre}
Mood: ${inputs.mood}
Topic: ${inputs.topic}

Lyrics:
${song.lyrics}

${programmaticScores ? `
**PROGRAMMATIC ANALYSIS (for context):**
${programmaticScores.narrativeArc ? `Narrative Arc: ${programmaticScores.narrativeArc.score}/10 - ${programmaticScores.narrativeArc.breakdown}` : ''}
${programmaticScores.imagerySensory ? `Imagery: ${programmaticScores.imagerySensory.score}/10 - ${programmaticScores.imagerySensory.breakdown}` : ''}
` : ''}

**YOUR TASK:**
Analyze this song across FOUR storytelling dimensions (each 0-10):

1. **NARRATIVE ARC** (0-10):
   - Does it have clear Setup → Conflict → Resolution?
   - Does emotion build toward a climax?
   - Is there a story progression or just static description?
   - What's the arc shape? (V-shape, ascending, peak, flat, etc.)

2. **IMAGERY & SENSORY DETAIL** (0-10):
   - How much concrete sensory language? (vs abstract emotions)
   - Which senses are engaged? (visual, auditory, tactile, olfactory, gustatory, kinesthetic)
   - Are there vivid, memorable images?
   - Examples of strongest imagery?

3. **THEMATIC COHESION** (0-10):
   - Is there a clear central theme or metaphor?
   - Do all parts relate to the core message?
   - Any thematic drift or mixed metaphors?
   - How unified is the song's vision?

4. **EMOTIONAL IMPACT** (0-10):
   - Does it create genuine emotional connection?
   - Is there vulnerability and authenticity?
   - Where are the emotional peaks?
   - Does it feel personal yet universal?

**SCORING GUIDE (for each category):**
- 9-10: Exceptional - Masterful storytelling craft
- 7-8: Strong - Effective with minor improvements possible
- 5-6: Adequate - Functional but room for growth
- 3-4: Weak - Significant storytelling gaps
- 0-2: Poor - Fundamental craft issues

Return JSON with all four analyses plus overall assessment.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          narrativeArc: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              arcShape: { type: Type.STRING },
              structure: { type: Type.STRING }
            },
            required: ['score', 'reasoning', 'arcShape', 'structure']
          },
          imagerySensory: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              sensesEngaged: { type: Type.ARRAY, items: { type: Type.STRING } },
              bestExamples: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['score', 'reasoning', 'sensesEngaged', 'bestExamples']
          },
          thematicCohesion: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              centralTheme: { type: Type.STRING },
              cohesionIssues: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['score', 'reasoning', 'centralTheme', 'cohesionIssues']
          },
          emotionalImpact: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              emotionalPeaks: { type: Type.ARRAY, items: { type: Type.STRING } },
              connectionStrength: { type: Type.STRING }
            },
            required: ['score', 'reasoning', 'emotionalPeaks', 'connectionStrength']
          },
          groundingPrinciples: { type: Type.ARRAY, items: { type: Type.STRING } },
          overallStorytellingScore: { type: Type.NUMBER },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['narrativeArc', 'imagerySensory', 'thematicCohesion', 'emotionalImpact', 'groundingPrinciples', 'overallStorytellingScore', 'recommendations']
      },
      systemInstruction: `You are a master storyteller and narrative expert. Be specific and cite exact lines. Balance technical analysis with emotional understanding. Don't hold back on constructive criticism - it helps writers grow.`,
      temperature: 0.7,
      maxOutputTokens: 8192
    }
  });

  if (!response.text) throw new Error("Storyteller agent analysis failed");
  const analysis = JSON.parse(response.text);
  
  return {
    narrativeArc: {
      category: 'Narrative Arc',
      ...analysis.narrativeArc
    },
    imagerySensory: {
      category: 'Imagery & Sensory Detail',
      ...analysis.imagerySensory
    },
    thematicCohesion: {
      category: 'Thematic Cohesion',
      ...analysis.thematicCohesion
    },
    emotionalImpact: {
      category: 'Emotional Impact',
      ...analysis.emotionalImpact
    },
    groundingPrinciples: analysis.groundingPrinciples,
    overallStorytellingScore: analysis.overallStorytellingScore,
    recommendations: analysis.recommendations
  };
};

/**
 * Get storyteller opinion on a proposed change
 */
export const storytellerDebate = async (
  song: GeneratedSong,
  originalLine: string,
  proposedLine: string,
  context: string
): Promise<{ position: 'SUPPORT' | 'OPPOSE' | 'COMPROMISE'; reasoning: string; alternative?: string }> => {
  
  const prompt = `
You are the STORYTELLER AGENT reviewing a proposed line change.

**STORYTELLER PRINCIPLES:**
${JSON.stringify(STORYTELLER_PRINCIPLES, null, 2)}

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
Evaluate from storytelling perspective:
1. Does the new line advance the narrative better?
2. Is the imagery more concrete/vivid?
3. Does it maintain thematic cohesion?
4. Is the emotional impact stronger?

Return JSON with:
- position: "SUPPORT" | "OPPOSE" | "COMPROMISE"
- reasoning: string (narrative/emotional analysis)
- alternative: string | undefined (if COMPROMISE, suggest hybrid)
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
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

  if (!response.text) throw new Error("Storyteller debate response failed");
  return JSON.parse(response.text);
};
