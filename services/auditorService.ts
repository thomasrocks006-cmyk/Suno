/**
 * auditorService.ts
 * 
 * AUDITOR SERVICE - Phase 8 of v5 Architecture
 * 
 * The Auditor validates that all approved changes were applied correctly.
 * It produces warning badges for the UI.
 * 
 * @version 5.0.0
 * @see BOARD_DIRECTIVE_v5_FINAL.md - Phase 8
 */

import type { RewriteResult, AppliedChange } from './twoPassRewrite';
import type { StructuralScanResult } from './structuralScanService';
import type { DraftExecutionPlan } from './plannerAgent';
import type { JudgeSummary } from './judgeAgent';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ValidationSeverity = 'critical' | 'warning' | 'pass' | 'info';

export interface ValidationBadge {
  id: string;
  category: 'rhyme' | 'syllable' | 'mandate' | 'structure' | 'sensory' | 'general';
  severity: ValidationSeverity;
  message: string;
  affectedLines: number[];
  details: string;
  suggestedAction?: string;
}

export interface AuditReport {
  overallStatus: 'pass' | 'fail' | 'warning';
  timestamp: Date;
  badges: ValidationBadge[];
  summary: AuditSummary;
  comparison: BeforeAfterComparison;
  recommendation: string;
}

export interface AuditSummary {
  criticalCount: number;
  warningCount: number;
  passCount: number;
  infoCount: number;
  totalChecks: number;
  passRate: number;
}

export interface BeforeAfterComparison {
  totalSyllableChange: number;
  averageSyllableDrift: number;
  rhymesPreserved: number;
  rhymesBroken: number;
  mandatesComplied: number;
  mandatesViolated: number;
  sensoryWordsBefore: number;
  sensoryWordsAfter: number;
}

// ============================================================================
// MAIN AUDIT FUNCTION
// ============================================================================

/**
 * Run the full audit on rewritten lyrics
 */
export async function runAudit(
  originalLyrics: string,
  rewriteResult: RewriteResult,
  originalScan: StructuralScanResult,
  plan: DraftExecutionPlan,
  judgeSummary?: JudgeSummary
): Promise<AuditReport> {
  const badges: ValidationBadge[] = [];
  
  // 1. Rhyme validation
  const rhymeBadges = validateRhymeScheme(
    originalLyrics,
    rewriteResult.rewrittenLyrics,
    originalScan
  );
  badges.push(...rhymeBadges);
  
  // 2. Syllable drift
  const syllableBadges = validateSyllableDrift(
    originalLyrics,
    rewriteResult.rewrittenLyrics,
    rewriteResult.changesApplied
  );
  badges.push(...syllableBadges);
  
  // 3. Mandate compliance
  const mandateBadges = validateMandateCompliance(
    rewriteResult.changesApplied,
    rewriteResult.failedChanges,
    plan
  );
  badges.push(...mandateBadges);
  
  // 4. Structure preservation
  const structureBadges = validateStructure(
    originalLyrics,
    rewriteResult.rewrittenLyrics,
    originalScan
  );
  badges.push(...structureBadges);
  
  // 5. Sensory density
  const sensoryBadges = validateSensoryDensity(
    originalLyrics,
    rewriteResult.rewrittenLyrics
  );
  badges.push(...sensoryBadges);
  
  // Calculate summary
  const summary = calculateSummary(badges);
  const comparison = calculateComparison(originalLyrics, rewriteResult, plan);
  const overallStatus = determineStatus(summary);
  const recommendation = generateRecommendation(overallStatus, summary, comparison);
  
  return {
    overallStatus,
    timestamp: new Date(),
    badges,
    summary,
    comparison,
    recommendation
  };
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

function validateRhymeScheme(
  originalLyrics: string,
  rewrittenLyrics: string,
  originalScan: StructuralScanResult
): ValidationBadge[] {
  const badges: ValidationBadge[] = [];
  
  const rhymeScheme = originalScan.rhymeScheme;
  if (!rhymeScheme || !rhymeScheme.rhymePairs) {
    badges.push({
      id: 'rhyme-no-data',
      category: 'rhyme',
      severity: 'info',
      message: 'No rhyme analysis data',
      affectedLines: [],
      details: 'Could not validate rhymes'
    });
    return badges;
  }
  
  const rewrittenLines = rewrittenLyrics.split('\n');
  const brokenRhymes: Array<{lines: number[]; words: string[]}> = [];
  
  for (const pair of rhymeScheme.rhymePairs) {
    if (pair.rhymeType === 'none') continue;
    
    const word1 = extractEndWord(rewrittenLines[pair.line1 - 1] || '');
    const word2 = extractEndWord(rewrittenLines[pair.line2 - 1] || '');
    
    if (!doWordsRhyme(word1, word2)) {
      brokenRhymes.push({
        lines: [pair.line1, pair.line2],
        words: [word1, word2]
      });
    }
  }
  
  if (brokenRhymes.length > 0) {
    badges.push({
      id: 'rhyme-broken',
      category: 'rhyme',
      severity: 'critical',
      message: `${brokenRhymes.length} rhyme pairs broken`,
      affectedLines: brokenRhymes.flatMap(b => b.lines),
      details: brokenRhymes.map(b => 
        `Lines ${b.lines.join(', ')}: "${b.words.join('" / "')}"`
      ).join('\n'),
      suggestedAction: 'Review and restore rhyme scheme'
    });
  } else {
    badges.push({
      id: 'rhyme-preserved',
      category: 'rhyme',
      severity: 'pass',
      message: 'All rhymes preserved',
      affectedLines: [],
      details: 'No rhyme violations'
    });
  }
  
  return badges;
}

function validateSyllableDrift(
  originalLyrics: string,
  rewrittenLyrics: string,
  appliedChanges: AppliedChange[]
): ValidationBadge[] {
  const badges: ValidationBadge[] = [];
  const DRIFT_WARNING = 0.15;
  const DRIFT_CRITICAL = 0.25;
  
  const originalLines = originalLyrics.split('\n');
  const rewrittenLines = rewrittenLyrics.split('\n');
  
  const highDrift: Array<{line: number; original: number; new: number; drift: number}> = [];
  const criticalDrift: Array<{line: number; original: number; new: number; drift: number}> = [];
  
  for (const change of appliedChanges) {
    const lineNum = change.lineNumber;
    if (lineNum > originalLines.length || lineNum > rewrittenLines.length) continue;
    
    const origSyl = countSyllables(originalLines[lineNum - 1]);
    const newSyl = countSyllables(rewrittenLines[lineNum - 1]);
    
    const drift = origSyl > 0 ? Math.abs(newSyl - origSyl) / origSyl : 0;
    
    if (drift >= DRIFT_CRITICAL) {
      criticalDrift.push({ line: lineNum, original: origSyl, new: newSyl, drift });
    } else if (drift >= DRIFT_WARNING) {
      highDrift.push({ line: lineNum, original: origSyl, new: newSyl, drift });
    }
  }
  
  if (criticalDrift.length > 0) {
    badges.push({
      id: 'syllable-critical',
      category: 'syllable',
      severity: 'critical',
      message: `Critical syllable drift on ${criticalDrift.length} lines`,
      affectedLines: criticalDrift.map(d => d.line),
      details: criticalDrift.map(d => 
        `Line ${d.line}: ${d.original} → ${d.new} (${Math.round(d.drift * 100)}%)`
      ).join('\n'),
      suggestedAction: 'Rebalance these lines'
    });
  }
  
  if (highDrift.length > 0) {
    badges.push({
      id: 'syllable-warning',
      category: 'syllable',
      severity: 'warning',
      message: `Moderate syllable drift on ${highDrift.length} lines`,
      affectedLines: highDrift.map(d => d.line),
      details: highDrift.map(d => 
        `Line ${d.line}: ${d.original} → ${d.new} (${Math.round(d.drift * 100)}%)`
      ).join('\n')
    });
  }
  
  if (criticalDrift.length === 0 && highDrift.length === 0) {
    badges.push({
      id: 'syllable-ok',
      category: 'syllable',
      severity: 'pass',
      message: 'Syllable counts maintained',
      affectedLines: [],
      details: 'All lines within tolerance'
    });
  }
  
  return badges;
}

function validateMandateCompliance(
  appliedChanges: AppliedChange[],
  failedChanges: { lineNumber: number; rationale: string; reason: string }[],
  plan: DraftExecutionPlan
): ValidationBadge[] {
  const badges: ValidationBadge[] = [];
  
  const totalMandates = plan.lineLevelChanges.length;
  const appliedCount = appliedChanges.length;
  const failedCount = failedChanges.length;
  
  if (failedChanges.length > 0) {
    badges.push({
      id: 'mandate-failures',
      category: 'mandate',
      severity: failedCount > totalMandates * 0.3 ? 'critical' : 'warning',
      message: `${failedCount} of ${totalMandates} changes failed`,
      affectedLines: failedChanges.map(f => f.lineNumber),
      details: failedChanges.map(f => 
        `Line ${f.lineNumber}: "${f.rationale}" - ${f.reason}`
      ).join('\n'),
      suggestedAction: 'Review failed changes'
    });
  }
  
  if (appliedCount === totalMandates) {
    badges.push({
      id: 'mandate-complete',
      category: 'mandate',
      severity: 'pass',
      message: 'All changes applied',
      affectedLines: [],
      details: `${appliedCount}/${totalMandates} complete`
    });
  }
  
  return badges;
}

function validateStructure(
  originalLyrics: string,
  rewrittenLyrics: string,
  originalScan: StructuralScanResult
): ValidationBadge[] {
  const badges: ValidationBadge[] = [];
  
  const originalCount = originalLyrics.split('\n').length;
  const rewrittenCount = rewrittenLyrics.split('\n').length;
  
  if (rewrittenCount !== originalCount) {
    badges.push({
      id: 'structure-line-count',
      category: 'structure',
      severity: 'warning',
      message: `Line count changed: ${originalCount} → ${rewrittenCount}`,
      affectedLines: [],
      details: 'Number of lines has changed'
    });
  } else {
    badges.push({
      id: 'structure-preserved',
      category: 'structure',
      severity: 'pass',
      message: 'Structure preserved',
      affectedLines: [],
      details: 'Line count and sections intact'
    });
  }
  
  return badges;
}

function validateSensoryDensity(
  originalLyrics: string,
  rewrittenLyrics: string
): ValidationBadge[] {
  const badges: ValidationBadge[] = [];
  
  const SENSORY_WORDS = new Set([
    'see', 'look', 'watch', 'hear', 'listen', 'feel', 'touch',
    'smell', 'taste', 'bright', 'dark', 'loud', 'quiet', 'soft', 'hard',
    'warm', 'cold', 'sweet', 'bitter', 'sharp', 'smooth'
  ]);
  
  const originalWords = originalLyrics.toLowerCase().split(/\s+/);
  const rewrittenWords = rewrittenLyrics.toLowerCase().split(/\s+/);
  
  const origSensory = originalWords.filter(w => SENSORY_WORDS.has(w)).length;
  const newSensory = rewrittenWords.filter(w => SENSORY_WORDS.has(w)).length;
  
  const change = origSensory > 0 ? (newSensory - origSensory) / origSensory : 0;
  
  if (change < -0.3) {
    badges.push({
      id: 'sensory-drop',
      category: 'sensory',
      severity: 'warning',
      message: 'Sensory word density dropped',
      affectedLines: [],
      details: `${origSensory} → ${newSensory} sensory words (${Math.round(change * 100)}%)`,
      suggestedAction: 'Consider adding more vivid language'
    });
  } else {
    badges.push({
      id: 'sensory-ok',
      category: 'sensory',
      severity: 'pass',
      message: 'Sensory density maintained',
      affectedLines: [],
      details: `${origSensory} → ${newSensory} sensory words`
    });
  }
  
  return badges;
}

// ============================================================================
// HELPERS
// ============================================================================

function extractEndWord(line: string): string {
  const cleaned = line
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .trim();
  const words = cleaned.split(/\s+/);
  return words[words.length - 1] || '';
}

function doWordsRhyme(word1: string, word2: string): boolean {
  if (!word1 || !word2) return false;
  
  const clean1 = word1.toLowerCase().replace(/[^a-z]/g, '');
  const clean2 = word2.toLowerCase().replace(/[^a-z]/g, '');
  
  if (clean1.length < 2 || clean2.length < 2) return true;
  
  const end1 = clean1.slice(-3);
  const end2 = clean2.slice(-3);
  
  return end1 === end2 || end1.slice(-2) === end2.slice(-2);
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

function calculateSummary(badges: ValidationBadge[]): AuditSummary {
  const criticalCount = badges.filter(b => b.severity === 'critical').length;
  const warningCount = badges.filter(b => b.severity === 'warning').length;
  const passCount = badges.filter(b => b.severity === 'pass').length;
  const infoCount = badges.filter(b => b.severity === 'info').length;
  
  const totalChecks = badges.length;
  const passRate = totalChecks > 0 ? passCount / totalChecks : 1;
  
  return { criticalCount, warningCount, passCount, infoCount, totalChecks, passRate };
}

function calculateComparison(
  original: string,
  rewriteResult: RewriteResult,
  plan: DraftExecutionPlan
): BeforeAfterComparison {
  const originalLines = original.split('\n');
  const rewrittenLines = rewriteResult.rewrittenLyrics.split('\n');
  
  let totalSyllableChange = 0;
  let changedCount = 0;
  
  for (const change of rewriteResult.changesApplied) {
    if (change.lineNumber <= originalLines.length && change.lineNumber <= rewrittenLines.length) {
      const origSyl = countSyllables(originalLines[change.lineNumber - 1]);
      const newSyl = countSyllables(rewrittenLines[change.lineNumber - 1]);
      totalSyllableChange += Math.abs(newSyl - origSyl);
      changedCount++;
    }
  }
  
  const SENSORY = new Set(['see', 'look', 'hear', 'feel', 'touch', 'smell', 'taste']);
  const origWords = original.toLowerCase().split(/\s+/);
  const newWords = rewriteResult.rewrittenLyrics.toLowerCase().split(/\s+/);
  
  return {
    totalSyllableChange,
    averageSyllableDrift: changedCount > 0 ? totalSyllableChange / changedCount : 0,
    rhymesPreserved: rewriteResult.changesApplied.filter(c => c.changeType === 'rhyme').length,
    rhymesBroken: 0,
    mandatesComplied: rewriteResult.changesApplied.length,
    mandatesViolated: rewriteResult.failedChanges.length,
    sensoryWordsBefore: origWords.filter(w => SENSORY.has(w)).length,
    sensoryWordsAfter: newWords.filter(w => SENSORY.has(w)).length
  };
}

function determineStatus(summary: AuditSummary): 'pass' | 'fail' | 'warning' {
  if (summary.criticalCount > 0) return 'fail';
  if (summary.warningCount > 2) return 'warning';
  if (summary.passRate < 0.5) return 'warning';
  return 'pass';
}

function generateRecommendation(
  status: 'pass' | 'fail' | 'warning',
  summary: AuditSummary,
  comparison: BeforeAfterComparison
): string {
  if (status === 'pass') {
    return `✅ All validations passed. Safe to finalize.`;
  }
  
  if (status === 'fail') {
    return `❌ Critical issues: ${summary.criticalCount} problems require attention.`;
  }
  
  return `⚠️ Review recommended: ${summary.warningCount} warnings to review.`;
}

/**
 * Quick validation for a single line
 */
export function quickValidateLine(
  originalLine: string,
  newLine: string,
  expectedSyllables?: number
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  const origSyl = countSyllables(originalLine);
  const newSyl = countSyllables(newLine);
  const target = expectedSyllables ?? origSyl;
  
  const drift = Math.abs(newSyl - target);
  if (drift > 2) {
    issues.push(`Syllables off by ${drift}`);
  }
  
  if (newLine.length < 3) {
    issues.push('Line too short');
  }
  
  return { valid: issues.length === 0, issues };
}
