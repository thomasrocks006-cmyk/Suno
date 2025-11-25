/**
 * twoPassRewrite.ts
 * 
 * TWO-PASS REWRITE SYSTEM - Phase 7 of v5 Architecture
 * 
 * @version 5.0.0
 * @see BOARD_DIRECTIVE_v5_FINAL.md - Phase 7
 */

import { GoogleGenAI } from '@google/genai';
import type { 
  DraftExecutionPlan, 
  LineLevelChange, 
  FewShotExample, 
  PrioritizedChange 
} from './plannerAgent';
import type { StructuralScanResult, RhymeScheme } from './structuralScanService';

// @ts-ignore - Vite env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface RewriteConfig {
  maxRetries: number;
  masonTemperature: number;
  decoratorTemperature: number;
  strictSyllables: boolean;
  strictRhymes: boolean;
}

export interface RewriteResult {
  rewrittenLyrics: string;
  changesApplied: AppliedChange[];
  failedChanges: FailedChange[];
  decoratorAdditions: DecoratorAddition[];
  metrics: RewriteMetrics;
}

export interface AppliedChange {
  lineNumber: number;
  originalText: string;
  newText: string;
  changeType: 'lyric' | 'rhyme' | 'rhythm' | 'full-rewrite';
  rationale: string;
  confidenceScore: number;
}

export interface FailedChange {
  lineNumber: number;
  originalText: string;
  attemptedText: string;
  reason: string;
  rationale: string;
}

export interface DecoratorAddition {
  lineNumber: number;
  type: 'breath' | 'ad-lib' | 'visual-cue' | 'emphasis';
  insertion: string;
  position: 'before' | 'after' | 'inline';
}

export interface RewriteMetrics {
  totalLinesChanged: number;
  totalLinesAttempted: number;
  successRate: number;
  averageConfidence: number;
  syllableDrift: number;
  rhymesPreserved: number;
  decorationsAdded: number;
}

const DEFAULT_CONFIG: RewriteConfig = {
  maxRetries: 3,
  masonTemperature: 0.3,
  decoratorTemperature: 0.7,
  strictSyllables: true,
  strictRhymes: true
};

// ============================================================================
// MASON PASS (PASS 1)
// ============================================================================

/**
 * Execute Pass 1: Mason rewrites lyrics based on approved changes
 */
export async function executeMasonPass(
  originalLyrics: string,
  plan: DraftExecutionPlan,
  structuralScan: StructuralScanResult,
  config: RewriteConfig = DEFAULT_CONFIG
): Promise<{
  lyrics: string;
  appliedChanges: AppliedChange[];
  failedChanges: FailedChange[];
}> {
  const lines = originalLyrics.split('\n');
  const appliedChanges: AppliedChange[] = [];
  const failedChanges: FailedChange[] = [];
  
  // Build rhyme dependency map
  const rhymeDependencyMap = buildRhymeDependencyMap(plan);
  
  // Track processed lines
  const processedLines = new Set<number>();
  
  // Sort by priority
  const sortedChanges = [...plan.prioritizedChanges].sort((a, b) => b.priority - a.priority);
  
  for (const priorityChange of sortedChanges) {
    // Get line-level changes for affected lines
    const relevantLineChanges = plan.lineLevelChanges.filter(
      lc => priorityChange.affectedLines.includes(lc.lineNumber)
    );
    
    // Skip if already processed
    if (relevantLineChanges.every(lc => processedLines.has(lc.lineNumber))) {
      continue;
    }
    
    // Process lines with rhyme dependencies as a group
    if (priorityChange.dependencyGroup && priorityChange.dependencyGroup.length > 1) {
      const groupResult = await rewriteRhymeGroup(
        lines,
        relevantLineChanges.filter(lc => priorityChange.dependencyGroup.includes(lc.lineNumber)),
        plan.fewShotExamples,
        structuralScan,
        config
      );
      
      for (const applied of groupResult.applied) {
        lines[applied.lineNumber - 1] = applied.newText;
        appliedChanges.push(applied);
        processedLines.add(applied.lineNumber);
      }
      
      failedChanges.push(...groupResult.failed);
    } else {
      // Single line changes
      for (const lineChange of relevantLineChanges) {
        if (processedLines.has(lineChange.lineNumber)) continue;
        
        const result = await rewriteSingleLine(
          lines[lineChange.lineNumber - 1],
          lineChange,
          plan.fewShotExamples,
          config
        );
        
        if (result.success) {
          lines[lineChange.lineNumber - 1] = result.newText;
          appliedChanges.push({
            lineNumber: lineChange.lineNumber,
            originalText: lineChange.original,
            newText: result.newText,
            changeType: 'lyric',
            rationale: lineChange.rationale,
            confidenceScore: result.confidence
          });
        } else {
          failedChanges.push({
            lineNumber: lineChange.lineNumber,
            originalText: lineChange.original,
            attemptedText: result.newText,
            reason: result.reason || 'Rewrite failed',
            rationale: lineChange.rationale
          });
        }
        processedLines.add(lineChange.lineNumber);
      }
    }
  }
  
  return {
    lyrics: lines.join('\n'),
    appliedChanges,
    failedChanges
  };
}

/**
 * Rewrite a group of rhyme-dependent lines together
 */
async function rewriteRhymeGroup(
  lines: string[],
  changes: LineLevelChange[],
  fewShotExamples: FewShotExample[],
  structuralScan: StructuralScanResult,
  config: RewriteConfig
): Promise<{
  applied: AppliedChange[];
  failed: FailedChange[];
}> {
  const applied: AppliedChange[] = [];
  const failed: FailedChange[] = [];
  
  const sortedChanges = [...changes].sort((a, b) => a.lineNumber - b.lineNumber);
  
  const groupedLines = sortedChanges.map(c => ({
    lineNumber: c.lineNumber,
    text: lines[c.lineNumber - 1],
    rationale: c.rationale,
    syllableTarget: c.syllableTarget || countSyllables(lines[c.lineNumber - 1])
  }));
  
  const examplesText = fewShotExamples.length > 0
    ? fewShotExamples.map(e => `Before: ${e.before}\nAfter: ${e.after}`).join('\n\n')
    : '';
  
  const prompt = buildRhymeGroupPrompt(groupedLines, examplesText);
  
  try {
    const model = ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: config.masonTemperature,
        maxOutputTokens: 1000
      }
    });
    
    const response = await model;
    const result = response.text;
    if (!result) throw new Error('Empty response');
    
    const parsedLines = parseGroupedResponse(result, sortedChanges.length);
    
    for (let i = 0; i < sortedChanges.length; i++) {
      const change = sortedChanges[i];
      const newText = parsedLines[i];
      
      if (newText && validateLine(newText, change.syllableTarget || 0, config)) {
        applied.push({
          lineNumber: change.lineNumber,
          originalText: change.original,
          newText,
          changeType: 'rhyme',
          rationale: change.rationale,
          confidenceScore: 0.8
        });
      } else {
        failed.push({
          lineNumber: change.lineNumber,
          originalText: change.original,
          attemptedText: newText || '',
          reason: 'Failed validation',
          rationale: change.rationale
        });
      }
    }
  } catch (error) {
    for (const change of sortedChanges) {
      failed.push({
        lineNumber: change.lineNumber,
        originalText: change.original,
        attemptedText: '',
        reason: `Group rewrite failed: ${error}`,
        rationale: change.rationale
      });
    }
  }
  
  return { applied, failed };
}

/**
 * Rewrite a single line
 */
async function rewriteSingleLine(
  currentText: string,
  change: LineLevelChange,
  fewShotExamples: FewShotExample[],
  config: RewriteConfig
): Promise<{
  success: boolean;
  newText: string;
  confidence: number;
  reason?: string;
}> {
  const syllableTarget = change.syllableTarget || countSyllables(currentText);
  const examplesText = fewShotExamples.length > 0
    ? fewShotExamples.map(e => `Before: ${e.before}\nAfter: ${e.after}`).join('\n')
    : '';
  
  const prompt = `Rewrite this lyric line:

CURRENT: "${currentText}"
SYLLABLES: ${syllableTarget} (match within ±1)
RATIONALE: ${change.rationale}
${change.rhymeConstraint ? `RHYME: ${change.rhymeConstraint}` : ''}
${examplesText ? `\nEXAMPLES:\n${examplesText}` : ''}

Output ONLY the rewritten line:`;
  
  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          temperature: config.masonTemperature + (attempt * 0.1),
          maxOutputTokens: 200
        }
      });
      
      const newText = extractSingleLine(response.text || '');
      
      if (newText && validateLine(newText, syllableTarget, config)) {
        return {
          success: true,
          newText,
          confidence: 0.9 - (attempt * 0.1)
        };
      }
    } catch (error) {
      console.error(`Mason attempt ${attempt + 1} failed:`, error);
    }
  }
  
  return {
    success: false,
    newText: currentText,
    confidence: 0,
    reason: 'Max retries exceeded'
  };
}

// ============================================================================
// DECORATOR PASS (PASS 2)
// ============================================================================

/**
 * Execute Pass 2: Decorator adds performance furniture
 */
export async function executeDecoratorPass(
  masonLyrics: string,
  structuralScan: StructuralScanResult,
  config: RewriteConfig = DEFAULT_CONFIG
): Promise<{
  lyrics: string;
  additions: DecoratorAddition[];
}> {
  const additions: DecoratorAddition[] = [];
  
  const sectionInfo = structuralScan.structure?.sections
    ?.map(s => `[${s.type}] Lines ${s.startLine}-${s.endLine}`)
    .join('\n') || '';
  
  const prompt = `Add performance markers to these lyrics:

${masonLyrics}

STRUCTURE:
${sectionInfo}

ADD (where appropriate):
- [Breath] at natural pauses
- (ad-libs) like (yeah), (oh) at emotional peaks  
- [Visual Cue: description] for performance (max 2-3 per verse)

RULES:
- NEVER change the actual words
- Only add markers

Output the lyrics with markers:`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: config.decoratorTemperature,
        maxOutputTokens: 2000
      }
    });
    
    const decoratedLyrics = response.text;
    if (!decoratedLyrics) {
      return { lyrics: masonLyrics, additions: [] };
    }
    
    const parsedAdditions = parseDecoratorOutput(decoratedLyrics, masonLyrics);
    additions.push(...parsedAdditions);
    
    return { lyrics: decoratedLyrics, additions };
  } catch (error) {
    console.error('Decorator pass failed:', error);
    return { lyrics: masonLyrics, additions: [] };
  }
}

// ============================================================================
// FULL TWO-PASS EXECUTION
// ============================================================================

/**
 * Execute the complete two-pass rewrite
 */
export async function executeTwoPassRewrite(
  originalLyrics: string,
  plan: DraftExecutionPlan,
  structuralScan: StructuralScanResult,
  config: Partial<RewriteConfig> = {}
): Promise<RewriteResult> {
  const fullConfig: RewriteConfig = { ...DEFAULT_CONFIG, ...config };
  
  console.log('[Two-Pass] Starting Mason pass...');
  const masonResult = await executeMasonPass(
    originalLyrics,
    plan,
    structuralScan,
    fullConfig
  );
  console.log(`[Two-Pass] Mason: ${masonResult.appliedChanges.length} changes`);
  
  console.log('[Two-Pass] Starting Decorator pass...');
  const decoratorResult = await executeDecoratorPass(
    masonResult.lyrics,
    structuralScan,
    fullConfig
  );
  console.log(`[Two-Pass] Decorator: ${decoratorResult.additions.length} additions`);
  
  const metrics = calculateMetrics(
    originalLyrics,
    decoratorResult.lyrics,
    masonResult,
    decoratorResult.additions
  );
  
  return {
    rewrittenLyrics: decoratorResult.lyrics,
    changesApplied: masonResult.appliedChanges,
    failedChanges: masonResult.failedChanges,
    decoratorAdditions: decoratorResult.additions,
    metrics
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function buildRhymeDependencyMap(plan: DraftExecutionPlan): Map<number, number[]> {
  const map = new Map<number, number[]>();
  
  for (const dep of plan.rhymeDependencies) {
    for (const line of dep.group) {
      map.set(line, dep.group.filter(l => l !== line));
    }
  }
  
  return map;
}

function buildRhymeGroupPrompt(
  groupedLines: Array<{lineNumber: number; text: string; rationale: string; syllableTarget: number}>,
  examplesText: string
): string {
  return `Rewrite these connected lines as a group (they rhyme together):

${groupedLines.map(l => `Line ${l.lineNumber}: "${l.text}"
  - Syllables: ${l.syllableTarget} (MUST match ±1)
  - Goal: ${l.rationale}`).join('\n\n')}

${examplesText ? `\nEXAMPLES:\n${examplesText}` : ''}

OUTPUT (one per line, same order):
LINE 1: [rewritten]
LINE 2: [rewritten]
...`;
}

function parseGroupedResponse(response: string, expectedCount: number): string[] {
  const lines: string[] = [];
  const matches = response.matchAll(/LINE\s*\d+:\s*(.+)/gi);
  for (const match of matches) {
    lines.push(match[1].trim());
  }
  
  if (lines.length < expectedCount) {
    const rawLines = response.split('\n').filter(l => l.trim());
    return rawLines.slice(0, expectedCount);
  }
  
  return lines;
}

function extractSingleLine(response: string): string {
  let text = response.trim();
  text = text.replace(/^(rewritten line:|output:)/i, '').trim();
  if ((text.startsWith('"') && text.endsWith('"'))) {
    text = text.slice(1, -1);
  }
  return text.split('\n')[0].trim();
}

function validateLine(newText: string, syllableTarget: number, config: RewriteConfig): boolean {
  const newSyllables = countSyllables(newText);
  const drift = Math.abs(newSyllables - syllableTarget);
  
  if (config.strictSyllables && drift > 2) return false;
  if (newText.length < 3) return false;
  
  return true;
}

function countSyllables(text: string): number {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  let total = 0;
  
  for (const word of words) {
    if (word.length <= 3) {
      total += 1;
      continue;
    }
    const vowels = word.match(/[aeiouy]+/g) || [];
    let count = vowels.length;
    if (word.endsWith('e')) count--;
    if (word.endsWith('le') && word.length > 2) count++;
    total += Math.max(1, count);
  }
  
  return total;
}

function parseDecoratorOutput(decorated: string, original: string): DecoratorAddition[] {
  const additions: DecoratorAddition[] = [];
  const decoratedLines = decorated.split('\n');
  const originalLines = original.split('\n');
  
  for (let i = 0; i < decoratedLines.length && i < originalLines.length; i++) {
    const dec = decoratedLines[i];
    const orig = originalLines[i];
    
    // Find [Breath]
    if (dec.includes('[Breath]') && !orig.includes('[Breath]')) {
      additions.push({
        lineNumber: i + 1,
        type: 'breath',
        insertion: '[Breath]',
        position: 'inline'
      });
    }
    
    // Find (ad-libs)
    const adLibs = dec.matchAll(/\(([^)]+)\)/g);
    for (const match of adLibs) {
      if (!orig.includes(match[0])) {
        additions.push({
          lineNumber: i + 1,
          type: 'ad-lib',
          insertion: match[0],
          position: 'inline'
        });
      }
    }
    
    // Find [Visual Cue: ...]
    const visuals = dec.matchAll(/\[Visual Cue:[^\]]+\]/gi);
    for (const match of visuals) {
      additions.push({
        lineNumber: i + 1,
        type: 'visual-cue',
        insertion: match[0],
        position: 'before'
      });
    }
  }
  
  return additions;
}

function calculateMetrics(
  original: string,
  final: string,
  masonResult: { appliedChanges: AppliedChange[]; failedChanges: FailedChange[] },
  decorations: DecoratorAddition[]
): RewriteMetrics {
  const totalAttempted = masonResult.appliedChanges.length + masonResult.failedChanges.length;
  const totalChanged = masonResult.appliedChanges.length;
  
  const originalLines = original.split('\n');
  const finalLines = final.split('\n');
  let totalDrift = 0;
  let driftCount = 0;
  
  for (const change of masonResult.appliedChanges) {
    if (change.lineNumber <= originalLines.length && change.lineNumber <= finalLines.length) {
      const origSyl = countSyllables(originalLines[change.lineNumber - 1]);
      const newSyl = countSyllables(finalLines[change.lineNumber - 1]);
      totalDrift += Math.abs(newSyl - origSyl);
      driftCount++;
    }
  }
  
  const avgConfidence = masonResult.appliedChanges.length > 0
    ? masonResult.appliedChanges.reduce((sum, c) => sum + c.confidenceScore, 0) / masonResult.appliedChanges.length
    : 0;
  
  return {
    totalLinesChanged: totalChanged,
    totalLinesAttempted: totalAttempted,
    successRate: totalAttempted > 0 ? totalChanged / totalAttempted : 1,
    averageConfidence: avgConfidence,
    syllableDrift: driftCount > 0 ? totalDrift / driftCount : 0,
    rhymesPreserved: masonResult.appliedChanges.filter(c => c.changeType === 'rhyme').length,
    decorationsAdded: decorations.length
  };
}
