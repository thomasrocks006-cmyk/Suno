/**
 * V5 ANALYSIS PIPELINE
 * 
 * Orchestrates the complete v5 analysis flow:
 * 
 * PHASE 1: ANALYSIS (22s to see insights)
 *   1. Structural Scan (1s) - DNA, structure, syllables, rhymes
 *   2. Real Debate (10-15s) - 5 agents discuss (no scoring)
 *   3. Judge (3s) - Creates mandates from debate
 *   4. Analyst (4-5s) - PhD Musicologist scores independently
 * 
 * PHASE 2: PLANNING (4s)
 *   5. Planner (3-4s) - Creates DraftExecutionPlan with rhyme dependencies
 * 
 * PHASE 3: WAR ROOM (User approval required)
 *   6. User approves/vetoes/modifies each proposed change
 * 
 * PHASE 4: EXECUTION (3-5s after approval)
 *   7. Two-Pass Rewrite - Mason (lyrics) + Decorator (furniture)
 *   8. Auditor - Validates result, generates warning badges
 * 
 * @see BOARD_DIRECTIVE_v5_FINAL.md for architecture
 * @version 5.0.0
 */

import { GeneratedSong } from "../types";
import { performStructuralScan, StructuralScanResult } from './structuralScanService';
import { conductRealDebate, DebateTranscript, DebateTurn } from './realDebateEngine';
import { judgeDebate, JudgeSummary, formatDebateForJudge } from './judgeAgent';
import { analyzeAsPhDMusicologist, DeepAnalysisReport } from './analystAgent';
import { createExecutionPlan, DraftExecutionPlan } from './plannerAgent';
import { executeTwoPassRewrite, RewriteResult } from './twoPassRewrite';
import { runAudit, AuditReport } from './auditorService';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface V5AnalysisResult {
  // Core outputs
  structuralScan: StructuralScanResult;
  debateTranscript: DebateTranscript;
  judgeSummary: JudgeSummary;
  deepAnalysis: DeepAnalysisReport;
  
  // Timing
  timing: {
    structuralScanMs: number;
    debateMs: number;
    judgeMs: number;
    analystMs: number;
    totalMs: number;
  };
  
  // Status
  status: 'complete' | 'partial' | 'failed';
  errors: string[];
}

export interface V5ProgressCallback {
  (phase: V5Phase, progress: number, detail?: string): void;
}

export type V5Phase = 
  | 'structural-scan'
  | 'debate-opening'
  | 'debate-discussion'
  | 'debate-challenge'
  | 'debate-synthesis'
  | 'judge'
  | 'analyst';

// ============================================================
// MAIN PIPELINE
// ============================================================

/**
 * Run the complete v5 analysis pipeline.
 * 
 * @param song - The generated song to analyze
 * @param onProgress - Callback for progress updates
 * @param onDebateTurn - Callback for real-time debate streaming
 * @returns V5AnalysisResult with all outputs
 */
export async function runV5AnalysisPipeline(
  song: GeneratedSong,
  onProgress?: V5ProgressCallback,
  onDebateTurn?: (turn: DebateTurn) => void
): Promise<V5AnalysisResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const timing = {
    structuralScanMs: 0,
    debateMs: 0,
    judgeMs: 0,
    analystMs: 0,
    totalMs: 0
  };
  
  console.log('🚀 Starting v5 Analysis Pipeline...');
  console.log(`   📝 Song: "${song.title}"`);
  
  // ============================================================
  // STEP 1: STRUCTURAL SCAN (1s)
  // ============================================================
  onProgress?.('structural-scan', 0, 'Starting structural scan...');
  
  let structuralScan: StructuralScanResult;
  const scanStart = Date.now();
  
  try {
    structuralScan = await performStructuralScan(
      song.lyrics,
      song.stylePrompt,
      song.title
    );
    timing.structuralScanMs = Date.now() - scanStart;
    onProgress?.('structural-scan', 100, `DNA Match: ${structuralScan.dnaMatch.songTitle}`);
    console.log(`✅ Structural scan: ${timing.structuralScanMs}ms`);
  } catch (error) {
    errors.push(`Structural scan failed: ${error}`);
    console.error('❌ Structural scan failed:', error);
    // Create minimal fallback
    structuralScan = createFallbackScan(song);
    timing.structuralScanMs = Date.now() - scanStart;
  }
  
  // ============================================================
  // STEP 2: REAL DEBATE (10-15s)
  // ============================================================
  onProgress?.('debate-opening', 0, 'Agents reviewing song...');
  
  let debateTranscript: DebateTranscript;
  const debateStart = Date.now();
  
  // Wrap the turn callback to update progress
  const turnCallback = (turn: DebateTurn) => {
    onDebateTurn?.(turn);
    
    // Estimate progress based on turn count
    const estimatedTurns = 20;
    const currentTurns = debateTranscript?.turnCount || 0;
    const phase = turn.type === 'observation' ? 'debate-opening' :
                  turn.type === 'counter' ? 'debate-challenge' :
                  'debate-discussion';
    onProgress?.(phase, Math.min(95, (currentTurns / estimatedTurns) * 100), 
      `${turn.agent}: ${turn.type}`);
  };
  
  try {
    debateTranscript = await conductRealDebate(song, structuralScan, turnCallback);
    timing.debateMs = Date.now() - debateStart;
    onProgress?.('debate-synthesis', 100, `Debate complete: ${debateTranscript.turnCount} turns`);
    console.log(`✅ Real debate: ${timing.debateMs}ms (${debateTranscript.turnCount} turns)`);
  } catch (error) {
    errors.push(`Debate failed: ${error}`);
    console.error('❌ Debate failed:', error);
    debateTranscript = createFallbackDebate();
    timing.debateMs = Date.now() - debateStart;
  }
  
  // ============================================================
  // STEP 3: JUDGE (3s)
  // ============================================================
  onProgress?.('judge', 0, 'Judge reviewing debate...');
  
  let judgeSummary: JudgeSummary;
  const judgeStart = Date.now();
  
  try {
    judgeSummary = await judgeDebate(debateTranscript, {
      songTitle: song.title,
      style: song.stylePrompt
    });
    timing.judgeMs = Date.now() - judgeStart;
    onProgress?.('judge', 100, `Judge: ${judgeSummary.mandateCount} mandates`);
    console.log(`✅ Judge ruling: ${timing.judgeMs}ms (${judgeSummary.mandateCount} mandates)`);
  } catch (error) {
    errors.push(`Judge failed: ${error}`);
    console.error('❌ Judge failed:', error);
    judgeSummary = createFallbackJudge();
    timing.judgeMs = Date.now() - judgeStart;
  }
  
  // ============================================================
  // STEP 4: ANALYST (4-5s)
  // ============================================================
  onProgress?.('analyst', 0, 'PhD Musicologist analyzing...');
  
  let deepAnalysis: DeepAnalysisReport;
  const analystStart = Date.now();
  
  try {
    deepAnalysis = await analyzeAsPhDMusicologist(
      song.lyrics,
      structuralScan,
      judgeSummary,
      song.title,
      song.stylePrompt
    );
    timing.analystMs = Date.now() - analystStart;
    onProgress?.('analyst', 100, `Score: ${deepAnalysis.overallScore.toFixed(1)}/10`);
    console.log(`✅ PhD Analysis: ${timing.analystMs}ms (Score: ${deepAnalysis.overallScore}/10)`);
  } catch (error) {
    errors.push(`Analyst failed: ${error}`);
    console.error('❌ Analyst failed:', error);
    deepAnalysis = createFallbackAnalysis();
    timing.analystMs = Date.now() - analystStart;
  }
  
  // ============================================================
  // COMPLETE
  // ============================================================
  timing.totalMs = Date.now() - startTime;
  
  console.log(`\n🎉 V5 Pipeline Complete!`);
  console.log(`   ⏱️ Total time: ${(timing.totalMs / 1000).toFixed(1)}s`);
  console.log(`   📊 Score: ${deepAnalysis.overallScore}/10 → ${deepAnalysis.projectedScore}/10 projected`);
  console.log(`   📋 Mandates: ${judgeSummary.mandateCount}`);
  console.log(`   💬 Debate turns: ${debateTranscript.turnCount}`);
  
  return {
    structuralScan,
    debateTranscript,
    judgeSummary,
    deepAnalysis,
    timing,
    status: errors.length === 0 ? 'complete' : (errors.length < 3 ? 'partial' : 'failed'),
    errors
  };
}

// ============================================================
// QUICK ANALYSIS (Skip Debate)
// ============================================================

/**
 * Run a quick analysis without debate.
 * Useful for rapid feedback or when debate isn't needed.
 * 
 * Flow: Structural Scan → Analyst (skip Judge & Debate)
 */
export async function runQuickAnalysis(
  song: GeneratedSong,
  onProgress?: V5ProgressCallback
): Promise<{
  structuralScan: StructuralScanResult;
  deepAnalysis: DeepAnalysisReport;
  timing: { totalMs: number };
}> {
  const startTime = Date.now();
  
  console.log('⚡ Running quick analysis (no debate)...');
  
  onProgress?.('structural-scan', 0, 'Scanning structure...');
  const structuralScan = await performStructuralScan(
    song.lyrics,
    song.stylePrompt,
    song.title
  );
  onProgress?.('structural-scan', 100);
  
  onProgress?.('analyst', 0, 'PhD analyzing...');
  const deepAnalysis = await analyzeAsPhDMusicologist(
    song.lyrics,
    structuralScan,
    undefined, // No judge summary
    song.title,
    song.stylePrompt
  );
  onProgress?.('analyst', 100);
  
  return {
    structuralScan,
    deepAnalysis,
    timing: { totalMs: Date.now() - startTime }
  };
}

// ============================================================
// FALLBACK CREATORS
// ============================================================

function createFallbackScan(song: GeneratedSong): StructuralScanResult {
  return {
    dnaMatch: {
      songTitle: 'Unknown',
      artist: 'Unknown',
      matchPercentage: 0,
      structuralLessons: [],
      thematicParallels: [],
      whyItMatches: 'Analysis unavailable'
    },
    structure: {
      sections: [],
      format: 'Unknown',
      totalLines: song.lyrics.split('\n').length,
      hasIntro: false,
      hasOutro: false,
      hasBridge: false
    },
    syllables: {
      perLine: [],
      averagePerLine: 0,
      variance: 0,
      densestSection: 'Unknown',
      sparsestSection: 'Unknown'
    },
    rhymeScheme: {
      pattern: 'Unknown',
      rhymePairs: [],
      internalRhymes: []
    },
    scanTime: 0,
    modelUsed: 'fallback'
  };
}

function createFallbackDebate(): DebateTranscript {
  return {
    topics: [],
    fullTranscript: 'Debate could not be conducted.',
    turnCount: 0,
    startTime: Date.now(),
    endTime: Date.now(),
    participatingAgents: []
  };
}

function createFallbackJudge(): JudgeSummary {
  return {
    decisions: [],
    overriddenArguments: [],
    unresolvedIssues: ['Analysis unavailable'],
    debateDuration: 0,
    judgeModel: 'fallback',
    timestamp: Date.now(),
    summaryStatement: 'Judge analysis could not be completed.',
    mandateCount: 0
  };
}

function createFallbackAnalysis(): DeepAnalysisReport {
  return {
    scoreBreakdown: [],
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
    executiveSummary: 'Analysis could not be completed.',
    topPriorities: [],
    quickWins: [],
    analysisTime: 0,
    modelUsed: 'fallback',
    timestamp: Date.now()
  };
}

function createFallbackPlan(): DraftExecutionPlan {
  return {
    planId: 'fallback',
    songTitle: 'Unknown',
    createdAt: Date.now(),
    status: 'draft',
    currentScore: 0,
    targetScore: 0,
    justification: 'Plan generation failed',
    prioritizedChanges: [],
    lineLevelChanges: [],
    rhymeDependencies: [],
    fewShotExamples: [],
    conflicts: [],
    executiveSummary: 'Plan generation failed',
    estimatedRewriteTime: 0
  };
}

// ============================================================
// FULL PIPELINE WITH REWRITE (Post-Approval)
// ============================================================

/**
 * Execute the rewrite after user approval in War Room.
 * 
 * This is called AFTER the user has approved changes in the War Room.
 * 
 * @param originalLyrics - Original lyrics to rewrite
 * @param approvedPlan - Plan approved by user (may have modifications)
 * @param structuralScan - Original structural scan
 * @param judgeVerdict - Judge's summary for auditor validation
 * @param onProgress - Progress callback
 * @returns RewriteResult with auditor validation
 */
export async function executeApprovedRewrite(
  originalLyrics: string,
  approvedPlan: DraftExecutionPlan,
  structuralScan: StructuralScanResult,
  judgeVerdict: JudgeSummary,
  onProgress?: (phase: string, progress: number, detail?: string) => void
): Promise<{
  rewriteResult: RewriteResult;
  auditReport: AuditReport;
  timing: { rewriteMs: number; auditMs: number; totalMs: number };
}> {
  const startTime = Date.now();
  
  console.log('🔨 Starting approved rewrite...');
  
  // Pass 1 & 2: Two-Pass Rewrite
  onProgress?.('rewrite', 0, 'Mason applying changes...');
  const rewriteStart = Date.now();
  const rewriteResult = await executeTwoPassRewrite(
    originalLyrics,
    approvedPlan,
    structuralScan
  );
  const rewriteMs = Date.now() - rewriteStart;
  onProgress?.('rewrite', 100, `Applied ${rewriteResult.changesApplied.length} changes`);
  console.log(`✅ Rewrite complete: ${rewriteMs}ms`);
  
  // Auditor Validation
  onProgress?.('audit', 0, 'Auditor validating result...');
  const auditStart = Date.now();
  const auditReport = await runAudit(
    originalLyrics,
    rewriteResult,
    structuralScan,
    approvedPlan,
    judgeVerdict
  );
  const auditMs = Date.now() - auditStart;
  onProgress?.('audit', 100, `Status: ${auditReport.overallStatus}`);
  console.log(`✅ Audit complete: ${auditMs}ms (${auditReport.overallStatus})`);
  
  return {
    rewriteResult,
    auditReport,
    timing: {
      rewriteMs,
      auditMs,
      totalMs: Date.now() - startTime
    }
  };
}

// ============================================================
// PLAN GENERATION (Between Analysis and War Room)
// ============================================================

/**
 * Generate the execution plan after analysis is complete.
 * 
 * Called after the analysis phase to prepare for War Room.
 * 
 * @param analysisResult - Complete V5 analysis result
 * @param song - Original song
 * @returns DraftExecutionPlan for War Room approval
 */
export async function generateExecutionPlan(
  analysisResult: V5AnalysisResult,
  song: GeneratedSong
): Promise<DraftExecutionPlan> {
  console.log('📋 Generating execution plan...');
  
  try {
    const plan = await createExecutionPlan(
      song.lyrics,
      analysisResult.deepAnalysis,
      analysisResult.judgeSummary,
      analysisResult.structuralScan
    );
    console.log(`✅ Plan created: ${plan.prioritizedChanges.length} changes prioritized`);
    return plan;
  } catch (error) {
    console.error('❌ Plan generation failed:', error);
    return createFallbackPlan();
  }
}

