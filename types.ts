
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
  | 'Sonic Density'
  | 'Commercial Potential'
  | 'Thematic Cohesion'
  | 'Vocal Playability'
  | 'Imagery & Sensory Detail'
  | 'Narrative Arc'
  | 'Hook Factor';

export const FIXED_SCORING_CATEGORIES: ScoringCategory[] = [
  'Lyrical Originality',
  'Melodic & Phonetic Flow',
  'Emotional Impact',
  'Structure & Pacing',
  'Sonic Density',
  'Commercial Potential',
  'Thematic Cohesion',
  'Vocal Playability',
  'Imagery & Sensory Detail',
  'Narrative Arc',
  'Hook Factor'
];

export interface PersonalizationContext {
  yourWorld: {
    location?: {
      city: string;
      neighborhood?: string;
      country: string;
      landmarks: string[]; // AI-extracted
      culturalNotes: string[]; // AI-suggested slang, references
    };
    relationship?: {
      personName?: string;
      relationshipType: 'romantic' | 'ex' | 'crush' | 'friend' | 'family' | 'self' | 'abstract';
      keyDetail?: string;
    };
    memory?: {
      description: string;
      extractedElements: {
        timeOfDay?: string;
        setting?: string;
        sensoryDetails?: string[];
        emotion?: string;
      };
    };
    languagePreference?: 'poetic' | 'conversational' | 'slang' | 'formal';
  };
  
  metaphorLab?: {
    chosenMetaphor: string;
    metaphorType: 'visual' | 'spatial' | 'symbolic' | 'auditory' | 'natural' | 'custom';
    intensity: 'subtle' | 'moderate' | 'central';
    customization?: string;
  };
  
  powerLines: {
    selectedLines: Array<{
      text: string;
      suggestedPlacement: string[];
      syllableCount: number;
      allowAdaptation: boolean;
    }>;
    placementStrategy: 'automatic' | 'prioritize-chorus' | 'spread-evenly' | 'climactic';
  };
  
  enabled: boolean;
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
  commercialMode: boolean; // "Less is More" - shorter verses, punchier hooks
  model: SunoModel;
  instrumental: boolean;
  genreProfile?: string; // Optional: Genre profile ID (pop, hiphop, indie, etc.) - if not set, AI doesn't follow strict genre rules
  personalization?: PersonalizationContext; // Optional personalization data
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
  agent?: 'Lyricist' | 'Storyteller' | 'Vocal Coach' | 'Producer' | 'Hitmaker'; // Which agent scored this
  highlights?: CritiqueHighlight[]; // Line-level issues for Interactive Lyrics
}

export interface CritiqueHighlight {
  lineNumber: number;
  lineText: string;
  category: ScoringCategory;
  severity: 'error' | 'warning' | 'info'; // Red, yellow, blue
  message: string; // What's wrong
  quickFixes?: QuickFix[]; // Suggested one-click improvements
  highlightType: 'full-line' | 'word-range' | 'syllable'; // Granularity
  startChar?: number; // For word-level highlights
  endChar?: number;
}

export interface QuickFix {
  id: string;
  label: string; // e.g., "Replace with 'yesterday'"
  newText: string;
  explanation: string;
  scoreImpact: string; // e.g., "+0.5 Lyrical Originality"
  confidence: 'high' | 'medium' | 'low';
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

export interface ExecutionPlan {
  targetScore: number;
  scoreImprovementsByCategory: {
    category: ScoringCategory;
    currentScore: number;
    targetScore: number;
    strategy: string;
    dnaInsightApplied?: string; // How A-tier song insight influences this category
  }[];
  lineLevelChanges: {
    lineNumber: number;
    originalLine: string;
    newLine: string;
    reason: string;
    categoryImproved: ScoringCategory;
    sourceAnalysis: 'LineByLine' | 'Phonetic' | 'DNAMatch' | 'ChatAgent' | 'Density'; // What analysis drove this change
  }[];
  phoneticFixes?: {
    issue: string;
    fix: string;
  }[];
  furnitureAdditions?: string[];
  dnaMatchInsights?: {
    structural: string[]; // Applied structural lessons from A-tier song
    wordSpacing: string[]; // Applied phrasing lessons
    metaphorical: string[]; // Applied metaphor techniques
    narrative: string[]; // Applied storytelling techniques
    sonic: string[]; // Applied phonetic patterns
  };
  userApproved?: boolean; // User must approve before execution
  chatAgentNotes?: string[]; // Key insights from user-agent discussion
}

export interface SongDNAMatch {
  referenceSong: string; // e.g., "Photograph by Ed Sheeran"
  artist: string;
  matchScore: number; // 0-100 how similar
  matchReasons: {
    vibe: string;
    structure: string;
    lyricalStyle: string;
    emotional: string;
    pacing: string;
  };
  improvements: {
    structural: string[];
    wordSpacing: string[]; // How words are sung/spaced
    metaphorical: string[];
    narrative: string[];
    sonic: string[];
  };
  whatTheyDidBetter: string; // Overall summary of why the reference is A-tier
  credibilityFactors: string[]; // What makes this song a proven hit
  referenceLyrics?: string; // Optional: Fetched lyrics for deeper analysis
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
  highlightedText?: string; // If user highlighted part of the song
  context?: 'score' | 'lyrics' | 'sonic' | 'dnaMatch' | 'general'; // What section they're discussing
}

export interface RewritePlanProposal {
  id: string;
  executionPlan: ExecutionPlan;
  rationale: string; // Why this plan addresses all concerns
  expectedImpact: string; // Predicted improvements
  basedOn: {
    originalAnalysis: boolean;
    dnaMatchInsights: boolean;
    chatDiscussion: boolean;
    userEdits: boolean;
  };
  status: 'draft' | 'proposed' | 'approved' | 'rejected';
  userFeedback?: string; // If user rejects, why?
  workflowValidation?: {
    coherenceScore: number;
    conflictsResolved: number;
    totalConflicts: number;
    warnings: string[];
  };
  agentDebates?: {
    lineNumber: number;
    originalLine: string;
    proposedLine: string;
    songwriterPosition: string;
    producerPosition: string;
    finalDecision: string;
    rationale: string;
  }[];
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
  dnaMatch?: SongDNAMatch; // Real-world hit song comparison
  // Programmatic scores for comparison with AI scores
  programmaticScores?: {
    hookFactor?: { score: number; breakdown: string };
    vocalPlayability?: { score: number; breakdown: string };
    imagerySensory?: { score: number; breakdown: string };
    narrativeArc?: { score: number; breakdown: string };
  };
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
  executionPlan?: ExecutionPlan; // Stores the rewrite execution plan
  proposedPlan?: RewritePlanProposal; // Plan awaiting user approval
  chatHistory?: ChatMessage[]; // Deep Analysis chat conversation
  variations?: SongVariation[];
  agentDebates?: AgentDebate[]; // Agent debates from automatic analysis
  // Feature Flags
  hasAdvancedLogic: boolean;
  hasMetaphorLogic: boolean;
  hasCommercialMode: boolean;
  model?: SunoModel;
  instrumental?: boolean;
  // Suno Audio Generation
  sunoTaskId?: string;
  audioUrl?: string;
  streamAudioUrl?: string;
  audioStatus?: 'PENDING' | 'TEXT_SUBMITTING' | 'TEXT_SUCCESS' | 'GENERATING' | 'SUCCESS' | 'FAILED';
  actualModel?: string; // The actual model version used by Suno API
}

export interface AgentDebate {
  lineNumber?: number; // Optional for conceptual debates (not line-specific)
  issue: string; // What the debate is about (e.g., "Tradeoff: Vocal Playability vs Emotional Impact")
  originalLine?: string; // The line being debated (if line-specific)
  proposedLine?: string; // Optional alternative suggestion
  votes: {
    agent: 'Lyricist' | 'Storyteller' | 'Vocal Coach' | 'Producer' | 'Hitmaker';
    position: 'SUPPORT' | 'OPPOSE' | 'COMPROMISE';
    reasoning: string;
  }[];
  resolution: {
    decision: 'KEEP' | 'CHANGE' | 'COMPROMISE';
    rationale: string;
    finalVersion?: string; // If changed/compromised
  };
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
