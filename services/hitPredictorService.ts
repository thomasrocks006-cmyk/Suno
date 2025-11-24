import { GoogleGenAI } from '@google/genai';
import { SongAnalysis } from '../types';

export interface PersonaScore {
  persona: string;
  role: string;
  score: number; // 0-100 hit potential
  reasoning: string;
  keyFactors: {
    positive: string[];
    negative: string[];
  };
  confidence: number; // 0-10
}

export interface HitPrediction {
  hitProbability: number; // 0-100 aggregated score
  confidence: string; // 'High', 'Medium', 'Low'
  personaScores: PersonaScore[];
  consensus: {
    strengths: string[];
    weaknesses: string[];
    marketFit: string;
    targetAudience: string;
  };
  breakdown: {
    radioAppeal: number;
    streamingPotential: number;
    viralPotential: number;
    playlistability: number;
    longTermViability: number;
  };
  recommendations: string[];
  estimatedCost: number;
}

const PERSONAS = [
  {
    name: 'Radio PD',
    role: 'Radio Program Director',
    expertise: 'Broadcast radio programming, Top 40 hits, mass appeal',
    focus: 'Radio-friendly format, hook strength, broad demographic appeal, rotation potential'
  },
  {
    name: 'TikTok Influencer',
    role: 'Social Media Music Curator',
    expertise: 'Viral trends, Gen Z appeal, short-form content, meme potential',
    focus: 'Hook catchiness, 15-30 second clips, dance/trend potential, relatability'
  },
  {
    name: 'Playlist Curator',
    role: 'Spotify/Apple Music Editorial Curator',
    expertise: 'Streaming trends, playlist cohesion, algorithm optimization',
    focus: 'Mood consistency, genre authenticity, skip rate prediction, playlist fit'
  },
  {
    name: 'Label A&R',
    role: 'Major Label A&R Executive',
    expertise: 'Commercial viability, artist development, market positioning',
    focus: 'Hit potential, scalability, tour/merchandise potential, longevity'
  },
  {
    name: 'Music Journalist',
    role: 'Industry Critic & Tastemaker',
    expertise: 'Artistic merit, cultural impact, innovation, authenticity',
    focus: 'Originality, lyrical depth, production quality, cultural relevance'
  }
];

const COST_PER_PERSONA = 0.01; // $0.01 per persona
const TOTAL_COST = PERSONAS.length * COST_PER_PERSONA; // $0.05 total

/**
 * Get hit prediction from a single persona
 */
async function getPersonaPrediction(
  persona: typeof PERSONAS[0],
  songData: {
    title: string;
    genre: string;
    lyrics: string;
    analysis: SongAnalysis;
  },
  apiKey: string
): Promise<PersonaScore> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are ${persona.name}, a ${persona.role} with expertise in ${persona.expertise}.

Your focus when evaluating songs: ${persona.focus}

Evaluate this song for HIT POTENTIAL (0-100):

SONG DETAILS:
- Title: ${songData.title}
- Genre: ${songData.genre}
- Overall Quality Score: ${songData.analysis.overallScore}/10

LYRICS:
${songData.lyrics}

KEY ANALYSIS INSIGHTS:
- Strengths: ${songData.analysis.strengths.join(', ')}
- Weaknesses: ${songData.analysis.weaknesses.join(', ')}
- Hook Factor: ${songData.analysis.scoreBreakdown.find(s => s.category === 'Hook Factor')?.score || 'N/A'}/10
- Commercial Viability: ${songData.analysis.scoreBreakdown.find(s => s.category === 'Commercial Potential')?.score || 'N/A'}/10
- Emotional Impact: ${songData.analysis.scoreBreakdown.find(s => s.category === 'Emotional Impact')?.score || 'N/A'}/10

From YOUR perspective as ${persona.role}, what is the HIT POTENTIAL of this song?

Consider:
- Your specific focus areas: ${persona.focus}
- Current market trends in your domain
- Historical patterns of hits in this space
- Your audience's preferences and behaviors

Provide your assessment in JSON format:
{
  "score": <0-100>,
  "reasoning": "<2-3 sentences explaining your score from YOUR perspective>",
  "keyFactors": {
    "positive": ["<factor1>", "<factor2>", "<factor3>"],
    "negative": ["<factor1>", "<factor2>"]
  },
  "confidence": <0-10>
}

Be honest and specific. Your score should reflect real-world hit potential in YOUR domain.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const result = JSON.parse(response.text || '{}');

    return {
      persona: persona.name,
      role: persona.role,
      ...result
    };
  } catch (error) {
    console.error(`Prediction failed for ${persona.name}:`, error);
    throw error;
  }
}

/**
 * Get hit predictions from all 5 personas
 */
export async function predictHitPotential(
  songData: {
    title: string;
    genre: string;
    lyrics: string;
    analysis: SongAnalysis;
  },
  apiKey: string,
  onProgress?: (progress: number) => void
): Promise<HitPrediction> {
  const personaScores: PersonaScore[] = [];

  // Query all 5 personas
  for (let i = 0; i < PERSONAS.length; i++) {
    const persona = PERSONAS[i];
    
    if (onProgress) {
      onProgress(((i + 1) / PERSONAS.length) * 100);
    }

    try {
      const score = await getPersonaPrediction(persona, songData, apiKey);
      personaScores.push(score);
    } catch (error) {
      console.error(`Failed to get prediction from ${persona.name}:`, error);
      // Add fallback score
      personaScores.push({
        persona: persona.name,
        role: persona.role,
        score: 50,
        reasoning: 'Unable to complete assessment',
        keyFactors: { positive: [], negative: ['Assessment failed'] },
        confidence: 0
      });
    }
  }

  // Calculate aggregated hit probability
  const avgScore = personaScores.reduce((sum, p) => sum + p.score, 0) / personaScores.length;
  const weightedScore = calculateWeightedScore(personaScores);
  const hitProbability = Math.round((avgScore + weightedScore) / 2);

  // Determine confidence
  const scoreVariance = calculateVariance(personaScores.map(p => p.score));
  const avgConfidence = personaScores.reduce((sum, p) => sum + p.confidence, 0) / personaScores.length;
  const confidence = scoreVariance < 15 && avgConfidence >= 7 ? 'High' :
                     scoreVariance < 25 && avgConfidence >= 5 ? 'Medium' : 'Low';

  // Extract consensus
  const allPositives = personaScores.flatMap(p => p.keyFactors.positive);
  const allNegatives = personaScores.flatMap(p => p.keyFactors.negative);
  
  const positiveFreq = countFrequency(allPositives);
  const negativeFreq = countFrequency(allNegatives);
  
  const strengths = Object.entries(positiveFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([factor]) => factor);
  
  const weaknesses = Object.entries(negativeFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([factor]) => factor);

  // Calculate breakdown scores
  const breakdown = {
    radioAppeal: personaScores.find(p => p.persona === 'Radio PD')?.score || 0,
    streamingPotential: personaScores.find(p => p.persona === 'Playlist Curator')?.score || 0,
    viralPotential: personaScores.find(p => p.persona === 'TikTok Influencer')?.score || 0,
    playlistability: personaScores.find(p => p.persona === 'Playlist Curator')?.score || 0,
    longTermViability: personaScores.find(p => p.persona === 'Label A&R')?.score || 0
  };

  // Generate recommendations
  const recommendations = generateRecommendations(personaScores, hitProbability);

  // Determine market fit and target audience
  const marketFit = hitProbability >= 70 ? 'Strong commercial appeal' :
                    hitProbability >= 50 ? 'Moderate commercial potential' :
                    'Niche/artistic appeal';
  
  const targetAudience = determineTargetAudience(personaScores, songData.genre);

  return {
    hitProbability,
    confidence,
    personaScores,
    consensus: {
      strengths,
      weaknesses,
      marketFit,
      targetAudience
    },
    breakdown,
    recommendations,
    estimatedCost: TOTAL_COST
  };
}

/**
 * Calculate weighted score (higher confidence = more weight)
 */
function calculateWeightedScore(scores: PersonaScore[]): number {
  const totalConfidence = scores.reduce((sum, s) => sum + s.confidence, 0);
  if (totalConfidence === 0) return 0;
  
  const weightedSum = scores.reduce((sum, s) => sum + (s.score * s.confidence), 0);
  return weightedSum / totalConfidence;
}

/**
 * Calculate variance in scores
 */
function calculateVariance(scores: number[]): number {
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const squaredDiffs = scores.map(s => Math.pow(s - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((sum, d) => sum + d, 0) / scores.length);
}

/**
 * Count frequency of factors
 */
function countFrequency(items: string[]): Record<string, number> {
  return items.reduce((freq, item) => {
    freq[item] = (freq[item] || 0) + 1;
    return freq;
  }, {} as Record<string, number>);
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(scores: PersonaScore[], hitProbability: number): string[] {
  const recommendations: string[] = [];

  // Find lowest scoring persona
  const lowestScore = scores.reduce((min, s) => s.score < min.score ? s : min);
  
  if (lowestScore.score < 60) {
    recommendations.push(
      `Focus on improving ${lowestScore.persona} appeal: ${lowestScore.keyFactors.negative[0] || 'address identified weaknesses'}`
    );
  }

  // Check for consensus weaknesses
  const commonWeaknesses = scores
    .flatMap(s => s.keyFactors.negative)
    .filter((w, i, arr) => arr.indexOf(w) !== i); // Find duplicates
  
  if (commonWeaknesses.length > 0) {
    recommendations.push(`Multiple personas identified: ${commonWeaknesses[0]} - prioritize this fix`);
  }

  // Strategy based on overall score
  if (hitProbability >= 70) {
    recommendations.push('Strong commercial potential - focus on marketing and distribution strategy');
  } else if (hitProbability >= 50) {
    recommendations.push('Moderate potential - consider targeted audience approach vs. mass appeal');
  } else {
    recommendations.push('Consider artistic/niche positioning rather than mainstream push');
  }

  // Viral potential
  const viralScore = scores.find(s => s.persona === 'TikTok Influencer');
  if (viralScore && viralScore.score >= 70) {
    recommendations.push('High viral potential - invest in social media marketing and influencer partnerships');
  }

  return recommendations.slice(0, 5);
}

/**
 * Determine target audience from persona scores
 */
function determineTargetAudience(scores: PersonaScore[], genre: string): string {
  const tiktokScore = scores.find(s => s.persona === 'TikTok Influencer')?.score || 0;
  const radioScore = scores.find(s => s.persona === 'Radio PD')?.score || 0;
  const curatorScore = scores.find(s => s.persona === 'Playlist Curator')?.score || 0;

  if (tiktokScore >= 70) return 'Gen Z, social media active, trend-conscious';
  if (radioScore >= 70) return 'Broad demographic, mainstream listeners, 18-49';
  if (curatorScore >= 70) return 'Streaming-first audience, playlist discoverers, genre fans';
  
  return `${genre} enthusiasts, niche audience`;
}
