import { GoogleGenAI } from '@google/genai';

export interface AudioAnalysis {
  overallScore: number; // 0-10
  scores: {
    vocalTone: {
      score: number; // 0-10
      reasoning: string;
      details: {
        clarity: number;
        emotion: number;
        technique: number;
        timbre: string;
      };
    };
    productionQuality: {
      score: number; // 0-10
      reasoning: string;
      details: {
        cleanliness: number;
        polish: number;
        professionalSound: number;
        artifacts: string[];
      };
    };
    mixingBalance: {
      score: number; // 0-10
      reasoning: string;
      details: {
        vocalProminence: number;
        instrumentBalance: number;
        frequencyDistribution: string;
        dynamicRange: number;
      };
    };
    sonicCoherence: {
      score: number; // 0-10
      reasoning: string;
      details: {
        genreAlignment: number;
        instrumentalFit: number;
        moodConsistency: number;
        transitionQuality: number;
      };
    };
    commercialReadiness: {
      score: number; // 0-10
      reasoning: string;
      details: {
        radioReady: boolean;
        streamingOptimized: boolean;
        industryStandard: boolean;
        marketability: number;
      };
    };
  };
  technicalIssues: string[];
  strengths: string[];
  recommendations: string[];
  estimatedCost: number; // Cost of this analysis in USD
}

const ANALYSIS_COST = 0.05; // $0.05 per song

/**
 * Analyze audio file using Gemini 2.0 Pro multimodal capabilities
 * NOTE: This requires Gemini 2.0 Pro with multimodal support
 */
export async function analyzeAudioFile(
  audioFile: File,
  apiKey: string,
  songContext?: {
    title?: string;
    genre?: string;
    lyrics?: string;
  }
): Promise<AudioAnalysis> {
  const ai = new GoogleGenAI({ apiKey });

  // Convert audio file to base64
  const audioData = await fileToBase64(audioFile);
  const mimeType = audioFile.type || 'audio/mpeg';

  const contextPrompt = songContext
    ? `
Context:
- Title: ${songContext.title || 'Unknown'}
- Genre: ${songContext.genre || 'Unknown'}
- Has Lyrics: ${songContext.lyrics ? 'Yes' : 'No'}
`
    : '';

  const prompt = `You are an expert audio engineer and music producer analyzing a song recording.

${contextPrompt}

Analyze this audio file comprehensively across 5 dimensions:

1. VOCAL TONE (0-10):
   - Clarity: How clear and intelligible are the vocals?
   - Emotion: Does the vocal delivery convey appropriate emotion?
   - Technique: Pitch accuracy, breath control, dynamics
   - Timbre: Describe the vocal character (warm, bright, breathy, etc.)

2. PRODUCTION QUALITY (0-10):
   - Cleanliness: Are there unwanted noises, clicks, distortion?
   - Polish: Does it sound professionally produced?
   - Professional Sound: Industry-standard quality?
   - Artifacts: List any technical issues (clipping, noise, reverb issues, etc.)

3. MIXING BALANCE (0-10):
   - Vocal Prominence: Are vocals properly featured?
   - Instrument Balance: Are all elements audible and balanced?
   - Frequency Distribution: Well-distributed across low/mid/high frequencies?
   - Dynamic Range: Appropriate dynamics without over-compression?

4. SONIC COHERENCE (0-10):
   - Genre Alignment: Does the sound match the genre expectations?
   - Instrumental Fit: Do instruments work together cohesively?
   - Mood Consistency: Does the sonic palette support the mood?
   - Transition Quality: Smooth transitions between sections?

5. COMMERCIAL READINESS (0-10):
   - Radio Ready: Could this play on professional radio?
   - Streaming Optimized: Appropriate loudness and quality for streaming?
   - Industry Standard: Meets current industry production standards?
   - Marketability: Competitive with commercial releases?

Provide detailed reasoning for each score, specific technical observations, and actionable recommendations for improvement.

Return your analysis in JSON format with this structure:
{
  "overallScore": <average of all 5 scores>,
  "scores": {
    "vocalTone": {
      "score": <0-10>,
      "reasoning": "<2-3 sentences>",
      "details": {
        "clarity": <0-10>,
        "emotion": <0-10>,
        "technique": <0-10>,
        "timbre": "<description>"
      }
    },
    "productionQuality": {
      "score": <0-10>,
      "reasoning": "<2-3 sentences>",
      "details": {
        "cleanliness": <0-10>,
        "polish": <0-10>,
        "professionalSound": <0-10>,
        "artifacts": ["<issue1>", "<issue2>"]
      }
    },
    "mixingBalance": {
      "score": <0-10>,
      "reasoning": "<2-3 sentences>",
      "details": {
        "vocalProminence": <0-10>,
        "instrumentBalance": <0-10>,
        "frequencyDistribution": "<description>",
        "dynamicRange": <0-10>
      }
    },
    "sonicCoherence": {
      "score": <0-10>,
      "reasoning": "<2-3 sentences>",
      "details": {
        "genreAlignment": <0-10>,
        "instrumentalFit": <0-10>,
        "moodConsistency": <0-10>,
        "transitionQuality": <0-10>
      }
    },
    "commercialReadiness": {
      "score": <0-10>,
      "reasoning": "<2-3 sentences>",
      "details": {
        "radioReady": <true/false>,
        "streamingOptimized": <true/false>,
        "industryStandard": <true/false>,
        "marketability": <0-10>
      }
    }
  },
  "technicalIssues": ["<issue1>", "<issue2>", "<issue3>"],
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "recommendations": ["<rec1>", "<rec2>", "<rec3>", "<rec4>", "<rec5>"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Note: Will need 'gemini-pro-vision' or multimodal model when available
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: audioData
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const result = JSON.parse(response.text || '{}');

    return {
      ...result,
      estimatedCost: ANALYSIS_COST
    };
  } catch (error) {
    console.error('Audio analysis failed:', error);
    throw new Error('Failed to analyze audio file. Ensure you have access to Gemini multimodal models.');
  }
}

/**
 * Convert File to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate audio file before processing
 */
export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/wave'];
  const maxSize = 50 * 1024 * 1024; // 50MB

  if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav)$/i)) {
    return { valid: false, error: 'Invalid file type. Please upload MP3 or WAV file.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum size is 50MB.' };
  }

  return { valid: true };
}

/**
 * Estimate analysis cost based on file size
 */
export function estimateAnalysisCost(fileSize: number): number {
  // Fixed cost regardless of file size for now
  return ANALYSIS_COST;
}
