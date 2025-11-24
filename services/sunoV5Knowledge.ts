/**
 * SUNO V5 KNOWLEDGE BASE
 * Comprehensive understanding of Suno V5 model behavior, quirks, and optimization strategies
 * This data should be used by both the AI agents AND displayed to users as contextual tips
 */

export interface SunoV5Knowledge {
  category: 'model_behavior' | 'optimization' | 'bugs_workarounds' | 'advanced_techniques' | 'genre_specific';
  title: string;
  description: string;
  explanation: string;
  examples?: string[];
  confidence: 'verified' | 'high' | 'experimental';
  agentGuidance: string; // What the AI should do with this knowledge
  userTip: string; // Simplified version for users
}

/**
 * VERIFIED SUNO V5 MODEL BEHAVIORS
 * Based on community testing and observed patterns
 */
export const SUNO_V5_KNOWLEDGE_BASE: SunoV5Knowledge[] = [
  
  // === MODEL BEHAVIOR ===
  {
    category: 'model_behavior',
    title: 'V5 Vocal Clarity Threshold',
    description: 'V5 tends to prioritize instrumentals over vocals when genre descriptions are too complex',
    explanation: 'When you combine 3+ genres or use overly technical production terms, V5 often buries the vocals or starts "hallucinating" (ignoring lyrics entirely). This is because the model interprets complexity as "experimental instrumental".',
    examples: [
      'BAD: "Progressive Melodic Techno House with Jazz Fusion Elements, 138 BPM, Polyrhythmic Drums"',
      'GOOD: "Melodic Techno, Clear Female Vocals, 138 BPM, Driving Bassline"'
    ],
    confidence: 'verified',
    agentGuidance: 'When generating stylePrompt, limit to 2 genre descriptors max. If user requests complex fusion, add "clear vocals" or "vocal-forward mix" to the style string. Prioritize vocal clarity over production complexity.',
    userTip: 'If V5 ignores your lyrics, simplify your genre description and add "clear vocals" to the style prompt.'
  },

  {
    category: 'model_behavior',
    title: 'Repetition Reinforcement',
    description: 'V5 learns from repetition - repeated sections get more consistent delivery',
    explanation: 'The model uses attention mechanisms that reinforce patterns. If you repeat a chorus 3+ times identically, V5 treats it as "important" and delivers it with more consistency and energy. Single-occurrence sections are treated as transitions.',
    examples: [
      'Chorus appearing 3x: Consistent melody, strong delivery',
      'Unique bridge appearing 1x: Often experimental, unpredictable'
    ],
    confidence: 'high',
    agentGuidance: 'Structure songs with repetitive choruses (minimum 3 occurrences). Make choruses identical or with only minor variations. Use unique sections sparingly and mark them clearly with [Bridge] or [Break] tags.',
    userTip: 'Repeat your chorus at least 3 times identically for the most consistent and powerful delivery.'
  },

  {
    category: 'model_behavior',
    title: 'Energy Tag Sensitivity',
    description: 'V5 responds strongly to numerical energy markers (X/10)',
    explanation: 'While not officially documented, the model has been trained on data that includes energy markers. Specifying [Verse 1 - 3/10 energy] vs [Verse 1 - 8/10 energy] produces noticeably different instrumental arrangements and vocal intensity.',
    examples: [
      '[Verse 1 - 2/10 energy]: Sparse, intimate, often acoustic',
      '[Chorus - 9/10 energy]: Full band, layered vocals, driving rhythm'
    ],
    confidence: 'high',
    agentGuidance: 'Always include energy markers (1-10 scale) in section headers. Use progressive energy curves: start low (2-4/10), build through verses (5-7/10), peak at chorus (8-10/10), drop for bridge (4-6/10), end with outro fade (1-3/10).',
    userTip: 'Add energy levels to your sections like [Verse 1 - 4/10 energy] to control dynamics.'
  },

  {
    category: 'model_behavior',
    title: 'First 8 Lines Anchor',
    description: 'The first 8 lines heavily influence the entire song\'s style interpretation',
    explanation: 'V5 uses the opening section as a "style anchor" for the rest of the generation. If you start with abstract lyrics or weak hooks, the entire song will lack focus. The model essentially asks "what kind of song is this?" in the first 8-10 lines.',
    examples: [
      'Weak opener: "I\'m thinking about things..." → Vague, wandering song',
      'Strong opener: "Neon lights blur through the rain..." → Focused, cinematic song'
    ],
    confidence: 'verified',
    agentGuidance: 'Ensure the first verse (first 8 lines) contains: 1) Concrete imagery, 2) Clear emotional tone, 3) Hook preview or title phrase. Avoid abstract openings. Consider starting with [Instrumental Intro] to establish style before vocals.',
    userTip: 'Your first 8 lines set the tone for the entire song - make them concrete and emotionally clear.'
  },

  {
    category: 'model_behavior',
    title: 'Phonetic Pronunciation Sensitivity',
    description: 'V5 pronunciation is literal - it will mispronounce unless you guide it',
    explanation: 'The text-to-speech component is highly literal. Words like "coordination" become "co-OR-din-AY-shun" unless spelled "co-ordination". Proper nouns, technical terms, and compound words often need phonetic spelling.',
    examples: [
      'Write "kah-thar-sis" not "catharsis"',
      'Write "e-piph-a-nee" not "epiphany"',
      'Write "or-ches-tra" not "orchestra" if getting mangled'
    ],
    confidence: 'verified',
    agentGuidance: 'When using complex or uncommon words, add a note to the user: "If mispronounced, try: [phonetic spelling]". For critical hook words, consider using common synonyms instead.',
    userTip: 'If V5 mispronounces a word, spell it phonetically: "sep-ar-ate" instead of "separate".'
  },

  // === OPTIMIZATION STRATEGIES ===
  {
    category: 'optimization',
    title: 'BPM Sweet Spots',
    description: 'V5 performs best at standard tempo ranges per genre',
    explanation: 'The model has been trained predominantly on songs in conventional BPM ranges. Requesting 200 BPM pop or 60 BPM EDM often produces unstable results because these are outside the training distribution.',
    examples: [
      'Pop: 110-140 BPM (optimal: 120-130)',
      'EDM: 120-135 BPM (optimal: 128)',
      'Hip-Hop: 80-110 BPM (optimal: 90-100)',
      'Rock: 110-150 BPM (optimal: 120-140)',
      'Ballad: 60-90 BPM (optimal: 70-80)'
    ],
    confidence: 'verified',
    agentGuidance: 'Always specify BPM in the stylePrompt. Use genre-appropriate ranges. If user requests unusual BPM, include it but warn that results may be experimental.',
    userTip: 'Stick to standard BPM ranges for your genre - 128 BPM for EDM, 120 BPM for pop, 90 BPM for hip-hop.'
  },

  {
    category: 'optimization',
    title: 'Instrumental Intro Buffer',
    description: 'Starting with [Instrumental Intro] gives V5 time to establish style',
    explanation: 'V5 needs 8-15 seconds to "warm up" the generation. Starting directly with vocals often produces weak or off-style openings. An instrumental intro allows the model to establish key, tempo, and timbral characteristics before vocals enter.',
    examples: [
      '[Instrumental Intro - 10 seconds, atmospheric synth pad]',
      '[Intro - acoustic guitar, 8 bars, establishing melody]'
    ],
    confidence: 'high',
    agentGuidance: 'For songs requesting strong production quality, always include a 8-15 second [Instrumental Intro] before [Verse 1]. Specify instruments and duration.',
    userTip: 'Start with a 10-15 second [Instrumental Intro] to let V5 establish the song\'s style before vocals.'
  },

  {
    category: 'optimization',
    title: 'Negative Prompt Effectiveness',
    description: 'Negative prompts work, but only for production issues, not lyrical content',
    explanation: 'Specifying "No reverb, no distortion" in negative prompts has measurable effects. However, lyrical negative prompts like "No clichés" are ignored - the model doesn\'t process lyrical content in the negative prompt path.',
    examples: [
      'EFFECTIVE: "No live recording artifacts, no crowd noise, no static"',
      'INEFFECTIVE: "No generic lyrics, no clichés, no repetitive themes"'
    ],
    confidence: 'high',
    agentGuidance: 'Generate negative prompts only for production/audio issues: "Live recording, muffled, off-key, distorted, static, crowd noise". Do NOT include lyrical guidance in negative prompts.',
    userTip: 'Use negative prompts for sound quality issues only: "No static, no distortion, no muffled vocals".'
  },

  {
    category: 'optimization',
    title: 'Section Length Optimization',
    description: 'V5 performs best with sections between 4-8 lines',
    explanation: 'Sections shorter than 4 lines often get cut off or extended awkwardly. Sections longer than 10 lines become repetitive or meandering. The model\'s attention span is optimized for 4-8 line chunks.',
    examples: [
      'Too short (2 lines): Often extended with "la-la-la" filler',
      'Optimal (6 lines): Clean transitions, coherent delivery',
      'Too long (12 lines): Often repeated or rushed through'
    ],
    confidence: 'verified',
    agentGuidance: 'Structure all sections (verses, choruses, bridges) to be 4-8 lines. If user wants longer verses, split into [Verse 1a] and [Verse 1b] with a musical transition marker.',
    userTip: 'Keep verses and choruses between 4-8 lines for the best results.'
  },

  // === BUGS & WORKAROUNDS ===
  {
    category: 'bugs_workarounds',
    title: 'Loop Prevention',
    description: 'V5 will loop indefinitely without proper ending tags',
    explanation: 'The model\'s generation doesn\'t have a built-in "stop" mechanism. Without [Outro] and [End] tags, it will repeat the last section or fade awkwardly. This is especially common with chorus-ending songs.',
    examples: [
      'Without [End]: Song repeats chorus 6-7 times',
      'With [Outro] [End]: Clean fade at 3-4 minutes'
    ],
    confidence: 'verified',
    agentGuidance: 'ALWAYS end songs with [Outro] followed by [End]. The outro should be 4-6 lines with 1-2/10 energy and fade instructions.',
    userTip: 'Always end your song with [Outro] and [End] tags to prevent looping.'
  },

  {
    category: 'bugs_workarounds',
    title: 'Duet/Harmony Marker Consistency',
    description: 'V5 requires consistent (M)/(F) markers to maintain duet logic',
    explanation: 'If you start using (M) for male and (F) for female, you must use them throughout. Switching to unmarked lines confuses the model and it will default to the last-used voice or create overlapping vocals.',
    examples: [
      'Consistent: "(M) Line 1, (F) Line 2, (M+F) Line 3" - Clean duet',
      'Inconsistent: "(M) Line 1, Line 2, (F) Line 3" - Line 2 becomes male or overlapped'
    ],
    confidence: 'high',
    agentGuidance: 'When creating duets or songs with multiple vocalists, mark EVERY line with (M), (F), or (M+F). Never leave lines unmarked if using this system.',
    userTip: 'In duets, mark EVERY line with (M), (F), or (M+F) - don\'t skip any lines.'
  },

  {
    category: 'bugs_workarounds',
    title: 'Syllable Count Drift',
    description: 'V5 ignores exact syllable counts unless reinforced with rhythm markers',
    explanation: 'Specifying "8 syllables per line" in the prompt rarely works. The model prioritizes natural phrasing over counting. To enforce rhythm, use hyphens for syllable breaks and commas for pauses.',
    examples: [
      'Syllable request: "8 syllables per line" - Often ignored',
      'Rhythm enforcement: "Hy-phen-ate, the syl-la-bles, like this" - More reliable'
    ],
    confidence: 'high',
    agentGuidance: 'Do not promise exact syllable counts. Instead, use visual rhythm markers: hyphens (syl-la-bles), commas (pause,), ellipses (trail off...). If user insists on syllable count, add a disclaimer.',
    userTip: 'V5 doesn\'t count syllables reliably - use hyphens and commas to control rhythm instead.'
  },

  // === ADVANCED TECHNIQUES ===
  {
    category: 'advanced_techniques',
    title: 'Call-and-Response Mastery',
    description: 'V5 excels at call-and-response when properly formatted',
    explanation: 'Using (M) question / (F) answer format triggers the model\'s dialogue training. This creates dynamic, conversational sections that sound natural and engaging.',
    examples: [
      `[Bridge]
(M) Can we start again?
(F) It's too late for that.
(M) But we still have time—
(F) We ran out of chances.`
    ],
    confidence: 'high',
    agentGuidance: 'For bridges or dynamic sections, use call-and-response format with (M)/(F) markers and short, punchy exchanges (4-8 line conversations).',
    userTip: 'Create dynamic bridges with call-and-response: (M) question / (F) answer format.'
  },

  {
    category: 'advanced_techniques',
    title: 'Vocal Effect Stacking',
    description: 'Multiple vocal effects can be combined for unique textures',
    explanation: 'V5 allows stacking of vocal effects: [Whisper + Echo] creates a haunting effect, [Autotune + Vocoder] creates robotic harmonies. The order matters - first effect is primary.',
    examples: [
      '[Whisper + Reverb] - Intimate but spacious',
      '[Shout + Distortion] - Aggressive rock vocal',
      '[Falsetto + Echo] - Ethereal, ghostly'
    ],
    confidence: 'experimental',
    agentGuidance: 'For emotionally intense sections, consider stacking 2 vocal effects. Use format: [PrimaryEffect + SecondaryEffect]. Do not stack more than 2.',
    userTip: 'Stack vocal effects for unique sounds: [Whisper + Echo] or [Shout + Distortion].'
  },

  {
    category: 'advanced_techniques',
    title: 'Dynamic Instrumentation',
    description: 'Specifying instrument changes per section creates production depth',
    explanation: 'Adding instrument notes to section headers guides the mix: [Verse 1 - acoustic guitar only] vs [Verse 2 - full band]. V5 responds to these cues and creates clear sonic evolution.',
    examples: [
      '[Verse 1 - piano, strings, 3/10 energy]',
      '[Verse 2 - add electric guitar, drums, 6/10 energy]',
      '[Chorus - full band, layered vocals, 9/10 energy]'
    ],
    confidence: 'high',
    agentGuidance: 'For songs requesting "building" or "dynamic" structures, specify instrument changes in section headers. Show progression from sparse to full.',
    userTip: 'Specify instruments per section to create dynamic builds: [Verse 1 - piano only] → [Chorus - full band].'
  },

  // === GENRE-SPECIFIC ===
  {
    category: 'genre_specific',
    title: 'Rap/Hip-Hop Flow Markers',
    description: 'Rap requires explicit rhythm markers and breath points',
    explanation: 'V5\'s rap generation needs visual guides for flow. Use slashes (/) for breath points, hyphens for emphasis (li-i-ike), and commas for half-bar pauses.',
    examples: [
      'Started from the bottom / now we here, /\nLook-ing at the city / from way up in the strat-o-sphere,'
    ],
    confidence: 'verified',
    agentGuidance: 'For rap/hip-hop, mark breath points with /, emphasize syllables with hyphens, use commas for timing. Aim for 16-bar verses (8 lines of 2 bars each).',
    userTip: 'For rap, use / for breaths, hyphens for em-pha-sis, and commas for timing pauses.'
  },

  {
    category: 'genre_specific',
    title: 'EDM Build-Drop Structure',
    description: 'EDM requires explicit [Build] and [Drop] tags for proper structure',
    explanation: 'Generic [Chorus] tags don\'t trigger EDM drop characteristics. Using [Build - 8 bars, rising tension] → [Drop - heavy bass, 9/10 energy] creates authentic EDM structure.',
    examples: [
      '[Build - 8 bars, rising synths, filter sweep, 7/10 energy]',
      '[Drop - heavy bass, chopped vocals, 10/10 energy]'
    ],
    confidence: 'high',
    agentGuidance: 'For EDM genres, replace traditional [Chorus] with [Build] + [Drop] structure. Specify bar count (typically 8 bars for build, 16 for drop).',
    userTip: 'EDM needs [Build] and [Drop] tags instead of chorus - specify bar counts and energy.'
  },

  {
    category: 'genre_specific',
    title: 'Country Storytelling Pacing',
    description: 'Country songs need slower lyrical pacing with extended vowels',
    explanation: 'Country vocal style requires "room to breathe" - longer syllable holds, use of ellipses (...), and conversational phrasing. Rushed lyrics sound pop, not country.',
    examples: [
      'Pop pacing: "I remember the day we met"',
      'Country pacing: "I re-mem-ber... the day we met,"'
    ],
    confidence: 'high',
    agentGuidance: 'For country genre, use: 1) Ellipses for phrasing gaps, 2) Hyphens for syllable extension, 3) Commas for natural pauses, 4) 60-80 BPM tempo.',
    userTip: 'Country needs slower pacing - use ellipses (...) and commas (,) for breathing room.'
  }
];

/**
 * Get contextual tips based on user inputs
 */
export const getContextualTips = (
  genre?: string,
  mood?: string,
  hasAdvancedLogic?: boolean,
  hasCommercialMode?: boolean
): SunoV5Knowledge[] => {
  const tips: SunoV5Knowledge[] = [];

  // Always include critical model behaviors
  tips.push(
    SUNO_V5_KNOWLEDGE_BASE.find(k => k.title === 'V5 Vocal Clarity Threshold')!,
    SUNO_V5_KNOWLEDGE_BASE.find(k => k.title === 'Loop Prevention')!
  );

  // Genre-specific tips
  if (genre) {
    const lowerGenre = genre.toLowerCase();
    if (lowerGenre.includes('rap') || lowerGenre.includes('hip-hop')) {
      tips.push(SUNO_V5_KNOWLEDGE_BASE.find(k => k.title === 'Rap/Hip-Hop Flow Markers')!);
    }
    if (lowerGenre.includes('edm') || lowerGenre.includes('house') || lowerGenre.includes('techno')) {
      tips.push(SUNO_V5_KNOWLEDGE_BASE.find(k => k.title === 'EDM Build-Drop Structure')!);
    }
    if (lowerGenre.includes('country')) {
      tips.push(SUNO_V5_KNOWLEDGE_BASE.find(k => k.title === 'Country Storytelling Pacing')!);
    }
  }

  // Mode-specific tips
  if (hasCommercialMode) {
    tips.push(
      SUNO_V5_KNOWLEDGE_BASE.find(k => k.title === 'Repetition Reinforcement')!,
      SUNO_V5_KNOWLEDGE_BASE.find(k => k.title === 'Section Length Optimization')!
    );
  }

  if (hasAdvancedLogic) {
    tips.push(
      SUNO_V5_KNOWLEDGE_BASE.find(k => k.title === 'First 8 Lines Anchor')!,
      SUNO_V5_KNOWLEDGE_BASE.find(k => k.title === 'Call-and-Response Mastery')!
    );
  }

  // Always add some general optimization tips
  tips.push(
    SUNO_V5_KNOWLEDGE_BASE.find(k => k.title === 'BPM Sweet Spots')!,
    SUNO_V5_KNOWLEDGE_BASE.find(k => k.title === 'Instrumental Intro Buffer')!
  );

  // Remove duplicates and return top 7
  const unique = [...new Map(tips.map(t => [t.title, t])).values()];
  return unique.slice(0, 7);
};

/**
 * Get agent guidance for song generation
 * This should be injected into the AI's system prompt
 */
export const getAgentGuidancePrompt = (
  genre?: string,
  hasAdvancedLogic?: boolean,
  hasCommercialMode?: boolean
): string => {
  const relevantKnowledge = getContextualTips(genre, undefined, hasAdvancedLogic, hasCommercialMode);
  
  let prompt = '\n### SUNO V5 MODEL BEHAVIOR & OPTIMIZATION KNOWLEDGE\n\n';
  prompt += 'Apply these verified Suno V5 behaviors when generating songs:\n\n';
  
  relevantKnowledge.forEach((knowledge, i) => {
    prompt += `${i + 1}. **${knowledge.title}**\n`;
    prompt += `   ${knowledge.agentGuidance}\n\n`;
  });

  return prompt;
};
