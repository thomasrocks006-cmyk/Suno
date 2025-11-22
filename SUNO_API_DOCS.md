# Suno API Quick Start

> Get started with Suno API in minutes to generate high-quality AI music, lyrics, and audio processing

## Welcome to Suno API

Suno API is powered by advanced AI models to provide comprehensive music generation and audio processing services. Whether you need music creation, lyrics generation, audio editing, or vocal separation, our API meets all your creative needs.

## Authentication

All API requests require authentication using a Bearer token.

### API Base URL

```
https://api.sunoapi.org
```

### Authentication Header

```http
Authorization: Bearer YOUR_API_KEY
```

## Quick Start Guide

### Step 1: Generate Your First Song

Start with a simple music generation request:

```javascript
const response = await fetch('https://api.sunoapi.org/api/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A peaceful acoustic guitar melody with soft vocals, folk style',
    customMode: false,
    instrumental: false,
    model: 'V3_5',
    callBackUrl: 'https://your-server.com/callback'
  })
});

const data = await response.json();
console.log('Task ID:', data.data.taskId);
```

### Step 2: Check Task Status

Use the returned task ID to check generation status:

```javascript
const response = await fetch(`https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const result = await response.json();

if (result.data.status === 'SUCCESS') {
  console.log('Generation complete!');
  console.log('Audio URLs:', result.data.response.data);
} else if (result.data.status === 'GENERATING') {
  console.log('Still generating...');
} else {
  console.log('Generation failed:', result.data.status);
}
```

### Response Format

**Success Response:**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "suno_task_abc123"
  }
}
```

**Task Status Response:**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "suno_task_abc123",
    "status": "SUCCESS",
    "response": {
      "data": [
        {
          "id": "audio_123",
          "audio_url": "https://example.com/generated-music.mp3",
          "title": "Generated Song",
          "tags": "folk, acoustic",
          "duration": 180.5
        }
      ]
    }
  }
}
```

## Core Features

### Music Generation

Create complete songs from text descriptions:

```json
{
  "prompt": "An upbeat electronic dance track with synth leads",
  "customMode": true,
  "style": "Electronic Dance",
  "title": "Digital Dreams",
  "instrumental": false,
  "model": "V4_5"
}
```

### Lyrics Creation

Generate AI-powered lyrics independently:

```json
{
  "prompt": "A song about overcoming challenges and finding inner strength",
  "callBackUrl": "https://your-server.com/lyrics-callback"
}
```

### Audio Extension

Extend existing music tracks:

```json
{
  "audioId": "e231****-****-****-****-****8cadc7dc",
  "defaultParamFlag": true,
  "prompt": "Continue with a guitar solo",
  "continueAt": 120,
  "model": "V3_5"
}
```

### Upload and Cover

Transform existing audio with new styles:

```json
{
  "uploadUrl": "https://example.com/original-audio.mp3",
  "customMode": true,
  "style": "Jazz",
  "title": "Jazz Version",
  "prompt": "Transform into smooth jazz style"
}
```

## Model Versions

* `V3_5` - Creative diversity, up to 4 minutes
* `V4` - Best audio quality, up to 4 minutes
* `V4_5` - Advanced features, up to 8 minutes
* `V4_5PLUS` - Richer sound, up to 8 minutes
* `V5` - Faster generation with superior musicality, up to 8 minutes

## Key Parameters

* `prompt`: Text description for music generation.
* `model`: Model version to use.
* `customMode`: Enable custom parameter mode for advanced control.
* `instrumental`: Generate instrumental-only music without vocals.
* `style`: Music style or genre (required in custom mode).
* `title`: Song title (required in custom mode).
* `callBackUrl`: URL to receive completion notifications.

## Task Status Explanation

* `GENERATING`: Task is being processed
* `SUCCESS`: Task completed successfully
* `FAILED`: Task failed to complete
* `PENDING`: Task is queued for processing

## File Storage and Access

* Audio files remain accessible for **15 days** after generation.
