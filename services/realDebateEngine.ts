/**
 * REAL DEBATE ENGINE (v5 Architecture)
 * 
 * Transforms fake agent votes into REAL AI conversations.
 * 
 * The 5 agents:
 * - DISCUSS the song's qualities
 * - CHALLENGE each other's ideas
 * - QUESTION assumptions
 * - PROPOSE improvements
 * - BOUNCE ideas off each other
 * 
 * ❌ They do NOT produce scores (Analyst does that)
 * ✅ They have real conversations
 * 
 * @see BOARD_DIRECTIVE_v5_FINAL.md for architecture
 */

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedSong } from "../types";
import { StructuralScanResult } from './structuralScanService';

// @ts-ignore - Vite env types
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface DebateTurn {
  agent: string;
  statement: string;
  type: 'observation' | 'challenge' | 'proposal' | 'counter' | 'agreement' | 'question';
  timestamp: number;
  referencedAgent?: string; // Who they're responding to
  citedLines?: number[];   // Line numbers they reference
}

export interface DebateTopic {
  topic: string;
  turns: DebateTurn[];
  outcome: 'consensus' | 'split' | 'unresolved';
  keyAgreements: string[];
  keyDisagreements: string[];
  proposals: string[];
}

export interface DebateTranscript {
  topics: DebateTopic[];
  fullTranscript: string;
  turnCount: number;
  startTime: number;
  endTime: number;
  participatingAgents: string[];
}

// ============================================================
// AGENT PERSONAS
// ============================================================

interface AgentPersona {
  name: string;
  model: string;
  expertise: string;
  voice: string;
  priorities: string[];
  adversarialTriggers: string[]; // Topics that make this agent push back
}

const AGENT_PERSONAS: Record<string, AgentPersona> = {
  Lyricist: {
    name: 'Lyricist',
    model: 'gemini-2.5-pro-preview-05-06',
    expertise: 'Word choice, originality, metaphors, clichés, wordplay',
    voice: 'Push for creative, unexpected language. Challenge common phrases. Defend artistic integrity.',
    priorities: ['originality', 'fresh metaphors', 'avoiding clichés', 'clever wordplay'],
    adversarialTriggers: ['generic phrases', 'overused metaphors', 'safe word choices', 'clichés']
  },
  Storyteller: {
    name: 'Storyteller',
    model: 'gemini-2.5-pro-preview-05-06',
    expertise: 'Narrative arc, emotional journey, thematic cohesion, character consistency',
    voice: 'Defend story integrity. Focus on emotional impact. Ensure the song tells a complete story.',
    priorities: ['emotional arc', 'thematic unity', 'character voice', 'narrative payoff'],
    adversarialTriggers: ['broken narrative', 'inconsistent voice', 'unearned emotion', 'thematic drift']
  },
  Hitmaker: {
    name: 'Hitmaker',
    model: 'gemini-2.5-pro-preview-05-06',
    expertise: 'Commercial viability, hooks, memorability, radio appeal, streaming potential',
    voice: 'Cite DNA match evidence. Prioritize accessibility. Defend proven hit formulas.',
    priorities: ['hook strength', 'memorability', 'commercial appeal', 'repeat listenability'],
    adversarialTriggers: ['obscure references', 'overly complex lyrics', 'weak hooks', 'uncommercial choices']
  },
  Producer: {
    name: 'Producer',
    model: 'gemini-3-pro-preview',
    expertise: 'Structure, pacing, syllable counts, arrangement, section flow',
    voice: 'Guard technical constraints. Provide feasibility checks. Ensure structural integrity.',
    priorities: ['syllable balance', 'section pacing', 'dynamic range', 'structural flow'],
    adversarialTriggers: ['syllable overflow', 'pacing issues', 'structural problems', 'rushed sections']
  },
  VocalCoach: {
    name: 'Vocal Coach',
    model: 'gemini-2.0-flash',
    expertise: 'Phonetics, singability, breath points, consonant clusters, vowel placement',
    voice: 'Focus on how words feel to sing. Identify flow issues. Ground discussions in vocal reality.',
    priorities: ['singability', 'breath control', 'vowel placement', 'consonant flow'],
    adversarialTriggers: ['unsingable phrases', 'consonant clusters', 'missing breath points', 'vocal strain']
  }
};

// ============================================================
// DEBATE PROMPTS
// ============================================================

function createOpeningPrompt(agent: AgentPersona, lyrics: string, structuralScan: StructuralScanResult): string {
  return `You are ${agent.name}, a music industry expert.

## YOUR EXPERTISE
${agent.expertise}

## YOUR VOICE
${agent.voice}

## YOUR PRIORITIES
${agent.priorities.map(p => `- ${p}`).join('\n')}

## THE SONG
${lyrics}

## STRUCTURAL DATA
DNA Match: ${structuralScan.dnaMatch.songTitle} by ${structuralScan.dnaMatch.artist} (${structuralScan.dnaMatch.matchPercentage}% match)
Structure: ${structuralScan.structure.format}
Rhyme Scheme: ${structuralScan.rhymeScheme.pattern}

## YOUR TASK
Share your INITIAL OBSERVATION about this song from your expertise perspective.

RULES:
- Speak in first person ("I notice...", "From my perspective...")
- Be specific - cite LINE NUMBERS when referencing lyrics
- 2-4 sentences maximum
- DO NOT score the song - just share observations
- Focus on what stands out (good OR concerning)`;
}

function createResponsePrompt(
  agent: AgentPersona, 
  previousTurns: DebateTurn[], 
  lyrics: string
): string {
  const transcript = previousTurns
    .map(t => `**${t.agent}** [${t.type}]: ${t.statement}`)
    .join('\n\n');

  return `You are ${agent.name}, a music industry expert.

## YOUR EXPERTISE
${agent.expertise}

## YOUR VOICE
${agent.voice}

## WHAT TO WATCH FOR (Your Adversarial Triggers)
When you hear arguments touching on these, PUSH BACK:
${agent.adversarialTriggers.map(t => `- ${t}`).join('\n')}

## THE DISCUSSION SO FAR
${transcript}

## THE LYRICS (for reference)
${lyrics}

## YOUR TASK
Respond to the most relevant point from another agent.

OPTIONS:
1. **AGREE & ADD** - If you agree, say so and ADD to their point
2. **CHALLENGE** - If you disagree, explain why from YOUR expertise
3. **QUESTION** - If you need clarification, ask
4. **PROPOSE** - If you have an alternative idea, share it

RULES:
- Stay in character as ${agent.name}
- Be constructive but don't be a pushover
- If your expertise is relevant to what was said, assert your view
- 2-3 sentences maximum
- Cite specific line numbers when relevant`;
}

function createSynthesisPrompt(
  agent: AgentPersona, 
  allTurns: DebateTurn[], 
  lyrics: string
): string {
  const transcript = allTurns
    .map(t => `**${t.agent}** [${t.type}]: ${t.statement}`)
    .join('\n\n');

  return `You are ${agent.name}. The debate is wrapping up.

## THE FULL DISCUSSION
${transcript}

## YOUR TASK
Give your FINAL POSITION based on the discussion.

Include:
1. What you think the KEY TAKEAWAY is
2. Any recommendation you want to make
3. Any concerns that weren't resolved

RULES:
- 2-3 sentences maximum
- Be decisive - this is your final word
- Acknowledge valid points others made`;
}

// ============================================================
// DEBATE ENGINE
// ============================================================

/**
 * Conduct a real debate between 5 agents.
 * 
 * This is the core of the v5 architecture - real conversations, not fake votes.
 * 
 * @param song - The generated song to debate
 * @param structuralScan - Results from structural scan
 * @param onTurn - Callback for real-time streaming of turns
 * @returns DebateTranscript with full conversation
 */
export async function conductRealDebate(
  song: GeneratedSong,
  structuralScan: StructuralScanResult,
  onTurn?: (turn: DebateTurn) => void
): Promise<DebateTranscript> {
  const startTime = Date.now();
  const allTurns: DebateTurn[] = [];
  const lyrics = song.lyrics;
  
  console.log('🗣️ Starting real 5-agent debate...');
  
  // ============================================================
  // PHASE 1: Opening Observations (Parallel - 2-3s)
  // ============================================================
  console.log('  📝 Phase 1: Opening observations...');
  
  const openingPromises = Object.entries(AGENT_PERSONAS).map(async ([key, persona]) => {
    const prompt = createOpeningPrompt(persona, lyrics, structuralScan);
    
    try {
      const response = await ai.models.generateContent({
        model: persona.model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          temperature: 0.8,
          maxOutputTokens: 200,
        }
      });
      
      const statement = response.text?.trim() || 'No observation provided.';
      
      // Extract cited lines from the statement
      const lineMatches = statement.match(/line\s*(\d+)/gi) || [];
      const citedLines = lineMatches.map(m => parseInt(m.replace(/\D/g, '')));
      
      const turn: DebateTurn = {
        agent: persona.name,
        statement,
        type: 'observation',
        timestamp: Date.now(),
        citedLines
      };
      
      onTurn?.(turn);
      return turn;
      
    } catch (error) {
      console.warn(`  ⚠️ ${persona.name} failed to respond:`, error);
      return {
        agent: persona.name,
        statement: `[${persona.name} declined to comment]`,
        type: 'observation' as const,
        timestamp: Date.now()
      };
    }
  });
  
  const openingTurns = await Promise.all(openingPromises);
  allTurns.push(...openingTurns);
  
  console.log(`  ✅ ${openingTurns.length} opening observations complete`);
  
  // ============================================================
  // PHASE 2: Discussion & Challenge (Sequential - 5-8s)
  // ============================================================
  console.log('  💬 Phase 2: Discussion round...');
  
  // Each agent responds to others (in order of expertise hierarchy)
  const discussionOrder = ['VocalCoach', 'Producer', 'Hitmaker', 'Storyteller', 'Lyricist'];
  
  for (const agentKey of discussionOrder) {
    const persona = AGENT_PERSONAS[agentKey];
    const prompt = createResponsePrompt(persona, allTurns, lyrics);
    
    try {
      const response = await ai.models.generateContent({
        model: persona.model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          temperature: 0.8,
          maxOutputTokens: 200,
        }
      });
      
      const statement = response.text?.trim() || 'No response provided.';
      
      // Determine turn type based on content
      let type: DebateTurn['type'] = 'agreement';
      const lower = statement.toLowerCase();
      if (lower.includes('disagree') || lower.includes('but ') || lower.includes('however') || lower.includes('concern')) {
        type = 'challenge';
      } else if (lower.includes('propose') || lower.includes('what if') || lower.includes('suggest') || lower.includes('could we')) {
        type = 'proposal';
      } else if (lower.includes('?') && (lower.includes('how') || lower.includes('why') || lower.includes('what'))) {
        type = 'question';
      }
      
      // Find who they're responding to
      const referencedAgent = allTurns.find(t => 
        statement.toLowerCase().includes(t.agent.toLowerCase())
      )?.agent;
      
      const turn: DebateTurn = {
        agent: persona.name,
        statement,
        type,
        timestamp: Date.now(),
        referencedAgent
      };
      
      onTurn?.(turn);
      allTurns.push(turn);
      
    } catch (error) {
      console.warn(`  ⚠️ ${persona.name} discussion failed:`, error);
    }
  }
  
  console.log(`  ✅ Discussion round complete (${allTurns.length} total turns)`);
  
  // ============================================================
  // PHASE 3: Second Discussion Round (More focused challenges)
  // ============================================================
  console.log('  🔥 Phase 3: Challenge round...');
  
  // Identify agents with opposing views and have them debate
  const challenges = identifyChallengeOpportunities(allTurns);
  
  for (const { challenger, target, topic } of challenges.slice(0, 3)) {
    const persona = AGENT_PERSONAS[challenger];
    
    const challengePrompt = `You are ${persona.name}. 

In this debate, ${target} said something you should CHALLENGE based on your expertise.

Their statement: "${allTurns.find(t => t.agent === target)?.statement}"

Your expertise says this is problematic because of: ${topic}

Deliver a focused, constructive challenge. Be specific. 1-2 sentences.`;

    try {
      const response = await ai.models.generateContent({
        model: persona.model,
        contents: [{ parts: [{ text: challengePrompt }] }],
        config: {
          temperature: 0.9,
          maxOutputTokens: 150,
        }
      });
      
      const statement = response.text?.trim() || '';
      
      if (statement) {
        const turn: DebateTurn = {
          agent: persona.name,
          statement,
          type: 'counter',
          timestamp: Date.now(),
          referencedAgent: target
        };
        
        onTurn?.(turn);
        allTurns.push(turn);
      }
      
    } catch (error) {
      console.warn(`  ⚠️ Challenge from ${challenger} failed:`, error);
    }
  }
  
  // ============================================================
  // PHASE 4: Final Positions (Parallel - 2-3s)
  // ============================================================
  console.log('  🎯 Phase 4: Final positions...');
  
  const synthesisPromises = Object.entries(AGENT_PERSONAS).map(async ([key, persona]) => {
    const prompt = createSynthesisPrompt(persona, allTurns, lyrics);
    
    try {
      const response = await ai.models.generateContent({
        model: persona.model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          temperature: 0.7,
          maxOutputTokens: 150,
        }
      });
      
      const statement = response.text?.trim() || 'No final position.';
      
      const turn: DebateTurn = {
        agent: persona.name,
        statement,
        type: 'agreement',
        timestamp: Date.now()
      };
      
      onTurn?.(turn);
      return turn;
      
    } catch (error) {
      console.warn(`  ⚠️ ${persona.name} synthesis failed:`, error);
      return null;
    }
  });
  
  const synthesisTurns = (await Promise.all(synthesisPromises)).filter(Boolean) as DebateTurn[];
  allTurns.push(...synthesisTurns);
  
  const endTime = Date.now();
  console.log(`✅ Debate complete: ${allTurns.length} turns in ${(endTime - startTime) / 1000}s`);
  
  // ============================================================
  // BUILD TRANSCRIPT
  // ============================================================
  
  const fullTranscript = allTurns
    .map(t => `**${t.agent}** [${t.type}]:\n${t.statement}`)
    .join('\n\n---\n\n');
  
  // Extract key agreements and disagreements
  const { agreements, disagreements, proposals } = extractDebateOutcomes(allTurns);
  
  return {
    topics: [{
      topic: 'Full Song Analysis',
      turns: allTurns,
      outcome: disagreements.length === 0 ? 'consensus' : 'split',
      keyAgreements: agreements,
      keyDisagreements: disagreements,
      proposals
    }],
    fullTranscript,
    turnCount: allTurns.length,
    startTime,
    endTime,
    participatingAgents: Object.keys(AGENT_PERSONAS)
  };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

interface ChallengeOpportunity {
  challenger: string;
  target: string;
  topic: string;
}

function identifyChallengeOpportunities(turns: DebateTurn[]): ChallengeOpportunity[] {
  const opportunities: ChallengeOpportunity[] = [];
  
  // Lyricist vs Hitmaker (originality vs commercial)
  const lyricistTurn = turns.find(t => t.agent === 'Lyricist');
  const hitmakerTurn = turns.find(t => t.agent === 'Hitmaker');
  
  if (lyricistTurn && hitmakerTurn) {
    if (lyricistTurn.statement.toLowerCase().includes('cliché') || 
        lyricistTurn.statement.toLowerCase().includes('generic')) {
      opportunities.push({
        challenger: 'Hitmaker',
        target: 'Lyricist',
        topic: 'commercial viability of familiar phrases'
      });
    }
    if (hitmakerTurn.statement.toLowerCase().includes('hook') ||
        hitmakerTurn.statement.toLowerCase().includes('catchy')) {
      opportunities.push({
        challenger: 'Lyricist',
        target: 'Hitmaker',
        topic: 'originality over commercial formulas'
      });
    }
  }
  
  // Producer vs Storyteller (structure vs narrative)
  const producerTurn = turns.find(t => t.agent === 'Producer');
  const storytellerTurn = turns.find(t => t.agent === 'Storyteller');
  
  if (producerTurn && storytellerTurn) {
    if (producerTurn.statement.toLowerCase().includes('syllable') ||
        producerTurn.statement.toLowerCase().includes('pacing')) {
      opportunities.push({
        challenger: 'Storyteller',
        target: 'Producer',
        topic: 'narrative flow over technical constraints'
      });
    }
  }
  
  // Vocal Coach vs anyone with difficult phrasing
  const vocalCoachTurn = turns.find(t => t.agent === 'Vocal Coach');
  if (vocalCoachTurn && vocalCoachTurn.statement.toLowerCase().includes('difficult')) {
    opportunities.push({
      challenger: 'Lyricist',
      target: 'Vocal Coach',
      topic: 'artistic expression over singability'
    });
  }
  
  return opportunities;
}

function extractDebateOutcomes(turns: DebateTurn[]): {
  agreements: string[];
  disagreements: string[];
  proposals: string[];
} {
  const agreements: string[] = [];
  const disagreements: string[] = [];
  const proposals: string[] = [];
  
  for (const turn of turns) {
    if (turn.type === 'agreement') {
      // Extract the key point from agreement statements
      const match = turn.statement.match(/agree|strength|works well|effective/i);
      if (match) {
        agreements.push(`${turn.agent}: ${turn.statement.substring(0, 100)}...`);
      }
    }
    
    if (turn.type === 'challenge' || turn.type === 'counter') {
      disagreements.push(`${turn.agent}: ${turn.statement.substring(0, 100)}...`);
    }
    
    if (turn.type === 'proposal') {
      proposals.push(`${turn.agent}: ${turn.statement}`);
    }
  }
  
  return {
    agreements: agreements.slice(0, 5),
    disagreements: disagreements.slice(0, 5),
    proposals: proposals.slice(0, 5)
  };
}

// ============================================================
// FOCUSED DEBATE (Single Topic)
// ============================================================

/**
 * Conduct a focused debate on a specific topic or proposed change.
 * Use this for targeted discussions about one issue.
 */
export async function conductFocusedDebate(
  topic: string,
  lyrics: string,
  structuralScan: StructuralScanResult,
  relevantLines?: number[],
  onTurn?: (turn: DebateTurn) => void
): Promise<DebateTopic> {
  const turns: DebateTurn[] = [];
  const linesContext = relevantLines 
    ? lyrics.split('\n').filter((_, i) => relevantLines.includes(i + 1)).join('\n')
    : lyrics;
  
  console.log(`🎯 Focused debate: "${topic}"`);
  
  // Each agent weighs in on the specific topic
  for (const [key, persona] of Object.entries(AGENT_PERSONAS)) {
    const prompt = `You are ${persona.name}, expert in ${persona.expertise}.

TOPIC FOR DEBATE: "${topic}"

RELEVANT LYRICS:
${linesContext}

Give your position on this topic from your expertise. Be specific and constructive.
1-2 sentences maximum.`;

    try {
      const response = await ai.models.generateContent({
        model: persona.model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          temperature: 0.8,
          maxOutputTokens: 150,
        }
      });
      
      const statement = response.text?.trim() || '';
      
      if (statement) {
        const turn: DebateTurn = {
          agent: persona.name,
          statement,
          type: 'observation',
          timestamp: Date.now(),
          citedLines: relevantLines
        };
        
        onTurn?.(turn);
        turns.push(turn);
      }
    } catch (error) {
      console.warn(`  ⚠️ ${persona.name} failed on focused debate`);
    }
  }
  
  const { agreements, disagreements, proposals } = extractDebateOutcomes(turns);
  
  return {
    topic,
    turns,
    outcome: disagreements.length === 0 ? 'consensus' : (disagreements.length > 2 ? 'split' : 'consensus'),
    keyAgreements: agreements,
    keyDisagreements: disagreements,
    proposals
  };
}

// ============================================================
// EXPORTS
// ============================================================

export { AGENT_PERSONAS };
