/**
 * JUDGE AGENT SERVICE (v5 Architecture)
 * 
 * The Judge is "the smartest in the room" - listens to the full debate
 * and creates MANDATES (binding decisions) from the discussion.
 * 
 * Role: DECIDES (does NOT score)
 * Model: Gemini 3.0 Pro
 * 
 * Inputs: Full debate transcript from 5 agents
 * Outputs: JudgeSummary with decisions, mandates, and citations
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

export interface DebateTurn {
  agent: string;
  statement: string;
  type: 'observation' | 'challenge' | 'proposal' | 'counter' | 'agreement' | 'question';
  timestamp?: number;
}

export interface DebateTopic {
  topic: string;
  turns: DebateTurn[];
  outcome: 'consensus' | 'split' | 'unresolved';
  agreements?: string[];     // For backward compatibility
  disagreements?: string[];  // For backward compatibility  
  keyAgreements?: string[];  // From realDebateEngine
  keyDisagreements?: string[]; // From realDebateEngine
  proposals?: string[];      // From realDebateEngine
}

export interface DebateTranscript {
  debates?: DebateTopic[];  // Used by structured format
  topics?: DebateTopic[];   // Used by realDebateEngine
  fullTranscript: string;
  startTime?: number;
  endTime?: number;
  turnCount?: number;       // From realDebateEngine
  participatingAgents?: string[];  // From realDebateEngine
}

export interface JudgeDecision {
  topic: string;
  ruling: string;
  winner: string;
  rationale: string;
  citedArguments: string[];
  mandates: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface OverriddenArgument {
  agent: string;
  claim: string;
  overrideReason: string;
}

export interface JudgeSummary {
  decisions: JudgeDecision[];
  overriddenArguments: OverriddenArgument[];
  unresolvedIssues: string[];
  debateDuration: number; // ms
  judgeModel: string;
  timestamp: number;
  
  // For display
  summaryStatement: string;
  mandateCount: number;
}

// ============================================================
// SCHEMA FOR GEMINI RESPONSE
// ============================================================

const JUDGE_SUMMARY_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    decisions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: "What the debate was about" },
          ruling: { type: Type.STRING, description: "The Judge's decision on this topic" },
          winner: { type: Type.STRING, description: "Whose argument prevailed" },
          rationale: { type: Type.STRING, description: "Why this decision was made" },
          citedArguments: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Which arguments from the debate influenced this decision"
          },
          mandates: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific actionable directives for the rewrite"
          },
          confidence: { 
            type: Type.STRING, 
            enum: ["high", "medium", "low"],
            description: "How confident the Judge is in this ruling"
          }
        },
        required: ["topic", "ruling", "winner", "rationale", "citedArguments", "mandates", "confidence"]
      }
    },
    overriddenArguments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          agent: { type: Type.STRING },
          claim: { type: Type.STRING },
          overrideReason: { type: Type.STRING }
        },
        required: ["agent", "claim", "overrideReason"]
      }
    },
    unresolvedIssues: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Topics where no clear decision could be made"
    },
    summaryStatement: {
      type: Type.STRING,
      description: "One-paragraph summary of the Judge's overall assessment"
    }
  },
  required: ["decisions", "overriddenArguments", "unresolvedIssues", "summaryStatement"]
};

// ============================================================
// MAIN FUNCTION
// ============================================================

/**
 * Judge the debate and create mandates.
 * 
 * The Judge is the 6th agent in the v5 architecture.
 * They listen to the full debate and make binding decisions.
 * 
 * @param debateTranscript - Full transcript from the 5-agent debate
 * @param context - Additional context (song title, style, etc.)
 * @returns JudgeSummary with decisions and mandates
 */
export async function judgeDebate(
  debateTranscript: DebateTranscript,
  context?: {
    songTitle?: string;
    style?: string;
    userPreferences?: string[];
  }
): Promise<JudgeSummary> {
  const startTime = Date.now();
  
  console.log('⚖️  Judge reviewing debate...');
  
  const prompt = `You are THE JUDGE - the smartest music expert in the room.

## YOUR ROLE
You have just listened to a debate between 5 music industry specialists:
- Lyricist (word choice, originality, clichés)
- Storyteller (narrative, emotion, imagery)
- Hitmaker (commercial appeal, hooks)
- Producer (structure, pacing, syllables)
- Vocal Coach (phonetics, singability)

Your job is to:
1. Identify the key topics of disagreement
2. RULE on each topic - decide whose argument was stronger
3. Create MANDATES - specific, actionable directives for the song rewrite
4. Cite which expert arguments influenced your decisions

## IMPORTANT
- You are NOT scoring the song
- You are making DECISIONS about what should change
- Every mandate must be specific and actionable
- Cite the experts whose arguments you found compelling

${context?.songTitle ? `## SONG CONTEXT\nTitle: ${context.songTitle}` : ''}
${context?.style ? `Style: ${context.style}` : ''}
${context?.userPreferences?.length ? `User Preferences: ${context.userPreferences.join(', ')}` : ''}

## THE DEBATE TRANSCRIPT

${debateTranscript.fullTranscript}

---

## YOUR TASK

Read the debate carefully and:

1. **Identify Key Topics**: What were the main points of discussion/disagreement?

2. **Make Rulings**: For each topic:
   - State your ruling (what should happen)
   - Name whose argument won (and why)
   - Create specific mandates (what the rewrite agent must do)

3. **Override If Needed**: If any agent made a weak argument, explain why you're overriding it.

4. **Note Unresolved Issues**: If any topic couldn't be decided, explain why.

5. **Summary Statement**: Give a one-paragraph overview of your decisions.

## OUTPUT
Return valid JSON matching the schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: JUDGE_SUMMARY_SCHEMA,
        systemInstruction: "You are a senior A&R executive and music producer with 30 years of experience. You make decisive calls. Your mandates are law. Be specific and actionable.",
        temperature: 0.7,
      }
    });
    
    if (!response.text) {
      throw new Error("Empty response from Judge");
    }
    
    const result = JSON.parse(response.text) as {
      decisions: JudgeDecision[];
      overriddenArguments: OverriddenArgument[];
      unresolvedIssues: string[];
      summaryStatement: string;
    };
    
    const judgeTime = Date.now() - startTime;
    console.log(`✅ Judge ruling complete in ${judgeTime}ms`);
    console.log(`   📋 ${result.decisions.length} decisions, ${result.decisions.reduce((sum, d) => sum + d.mandates.length, 0)} mandates`);
    
    // Count total mandates
    const mandateCount = result.decisions.reduce((sum, d) => sum + d.mandates.length, 0);
    
    return {
      ...result,
      debateDuration: debateTranscript.endTime && debateTranscript.startTime 
        ? debateTranscript.endTime - debateTranscript.startTime 
        : 0,
      judgeModel: 'gemini-3-pro-preview',
      timestamp: Date.now(),
      mandateCount
    };
    
  } catch (error) {
    console.error('❌ Judge failed:', error);
    
    // Return minimal result on failure
    return {
      decisions: [],
      overriddenArguments: [],
      unresolvedIssues: ['Judge analysis failed - please retry'],
      debateDuration: 0,
      judgeModel: 'gemini-3-pro-preview',
      timestamp: Date.now(),
      summaryStatement: 'Analysis could not be completed. Please retry.',
      mandateCount: 0
    };
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Format debate transcript from turns into readable text.
 */
export function formatDebateForJudge(turns: DebateTurn[]): string {
  return turns
    .map(turn => `**${turn.agent}** [${turn.type}]:\n${turn.statement}`)
    .join('\n\n---\n\n');
}

/**
 * Extract all mandates from Judge summary as flat list.
 */
export function extractAllMandates(judgeSummary: JudgeSummary): string[] {
  return judgeSummary.decisions.flatMap(d => d.mandates);
}

/**
 * Get mandates by confidence level.
 */
export function getMandatesByConfidence(
  judgeSummary: JudgeSummary, 
  confidence: 'high' | 'medium' | 'low'
): string[] {
  return judgeSummary.decisions
    .filter(d => d.confidence === confidence)
    .flatMap(d => d.mandates);
}

/**
 * Check if a specific agent's argument was overridden.
 */
export function wasAgentOverridden(judgeSummary: JudgeSummary, agent: string): boolean {
  return judgeSummary.overriddenArguments.some(o => o.agent === agent);
}

/**
 * Get the winning agent for a specific topic.
 */
export function getWinnerForTopic(judgeSummary: JudgeSummary, topic: string): string | null {
  const decision = judgeSummary.decisions.find(d => 
    d.topic.toLowerCase().includes(topic.toLowerCase())
  );
  return decision?.winner || null;
}

/**
 * Create a compact summary for the Planner agent.
 */
export function createPlannerSummary(judgeSummary: JudgeSummary): {
  mandates: string[];
  priorities: { mandate: string; confidence: string }[];
} {
  const allMandates: { mandate: string; confidence: string }[] = [];
  
  for (const decision of judgeSummary.decisions) {
    for (const mandate of decision.mandates) {
      allMandates.push({ mandate, confidence: decision.confidence });
    }
  }
  
  // Sort by confidence (high first)
  const sorted = allMandates.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.confidence as keyof typeof order] - order[b.confidence as keyof typeof order];
  });
  
  return {
    mandates: sorted.map(m => m.mandate),
    priorities: sorted
  };
}
