/**
 * REAL MULTI-AGENT SONG GENERATION SYSTEM
 * 
 * Architecture:
 * 1. Main Generator creates initial draft (Gemini 2.5 Flash)
 * 2. 5 Specialist Agents review in parallel and propose changes
 * 3. Judge Agent synthesizes changes into refined version (Gemini 3.0 Pro)
 * 4. Optional 2nd iteration if quality threshold not met
 * 
 * This replaces the fake debate system with real AI collaboration.
 */

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedSong, SongInputs, AgentDebate } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

// ============================================================================
// AGENT CRITIQUE INTERFACES
// ============================================================================

interface AgentCritique {
  agent: string;
  overallAssessment: string;
  specificIssues: Array<{
    location: string; // e.g., "Verse 1, Line 3"
    issue: string;
    suggestion: string;
    priority: 'critical' | 'moderate' | 'minor';
  }>;
  strengths: string[];
}

interface RefinementResult {
  refinedLyrics: string;
  changesApplied: string[];
  agentDebates: AgentDebate[];
  qualityScore: number; // 0-100
  iterationCount: number;
}

// ============================================================================
// STEP 1: INITIAL DRAFT GENERATION
// ============================================================================

export async function generateInitialDraft(
  inputs: SongInputs,
  systemInstruction: string,
  songSchema: Schema
): Promise<GeneratedSong> {
  console.log('🎵 Step 1: Generating initial draft with Main Generator...');
  
  const prompt = buildGenerationPrompt(inputs);
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Premium quality for initial draft
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: songSchema,
      temperature: 0.9,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  const rawSong = JSON.parse(text);
  
  const draft: GeneratedSong = {
    ...rawSong,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    hasAdvancedLogic: inputs.advancedLyricLogic,
    hasMetaphorLogic: inputs.centralMetaphorLogic,
    hasCommercialMode: inputs.commercialMode,
    model: inputs.model,
    instrumental: inputs.instrumental
  };
  
  console.log('✅ Initial draft generated');
  return draft;
}

// ============================================================================
// STEP 2: PARALLEL AGENT CRITIQUE
// ============================================================================

export async function gatherAgentCritiques(
  draft: GeneratedSong,
  inputs: SongInputs,
  onProgress?: (agent: string, completed: number, total: number) => void
): Promise<AgentCritique[]> {
  console.log('🎭 Step 2: Gathering critiques from 5 specialist agents...');
  
  const [lyricist, storyteller, vocalCoach, producer, hitmaker] = await Promise.all([
    critiqueLyricist(draft, inputs).then(result => {
      if (onProgress) onProgress('Lyricist', 1, 5);
      return result;
    }),
    critiqueStoryteller(draft, inputs).then(result => {
      if (onProgress) onProgress('Storyteller', 2, 5);
      return result;
    }),
    critiqueVocalCoach(draft, inputs).then(result => {
      if (onProgress) onProgress('Vocal Coach', 3, 5);
      return result;
    }),
    critiqueProducer(draft, inputs).then(result => {
      if (onProgress) onProgress('Producer', 4, 5);
      return result;
    }),
    critiqueHitmaker(draft, inputs).then(result => {
      if (onProgress) onProgress('Hitmaker', 5, 5);
      return result;
    })
  ]);
  
  console.log('✅ All agent critiques gathered');
  return [lyricist, storyteller, vocalCoach, producer, hitmaker];
}

// ============================================================================
// STEP 3: JUDGE SYNTHESIS & REFINEMENT
// ============================================================================

export async function synthesizeRefinement(
  draft: GeneratedSong,
  critiques: AgentCritique[],
  inputs: SongInputs
): Promise<RefinementResult> {
  console.log('⚖️ Step 3: Judge synthesizing refinements...');
  
  // Identify conflicts and priorities
  const debates = extractDebates(critiques);
  
  const prompt = buildJudgePrompt(draft, critiques, inputs);
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Smart model for synthesis
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          refinedLyrics: { type: Type.STRING },
          changesApplied: { type: Type.ARRAY, items: { type: Type.STRING } },
          qualityScore: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ['refinedLyrics', 'changesApplied', 'qualityScore', 'reasoning']
      },
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 2048 }
    }
  });
  
  if (!response.text) throw new Error("Judge synthesis failed");
  const result = JSON.parse(response.text);
  
  console.log(`✅ Refinement complete - Quality: ${result.qualityScore}/100`);
  
  return {
    refinedLyrics: result.refinedLyrics,
    changesApplied: result.changesApplied,
    agentDebates: debates,
    qualityScore: result.qualityScore,
    iterationCount: 1
  };
}

// ============================================================================
// AGENT-SPECIFIC CRITIQUE FUNCTIONS
// ============================================================================

async function critiqueLyricist(draft: GeneratedSong, inputs: SongInputs): Promise<AgentCritique> {
  const prompt = `
You are the LYRICIST AGENT reviewing a song draft.

**YOUR EXPERTISE:** Lyrical originality, wordplay, avoiding clichés, concrete imagery.

**DRAFT SONG:**
Title: ${draft.title}
Lyrics:
${draft.lyrics}

**TASK:**
Review this draft and provide:
1. Overall assessment (2-3 sentences)
2. Specific issues with location, problem, and suggestion
3. What's working well

Focus on:
- AI clichés (tapestry, symphony, realm, unfold, ignite, soar)
- Generic phrases that could be more specific
- Opportunities for concrete imagery instead of abstractions
- Weak or predictable rhymes

Return JSON:
{
  "agent": "Lyricist",
  "overallAssessment": "...",
  "specificIssues": [
    {
      "location": "Verse 1, Line 3",
      "issue": "Generic phrase 'heart of gold' is cliché",
      "suggestion": "Replace with specific imagery like 'calloused hands that built this home'",
      "priority": "moderate"
    }
  ],
  "strengths": ["Strong opening hook", "Good use of sensory detail in verse 2"]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Premium for lyrical analysis
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      temperature: 0.7
    }
  });
  
  return JSON.parse(response.text!);
}

async function critiqueStoryteller(draft: GeneratedSong, inputs: SongInputs): Promise<AgentCritique> {
  const prompt = `
You are the STORYTELLER AGENT reviewing a song draft.

**YOUR EXPERTISE:** Narrative arc, emotional progression, thematic cohesion.

**DRAFT SONG:**
Title: ${draft.title}
Lyrics:
${draft.lyrics}

**TASK:**
Analyze the story structure:
1. Does each section advance the narrative?
2. Is there a clear emotional journey?
3. Does the climax land effectively?
4. Are there confusing or disconnected moments?

Return JSON with your critique including specific line issues and strengths.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Premium for narrative analysis
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      temperature: 0.7
    }
  });
  
  return JSON.parse(response.text!);
}

async function critiqueVocalCoach(draft: GeneratedSong, inputs: SongInputs): Promise<AgentCritique> {
  const prompt = `
You are the VOCAL COACH AGENT reviewing a song draft.

**YOUR EXPERTISE:** Singability, phonetic flow, breath points, consonant clusters.

**DRAFT SONG:**
Title: ${draft.title}
Genre: ${draft.stylePrompt}
Lyrics:
${draft.lyrics}

**TASK:**
Check for:
1. Consonant clusters that are hard to sing (3+ consonants together)
2. Lines that are too long to sing in one breath
3. Awkward vowel sequences
4. Missing vocal direction tags where needed

Return JSON with specific line-level issues.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      temperature: 0.7
    }
  });
  
  return JSON.parse(response.text!);
}

async function critiqueProducer(draft: GeneratedSong, inputs: SongInputs): Promise<AgentCritique> {
  const prompt = `
You are the PRODUCER AGENT reviewing a song draft.

**YOUR EXPERTISE:** Song structure, pacing, sonic texture, commercial formatting.

**DRAFT SONG:**
Title: ${draft.title}
Structure: ${extractStructure(draft.lyrics)}
Lyrics:
${draft.lyrics}

**TASK:**
Evaluate:
1. Is the structure optimal for this genre?
2. Are sections the right length? (verses 6-8 lines, chorus 4 lines)
3. Does the energy build appropriately?
4. Are there too many or too few sections?

Return JSON with structure recommendations.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro-preview", // Pro model for technical analysis
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      temperature: 0.7
    }
  });
  
  return JSON.parse(response.text!);
}

async function critiqueHitmaker(draft: GeneratedSong, inputs: SongInputs): Promise<AgentCritique> {
  const prompt = `
You are the HITMAKER AGENT reviewing a song draft.

**YOUR EXPERTISE:** Commercial appeal, hook strength, memorability, accessibility.

**DRAFT SONG:**
Title: ${draft.title}
Lyrics:
${draft.lyrics}

**TASK:**
Analyze commercial viability:
1. Is there a clear, memorable hook?
2. Does the chorus repeat enough?
3. Is the language accessible (not too complex)?
4. Are there viral-worthy moments?
5. Is the title worked into the lyrics effectively?

Return JSON with commercial improvement suggestions.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      temperature: 0.7
    }
  });
  
  return JSON.parse(response.text!);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function buildGenerationPrompt(inputs: SongInputs): string {
  const instrumentString = inputs.instruments.length > 0 ? `Featured Instruments: ${inputs.instruments.join(', ')}.` : "";
  
  return `
Generate a Suno v5 song concept.

User Inputs:
- Artist Reference: ${inputs.artistReference || "None"}
- Song Reference: ${inputs.songReference || "None"}
- Topic: ${inputs.topic || "Invent a creative topic"}
- Mood: ${inputs.mood || "Invent appropriate mood"}
- Genre: ${inputs.genre || "Invent fitting genre"}
- Preferred Vocals: ${inputs.vocals || "Auto-select"}
- Structure: ${inputs.structure}
- ${instrumentString}
- Extra Instructions: ${inputs.customInstructions || "None"}
- Advanced Lyric Logic: ${inputs.advancedLyricLogic ? "ENABLED" : "Disabled"}
- Central Metaphor: ${inputs.centralMetaphorLogic ? "ENABLED" : "Disabled"}
- Commercial Mode: ${inputs.commercialMode ? "ENABLED" : "Disabled"}

CRITICAL: Keep lyrics under 30 lines and 250 words.
`;
}

function buildJudgePrompt(draft: GeneratedSong, critiques: AgentCritique[], inputs: SongInputs): string {
  const critiqueSummary = critiques.map(c => `
**${c.agent}:**
${c.overallAssessment}

Critical Issues:
${c.specificIssues.filter(i => i.priority === 'critical').map(i => `- ${i.location}: ${i.issue} → ${i.suggestion}`).join('\n')}

Moderate Issues:
${c.specificIssues.filter(i => i.priority === 'moderate').slice(0, 3).map(i => `- ${i.location}: ${i.issue} → ${i.suggestion}`).join('\n')}
`).join('\n---\n');

  return `
You are the JUDGE AGENT synthesizing refinements from 5 specialist agents.

**ORIGINAL DRAFT:**
${draft.lyrics}

**AGENT CRITIQUES:**
${critiqueSummary}

**YOUR TASK:**
Create a refined version of the lyrics that:
1. Fixes ALL critical issues
2. Addresses top moderate issues where they don't conflict
3. Preserves what's working well
4. Maintains the original structure and length (under 30 lines)

**RULES:**
- When agents disagree, prioritize the specialist in their domain
  (Lyricist for word choice, Vocal Coach for singability, etc.)
- Don't over-polish - keep the song's original vibe
- Make surgical changes, not complete rewrites
- Preserve all [Section] tags and structure

Return:
{
  "refinedLyrics": "complete refined lyrics with all tags",
  "changesApplied": ["Changed line 3 in Verse 1 to fix cliché", "Removed consonant cluster in Chorus"],
  "qualityScore": 85,
  "reasoning": "Applied 5 critical fixes..."
}
`;
}

function extractDebates(critiques: AgentCritique[]): AgentDebate[] {
  // Find issues where multiple agents commented on the same location
  const locationMap = new Map<string, Array<{ agent: string; issue: string; suggestion: string }>>();
  
  critiques.forEach(critique => {
    critique.specificIssues.forEach(issue => {
      if (!locationMap.has(issue.location)) {
        locationMap.set(issue.location, []);
      }
      locationMap.get(issue.location)!.push({
        agent: critique.agent,
        issue: issue.issue,
        suggestion: issue.suggestion
      });
    });
  });
  
  // Create debates for locations with multiple agent opinions
  const debates: AgentDebate[] = [];
  
  locationMap.forEach((opinions, location) => {
    if (opinions.length >= 2) {
      debates.push({
        issue: `Conflict at ${location}`,
        votes: opinions.map(op => ({
          agent: op.agent as 'Lyricist' | 'Storyteller' | 'Vocal Coach' | 'Producer' | 'Hitmaker',
          position: 'COMPROMISE' as const,
          reasoning: `${op.issue} - suggests: ${op.suggestion}`
        })),
        resolution: {
          decision: 'COMPROMISE',
          rationale: `Multiple agents identified issues at ${location} - Judge will synthesize best solution`
        }
      });
    }
  });
  
  return debates;
}

function extractStructure(lyrics: string): string {
  const sections = lyrics.match(/\[([^\]]+)\]/g) || [];
  return sections.join(' → ');
}

// ============================================================================
// MAIN ORCHESTRATOR
// ============================================================================

export async function generateSongWithRealAgents(
  inputs: SongInputs,
  systemInstruction: string,
  songSchema: Schema,
  onProgress?: (stage: string, detail?: string) => void
): Promise<{ song: GeneratedSong; refinement: RefinementResult }> {
  
  // Step 1: Initial Draft
  if (onProgress) onProgress('draft', 'Generating initial draft...');
  const draft = await generateInitialDraft(inputs, systemInstruction, songSchema);
  
  // Step 2: Agent Critiques
  if (onProgress) onProgress('critique', 'Agents reviewing draft...');
  const critiques = await gatherAgentCritiques(draft, inputs, (agent, completed, total) => {
    if (onProgress) onProgress('critique', `${agent} reviewing... (${completed}/${total})`);
  });
  
  // Step 3: Judge Synthesis
  if (onProgress) onProgress('refine', 'Judge synthesizing improvements...');
  const refinement = await synthesizeRefinement(draft, critiques, inputs);
  
  // Step 4: Apply refinements
  const finalSong: GeneratedSong = {
    ...draft,
    lyrics: refinement.refinedLyrics,
    agentDebates: refinement.agentDebates
  };
  
  if (onProgress) onProgress('complete', `Quality: ${refinement.qualityScore}/100`);
  
  console.log('🎉 Real agent system complete!');
  console.log(`   Iterations: ${refinement.iterationCount}`);
  console.log(`   Changes applied: ${refinement.changesApplied.length}`);
  console.log(`   Debates resolved: ${refinement.agentDebates.length}`);
  
  return { song: finalSong, refinement };
}
