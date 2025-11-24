import { SongAnalysis, ScoreComponent, CritiqueHighlight, QuickFix, ScoringCategory } from '../types';

// Semantic highlight colors for Interactive Lyrics
export type HighlightColor = 'critical' | 'warning' | 'creative' | 'performance' | 'strength';

export interface LineCritique {
  lineNumber: number;
  lineText: string;
  highlights: CritiqueHighlight[];
  overallSeverity: 'error' | 'warning' | 'info' | 'none';
  color: HighlightColor;
  agentOpinions: {
    agent: string;
    category: ScoringCategory;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }[];
}

export interface TooltipData {
  lineNumber: number;
  critiques: {
    agent: string;
    category: ScoringCategory;
    message: string;
    severity: 'error' | 'warning' | 'info';
    quickFixes?: QuickFix[];
  }[];
  summary: string;
}

// Map score components to line-level critiques
export function mapScoresToLineCritiques(
  lyrics: string,
  analysis: SongAnalysis
): LineCritique[] {
  const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
  const lineCritiques: LineCritique[] = [];

  // Create a map of line numbers to highlights
  const highlightsByLine = new Map<number, CritiqueHighlight[]>();
  
  analysis.scoreBreakdown.forEach(scoreComponent => {
    if (scoreComponent.highlights) {
      scoreComponent.highlights.forEach(highlight => {
        const existing = highlightsByLine.get(highlight.lineNumber) || [];
        existing.push(highlight);
        highlightsByLine.set(highlight.lineNumber, existing);
      });
    }
  });

  // Build line critiques
  lines.forEach((lineText, index) => {
    const lineNumber = index + 1;
    const highlights = highlightsByLine.get(lineNumber) || [];
    
    // Determine overall severity
    let overallSeverity: 'error' | 'warning' | 'info' | 'none' = 'none';
    if (highlights.some(h => h.severity === 'error')) {
      overallSeverity = 'error';
    } else if (highlights.some(h => h.severity === 'warning')) {
      overallSeverity = 'warning';
    } else if (highlights.length > 0) {
      overallSeverity = 'info';
    }

    // Determine semantic color
    const color = calculateHighlightColor(highlights, overallSeverity);

    // Extract agent opinions
    const agentOpinions = highlights.map(h => ({
      agent: getAgentForCategory(h.category),
      category: h.category,
      message: h.message,
      severity: h.severity
    }));

    lineCritiques.push({
      lineNumber,
      lineText,
      highlights,
      overallSeverity,
      color,
      agentOpinions
    });
  });

  return lineCritiques;
}

// Calculate semantic highlight color
function calculateHighlightColor(
  highlights: CritiqueHighlight[],
  severity: 'error' | 'warning' | 'info' | 'none'
): HighlightColor {
  if (severity === 'none') {
    // Check if this is a strength (high-scoring line)
    return 'strength';
  }

  if (severity === 'error') {
    return 'critical';
  }

  if (severity === 'warning') {
    return 'warning';
  }

  // Check categories for semantic meaning
  const categories = highlights.map(h => h.category);
  
  if (categories.some(c => c === 'Lyrical Originality' || c === 'Imagery & Sensory Detail')) {
    return 'creative';
  }

  if (categories.some(c => c === 'Vocal Playability' || c === 'Melodic & Phonetic Flow')) {
    return 'performance';
  }

  return 'warning';
}

// Get agent name for a category
function getAgentForCategory(category: ScoringCategory): string {
  const agentMap: Record<ScoringCategory, string> = {
    'Lyrical Originality': 'Lyricist',
    'Melodic & Phonetic Flow': 'Vocal Coach',
    'Emotional Impact': 'Storyteller',
    'Structure & Pacing': 'Producer',
    'Sonic Density': 'Producer',
    'Commercial Potential': 'Hitmaker',
    'Thematic Cohesion': 'Storyteller',
    'Vocal Playability': 'Vocal Coach',
    'Imagery & Sensory Detail': 'Storyteller',
    'Narrative Arc': 'Storyteller',
    'Hook Factor': 'Hitmaker'
  };
  
  return agentMap[category] || 'Unknown';
}

// Generate tooltip data for a line
export function generateTooltip(lineCritique: LineCritique): TooltipData {
  const critiques = lineCritique.highlights.map(h => ({
    agent: getAgentForCategory(h.category),
    category: h.category,
    message: h.message,
    severity: h.severity,
    quickFixes: h.quickFixes
  }));

  // Generate summary
  let summary = '';
  if (lineCritique.overallSeverity === 'error') {
    summary = `❌ Critical issues: ${critiques.length} problem${critiques.length > 1 ? 's' : ''} found`;
  } else if (lineCritique.overallSeverity === 'warning') {
    summary = `⚠️ Improvement needed: ${critiques.length} suggestion${critiques.length > 1 ? 's' : ''}`;
  } else if (lineCritique.overallSeverity === 'info') {
    summary = `💡 Creative opportunity: ${critiques.length} idea${critiques.length > 1 ? 's' : ''}`;
  } else {
    summary = '✨ Strong line - no issues detected';
  }

  return {
    lineNumber: lineCritique.lineNumber,
    critiques,
    summary
  };
}

// Calculate highlight statistics
export interface HighlightStats {
  totalLines: number;
  criticalLines: number;
  warningLines: number;
  infoLines: number;
  strengthLines: number;
  coveragePercentage: number;
  topIssues: {
    category: ScoringCategory;
    count: number;
    severity: 'error' | 'warning' | 'info';
  }[];
}

export function calculateHighlightStats(lineCritiques: LineCritique[]): HighlightStats {
  const totalLines = lineCritiques.length;
  const criticalLines = lineCritiques.filter(lc => lc.color === 'critical').length;
  const warningLines = lineCritiques.filter(lc => lc.color === 'warning').length;
  const infoLines = lineCritiques.filter(lc => lc.color === 'creative' || lc.color === 'performance').length;
  const strengthLines = lineCritiques.filter(lc => lc.color === 'strength').length;
  
  const linesWithFeedback = totalLines - strengthLines;
  const coveragePercentage = totalLines > 0 ? Math.round((linesWithFeedback / totalLines) * 100) : 0;

  // Count issues by category
  const categoryCount = new Map<ScoringCategory, { count: number; maxSeverity: 'error' | 'warning' | 'info' }>();
  
  lineCritiques.forEach(lc => {
    lc.highlights.forEach(h => {
      const existing = categoryCount.get(h.category);
      if (existing) {
        existing.count++;
        if (h.severity === 'error' || (h.severity === 'warning' && existing.maxSeverity === 'info')) {
          existing.maxSeverity = h.severity;
        }
      } else {
        categoryCount.set(h.category, { count: 1, maxSeverity: h.severity });
      }
    });
  });

  const topIssues = Array.from(categoryCount.entries())
    .map(([category, data]) => ({
      category,
      count: data.count,
      severity: data.maxSeverity
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalLines,
    criticalLines,
    warningLines,
    infoLines,
    strengthLines,
    coveragePercentage,
    topIssues
  };
}

// Find lines that need attention
export function findPriorityLines(
  lineCritiques: LineCritique[],
  limit: number = 5
): LineCritique[] {
  return lineCritiques
    .filter(lc => lc.overallSeverity !== 'none')
    .sort((a, b) => {
      // Sort by severity first (error > warning > info)
      const severityOrder = { error: 3, warning: 2, info: 1, none: 0 };
      const severityDiff = severityOrder[b.overallSeverity] - severityOrder[a.overallSeverity];
      if (severityDiff !== 0) return severityDiff;
      
      // Then by number of highlights
      return b.highlights.length - a.highlights.length;
    })
    .slice(0, limit);
}

// Group critiques by agent
export interface AgentCritiqueGroup {
  agent: string;
  totalCritiques: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  affectedLines: number[];
  topCategories: {
    category: ScoringCategory;
    count: number;
  }[];
}

export function groupCritiquesByAgent(lineCritiques: LineCritique[]): AgentCritiqueGroup[] {
  const agentGroups = new Map<string, {
    critiques: typeof lineCritiques[0]['agentOpinions'];
    lines: Set<number>;
    categoryCount: Map<ScoringCategory, number>;
  }>();

  lineCritiques.forEach(lc => {
    lc.agentOpinions.forEach(opinion => {
      let group = agentGroups.get(opinion.agent);
      if (!group) {
        group = {
          critiques: [],
          lines: new Set(),
          categoryCount: new Map()
        };
        agentGroups.set(opinion.agent, group);
      }
      
      group.critiques.push(opinion);
      group.lines.add(lc.lineNumber);
      
      const categoryCountValue = group.categoryCount.get(opinion.category) || 0;
      group.categoryCount.set(opinion.category, categoryCountValue + 1);
    });
  });

  return Array.from(agentGroups.entries()).map(([agent, data]) => {
    const criticalCount = data.critiques.filter(c => c.severity === 'error').length;
    const warningCount = data.critiques.filter(c => c.severity === 'warning').length;
    const infoCount = data.critiques.filter(c => c.severity === 'info').length;
    
    const topCategories = Array.from(data.categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      agent,
      totalCritiques: data.critiques.length,
      criticalCount,
      warningCount,
      infoCount,
      affectedLines: Array.from(data.lines).sort((a, b) => a - b),
      topCategories
    };
  }).sort((a, b) => b.totalCritiques - a.totalCritiques);
}
