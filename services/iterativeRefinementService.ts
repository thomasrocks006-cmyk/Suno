/**
 * ITERATIVE REFINEMENT LOOP SERVICE (Migrated for 11-Category System)
 * Draft → Critique → Polish workflow
 * Runs multiple revision passes until quality threshold is met
 */

import { SongAnalysis, RewritePlanProposal, ScoringCategory, ScoreComponent } from '../types';

export interface RevisionPass {
  passNumber: number;
  stage: 'draft' | 'critique' | 'polish';
  timestamp: Date;
  plan: RewritePlanProposal;
  qualityScore: number; // 0-100
  critiques: CritiqueItem[];
  polishActions: string[];
}

export interface CritiqueItem {
  category: ScoringCategory;
  severity: 'minor' | 'moderate' | 'critical';
  issue: string;
  affectedLines: number[];
  suggestedFix: string;
}

export interface IterativeRefinementConfig {
  maxPasses: number; // Default: 3
  qualityThreshold: number; // Stop when quality >= this (0-100)
  minImprovementDelta: number; // Stop if improvement < this between passes (%)
  focusCategories?: ScoringCategory[]; // Prioritize these categories
}

const DEFAULT_CONFIG: IterativeRefinementConfig = {
  maxPasses: 3,
  qualityThreshold: 85,
  minImprovementDelta: 5
};

/**
 * Main iterative refinement orchestrator
 * Runs Draft → Critique → Polish until convergence or max passes
 */
export const runIterativeRefinement = async (
  initialPlan: RewritePlanProposal,
  analysis: SongAnalysis,
  generatePlanFn: (critiques: CritiqueItem[]) => Promise<RewritePlanProposal>,
  config: Partial<IterativeRefinementConfig> = {}
): Promise<{
  finalPlan: RewritePlanProposal;
  passes: RevisionPass[];
  convergenceReason: string;
  totalImprovement: number;
}> => {
  
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const passes: RevisionPass[] = [];
  let currentPlan = initialPlan;
  let previousQuality = 0;

  for (let passNum = 1; passNum <= fullConfig.maxPasses; passNum++) {
    
    // === STAGE 1: DRAFT ===
    const draftPass: RevisionPass = {
      passNumber: passNum,
      stage: 'draft',
      timestamp: new Date(),
      plan: currentPlan,
      qualityScore: 0, // Will be calculated in critique
      critiques: [],
      polishActions: []
    };

    // === STAGE 2: CRITIQUE ===
    const critiques = await runCritique(currentPlan, analysis, fullConfig);
    draftPass.critiques = critiques;

    // Calculate quality score based on critique severity
    const qualityScore = calculateQualityScore(critiques, analysis);
    draftPass.qualityScore = qualityScore;

    passes.push(draftPass);

    console.log(`🔄 Pass ${passNum} - Quality: ${qualityScore}/100 (${critiques.length} critiques)`);

    // Check convergence conditions
    if (qualityScore >= fullConfig.qualityThreshold) {
      return {
        finalPlan: currentPlan,
        passes,
        convergenceReason: `Quality threshold met (${qualityScore} >= ${fullConfig.qualityThreshold})`,
        totalImprovement: qualityScore - passes[0].qualityScore
      };
    }

    if (passNum > 1) {
      const improvement = qualityScore - previousQuality;
      if (improvement < fullConfig.minImprovementDelta && improvement >= 0) {
        return {
          finalPlan: currentPlan,
          passes,
          convergenceReason: `Diminishing returns (improvement ${improvement}% < ${fullConfig.minImprovementDelta}%)`,
          totalImprovement: qualityScore - passes[0].qualityScore
        };
      }

      if (improvement < 0) {
        // Quality degraded - revert to previous pass
        return {
          finalPlan: passes[passes.length - 2].plan,
          passes,
          convergenceReason: `Quality degraded by ${Math.abs(improvement)}% - reverting to previous pass`,
          totalImprovement: previousQuality - passes[0].qualityScore
        };
      }
    }

    // === STAGE 3: POLISH ===
    if (critiques.length > 0 && passNum < fullConfig.maxPasses) {
      console.log(`✨ Polishing plan based on ${critiques.length} critique(s)...`);
      currentPlan = await generatePlanFn(critiques);
    }

    previousQuality = qualityScore;
  }

  // Max passes reached
  return {
    finalPlan: currentPlan,
    passes,
    convergenceReason: `Max passes reached (${fullConfig.maxPasses})`,
    totalImprovement: passes[passes.length - 1].qualityScore - passes[0].qualityScore
  };
};

/**
 * Run critique phase - identify issues in current plan
 */
const runCritique = async (
  plan: RewritePlanProposal,
  analysis: SongAnalysis,
  config: IterativeRefinementConfig
): Promise<CritiqueItem[]> => {
  
  const critiques: CritiqueItem[] = [];

  // Get scores for each category
  const getScore = (category: ScoringCategory): number => {
    const scores = analysis.scoreBreakdown.filter(s => s.category === category);
    if (scores.length === 0) return 5;
    return scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  };

  // Only critique focus categories if specified
  const categoriesToCritique = config.focusCategories || [
    'Lyrical Originality',
    'Melodic & Phonetic Flow',
    'Emotional Impact',
    'Structure & Pacing',
    'Commercial Potential',
    'Hook Factor'
  ];

  categoriesToCritique.forEach(category => {
    const score = getScore(category);
    
    // Only critique if score is below 7
    if (score < 7) {
      critiques.push(...critiqueCategory(category, score, plan, analysis));
    }
  });

  // Sort by severity
  return critiques.sort((a, b) => {
    const severityOrder = { critical: 0, moderate: 1, minor: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
};

/**
 * Generate critiques for a specific category
 */
const critiqueCategory = (
  category: ScoringCategory,
  score: number,
  plan: RewritePlanProposal,
  analysis: SongAnalysis
): CritiqueItem[] => {
  const critiques: CritiqueItem[] = [];

  switch (category) {
    case 'Hook Factor':
      if (score < 6) {
        critiques.push({
          category,
          severity: 'critical',
          issue: 'Hook strength insufficient - needs catchier, more memorable centerpiece',
          affectedLines: [],
          suggestedFix: 'Identify strongest melodic moment and elevate it with repetition and simplicity'
        });
      }
      break;

    case 'Structure & Pacing':
      if (score < 7 && plan.executionPlan.lineLevelChanges) {
        const hookLine = plan.executionPlan.lineLevelChanges.find(change => 
          change.newLine.toLowerCase().includes('hook') ||
          change.reason.toLowerCase().includes('hook')
        );

        if (!hookLine || hookLine.lineNumber > 8) {
          critiques.push({
            category,
            severity: 'critical',
            issue: 'Hook appears too late in song (should be in first 8 lines)',
            affectedLines: hookLine ? [hookLine.lineNumber] : [],
            suggestedFix: 'Move strongest melodic line to top of verse 1 or pre-chorus'
          });
        }
      }
      break;

    case 'Melodic & Phonetic Flow':
      if (score < 7 && plan.executionPlan.lineLevelChanges) {
        const problematicLines = plan.executionPlan.lineLevelChanges.filter(change => {
          const line = change.newLine.toLowerCase();
          return /[bcdfghjklmnpqrstvwxyz]{3,}/.test(line); // 3+ consonants in a row
        });

        if (problematicLines.length > 0) {
          critiques.push({
            category,
            severity: 'moderate',
            issue: 'Consonant clusters detected (hard to sing)',
            affectedLines: problematicLines.map(p => p.lineNumber),
            suggestedFix: 'Replace harsh consonant groups with vowel-rich alternatives'
          });
        }
      }
      break;

    case 'Emotional Impact':
      if (score < 7 && plan.executionPlan.lineLevelChanges) {
        const cliches = [
          'heart of gold', 'love at first sight', 'time will tell',
          'forever and always', 'meant to be', 'soul mate'
        ];

        const genericLines = plan.executionPlan.lineLevelChanges.filter(change => {
          const line = change.newLine.toLowerCase();
          return cliches.some(cliche => line.includes(cliche));
        });

        if (genericLines.length > 0) {
          critiques.push({
            category,
            severity: 'critical',
            issue: 'Cliché phrases reduce emotional authenticity',
            affectedLines: genericLines.map(g => g.lineNumber),
            suggestedFix: 'Replace with specific, personal imagery (show, don\'t tell)'
          });
        }
      }
      break;

    case 'Commercial Potential':
      if (score < 7 && plan.executionPlan.lineLevelChanges) {
        const chorusLines = plan.executionPlan.lineLevelChanges.filter(c => 
          c.originalLine.includes('[Chorus]')
        );

        if (chorusLines.length < 8) {
          critiques.push({
            category,
            severity: 'moderate',
            issue: 'Insufficient chorus repetition (reduces memorability)',
            affectedLines: [],
            suggestedFix: 'Add one more full chorus repeat or extend outro with chorus hook'
          });
        }
      }
      break;

    case 'Lyrical Originality':
      if (score < 6) {
        critiques.push({
          category,
          severity: 'moderate',
          issue: 'Lyrics feel derivative or predictable',
          affectedLines: [],
          suggestedFix: 'Introduce unexpected metaphors, unique word choices, or fresh perspective'
        });
      }
      break;

    case 'Narrative Arc':
      if (score < 7) {
        critiques.push({
          category,
          severity: 'moderate',
          issue: 'Story progression unclear or incomplete',
          affectedLines: [],
          suggestedFix: 'Establish clear beginning (setup), middle (conflict), end (resolution)'
        });
      }
      break;

    case 'Imagery & Sensory Detail':
      if (score < 7) {
        critiques.push({
          category,
          severity: 'minor',
          issue: 'Lacks vivid sensory details (visual, tactile, auditory)',
          affectedLines: [],
          suggestedFix: 'Add concrete imagery: what do you see/hear/feel/taste/smell?'
        });
      }
      break;

    case 'Vocal Playability':
      if (score < 7) {
        critiques.push({
          category,
          severity: 'moderate',
          issue: 'Difficult vocal phrasing or breath management issues',
          affectedLines: [],
          suggestedFix: 'Shorten complex lines, add natural breath points, simplify syllable density'
        });
      }
      break;

    case 'Thematic Cohesion':
      if (score < 7) {
        critiques.push({
          category,
          severity: 'moderate',
          issue: 'Theme wanders or loses focus across sections',
          affectedLines: [],
          suggestedFix: 'Ensure every section relates back to central theme or emotional core'
        });
      }
      break;

    case 'Sonic Density':
      if (score < 7) {
        critiques.push({
          category,
          severity: 'minor',
          issue: 'Sonic texture feels thin or unbalanced',
          affectedLines: [],
          suggestedFix: 'Add layered sounds, backing vocals, or instrumental richness'
        });
      }
      break;
  }

  return critiques;
};

/**
 * Calculate overall quality score from critiques
 */
const calculateQualityScore = (critiques: CritiqueItem[], analysis: SongAnalysis): number => {
  
  let score = 100;

  critiques.forEach(critique => {
    switch (critique.severity) {
      case 'critical':
        score -= 15;
        break;
      case 'moderate':
        score -= 8;
        break;
      case 'minor':
        score -= 3;
        break;
    }
  });

  // Bonus for high analysis scores
  const allScores = analysis.scoreBreakdown.map(s => s.score);
  const averageScore = allScores.reduce((sum, s) => sum + s, 0) / allScores.length;

  const bonusFromAnalysis = (averageScore - 7) * 2; // +2 points per point above 7/10

  return Math.max(0, Math.min(100, score + bonusFromAnalysis));
};
