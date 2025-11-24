/**
 * LYRICIST AGENT
 * 
 * Specialized agent focused on word-level craft and lyrical originality
 * Part of the 5-agent analysis system
 * 
 * OWNERSHIP: Lyrical Originality
 * MODEL: Gemini 2.0 Flash Experimental
 * BUDGET: 4096 tokens
 */

import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedSong, ScoreComponent } from "../types";

// @ts-ignore - Vite env types
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

/**
 * LYRICIST GROUNDING PRINCIPLES
 * Evidence-based rules for word craft and originality
 */
const LYRICIST_PRINCIPLES = {
  cliche_avoidance: [
    "Avoid overused phrases ('heart of gold', 'time will tell') - backed by: BMI songwriting workshops",
    "Replace abstract emotions with concrete imagery - backed by: 'Show don't tell' principle",
    "Unexpected word pairings increase memorability - backed by: Cognitive psychology of surprise",
    "Fresh metaphors beat familiar similes - backed by: Literary analysis of hit lyrics"
  ],
  
  word_choice: [
    "Strong verbs beat adjectives (e.g., 'crashed' > 'fell quickly') - backed by: Style guides",
    "Specific nouns beat generic ones (e.g., 'Mustang' > 'car') - backed by: Concrete language studies",
    "Monosyllabic words work best for hooks - backed by: 'Hey Jude', 'Let It Be' analysis",
    "Multisyllabic words add sophistication to verses - backed by: Vocabulary studies in pop music"
  ],
  
  rhyme_craft: [
    "Perfect rhymes feel predictable - mix with slant rhymes - backed by: Modern songwriting analysis",
    "Internal rhymes add texture - backed by: Hip hop production techniques",
    "Rhyme placement affects emphasis - end rhymes emphasize, internal rhymes flow",
    "Rhyme density varies by genre - Pop: moderate, Hip Hop: high, Folk: light"
  ],
  
  originality: [
    "First thought is often cliché - go to 3rd or 4th idea - backed by: Brainstorming research",
    "Genre-bending word choices surprise listeners - backed by: Crossover hit analysis",
    "Personal specifics beat universal abstractions - backed by: Taylor Swift's writing method",
    "Unique perspectives on common themes create connection - backed by: Relatability studies"
  ]
};

export interface LyricistAnalysis {
  category: 'Lyrical Originality';
  score: number;
  reasoning: string;
  groundingPrinciples: string[];
  clicheDetection: {
    found: string[];
    suggestions: string[];
  };
  strengthExamples: string[];
  improvementOpportunities: string[];
}

/**
 * Analyze song from lyricist perspective
 * Focuses on word-level craft and cliché avoidance
 */
export const analyzeLyricist = async (
  song: GeneratedSong,
  inputs: any
): Promise<LyricistAnalysis> => {
  
  const prompt = `
You are the LYRICIST AGENT - a specialist in word-level craft and originality.

**YOUR EXPERTISE:**
- Cliché detection and fresh alternatives
- Word choice precision (concrete vs abstract, strong verbs, specific nouns)
- Rhyme craft (perfect, slant, internal)
- Lyrical originality and unique perspectives

**LYRICIST PRINCIPLES (cite these in your reasoning):**
${JSON.stringify(LYRICIST_PRINCIPLES, null, 2)}

**SONG TO ANALYZE:**
Title: ${song.title}
Genre: ${inputs.genre}
Mood: ${inputs.mood}
Topic: ${inputs.topic}

Lyrics:
${song.lyrics}

**YOUR TASK:**
Analyze this song's LYRICAL ORIGINALITY (0-10 scale):
- Word choice quality (specific, concrete, surprising)
- Cliché presence and severity
- Rhyme sophistication
- Unique perspectives on the topic
- Freshness of language and imagery

**SCORING GUIDE:**
- 9-10: Exceptional - Fresh, vivid language; no clichés; unexpected word choices
- 7-8: Strong - Mostly original; minimal clichés; good word precision
- 5-6: Adequate - Some clichés; decent word choice; room for improvement
- 3-4: Weak - Multiple clichés; generic language; predictable phrases
- 0-2: Poor - Heavily clichéd; abstract/vague; lacks originality

**OUTPUT REQUIREMENTS:**
1. Provide specific examples from the lyrics (quote exact lines)
2. Cite at least 2 grounding principles that support your reasoning
3. Identify ANY clichés you find (even mild ones)
4. Give concrete suggestions for improvement

Return JSON with:
- score: number (0-10)
- reasoning: string (detailed analysis, 4-5 sentences)
- groundingPrinciples: string[] (principle citations you used)
- clicheDetection: { found: string[], suggestions: string[] }
- strengthExamples: string[] (best lines from the song)
- improvementOpportunities: string[] (specific weak spots to fix)
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
          groundingPrinciples: { type: Type.ARRAY, items: { type: Type.STRING } },
          clicheDetection: {
            type: Type.OBJECT,
            properties: {
              found: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          strengthExamples: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['score', 'reasoning', 'groundingPrinciples', 'clicheDetection', 'strengthExamples', 'improvementOpportunities']
      },
      systemInstruction: `You are a professional lyricist focused on originality and word craft. Be specific and evidence-based. Don't be afraid to identify clichés - it helps improve the writing. Always quote exact lines when giving examples.`,
      temperature: 0.7,
      maxOutputTokens: 4096
    }
  });

  if (!response.text) throw new Error("Lyricist agent analysis failed");
  const analysis = JSON.parse(response.text);
  
  return {
    category: 'Lyrical Originality',
    ...analysis
  };
};

/**
 * Get lyricist opinion on a proposed line change
 * Used in debate system
 */
export const lyricistDebate = async (
  song: GeneratedSong,
  originalLine: string,
  proposedLine: string,
  context: string
): Promise<{ position: 'SUPPORT' | 'OPPOSE' | 'COMPROMISE'; reasoning: string; alternative?: string }> => {
  
  const prompt = `
You are the LYRICIST AGENT reviewing a proposed line change.

**LYRICIST PRINCIPLES:**
${JSON.stringify(LYRICIST_PRINCIPLES, null, 2)}

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
Evaluate this change from a lyricist perspective:
1. Does the new line have better word choice?
2. Does it avoid clichés better?
3. Is it more original/surprising?
4. Does it maintain the song's voice?

**POSITIONS:**
- SUPPORT: New line is clearly better for word craft
- OPPOSE: Original line is stronger or new line introduces problems
- COMPROMISE: Both have merit; suggest a hybrid that takes best of both

Return JSON with:
- position: "SUPPORT" | "OPPOSE" | "COMPROMISE"
- reasoning: string (specific word-level analysis)
- alternative: string | undefined (if COMPROMISE, provide your hybrid line)
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

  if (!response.text) throw new Error("Lyricist debate response failed");
  return JSON.parse(response.text);
};
