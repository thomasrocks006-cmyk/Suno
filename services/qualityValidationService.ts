/**
 * QUALITY VALIDATION STUDY SERVICE
 * Mock framework for A/B testing and expert validation
 * Simulates real-world validation study with synthetic data
 */

import { SongAnalysis, ScoreComponent } from '../types';

export interface TestSong {
  id: string;
  title: string;
  artist: string;
  originalLyrics: string;
  rewrittenLyrics: string;
  genre: string;
}

export interface ExpertRating {
  expertId: string;
  expertName: string;
  expertise: string; // "producer" | "lyricist" | "a&r" | "musicologist"
  songId: string;
  versionRated: 'original' | 'rewritten';
  ratings: {
    category: string;
    score: number; // 1-10
    notes: string;
  }[];
  overallScore: number; // 1-10
  timestamp: Date;
}

export interface ValidationMetrics {
  totalSongs: number;
  totalExperts: number;
  totalRatings: number;
  averageImprovement: number; // Percentage
  categoryPerformance: {
    category: string;
    originalAvg: number;
    rewrittenAvg: number;
    improvement: number;
  }[];
  expertConsensus: number; // 0-1 (1 = perfect agreement)
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  statisticalSignificance: {
    pValue: number;
    significant: boolean; // true if p < 0.05
  };
}

export interface ABTestResult {
  songId: string;
  songTitle: string;
  aiScore: {
    original: number;
    rewritten: number;
    predictedImprovement: number;
  };
  expertScore: {
    original: number;
    rewritten: number;
    actualImprovement: number;
  };
  predictionAccuracy: number; // Percentage
  discrepancies: string[];
}

// === MOCK TEST SONGS ===
const MOCK_TEST_SONGS: TestSong[] = [
  {
    id: 'test-001',
    title: 'Midnight Dreams',
    artist: 'Test Artist',
    genre: 'Pop',
    originalLyrics: `[Verse 1]
Walking down the street at night
Thinking about you all the time
Missing what we used to have
Love is like a game we play

[Chorus]
Midnight dreams of you and me
Dancing in the moonlight
Forever we will be
Together through the night`,
    rewrittenLyrics: `[Verse 1]
Streetlights flicker on cracked pavement
Your ghost walks beside every shadow
That empty chair where you would sit
This heart plays games it cannot win

[Chorus]
Midnight pulls me to your memory
Spinning through silver darkness
We're eternal in this moment
Suspended between the stars`
  },
  {
    id: 'test-002',
    title: 'Breaking Free',
    artist: 'Test Artist',
    genre: 'Rock',
    originalLyrics: `[Verse 1]
Chains around my heart
Holding me back from the start
Need to find my way
Living for today

[Chorus]
Breaking free, can't you see
This is who I'm meant to be
Rising up, standing tall
Never gonna fall`,
    rewrittenLyrics: `[Verse 1]
Rust-bound chains carve deeper grooves
Each link a year I couldn't move
The horizon bleeds its first light through
My fists remember what to do

[Chorus]
Shattering what held me down
Watch the pieces hit the ground
Built from scars, forged in flame
I am no one's shame`
  },
  {
    id: 'test-003',
    title: 'Ocean Eyes',
    artist: 'Test Artist',
    genre: 'Indie',
    originalLyrics: `[Verse 1]
Your eyes are like the ocean blue
Deep and wide and always true
Swimming in your gaze tonight
Everything just feels so right

[Chorus]
Ocean eyes looking at me
Pulling me in like the sea
Drowning in this feeling
Your love is so revealing`,
    rewrittenLyrics: `[Verse 1]
Your irises hold tsunami depths
Cerulean trenches where light forgets
Diving through the undertow of you
Pressure builds but I push through

[Chorus]
Your gaze is a riptide dragging me
Past the breakers, past the reef
Lungs collapse but I'm not scared
This drowning feels like answered prayer`
  }
];

// === MOCK EXPERT PROFILES ===
const MOCK_EXPERTS = [
  { id: 'exp-001', name: 'Sarah Mitchell', expertise: 'producer', bias: 0.05 },
  { id: 'exp-002', name: 'David Chen', expertise: 'lyricist', bias: -0.03 },
  { id: 'exp-003', name: 'Maria Rodriguez', expertise: 'a&r', bias: 0.08 },
  { id: 'exp-004', name: 'James Wilson', expertise: 'musicologist', bias: -0.02 },
  { id: 'exp-005', name: 'Emma Thompson', expertise: 'producer', bias: 0.06 }
];

// === MOCK RATING GENERATION ===
/**
 * Generate synthetic expert ratings for validation study
 * Simulates realistic rating patterns with small random variations
 */
export const generateMockExpertRatings = (
  song: TestSong,
  aiOriginalScore: number,
  aiRewrittenScore: number
): ExpertRating[] => {
  
  const ratings: ExpertRating[] = [];

  MOCK_EXPERTS.forEach(expert => {
    // Generate ratings for original version
    const originalRating: ExpertRating = {
      expertId: expert.id,
      expertName: expert.name,
      expertise: expert.expertise,
      songId: song.id,
      versionRated: 'original',
      ratings: generateCategoryRatings(aiOriginalScore, expert.bias),
      overallScore: 0, // Will calculate below
      timestamp: new Date()
    };
    originalRating.overallScore = calculateOverallScore(originalRating.ratings);
    ratings.push(originalRating);

    // Generate ratings for rewritten version
    const rewrittenRating: ExpertRating = {
      expertId: expert.id,
      expertName: expert.name,
      expertise: expert.expertise,
      songId: song.id,
      versionRated: 'rewritten',
      ratings: generateCategoryRatings(aiRewrittenScore, expert.bias),
      overallScore: 0,
      timestamp: new Date()
    };
    rewrittenRating.overallScore = calculateOverallScore(rewrittenRating.ratings);
    ratings.push(rewrittenRating);
  });

  return ratings;
};

const generateCategoryRatings = (baseScore: number, expertBias: number) => {
  const categories = [
    'Lyrical Originality',
    'Melodic & Phonetic Flow',
    'Emotional Impact',
    'Hook Factor',
    'Commercial Potential'
  ];

  return categories.map(category => ({
    category,
    score: Math.max(1, Math.min(10, baseScore + expertBias + (Math.random() - 0.5) * 1.5)),
    notes: `${category} assessment for this version`
  }));
};

const calculateOverallScore = (ratings: { score: number }[]): number => {
  const sum = ratings.reduce((acc, r) => acc + r.score, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
};

// === RUN VALIDATION STUDY ===
/**
 * Simulate complete validation study with A/B testing
 */
export const runValidationStudy = async (
  onProgress?: (progress: number, status: string) => void
): Promise<{
  metrics: ValidationMetrics;
  results: ABTestResult[];
  rawRatings: ExpertRating[];
}> => {
  
  onProgress?.(0, 'Initializing validation study...');

  const allRatings: ExpertRating[] = [];
  const results: ABTestResult[] = [];

  // Process each test song
  for (let i = 0; i < MOCK_TEST_SONGS.length; i++) {
    const song = MOCK_TEST_SONGS[i];
    
    onProgress?.(
      (i / MOCK_TEST_SONGS.length) * 100,
      `Collecting ratings for "${song.title}"...`
    );

    // Simulate AI scoring
    const aiOriginalScore = 6.2 + Math.random() * 0.8; // 6.2-7.0
    const aiRewrittenScore = 7.8 + Math.random() * 0.8; // 7.8-8.6

    // Generate expert ratings
    const songRatings = generateMockExpertRatings(song, aiOriginalScore, aiRewrittenScore);
    allRatings.push(...songRatings);

    // Calculate aggregates
    const originalRatings = songRatings.filter(r => r.versionRated === 'original');
    const rewrittenRatings = songRatings.filter(r => r.versionRated === 'rewritten');

    const expertOriginalAvg = originalRatings.reduce((sum, r) => sum + r.overallScore, 0) / originalRatings.length;
    const expertRewrittenAvg = rewrittenRatings.reduce((sum, r) => sum + r.overallScore, 0) / rewrittenRatings.length;

    const actualImprovement = ((expertRewrittenAvg - expertOriginalAvg) / expertOriginalAvg) * 100;
    const predictedImprovement = ((aiRewrittenScore - aiOriginalScore) / aiOriginalScore) * 100;
    const accuracy = 100 - Math.abs(actualImprovement - predictedImprovement);

    results.push({
      songId: song.id,
      songTitle: song.title,
      aiScore: {
        original: Math.round(aiOriginalScore * 10) / 10,
        rewritten: Math.round(aiRewrittenScore * 10) / 10,
        predictedImprovement: Math.round(predictedImprovement * 10) / 10
      },
      expertScore: {
        original: Math.round(expertOriginalAvg * 10) / 10,
        rewritten: Math.round(expertRewrittenAvg * 10) / 10,
        actualImprovement: Math.round(actualImprovement * 10) / 10
      },
      predictionAccuracy: Math.round(accuracy * 10) / 10,
      discrepancies: generateDiscrepancies(accuracy)
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  onProgress?.(100, 'Calculating validation metrics...');

  // Calculate comprehensive metrics
  const metrics = calculateValidationMetrics(allRatings, results);

  return { metrics, results, rawRatings: allRatings };
};

// === CALCULATE VALIDATION METRICS ===
const calculateValidationMetrics = (
  ratings: ExpertRating[],
  results: ABTestResult[]
): ValidationMetrics => {
  
  // Category performance
  const categories = ['Lyrical Originality', 'Melodic & Phonetic Flow', 'Emotional Impact', 'Hook Factor', 'Commercial Potential'];
  const categoryPerformance = categories.map(category => {
    const originalScores = ratings
      .filter(r => r.versionRated === 'original')
      .flatMap(r => r.ratings.filter(rating => rating.category === category).map(rating => rating.score));
    
    const rewrittenScores = ratings
      .filter(r => r.versionRated === 'rewritten')
      .flatMap(r => r.ratings.filter(rating => rating.category === category).map(rating => rating.score));

    const originalAvg = originalScores.reduce((sum, s) => sum + s, 0) / originalScores.length;
    const rewrittenAvg = rewrittenScores.reduce((sum, s) => sum + s, 0) / rewrittenScores.length;

    return {
      category,
      originalAvg: Math.round(originalAvg * 100) / 100,
      rewrittenAvg: Math.round(rewrittenAvg * 100) / 100,
      improvement: Math.round(((rewrittenAvg - originalAvg) / originalAvg) * 100 * 10) / 10
    };
  });

  // Average improvement
  const averageImprovement = categoryPerformance.reduce((sum, c) => sum + c.improvement, 0) / categoryPerformance.length;

  // Expert consensus (variance in ratings)
  const allOverallScores = ratings.map(r => r.overallScore);
  const mean = allOverallScores.reduce((sum, s) => sum + s, 0) / allOverallScores.length;
  const variance = allOverallScores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / allOverallScores.length;
  const stdDev = Math.sqrt(variance);
  const consensus = Math.max(0, 1 - (stdDev / 5)); // Higher consensus = lower std dev

  // Confidence interval (95%)
  const marginOfError = 1.96 * (stdDev / Math.sqrt(allOverallScores.length));

  // Statistical significance (mock p-value)
  const effectSize = averageImprovement / stdDev;
  const pValue = Math.max(0.001, Math.min(0.5, 1 / (1 + Math.abs(effectSize) * 5)));

  return {
    totalSongs: MOCK_TEST_SONGS.length,
    totalExperts: MOCK_EXPERTS.length,
    totalRatings: ratings.length,
    averageImprovement: Math.round(averageImprovement * 10) / 10,
    categoryPerformance,
    expertConsensus: Math.round(consensus * 100) / 100,
    confidenceInterval: {
      lower: Math.round((mean - marginOfError) * 100) / 100,
      upper: Math.round((mean + marginOfError) * 100) / 100
    },
    statisticalSignificance: {
      pValue: Math.round(pValue * 1000) / 1000,
      significant: pValue < 0.05
    }
  };
};

const generateDiscrepancies = (accuracy: number): string[] => {
  if (accuracy > 90) return [];
  if (accuracy > 80) return ['Minor variance in commercial appeal assessment'];
  if (accuracy > 70) return ['Divergence in emotional impact rating', 'Hook factor evaluation differs'];
  return ['Significant disagreement on originality', 'Flow assessment inconsistent', 'Commercial potential overestimated'];
};

// === EXPORT TEST DATA ===
export const getTestSongs = (): TestSong[] => MOCK_TEST_SONGS;
export const getExpertProfiles = () => MOCK_EXPERTS;
