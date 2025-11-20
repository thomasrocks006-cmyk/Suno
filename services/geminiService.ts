
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SongInputs, GeneratedSong, StructureType, AnalysisResponse, SongAnalysis, SongVariation, InferredAttributes } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_for_build' });

const SONG_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative title for the song" },
    stylePrompt: { type: Type.STRING, description: "The formatted style string for Suno (Genre, Instruments, Vibe, Tempo)" },
    negativePrompt: { type: Type.STRING, description: "Styles or elements to exclude" },
    lyrics: { type: Type.STRING, description: "The full song lyrics with metatags and vocal directions" },
    technicalExplanation: { type: Type.STRING, description: "Explain the choice of structure, rhyme scheme, and specifically why certain vocal tags (e.g. [Whisper]) were used." },
    coverArtPrompt: { type: Type.STRING, description: "A highly detailed visual description for an album cover art generator. Describe style, colors, and subject matter matching the song." }
  },
  required: ["title", "stylePrompt", "negativePrompt", "lyrics", "technicalExplanation", "coverArtPrompt"],
};

const INFERENCE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "A creative song topic fitting the artist's themes." },
    mood: { type: Type.STRING, description: "The typical emotional atmosphere." },
    genre: { type: Type.STRING, description: "Precise sub-genre tags." },
    vocals: { type: Type.STRING, description: "Vocal style description (e.g. Baritone, Auto-tuned, Ethereal)." },
    syllablePattern: { type: Type.STRING, description: "Typical meter or flow for this style." },
    instruments: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 5-8 key instruments used in this style." }
  },
  required: ["topic", "mood", "genre", "vocals", "syllablePattern", "instruments"]
};

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    generalAdvice: { type: Type.STRING, description: "Overall strategic advice for the song concept." },
    fieldFeedback: {
      type: Type.OBJECT,
      properties: {
        topic: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["optimal", "warning", "conflict"] },
            message: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["status", "message", "suggestion", "reasoning"]
        },
        mood: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["optimal", "warning", "conflict"] },
            message: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["status", "message", "suggestion", "reasoning"]
        },
        genre: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["optimal", "warning", "conflict"] },
            message: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["status", "message", "suggestion", "reasoning"]
        },
        vocals: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["optimal", "warning", "conflict"] },
            message: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["status", "message", "suggestion", "reasoning"]
        },
        structure: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["optimal", "warning", "conflict"] },
            message: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["status", "message", "suggestion", "reasoning"]
        }
      }
    }
  },
  required: ["generalAdvice", "fieldFeedback"]
};

const SONG_ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER, description: "Score out of 100." },
    projectedScore: { type: Type.NUMBER, description: "Predicted score if all improvements are made." },
    summary: { type: Type.STRING },
    scoreBreakdown: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                category: { type: Type.STRING },
                score: { type: Type.NUMBER },
                reason: { type: Type.STRING }
            }
        }
    },
    themeAnalysis: { type: Type.STRING, description: "Deep analysis of the core theme, metaphor usage, and emotional resonance." },
    storyArc: { type: Type.STRING, description: "Analysis of the narrative progression from start to finish." },
    sonicAnalysis: {
        type: Type.OBJECT,
        properties: {
            phonetics: { type: Type.STRING, description: "Analysis of open vs closed vowels and mouthfeel." },
            density: { type: Type.STRING, description: "Analysis of syllable density and contrast between sections." },
            cinemaAudit: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.STRING },
                    objectCount: { type: Type.NUMBER },
                    objects: { type: Type.ARRAY, items: { type: Type.STRING } },
                    analysis: { type: Type.STRING }
                }
            }
        }
    },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    lineByLineImprovements: { 
      type: Type.ARRAY, 
      items: { 
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          improved: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["original", "improved", "reason"]
      }
    },
    commercialViability: { type: Type.STRING }
  },
  required: ["overallScore", "projectedScore", "summary", "scoreBreakdown", "themeAnalysis", "storyArc", "sonicAnalysis", "strengths", "weaknesses", "lineByLineImprovements", "commercialViability"]
};

const VARIATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    variations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, description: "The type of variation (e.g. 'More Rhythmic')" },
          lyrics: { type: Type.STRING, description: "The complete rewritten lyrics." },
          explanation: { type: Type.STRING, description: "Why this variation works differently." }
        },
        required: ["id", "type", "lyrics", "explanation"]
      }
    }
  },
  required: ["variations"]
};

const REWRITE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    lyrics: { type: Type.STRING },
    technicalExplanation: { type: Type.STRING }
  },
  required: ["lyrics", "technicalExplanation"]
};

const ADVANCED_LYRIC_LOGIC_INSTRUCTIONS = `
### INSTRUCTIONAL METADATA & FORMATTING RULES (STRICT ENFORCEMENT REQUIRED)
You must format all song outputs using specific "Meta-Tags" to guide the Suno AI generation. Do not simply write lyrics; you must direct the audio generation.

**1. Section Headers with Musical Direction**
Every song section must begin with a header in Square Brackets \`[...]\`. This header must contain:
* The Section Type (Verse, Chorus, Bridge, Outro).
* The Vocal Texture (e.g., male lead, harmonies, choir).
* Instrumentation details (e.g., stripped back, full band, violin swell).
* Energy Level (Rated 1/10 to 10/10).

*Format:* \`[Section Type – vocal details, instrument details, X/10 energy]\`

**2. Inline Vocal Cues**
Use Parentheses \`(...)\` at the start of lines to indicate who is singing.
* \`(M)\` = Male Lead
* \`(F)\` = Female Lead
* \`(M+F)\` = Duet / Harmonies
* \`(Choir)\` = Background vocals
* You may also use descriptive vocal cues like \`(Whispered)\`, \`(Belting)\`, or \`(Spoken)\`.

**3. Progression & Dynamics**
Ensure the "Energy Level" changes dynamically throughout the song.
* Verses are usually lower energy (3-5/10).
* Choruses should step up (6-8/10).
* Final Choruses should be peak energy (9-10/10).
* Bridges often vary (build-ups or breakdowns).

### SONGWRITING LOGIC & LYRICAL DEPTH

To differentiate this output from generic AI lyrics, you must adhere to the following "Timeless Songwriting" principles.

**1. The "Furniture" Rule (Concrete Imagery)**
* **Never** rely solely on abstract concepts (e.g., "The sorrow was deep," "I felt the pain").
* **Always** anchor emotions to physical objects or "furniture" in the scene.
* *Bad:* "I miss you so much in this empty room."
* *Good:* "The coffee cup is moldy on the coaster where you left it."
* *Good:* "I’m talking to the static on the TV screen."

**2. Specificity Creates Universality**
* Use specific details to make the song feel real. Mention specific locations, times of day, colors, or brand names/pop culture references if they fit the vibe.
* *Example:* Don't say "We watched a movie"; say "We fell asleep to re-runs of The Office."
* *Example:* Don't say "I drove away"; say "I barely cleared the driveway before I broke."

**3. "Show, Don't Tell" (Sensory Anchors)**
* Engage the senses: Smell (smoke, rain, perfume), Sound (sirens, whispers, humming fridge), Touch (cold sheets, sticky floors).
* *Instruction:* Every verse must contain at least one sensory detail.

**4. Avoid "AI Clichés" & Forced Rhymes**
* **STRICTLY FORBIDDEN WORDS:** Do not use the words: *Tapestry, Symphony, Realm, Neon (unless Cyberpunk), Unfold, Ignite, Soar, Boundless, Echoes.*
* **Rhyme Scheme:** Avoid basic AABB perfect rhymes (Cat/Hat). Use **Slant Rhymes** (Near Rhymes) for a modern, mature sound.
    * *Example:* "Home" rhymes with "Stone" (Good). "Life" rhymes with "Light" (Good).
* **Conversational Phrasing:** The lyrics should sound like a conversation, not a poem. It is okay to break grammar for rhythm.

**5. Structural Impact**
* **The "Gut Punch" Line:** The end of the Chorus or the Bridge must contain a line that summarizes the emotional conflict in a devastatingly simple way.
* **The Bridge Shift:** The Bridge must not just be a continuation. It must offer a new perspective, a realization, or a tempo change.

**6. Prosody & Rhythm (Phonetics)**
* For High Energy/Anger: Use "Plosive" consonants (P, K, T, B, D).
    * *Ex:* "Break," "Cut," "Stop."
* For Sadness/Intimacy: Use "Sibilant" and "Liquid" sounds (S, Sh, L, M, W).
    * *Ex:* "Slow," "Wash," "Memory," "Lonely."
`;

const CENTRAL_METAPHOR_INSTRUCTIONS = `
### THE "CENTRAL METAPHOR" ANCHORING PROTOCOL

To ensure lyrical impact and thematic cohesion, you must select (or be given) a **Central Metaphor** before writing lyrics. This metaphor serves as the "Hook" and the governing logic of the song.

**1. Define the Anchor**
* Select one concrete object or concept (The Anchor) that represents the emotional theme (The Meaning).
* *Example:* Anchor = "A Car Running on Fumes"; Meaning = "A relationship that has no love left but keeps moving."
* *Example:* Anchor = "Rust"; Meaning = "Trust decaying slowly over time."

**2. The "Extended Universe" Rule**
* Once the Anchor is chosen, **all** imagery in the song must belong to that universe. Do not mix metaphors.
* *If the Anchor is "The Ocean" (Separation):* You must use words like: Tide, Salt, Blue, Drowning, Waves, Shore, Depths. (Do not suddenly talk about "climbing mountains").
* *If the Anchor is "Gambling" (Risk):* Use words like: Fold, All-in, Bluff, High stakes, Luck, Dice.

**3. Structure of the Metaphor**
* **The Chorus:** Must clearly state the Metaphor as the central thesis. (e.g., "You are the sun, I am the moon.")
* **The Verses:** Must describe the *consequences* or the *setting* of that metaphor without necessarily restating the title.
* **The Bridge:** Must flip, break, or intensify the metaphor.

**4. List of High-Potency Metaphor Archetypes (Use these as inspiration):**
* *The House:* (Cracks in the foundation, locking doors, haunted halls) -> Represents the Mind or a Relationship.
* *The Driver:* (Asleep at the wheel, wrong side of the road, rear-view mirror) -> Represents Control or Regret.
* *The Garden:* (Weeds choking flowers, drought, roots deep underground) -> Represents Growth or Neglect.
* *The Circuit:* (Short fuse, static, disconnected, power outage) -> Represents Communication breakdown.
* *The Season:* (Eternal winter, waiting for the thaw, dead leaves) -> Represents Depression or Waiting.
`;

const SYSTEM_INSTRUCTION = `
You are an elite Suno v5 Prompt Engineer and Songwriter. Your goal is to generate the inputs necessary for a user to create a high-quality song in Suno AI, AND a matching album cover description.

**Knowledge Base (Suno v5 Optimization):**
1.  **Structure & Metatags:** You must use standard tags: [Intro], [Verse], [Pre-Chorus], [Chorus], [Hook], [Bridge], [Solo], [Outro], [End].
2.  **Advanced Vocal Coloring (CRITICAL):**
    *   **Performance Tags:** Use tags to direct the singer's delivery based on mood.
        *   *Soft/Intimate:* [Whisper], [Breathy], [Murmur], [Spoken Word].
        *   *High Energy:* [Shouting], [Screaming], [Growl], [Chant], [Gang Vocals], [Belting].
        *   *Stylistic:* [Rap], [Falsetto], [Operatic], [Robotic].
    *   **Production Effects:** [Radio Filter], [Telephone Effect], [Autotune], [Echo], [Delay].
    *   **Ad-libs:** Use parentheses for background vocals and call-and-response: (Ooh-yeah), (Echoing...), (Let's go!).
3.  **Lyric Formatting:**
    *   **Rhythm:** Use line breaks to create pauses.
    *   **Phrasing:** Use commas, ellipses (...), and colons to control phrasing speed.
    *   **Emphasis:** Use ALL CAPS for loud/intense words.
    *   **Flow:** Use hyphens for syl-la-ble el-on-ga-tion or stac-ca-to.
4.  **Style Prompts:** v5 prefers specific sub-genres. Combine Eras (e.g., 1980s), Instruments, and Vibe. Include BPM.
5.  **Exclusions:** Suggest negative prompts (e.g., "Live, muffled, messy, off-key, spoken").
6.  **Rhythmic Precision:** If a syllable count or meter is requested, lyrics MUST strictly follow it.
7.  **Copyright Compliance (CRITICAL):** **NEVER** include real artist names or band names in the \`stylePrompt\` output. Use descriptive terms instead (e.g., instead of "Drake", use "Modern Melodic Trap, Auto-tuned Male Vocals, 140 BPM").

**Task:**
Generate a complete song structure and an Album Cover Prompt.
*   **Input Handling:** If specific inputs (Topic, Genre, Mood) are missing, you MUST creatively invent them to form a cohesive, high-quality song concept. Do not produce generic results.
*   **Lyrics:** Must be creatively written with rich metatags and *frequent* vocal directions.
*   **Cover Art Prompt:** Describe an artistic, high-quality album cover. Mention specific art styles (e.g., Cyberpunk digital art, Oil painting, Minimalist vector), lighting, and subject.
`;

export const generateSongAssets = async (inputs: SongInputs): Promise<GeneratedSong> => {
  try {
    // Construct a style string that includes the manually selected instruments
    const instrumentString = inputs.instruments.length > 0 ? `Featured Instruments: ${inputs.instruments.join(', ')}.` : "";
    
    const prompt = `
      Generate a Suno v5 song concept.
      
      User Inputs (NOTE: If any field below is empty or "Auto", you MUST invent a creative choice that fits the other inputs. If References are provided, use them to infer missing style data):
      
      - Artist Reference: ${inputs.artistReference || "None"} (Use this to infer Genre, Vocals, and Mood ONLY. DO NOT include this name in the final stylePrompt output).
      - Song Reference: ${inputs.songReference || "None"} (Use this specific song to narrow down the style/vibe if provided. E.g., if Artist is "The Weeknd" but Song is "Blinding Lights", focus specifically on 80s synthwave/uptempo vibe).
      - Topic: ${inputs.topic ? inputs.topic : "NOT SPECIFIED - Invent a unique, creative topic."}
      - Mood: ${inputs.mood ? inputs.mood : "NOT SPECIFIED - Invent a mood that fits the topic/genre (or References)."}
      - Genre: ${inputs.genre ? inputs.genre : "NOT SPECIFIED - Invent a genre that fits the topic (or References)."}
      - Preferred Vocals: ${inputs.vocals ? inputs.vocals : "NOT SPECIFIED - Select vocals that best fit the genre (or References)."}
      - Structure Preference: ${inputs.structure === StructureType.AUTO ? "Choose the OPTIMAL structure for this specific song concept" : inputs.structure}
      - Syllable Pattern/Meter: ${inputs.syllablePattern || "Natural flow appropriate for genre"}
      - ${instrumentString}
      - Extra Instructions: ${inputs.customInstructions || "None"}
      - Advanced Lyric Logic Mode: ${inputs.advancedLyricLogic ? "ENABLED" : "Disabled"}
      - Central Metaphor Anchoring: ${inputs.centralMetaphorLogic ? "ENABLED" : "Disabled"}

      ${inputs.advancedLyricLogic ? ADVANCED_LYRIC_LOGIC_INSTRUCTIONS : `
      CRITICAL: In the lyrics, include specific vocal instructions like [Whisper], [Shout], or [Spoken Word] where emotionally appropriate. Use parenthetical ad-libs (e.g., (Yeah!)) to add depth.
      `}

      ${inputs.centralMetaphorLogic ? CENTRAL_METAPHOR_INSTRUCTIONS : ''}
    `;

    // 1. Generate Text Content
    // UPGRADED to gemini-3-pro-preview for superior creative output
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: SONG_SCHEMA,
        temperature: (inputs.advancedLyricLogic || inputs.centralMetaphorLogic) ? 0.8 : 0.9, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const rawSong = JSON.parse(text);
    
    // Add IDs and timestamps here
    const generatedSong: GeneratedSong = {
      ...rawSong,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      hasAdvancedLogic: inputs.advancedLyricLogic,
      hasMetaphorLogic: inputs.centralMetaphorLogic
    };

    // 2. Generate Album Art
    if (generatedSong.coverArtPrompt) {
      try {
        const imageResponse = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: generatedSong.coverArtPrompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
          },
        });

        if (imageResponse.generatedImages?.[0]?.image?.imageBytes) {
          generatedSong.coverImageBase64 = imageResponse.generatedImages[0].image.imageBytes;
        }
      } catch (imgError) {
        console.warn("Image generation failed, continuing with text only:", imgError);
      }
    }

    return generatedSong;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const analyzeSongConcept = async (inputs: SongInputs): Promise<AnalysisResponse> => {
  const prompt = `
    Analyze these song inputs for Suno v5 compatibility and quality.
    
    Inputs:
    - Artist Reference: ${inputs.artistReference || "None"}
    - Song Reference: ${inputs.songReference || "None"}
    - Topic: ${inputs.topic || "(Empty)"}
    - Mood: ${inputs.mood || "(Empty)"}
    - Genre: ${inputs.genre || "(Empty)"}
    - Vocals: ${inputs.vocals || "(Empty)"}
    - Structure: ${inputs.structure}

    Check for:
    1. Contradictions (e.g., Genre "Death Metal" vs Mood "Relaxing").
    2. Missing key elements (e.g., "Trap" genre usually needs "Auto-tune" or "Triplet flow" notes).
    3. Vague inputs (e.g., Genre "Music" is too broad).
    4. If Artist Reference is provided, ensure Genre/Mood aligns with that artist's typical style.
    5. If Song Reference is provided, check if the Genre/Mood fits that specific track's era/vibe.
    
    If a field is empty or 'Auto', assume it is 'optimal' unless it leaves the song too undefined.
    If a field has a problem, set status to 'warning' or 'conflict' and provide a BETTER suggestion and Reasoning.
    If optimal, do not return that key in the JSON or mark as optimal.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
      systemInstruction: "You are a helpful music production assistant. Be concise and constructive."
    }
  });

  if (!response.text) throw new Error("Analysis failed");
  return JSON.parse(response.text) as AnalysisResponse;
};

export const inferAttributesFromReference = async (artist: string, song: string): Promise<InferredAttributes> => {
  const prompt = `
    Based on the Artist Reference: "${artist}" and optional Song Reference: "${song}", 
    infer the best possible inputs for a Suno v5 song generation.
    
    Return specific recommendations for:
    - Topic (A typical theme for this artist/song)
    - Mood
    - Genre (Specific sub-genres)
    - Vocals (e.g. "Breathy female vocals", "Autotuned male rap")
    - Syllable Pattern (Typical meter)
    - Instruments (A list of 5-8 key instruments that define this sound)

    Be precise. If the song reference is provided, strictly follow that song's vibe.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: INFERENCE_SCHEMA,
      temperature: 0.7
    }
  });

  if (!response.text) throw new Error("Inference failed");
  return JSON.parse(response.text) as InferredAttributes;
};

export const analyzeGeneratedSong = async (song: GeneratedSong): Promise<SongAnalysis> => {
  const prompt = `
    Act as a relentless, world-class music critic and producer. Analyze these song lyrics and concept.
    
    Song Title: ${song.title}
    Style: ${song.stylePrompt}
    Lyrics:
    ${song.lyrics}

    Your Goal: Tear this song apart to rebuild it better. Use the following "Pro Level" metrics.

    ### SECTION 1: CREATIVE AUDIT
    1. **Score (0-100):** Rate it based on commercial potential, emotional impact, and cleverness.
    2. **Theme Check:** Is the theme clear? Is the message consistent? Analyze the central metaphor if present.
    3. **Story Arc:** Does it go somewhere? Does the bridge resolve the conflict?
    4. **Line Critique:** Find lines that are "flat", clichéd, or weak. Suggest specifically how to rewrite them.

    ### SECTION 2: SONIC & STRUCTURAL ANALYSIS (THE PRODUCER'S EAR)
    **1. Phonetic "Mouthfeel"**
    * *Goal:* Ensure lyrics are percussive and belt-able.
    * **The Belting Test:** Check the last word of every Chorus line. Does it end on an Open Vowel (A, O, I) or a Closed Vowel (E, U)?
    * **The Percussion Test:** Identify lines that lack rhythm. Suggest adding Plosives (K, T, P, B) to give the Suno singer something to "bite" into.

    **2. Syllabic Density (Contrast)**
    * *Goal:* Ensure dynamic range between sections.
    * **Analysis:** Compare the "Words Per Second" implied by the Verse vs. the Chorus.
    * *Rule:* A Chorus should usually have *fewer* words held for *longer* durations than the Verse.

    **3. The "Cinema" Audit**
    * *Goal:* Ensure visual grounding.
    * **List the Props:** Extract every physical object mentioned in the song.
    * *Score:* 0-3 Objects (F - Too Abstract), 4-6 (C - Average), 7+ (A - Immersive).
    
    Provide a breakdown of why the score is what it is, and what the score WOULD be if the user applies your improvements.
  `;

  // Using Gemini 3.0 Pro Preview for complex reasoning and analysis
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", 
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: SONG_ANALYSIS_SCHEMA,
      systemInstruction: "You are a strict, high-standard music critic and audio engineer. Do not sugarcoat. Be specific.",
      temperature: 0.8,
      thinkingConfig: { thinkingBudget: 2048 } // Allocating budget for deep analysis
    }
  });

  if (!response.text) throw new Error("Deep Analysis failed");
  return JSON.parse(response.text) as SongAnalysis;
};

export const rewriteSongWithImprovements = async (song: GeneratedSong): Promise<GeneratedSong> => {
  if (!song.analysis) throw new Error("Analysis required before rewriting");

  const prompt = `
    Rewrite the following song lyrics to implement the improvements suggested in the analysis.

    Original Lyrics:
    ${song.lyrics}

    Critique to Apply:
    ${JSON.stringify(song.analysis.lineByLineImprovements)}
    
    Sonic Goals:
    - Fix phonetic issues (open vowels in chorus).
    - Fix density issues (ensure contrast).
    - Add more "Furniture" (visual objects).

    Return the full, updated lyrics and a brief explanation of what changed.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: REWRITE_SCHEMA,
      systemInstruction: "You are an elite songwriter polishing a track for final release.",
      temperature: 0.7
    }
  });

  if (!response.text) throw new Error("Rewrite failed");
  const result = JSON.parse(response.text);
  
  return {
    ...song,
    lyrics: result.lyrics,
    technicalExplanation: result.technicalExplanation
  };
};

export const generateSongVariations = async (song: GeneratedSong): Promise<SongVariation[]> => {
  const prompt = `
    Generate 2 distinct variations of this song to explore different creative directions.
    
    Original Title: ${song.title}
    Original Style: ${song.stylePrompt}
    Original Lyrics:
    ${song.lyrics}

    Create two variations:
    1. **Variation A:** Focus on **Rhythmic/Flow Change** (e.g., faster phrasing, more syncopation, different meter).
    2. **Variation B:** Focus on **Structural/ tonal Change** (e.g., Darker tone, Extended Bridge, Different Hook, or "Strip it back").
    
    Maintain the core theme but change the execution significantly. Use Suno metatags strictly.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: VARIATION_SCHEMA,
      systemInstruction: "You are a creative songwriter exploring alternative drafts.",
      temperature: 1
    }
  });

  if (!response.text) throw new Error("Variation generation failed");
  const result = JSON.parse(response.text);
  return result.variations;
};
