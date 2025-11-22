import { GeneratedSong } from "../types";

const API_BASE_URL = 'https://api.sunoapi.org/api/v1';
const API_KEY = import.meta.env.VITE_SUNO_API_KEY;

console.log('[SunoService] Initializing...');
console.log('[SunoService] API Key present:', !!API_KEY);
console.log('[SunoService] API Key length:', API_KEY ? API_KEY.length : 0);

if (!API_KEY) {
  console.error("[SunoService] VITE_SUNO_API_KEY is missing from environment variables. Audio generation will not work.");
}

export interface SunoGenerationOptions {
  prompt: string;
  customMode?: boolean;
  instrumental?: boolean;
  style?: string;
  title?: string;
  model?: 'V3_5' | 'V4' | 'V4_5' | 'V4_5PLUS' | 'V5';
  callBackUrl?: string;
}

export interface SunoTaskResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

export interface SunoStatusResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    status: 'TEXT_SUCCESS' | 'TEXT_SUBMITTING' | 'GENERATING' | 'PENDING' | 'SUCCESS' | 'FAILED';
    response?: {
      sunoData: Array<{
        id: string;
        audioUrl: string;
        streamAudioUrl?: string;
        sourceAudioUrl: string;
        title: string;
        tags: string;
        duration: number | null;
        imageUrl?: string;
        sourceImageUrl?: string;
        model?: string; // Actual model used by Suno
      }>;
    };
    errorMessage?: string;
  };
}

export const generateMusic = async (options: SunoGenerationOptions): Promise<string> => {
  if (!API_KEY) throw new Error("Suno API Key is missing");

  console.log('[SunoService] Generating music with options:', options);

  const payload = {
    ...options,
    model: options.model || 'V4' // Use provided model, default to V4
  };

  console.log('[SunoService] 🎵 FINAL PAYLOAD BEING SENT:', JSON.stringify(payload, null, 2));

  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  console.log('[SunoService] Generate response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[SunoService] Generate failed:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const result: SunoTaskResponse = await response.json();
  console.log('[SunoService] Generate result:', result);
  
  if (result.code !== 200) {
    throw new Error(`Suno API Error (code ${result.code}): ${result.msg}`);
  }

  console.log('[SunoService] ✅ Task created:', result.data.taskId);
  return result.data.taskId;
};

export const checkTaskStatus = async (taskId: string): Promise<SunoStatusResponse['data']> => {
  if (!API_KEY) throw new Error("Suno API Key is missing");

  console.log('[SunoService] Checking status for task:', taskId);

  const response = await fetch(`${API_BASE_URL}/generate/record-info?taskId=${taskId}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });

  const result: SunoStatusResponse = await response.json();
  console.log('[SunoService] Status result:', result);
  
  if (result.code !== 200) {
    throw new Error(`Suno API Status Error (code ${result.code}): ${result.msg}`);
  }

  return result.data;
};

export const generateSongFromArchitect = async (song: GeneratedSong): Promise<string> => {
    // The Suno API requires a callBackUrl parameter
    // We'll use a placeholder URL since we're polling for status instead
    const callBackUrl = 'https://webhook.site/placeholder';

    return generateMusic({
        prompt: song.lyrics,
        style: song.stylePrompt,
        title: song.title,
        customMode: true,
        instrumental: song.instrumental || false,
        model: song.model || 'V4',
        callBackUrl
    });
};