/**
 * 5-AGENT SPECIALIZED ANALYSIS SYSTEM
 * 
 * Five specialized agents collaborate on song analysis with distinct expertise areas.
 * Each agent owns specific scoring categories and provides evidence-based feedback.
 * 
 * AGENTS:
 * 1. Lyricist - Lyrical Originality
 * 2. Storyteller - Narrative Arc, Imagery, Thematic Cohesion, Emotional Impact
 * 3. Vocal Coach - Vocal Playability, Melodic & Phonetic Flow
 * 4. Producer - Sonic Density, Structure & Pacing
 * 5. Hitmaker - Hook Factor, Commercial Potential (using Hook Factor for scoring)
 */

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedSong, ScoringCategory, ScoreComponent } from "../types";

// Import all 5 specialized agents
import { analyzeLyricist, lyricistDebate, type LyricistAnalysis } from './lyricistAgent';
import { analyzeStoryteller, storytellerDebate, type StorytellerAnalysis } from './storytellerAgent';
import { analyzeVocalCoach, vocalCoachDebate, type VocalCoachAnalysis } from './vocalCoachAgent';
import { analyzeProducer, producerDebate, type ProducerAnalysis } from './producerAgent';
import { analyzeHitmaker, hitmakerDebate, type HitmakerAnalysis } from './hitmakerAgent';

// @ts-ignore - Vite env types
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

/**
 * 5-AGENT ANALYSIS RESULT
 * Combines all agent perspectives into unified analysis
 */
export interface FiveAgentAnalysis {
  // Individual agent analyses
  lyricist: LyricistAnalysis;
  storyteller: StorytellerAnalysis;
  vocalCoach: VocalCoachAnalysis;
  producer: ProducerAnalysis;
  hitmaker: HitmakerAnalysis;
  
  // Consolidated scores (all 10 categories)
  scoreBreakdown: ScoreComponent[];
  overallScore: number;
  
  // Cross-agent insights
  consensusStrengths: string[]; // What all agents agree is good
  consensusWeaknesses: string[]; // What all agents agree needs work
  tradeoffDecisions: { area: string; priority: string; reasoning: string }[];
}

/**
 * Run 5-agent analysis in parallel
 * Each agent analyzes the song from their expertise area
 */
export async function run5AgentAnalysis(
  song: GeneratedSong,
  inputs: any,
  programmaticScores?: any,
  sonicAnalysis?: any,
  onProgress?: (agent: string, completed: number, total: number) => void
): Promise<FiveAgentAnalysis> {
  
  console.log('🎭 Starting 5-agent parallel analysis...');
  
  // Run all 5 agents in parallel for speed
  const [lyricist, storyteller, vocalCoach, producer, hitmaker] = await Promise.all([
    analyzeLyricist(song, inputs).then(result => {
      if (onProgress) onProgress('Lyricist', 1, 5);
      return result;
    }),
    analyzeStoryteller(song, inputs, programmaticScores).then(result => {
      if (onProgress) onProgress('Storyteller', 2, 5);
      return result;
    }),
    analyzeVocalCoach(song, inputs, programmaticScores).then(result => {
      if (onProgress) onProgress('Vocal Coach', 3, 5);
      return result;
    }),
    analyzeProducer(song, inputs, sonicAnalysis).then(result => {
      if (onProgress) onProgress('Producer', 4, 5);
      return result;
    }),
    analyzeHitmaker(song, inputs, programmaticScores).then(result => {
      if (onProgress) onProgress('Hitmaker', 5, 5);
      return result;
    })
  ]);
  
  console.log('✅ All 5 agents completed analysis');
  
  // Consolidate into scoreBreakdown (all 10 categories)
  const scoreBreakdown: ScoreComponent[] = [
    // Lyricist (1 category)
    {
      category: lyricist.category,
      score: lyricist.score,
      reason: lyricist.reasoning,
      agent: 'Lyricist'
    },
    
    // Storyteller (4 categories)
    {
      category: storyteller.narrativeArc.category,
      score: storyteller.narrativeArc.score,
      reason: storyteller.narrativeArc.reasoning,
      agent: 'Storyteller'
    },
    {
      category: storyteller.imagerySensory.category,
      score: storyteller.imagerySensory.score,
      reason: storyteller.imagerySensory.reasoning,
      agent: 'Storyteller'
    },
    {
      category: storyteller.thematicCohesion.category,
      score: storyteller.thematicCohesion.score,
      reason: storyteller.thematicCohesion.reasoning,
      agent: 'Storyteller'
    },
    {
      category: storyteller.emotionalImpact.category,
      score: storyteller.emotionalImpact.score,
      reason: storyteller.emotionalImpact.reasoning,
      agent: 'Storyteller'
    },
    
    // Vocal Coach (2 categories)
    {
      category: vocalCoach.vocalPlayability.category,
      score: vocalCoach.vocalPlayability.score,
      reason: vocalCoach.vocalPlayability.reasoning,
      agent: 'Vocal Coach'
    },
    {
      category: vocalCoach.melodicFlow.category,
      score: vocalCoach.melodicFlow.score,
      reason: vocalCoach.melodicFlow.reasoning,
      agent: 'Vocal Coach'
    },
    
    // Producer (2 categories - Sonic Density + Structure & Pacing)
    {
      category: producer.sonicDensity.category,
      score: producer.sonicDensity.score,
      reason: producer.sonicDensity.reasoning,
      agent: 'Producer'
    },
    {
      category: producer.structurePacing.category,
      score: producer.structurePacing.score,
      reason: producer.structurePacing.reasoning,
      agent: 'Producer'
    },
    
    // Hitmaker (2 categories - Hook Factor + Commercial Potential)
    {
      category: hitmaker.hookFactor.category,
      score: hitmaker.hookFactor.score,
      reason: hitmaker.hookFactor.reasoning,
      agent: 'Hitmaker'
    },
    {
      category: hitmaker.commercialPotential.category,
      score: hitmaker.commercialPotential.score,
      reason: hitmaker.commercialPotential.reasoning,
      agent: 'Hitmaker'
    }
  ];
  
  // Calculate overall score (average of all 10 categories)
  const totalScore = scoreBreakdown.reduce((sum, item) => sum + item.score, 0);
  const overallScore = Math.round((totalScore / scoreBreakdown.length) * 10) / 10;
  
  // Identify consensus strengths (agents agree on what's good)
  const consensusStrengths = identifyConsensusStrengths(lyricist, storyteller, vocalCoach, producer, hitmaker);
  const consensusWeaknesses = identifyConsensusWeaknesses(lyricist, storyteller, vocalCoach, producer, hitmaker);
  
  // Identify tradeoff decisions (when optimization conflicts)
  const tradeoffDecisions = identifyTradeoffs(lyricist, storyteller, vocalCoach, producer, hitmaker);
  
  return {
    lyricist,
    storyteller,
    vocalCoach,
    producer,
    hitmaker,
    scoreBreakdown,
    overallScore,
    consensusStrengths,
    consensusWeaknesses,
    tradeoffDecisions
  };
}

/**
 * Identify what all agents agree is strong
 */
function identifyConsensusStrengths(...agents: any[]): string[] {
  const strengths: string[] = [];
  
  // Look for patterns across agent feedback
  agents.forEach(agent => {
    if (agent.strengthExamples) strengths.push(...agent.strengthExamples);
    if (agent.hookStrengths) strengths.push(...agent.hookStrengths);
    if (agent.rhythmicStrengths) strengths.push(...agent.rhythmicStrengths);
  });
  
  // Return unique strengths
  return [...new Set(strengths)].slice(0, 5);
}

/**
 * Identify what all agents agree needs work
 */
function identifyConsensusWeaknesses(...agents: any[]): string[] {
  const weaknesses: string[] = [];
  
  agents.forEach(agent => {
    if (agent.improvementOpportunities) weaknesses.push(...agent.improvementOpportunities);
    if (agent.clicheDetection?.found) weaknesses.push(...agent.clicheDetection.found.map((c: string) => `Cliché: ${c}`));
    if (agent.vocalPlayability?.breathIssues) weaknesses.push(...agent.vocalPlayability.breathIssues.map((b: any) => `Line ${b.lineNumber}: ${b.issue}`));
    if (agent.hookWeaknesses) weaknesses.push(...agent.hookWeaknesses);
  });
  
  return [...new Set(weaknesses)].slice(0, 5);
}

/**
 * Identify optimization tradeoffs
 */
function identifyTradeoffs(...agents: any[]): { area: string; priority: string; reasoning: string }[] {
  // This is a simplified version - could be enhanced with AI to detect conflicts
  const tradeoffs: { area: string; priority: string; reasoning: string }[] = [];
  
  // Example: If singability is weak but emotional impact is strong
  // This would indicate a tradeoff decision was made
  
  return tradeoffs;
}

/**
 * 5-AGENT DEBATE RESULT
 * Captures all agent opinions on a proposed change
 */
export interface FiveAgentDebateResult {
  proposedChange: string;
  
  // All 5 agent opinions
  lyricistPosition: { position: 'SUPPORT' | 'OPPOSE' | 'COMPROMISE'; reasoning: string; alternative?: string };
  storytellerPosition: { position: 'SUPPORT' | 'OPPOSE' | 'COMPROMISE'; reasoning: string; alternative?: string };
  vocalCoachPosition: { position: 'SUPPORT' | 'OPPOSE' | 'COMPROMISE'; reasoning: string; alternative?: string };
  producerPosition: { position: 'SUPPORT' | 'OPPOSE' | 'COMPROMISE'; reasoning: string; alternative?: string };
  hitmakerPosition: { position: 'SUPPORT' | 'OPPOSE' | 'COMPROMISE'; reasoning: string; alternative?: string };
  
  // Judge's synthesis
  resolution: {
    decision: 'ADOPT' | 'REJECT' | 'COMPROMISE';
    finalChange: string; // What actually gets implemented
    rationale: string; // Why this decision was made
    voteTally: string; // e.g., "3 Support, 1 Oppose, 1 Compromise"
  };
}

/**
 * Run 5-agent debate on a proposed change
 * All agents vote, then a judge synthesizes the final decision
 */
export async function run5AgentDebate(
  song: GeneratedSong,
  originalLine: string,
  proposedLine: string,
  context: string,
  onProgress?: (agent: string, completed: number, total: number) => void
): Promise<FiveAgentDebateResult> {
  
  console.log('🎭 Starting 5-agent debate...');
  
  // Run all 5 agents in parallel
  const [lyricist, storyteller, vocalCoach, producer, hitmaker] = await Promise.all([
    lyricistDebate(song, originalLine, proposedLine, context).then(result => {
      if (onProgress) onProgress('Lyricist', 1, 5);
      return result;
    }),
    storytellerDebate(song, originalLine, proposedLine, context).then(result => {
      if (onProgress) onProgress('Storyteller', 2, 5);
      return result;
    }),
    vocalCoachDebate(song, originalLine, proposedLine, context).then(result => {
      if (onProgress) onProgress('Vocal Coach', 3, 5);
      return result;
    }),
    producerDebate(song, originalLine, proposedLine, context).then(result => {
      if (onProgress) onProgress('Producer', 4, 5);
      return result;
    }),
    hitmakerDebate(song, originalLine, proposedLine, context).then(result => {
      if (onProgress) onProgress('Hitmaker', 5, 5);
      return result;
    })
  ]);
  
  console.log('✅ All 5 agents voted on proposed change');
  
  // Count votes
  const votes = [lyricist, storyteller, vocalCoach, producer, hitmaker];
  const supportCount = votes.filter(v => v.position === 'SUPPORT').length;
  const opposeCount = votes.filter(v => v.position === 'OPPOSE').length;
  const compromiseCount = votes.filter(v => v.position === 'COMPROMISE').length;
  
  const voteTally = `${supportCount} Support, ${opposeCount} Oppose, ${compromiseCount} Compromise`;
  
  // Synthesize resolution based on votes
  let resolution: FiveAgentDebateResult['resolution'];
  
  if (supportCount >= 3) {
    // Clear majority support - adopt the change
    resolution = {
      decision: 'ADOPT',
      finalChange: proposedLine,
      rationale: `Majority support (${supportCount}/5 agents). ${votes.filter(v => v.position === 'SUPPORT').map(v => v.reasoning).join(' ')}`,
      voteTally
    };
  } else if (opposeCount >= 3) {
    // Clear majority opposition - reject the change
    resolution = {
      decision: 'REJECT',
      finalChange: originalLine,
      rationale: `Majority opposition (${opposeCount}/5 agents). ${votes.filter(v => v.position === 'OPPOSE').map(v => v.reasoning).join(' ')}`,
      voteTally
    };
  } else {
    // Mixed votes or majority compromise - need judge to synthesize
    resolution = await synthesize5AgentCompromise(
      song,
      originalLine,
      proposedLine,
      lyricist,
      storyteller,
      vocalCoach,
      producer,
      hitmaker,
      voteTally
    );
  }
  
  return {
    proposedChange: proposedLine,
    lyricistPosition: lyricist,
    storytellerPosition: storyteller,
    vocalCoachPosition: vocalCoach,
    producerPosition: producer,
    hitmakerPosition: hitmaker,
    resolution
  };
}

/**
 * Judge synthesizes a compromise when votes are mixed
 */
async function synthesize5AgentCompromise(
  song: GeneratedSong,
  originalLine: string,
  proposedLine: string,
  lyricist: any,
  storyteller: any,
  vocalCoach: any,
  producer: any,
  hitmaker: any,
  voteTally: string
): Promise<FiveAgentDebateResult['resolution']> {
  
  const prompt = `
You are the JUDGE in a 5-agent debate system. Five specialized agents have voted on a proposed line change.

**VOTE TALLY:** ${voteTally}

**ORIGINAL LINE:** "${originalLine}"
**PROPOSED LINE:** "${proposedLine}"

**AGENT OPINIONS:**

**LYRICIST** (${lyricist.position}):
${lyricist.reasoning}
${lyricist.alternative ? `Suggested alternative: "${lyricist.alternative}"` : ''}

**STORYTELLER** (${storyteller.position}):
${storyteller.reasoning}
${storyteller.alternative ? `Suggested alternative: "${storyteller.alternative}"` : ''}

**VOCAL COACH** (${vocalCoach.position}):
${vocalCoach.reasoning}
${vocalCoach.alternative ? `Suggested alternative: "${vocalCoach.alternative}"` : ''}

**PRODUCER** (${producer.position}):
${producer.reasoning}
${producer.alternative ? `Suggested alternative: "${producer.alternative}"` : ''}

**HITMAKER** (${hitmaker.position}):
${hitmaker.reasoning}
${hitmaker.alternative ? `Suggested alternative: "${hitmaker.alternative}"` : ''}

**YOUR TASK:**
Create a compromise that respects all five perspectives:
1. Identify which concerns are most critical (affect multiple categories)
2. Find middle ground that satisfies the majority
3. Propose a SPECIFIC line (not vague - actual lyrics)

**OUTPUT:**
decision: "COMPROMISE"
finalChange: [The actual revised line that balances all concerns]
rationale: [Why this compromise works - cite specific agent concerns]
voteTally: "${voteTally}"
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          decision: { type: Type.STRING, enum: ['COMPROMISE'] },
          finalChange: { type: Type.STRING },
          rationale: { type: Type.STRING },
          voteTally: { type: Type.STRING }
        },
        required: ['decision', 'finalChange', 'rationale', 'voteTally']
      },
      systemInstruction: `You are a fair judge synthesizing the best of all five perspectives. Your compromise must be SPECIFIC (actual lyrics) and cite specific agent concerns. Balance artistic depth, commercial appeal, and technical craft.`,
      temperature: 0.8,
      maxOutputTokens: 1024
    }
  });

  if (!response.text) throw new Error("Judge synthesis failed");
  return JSON.parse(response.text);
}

/**
 * Helper: Run debate on multiple line changes
 */
export const debate5AgentLineChanges = async (
  song: GeneratedSong,
  lineChanges: Array<{ lineNumber: number; originalLine: string; newLine: string; reason: string }>,
  onProgress?: (completed: number, total: number) => void
): Promise<FiveAgentDebateResult[]> => {
  
  const results: FiveAgentDebateResult[] = [];
  
  for (let i = 0; i < lineChanges.length; i++) {
    const change = lineChanges[i];
    const context = `Line ${change.lineNumber}: "${change.originalLine}" → "${change.newLine}" (Reason: ${change.reason})`;
    
    try {
      const debate = await run5AgentDebate(song, change.originalLine, change.newLine, context);
      results.push(debate);
      
      if (onProgress) onProgress(i + 1, lineChanges.length);
    } catch (e) {
      console.error(`5-agent debate failed for line ${change.lineNumber}:`, e);
      // Skip this line change if debate fails
    }
  }
  
  return results;
};
