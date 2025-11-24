/**
 * DYNAMIC GENRE PROFILE SERVICE
 * Defines scoring expectations, structural norms, and critique focus for different genres
 * Used to contextualize analysis and recommendations
 */

export interface GenreProfile {
  id: string;
  name: string;
  description: string;
  
  // Score expectations (what's "good" for this genre)
  scoreExpectations: {
    lyricalOriginality: { min: number; ideal: number; priority: 'high' | 'medium' | 'low' };
    emotionalImpact: { min: number; ideal: number; priority: 'high' | 'medium' | 'low' };
    melodicFlow: { min: number; ideal: number; priority: 'high' | 'medium' | 'low' };
    sonicDensity: { min: number; ideal: number; priority: 'high' | 'medium' | 'low' };
    thematicCohesion: { min: number; ideal: number; priority: 'high' | 'medium' | 'low' };
    structureAndPacing: { min: number; ideal: number; priority: 'high' | 'medium' | 'low' };
    commercialPotential: { min: number; ideal: number; priority: 'high' | 'medium' | 'low' };
    vocalPlayability: { min: number; ideal: number; priority: 'high' | 'medium' | 'low' };
    imagerySensory: { min: number; ideal: number; priority: 'high' | 'medium' | 'low' };
    narrativeArc: { min: number; ideal: number; priority: 'high' | 'medium' | 'low' };
    hookFactor: { min: number; ideal: number; priority: 'high' | 'medium' | 'low' };
  };

  // Structural norms
  structure: {
    typicalLength: { min: number; max: number }; // lines
    hookPosition: 'early' | 'mid' | 'delayed'; // First 4, 8, or 12 lines
    chorusRepeats: { min: number; max: number };
    bridgeRequired: boolean;
    introLength: 'short' | 'medium' | 'long'; // 0-2, 2-4, 4+ lines
  };

  // Phonetic preferences
  phonetics: {
    consonantDensity: 'low' | 'medium' | 'high'; // Smooth vs punchy
    rhythmComplexity: 'simple' | 'moderate' | 'complex'; // Syllable patterns
    rhymeScheme: 'loose' | 'moderate' | 'strict'; // AABB, ABAB enforcement
  };

  // Thematic conventions
  themes: {
    allowedTopics: string[]; // Common themes for this genre
    avoidTopics: string[]; // Topics that break genre expectations
    metaphorDensity: 'literal' | 'moderate' | 'abstract'; // How poetic?
  };

  // Reference artists (for DNA matching)
  referenceArtists: string[];
}

/**
 * All genre profiles
 */
export const GENRE_PROFILES: Record<string, GenreProfile> = {
  
  // ===== 1. POP =====
  pop: {
    id: 'pop',
    name: 'Pop',
    description: 'Mainstream radio-friendly pop with broad appeal',
    scoreExpectations: {
      lyricalOriginality: { min: 6, ideal: 8, priority: 'medium' },
      emotionalImpact: { min: 7, ideal: 9, priority: 'high' },
      melodicFlow: { min: 8, ideal: 10, priority: 'high' },
      sonicDensity: { min: 7, ideal: 9, priority: 'high' },
      thematicCohesion: { min: 7, ideal: 9, priority: 'medium' },
      structureAndPacing: { min: 8, ideal: 10, priority: 'high' },
      commercialPotential: { min: 8, ideal: 10, priority: 'high' },
      vocalPlayability: { min: 8, ideal: 10, priority: 'high' },
      imagerySensory: { min: 7, ideal: 9, priority: 'medium' },
      narrativeArc: { min: 7, ideal: 9, priority: 'medium' },
      hookFactor: { min: 9, ideal: 10, priority: 'high' }
    },
    structure: {
      typicalLength: { min: 60, max: 100 },
      hookPosition: 'early', // Hook in first 4 lines
      chorusRepeats: { min: 3, max: 5 },
      bridgeRequired: true,
      introLength: 'short'
    },
    phonetics: {
      consonantDensity: 'medium',
      rhythmComplexity: 'moderate',
      rhymeScheme: 'moderate'
    },
    themes: {
      allowedTopics: ['love', 'heartbreak', 'empowerment', 'celebration', 'youth', 'freedom'],
      avoidTopics: ['politics', 'death', 'explicit violence'],
      metaphorDensity: 'moderate'
    },
    referenceArtists: ['Taylor Swift', 'Ariana Grande', 'Ed Sheeran', 'The Weeknd']
  },

  // ===== 2. HIP HOP =====
  hiphop: {
    id: 'hiphop',
    name: 'Hip Hop / Rap',
    description: 'Rap-driven with emphasis on wordplay and flow',
    scoreExpectations: {
      lyricalOriginality: { min: 8, ideal: 10, priority: 'high' },
      emotionalImpact: { min: 6, ideal: 8, priority: 'medium' },
      melodicFlow: { min: 7, ideal: 9, priority: 'high' },
      sonicDensity: { min: 8, ideal: 10, priority: 'high' },
      thematicCohesion: { min: 6, ideal: 8, priority: 'low' },
      structureAndPacing: { min: 7, ideal: 9, priority: 'medium' },
      commercialPotential: { min: 6, ideal: 9, priority: 'medium' },
      vocalPlayability: { min: 7, ideal: 9, priority: 'medium' },
      imagerySensory: { min: 8, ideal: 10, priority: 'high' },
      narrativeArc: { min: 7, ideal: 9, priority: 'medium' },
      hookFactor: { min: 8, ideal: 10, priority: 'high' }
    },
    structure: {
      typicalLength: { min: 80, max: 150 },
      hookPosition: 'early',
      chorusRepeats: { min: 2, max: 4 },
      bridgeRequired: false,
      introLength: 'short'
    },
    phonetics: {
      consonantDensity: 'high', // Punchy delivery
      rhythmComplexity: 'complex', // Multi-syllabic rhymes
      rhymeScheme: 'strict' // Internal rhymes, assonance
    },
    themes: {
      allowedTopics: ['success', 'struggle', 'authenticity', 'street life', 'confidence', 'social commentary'],
      avoidTopics: [],
      metaphorDensity: 'abstract' // Wordplay and double entendres
    },
    referenceArtists: ['Kendrick Lamar', 'J. Cole', 'Drake', 'Travis Scott']
  },

  // ===== 3. INDIE / ALTERNATIVE =====
  indie: {
    id: 'indie',
    name: 'Indie / Alternative',
    description: 'Artistic, non-mainstream with experimental elements',
    scoreExpectations: {
      lyricalOriginality: { min: 8, ideal: 10, priority: 'high' },
      emotionalImpact: { min: 7, ideal: 9, priority: 'high' },
      melodicFlow: { min: 6, ideal: 8, priority: 'medium' },
      sonicDensity: { min: 6, ideal: 8, priority: 'low' },
      thematicCohesion: { min: 8, ideal: 10, priority: 'high' },
      structureAndPacing: { min: 6, ideal: 8, priority: 'low' },
      commercialPotential: { min: 4, ideal: 7, priority: 'low' },
      vocalPlayability: { min: 6, ideal: 8, priority: 'medium' },
      imagerySensory: { min: 9, ideal: 10, priority: 'high' },
      narrativeArc: { min: 8, ideal: 10, priority: 'high' },
      hookFactor: { min: 5, ideal: 7, priority: 'low' }
    },
    structure: {
      typicalLength: { min: 50, max: 120 },
      hookPosition: 'mid', // More experimental
      chorusRepeats: { min: 1, max: 3 },
      bridgeRequired: false,
      introLength: 'medium'
    },
    phonetics: {
      consonantDensity: 'low', // Smoother, less aggressive
      rhythmComplexity: 'moderate',
      rhymeScheme: 'loose' // More free-form
    },
    themes: {
      allowedTopics: ['introspection', 'existentialism', 'nature', 'social alienation', 'nostalgia'],
      avoidTopics: ['superficial romance', 'money/materialism'],
      metaphorDensity: 'abstract' // Poetic imagery
    },
    referenceArtists: ['Bon Iver', 'Phoebe Bridgers', 'The National', 'Radiohead']
  },

  // ===== 4. COUNTRY =====
  country: {
    id: 'country',
    name: 'Country',
    description: 'Storytelling-focused with traditional American themes',
    scoreExpectations: {
      lyricalOriginality: { min: 7, ideal: 9, priority: 'high' },
      emotionalImpact: { min: 8, ideal: 10, priority: 'high' },
      melodicFlow: { min: 7, ideal: 9, priority: 'medium' },
      sonicDensity: { min: 6, ideal: 8, priority: 'low' },
      thematicCohesion: { min: 8, ideal: 10, priority: 'high' },
      structureAndPacing: { min: 7, ideal: 9, priority: 'medium' },
      commercialPotential: { min: 7, ideal: 9, priority: 'medium' },
      vocalPlayability: { min: 8, ideal: 10, priority: 'high' },
      imagerySensory: { min: 8, ideal: 10, priority: 'high' },
      narrativeArc: { min: 9, ideal: 10, priority: 'high' },
      hookFactor: { min: 7, ideal: 9, priority: 'medium' }
    },
    structure: {
      typicalLength: { min: 70, max: 110 },
      hookPosition: 'early',
      chorusRepeats: { min: 3, max: 4 },
      bridgeRequired: true,
      introLength: 'short'
    },
    phonetics: {
      consonantDensity: 'medium',
      rhythmComplexity: 'simple', // Straightforward delivery
      rhymeScheme: 'moderate'
    },
    themes: {
      allowedTopics: ['family', 'home', 'heartbreak', 'small-town life', 'patriotism', 'work'],
      avoidTopics: ['urban life', 'technology'],
      metaphorDensity: 'literal' // Direct storytelling
    },
    referenceArtists: ['Chris Stapleton', 'Kacey Musgraves', 'Luke Combs', 'Zach Bryan']
  },

  // ===== 5. R&B / SOUL =====
  rnb: {
    id: 'rnb',
    name: 'R&B / Soul',
    description: 'Smooth, emotive vocals with romantic themes',
    scoreExpectations: {
      lyricalOriginality: { min: 6, ideal: 8, priority: 'medium' },
      emotionalImpact: { min: 9, ideal: 10, priority: 'high' },
      melodicFlow: { min: 8, ideal: 10, priority: 'high' },
      sonicDensity: { min: 7, ideal: 9, priority: 'high' },
      thematicCohesion: { min: 7, ideal: 9, priority: 'medium' },
      structureAndPacing: { min: 7, ideal: 9, priority: 'medium' },
      commercialPotential: { min: 7, ideal: 9, priority: 'medium' },
      vocalPlayability: { min: 9, ideal: 10, priority: 'high' },
      imagerySensory: { min: 7, ideal: 9, priority: 'medium' },
      narrativeArc: { min: 7, ideal: 9, priority: 'medium' },
      hookFactor: { min: 8, ideal: 10, priority: 'high' }
    },
    structure: {
      typicalLength: { min: 60, max: 100 },
      hookPosition: 'early',
      chorusRepeats: { min: 3, max: 5 },
      bridgeRequired: true,
      introLength: 'short'
    },
    phonetics: {
      consonantDensity: 'low', // Smooth vocal runs
      rhythmComplexity: 'moderate',
      rhymeScheme: 'moderate'
    },
    themes: {
      allowedTopics: ['romance', 'intimacy', 'desire', 'heartbreak', 'self-love'],
      avoidTopics: ['violence', 'politics'],
      metaphorDensity: 'moderate'
    },
    referenceArtists: ['SZA', 'Frank Ocean', 'H.E.R.', 'Daniel Caesar']
  },

  // ===== 6. ROCK =====
  rock: {
    id: 'rock',
    name: 'Rock',
    description: 'Guitar-driven with anthemic energy',
    scoreExpectations: {
      lyricalOriginality: { min: 7, ideal: 9, priority: 'medium' },
      emotionalImpact: { min: 8, ideal: 10, priority: 'high' },
      melodicFlow: { min: 7, ideal: 9, priority: 'medium' },
      sonicDensity: { min: 7, ideal: 9, priority: 'medium' },
      thematicCohesion: { min: 7, ideal: 9, priority: 'medium' },
      structureAndPacing: { min: 8, ideal: 10, priority: 'high' },
      commercialPotential: { min: 6, ideal: 8, priority: 'low' },
      vocalPlayability: { min: 7, ideal: 9, priority: 'medium' },
      imagerySensory: { min: 7, ideal: 9, priority: 'medium' },
      narrativeArc: { min: 7, ideal: 9, priority: 'medium' },
      hookFactor: { min: 8, ideal: 10, priority: 'high' }
    },
    structure: {
      typicalLength: { min: 70, max: 120 },
      hookPosition: 'mid',
      chorusRepeats: { min: 3, max: 4 },
      bridgeRequired: false,
      introLength: 'medium'
    },
    phonetics: {
      consonantDensity: 'high', // Aggressive delivery
      rhythmComplexity: 'moderate',
      rhymeScheme: 'moderate'
    },
    themes: {
      allowedTopics: ['rebellion', 'freedom', 'angst', 'love', 'social commentary'],
      avoidTopics: [],
      metaphorDensity: 'moderate'
    },
    referenceArtists: ['Foo Fighters', 'Arctic Monkeys', 'The Killers', 'Queens of the Stone Age']
  },

  // ===== 7. EDM / ELECTRONIC =====
  edm: {
    id: 'edm',
    name: 'EDM / Electronic',
    description: 'Production-focused with repetitive hooks',
    scoreExpectations: {
      lyricalOriginality: { min: 5, ideal: 7, priority: 'low' },
      emotionalImpact: { min: 7, ideal: 9, priority: 'medium' },
      melodicFlow: { min: 8, ideal: 10, priority: 'high' },
      sonicDensity: { min: 8, ideal: 10, priority: 'high' },
      thematicCohesion: { min: 6, ideal: 8, priority: 'low' },
      structureAndPacing: { min: 9, ideal: 10, priority: 'high' },
      commercialPotential: { min: 8, ideal: 10, priority: 'high' },
      vocalPlayability: { min: 9, ideal: 10, priority: 'high' },
      imagerySensory: { min: 5, ideal: 7, priority: 'low' },
      narrativeArc: { min: 4, ideal: 6, priority: 'low' },
      hookFactor: { min: 9, ideal: 10, priority: 'high' }
    },
    structure: {
      typicalLength: { min: 40, max: 80 }, // Shorter, repetitive
      hookPosition: 'early',
      chorusRepeats: { min: 4, max: 6 },
      bridgeRequired: false,
      introLength: 'long' // Build-up
    },
    phonetics: {
      consonantDensity: 'medium',
      rhythmComplexity: 'simple', // Easy to chant
      rhymeScheme: 'loose'
    },
    themes: {
      allowedTopics: ['euphoria', 'celebration', 'love', 'freedom', 'night life'],
      avoidTopics: ['sadness', 'introspection'],
      metaphorDensity: 'literal' // Direct, simple
    },
    referenceArtists: ['Calvin Harris', 'Zedd', 'Marshmello', 'The Chainsmokers']
  },

  // ===== 8. FOLK / AMERICANA =====
  folk: {
    id: 'folk',
    name: 'Folk / Americana',
    description: 'Acoustic storytelling with traditional roots',
    scoreExpectations: {
      lyricalOriginality: { min: 8, ideal: 10, priority: 'high' },
      emotionalImpact: { min: 8, ideal: 10, priority: 'high' },
      melodicFlow: { min: 6, ideal: 8, priority: 'medium' },
      sonicDensity: { min: 5, ideal: 7, priority: 'low' },
      thematicCohesion: { min: 9, ideal: 10, priority: 'high' },
      structureAndPacing: { min: 6, ideal: 8, priority: 'low' },
      commercialPotential: { min: 4, ideal: 6, priority: 'low' },
      vocalPlayability: { min: 6, ideal: 8, priority: 'medium' },
      imagerySensory: { min: 9, ideal: 10, priority: 'high' },
      narrativeArc: { min: 9, ideal: 10, priority: 'high' },
      hookFactor: { min: 5, ideal: 7, priority: 'low' }
    },
    structure: {
      typicalLength: { min: 80, max: 150 },
      hookPosition: 'delayed', // Story builds
      chorusRepeats: { min: 2, max: 3 },
      bridgeRequired: false,
      introLength: 'long'
    },
    phonetics: {
      consonantDensity: 'low',
      rhythmComplexity: 'simple',
      rhymeScheme: 'loose'
    },
    themes: {
      allowedTopics: ['nature', 'travel', 'history', 'hardship', 'community', 'spirituality'],
      avoidTopics: ['technology', 'materialism'],
      metaphorDensity: 'abstract' // Poetic imagery
    },
    referenceArtists: ['Brandi Carlile', 'Jason Isbell', 'The Lumineers', 'Gregory Alan Isakov']
  },

  // ===== 9. LATIN POP / REGGAETON =====
  latin: {
    id: 'latin',
    name: 'Latin Pop / Reggaeton',
    description: 'Rhythmic, danceable with bilingual potential',
    scoreExpectations: {
      lyricalOriginality: { min: 6, ideal: 8, priority: 'medium' },
      emotionalImpact: { min: 7, ideal: 9, priority: 'medium' },
      melodicFlow: { min: 9, ideal: 10, priority: 'high' },
      sonicDensity: { min: 8, ideal: 10, priority: 'high' },
      thematicCohesion: { min: 6, ideal: 8, priority: 'low' },
      structureAndPacing: { min: 9, ideal: 10, priority: 'high' },
      commercialPotential: { min: 8, ideal: 10, priority: 'high' },
      vocalPlayability: { min: 9, ideal: 10, priority: 'high' },
      imagerySensory: { min: 6, ideal: 8, priority: 'medium' },
      narrativeArc: { min: 6, ideal: 8, priority: 'medium' },
      hookFactor: { min: 9, ideal: 10, priority: 'high' }
    },
    structure: {
      typicalLength: { min: 60, max: 100 },
      hookPosition: 'early',
      chorusRepeats: { min: 4, max: 6 },
      bridgeRequired: false,
      introLength: 'short'
    },
    phonetics: {
      consonantDensity: 'high', // Percussive
      rhythmComplexity: 'complex', // Syncopated
      rhymeScheme: 'strict'
    },
    themes: {
      allowedTopics: ['romance', 'dance', 'celebration', 'desire', 'confidence'],
      avoidTopics: ['sadness', 'introspection'],
      metaphorDensity: 'moderate'
    },
    referenceArtists: ['Bad Bunny', 'Rosalía', 'Karol G', 'J Balvin']
  },

  // ===== 10. JAZZ / BLUES =====
  jazz: {
    id: 'jazz',
    name: 'Jazz / Blues',
    description: 'Improvisational, sophisticated with emotional depth',
    scoreExpectations: {
      lyricalOriginality: { min: 7, ideal: 9, priority: 'medium' },
      emotionalImpact: { min: 9, ideal: 10, priority: 'high' },
      melodicFlow: { min: 6, ideal: 8, priority: 'low' },
      sonicDensity: { min: 6, ideal: 8, priority: 'low' },
      thematicCohesion: { min: 7, ideal: 9, priority: 'medium' },
      structureAndPacing: { min: 5, ideal: 7, priority: 'low' },
      commercialPotential: { min: 3, ideal: 6, priority: 'low' },
      vocalPlayability: { min: 7, ideal: 9, priority: 'medium' },
      imagerySensory: { min: 8, ideal: 10, priority: 'high' },
      narrativeArc: { min: 8, ideal: 10, priority: 'high' },
      hookFactor: { min: 4, ideal: 6, priority: 'low' }
    },
    structure: {
      typicalLength: { min: 50, max: 120 },
      hookPosition: 'delayed',
      chorusRepeats: { min: 1, max: 3 },
      bridgeRequired: false,
      introLength: 'long'
    },
    phonetics: {
      consonantDensity: 'low',
      rhythmComplexity: 'complex', // Syncopated, off-beat
      rhymeScheme: 'loose'
    },
    themes: {
      allowedTopics: ['heartbreak', 'loneliness', 'desire', 'nostalgia', 'struggle', 'spirituality'],
      avoidTopics: ['youth culture', 'technology'],
      metaphorDensity: 'abstract' // Deep emotional imagery
    },
    referenceArtists: ['Norah Jones', 'John Mayer', 'Amy Winehouse', 'Leon Bridges']
  },

  // ===== 11. METAL / HARD ROCK =====
  metal: {
    id: 'metal',
    name: 'Metal / Hard Rock',
    description: 'Aggressive, intense with powerful vocals',
    scoreExpectations: {
      lyricalOriginality: { min: 7, ideal: 9, priority: 'medium' },
      emotionalImpact: { min: 9, ideal: 10, priority: 'high' },
      melodicFlow: { min: 6, ideal: 8, priority: 'low' },
      sonicDensity: { min: 8, ideal: 10, priority: 'high' },
      thematicCohesion: { min: 7, ideal: 9, priority: 'medium' },
      structureAndPacing: { min: 7, ideal: 9, priority: 'medium' },
      commercialPotential: { min: 4, ideal: 6, priority: 'low' },
      vocalPlayability: { min: 6, ideal: 8, priority: 'medium' },
      imagerySensory: { min: 8, ideal: 10, priority: 'high' },
      narrativeArc: { min: 6, ideal: 8, priority: 'medium' },
      hookFactor: { min: 7, ideal: 9, priority: 'medium' }
    },
    structure: {
      typicalLength: { min: 80, max: 150 },
      hookPosition: 'mid',
      chorusRepeats: { min: 3, max: 4 },
      bridgeRequired: true,
      introLength: 'long' // Guitar-driven intros
    },
    phonetics: {
      consonantDensity: 'high', // Aggressive, percussive
      rhythmComplexity: 'complex',
      rhymeScheme: 'moderate'
    },
    themes: {
      allowedTopics: ['anger', 'rebellion', 'darkness', 'power', 'mythology', 'social critique'],
      avoidTopics: ['romantic love', 'celebration'],
      metaphorDensity: 'abstract' // Mythological, dark imagery
    },
    referenceArtists: ['Metallica', 'System of a Down', 'Slipknot', 'Gojira']
  },

  // ===== 12. ACOUSTIC / SINGER-SONGWRITER =====
  acoustic: {
    id: 'acoustic',
    name: 'Acoustic / Singer-Songwriter',
    description: 'Intimate, stripped-down personal storytelling',
    scoreExpectations: {
      lyricalOriginality: { min: 9, ideal: 10, priority: 'high' },
      emotionalImpact: { min: 9, ideal: 10, priority: 'high' },
      melodicFlow: { min: 7, ideal: 9, priority: 'medium' },
      sonicDensity: { min: 4, ideal: 6, priority: 'low' },
      thematicCohesion: { min: 9, ideal: 10, priority: 'high' },
      structureAndPacing: { min: 5, ideal: 7, priority: 'low' },
      commercialPotential: { min: 4, ideal: 6, priority: 'low' },
      vocalPlayability: { min: 7, ideal: 9, priority: 'medium' },
      imagerySensory: { min: 9, ideal: 10, priority: 'high' },
      narrativeArc: { min: 9, ideal: 10, priority: 'high' },
      hookFactor: { min: 5, ideal: 7, priority: 'low' }
    },
    structure: {
      typicalLength: { min: 60, max: 120 },
      hookPosition: 'mid',
      chorusRepeats: { min: 2, max: 3 },
      bridgeRequired: false,
      introLength: 'medium'
    },
    phonetics: {
      consonantDensity: 'low', // Soft, intimate delivery
      rhythmComplexity: 'simple',
      rhymeScheme: 'loose'
    },
    themes: {
      allowedTopics: ['introspection', 'relationships', 'growth', 'loss', 'hope', 'vulnerability'],
      avoidTopics: ['materialism', 'party culture'],
      metaphorDensity: 'abstract' // Personal, poetic
    },
    referenceArtists: ['Joni Mitchell', 'Sufjan Stevens', 'Elliott Smith', 'Laura Marling']
  }
};

/**
 * Get genre profile by ID
 */
export const getGenreProfile = (genreId: string): GenreProfile | null => {
  return GENRE_PROFILES[genreId.toLowerCase()] || null;
};

/**
 * Suggest best-fit genre based on analysis scores
 */
export const suggestGenre = (analysis: any): { genreId: string; confidence: number; reasoning: string } => {
  
  const scores = analysis.scoreAnalysis;
  let bestMatch = { genreId: 'pop', confidence: 0, reasoning: '' };

  Object.values(GENRE_PROFILES).forEach(profile => {
    let matchScore = 0;
    const reasons: string[] = [];

    // Compare each score expectation
    Object.entries(profile.scoreExpectations).forEach(([key, expect]) => {
      const actualScore = scores[key];
      const priorityWeight = expect.priority === 'high' ? 3 : expect.priority === 'medium' ? 2 : 1;

      if (actualScore >= expect.ideal - 1) {
        matchScore += 10 * priorityWeight;
        reasons.push(`${key} matches ideal (${actualScore}/${expect.ideal})`);
      } else if (actualScore >= expect.min) {
        matchScore += 5 * priorityWeight;
      } else {
        matchScore -= 3 * priorityWeight;
      }
    });

    const confidence = Math.min(100, Math.max(0, matchScore));
    if (confidence > bestMatch.confidence) {
      bestMatch = {
        genreId: profile.id,
        confidence,
        reasoning: reasons.slice(0, 3).join(', ')
      };
    }
  });

  return bestMatch;
};

/**
 * Genre Weight Matrices (9 genres × 10 categories)
 * Defines relative importance of each scoring category per genre (0-1 scale)
 * Used for weighted scoring and genre-specific optimization
 */
export const GENRE_WEIGHT_MATRICES: Record<string, Record<string, number>> = {
  pop: {
    lyricalOriginality: 0.7,
    emotionalImpact: 0.9,
    melodicFlow: 1.0,
    sonicDensity: 0.9,
    thematicCohesion: 0.7,
    structureAndPacing: 1.0,
    commercialPotential: 1.0,
    vocalPlayability: 1.0,
    imagerySensory: 0.7,
    narrativeArc: 0.7,
    hookFactor: 1.0
  },
  hiphop: {
    lyricalOriginality: 1.0,
    emotionalImpact: 0.8,
    melodicFlow: 1.0,
    sonicDensity: 1.0,
    thematicCohesion: 0.9,
    structureAndPacing: 0.9,
    commercialPotential: 0.9,
    vocalPlayability: 0.8,
    imagerySensory: 0.8,
    narrativeArc: 0.9,
    hookFactor: 1.0
  },
  indie: {
    lyricalOriginality: 1.0,
    emotionalImpact: 1.0,
    melodicFlow: 0.8,
    sonicDensity: 0.8,
    thematicCohesion: 1.0,
    structureAndPacing: 0.8,
    commercialPotential: 0.6,
    vocalPlayability: 0.7,
    imagerySensory: 1.0,
    narrativeArc: 1.0,
    hookFactor: 0.7
  },
  country: {
    lyricalOriginality: 0.9,
    emotionalImpact: 1.0,
    melodicFlow: 0.9,
    sonicDensity: 0.7,
    thematicCohesion: 1.0,
    structureAndPacing: 0.9,
    commercialPotential: 0.8,
    vocalPlayability: 0.9,
    imagerySensory: 0.9,
    narrativeArc: 1.0,
    hookFactor: 0.9
  },
  rnb: {
    lyricalOriginality: 0.7,
    emotionalImpact: 1.0,
    melodicFlow: 1.0,
    sonicDensity: 0.9,
    thematicCohesion: 0.9,
    structureAndPacing: 0.9,
    commercialPotential: 0.9,
    vocalPlayability: 1.0,
    imagerySensory: 0.9,
    narrativeArc: 0.9,
    hookFactor: 1.0
  },
  rock: {
    lyricalOriginality: 0.9,
    emotionalImpact: 1.0,
    melodicFlow: 0.9,
    sonicDensity: 0.9,
    thematicCohesion: 0.9,
    structureAndPacing: 1.0,
    commercialPotential: 0.7,
    vocalPlayability: 0.8,
    imagerySensory: 0.8,
    narrativeArc: 0.9,
    hookFactor: 0.9
  },
  edm: {
    lyricalOriginality: 0.6,
    emotionalImpact: 0.9,
    melodicFlow: 0.9,
    sonicDensity: 1.0,
    thematicCohesion: 0.7,
    structureAndPacing: 1.0,
    commercialPotential: 1.0,
    vocalPlayability: 0.9,
    imagerySensory: 0.7,
    narrativeArc: 0.6,
    hookFactor: 1.0
  },
  folk: {
    lyricalOriginality: 1.0,
    emotionalImpact: 1.0,
    melodicFlow: 0.8,
    sonicDensity: 0.6,
    thematicCohesion: 1.0,
    structureAndPacing: 0.8,
    commercialPotential: 0.6,
    vocalPlayability: 0.7,
    imagerySensory: 1.0,
    narrativeArc: 1.0,
    hookFactor: 0.7
  },
  latin: {
    lyricalOriginality: 0.7,
    emotionalImpact: 0.9,
    melodicFlow: 1.0,
    sonicDensity: 1.0,
    thematicCohesion: 0.8,
    structureAndPacing: 1.0,
    commercialPotential: 1.0,
    vocalPlayability: 1.0,
    imagerySensory: 0.8,
    narrativeArc: 0.7,
    hookFactor: 1.0
  }
};

/**
 * Get genre weight for a specific category
 */
export const getGenreWeight = (genreId: string, category: string): number => {
  const matrix = GENRE_WEIGHT_MATRICES[genreId.toLowerCase()];
  return matrix?.[category] || 1.0; // Default to 1.0 if not found
};

/**
 * Calculate weighted score for a genre
 */
export const calculateWeightedScore = (
  scores: Record<string, number>,
  genreId: string
): number => {
  const weights = GENRE_WEIGHT_MATRICES[genreId.toLowerCase()];
  if (!weights) return 0;

  let totalWeighted = 0;
  let totalWeight = 0;

  Object.entries(scores).forEach(([category, score]) => {
    const weight = weights[category] || 1.0;
    totalWeighted += score * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? totalWeighted / totalWeight : 0;
};
