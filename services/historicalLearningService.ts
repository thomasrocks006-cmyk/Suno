/**
 * HISTORICAL LEARNING SERVICE
 * Frontend-ready learning system with localStorage mock backend
 * Tracks user feedback patterns and learns preferences over time
 */

export interface UserFeedback {
  id: string;
  timestamp: Date;
  songId: string;
  action: 'accept' | 'reject' | 'modify';
  changeType: 'line' | 'suggestion' | 'plan';
  originalText: string;
  suggestedText: string;
  finalText?: string; // If user modified the suggestion
  category: string;
  context: {
    genre?: string;
    section?: string;
    lineNumber?: number;
    scoreBreakdown?: any;
  };
}

export interface LearningPattern {
  patternId: string;
  patternType: 'preference' | 'avoidance' | 'style';
  category: string;
  description: string;
  examples: string[];
  confidence: number; // 0-1
  occurrences: number;
  lastSeen: Date;
}

export interface UserPreferenceProfile {
  userId: string;
  totalInteractions: number;
  patterns: LearningPattern[];
  genrePreferences: {
    genre: string;
    acceptanceRate: number;
  }[];
  categoryPreferences: {
    category: string;
    acceptanceRate: number;
    avgModificationRate: number;
  }[];
  vocabularyPreferences: {
    preferredWords: string[];
    avoidedWords: string[];
  };
  styleSignature: {
    formality: number; // 0-1 (casual to formal)
    complexity: number; // 0-1 (simple to complex)
    imagery: number; // 0-1 (literal to metaphorical)
    emotion: number; // 0-1 (subdued to intense)
  };
  lastUpdated: Date;
}

// === LOCAL STORAGE KEYS ===
const FEEDBACK_KEY = 'suno_user_feedback';
const PROFILE_KEY = 'suno_user_profile';

// === FEEDBACK TRACKING ===
/**
 * Record user interaction with a suggestion
 */
export const recordFeedback = (feedback: Omit<UserFeedback, 'id' | 'timestamp'>): void => {
  const fullFeedback: UserFeedback = {
    ...feedback,
    id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date()
  };

  // Get existing feedback
  const existing = getFeedbackHistory();
  existing.push(fullFeedback);

  // Store (keep last 500 entries)
  const trimmed = existing.slice(-500);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(trimmed));

  // Update learning profile
  updateLearningProfile(trimmed);
};

/**
 * Get all recorded feedback
 */
export const getFeedbackHistory = (): UserFeedback[] => {
  const stored = localStorage.getItem(FEEDBACK_KEY);
  if (!stored) return [];

  return JSON.parse(stored, (key, value) => {
    if (key === 'timestamp' || key === 'lastSeen') return new Date(value);
    return value;
  });
};

/**
 * Clear all feedback data (for testing/reset)
 */
export const clearFeedbackHistory = (): void => {
  localStorage.removeItem(FEEDBACK_KEY);
  localStorage.removeItem(PROFILE_KEY);
};

// === LEARNING PROFILE ===
/**
 * Get current user preference profile
 */
export const getUserProfile = (): UserPreferenceProfile | null => {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (!stored) return null;

  return JSON.parse(stored, (key, value) => {
    if (key === 'lastUpdated' || key === 'lastSeen') return new Date(value);
    return value;
  });
};

/**
 * Update learning profile based on feedback history
 */
const updateLearningProfile = (feedbackHistory: UserFeedback[]): void => {
  if (feedbackHistory.length === 0) return;

  const profile: UserPreferenceProfile = {
    userId: 'local_user',
    totalInteractions: feedbackHistory.length,
    patterns: extractPatterns(feedbackHistory),
    genrePreferences: calculateGenrePreferences(feedbackHistory),
    categoryPreferences: calculateCategoryPreferences(feedbackHistory),
    vocabularyPreferences: extractVocabularyPreferences(feedbackHistory),
    styleSignature: calculateStyleSignature(feedbackHistory),
    lastUpdated: new Date()
  };

  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

// === PATTERN EXTRACTION ===
/**
 * Extract learning patterns from feedback history
 */
const extractPatterns = (feedback: UserFeedback[]): LearningPattern[] => {
  const patterns: LearningPattern[] = [];

  // Pattern 1: Consistent word replacements
  const wordReplacements = new Map<string, { count: number; examples: string[] }>();
  
  feedback.filter(f => f.action === 'modify' && f.finalText).forEach(f => {
    const original = f.suggestedText.toLowerCase();
    const final = f.finalText!.toLowerCase();
    
    // Extract word-level changes
    const originalWords = original.split(/\s+/);
    const finalWords = final.split(/\s+/);
    
    originalWords.forEach((word, i) => {
      if (finalWords[i] && word !== finalWords[i]) {
        const key = `${word}→${finalWords[i]}`;
        const existing = wordReplacements.get(key) || { count: 0, examples: [] };
        existing.count++;
        existing.examples.push(f.suggestedText);
        wordReplacements.set(key, existing);
      }
    });
  });

  // Convert to patterns (threshold: 3+ occurrences)
  wordReplacements.forEach((data, replacement) => {
    if (data.count >= 3) {
      const [from, to] = replacement.split('→');
      patterns.push({
        patternId: `word_${replacement}`,
        patternType: 'preference',
        category: 'vocabulary',
        description: `Prefers "${to}" over "${from}"`,
        examples: data.examples.slice(0, 3),
        confidence: Math.min(0.95, data.count / 10),
        occurrences: data.count,
        lastSeen: new Date()
      });
    }
  });

  // Pattern 2: Consistent rejections by category
  const rejectionsByCategory = new Map<string, number>();
  feedback.filter(f => f.action === 'reject').forEach(f => {
    const count = rejectionsByCategory.get(f.category) || 0;
    rejectionsByCategory.set(f.category, count + 1);
  });

  rejectionsByCategory.forEach((count, category) => {
    if (count >= 5) {
      patterns.push({
        patternId: `reject_${category}`,
        patternType: 'avoidance',
        category,
        description: `Frequently rejects ${category} suggestions`,
        examples: feedback
          .filter(f => f.action === 'reject' && f.category === category)
          .slice(0, 3)
          .map(f => f.suggestedText),
        confidence: Math.min(0.9, count / 20),
        occurrences: count,
        lastSeen: new Date()
      });
    }
  });

  // Pattern 3: Style preferences (formality, complexity)
  const acceptedTexts = feedback
    .filter(f => f.action === 'accept')
    .map(f => f.suggestedText);

  if (acceptedTexts.length >= 10) {
    const avgWordLength = acceptedTexts.reduce((sum, text) => {
      const words = text.split(/\s+/);
      const avgLen = words.reduce((s, w) => s + w.length, 0) / words.length;
      return sum + avgLen;
    }, 0) / acceptedTexts.length;

    if (avgWordLength > 6) {
      patterns.push({
        patternId: 'style_complex',
        patternType: 'style',
        category: 'writing_style',
        description: 'Prefers complex vocabulary and longer words',
        examples: acceptedTexts.slice(0, 3),
        confidence: 0.75,
        occurrences: acceptedTexts.length,
        lastSeen: new Date()
      });
    } else if (avgWordLength < 4.5) {
      patterns.push({
        patternId: 'style_simple',
        patternType: 'style',
        category: 'writing_style',
        description: 'Prefers simple, concise vocabulary',
        examples: acceptedTexts.slice(0, 3),
        confidence: 0.75,
        occurrences: acceptedTexts.length,
        lastSeen: new Date()
      });
    }
  }

  return patterns;
};

// === PREFERENCE CALCULATIONS ===
const calculateGenrePreferences = (feedback: UserFeedback[]) => {
  const genreStats = new Map<string, { total: number; accepted: number }>();

  feedback.forEach(f => {
    const genre = f.context.genre || 'unknown';
    const stats = genreStats.get(genre) || { total: 0, accepted: 0 };
    stats.total++;
    if (f.action === 'accept') stats.accepted++;
    genreStats.set(genre, stats);
  });

  return Array.from(genreStats.entries())
    .map(([genre, stats]) => ({
      genre,
      acceptanceRate: stats.accepted / stats.total
    }))
    .sort((a, b) => b.acceptanceRate - a.acceptanceRate);
};

const calculateCategoryPreferences = (feedback: UserFeedback[]) => {
  const categoryStats = new Map<string, { total: number; accepted: number; modified: number }>();

  feedback.forEach(f => {
    const stats = categoryStats.get(f.category) || { total: 0, accepted: 0, modified: 0 };
    stats.total++;
    if (f.action === 'accept') stats.accepted++;
    if (f.action === 'modify') stats.modified++;
    categoryStats.set(f.category, stats);
  });

  return Array.from(categoryStats.entries())
    .map(([category, stats]) => ({
      category,
      acceptanceRate: stats.accepted / stats.total,
      avgModificationRate: stats.modified / stats.total
    }))
    .sort((a, b) => b.acceptanceRate - a.acceptanceRate);
};

const extractVocabularyPreferences = (feedback: UserFeedback[]) => {
  const acceptedWords = new Set<string>();
  const rejectedWords = new Set<string>();

  feedback.forEach(f => {
    const words = f.suggestedText.toLowerCase().split(/\s+/);
    
    if (f.action === 'accept') {
      words.forEach(w => acceptedWords.add(w));
    } else if (f.action === 'reject') {
      words.forEach(w => rejectedWords.add(w));
    }
  });

  // Remove common words
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  
  return {
    preferredWords: Array.from(acceptedWords)
      .filter(w => !commonWords.has(w) && w.length > 3)
      .slice(0, 50),
    avoidedWords: Array.from(rejectedWords)
      .filter(w => !commonWords.has(w) && w.length > 3)
      .slice(0, 50)
  };
};

const calculateStyleSignature = (feedback: UserFeedback[]): UserPreferenceProfile['styleSignature'] => {
  const acceptedTexts = feedback
    .filter(f => f.action === 'accept')
    .map(f => f.suggestedText);

  if (acceptedTexts.length === 0) {
    return { formality: 0.5, complexity: 0.5, imagery: 0.5, emotion: 0.5 };
  }

  // Formality: Check for contractions, slang
  const formalityScore = acceptedTexts.reduce((sum, text) => {
    const hasContractions = /n't|'ll|'ve|'re|'m|'d/i.test(text);
    return sum + (hasContractions ? 0 : 1);
  }, 0) / acceptedTexts.length;

  // Complexity: Average word length
  const avgWordLength = acceptedTexts.reduce((sum, text) => {
    const words = text.split(/\s+/);
    const avgLen = words.reduce((s, w) => s + w.length, 0) / words.length;
    return sum + avgLen;
  }, 0) / acceptedTexts.length;
  const complexityScore = Math.min(1, (avgWordLength - 3) / 5); // 3-8 char range

  // Imagery: Check for sensory words, metaphors
  const imageryWords = ['see', 'hear', 'feel', 'taste', 'smell', 'touch', 'look', 'sound', 'color', 'bright', 'dark', 'soft', 'hard', 'sweet', 'bitter'];
  const imageryScore = acceptedTexts.reduce((sum, text) => {
    const lower = text.toLowerCase();
    const count = imageryWords.filter(word => lower.includes(word)).length;
    return sum + Math.min(1, count / 3);
  }, 0) / acceptedTexts.length;

  // Emotion: Check for emotional words
  const emotionWords = ['love', 'hate', 'fear', 'joy', 'anger', 'sad', 'happy', 'pain', 'hurt', 'cry', 'laugh', 'dream', 'hope', 'despair'];
  const emotionScore = acceptedTexts.reduce((sum, text) => {
    const lower = text.toLowerCase();
    const count = emotionWords.filter(word => lower.includes(word)).length;
    return sum + Math.min(1, count / 2);
  }, 0) / acceptedTexts.length;

  return {
    formality: Math.round(formalityScore * 100) / 100,
    complexity: Math.round(complexityScore * 100) / 100,
    imagery: Math.round(imageryScore * 100) / 100,
    emotion: Math.round(emotionScore * 100) / 100
  };
};

// === SUGGESTION ADAPTATION ===
/**
 * Adapt suggestions based on learned user preferences
 * This would be called before showing suggestions to the user
 */
export const adaptSuggestionToPreferences = (
  originalSuggestion: string,
  category: string,
  profile: UserPreferenceProfile | null
): {
  adaptedSuggestion: string;
  adaptations: string[];
  confidence: number;
} => {
  if (!profile) {
    return {
      adaptedSuggestion: originalSuggestion,
      adaptations: [],
      confidence: 0
    };
  }

  let adapted = originalSuggestion;
  const adaptations: string[] = [];

  // Apply vocabulary preferences
  profile.vocabularyPreferences.avoidedWords.forEach(avoided => {
    const regex = new RegExp(`\\b${avoided}\\b`, 'gi');
    if (regex.test(adapted)) {
      // Find preferred alternative from patterns
      const alternative = profile.patterns
        .find(p => p.patternType === 'preference' && p.description.toLowerCase().includes(avoided));
      
      if (alternative) {
        const preferred = alternative.description.match(/"([^"]+)"/)?.[1];
        if (preferred) {
          adapted = adapted.replace(regex, preferred);
          adaptations.push(`Replaced "${avoided}" with "${preferred}" based on past preferences`);
        }
      }
    }
  });

  // Apply style signature adjustments
  const words = adapted.split(/\s+/);
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;

  if (profile.styleSignature.complexity > 0.7 && avgWordLength < 5) {
    adaptations.push('User prefers complex vocabulary - suggestion may be simplified');
  } else if (profile.styleSignature.complexity < 0.3 && avgWordLength > 6) {
    adaptations.push('User prefers simple vocabulary - suggestion may be too complex');
  }

  // Calculate confidence based on pattern matches
  const relevantPatterns = profile.patterns.filter(p => 
    p.category === category || p.category === 'vocabulary'
  );
  const confidence = relevantPatterns.length > 0
    ? relevantPatterns.reduce((sum, p) => sum + p.confidence, 0) / relevantPatterns.length
    : 0;

  return {
    adaptedSuggestion: adapted,
    adaptations,
    confidence: Math.round(confidence * 100) / 100
  };
};

// === ANALYTICS ===
/**
 * Get learning system analytics
 */
export const getLearningAnalytics = (): {
  totalFeedback: number;
  acceptanceRate: number;
  modificationRate: number;
  topPatterns: LearningPattern[];
  improvementTrend: number;
} => {
  const feedback = getFeedbackHistory();
  const profile = getUserProfile();

  if (feedback.length === 0) {
    return {
      totalFeedback: 0,
      acceptanceRate: 0,
      modificationRate: 0,
      topPatterns: [],
      improvementTrend: 0
    };
  }

  const acceptanceRate = feedback.filter(f => f.action === 'accept').length / feedback.length;
  const modificationRate = feedback.filter(f => f.action === 'modify').length / feedback.length;

  // Calculate improvement trend (compare first 25% vs last 25%)
  const quarterSize = Math.floor(feedback.length / 4);
  const earlyAcceptance = feedback.slice(0, quarterSize).filter(f => f.action === 'accept').length / quarterSize;
  const recentAcceptance = feedback.slice(-quarterSize).filter(f => f.action === 'accept').length / quarterSize;
  const improvementTrend = ((recentAcceptance - earlyAcceptance) / earlyAcceptance) * 100;

  return {
    totalFeedback: feedback.length,
    acceptanceRate: Math.round(acceptanceRate * 100),
    modificationRate: Math.round(modificationRate * 100),
    topPatterns: profile?.patterns.slice(0, 5) || [],
    improvementTrend: Math.round(improvementTrend)
  };
};
