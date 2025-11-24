
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SongInputs, GeneratedSong, StructureType, AnalysisResponse, SongAnalysis, SongVariation, InferredAttributes, EvaluationResult, FIXED_SCORING_CATEGORIES } from "../types";
import { validateCompleteWorkflow, generateValidatedPlan, WorkflowState } from "./planValidationService";
import { getCachedAnalysis, setCachedAnalysis, clearExpiredCache } from "./cacheService";
import { trackGeneration, trackAnalysis, trackRewrite, trackVariation } from "./costTrackingService";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is missing from environment variables.");
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
    projectedScore: { type: Type.NUMBER, description: "Predicted score if all improvements are applied." },
    summary: { type: Type.STRING },
    scoreBreakdown: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                category: { type: Type.STRING, enum: FIXED_SCORING_CATEGORIES },
                score: { type: Type.NUMBER },
                reason: { type: Type.STRING }
            },
            required: ["category", "score", "reason"]
        }
    },
    themeAnalysis: { type: Type.STRING },
    storyArc: { type: Type.STRING },
    sonicAnalysis: {
        type: Type.OBJECT,
        properties: {
            phonetics: { type: Type.STRING },
            density: { type: Type.STRING },
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
          reason: { type: Type.STRING },
          source: { type: Type.STRING, enum: ['AI', 'User'] }
        },
        required: ["original", "improved", "reason"]
      }
    },
    commercialViability: { type: Type.STRING },
    comparisonReview: {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            missedOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdict: { type: Type.STRING, enum: ['Significant Upgrade', 'Marginal Improvement', 'Regression', 'Different Direction'] },
            scoreDelta: { type: Type.NUMBER }
        }
    },
    rewriteAdvice: {
        type: Type.OBJECT,
        properties: {
            shouldUseAdvancedLogic: { type: Type.BOOLEAN },
            shouldUseMetaphorLogic: { type: Type.BOOLEAN },
            reasoning: { type: Type.STRING }
        }
    },
    dnaMatch: {
        type: Type.OBJECT,
        description: "Real-world hit song that matches the vibe/style of this song",
        properties: {
            referenceSong: { type: Type.STRING, description: "Song title and artist, e.g. 'Photograph by Ed Sheeran'" },
            artist: { type: Type.STRING },
            matchScore: { type: Type.NUMBER, description: "0-100 similarity score" },
            matchReasons: {
                type: Type.OBJECT,
                properties: {
                    vibe: { type: Type.STRING },
                    structure: { type: Type.STRING },
                    lyricalStyle: { type: Type.STRING },
                    emotional: { type: Type.STRING },
                    pacing: { type: Type.STRING }
                },
                required: ["vibe", "structure", "lyricalStyle", "emotional", "pacing"]
            },
            improvements: {
                type: Type.OBJECT,
                properties: {
                    structural: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Song structure improvements" },
                    wordSpacing: { type: Type.ARRAY, items: { type: Type.STRING }, description: "How words are spaced/sung" },
                    metaphorical: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Metaphor improvements" },
                    narrative: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Storytelling improvements" },
                    sonic: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Phonetic/sonic improvements" }
                },
                required: ["structural", "wordSpacing", "metaphorical", "narrative", "sonic"]
            },
            whatTheyDidBetter: { type: Type.STRING, description: "Why the reference song is A-tier" },
            credibilityFactors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "What makes this a proven hit" }
        },
        required: ["referenceSong", "artist", "matchScore", "matchReasons", "improvements", "whatTheyDidBetter", "credibilityFactors"]
    }
  },
  required: ["overallScore", "projectedScore", "summary", "scoreBreakdown", "themeAnalysis", "storyArc", "sonicAnalysis", "strengths", "weaknesses", "lineByLineImprovements", "commercialViability", "dnaMatch"]
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
    executionPlan: {
      type: Type.OBJECT,
      description: "Detailed plan of what will be changed and why",
      properties: {
        targetScore: { type: Type.NUMBER, description: "Expected score after improvements (must be higher than current)" },
        scoreImprovementsByCategory: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, enum: FIXED_SCORING_CATEGORIES },
              currentScore: { type: Type.NUMBER },
              targetScore: { type: Type.NUMBER },
              strategy: { type: Type.STRING, description: "How this category will be improved" }
            },
            required: ["category", "currentScore", "targetScore", "strategy"]
          }
        },
        lineLevelChanges: {
          type: Type.ARRAY,
          description: "Specific line changes with justification",
          items: {
            type: Type.OBJECT,
            properties: {
              lineNumber: { type: Type.NUMBER },
              originalLine: { type: Type.STRING },
              newLine: { type: Type.STRING },
              reason: { type: Type.STRING },
              categoryImproved: { type: Type.STRING, enum: FIXED_SCORING_CATEGORIES }
            },
            required: ["lineNumber", "originalLine", "newLine", "reason", "categoryImproved"]
          }
        },
        phoneticFixes: {
          type: Type.ARRAY,
          description: "Phonetic issues being addressed",
          items: {
            type: Type.OBJECT,
            properties: {
              issue: { type: Type.STRING },
              fix: { type: Type.STRING }
            }
          }
        },
        furnitureAdditions: {
          type: Type.ARRAY,
          description: "Concrete objects being added for imagery",
          items: { type: Type.STRING }
        }
      },
      required: ["targetScore", "scoreImprovementsByCategory", "lineLevelChanges"]
    },
    lyrics: { type: Type.STRING },
    technicalExplanation: { type: Type.STRING },
    changesSummary: { 
      type: Type.STRING, 
      description: "Summary of all changes made and expected impact" 
    }
  },
  required: ["executionPlan", "lyrics", "technicalExplanation", "changesSummary"]
};

const EVALUATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    verdict: { type: Type.STRING, enum: ['Better', 'Worse', 'Neutral'] },
    explanation: { type: Type.STRING },
    scoreChange: { type: Type.NUMBER }
  },
  required: ["verdict", "explanation", "scoreChange"]
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

const COMMERCIAL_MODE_INSTRUCTIONS = `
### "LESS IS MORE" COMMERCIAL MODE - SUNO OPTIMIZATION PROTOCOL

Suno AI performs significantly better with **concise, punchy, repetitive structures** rather than dense storytelling. This mode prioritizes **commercial listenability** over literary complexity.

**CRITICAL RULES:**

**1. VERSE LENGTH CONSTRAINT (MANDATORY)**
* **Maximum 4-6 lines per verse.** Do NOT write 8-12 line verses.
* Each line should be 6-10 syllables maximum.
* *Bad Example:* Long narrative verse with 10+ lines telling a story
* *Good Example:* 
  \`\`\`
  I saw you first in St Kilda light,
  At the Espy bar on a Friday night.
  Bought you a drink, didn't know back then,
  You'd be the one who forgave me again.
  \`\`\`

**2. CHORUS REPETITION & SIMPLICITY**
* Choruses MUST be **highly repetitive** and **easy to sing along to.**
* Use the **same 2-4 core lines** in every chorus.
* Add gradual energy build through instrumentation notes (e.g., "7/10 energy" → "9/10 energy").
* *Pattern:* Repeat the exact same chorus 2-3 times, with only instrumentation/energy changing.
* *Example:*
  \`\`\`
  Carry the flame, don't let it die,
  Through broken glass and starless sky.
  Every step, we find our way,
  Carry the flame into the day.
  \`\`\`

**3. BRIDGE AS DYNAMIC SHIFT (NOT MORE STORY)**
* Bridges should be **short** (4-6 lines) and provide a **musical break**, not continue the narrative.
* Use call-and-response patterns or stripped-back instrumentation.
* *Example:*
  \`\`\`
  [Bridge – call and response, 8/10 energy]
  (M) I won't falter—
  (F) I won't fall.
  (M) Through the silence—
  (F) I'll give it all.
  \`\`\`

**4. CONCRETE IMAGERY OVER ABSTRACT CONCEPTS**
* Avoid vague emotions. Use **physical objects, sensory details, specific moments.**
* *Bad:* "I felt the pain of your absence"
* *Good:* "Your coffee cup is moldy on the coaster where you left it"
* *Good:* "There's a picture on the mantel, colors turning pale"

**5. VOCAL DIRECTION CLARITY**
* Use parentheses for vocal cues: \`(M)\` = Male, \`(F)\` = Female, \`(M+F)\` = Harmonies.
* Specify energy levels in section headers: \`[Chorus – both, 7/10 energy]\`
* Mark instrumentation changes: \`[Verse 2 – female lead, violin + cello rising]\`

**6. STRATEGIC REPETITION**
* The **hook phrase** (usually the title) should appear **multiple times** in the chorus.
* Use **humming, vocal layering, or echoes** between sections for texture without adding lyrical density.
* *Example:* "Huuummm.... / Huuuuuuuuuummm....." as transitional elements.

**7. AVOID DENSE STORYTELLING**
* Suno struggles with complex narratives. Focus on **one emotional snapshot** or **single metaphor.**
* Instead of a linear story (met you → fell in love → broke up → healing), capture **one moment** intensely.
* *Good Topics:* The moment of loss, the memory of a person, a single regret, an unresolved longing.

**8. INSTRUMENTATION NOTES IN SECTION HEADERS**
* Always specify what instruments are active and their intensity.
* *Example:* \`[Verse 1 – soft acoustic + piano]\`
* *Example:* \`[Final Chorus – full band, harmonised soaring lines, 10/10 energy]\`

**9. OUTRO AS FADE, NOT CLIMAX**
* Outros should **strip back** to minimal instrumentation (e.g., "guitar + violin fade" or "piano + strings").
* Repeat a single emotional line or hum to close.
* *Example:*
  \`\`\`
  [Outro – voices entwined, stripped back to guitar + violin]
  (M) Through ashes and silence—
  (F) Through sorrow and rain—
  (M+F) We carry the flame…
  Carry the flame.
  \`\`\`

**10. ENERGY ARC SPECIFICATION**
* Mark energy levels (1/10 to 10/10) for EVERY section.
* *Typical Arc:* Verse 1 (3/10) → Chorus 1 (6/10) → Verse 2 (4/10) → Chorus 2 (7/10) → Bridge (8/10) → Final Chorus (10/10) → Outro (2/10)

**REFERENCE TEMPLATES (From Commercial Successes):**

**Short Verse Template:**
\`\`\`
[Verse 1 – male lead, acoustic guitar, 3/10 energy]
(M) [4 lines, each 6-8 syllables]
(M) [Concrete imagery, sensory detail]
(M) [Setup emotion, not full story]
(M) [End with hook-related phrase]
\`\`\`

**Repetitive Chorus Template:**
\`\`\`
[Chorus – both, close harmonies, 6/10 energy]
(M+F) [Title phrase or hook]
(M+F) [Simple metaphor or image]
(M+F) [Repeat structure from line 1]
(M+F) [Close with title phrase again]
\`\`\`

**SUMMARY:**
* **Verses:** 4-6 lines, concrete imagery, no dense story
* **Choruses:** Identical 2-4 lines repeated, energy builds instrumentally
* **Bridge:** Short, dynamic shift, call-and-response or stripped
* **Outro:** Fade with minimal instruments, emotional echo
* **Energy:** Explicitly marked 1-10 for every section
* **Vocals:** Clear (M), (F), (M+F) markers throughout
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
    *   **CONSTRAINT:** Avoid repetitive use of the same ad-libs like "(Hold on...)" or "(Whispered)" at the end of every line/section unless it is a specific refrain. Vary the vocal coloring.
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

/**
 * Generates integrated instructions based on active feature combinations.
 * This ensures features complement each other rather than conflict.
 */
const generateFeatureIntegrationInstructions = (
  commercialMode: boolean,
  advancedLyricLogic: boolean,
  centralMetaphor: boolean
): string => {
  // Calculate active features
  const activeCount = [commercialMode, advancedLyricLogic, centralMetaphor].filter(Boolean).length;
  
  if (activeCount === 0) {
    // No features - basic mode
    return `
      CRITICAL: In the lyrics, include specific vocal instructions like [Whisper], [Shout], or [Spoken Word] where emotionally appropriate. Use parenthetical ad-libs (e.g., (Yeah!)) to add depth.
    `;
  }

  let instructions = '\n### INTEGRATED FEATURE MODE - PRIORITY HIERARCHY\n\n';

  // ALL THREE ACTIVE - Most constrained, needs clear priorities
  if (activeCount === 3) {
    instructions += `
**🎯 ALL FEATURES ACTIVE - COMMERCIAL + ADVANCED + METAPHOR**

**PRIORITY ORDER (Apply in this sequence):**

1. **COMMERCIAL MODE (Primary Constraint)**
   ${COMMERCIAL_MODE_INSTRUCTIONS}

2. **ADVANCED LYRIC LOGIC (Quality Layer)**
   Apply these rules WITHIN the commercial constraints:
   - ✅ Use section headers with energy levels (Commercial Mode already requires this)
   - ✅ Apply "Furniture Rule" - concrete imagery in 4-6 line verses
   - ✅ Use (M), (F), (M+F) vocal cues throughout
   - ✅ Avoid AI clichés (Tapestry, Symphony, Realm, Unfold, Ignite, Soar)
   - ✅ Use slant rhymes, conversational phrasing
   - ❌ DO NOT extend verses beyond 6 lines for "depth"
   - ❌ DO NOT add complex story arcs

3. **CENTRAL METAPHOR (Thematic Unity)**
   Apply ONE central metaphor across the CONCISE structure:
   - Select ONE anchor object (e.g., "Flame," "Sun/Moon," "Rust")
   - Keep ALL imagery within that metaphor's universe
   - State the metaphor clearly in the chorus (which is already repetitive)
   - Verses show consequences/setting in 4-6 lines max
   - Bridge flips or intensifies the metaphor briefly (4-6 lines)
   
**INTEGRATION RULES:**
- Verses: 4-6 lines, concrete imagery from metaphor universe, (M)/(F) tags, 3-5/10 energy
- Chorus: Repetitive 2-4 lines stating the core metaphor, 6-10/10 energy
- Bridge: Call-and-response using metaphor language, 8/10 energy
- Outro: Fade with metaphor echo, 2/10 energy

**EXAMPLE STRUCTURE:**
\`\`\`
[Verse 1 – male lead, acoustic guitar, 3/10 energy]
(M) I saw the rust on your garden gate,
(M) Where we carved our names in better days.
(M) Now the metal's eating through the paint,
(M) And trust corrodes in time's cruel haze.

[Chorus – both, harmonies, 6/10 energy]
(M+F) We're turning to rust, we're fading away,
(M+F) What we built is crumbling, day by day.
(M+F) We're turning to rust, nothing left to say,
(M+F) We're turning to rust today.

[Verse 2 – female lead, violin enters, 4/10 energy]
(F) The hinges creak with every storm,
(F) Your promises are brittle, worn.
(F) I tried to polish what we had,
(F) But rust runs deeper than the surface scars.

[Bridge – call and response, stripped, 8/10 energy]
(M) Can we reverse it?
(F) It's too far gone.
(M) Can we restore it?
(F) The damage is done.

[Final Chorus – full band, 10/10 energy]
(M+F) We're turning to rust, we're fading away...
\`\`\`
`;
    return instructions;
  }

  // COMMERCIAL + ADVANCED (No metaphor)
  if (commercialMode && advancedLyricLogic && !centralMetaphor) {
    instructions += `
**🎯 COMMERCIAL + ADVANCED LYRIC LOGIC**

**INTEGRATION STRATEGY:**
Commercial Mode provides the structure, Advanced Lyric Logic provides the quality.

${COMMERCIAL_MODE_INSTRUCTIONS}

**ADVANCED LYRIC LOGIC (Applied Within Commercial Constraints):**
- ✅ Every section MUST have [Section – vocal, instruments, X/10 energy] headers
- ✅ Use (M), (F), (M+F) inline vocal cues
- ✅ "Furniture Rule" - anchor emotions to physical objects in 4-6 line verses
- ✅ Sensory details (smell, sound, touch) in every verse
- ✅ Avoid AI clichés: No Tapestry, Symphony, Realm, Unfold, Ignite, Soar, Boundless, Echoes
- ✅ Use slant rhymes, conversational phrasing
- ✅ Prosody: Match consonants to emotion (plosives for anger, sibilants for sadness)
- ❌ DO NOT exceed 6 lines per verse even for "deeper meaning"
- ❌ DO NOT create complex multi-scene narratives

**KEY RULE:** Short verses (4-6 lines) WITH concrete, sensory imagery. NOT abstract emotions.
`;
    return instructions;
  }

  // COMMERCIAL + METAPHOR (No advanced logic)
  if (commercialMode && !advancedLyricLogic && centralMetaphor) {
    instructions += `
**🎯 COMMERCIAL + CENTRAL METAPHOR**

**INTEGRATION STRATEGY:**
Commercial Mode provides the structure, Central Metaphor provides the thematic unity.

${COMMERCIAL_MODE_INSTRUCTIONS}

${CENTRAL_METAPHOR_INSTRUCTIONS}

**INTEGRATION RULES:**
- Select ONE central metaphor (e.g., "Ocean" for separation, "Flame" for hope)
- Keep verses SHORT (4-6 lines) but ensure ALL imagery belongs to that metaphor's universe
- The repetitive chorus MUST state the metaphor clearly: "You are the sun, I am the moon"
- Verses describe consequences/settings within the metaphor (4-6 lines max)
- Bridge flips the metaphor briefly (4-6 lines, call-and-response preferred)
- Outro echoes the metaphor with minimal instruments

**EXAMPLE:**
If metaphor is "The Ocean" (Separation):
- Verses use: Tide, Waves, Shore, Salt, Drowning, Blue, Depths (in 4-6 lines)
- Chorus: "Like waves we crash and drift apart, / The tide pulls us to separate shores..."
- NO mountains, gardens, or unrelated imagery
`;
    return instructions;
  }

  // ADVANCED + METAPHOR (No commercial)
  if (!commercialMode && advancedLyricLogic && centralMetaphor) {
    instructions += `
**🎯 ADVANCED LYRIC LOGIC + CENTRAL METAPHOR**

**INTEGRATION STRATEGY:**
Advanced Lyric Logic provides the craft, Central Metaphor provides the thematic spine.
This mode allows for more literary complexity since Commercial Mode is OFF.

${ADVANCED_LYRIC_LOGIC_INSTRUCTIONS}

${CENTRAL_METAPHOR_INSTRUCTIONS}

**INTEGRATION RULES:**
- Verses can be 6-10 lines (more freedom than Commercial Mode)
- Every line must serve the central metaphor AND use concrete imagery ("Furniture Rule")
- Use sensory anchors (smell, sound, touch) that belong to the metaphor universe
- Section headers MUST include [Type – vocals, instruments, X/10 energy]
- Avoid AI clichés while maintaining metaphor consistency
- The "Gut Punch" line in chorus/bridge should be a devastating metaphor statement

**EXAMPLE:**
If metaphor is "The Driver" (Loss of Control):
- Verses (6-8 lines): Detailed scenes of steering wheel, rearview mirror, brake lights, wrong turns
- Use sensory details: smell of burnt rubber, sound of engine failing, feel of cold leather
- Chorus: "I'm asleep at the wheel, the road's a blur..."
- Avoid: Sudden mentions of oceans, gardens, or houses (stay in driving universe)
`;
    return instructions;
  }

  // COMMERCIAL ONLY
  if (commercialMode && !advancedLyricLogic && !centralMetaphor) {
    instructions += `
**🎯 COMMERCIAL MODE ONLY**

${COMMERCIAL_MODE_INSTRUCTIONS}

**ADDITIONAL BASELINE REQUIREMENTS:**
- Include basic vocal cues: (M), (F), (M+F) for duets
- Use [Section – instruments, X/10 energy] headers
- Include some concrete imagery (avoid pure abstraction)
- Basic ad-libs and humming for texture
`;
    return instructions;
  }

  // ADVANCED ONLY
  if (!commercialMode && advancedLyricLogic && !centralMetaphor) {
    instructions += `
**🎯 ADVANCED LYRIC LOGIC ONLY**

${ADVANCED_LYRIC_LOGIC_INSTRUCTIONS}

**NOTE:** Without Commercial Mode, you have more freedom with verse length (6-10 lines acceptable).
Focus on literary quality, concrete imagery, and metatag precision.
`;
    return instructions;
  }

  // METAPHOR ONLY
  if (!commercialMode && !advancedLyricLogic && centralMetaphor) {
    instructions += `
**🎯 CENTRAL METAPHOR ONLY**

${CENTRAL_METAPHOR_INSTRUCTIONS}

**ADDITIONAL BASELINE REQUIREMENTS:**
- Use section headers: [Verse], [Chorus], [Bridge], etc.
- Include basic vocal cues where appropriate
- Ensure ALL imagery stays within the chosen metaphor universe
- No length restrictions, but maintain thematic cohesion
`;
    return instructions;
  }

  return instructions;
};

export const generateSongAssets = async (inputs: SongInputs): Promise<GeneratedSong> => {
  try {
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
      - Commercial Mode (Less is More): ${inputs.commercialMode ? "ENABLED - Prioritize short verses, repetitive choruses, commercial listenability" : "Disabled"}

      ${generateFeatureIntegrationInstructions(inputs.commercialMode, inputs.advancedLyricLogic, inputs.centralMetaphorLogic)}
    `;

    // 1. Generate Text Content
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
    
    if (!rawSong.lyrics || !rawSong.title || !rawSong.stylePrompt) {
        throw new Error("AI generated incomplete song data. Please try again.");
    }

    const generatedSong: GeneratedSong = {
      ...rawSong,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      hasAdvancedLogic: inputs.advancedLyricLogic,
      hasMetaphorLogic: inputs.centralMetaphorLogic,
      hasCommercialMode: inputs.commercialMode,
      model: inputs.model,
      instrumental: inputs.instrumental
    };

    // 2. Generate Album Art
    if (generatedSong.coverArtPrompt) {
      try {
        const imageResponse = await ai.models.generateImages({
          model: 'imagen-3.0-fast-generate-001',
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

    // Track cost for generation
    trackGeneration(generatedSong.id, generatedSong.title);

    return generatedSong;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

// Internal implementation without caching
const analyzeSongConceptInternal = async (inputs: SongInputs): Promise<AnalysisResponse> => {
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
    model: "gemini-2.0-flash-exp",
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

// Public wrapper with caching
export const analyzeSongConcept = async (inputs: SongInputs): Promise<AnalysisResponse> => {
  // Try to get from cache first
  const cached = await getCachedAnalysis(inputs);
  if (cached) {
    return cached;
  }

  // Clear expired cache entries periodically (1% chance per call)
  if (Math.random() < 0.01) {
    clearExpiredCache().catch(err => console.error('[Cache] Error clearing expired cache:', err));
  }

  // Not in cache, perform analysis
  const result = await analyzeSongConceptInternal(inputs);

  // Store in cache for future use
  await setCachedAnalysis(inputs, result);

  return result;
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

export const analyzeGeneratedSong = async (
  song: GeneratedSong, 
  parentLyrics?: string,
  onProgress?: (stage: string, agent?: string) => void
): Promise<{ analysis: SongAnalysis; agentDebates?: any[] }> => {
  const isRevision = !!parentLyrics || song.title.includes("(V2") || song.title.includes("Revision");
  
  if (onProgress) onProgress('deep-analysis');

  const prompt = `
    Act as a relentless, world-class music critic and producer. Analyze these song lyrics and concept.
    
    Song Title: ${song.title}
    Style: ${song.stylePrompt}
    Lyrics:
    ${song.lyrics}

    ${isRevision && parentLyrics ? `
    ### COMPARISON MODE (V2 vs Original)
    This is a rewrite. You MUST compare it to the original version below.
    
    Original Lyrics:
    ${parentLyrics}
    
    **Comparison Task:**
    1. Identify what has improved (e.g., "Rhymes are no longer forced," "Added concrete furniture").
    2. Identify what was lost or missed.
    3. Issue a Verdict: Significant Upgrade, Marginal Improvement, Regression, or Different Direction.
    4. Populate the 'comparisonReview' field. 
    ` : 'NOTE: This is a fresh generation. Do NOT populate the comparisonReview field.'}

    Your Goal: Tear this song apart to rebuild it better. Use the following "Pro Level" metrics.
    
    **SCORING RULES:**
    You must evaluate the song across these EXACT 6 categories. Do NOT invent other categories.
    1. **Lyrical Originality**: Avoids clichés, uses fresh metaphors.
    2. **Melodic & Phonetic Flow**: Rhythm, rhyme quality, singability (open vowels).
    3. **Emotional Impact**: Does it make the listener feel something?
    4. **Structure & Pacing**: Is the journey clear? Good contrast between sections?
    5. **Commercial Potential**: Hookiness, radio-viability (or niche appeal).
    6. **Thematic Cohesion**: Does the furniture/metaphor stay consistent?

    ### SECTION 1: CREATIVE AUDIT
    1. **Score (0-100):** Rate it based on the categories above. ${isRevision ? "If it's a good rewrite, the score should be higher than the original." : ""}
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
    
    ### SECTION 3: REWRITE ADVICE
    Should the next version use "Advanced Lyric Logic" (strict formatting) or "Metaphor Logic" (one central object)? Suggest yes/no and why.

    ### SECTION 4: SONG DNA MATCH (Real-World Hit Comparison)
    **YOUR TASK:** Find the ONE real-world hit song that most closely matches this song's vibe, structure, mood, and lyrical approach.
    
    **CRITERIA FOR MATCHING:**
    - Must be a commercially successful, critically acclaimed song (Billboard charting, Grammy-nominated, or culturally significant)
    - Similar emotional trajectory and pacing
    - Similar structural approach (verse/chorus length, bridge placement, repetition patterns)
    - Similar lyrical style (direct vs. metaphorical, narrative vs. impressionistic, wordy vs. sparse)
    - Similar genre/vibe
    
    **PROVIDE DETAILED COMPARISON:**
    1. **Match Score (0-100):** How similar is this song to the reference?
    2. **Why They Match:** Break down the similarities across:
       - Overall vibe/energy
       - Song structure and pacing
       - Lyrical approach and wordplay style
       - Emotional resonance and arc
       - Pacing and word density
    
    3. **What The Reference Does BETTER (A-Tier Techniques):**
       - **Structural:** How the reference song builds sections, uses repetition, creates hooks
       - **Word Spacing/Phrasing:** How they pace syllables, use breath marks, create singable melodies with word choice
       - **Metaphorical Depth:** How they layer meaning or use concrete imagery
       - **Narrative Arc:** How they tell the story or develop the theme
       - **Sonic Choices:** Phonetic patterns, rhyme schemes, vowel choices for belting
    
    4. **Credibility Factors:** Why is this reference song a proven hit? (Chart performance, cultural impact, critical acclaim, longevity)
    
    **EXAMPLES OF GOOD MATCHES:**
    - If this song has sparse, emotional verses with repetitive hooks → "Someone Like You" by Adele
    - If this song uses detailed storytelling with country imagery → "The House That Built Me" by Miranda Lambert
    - If this song has rhythmic wordplay with modern production cues → "Bad Guy" by Billie Eilish
    - If this song is nostalgic and uses simple, concrete imagery → "Photograph" by Ed Sheeran
    
    **BE SPECIFIC:** Don't just say "they both sound sad." Explain EXACTLY how the reference song structures its verses, how it spaces words for singing, what metaphorical devices it uses, etc.

    Provide a breakdown of why the score is what it is, and what the score WOULD be if the user applies your improvements.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", 
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: SONG_ANALYSIS_SCHEMA,
      systemInstruction: "You are a strict, high-standard music critic and audio engineer. Do not sugarcoat. Be specific. Use the 6 Fixed Scoring Categories.",
      temperature: 0.8,
      thinkingConfig: { thinkingBudget: 2048 } 
    }
  });

  if (!response.text) throw new Error("Deep Analysis failed");
  const baseAnalysis = JSON.parse(response.text) as SongAnalysis;
  
  // ============================================================
  // 🎭 5-AGENT SPECIALIZED ANALYSIS (Phase 3)
  // ============================================================
  if (onProgress) onProgress('5-agent-analysis');
  console.log('🎭 Starting 5-agent specialized analysis...');
  
  const { run5AgentAnalysis } = await import('./agentDebateService');
  const { 
    calculateHookFactor, 
    calculateVocalPlayability, 
    calculateImagerySensory, 
    calculateNarrativeArc 
  } = await import('./scoringService');
  
  // Calculate programmatic scores first (used by agents for context)
  const hookFactorResult = calculateHookFactor(song.lyrics, song.title);
  const vocalPlayabilityResult = calculateVocalPlayability(song.lyrics, song.stylePrompt.split(',')[0] || 'pop');
  const imagerySensoryResult = calculateImagerySensory(song.lyrics);
  const narrativeArcResult = calculateNarrativeArc(song.lyrics);
  
  const programmaticScores = {
    hookFactor: hookFactorResult,
    vocalPlayability: vocalPlayabilityResult,
    imagerySensory: imagerySensoryResult,
    narrativeArc: narrativeArcResult
  };
  
  // Extract inputs from song context
  const inputs = {
    genre: song.stylePrompt.split(',')[0] || 'pop',
    mood: song.stylePrompt,
    topic: song.title,
    title: song.title
  };
  
  // Run 5-agent parallel analysis with progress updates
  const agentAnalysis = await run5AgentAnalysis(
    song,
    inputs,
    programmaticScores,
    baseAnalysis.sonicAnalysis,
    (agent, completed, total) => {
      if (onProgress) onProgress('agent-progress', agent);
    }
  );
  
  console.log('✅ 5-agent analysis complete');
  console.log('📊 Overall Score:', agentAnalysis.overallScore);
  console.log('💪 Consensus Strengths:', agentAnalysis.consensusStrengths.slice(0, 3).join(', '));
  console.log('⚠️  Consensus Weaknesses:', agentAnalysis.consensusWeaknesses.slice(0, 3).join(', '));
  
  // Log debates if they occurred
  if (agentAnalysis.agentDebates && agentAnalysis.agentDebates.length > 0) {
    console.log('🎭 Agent Debates:', agentAnalysis.agentDebates.length);
    agentAnalysis.agentDebates.forEach(debate => {
      console.log(`  - ${debate.issue}: ${debate.resolution.decision}`);
    });
  }
  
  // Merge base analysis with 5-agent scoring
  const analysis: SongAnalysis = {
    ...baseAnalysis,
    scoreBreakdown: agentAnalysis.scoreBreakdown, // Replace with 10-category agent scoring
    overallScore: agentAnalysis.overallScore,
    // Store programmatic scores for UI comparison
    programmaticScores: {
      hookFactor: hookFactorResult,
      vocalPlayability: vocalPlayabilityResult,
      imagerySensory: imagerySensoryResult,
      narrativeArc: narrativeArcResult
    },
    // Enhance strengths/weaknesses with agent consensus
    strengths: [
      ...baseAnalysis.strengths,
      ...agentAnalysis.consensusStrengths.slice(0, 2)
    ].slice(0, 5),
    weaknesses: [
      ...baseAnalysis.weaknesses,
      ...agentAnalysis.consensusWeaknesses.slice(0, 2)
    ].slice(0, 5)
  };
  
  // Log detailed breakdown
  console.log('\n📋 SCORE BREAKDOWN (All 10 Categories):');
  agentAnalysis.scoreBreakdown.forEach(score => {
    console.log(`  ${score.category}: ${score.score}/10 [${score.agent}]`);
  });
  
  // Track cost for analysis
  trackAnalysis(song.id, song.title);
  
  return { analysis, agentDebates: agentAnalysis.agentDebates };
};

export const rewriteSongWithImprovements = async (
  song: GeneratedSong, 
  useAdvancedLogic: boolean, 
  useMetaphorLogic: boolean,
  useCommercialMode: boolean
): Promise<GeneratedSong> => {
  if (!song.analysis) throw new Error("Analysis required before rewriting");

  // Build comprehensive context from analysis
  const currentScoreByCategory = song.analysis.scoreBreakdown.reduce((acc, item) => {
    acc[item.category] = item.score;
    return acc;
  }, {} as Record<string, number>);

  const phoneticIssues = song.analysis.sonicAnalysis?.phonetics || "No phonetic issues identified";
  const densityIssues = song.analysis.sonicAnalysis?.density || "No density issues identified";
  const currentObjects = song.analysis.sonicAnalysis?.cinemaAudit?.objects || [];
  const weaknesses = song.analysis.weaknesses || [];
  
  const prompt = `
    You are a professional songwriter executing a systematic rewrite to improve a song.
    
    **CURRENT STATE:**
    Title: ${song.title}
    Current Overall Score: ${song.analysis.overallScore}/100
    Projected Score After Fixes: ${song.analysis.projectedScore}/100
    
    **SCORE BREAKDOWN (Current):**
    ${song.analysis.scoreBreakdown.map(s => `- ${s.category}: ${s.score}/10 (${s.reason})`).join('\n')}
    
    **IDENTIFIED WEAKNESSES:**
    ${weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}
    
    **SONIC ANALYSIS:**
    Phonetic Issues: ${phoneticIssues}
    Density Issues: ${densityIssues}
    Current Objects/Furniture: ${currentObjects.length} items (${currentObjects.join(', ')})
    Cinema Score: ${song.analysis.sonicAnalysis?.cinemaAudit?.score || 'N/A'}
    
    **LINE-BY-LINE CRITIQUE:**
    ${song.analysis.lineByLineImprovements.map((imp, i) => 
      `${i + 1}. "${imp.original}" → "${imp.improved}"\n   Reason: ${imp.reason}`
    ).join('\n\n')}
    
    **ORIGINAL LYRICS:**
    ${song.lyrics}
    
    ---
    
    **YOUR TASK - SYSTEMATIC REWRITE:**
    
    **PHASE 1: CREATE EXECUTION PLAN**
    Before rewriting, you must:
    1. Set a realistic TARGET SCORE (must be ≥ ${song.analysis.projectedScore})
    2. For EACH of the 6 categories, specify:
       - Current score
       - Target score (realistic improvement)
       - Specific strategy to achieve it
    3. Map out SPECIFIC LINE CHANGES with:
       - Line number
       - Original line
       - New line
       - Reason for change
       - Which category it improves
    4. List PHONETIC FIXES (e.g., "Change chorus ending from 'me' to 'day' for open vowel")
    5. List NEW FURNITURE/OBJECTS you're adding (must add 2-4 concrete objects if Cinema Score is low)
    
    **PHASE 2: EXECUTE THE REWRITE**
    Now implement your plan:
    - Apply EVERY line change you specified
    - Fix EVERY phonetic issue you identified
    - Add EVERY furniture item you planned
    - Ensure the new lyrics follow this structure
    
    **MANDATORY REWRITE RULES:**
    1. **Fix SPECIFIC Issues:** Every weakness must be addressed with a concrete change
    2. **Rhyme Check:** NEVER rhyme a word with itself. Use synonyms or change structure
    3. **Cliché Elimination:** If analysis called it a cliché, REMOVE IT COMPLETELY
    4. **Phonetic Requirements:** 
       - Chorus lines should end on open vowels (A, O, I sounds)
       - High-energy sections need plosives (P, K, T, B, D)
    5. **Furniture Requirement:** Add at least 2 new concrete objects if Cinema Score < 7
    6. **Score Improvement:** Target score MUST be higher than current (${song.analysis.overallScore})
    
    ${generateFeatureIntegrationInstructions(useCommercialMode, useAdvancedLogic, useMetaphorLogic)}
    
    **VALIDATION CHECKLIST (You MUST verify):**
    □ Every identified weakness has been addressed
    □ All phonetic issues fixed (check chorus vowels)
    □ Furniture count increased by at least 2 objects
    □ No self-rhymes remain
    □ All clichés removed
    □ Target score is achievable based on changes
    □ Line-level changes match the execution plan
    
    **CRITICAL:** Your execution plan must be SPECIFIC and MEASURABLE. Don't say "improve imagery" - say "Add 3 concrete objects: coffee cup, window frame, torn photograph."
  `;

  // Adaptive Routing: Use Flash for most rewrites (execution of existing plan),
  // upgrade to Pro + Deep Think only for struggling songs (score < 6.0)
  const overallScore = song.analysis.overallScore;
  const useProModel = overallScore < 6.0;
  
  console.log(`🎯 Rewrite routing: score=${overallScore}, model=${useProModel ? 'Pro+DeepThink' : 'Flash 2.5'}`);

  const response = await ai.models.generateContent({
    model: useProModel ? "gemini-3-pro-preview" : "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: REWRITE_SCHEMA,
      systemInstruction: `You are an elite songwriter with a systematic approach. You MUST create a detailed execution plan before rewriting. Every change must be justified and measurable. You are allergic to lazy rhymes and clichés. Your rewrites ALWAYS improve scores.`,
      temperature: 0.75, // Lower temp for more systematic execution
      thinkingConfig: useProModel ? { thinkingBudget: 4096 } : undefined // Deep Think only for struggling songs
    }
  });

  if (!response.text) throw new Error("Rewrite failed");
  const result = JSON.parse(response.text);
  
  console.log('📋 REWRITE EXECUTION PLAN:', JSON.stringify(result.executionPlan, null, 2));
  
  // Track cost for rewrite
  trackRewrite(song.id, song.title, useProModel);
  
  return {
    ...song,
    lyrics: result.lyrics,
    technicalExplanation: result.changesSummary || result.technicalExplanation,
    hasAdvancedLogic: useAdvancedLogic,
    hasMetaphorLogic: useMetaphorLogic,
    hasCommercialMode: useCommercialMode,
    // Store the execution plan for validation
    executionPlan: result.executionPlan
  };
};

export const evaluateLineChange = async (originalLine: string, newLine: string, context: string): Promise<EvaluationResult> => {
  const prompt = `
    Evaluate this specific lyric change for a song with context: "${context}".

    Original: "${originalLine}"
    New: "${newLine}"

    Task:
    1. Did the edit improve the song? (Better / Worse / Neutral)
    2. Why? (e.g. "Removed cliché", "Better rhythm", "Lost meaning")
    3. Estimated Score Impact (-5 to +5)
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: EVALUATION_SCHEMA,
      temperature: 0.3
    }
  });

  if (!response.text) throw new Error("Evaluation failed");
  return JSON.parse(response.text) as EvaluationResult;
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
  
  // Track cost for variations
  trackVariation(song.id, song.title);
  
  return result.variations;
};

// NEW: Generate comprehensive rewrite plan that incorporates DNA Match insights
export const generateRewritePlan = async (
  song: GeneratedSong,
  useAdvancedLogic: boolean,
  useMetaphorLogic: boolean,
  useCommercialMode: boolean,
  chatInsights?: string[] // Key points from user-agent discussion
): Promise<RewritePlanProposal> => {
  if (!song.analysis) throw new Error("Analysis required before creating rewrite plan");
  
  // STEP 1: Run comprehensive workflow validation
  const workflowState = validateCompleteWorkflow(song);
  const { warnings } = await generateValidatedPlan(song, workflowState, chatInsights);
  
  // Build validation context for the AI
  const validationContext = `
    **⚙️ WORKFLOW VALIDATION COMPLETE**
    Overall Coherence Score: ${Math.round(workflowState.overallCoherence)}%
    
    **📊 METRIC RELATIONSHIPS (${workflowState.validations.length} analyzed):**
    ${workflowState.validations
      .sort((a, b) => b.valueAddedToOutput - a.valueAddedToOutput)
      .slice(0, 10) // Top 10 most important
      .map(v => `
      • ${v.metric1} ↔ ${v.metric2}
        Relationship: ${v.relationship.toUpperCase()}
        Impact: ${v.impact} (Value: ${v.valueAddedToOutput}/100)
        ${v.explanation}
        ${v.resolutionStrategy ? `→ Strategy: ${v.resolutionStrategy}` : ''}
        ${v.question ? `❓ Question: ${v.question}` : ''}
      `).join('\n')}
    
    **⚠️ CONFLICTS DETECTED (${workflowState.conflicts.length}):**
    ${workflowState.conflicts.map(c => `
      [${c.severity.toUpperCase()}] ${c.description}
      Affects: ${c.affectedMetrics.join(', ')}
      Resolution: ${c.suggestedResolution}
      ${c.question ? `❓ ${c.question}` : ''}
    `).join('\n')}
    
    **💡 STRATEGIC RECOMMENDATIONS:**
    ${workflowState.recommendations.map(r => `• ${r}`).join('\n')}
    
    **🎯 HIGH-VALUE OPPORTUNITIES (80+ value score):**
    ${workflowState.validations
      .filter(v => v.valueAddedToOutput >= 80)
      .map(v => `• ${v.metric1} → ${v.explanation}`)
      .join('\n')}
    
    ${warnings.length > 0 ? `
    **⛔ CRITICAL WARNINGS:**
    ${warnings.map(w => `• ${w}`).join('\n')}
    ` : ''}
  `;
  
  const dnaMatchContext = song.analysis.dnaMatch ? `
    **A-TIER REFERENCE SONG: "${song.analysis.dnaMatch.referenceSong}" by ${song.analysis.dnaMatch.artist}**
    Match Score: ${song.analysis.dnaMatch.matchScore}%
    
    **WHY THIS IS A-TIER:**
    ${song.analysis.dnaMatch.whatTheyDidBetter}
    
    **PROVEN TECHNIQUES FROM THIS HIT:**
    
    STRUCTURAL:
    ${song.analysis.dnaMatch.improvements.structural.map((s, i) => `${i + 1}. ${s}`).join('\n')}
    
    WORD SPACING/PHRASING:
    ${song.analysis.dnaMatch.improvements.wordSpacing.map((s, i) => `${i + 1}. ${s}`).join('\n')}
    
    METAPHORICAL:
    ${song.analysis.dnaMatch.improvements.metaphorical.map((s, i) => `${i + 1}. ${s}`).join('\n')}
    
    NARRATIVE:
    ${song.analysis.dnaMatch.improvements.narrative.map((s, i) => `${i + 1}. ${s}`).join('\n')}
    
    SONIC/PHONETIC:
    ${song.analysis.dnaMatch.improvements.sonic.map((s, i) => `${i + 1}. ${s}`).join('\n')}
    
    **YOUR TASK:** Identify which techniques from this A-tier song can be applied to improve the current song. Be specific about HOW you'll adapt them.
  ` : '';

  const chatContext = chatInsights && chatInsights.length > 0 ? `
    **USER DISCUSSION INSIGHTS:**
    The user and the analysis agent have discussed the following key points:
    ${chatInsights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}
    
    These insights must be incorporated into your rewrite plan.
  ` : '';

  const prompt = `
    You are creating a COMPREHENSIVE REWRITE PLAN that the user must review and approve before execution.
    
    ${validationContext}
    
    ---
    
    **CURRENT SONG STATE:**
    Title: ${song.title}
    Current Score: ${song.analysis.overallScore}/100
    Projected Score: ${song.analysis.projectedScore}/100
    
    **ANALYSIS DATA:**
    Weaknesses: ${song.analysis.weaknesses.join('; ')}
    Phonetic Issues: ${song.analysis.sonicAnalysis.phonetics}
    Density Issues: ${song.analysis.sonicAnalysis.density}
    Cinema Score: ${song.analysis.sonicAnalysis.cinemaAudit.score} (${song.analysis.sonicAnalysis.cinemaAudit.objectCount} objects)
    
    **LINE-BY-LINE IMPROVEMENTS:**
    ${song.analysis.lineByLineImprovements.map((imp, i) => 
      `Line ${i + 1}: "${imp.original}" → "${imp.improved}"\nReason: ${imp.reason}`
    ).join('\n\n')}
    
    ${dnaMatchContext}
    
    ${chatContext}
    
    **ORIGINAL LYRICS:**
    ${song.lyrics}
    
    ---
    
    **YOUR TASK:**
    Create a detailed, transparent rewrite plan that shows:
    
    1. **TARGET SCORE** - Realistic goal based on validation analysis above
    
    2. **CATEGORY IMPROVEMENTS** - For each of the 6 scoring categories:
       - Current score
       - Target score
       - Strategy to improve (MUST address validation conflicts if any exist)
       - **DNA INSIGHT APPLIED** (if applicable) - Specifically state which A-tier technique you're applying
    
    3. **LINE-LEVEL CHANGES** - Comprehensive list:
       - Line number
       - Original line
       - Proposed new line
       - Reason for change
       - Category improved
       - **SOURCE ANALYSIS** - What drove this change? Options: LineByLine, Phonetic, DNAMatch, ChatAgent, Density
    
    4. **PHONETIC FIXES** - List all phonetic improvements
    
    5. **FURNITURE ADDITIONS** - New concrete objects being added
    
    6. **DNA MATCH INSIGHTS** (if applicable) - Explicitly state which techniques from the A-tier song you're applying:
       - Structural lessons applied
       - Word spacing/phrasing lessons applied
       - Metaphorical techniques applied
       - Narrative techniques applied
       - Sonic patterns applied
    
    7. **CHAT AGENT NOTES** (if applicable) - Key insights from user discussion that shaped this plan
    
    8. **RATIONALE** - Overall explanation of why this plan will work
    
    9. **EXPECTED IMPACT** - Predicted improvements and why
    
    ${generateFeatureIntegrationInstructions(useCommercialMode, useAdvancedLogic, useMetaphorLogic)}
    
    **CRITICAL REQUIREMENTS:**
    - **RESOLVE ALL CONFLICTS**: You saw the validation conflicts above. Your plan MUST address each one explicitly
    - **PRIORITIZE HIGH-VALUE METRICS**: Focus on the metrics with 80+ value scores - they're proven to work together
    - **EXPLAIN TRADE-OFFS**: If you have to override one metric for another, explain WHY with evidence
    - Be TRANSPARENT about what analysis data drives each decision
    - If using DNA Match insights, explain HOW you're adapting the A-tier technique (not just copying)
    - Every line change must trace back to a specific analysis finding AND show which validation it addresses
    - The plan must be detailed enough that the user can evaluate if it makes sense
    - Don't say "improve metaphor" - say "Add central anchor object: 'steering wheel' (inspired by Ed Sheeran's 'Photograph' which uses 'photographs' as concrete anchor) - ADDRESSES: Validation showing Cinema Audit needs more objects"
    - If validation shows a conflict (e.g., phonetics says slow down but density says add more), explicitly state your resolution strategy
  `;

  const PLAN_SCHEMA: Schema = {
    type: Type.OBJECT,
    properties: {
      executionPlan: {
        type: Type.OBJECT,
        properties: {
          targetScore: { type: Type.NUMBER },
          scoreImprovementsByCategory: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                currentScore: { type: Type.NUMBER },
                targetScore: { type: Type.NUMBER },
                strategy: { type: Type.STRING },
                dnaInsightApplied: { type: Type.STRING, description: "How A-tier song technique influences this" }
              },
              required: ["category", "currentScore", "targetScore", "strategy"]
            }
          },
          lineLevelChanges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                lineNumber: { type: Type.NUMBER },
                originalLine: { type: Type.STRING },
                newLine: { type: Type.STRING },
                reason: { type: Type.STRING },
                categoryImproved: { type: Type.STRING },
                sourceAnalysis: { 
                  type: Type.STRING, 
                  enum: ['LineByLine', 'Phonetic', 'DNAMatch', 'ChatAgent', 'Density'],
                  description: "What analysis drove this change"
                }
              },
              required: ["lineNumber", "originalLine", "newLine", "reason", "categoryImproved", "sourceAnalysis"]
            }
          },
          phoneticFixes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                issue: { type: Type.STRING },
                fix: { type: Type.STRING }
              }
            }
          },
          furnitureAdditions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          dnaMatchInsights: {
            type: Type.OBJECT,
            properties: {
              structural: { type: Type.ARRAY, items: { type: Type.STRING } },
              wordSpacing: { type: Type.ARRAY, items: { type: Type.STRING } },
              metaphorical: { type: Type.ARRAY, items: { type: Type.STRING } },
              narrative: { type: Type.ARRAY, items: { type: Type.STRING } },
              sonic: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          chatAgentNotes: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["targetScore", "scoreImprovementsByCategory", "lineLevelChanges"]
      },
      rationale: { type: Type.STRING, description: "Why this plan addresses all concerns" },
      expectedImpact: { type: Type.STRING, description: "Predicted improvements" }
    },
    required: ["executionPlan", "rationale", "expectedImpact"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: PLAN_SCHEMA,
      systemInstruction: `You are a transparent, systematic music producer creating a detailed rewrite plan. You must trace every decision back to analysis data. You are NOT a "yes man" - if something doesn't make sense, explain why. Be specific and measurable.`,
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 8192 } // Maximum thinking time for comprehensive planning
    }
  });

  if (!response.text) throw new Error("Plan generation failed");
  const result = JSON.parse(response.text);
  
  return {
    id: `plan-${Date.now()}`,
    executionPlan: result.executionPlan,
    rationale: result.rationale,
    expectedImpact: result.expectedImpact,
    basedOn: {
      originalAnalysis: true,
      dnaMatchInsights: !!song.analysis.dnaMatch,
      chatDiscussion: !!chatInsights && chatInsights.length > 0,
      userEdits: false // Will be updated if user modifies the plan
    },
    status: 'proposed',
    workflowValidation: {
      coherenceScore: workflowState.overallCoherence,
      conflictsResolved: workflowState.conflicts.filter(c => c.severity !== 'blocking').length,
      totalConflicts: workflowState.conflicts.length,
      warnings
    }
  };
};

// NEW: Deep Analysis Chat Agent
export const chatWithAnalysisAgent = async (
  song: GeneratedSong,
  userMessage: string,
  chatHistory: ChatMessage[],
  highlightedText?: string,
  context?: 'score' | 'lyrics' | 'sonic' | 'dnaMatch' | 'general'
): Promise<string> => {
  if (!song.analysis) throw new Error("Analysis required for chat");

  // Build comprehensive context
  const analysisContext = `
**CURRENT SONG ANALYSIS:**
Title: ${song.title}
Overall Score: ${song.analysis.overallScore}/100
Projected Score: ${song.analysis.projectedScore}/100

**FULL LYRICS:**
${song.lyrics}

**SCORE BREAKDOWN:**
${song.analysis.scoreBreakdown.map(s => `${s.category}: ${s.score}/10 - ${s.reason}`).join('\n')}

**STRENGTHS:**
${song.analysis.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**WEAKNESSES:**
${song.analysis.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

**SONIC ANALYSIS:**
Phonetics: ${song.analysis.sonicAnalysis.phonetics}
Density: ${song.analysis.sonicAnalysis.density}
Cinema Audit: ${song.analysis.sonicAnalysis.cinemaAudit.score} (${song.analysis.sonicAnalysis.cinemaAudit.objectCount} objects: ${song.analysis.sonicAnalysis.cinemaAudit.objects.join(', ')})

**LINE-BY-LINE IMPROVEMENTS:**
${song.analysis.lineByLineImprovements.slice(0, 5).map((imp, i) => 
  `${i + 1}. "${imp.original}" → "${imp.improved}" (${imp.reason})`
).join('\n')}
${song.analysis.lineByLineImprovements.length > 5 ? `...and ${song.analysis.lineByLineImprovements.length - 5} more` : ''}
  `;

  const dnaContext = song.analysis.dnaMatch ? `
**A-TIER REFERENCE MATCH:**
Song: "${song.analysis.dnaMatch.referenceSong}" by ${song.analysis.dnaMatch.artist}
Match Score: ${song.analysis.dnaMatch.matchScore}%
Why A-Tier: ${song.analysis.dnaMatch.whatTheyDidBetter}

Key Lessons:
- Structural: ${song.analysis.dnaMatch.improvements.structural.join('; ')}
- Word Spacing: ${song.analysis.dnaMatch.improvements.wordSpacing.join('; ')}
- Metaphorical: ${song.analysis.dnaMatch.improvements.metaphorical.join('; ')}
- Narrative: ${song.analysis.dnaMatch.improvements.narrative.join('; ')}
- Sonic: ${song.analysis.dnaMatch.improvements.sonic.join('; ')}
  ` : '';

  const conversationHistory = chatHistory.length > 0 ? `
**CONVERSATION HISTORY:**
${chatHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n')}
  ` : '';

  const highlightContext = highlightedText ? `
**USER HIGHLIGHTED TEXT:**
"${highlightedText}"
Context: ${context || 'general'}
  ` : '';

  const prompt = `
You are an expert music analysis agent embedded in the Deep Analysis tab. Your role is to:

1. **Understand the complete analysis** (scores, sonic issues, DNA match insights, etc.)
2. **Engage with the user** about their concerns, observations, and suggestions
3. **Be HONEST and LOGICAL** - You are NOT a "yes man". If the user suggests something that contradicts good songwriting principles or the analysis data, explain WHY
4. **Provide evidence-based reasoning** - Reference specific scores, sonic analysis, DNA match insights
5. **Help refine the rewrite plan** - Extract key insights that should inform the rewrite

**CRITICAL RULES:**
- If the user is right, acknowledge it and build on their insight
- If the user is wrong or their suggestion would hurt the song, RESPECTFULLY explain why with evidence
- Reference specific analysis data in your responses
- If discussing DNA match insights, explain how to ADAPT (not copy) the technique
- Stay focused on improving THIS song, not general music theory lectures
- Be conversational but professional

${analysisContext}

${dnaContext}

${conversationHistory}

${highlightContext}

**USER MESSAGE:**
${userMessage}

**YOUR RESPONSE:**
Engage with the user's point thoughtfully. Agree or disagree with reasoning. If this is an important insight for the rewrite, note that explicitly (e.g., "This is a key point - I'll flag this for the rewrite plan").
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: `You are an honest, evidence-based music analysis agent. You engage thoughtfully with user feedback. You are NOT a yes-man - you respectfully challenge ideas that don't align with the analysis or songwriting best practices. You reference specific data points to support your reasoning.`,
      temperature: 0.8
    }
  });

  if (!response.text) throw new Error("Chat response failed");
  return response.text;
};
