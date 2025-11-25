/**
 * ANALYST AGENT SERVICE (v5 Architecture)
 * 
 * The Analyst is a PhD Musicologist who provides INDEPENDENT, SCHOLARLY analysis.
 * They did NOT participate in the debate - they bring FRESH EYES.
 * 
 * Role: GRADES (produces ALL 10 category scores)
 * Model: Gemini 3.0 Pro
 * 
 * Inputs:
 * - The actual lyrics (read fresh)
 * - DNA match from Structural Scan
 * - Judge's summary (debate outcomes - but doesn't bias scoring)
 * 
 * Outputs: DeepAnalysisReport with:
 * - 10-category scoring with scholarly rigor
 * - Story arc analysis
 * - Imagery audit
 * - Line-by-line improvements
 * - DNA match insights
 * - Phonetic analysis
 * - Validation of Judge decisions
 * 
 * @see BOARD_DIRECTIVE_v5_FINAL.md for architecture
 */

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StructuralScanResult } from './structuralScanService';
import { JudgeSummary } from './judgeAgent';

// @ts-ignore - Vite env types
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface ScoreBreakdown {
  category: string;
  score: number;
  reasoning: string;
  evidence: string[];
  improvementPotential: number;
  currentStrengths: string[];
}

export interface LineImprovement {
  lineNumber: number;
  original: string;
  suggestion: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
  category: string; // Which category this improves
}

export interface StoryArcAnalysis {
  structure: string;
  emotionalJourney: string[];
  tensionPoints: number[];
  climaxLine: number;
  resolutionLine: number;
  characterConsistency: number;
  narrativeType: 'linear' | 'circular' | 'fragmented' | 'impressionistic';
}

export interface ImageryAudit {
  concreteObjects: string[];
  sensoryDetails: {
    visual: string[];
    auditory: string[];
    tactile: string[];
    olfactory: string[];
    gustatory: string[];
  };
  abstractVsConcreteRatio: number;
  cinemaScore: number;
  metaphorSystems: string[];
  clicheCount: number;
  originalMetaphors: string[];
}

export interface PhoneticAnalysis {
  consonantClusterIssues: Array<{ line: number; issue: string; severity: 'high' | 'medium' | 'low' }>;
  vowelFlowScore: number;
  breathPointRecommendations: number[];
  singabilityScore: number;
  beltingTestResults: Array<{ line: number; endingVowel: string; singable: boolean }>;
  plosiveRhythm: string; // Assessment of rhythmic consonants
}

export interface DNAMatchInsights {
  structuralLessons: string[];
  thematicParallels: string[];
  whatToAdopt: string[];
  whatToAvoid: string[];
  gapFromReference: number; // How far this song is from the reference quality
}

export interface JudgeDecisionValidation {
  judgeMandate: string;
  analystAgreement: 'agree' | 'challenge' | 'partial';
  reasoning: string;
  scoreImpact: number;
  recommendedModification?: string;
}

export interface DeepAnalysisReport {
  // Core scoring
  scoreBreakdown: ScoreBreakdown[];
  overallScore: number;
  projectedScore: number; // If improvements applied
  
  // Detailed analysis
  storyArcAnalysis: StoryArcAnalysis;
  imageryAudit: ImageryAudit;
  lineByLineImprovements: LineImprovement[];
  dnaMatchInsights: DNAMatchInsights;
  phoneticAnalysis: PhoneticAnalysis;
  
  // Judge validation
  judgeDecisionValidation: JudgeDecisionValidation[];
  
  // Summary
  executiveSummary: string;
  topPriorities: string[];
  quickWins: string[];
  
  // Metadata
  analysisTime: number;
  modelUsed: string;
  timestamp: number;
}

// ============================================================
// SCORING CATEGORIES
// ============================================================

export const SCORING_CATEGORIES = [
  {
    name: 'Lyrical Originality',
    weight: 1.0,
    description: 'Unique metaphors, fresh language, avoidance of clichés'
  },
  {
    name: 'Narrative Arc',
    weight: 1.0,
    description: 'Story structure, character journey, emotional progression'
  },
  {
    name: 'Imagery & Sensory Detail',
    weight: 1.0,
    description: 'Concrete objects, sensory language, visual evocativeness'
  },
  {
    name: 'Thematic Cohesion',
    weight: 1.0,
    description: 'Unified message, consistent metaphor systems, no thematic drift'
  },
  {
    name: 'Emotional Impact',
    weight: 1.0,
    description: 'Catharsis points, emotional resonance, goosebump moments'
  },
  {
    name: 'Vocal Playability',
    weight: 1.0,
    description: 'Singability, breath points, vocal strain avoidance'
  },
  {
    name: 'Melodic & Phonetic Flow',
    weight: 1.0,
    description: 'Vowel/consonant patterns, rhythm, flow between words'
  },
  {
    name: 'Sonic Density',
    weight: 1.0,
    description: 'Word packing, syllable distribution, dynamic range'
  },
  {
    name: 'Structure & Pacing',
    weight: 1.0,
    description: 'Section balance, hook placement, buildup/release'
  },
  {
    name: 'Commercial Potential',
    weight: 1.0,
    description: 'Hook strength, memorability, radio/streaming appeal'
  }
] as const;

// ============================================================
// SCHEMA FOR GEMINI RESPONSE
// ============================================================

const DEEP_ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    scoreBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          score: { type: Type.NUMBER, description: "Score from 1-10" },
          reasoning: { type: Type.STRING },
          evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementPotential: { type: Type.NUMBER, description: "How many points could be gained" },
          currentStrengths: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["category", "score", "reasoning", "evidence", "improvementPotential"]
      }
    },
    storyArcAnalysis: {
      type: Type.OBJECT,
      properties: {
        structure: { type: Type.STRING },
        emotionalJourney: { type: Type.ARRAY, items: { type: Type.STRING } },
        tensionPoints: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        climaxLine: { type: Type.NUMBER },
        resolutionLine: { type: Type.NUMBER },
        characterConsistency: { type: Type.NUMBER },
        narrativeType: { type: Type.STRING, enum: ["linear", "circular", "fragmented", "impressionistic"] }
      }
    },
    imageryAudit: {
      type: Type.OBJECT,
      properties: {
        concreteObjects: { type: Type.ARRAY, items: { type: Type.STRING } },
        sensoryDetails: {
          type: Type.OBJECT,
          properties: {
            visual: { type: Type.ARRAY, items: { type: Type.STRING } },
            auditory: { type: Type.ARRAY, items: { type: Type.STRING } },
            tactile: { type: Type.ARRAY, items: { type: Type.STRING } },
            olfactory: { type: Type.ARRAY, items: { type: Type.STRING } },
            gustatory: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        abstractVsConcreteRatio: { type: Type.NUMBER },
        cinemaScore: { type: Type.NUMBER },
        metaphorSystems: { type: Type.ARRAY, items: { type: Type.STRING } },
        clicheCount: { type: Type.NUMBER },
        originalMetaphors: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    lineByLineImprovements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          lineNumber: { type: Type.NUMBER },
          original: { type: Type.STRING },
          suggestion: { type: Type.STRING },
          rationale: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["high", "medium", "low"] },
          category: { type: Type.STRING }
        },
        required: ["lineNumber", "original", "suggestion", "rationale", "priority", "category"]
      }
    },
    dnaMatchInsights: {
      type: Type.OBJECT,
      properties: {
        structuralLessons: { type: Type.ARRAY, items: { type: Type.STRING } },
        thematicParallels: { type: Type.ARRAY, items: { type: Type.STRING } },
        whatToAdopt: { type: Type.ARRAY, items: { type: Type.STRING } },
        whatToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
        gapFromReference: { type: Type.NUMBER }
      }
    },
    phoneticAnalysis: {
      type: Type.OBJECT,
      properties: {
        consonantClusterIssues: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              line: { type: Type.NUMBER },
              issue: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ["high", "medium", "low"] }
            }
          }
        },
        vowelFlowScore: { type: Type.NUMBER },
        breathPointRecommendations: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        singabilityScore: { type: Type.NUMBER },
        beltingTestResults: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              line: { type: Type.NUMBER },
              endingVowel: { type: Type.STRING },
              singable: { type: Type.BOOLEAN }
            }
          }
        },
        plosiveRhythm: { type: Type.STRING }
      }
    },
    judgeDecisionValidation: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          judgeMandate: { type: Type.STRING },
          analystAgreement: { type: Type.STRING, enum: ["agree", "challenge", "partial"] },
          reasoning: { type: Type.STRING },
          scoreImpact: { type: Type.NUMBER },
          recommendedModification: { type: Type.STRING }
        },
        required: ["judgeMandate", "analystAgreement", "reasoning", "scoreImpact"]
      }
    },
    executiveSummary: { type: Type.STRING },
    topPriorities: { type: Type.ARRAY, items: { type: Type.STRING } },
    quickWins: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["scoreBreakdown", "storyArcAnalysis", "imageryAudit", "lineByLineImprovements", "dnaMatchInsights", "phoneticAnalysis", "executiveSummary", "topPriorities", "quickWins"]
};

// ============================================================
// MAIN FUNCTION
// ============================================================

/**
 * Analyze the song as a PhD Musicologist.
 * 
 * The Analyst is the 7th agent in the v5 architecture.
 * They provide INDEPENDENT scoring - they did NOT participate in the debate.
 * 
 * @param lyrics - The song lyrics to analyze
 * @param structuralScan - Results from the structural scan
 * @param judgeSummary - The Judge's decisions (optional, for validation)
 * @param songTitle - Title for context
 * @param style - Genre/style for context
 * @returns DeepAnalysisReport with all 10 scores and insights
 */
export async function analyzeAsPhDMusicologist(
  lyrics: string,
  structuralScan: StructuralScanResult,
  judgeSummary?: JudgeSummary,
  songTitle?: string,
  style?: string
): Promise<DeepAnalysisReport> {
  const startTime = Date.now();
  
  console.log('📚 PhD Musicologist analyzing (fresh eyes, no debate bias)...');
  
  // Format the Judge mandates for validation (if available)
  const judgeMandates = judgeSummary?.decisions.flatMap(d => d.mandates) || [];
  
  const prompt = `You are a PhD Musicologist with expertise in contemporary lyric analysis.

## YOUR ROLE
You are providing INDEPENDENT, SCHOLARLY analysis. You did NOT participate in any debate.
You are bringing FRESH EYES to these lyrics. Your scoring is OBJECTIVE.

## THE LYRICS
Title: ${songTitle || 'Untitled'}
Style: ${style || 'Pop'}

${lyrics}

## STRUCTURAL DATA
DNA Match: ${structuralScan.dnaMatch.songTitle} by ${structuralScan.dnaMatch.artist} (${structuralScan.dnaMatch.matchPercentage}% match)
Structure: ${structuralScan.structure.format}
Average syllables per line: ${structuralScan.syllables.averagePerLine}
Rhyme scheme: ${structuralScan.rhymeScheme.pattern}

${judgeMandates.length > 0 ? `
## JUDGE'S MANDATES (from earlier debate)
These are decisions made by the Judge based on a debate you didn't participate in.
After scoring, validate whether these mandates are sound:

${judgeMandates.map((m, i) => `${i + 1}. ${m}`).join('\n')}
` : ''}

## YOUR ANALYSIS TASKS

### 1. SCORE BREAKDOWN (10 Categories, 1-10 each)
For EACH category, provide:
- Score (1-10, be harsh but fair)
- Reasoning (cite specific lines)
- Evidence (exact phrases that support your score)
- Improvement potential (how many points could be gained)
- Current strengths (what's working)

Categories:
${SCORING_CATEGORIES.map((c, i) => `${i + 1}. ${c.name}: ${c.description}`).join('\n')}

### 2. STORY ARC ANALYSIS
- What's the narrative structure?
- Map the emotional journey (beginning → end)
- Identify tension points (line numbers)
- Where's the climax? The resolution?
- Is the character/voice consistent?

### 3. IMAGERY AUDIT
- List ALL concrete objects mentioned
- Categorize sensory details (visual, auditory, tactile, etc.)
- Calculate abstract vs. concrete ratio
- Give a "Cinema Score" (1-10): How visual is this song?
- Identify metaphor systems
- Count clichés vs. original metaphors

### 4. LINE-BY-LINE IMPROVEMENTS
For lines that need work:
- Line number and original text
- Your suggested improvement
- Why this change helps
- Priority (high/medium/low)
- Which category this improves

### 5. DNA MATCH INSIGHTS
- What structural techniques does the reference use?
- Thematic parallels to explore
- What to adopt from the reference
- What to avoid
- Gap from reference quality (1-10)

### 6. PHONETIC ANALYSIS
- Consonant cluster issues (hard to sing)
- Vowel flow score (1-10)
- Where should breath marks go?
- Singability score (1-10)
- Belting test: Do chorus lines end on open vowels?

${judgeMandates.length > 0 ? `
### 7. JUDGE DECISION VALIDATION
For each Judge mandate, state whether you:
- AGREE: The mandate is sound and will improve the song
- CHALLENGE: The mandate may hurt the song - explain why
- PARTIAL: Some aspects good, others concerning

Estimate the score impact of each mandate.
` : ''}

### 8. SUMMARY
- Executive summary (one paragraph)
- Top 3 priorities for improvement
- Quick wins (easy changes with high impact)

## OUTPUT
Return valid JSON. Be specific, cite line numbers, be scholarly but practical.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: DEEP_ANALYSIS_SCHEMA,
        systemInstruction: "You are a PhD in Musicology with expertise in contemporary songwriting. Your analysis is rigorous, evidence-based, and actionable. You score fairly - a 7 is good, an 8 is excellent, a 9 is exceptional. You cite specific lines as evidence.",
        temperature: 0.6,
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });
    
    if (!response.text) {
      throw new Error("Empty response from Analyst");
    }
    
    const result = JSON.parse(response.text);
    
    // Calculate overall score (average of all 10 categories)
    const overallScore = result.scoreBreakdown.reduce(
      (sum: number, s: ScoreBreakdown) => sum + s.score, 0
    ) / result.scoreBreakdown.length;
    
    // Calculate projected score (if improvements applied)
    const projectedScore = result.scoreBreakdown.reduce(
      (sum: number, s: ScoreBreakdown) => sum + s.score + s.improvementPotential, 0
    ) / result.scoreBreakdown.length;
    
    const analysisTime = Date.now() - startTime;
    console.log(`✅ PhD analysis complete in ${analysisTime}ms`);
    console.log(`   📊 Overall score: ${overallScore.toFixed(1)}/10`);
    console.log(`   📈 Projected: ${projectedScore.toFixed(1)}/10`);
    
    return {
      ...result,
      overallScore: Math.round(overallScore * 10) / 10,
      projectedScore: Math.min(10, Math.round(projectedScore * 10) / 10),
      analysisTime,
      modelUsed: 'gemini-3-pro-preview',
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error('❌ Analyst failed:', error);
    
    // Return minimal result on failure
    return createEmptyReport(startTime);
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function createEmptyReport(startTime: number): DeepAnalysisReport {
  return {
    scoreBreakdown: SCORING_CATEGORIES.map(c => ({
      category: c.name,
      score: 0,
      reasoning: 'Analysis failed',
      evidence: [],
      improvementPotential: 0,
      currentStrengths: []
    })),
    overallScore: 0,
    projectedScore: 0,
    storyArcAnalysis: {
      structure: 'Unknown',
      emotionalJourney: [],
      tensionPoints: [],
      climaxLine: 0,
      resolutionLine: 0,
      characterConsistency: 0,
      narrativeType: 'linear'
    },
    imageryAudit: {
      concreteObjects: [],
      sensoryDetails: { visual: [], auditory: [], tactile: [], olfactory: [], gustatory: [] },
      abstractVsConcreteRatio: 0,
      cinemaScore: 0,
      metaphorSystems: [],
      clicheCount: 0,
      originalMetaphors: []
    },
    lineByLineImprovements: [],
    dnaMatchInsights: {
      structuralLessons: [],
      thematicParallels: [],
      whatToAdopt: [],
      whatToAvoid: [],
      gapFromReference: 0
    },
    phoneticAnalysis: {
      consonantClusterIssues: [],
      vowelFlowScore: 0,
      breathPointRecommendations: [],
      singabilityScore: 0,
      beltingTestResults: [],
      plosiveRhythm: 'Unknown'
    },
    judgeDecisionValidation: [],
    executiveSummary: 'Analysis could not be completed. Please retry.',
    topPriorities: [],
    quickWins: [],
    analysisTime: Date.now() - startTime,
    modelUsed: 'gemini-3-pro-preview',
    timestamp: Date.now()
  };
}

/**
 * Get the weakest categories from the analysis.
 */
export function getWeakestCategories(report: DeepAnalysisReport, count: number = 3): ScoreBreakdown[] {
  return [...report.scoreBreakdown]
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

/**
 * Get the strongest categories from the analysis.
 */
export function getStrongestCategories(report: DeepAnalysisReport, count: number = 3): ScoreBreakdown[] {
  return [...report.scoreBreakdown]
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

/**
 * Get high-priority line improvements.
 */
export function getHighPriorityImprovements(report: DeepAnalysisReport): LineImprovement[] {
  return report.lineByLineImprovements.filter(l => l.priority === 'high');
}

/**
 * Check if Analyst challenges any Judge decisions.
 */
export function hasJudgeChallenges(report: DeepAnalysisReport): boolean {
  return report.judgeDecisionValidation.some(v => v.analystAgreement === 'challenge');
}

/**
 * Get the total improvement potential.
 */
export function getTotalImprovementPotential(report: DeepAnalysisReport): number {
  return report.scoreBreakdown.reduce((sum, s) => sum + s.improvementPotential, 0);
}

/**
 * Format scores for display.
 */
export function formatScoresForDisplay(report: DeepAnalysisReport): string {
  return report.scoreBreakdown
    .map(s => `${s.category}: ${s.score}/10 (${s.improvementPotential > 0 ? `+${s.improvementPotential} possible` : 'maxed'})`)
    .join('\n');
}
