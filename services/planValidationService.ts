/**
 * DEEP ANALYTICS WORKFLOW VALIDATOR
 * 
 * This service establishes the comprehensive workflow for how the Deep Analytics page
 * operates after analysis has been populated. It validates metric relationships,
 * identifies conflicts, and ensures all data sources complement each other
 * to produce a cohesive, high-value execution plan.
 */

import { GeneratedSong, ExecutionPlan, ScoringCategory, ChatMessage } from '../types';

// Validation result for each metric interaction
export interface MetricValidation {
  metric1: string;
  metric2: string;
  relationship: 'complement' | 'conflict' | 'override' | 'independent';
  impact: 'positive' | 'negative' | 'neutral';
  explanation: string;
  resolutionStrategy?: string;
  question?: string; // Question to ask user if resolution requires their input
  valueAddedToOutput: number; // 0-100 score of how much this improves final product
}

// Complete workflow state
export interface WorkflowState {
  phase: 'analysis_loaded' | 'plan_generated' | 'agent_discussion' | 'plan_refined' | 'approved' | 'executed';
  validations: MetricValidation[];
  conflicts: WorkflowConflict[];
  overallCoherence: number; // 0-100 how well all data sources work together
  recommendations: string[];
}

export interface WorkflowConflict {
  id: string;
  type: 'metric_contradiction' | 'target_impossible' | 'data_missing' | 'user_override';
  severity: 'blocking' | 'warning' | 'info';
  description: string;
  affectedMetrics: string[];
  suggestedResolution: string;
  question?: string; // Question to ask user if resolution requires their input
}

/**
 * CORE WORKFLOW: After analysis is loaded, establish relationships between ALL data points
 */
export const validateCompleteWorkflow = (song: GeneratedSong): WorkflowState => {
  if (!song.analysis) throw new Error("Analysis must be loaded first");
  
  const validations: MetricValidation[] = [];
  const conflicts: WorkflowConflict[] = [];
  
  // 1. SCORE BREAKDOWN vs LINE-BY-LINE IMPROVEMENTS
  validations.push(...validateScoreVsLineImprovements(song));
  
  // 2. SONIC ANALYSIS vs LINE-BY-LINE
  validations.push(...validateSonicVsLineImprovements(song));
  
  // 3. DNA MATCH vs CURRENT ANALYSIS
  if (song.analysis.dnaMatch) {
    validations.push(...validateDNAMatchVsAnalysis(song));
  }
  
  // 4. PHONETICS vs DENSITY
  validations.push(...validatePhoneticVsDensity(song));
  
  // 5. CINEMA AUDIT vs METAPHOR IMPROVEMENTS
  validations.push(...validateCinemaVsMetaphor(song));
  
  // 6. COMMERCIAL MODE vs DENSITY
  if (song.hasCommercialMode) {
    validations.push(...validateCommercialVsDensity(song));
  }
  
  // 7. TARGET SCORES vs CURRENT WEAKNESSES
  validations.push(...validateTargetsVsWeaknesses(song));
  
  // Identify conflicts
  conflicts.push(...identifyConflicts(validations, song));
  
  // Calculate overall coherence
  const coherence = calculateCoherence(validations, conflicts);
  
  // Generate recommendations
  const recommendations = generateRecommendations(validations, conflicts, song);
  
  return {
    phase: 'analysis_loaded',
    validations,
    conflicts,
    overallCoherence: coherence,
    recommendations
  };
};

/**
 * Validate Score Breakdown vs Line-by-Line Improvements
 * Question: Do the proposed line changes actually address the low-scoring categories?
 */
const validateScoreVsLineImprovements = (song: GeneratedSong): MetricValidation[] => {
  const validations: MetricValidation[] = [];
  const analysis = song.analysis!;
  
  // Find weakest categories
  const weakCategories = analysis.scoreBreakdown
    .filter(s => s.score < 7)
    .map(s => s.category);
  
  // Check if line improvements target these categories
  const lineImprovements = analysis.lineByLineImprovements;
  
  weakCategories.forEach(category => {
    const categoryScore = analysis.scoreBreakdown.find(s => s.category === category)!;
    
    // Count how many line improvements would help this category
    const relevantImprovements = lineImprovements.filter(imp => 
      imp.reason.toLowerCase().includes(category.toLowerCase()) ||
      imp.reason.toLowerCase().includes(categoryScore.reason.toLowerCase().split(' ').slice(0, 3).join(' '))
    ).length;
    
    const hasImprovements = relevantImprovements > 0;
    
    validations.push({
      metric1: `Score: ${category}`,
      metric2: 'Line-by-Line Improvements',
      relationship: hasImprovements ? 'complement' : 'conflict',
      impact: hasImprovements ? 'positive' : 'negative',
      explanation: hasImprovements 
        ? `Found ${relevantImprovements} line improvements targeting ${category} (score: ${categoryScore.score}/10)`
        : `${category} scores ${categoryScore.score}/10 but no line improvements address it. Reason: ${categoryScore.reason}`,
      resolutionStrategy: hasImprovements ? undefined : `Add line changes specifically targeting: ${categoryScore.reason}`,
      valueAddedToOutput: hasImprovements ? 75 : 20
    });
  });
  
  return validations;
};

/**
 * Validate Sonic Analysis vs Line-by-Line
 * Question: Do line improvements address phonetic/density issues?
 */
const validateSonicVsLineImprovements = (song: GeneratedSong): MetricValidation[] => {
  const validations: MetricValidation[] = [];
  const sonic = song.analysis!.sonicAnalysis;
  const lineImprovements = song.analysis!.lineByLineImprovements;
  
  // Check phonetics
  const hasPhoneticIssues = sonic.phonetics.toLowerCase().includes('awkward') || 
                           sonic.phonetics.toLowerCase().includes('clunky') ||
                           sonic.phonetics.toLowerCase().includes('harsh');
  
  if (hasPhoneticIssues) {
    const phoneticFixes = lineImprovements.filter(imp => 
      imp.reason.toLowerCase().includes('phonetic') ||
      imp.reason.toLowerCase().includes('flow') ||
      imp.reason.toLowerCase().includes('sing')
    ).length;
    
    validations.push({
      metric1: 'Sonic Analysis: Phonetics',
      metric2: 'Line-by-Line Improvements',
      relationship: phoneticFixes > 0 ? 'complement' : 'conflict',
      impact: phoneticFixes > 0 ? 'positive' : 'negative',
      explanation: phoneticFixes > 0
        ? `Phonetic issues identified, and ${phoneticFixes} line improvements address them`
        : `Phonetic issues exist (${sonic.phonetics}) but no line improvements target them`,
      resolutionStrategy: phoneticFixes > 0 ? undefined : 'Add line changes to fix phonetic flow issues',
      valueAddedToOutput: phoneticFixes > 0 ? 80 : 15
    });
  }
  
  // Check density
  const hasDensityIssues = sonic.density.toLowerCase().includes('too') ||
                          sonic.density.toLowerCase().includes('sparse') ||
                          sonic.density.toLowerCase().includes('crowded');
  
  if (hasDensityIssues) {
    const densityFixes = lineImprovements.filter(imp =>
      imp.reason.toLowerCase().includes('density') ||
      imp.reason.toLowerCase().includes('brevity') ||
      imp.reason.toLowerCase().includes('concise')
    ).length;
    
    validations.push({
      metric1: 'Sonic Analysis: Density',
      metric2: 'Line-by-Line Improvements',
      relationship: densityFixes > 0 ? 'complement' : 'conflict',
      impact: densityFixes > 0 ? 'positive' : 'negative',
      explanation: densityFixes > 0
        ? `Density issues identified, and ${densityFixes} line improvements address them`
        : `Density issues exist (${sonic.density}) but no line improvements target them`,
      resolutionStrategy: densityFixes > 0 ? undefined : 'Add line changes to adjust word density',
      valueAddedToOutput: densityFixes > 0 ? 70 : 25
    });
  }
  
  return validations;
};

/**
 * Validate DNA Match vs Current Analysis
 * Question: Are DNA match insights compatible with our song's style? Do they conflict?
 */
const validateDNAMatchVsAnalysis = (song: GeneratedSong): MetricValidation[] => {
  const validations: MetricValidation[] = [];
  const dna = song.analysis!.dnaMatch!;
  const analysis = song.analysis!;
  
  // Check structural compatibility
  const structuralScore = analysis.scoreBreakdown.find(s => s.category === 'Structure & Pacing')?.score || 5;
  const hasStructuralImprovements = dna.improvements.structural.length > 0;
  
  if (hasStructuralImprovements) {
    validations.push({
      metric1: `DNA Match: Structural (${dna.referenceSong})`,
      metric2: 'Structure & Pacing Score',
      relationship: structuralScore < 7 ? 'complement' : 'independent',
      impact: structuralScore < 7 ? 'positive' : 'neutral',
      explanation: structuralScore < 7
        ? `Structure scores ${structuralScore}/10. DNA match provides ${dna.improvements.structural.length} proven structural techniques from A-tier song`
        : `Structure scores ${structuralScore}/10 (already good). DNA structural advice may not add much value`,
      valueAddedToOutput: structuralScore < 7 ? 85 : 40
    });
  }
  
  // Check metaphor compatibility
  const metaphorScore = analysis.scoreBreakdown.find(s => s.category === 'Lyrical Originality')?.score || 5;
  const hasMetaphorImprovements = dna.improvements.metaphorical.length > 0;
  
  if (hasMetaphorImprovements) {
    validations.push({
      metric1: `DNA Match: Metaphorical (${dna.referenceSong})`,
      metric2: 'Lyrical Originality Score',
      relationship: metaphorScore < 7 ? 'complement' : 'independent',
      impact: metaphorScore < 7 ? 'positive' : 'neutral',
      explanation: metaphorScore < 7
        ? `Lyrical Originality scores ${metaphorScore}/10. DNA match provides ${dna.improvements.metaphorical.length} metaphor techniques`
        : `Lyrical Originality scores ${metaphorScore}/10 (already good). DNA metaphor advice may not be critical`,
      valueAddedToOutput: metaphorScore < 7 ? 90 : 45
    });
  }
  
  // Check sonic compatibility
  const sonicScore = analysis.scoreBreakdown.find(s => s.category === 'Melodic & Phonetic Flow')?.score || 5;
  const hasSonicImprovements = dna.improvements.sonic.length > 0;
  
  if (hasSonicImprovements) {
    validations.push({
      metric1: `DNA Match: Sonic Patterns (${dna.referenceSong})`,
      metric2: 'Melodic & Phonetic Flow Score',
      relationship: sonicScore < 7 ? 'complement' : 'independent',
      impact: sonicScore < 7 ? 'positive' : 'neutral',
      explanation: sonicScore < 7
        ? `Phonetic Flow scores ${sonicScore}/10. DNA match provides ${dna.improvements.sonic.length} proven sonic patterns`
        : `Phonetic Flow scores ${sonicScore}/10 (already good). DNA sonic advice may be optional`,
      valueAddedToOutput: sonicScore < 7 ? 80 : 35
    });
  }
  
  // Check word spacing compatibility  
  const hasWordSpacingImprovements = dna.improvements.wordSpacing.length > 0;
  
  if (hasWordSpacingImprovements) {
    validations.push({
      metric1: `DNA Match: Word Spacing (${dna.referenceSong})`,
      metric2: 'Sonic Analysis: Density',
      relationship: 'complement',
      impact: 'positive',
      explanation: `DNA match provides ${dna.improvements.wordSpacing.length} word spacing techniques that can improve density and singability`,
      valueAddedToOutput: 75
    });
  }
  
  return validations;
};

/**
 * Validate Phonetics vs Density
 * Question: Can both be addressed simultaneously? Do they conflict?
 */
const validatePhoneticVsDensity = (song: GeneratedSong): MetricValidation[] => {
  const validations: MetricValidation[] = [];
  const sonic = song.analysis!.sonicAnalysis;
  
  const phoneticIssue = sonic.phonetics.toLowerCase();
  const densityIssue = sonic.density.toLowerCase();
  
  // Scenario: Phonetics says "too fast" but density says "too sparse"
  const phoneticsTooFast = phoneticIssue.includes('fast') || phoneticIssue.includes('rushed');
  const densityTooSparse = densityIssue.includes('sparse') || densityIssue.includes('empty');
  
  if (phoneticsTooFast && densityTooSparse) {
    validations.push({
      metric1: 'Sonic Analysis: Phonetics',
      metric2: 'Sonic Analysis: Density',
      relationship: 'conflict',
      impact: 'negative',
      explanation: 'CONFLICT: Phonetics suggests slowing down, but Density suggests adding more words. These are opposing forces.',
      resolutionStrategy: 'Prioritize phonetic flow (singability) over density. Add words strategically without rushing the pace.',
      question: 'Should we prioritize singability (phonetic flow) or narrative completeness (density)? This requires a strategic choice.',
      valueAddedToOutput: 60 // Conflict reduces value until resolved
    });
  }
  
  // Scenario: Both suggest similar direction
  const phoneticsTooSlow = phoneticIssue.includes('slow') || phoneticIssue.includes('drag');
  const densityTooCrowded = densityIssue.includes('crowded') || densityIssue.includes('dense');
  
  if (phoneticsTooSlow && densityTooCrowded) {
    validations.push({
      metric1: 'Sonic Analysis: Phonetics',
      metric2: 'Sonic Analysis: Density',
      relationship: 'complement',
      impact: 'positive',
      explanation: 'ALIGNMENT: Both phonetics and density suggest cutting back words for better flow',
      valueAddedToOutput: 85
    });
  }
  
  return validations;
};

/**
 * Validate Cinema Audit vs Metaphor Improvements
 * Question: Do we have enough concrete objects? Are we adding the right ones?
 */
const validateCinemaVsMetaphor = (song: GeneratedSong): MetricValidation[] => {
  const validations: MetricValidation[] = [];
  const cinema = song.analysis!.sonicAnalysis.cinemaAudit;
  const lineImprovements = song.analysis!.lineByLineImprovements;
  
  const needsMoreObjects = cinema.score !== 'A';
  
  if (needsMoreObjects) {
    // Count how many improvements add concrete objects
    const objectAdditions = lineImprovements.filter(imp =>
      imp.improved.match(/\b(car|house|street|window|door|phone|heart|eyes|hands|road|sky|stars|rain)\b/gi)
    ).length;
    
    validations.push({
      metric1: 'Cinema Audit Score',
      metric2: 'Line-by-Line Improvements',
      relationship: objectAdditions > 0 ? 'complement' : 'conflict',
      impact: objectAdditions > 0 ? 'positive' : 'negative',
      explanation: objectAdditions > 0
        ? `Cinema audit shows ${cinema.objectCount} objects (Grade ${cinema.score}). Line improvements add ${objectAdditions} concrete objects.`
        : `Cinema audit shows only ${cinema.objectCount} objects (Grade ${cinema.score}) but line improvements don't add concrete imagery`,
      resolutionStrategy: objectAdditions > 0 ? undefined : 'Add specific physical objects to line changes (e.g., steering wheel, photograph, doorframe)',
      valueAddedToOutput: objectAdditions > 0 ? 80 : 30
    });
  }
  
  return validations;
};

/**
 * Validate Commercial Mode vs Density
 * Question: If commercial mode is ON, are we actually making lines more concise?
 */
const validateCommercialVsDensity = (song: GeneratedSong): MetricValidation[] => {
  const validations: MetricValidation[] = [];
  const density = song.analysis!.sonicAnalysis.density.toLowerCase();
  
  const densityTooCrowded = density.includes('crowded') || density.includes('wordy');
  
  validations.push({
    metric1: 'Commercial Mode (Enabled)',
    metric2: 'Sonic Analysis: Density',
    relationship: densityTooCrowded ? 'complement' : 'override',
    impact: densityTooCrowded ? 'positive' : 'neutral',
    explanation: densityTooCrowded
      ? 'Commercial Mode enabled and density is too high - perfect alignment for "less is more" approach'
      : 'Commercial Mode enabled but density is already good - may still trim for punchier hooks',
    valueAddedToOutput: densityTooCrowded ? 90 : 60
  });
  
  return validations;
};

/**
 * Validate Target Scores vs Current Weaknesses
 * Question: Are target score improvements realistic given the weaknesses?
 */
const validateTargetsVsWeaknesses = (song: GeneratedSong): MetricValidation[] => {
  const validations: MetricValidation[] = [];
  const analysis = song.analysis!;
  
  const scoreGap = analysis.projectedScore - analysis.overallScore;
  const majorWeaknesses = analysis.weaknesses.length;
  
  // If we have 5+ major weaknesses, can we realistically jump 15+ points?
  const isAmbitious = scoreGap > 15 && majorWeaknesses >= 5;
  
  validations.push({
    metric1: 'Projected Score',
    metric2: 'Weaknesses Count',
    relationship: isAmbitious ? 'conflict' : 'complement',
    impact: isAmbitious ? 'negative' : 'positive',
    explanation: isAmbitious
      ? `Projected score improvement of ${scoreGap} points with ${majorWeaknesses} major weaknesses may be too optimistic`
      : `Projected score improvement of ${scoreGap} points with ${majorWeaknesses} weaknesses seems realistic`,
    resolutionStrategy: isAmbitious ? 'Adjust projected score to be more conservative, or ensure EVERY weakness has a concrete solution' : undefined,
    question: isAmbitious ? `Can we realistically fix ${majorWeaknesses} major issues and gain ${scoreGap} points? What if we only fix 70% of them?` : undefined,
    valueAddedToOutput: isAmbitious ? 40 : 75
  });
  
  return validations;
};

/**
 * Identify major conflicts that block execution
 */
const identifyConflicts = (validations: MetricValidation[], song: GeneratedSong): WorkflowConflict[] => {
  const conflicts: WorkflowConflict[] = [];
  
  // Find all conflict relationships
  const conflictValidations = validations.filter(v => v.relationship === 'conflict');
  
  conflictValidations.forEach((v, index) => {
    conflicts.push({
      id: `conflict-${index}`,
      type: 'metric_contradiction',
      severity: v.valueAddedToOutput < 50 ? 'blocking' : 'warning',
      description: v.explanation,
      affectedMetrics: [v.metric1, v.metric2],
      suggestedResolution: v.resolutionStrategy || 'Manual review required',
      question: v.question
    });
  });
  
  // Check for missing critical data
  if (!song.analysis?.dnaMatch) {
    conflicts.push({
      id: 'missing-dna',
      type: 'data_missing',
      severity: 'info',
      description: 'No DNA Match reference song found. This limits our ability to learn from proven hits.',
      affectedMetrics: ['DNA Match Insights'],
      suggestedResolution: 'Consider adding DNA match analysis for higher-quality improvements'
    });
  }
  
  return conflicts;
};

/**
 * Calculate overall coherence score
 */
const calculateCoherence = (validations: MetricValidation[], conflicts: WorkflowConflict[]): number => {
  if (validations.length === 0) return 0;
  
  // Weight: complement = 1.0, independent = 0.5, conflict = -1.0, override = 0.3
  const weights = {
    complement: 1.0,
    independent: 0.5,
    conflict: -1.0,
    override: 0.3
  };
  
  const totalWeight = validations.reduce((sum, v) => sum + weights[v.relationship], 0);
  const maxPossibleWeight = validations.length; // If all were complements
  
  let coherence = (totalWeight / maxPossibleWeight) * 100;
  
  // Penalize for blocking conflicts
  const blockingConflicts = conflicts.filter(c => c.severity === 'blocking').length;
  coherence -= blockingConflicts * 15;
  
  return Math.max(0, Math.min(100, coherence));
};

/**
 * Generate actionable recommendations
 */
const generateRecommendations = (
  validations: MetricValidation[], 
  conflicts: WorkflowConflict[],
  song: GeneratedSong
): string[] => {
  const recommendations: string[] = [];
  
  // Find high-value complementary relationships
  const highValue = validations.filter(v => v.valueAddedToOutput >= 80 && v.relationship === 'complement');
  if (highValue.length > 0) {
    recommendations.push(`✅ LEVERAGE: ${highValue.length} high-value data sources are aligned. Prioritize these in the rewrite plan.`);
  }
  
  // Find low-value areas
  const lowValue = validations.filter(v => v.valueAddedToOutput < 40);
  if (lowValue.length > 0) {
    recommendations.push(`⚠️ LOW IMPACT: ${lowValue.length} metrics have low value-add. Consider deprioritizing or discussing with user.`);
  }
  
  // Recommend agent discussion for conflicts
  const criticalConflicts = conflicts.filter(c => c.severity === 'blocking' || c.severity === 'warning');
  if (criticalConflicts.length > 0) {
    recommendations.push(`🤖 AGENT REVIEW: ${criticalConflicts.length} conflicts detected. Open agent to discuss resolution strategies.`);
  }
  
  // DNA match utilization
  if (song.analysis?.dnaMatch) {
    const dnaValidations = validations.filter(v => v.metric1.includes('DNA Match'));
    const highValueDNA = dnaValidations.filter(v => v.valueAddedToOutput >= 70);
    if (highValueDNA.length > 0) {
      recommendations.push(`🧬 DNA PRIORITY: ${highValueDNA.length} A-tier techniques from "${song.analysis.dnaMatch.referenceSong}" are highly applicable.`);
    }
  }
  
  // Commercial mode alignment
  if (song.hasCommercialMode) {
    const densityCheck = validations.find(v => v.metric1.includes('Commercial Mode'));
    if (densityCheck && densityCheck.valueAddedToOutput >= 80) {
      recommendations.push(`📈 COMMERCIAL BOOST: "Less is More" mode aligns perfectly with current density issues.`);
    }
  }
  
  return recommendations;
};

/**
 * WORKFLOW: Generate plan with full validation context
 */
export const generateValidatedPlan = async (
  song: GeneratedSong,
  workflowState: WorkflowState,
  chatInsights?: string[]
): Promise<{ plan: any; warnings: string[] }> => {
  const warnings: string[] = [];
  
  // Add warnings for each blocking conflict
  workflowState.conflicts
    .filter(c => c.severity === 'blocking')
    .forEach(c => {
      warnings.push(`⛔ BLOCKING: ${c.description}`);
      if (c.question) warnings.push(`❓ ${c.question}`);
    });
  
  // Add warnings for low coherence
  if (workflowState.overallCoherence < 60) {
    warnings.push(`⚠️ LOW COHERENCE: Overall data coherence is ${Math.round(workflowState.overallCoherence)}%. Consider agent discussion to resolve conflicts.`);
  }
  
  // Build enhanced context for plan generation
  const validationContext = {
    coherenceScore: workflowState.overallCoherence,
    highValueMetrics: workflowState.validations.filter(v => v.valueAddedToOutput >= 75),
    conflicts: workflowState.conflicts,
    recommendations: workflowState.recommendations
  };
  
  // The plan generation will use this context to make informed decisions
  return {
    plan: validationContext,
    warnings
  };
};
