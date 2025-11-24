// Simple JavaScript test for enhanced scoring functions
// Import from the TypeScript files (Vite will handle compilation)

import { calculateImagerySensory, calculateNarrativeArc } from './services/scoringService.ts';

// Test lyrics with varied sensory words and narrative arc
const testLyrics = `[Verse 1]
Crimson sunset bleeding through the window
Your perfume still lingering in the air
Cold sheets where you used to sleep
Thunder rolling in the distance

[Chorus]
I'm falling, falling, can't catch my breath
Dancing with shadows in the dark
Your voice echoing through empty halls
Burning memories that never die

[Verse 2]
Bitter coffee, yesterday's routine
Stumbling through these crowded streets
Sweet laughter haunting every corner
Drowning in this ocean of regret

[Bridge]
But now I understand, finally see
The light breaking through the storm
Found my way back home again
Transformed by all this pain`;

console.log('═══════════════════════════════════════');
console.log('  ENHANCED SCORING FUNCTION TEST');
console.log('═══════════════════════════════════════\n');

console.log('📊 IMAGERY & SENSORY DETAIL:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const imagery = calculateImagerySensory(testLyrics);
console.log('Score:', imagery.score + '/10');
console.log('Breakdown:', imagery.breakdown);

console.log('\n📖 NARRATIVE ARC:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
const narrative = calculateNarrativeArc(testLyrics);
console.log('Score:', narrative.score + '/10');
console.log('Breakdown:', narrative.breakdown);

console.log('\n✅ Test completed successfully!');
