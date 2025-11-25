/**
 * PLANNER AGENT SERVICE (v5 Architecture)
 * 
 * The Planner is "the final and smartest agent" - synthesizes ALL inputs
 * into a DraftExecutionPlan that the user must approve.
 * 
 * Role: PLANS (does NOT auto-execute)
 * Model: Gemini 3.0 Pro
 * Location: Floats in DeepAnalysis page AND Lyrics page
 * 
 * Inputs:
 * - Analyst's DeepAnalysisReport (scores, insights)
 * - Judge's Summary (debate mandates)
 * - The actual lyrics
 * - DNA match insights
 * - User preferences
 * 
 * Outputs: DraftExecutionPlan
 * - Prioritized changes with sources
 * - Line-level specifics with rhyme dependencies
 * - Few-shot examples for rewrite
 * 
 * ⚠️ NEVER auto-executes. User must approve in War Room.
 * 
 * @see BOARD_DIRECTIVE_v5_FINAL.md for architecture
 */

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DeepAnalysisReport, LineImprovement } from './analystAgent';
import { JudgeSummary, JudgeDecision } from './judgeAgent';
import { StructuralScanResult, RhymePair } from './structuralScanService';

// @ts-ignore - Vite env types
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface PrioritizedChange {
  priority: number;
  changeId: string;
  description: string;
  source: 'judge-mandate' | 'analyst-recommendation' | 'dna-insight' | 'user-instruction';
  sourceDetail: string;
  affectedLines: number[];
  dependencyGroup: number[]; // Lines that must change together (rhyme)
  expectedImpact: {
    category: string;
    pointsGain: number;
  };
  confidence: 'high' | 'medium' | 'low';
}

export interface LineLevelChange {
  lineNumber: number;
  sectionType: string; // verse, chorus, bridge
  original: string;
  proposed: string;
  rationale: string;
  sourceAnalysis: string; // e.g., "JudgeMandate + AnalystLine12"
  rhymeConstraint?: string; // e.g., "Must rhyme with line 14"
  syllableTarget?: number;
  mustPreserve?: string[]; // Words/phrases that must stay
}

export interface FewShotExample {
  before: string;
  after: string;
  style: string; // e.g., "Abstract → Concrete object"
  category: string; // Which improvement category this demonstrates
}

export interface DraftExecutionPlan {
  // Metadata
  planId: string;
  songTitle: string;
  createdAt: number;
  status: 'draft'; // Always draft until user approves
  
  // Score projection
  currentScore: number;
  targetScore: number;
  justification: string;
  
  // Prioritized changes
  prioritizedChanges: PrioritizedChange[];
  
  // Line-level specifics
  lineLevelChanges: LineLevelChange[];
  
  // Rhyme dependency map
  rhymeDependencies: Array<{
    group: number[];
    pattern: string;
    constraint: string;
  }>;
  
  // Few-shot examples for rewrite agent
  fewShotExamples: FewShotExample[];
  
  // Conflicts detected
  conflicts: Array<{
    description: string;
    judgePosition: string;
    analystPosition: string;
    resolution: string;
  }>;
  
  // Summary
  executiveSummary: string;
  estimatedRewriteTime: number; // seconds
}

export interface UserPreferences {
  targetScore?: number;
  priorityCategories?: string[];
  offLimitsLines?: number[];
  preservePhrases?: string[];
  customInstructions?: string[];
}

// ============================================================
// SCHEMA FOR GEMINI RESPONSE
// ============================================================

const EXECUTION_PLAN_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    targetScore: { type: Type.NUMBER },
    justification: { type: Type.STRING },
    prioritizedChanges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          priority: { type: Type.NUMBER },
          description: { type: Type.STRING },
          source: { type: Type.STRING, enum: ["judge-mandate", "analyst-recommendation", "dna-insight", "user-instruction"] },
          sourceDetail: { type: Type.STRING },
          affectedLines: { type: Type.ARRAY, items: { type: Type.NUMBER } },
          dependencyGroup: { type: Type.ARRAY, items: { type: Type.NUMBER } },
          expectedImpact: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              pointsGain: { type: Type.NUMBER }
            }
          },
          confidence: { type: Type.STRING, enum: ["high", "medium", "low"] }
        },
        required: ["priority", "description", "source", "sourceDetail", "affectedLines", "expectedImpact", "confidence"]
      }
    },
    lineLevelChanges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          lineNumber: { type: Type.NUMBER },
          sectionType: { type: Type.STRING },
          original: { type: Type.STRING },
          proposed: { type: Type.STRING },
          rationale: { type: Type.STRING },
          sourceAnalysis: { type: Type.STRING },
          rhymeConstraint: { type: Type.STRING },
          syllableTarget: { type: Type.NUMBER }
        },
        required: ["lineNumber", "original", "proposed", "rationale", "sourceAnalysis"]
      }
    },
    rhymeDependencies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          group: { type: Type.ARRAY, items: { type: Type.NUMBER } },
          pattern: { type: Type.STRING },
          constraint: { type: Type.STRING }
        }
      }
    },
    fewShotExamples: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          before: { type: Type.STRING },
          after: { type: Type.STRING },
          style: { type: Type.STRING },
          category: { type: Type.STRING }
        },
        required: ["before", "after", "style", "category"]
      }
    },
    conflicts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          judgePosition: { type: Type.STRING },
          analystPosition: { type: Type.STRING },
          resolution: { type: Type.STRING }
        }
      }
    },
    executiveSummary: { type: Type.STRING }
  },
  required: ["targetScore", "justification", "prioritizedChanges", "lineLevelChanges", "fewShotExamples", "executiveSummary"]
};

// ============================================================
// MAIN FUNCTION
// ============================================================

/**
 * Create a DraftExecutionPlan from all analysis inputs.
 * 
 * The Planner is the 8th and final agent in the v5 architecture.
 * They synthesize everything into an actionable plan.
 * 
 * ⚠️ NEVER auto-executes. Returns a DRAFT for user approval.
 * 
 * @param lyrics - The song lyrics
 * @param deepAnalysis - Analyst's full report
 * @param judgeSummary - Judge's mandates
 * @param structuralScan - DNA match and structure
 * @param userPreferences - User's priorities and constraints
 * @returns DraftExecutionPlan for user approval
 */
export async function createExecutionPlan(
  lyrics: string,
  deepAnalysis: DeepAnalysisReport,
  judgeSummary: JudgeSummary,
  structuralScan: StructuralScanResult,
  userPreferences?: UserPreferences
): Promise<DraftExecutionPlan> {
  const startTime = Date.now();
  
  console.log('📋 Planner creating execution plan...');
  
  // Build rhyme dependency map from structural scan
  const rhymePairs = structuralScan.rhymeScheme.rhymePairs;
  const rhymeDependencyText = rhymePairs
    .filter(p => p.rhymeType === 'perfect' || p.rhymeType === 'slant')
    .map(p => `Lines ${p.line1} & ${p.line2} rhyme (${p.word1} / ${p.word2})`)
    .join('\n');
  
  // Format Judge mandates
  const judgeMandates = judgeSummary.decisions
    .flatMap(d => d.mandates.map(m => ({
      mandate: m,
      topic: d.topic,
      confidence: d.confidence,
      rationale: d.rationale
    })));
  
  // Format Analyst improvements
  const analystImprovements = deepAnalysis.lineByLineImprovements
    .map(imp => `Line ${imp.lineNumber}: "${imp.original}" → "${imp.suggestion}" (${imp.category}, ${imp.priority})`);
  
  // Format score breakdown
  const scoreBreakdown = deepAnalysis.scoreBreakdown
    .map(s => `${s.category}: ${s.score}/10 (+${s.improvementPotential} possible)`)
    .join('\n');
  
  const prompt = `You are the PLANNER AGENT - the final and smartest agent in the system.

## YOUR ROLE
You synthesize ALL inputs into a single, actionable execution plan.
You identify conflicts between Judge and Analyst and resolve them.
You ensure rhyme dependencies are respected.
You create few-shot examples to guide the rewrite.

⚠️ You create a DRAFT. The user will approve before execution.

## THE LYRICS
${lyrics}

## DNA MATCH
Song: ${structuralScan.dnaMatch.songTitle} by ${structuralScan.dnaMatch.artist}
Match: ${structuralScan.dnaMatch.matchPercentage}%
Structural Lessons: ${structuralScan.dnaMatch.structuralLessons.join('; ')}

## RHYME DEPENDENCIES (Lines that must change TOGETHER)
${rhymeDependencyText || 'No strong rhyme pairs detected'}

## CURRENT SCORES
${scoreBreakdown}
Overall: ${deepAnalysis.overallScore}/10
Projected if improved: ${deepAnalysis.projectedScore}/10

## JUDGE MANDATES (from debate)
${judgeMandates.map((m, i) => `${i + 1}. [${m.confidence}] ${m.mandate}\n   Topic: ${m.topic}\n   Rationale: ${m.rationale}`).join('\n\n')}

## ANALYST RECOMMENDATIONS (line-by-line)
${analystImprovements.join('\n')}

## ANALYST TOP PRIORITIES
${deepAnalysis.topPriorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## QUICK WINS (easy changes, high impact)
${deepAnalysis.quickWins.map((q, i) => `${i + 1}. ${q}`).join('\n')}

${userPreferences ? `
## USER PREFERENCES
${userPreferences.targetScore ? `Target Score: ${userPreferences.targetScore}` : ''}
${userPreferences.priorityCategories?.length ? `Priority Categories: ${userPreferences.priorityCategories.join(', ')}` : ''}
${userPreferences.offLimitsLines?.length ? `Off-Limits Lines: ${userPreferences.offLimitsLines.join(', ')}` : ''}
${userPreferences.preservePhrases?.length ? `Preserve Phrases: ${userPreferences.preservePhrases.join(', ')}` : ''}
${userPreferences.customInstructions?.length ? `Custom Instructions:\n${userPreferences.customInstructions.map(i => `- ${i}`).join('\n')}` : ''}
` : ''}

## YOUR TASK

Create a DraftExecutionPlan that:

1. **Sets a realistic target score** based on improvement potential

2. **Prioritizes changes** by impact:
   - Priority 1: Changes that address multiple weak categories
   - Priority 2: Judge mandates with high confidence
   - Priority 3: Analyst recommendations with high priority
   - Priority 4: Quick wins

3. **Maps rhyme dependencies**:
   - If line 12 changes, and it rhymes with line 14, BOTH must change
   - Include the dependencyGroup for each change

4. **Provides specific line-level changes**:
   - Original text
   - Proposed text
   - Why this change (cite source: Judge or Analyst)
   - Syllable target if relevant
   - Rhyme constraint if relevant

5. **Identifies conflicts** between Judge and Analyst:
   - If Judge said "keep the cliché" but Analyst scored Originality low
   - Explain how you're resolving the conflict

6. **Creates few-shot examples**:
   - Show before/after transformations
   - Label the style (e.g., "Abstract → Concrete")
   - These guide the rewrite agent

7. **Writes an executive summary**:
   - One paragraph overview
   - Key changes
   - Expected outcome

## OUTPUT
Return valid JSON matching the schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: EXECUTION_PLAN_SCHEMA,
        systemInstruction: "You are a senior music producer and A&R executive. You create precise, actionable plans. Every change must be traceable to a source. Rhyme dependencies are sacred.",
        temperature: 0.6,
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });
    
    if (!response.text) {
      throw new Error("Empty response from Planner");
    }
    
    const result = JSON.parse(response.text);
    
    const planTime = Date.now() - startTime;
    console.log(`✅ Execution plan created in ${planTime}ms`);
    console.log(`   📊 Target: ${deepAnalysis.overallScore} → ${result.targetScore}`);
    console.log(`   📋 ${result.prioritizedChanges.length} prioritized changes`);
    console.log(`   ✏️ ${result.lineLevelChanges.length} line-level changes`);
    
    // Generate unique plan ID
    const planId = `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      planId,
      songTitle: structuralScan.dnaMatch.songTitle || 'Untitled',
      createdAt: Date.now(),
      status: 'draft',
      currentScore: deepAnalysis.overallScore,
      targetScore: result.targetScore,
      justification: result.justification,
      prioritizedChanges: result.prioritizedChanges.map((c: any, i: number) => ({
        ...c,
        changeId: `change-${i + 1}`
      })),
      lineLevelChanges: result.lineLevelChanges,
      rhymeDependencies: result.rhymeDependencies || [],
      fewShotExamples: result.fewShotExamples,
      conflicts: result.conflicts || [],
      executiveSummary: result.executiveSummary,
      estimatedRewriteTime: 4 // 4 seconds for two-pass rewrite
    };
    
  } catch (error) {
    console.error('❌ Planner failed:', error);
    
    // Return minimal fallback plan
    return createFallbackPlan(lyrics, deepAnalysis, judgeSummary);
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function createFallbackPlan(
  lyrics: string,
  deepAnalysis: DeepAnalysisReport,
  judgeSummary: JudgeSummary
): DraftExecutionPlan {
  return {
    planId: `plan-fallback-${Date.now()}`,
    songTitle: 'Untitled',
    createdAt: Date.now(),
    status: 'draft',
    currentScore: deepAnalysis.overallScore,
    targetScore: deepAnalysis.projectedScore,
    justification: 'Fallback plan - full analysis unavailable',
    prioritizedChanges: [],
    lineLevelChanges: deepAnalysis.lineByLineImprovements.map((imp, i) => ({
      lineNumber: imp.lineNumber,
      sectionType: 'unknown',
      original: imp.original,
      proposed: imp.suggestion,
      rationale: imp.rationale,
      sourceAnalysis: `Analyst-${imp.category}`
    })),
    rhymeDependencies: [],
    fewShotExamples: [
      {
        before: "I'm lost in the dark",
        after: "I'm tangled in torn bedsheets",
        style: "Abstract → Concrete object",
        category: "Imagery"
      }
    ],
    conflicts: [],
    executiveSummary: 'Plan could not be fully generated. Review analyst recommendations directly.',
    estimatedRewriteTime: 4
  };
}

/**
 * Update plan with user modifications.
 */
export function updatePlanWithUserChanges(
  plan: DraftExecutionPlan,
  approvedChangeIds: string[],
  vetoedChangeIds: string[],
  modifications: Record<string, string>,
  manualInstructions: string[]
): DraftExecutionPlan {
  // First, filter approved and vetoed changes
  const filteredChanges = plan.prioritizedChanges
    .filter(c => approvedChangeIds.includes(c.changeId) && !vetoedChangeIds.includes(c.changeId));
  
  // Add manual instructions as new changes
  const userChanges = manualInstructions.map((inst, i) => ({
    priority: 0, // Highest priority for user instructions
    changeId: `user-${i + 1}`,
    description: inst,
    source: 'user-instruction' as const,
    sourceDetail: 'User manual instruction',
    affectedLines: [] as number[],
    dependencyGroup: [] as number[],
    expectedImpact: { category: 'User Request', pointsGain: 0 },
    confidence: 'high' as const
  }));
  
  return {
    ...plan,
    prioritizedChanges: [...filteredChanges, ...userChanges],
    lineLevelChanges: plan.lineLevelChanges.map(change => {
      const mod = modifications[`line-${change.lineNumber}`];
      if (mod) {
        return { ...change, proposed: mod, sourceAnalysis: change.sourceAnalysis + ' + UserModification' };
      }
      return change;
    })
  };
}

/**
 * Get changes grouped by rhyme dependency.
 */
export function getChangesByRhymeGroup(plan: DraftExecutionPlan): Map<string, LineLevelChange[]> {
  const groups = new Map<string, LineLevelChange[]>();
  
  for (const dep of plan.rhymeDependencies) {
    const groupKey = dep.group.sort().join('-');
    const groupChanges = plan.lineLevelChanges.filter(c => 
      dep.group.includes(c.lineNumber)
    );
    if (groupChanges.length > 0) {
      groups.set(groupKey, groupChanges);
    }
  }
  
  // Add standalone changes (not in any rhyme group)
  const inGroups = new Set(plan.rhymeDependencies.flatMap(d => d.group));
  const standalone = plan.lineLevelChanges.filter(c => !inGroups.has(c.lineNumber));
  if (standalone.length > 0) {
    groups.set('standalone', standalone);
  }
  
  return groups;
}

/**
 * Validate that rhyme dependencies are respected.
 */
export function validateRhymeDependencies(plan: DraftExecutionPlan): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  for (const dep of plan.rhymeDependencies) {
    const changedLines = plan.lineLevelChanges.map(c => c.lineNumber);
    const groupChanges = dep.group.filter(line => changedLines.includes(line));
    
    // If one line in a rhyme group changes, ALL must change
    if (groupChanges.length > 0 && groupChanges.length < dep.group.length) {
      const missing = dep.group.filter(line => !changedLines.includes(line));
      issues.push(
        `Rhyme dependency violation: Lines ${groupChanges.join(', ')} change but rhyme partners ${missing.join(', ')} don't`
      );
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Get the expected impact summary.
 */
export function getImpactSummary(plan: DraftExecutionPlan): {
  totalPointsGain: number;
  byCategory: Record<string, number>;
} {
  const byCategory: Record<string, number> = {};
  let totalPointsGain = 0;
  
  for (const change of plan.prioritizedChanges) {
    const { category, pointsGain } = change.expectedImpact;
    byCategory[category] = (byCategory[category] || 0) + pointsGain;
    totalPointsGain += pointsGain;
  }
  
  return { totalPointsGain, byCategory };
}
