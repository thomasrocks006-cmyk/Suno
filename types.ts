
export enum StructureType {
  AUTO = 'Auto / Best Fit',
  POP = 'Pop Standard (V-C-V-C-B-C)',
  EDM = 'EDM Build (Intro-Build-Drop-Break-Drop)',
  STORYTELLING = 'Storytelling (Linear Verse progression)',
  EXPERIMENTAL = 'Experimental/Progressive'
}

export type SunoModel = 'V3_5' | 'V4' | 'V4_5' | 'V4_5PLUS' | 'V5';

export type ScoringCategory = 
  | 'Lyrical Originality'
  | 'Melodic & Phonetic Flow'
  | 'Emotional Impact'
  | 'Structure & Pacing'
  | 'Commercial Potential'
  | 'Thematic Cohesion';

export const FIXED_SCORING_CATEGORIES: ScoringCategory[] = [
  'Lyrical Originality',
  'Melodic & Phonetic Flow',
  'Emotional Impact',
  'Structure & Pacing',
  'Commercial Potential',
  'Thematic Cohesion'
];

export interface SongInputs {
  artistReference: string;
  songReference: string;
  topic: string;
  mood: string;
  genre: string;
  vocals: string;
  instruments: string[];
  structure: StructureType;
  customInstructions: string;
  syllablePattern: string;
  advancedLyricLogic: boolean;
  centralMetaphorLogic: boolean;
  model: SunoModel;
  instrumental: boolean;
}

export interface InferredAttributes {
  topic?: string;
  mood?: string;
  genre?: string;
  vocals?: string;
  syllablePattern?: string;
  instruments?: string[];
}

export interface ScoreComponent {
  category: ScoringCategory;
  score: number;
  reason: string;
}

export interface SonicAnalysis {
  phonetics: string;
  density: string;
  cinemaAudit: {
    score: string; // e.g., "A", "C", "F"
    objectCount: number;
    objects: string[];
    analysis: string;
  };
}

export interface ComparisonReview {
  summary: string;
  improvements: string[];
  missedOpportunities: string[];
  verdict: 'Significant Upgrade' | 'Marginal Improvement' | 'Regression' | 'Different Direction';
  scoreDelta: number;
}

export interface RewriteAdvice {
  shouldUseAdvancedLogic: boolean;
  shouldUseMetaphorLogic: boolean;
  reasoning: string;
}

export interface SongAnalysis {
  overallScore: number;
  projectedScore: number; // Score if improvements are applied
  summary: string;
  scoreBreakdown: ScoreComponent[];
  themeAnalysis: string;
  storyArc: string;
  sonicAnalysis: SonicAnalysis;
  strengths: string[];
  weaknesses: string[];
  lineByLineImprovements: { original: string; improved: string; reason: string; source?: 'AI' | 'User' }[];
  commercialViability: string;
  // New for V2+
  comparisonReview?: ComparisonReview;
  rewriteAdvice?: RewriteAdvice;
}

export interface SongVariation {
  id: string;
  type: string; // e.g., "More Rhythmic", "Different Structure"
  lyrics: string;
  explanation: string;
}

export interface GeneratedSong {
  id: string;
  parentId?: string; // Links to the song this was rewritten from
  createdAt: number;
  title: string;
  stylePrompt: string;
  negativePrompt: string;
  lyrics: string;
  technicalExplanation: string;
  coverArtPrompt: string;
  coverImageBase64?: string;
  analysis?: SongAnalysis;
  variations?: SongVariation[];
  // Feature Flags
  hasAdvancedLogic: boolean;
  hasMetaphorLogic: boolean;
  model?: SunoModel;
  instrumental?: boolean;
  // Suno Audio Generation
  sunoTaskId?: string;
  audioUrl?: string;
  streamAudioUrl?: string;
  audioStatus?: 'PENDING' | 'TEXT_SUBMITTING' | 'TEXT_SUCCESS' | 'GENERATING' | 'SUCCESS' | 'FAILED';
  actualModel?: string; // The actual model version used by Suno API
}

export interface SunoTip {
  title: string;
  content: string;
  category: 'structure' | 'style' | 'meta';
}

export interface FeedbackItem {
  status: 'optimal' | 'warning' | 'conflict';
  message: string;
  suggestion: string;
  reasoning: string;
}

export interface AnalysisResponse {
  generalAdvice: string;
  fieldFeedback: {
    topic?: FeedbackItem;
    mood?: FeedbackItem;
    genre?: FeedbackItem;
    vocals?: FeedbackItem;
    structure?: FeedbackItem;
    customInstructions?: FeedbackItem;
    syllablePattern?: FeedbackItem;
  };
}

export interface EvaluationResult {
  verdict: 'Better' | 'Worse' | 'Neutral';
  explanation: string;
  scoreChange: number; // Estimated score change
}
