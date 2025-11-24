/**
 * Test Suite for Scoring Service
 * Run: npm test (or manually test via console)
 */

import { calculateHookFactor, calculateVocalPlayability } from './scoringService';

// Test 1: Hook Factor with strong hook
console.log('=== TEST 1: Strong Hook ===');
const test1 = calculateHookFactor(
  `[Verse 1]
Running through the midnight rain
Can't escape this endless pain
Every shadow knows my name
Running through the midnight rain

[Chorus]
Midnight rain, midnight rain
Washing over me again
Midnight rain, midnight rain
Won't you set me free from pain

[Verse 2]
Neon lights are fading fast
Memories of the distant past

[Chorus]
Midnight rain, midnight rain
Washing over me again
Midnight rain, midnight rain
Won't you set me free from pain`,
  'Midnight Rain'
);
console.log('Score:', test1.score, '/10');
console.log('Breakdown:', test1.breakdown);
console.log('Suggestions:', test1.suggestions);
console.log('');

// Test 2: Hook Factor with weak hook
console.log('=== TEST 2: Weak Hook ===');
const test2 = calculateHookFactor(
  `[Verse 1]
Walking down the empty street
Feeling somewhat incomplete
Life is never what it seems
Lost inside my broken dreams

[Verse 2]
Tomorrow brings another day
Maybe things will find a way`,
  'Broken Dreams'
);
console.log('Score:', test2.score, '/10');
console.log('Breakdown:', test2.breakdown);
console.log('Suggestions:', test2.suggestions);
console.log('');

// Test 3: Vocal Playability - Pop genre (good pacing)
console.log('=== TEST 3: Vocal Playability - Pop (Good) ===');
const test3 = calculateVocalPlayability(
  `[Verse 1]
I see you there, standing in the light
Everything feels right, tonight

[Chorus]
Oh, we could be amazing
Take my hand, no hesitating
Oh, this feeling's so electric
You and me, it's just perfect`,
  'pop'
);
console.log('Score:', test3.score, '/10');
console.log('Breakdown:', test3.breakdown);
console.log('Breath markers:', test3.breathMarkers);
console.log('Suggestions:', test3.suggestions);
console.log('');

// Test 4: Vocal Playability - Pop genre (breath issues)
console.log('=== TEST 4: Vocal Playability - Pop (Breath Issues) ===');
const test4 = calculateVocalPlayability(
  `[Verse 1]
Running through the complicated situations that we've been creating every single day without any hesitation
Feeling all the pressure building up inside my chest as I try to express everything that's left`,
  'pop'
);
console.log('Score:', test4.score, '/10');
console.log('Breakdown:', test4.breakdown);
console.log('Breath markers (lines needing breaks):', test4.breathMarkers);
console.log('Suggestions:', test4.suggestions);
console.log('');

// Test 5: Vocal Playability - Hip Hop (allows more syllables)
console.log('=== TEST 5: Vocal Playability - Hip Hop (Good) ===');
const test5 = calculateVocalPlayability(
  `[Verse 1]
Running through the complicated situations that we've been creating every day
Feeling all the pressure building up inside my chest as I express`,
  'hiphop'
);
console.log('Score:', test5.score, '/10');
console.log('Breakdown:', test5.breakdown);
console.log('Suggestions:', test5.suggestions);
console.log('');

console.log('=== ALL TESTS COMPLETE ===');
console.log('✅ Hook Factor: Measures title repetition, chorus frequency, simplicity');
console.log('✅ Vocal Playability: Measures breath points, syllable density, genre-specific');
console.log('💡 Both functions now integrated into analyzeSong() pipeline');
