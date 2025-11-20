
export enum StructureType {
  AUTO = 'Auto / Best Fit',
  POP = 'Pop Standard (V-C-V-C-B-C)',
  EDM = 'EDM Build (Intro-Build-Drop-Break-Drop)',
  STORYTELLING = 'Storytelling (Linear Verse progression)',
  EXPERIMENTAL = 'Experimental/Progressive'
}

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
  category: string;
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
  lineByLineImprovements: { original: string; improved: string; reason: string }[];
  commercialViability: string;
}

export interface SongVariation {
  id: string;
  type: string; // e.g., "More Rhythmic", "Different Structure"
  lyrics: string;
  explanation: string;
}

export interface GeneratedSong {
  id: string;
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
