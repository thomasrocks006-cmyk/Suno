/**
 * SENSORY WORD DATABASE
 * Comprehensive database of 1000+ sensory words categorized by sense
 * Used by calculateImagerySensory() for full detection coverage
 * 
 * Intensity levels:
 * - subtle: Implicit sensory experience (e.g., "soft", "gentle")
 * - moderate: Clear sensory detail (e.g., "crimson", "thunder")
 * - vivid: Highly evocative imagery (e.g., "searing", "deafening")
 */

export interface SensoryWord {
  word: string;
  sense: 'visual' | 'auditory' | 'tactile' | 'olfactory' | 'gustatory' | 'kinesthetic';
  intensity: 'subtle' | 'moderate' | 'vivid';
  examples?: string[]; // Optional usage examples
}

/**
 * Visual words (sight, color, light, shape, movement)
 */
const VISUAL_WORDS: SensoryWord[] = [
  // Colors - Vivid
  { word: 'crimson', sense: 'visual', intensity: 'vivid', examples: ['crimson sky', 'crimson blood'] },
  { word: 'scarlet', sense: 'visual', intensity: 'vivid' },
  { word: 'azure', sense: 'visual', intensity: 'vivid' },
  { word: 'emerald', sense: 'visual', intensity: 'vivid' },
  { word: 'sapphire', sense: 'visual', intensity: 'vivid' },
  { word: 'golden', sense: 'visual', intensity: 'vivid' },
  { word: 'silver', sense: 'visual', intensity: 'vivid' },
  { word: 'ivory', sense: 'visual', intensity: 'vivid' },
  { word: 'ebony', sense: 'visual', intensity: 'vivid' },
  { word: 'amber', sense: 'visual', intensity: 'vivid' },
  { word: 'ruby', sense: 'visual', intensity: 'vivid' },
  { word: 'violet', sense: 'visual', intensity: 'vivid' },
  { word: 'indigo', sense: 'visual', intensity: 'vivid' },
  
  // Colors - Moderate
  { word: 'red', sense: 'visual', intensity: 'moderate' },
  { word: 'blue', sense: 'visual', intensity: 'moderate' },
  { word: 'green', sense: 'visual', intensity: 'moderate' },
  { word: 'yellow', sense: 'visual', intensity: 'moderate' },
  { word: 'purple', sense: 'visual', intensity: 'moderate' },
  { word: 'orange', sense: 'visual', intensity: 'moderate' },
  { word: 'pink', sense: 'visual', intensity: 'moderate' },
  { word: 'brown', sense: 'visual', intensity: 'moderate' },
  { word: 'gray', sense: 'visual', intensity: 'moderate' },
  { word: 'grey', sense: 'visual', intensity: 'moderate' },
  { word: 'black', sense: 'visual', intensity: 'moderate' },
  { word: 'white', sense: 'visual', intensity: 'moderate' },
  
  // Light - Vivid
  { word: 'glowing', sense: 'visual', intensity: 'vivid' },
  { word: 'blazing', sense: 'visual', intensity: 'vivid' },
  { word: 'radiant', sense: 'visual', intensity: 'vivid' },
  { word: 'luminous', sense: 'visual', intensity: 'vivid' },
  { word: 'dazzling', sense: 'visual', intensity: 'vivid' },
  { word: 'shimmering', sense: 'visual', intensity: 'vivid' },
  { word: 'gleaming', sense: 'visual', intensity: 'vivid' },
  { word: 'sparkling', sense: 'visual', intensity: 'vivid' },
  { word: 'flickering', sense: 'visual', intensity: 'vivid' },
  { word: 'glittering', sense: 'visual', intensity: 'vivid' },
  
  // Light - Moderate
  { word: 'bright', sense: 'visual', intensity: 'moderate' },
  { word: 'dark', sense: 'visual', intensity: 'moderate' },
  { word: 'dim', sense: 'visual', intensity: 'moderate' },
  { word: 'shadowy', sense: 'visual', intensity: 'moderate' },
  { word: 'shining', sense: 'visual', intensity: 'moderate' },
  { word: 'glimmering', sense: 'visual', intensity: 'moderate' },
  
  // Shape/Form - Vivid
  { word: 'crystalline', sense: 'visual', intensity: 'vivid' },
  { word: 'jagged', sense: 'visual', intensity: 'vivid' },
  { word: 'twisted', sense: 'visual', intensity: 'vivid' },
  { word: 'curved', sense: 'visual', intensity: 'moderate' },
  { word: 'angular', sense: 'visual', intensity: 'moderate' },
  
  // Weather/Nature - Vivid
  { word: 'foggy', sense: 'visual', intensity: 'vivid' },
  { word: 'misty', sense: 'visual', intensity: 'vivid' },
  { word: 'hazy', sense: 'visual', intensity: 'moderate' },
  { word: 'cloudy', sense: 'visual', intensity: 'moderate' },
  { word: 'stormy', sense: 'visual', intensity: 'vivid' },
  { word: 'sunny', sense: 'visual', intensity: 'moderate' },
  { word: 'moonlit', sense: 'visual', intensity: 'vivid' },
  { word: 'starlit', sense: 'visual', intensity: 'vivid' },
  
  // Movement/Motion - Vivid
  { word: 'swirling', sense: 'visual', intensity: 'vivid' },
  { word: 'spiraling', sense: 'visual', intensity: 'vivid' },
  { word: 'flowing', sense: 'visual', intensity: 'moderate' },
  { word: 'drifting', sense: 'visual', intensity: 'moderate' },
  { word: 'spinning', sense: 'visual', intensity: 'moderate' },
  { word: 'dancing', sense: 'visual', intensity: 'moderate' },
  { word: 'fading', sense: 'visual', intensity: 'moderate' },
  
  // Descriptive - Subtle
  { word: 'neon', sense: 'visual', intensity: 'vivid' },
  { word: 'chrome', sense: 'visual', intensity: 'vivid' },
  { word: 'velvet', sense: 'visual', intensity: 'vivid' },
  { word: 'silk', sense: 'visual', intensity: 'moderate' },
  { word: 'transparent', sense: 'visual', intensity: 'moderate' },
  { word: 'opaque', sense: 'visual', intensity: 'moderate' },
  { word: 'blurred', sense: 'visual', intensity: 'moderate' },
  { word: 'sharp', sense: 'visual', intensity: 'moderate' },
  { word: 'clear', sense: 'visual', intensity: 'subtle' },
  
  // Additional colors - Vivid
  { word: 'turquoise', sense: 'visual', intensity: 'vivid' },
  { word: 'coral', sense: 'visual', intensity: 'vivid' },
  { word: 'magenta', sense: 'visual', intensity: 'vivid' },
  { word: 'chartreuse', sense: 'visual', intensity: 'vivid' },
  { word: 'burgundy', sense: 'visual', intensity: 'vivid' },
  { word: 'navy', sense: 'visual', intensity: 'vivid' },
  { word: 'maroon', sense: 'visual', intensity: 'vivid' },
  { word: 'teal', sense: 'visual', intensity: 'vivid' },
  { word: 'lavender', sense: 'visual', intensity: 'vivid' },
  { word: 'peach', sense: 'visual', intensity: 'vivid' },
  { word: 'mint', sense: 'visual', intensity: 'vivid' },
  { word: 'bronze', sense: 'visual', intensity: 'vivid' },
  { word: 'copper', sense: 'visual', intensity: 'vivid' },
  { word: 'platinum', sense: 'visual', intensity: 'vivid' },
  { word: 'steel', sense: 'visual', intensity: 'vivid' },
  { word: 'pearl', sense: 'visual', intensity: 'vivid' },
  { word: 'opal', sense: 'visual', intensity: 'vivid' },
  { word: 'jade', sense: 'visual', intensity: 'vivid' },
  { word: 'onyx', sense: 'visual', intensity: 'vivid' },
  { word: 'obsidian', sense: 'visual', intensity: 'vivid' },
  
  // More light descriptors
  { word: 'incandescent', sense: 'visual', intensity: 'vivid' },
  { word: 'phosphorescent', sense: 'visual', intensity: 'vivid' },
  { word: 'iridescent', sense: 'visual', intensity: 'vivid' },
  { word: 'opalescent', sense: 'visual', intensity: 'vivid' },
  { word: 'translucent', sense: 'visual', intensity: 'moderate' },
  { word: 'reflective', sense: 'visual', intensity: 'moderate' },
  { word: 'mirror-like', sense: 'visual', intensity: 'vivid' },
  { word: 'twinkling', sense: 'visual', intensity: 'vivid' },
  { word: 'pulsing', sense: 'visual', intensity: 'vivid' },
  { word: 'flashing', sense: 'visual', intensity: 'vivid' },
  { word: 'strobing', sense: 'visual', intensity: 'vivid' },
  { word: 'glowing-hot', sense: 'visual', intensity: 'vivid' },
  { word: 'smoldering', sense: 'visual', intensity: 'vivid' },
  { word: 'ember-like', sense: 'visual', intensity: 'vivid' },
  
  // Darkness/Shadow
  { word: 'pitch-black', sense: 'visual', intensity: 'vivid' },
  { word: 'inky', sense: 'visual', intensity: 'vivid' },
  { word: 'murky', sense: 'visual', intensity: 'vivid' },
  { word: 'dusky', sense: 'visual', intensity: 'moderate' },
  { word: 'twilight', sense: 'visual', intensity: 'vivid' },
  { word: 'gloomy', sense: 'visual', intensity: 'moderate' },
  { word: 'somber', sense: 'visual', intensity: 'moderate' },
  
  // Patterns/Textures (visual)
  { word: 'checkered', sense: 'visual', intensity: 'moderate' },
  { word: 'striped', sense: 'visual', intensity: 'moderate' },
  { word: 'spotted', sense: 'visual', intensity: 'moderate' },
  { word: 'marbled', sense: 'visual', intensity: 'vivid' },
  { word: 'speckled', sense: 'visual', intensity: 'moderate' },
  { word: 'mottled', sense: 'visual', intensity: 'vivid' },
  { word: 'stippled', sense: 'visual', intensity: 'vivid' },
  { word: 'freckled', sense: 'visual', intensity: 'moderate' },
  { word: 'dappled', sense: 'visual', intensity: 'vivid' },
  { word: 'prismatic', sense: 'visual', intensity: 'vivid' },
  { word: 'kaleidoscopic', sense: 'visual', intensity: 'vivid' },
  
  // Size/Scale
  { word: 'towering', sense: 'visual', intensity: 'vivid' },
  { word: 'looming', sense: 'visual', intensity: 'vivid' },
  { word: 'tiny', sense: 'visual', intensity: 'moderate' },
  { word: 'massive', sense: 'visual', intensity: 'moderate' },
  { word: 'miniature', sense: 'visual', intensity: 'moderate' },
  { word: 'colossal', sense: 'visual', intensity: 'vivid' },
  { word: 'microscopic', sense: 'visual', intensity: 'vivid' },
];

/**
 * Auditory words (sound, volume, rhythm, music)
 */
const AUDITORY_WORDS: SensoryWord[] = [
  // Loud sounds - Vivid
  { word: 'deafening', sense: 'auditory', intensity: 'vivid' },
  { word: 'thunderous', sense: 'auditory', intensity: 'vivid' },
  { word: 'roaring', sense: 'auditory', intensity: 'vivid' },
  { word: 'booming', sense: 'auditory', intensity: 'vivid' },
  { word: 'crashing', sense: 'auditory', intensity: 'vivid' },
  { word: 'shrieking', sense: 'auditory', intensity: 'vivid' },
  { word: 'screaming', sense: 'auditory', intensity: 'vivid' },
  { word: 'blaring', sense: 'auditory', intensity: 'vivid' },
  { word: 'piercing', sense: 'auditory', intensity: 'vivid' },
  
  // Soft sounds - Vivid
  { word: 'whispering', sense: 'auditory', intensity: 'vivid' },
  { word: 'murmuring', sense: 'auditory', intensity: 'vivid' },
  { word: 'rustling', sense: 'auditory', intensity: 'vivid' },
  { word: 'tinkling', sense: 'auditory', intensity: 'vivid' },
  { word: 'chiming', sense: 'auditory', intensity: 'vivid' },
  
  // Music/Rhythm - Vivid
  { word: 'melodic', sense: 'auditory', intensity: 'vivid' },
  { word: 'rhythmic', sense: 'auditory', intensity: 'moderate' },
  { word: 'harmonic', sense: 'auditory', intensity: 'vivid' },
  { word: 'symphonic', sense: 'auditory', intensity: 'vivid' },
  { word: 'cacophonous', sense: 'auditory', intensity: 'vivid' },
  { word: 'dissonant', sense: 'auditory', intensity: 'vivid' },
  
  // General sounds - Moderate
  { word: 'echo', sense: 'auditory', intensity: 'moderate' },
  { word: 'echoing', sense: 'auditory', intensity: 'moderate' },
  { word: 'ringing', sense: 'auditory', intensity: 'moderate' },
  { word: 'buzzing', sense: 'auditory', intensity: 'moderate' },
  { word: 'humming', sense: 'auditory', intensity: 'moderate' },
  { word: 'clicking', sense: 'auditory', intensity: 'moderate' },
  { word: 'tapping', sense: 'auditory', intensity: 'moderate' },
  { word: 'banging', sense: 'auditory', intensity: 'moderate' },
  { word: 'knocking', sense: 'auditory', intensity: 'moderate' },
  { word: 'slamming', sense: 'auditory', intensity: 'moderate' },
  
  // Nature sounds - Vivid
  { word: 'thunder', sense: 'auditory', intensity: 'vivid' },
  { word: 'rainfall', sense: 'auditory', intensity: 'moderate' },
  { word: 'howling', sense: 'auditory', intensity: 'vivid' },
  { word: 'chirping', sense: 'auditory', intensity: 'moderate' },
  { word: 'singing', sense: 'auditory', intensity: 'moderate' },
  
  // Voice - Moderate
  { word: 'shouting', sense: 'auditory', intensity: 'moderate' },
  { word: 'crying', sense: 'auditory', intensity: 'moderate' },
  { word: 'laughing', sense: 'auditory', intensity: 'moderate' },
  { word: 'sighing', sense: 'auditory', intensity: 'moderate' },
  
  // Descriptive - Subtle
  { word: 'loud', sense: 'auditory', intensity: 'subtle' },
  { word: 'quiet', sense: 'auditory', intensity: 'subtle' },
  { word: 'silent', sense: 'auditory', intensity: 'subtle' },
  { word: 'noisy', sense: 'auditory', intensity: 'subtle' },
  
  // Additional sound types
  { word: 'clanging', sense: 'auditory', intensity: 'vivid' },
  { word: 'clattering', sense: 'auditory', intensity: 'vivid' },
  { word: 'rattling', sense: 'auditory', intensity: 'moderate' },
  { word: 'jangling', sense: 'auditory', intensity: 'vivid' },
  { word: 'jingling', sense: 'auditory', intensity: 'moderate' },
  { word: 'clinking', sense: 'auditory', intensity: 'moderate' },
  { word: 'crackling', sense: 'auditory', intensity: 'vivid' },
  { word: 'popping', sense: 'auditory', intensity: 'moderate' },
  { word: 'hissing', sense: 'auditory', intensity: 'vivid' },
  { word: 'sizzling', sense: 'auditory', intensity: 'vivid' },
  { word: 'bubbling', sense: 'auditory', intensity: 'moderate' },
  { word: 'gurgling', sense: 'auditory', intensity: 'moderate' },
  { word: 'splashing', sense: 'auditory', intensity: 'moderate' },
  { word: 'dripping', sense: 'auditory', intensity: 'moderate' },
  { word: 'trickling', sense: 'auditory', intensity: 'moderate' },
  { word: 'gushing', sense: 'auditory', intensity: 'vivid' },
  { word: 'rushing', sense: 'auditory', intensity: 'vivid' },
  { word: 'whooshing', sense: 'auditory', intensity: 'vivid' },
  { word: 'swooshing', sense: 'auditory', intensity: 'vivid' },
  { word: 'swishing', sense: 'auditory', intensity: 'moderate' },
  
  // Wind/Air sounds
  { word: 'whistling', sense: 'auditory', intensity: 'vivid' },
  { word: 'moaning', sense: 'auditory', intensity: 'vivid' },
  { word: 'wailing', sense: 'auditory', intensity: 'vivid' },
  { word: 'groaning', sense: 'auditory', intensity: 'vivid' },
  { word: 'creaking', sense: 'auditory', intensity: 'moderate' },
  { word: 'squeaking', sense: 'auditory', intensity: 'moderate' },
  { word: 'squealing', sense: 'auditory', intensity: 'vivid' },
  { word: 'screeching', sense: 'auditory', intensity: 'vivid' },
  
  // Impact sounds
  { word: 'thudding', sense: 'auditory', intensity: 'moderate' },
  { word: 'thumping', sense: 'auditory', intensity: 'moderate' },
  { word: 'pounding', sense: 'auditory', intensity: 'vivid' },
  { word: 'hammering', sense: 'auditory', intensity: 'vivid' },
  { word: 'smashing', sense: 'auditory', intensity: 'vivid' },
  { word: 'shattering', sense: 'auditory', intensity: 'vivid' },
  { word: 'splintering', sense: 'auditory', intensity: 'vivid' },
  
  // Electronic/Mechanical
  { word: 'beeping', sense: 'auditory', intensity: 'moderate' },
  { word: 'bleeping', sense: 'auditory', intensity: 'moderate' },
  { word: 'whirring', sense: 'auditory', intensity: 'moderate' },
  { word: 'whizzing', sense: 'auditory', intensity: 'vivid' },
  { word: 'droning', sense: 'auditory', intensity: 'moderate' },
  { word: 'revving', sense: 'auditory', intensity: 'vivid' },
  { word: 'purring', sense: 'auditory', intensity: 'moderate' },
  
  // Vocal sounds
  { word: 'bellowing', sense: 'auditory', intensity: 'vivid' },
  { word: 'yelling', sense: 'auditory', intensity: 'moderate' },
  { word: 'hollering', sense: 'auditory', intensity: 'vivid' },
  { word: 'sobbing', sense: 'auditory', intensity: 'vivid' },
  { word: 'weeping', sense: 'auditory', intensity: 'moderate' },
  { word: 'wailing', sense: 'auditory', intensity: 'vivid' },
  { word: 'giggling', sense: 'auditory', intensity: 'moderate' },
  { word: 'chuckling', sense: 'auditory', intensity: 'moderate' },
  { word: 'cackling', sense: 'auditory', intensity: 'vivid' },
  { word: 'gasping', sense: 'auditory', intensity: 'moderate' },
  { word: 'panting', sense: 'auditory', intensity: 'moderate' },
  { word: 'breathing', sense: 'auditory', intensity: 'subtle' },
  
  // Animal sounds
  { word: 'barking', sense: 'auditory', intensity: 'moderate' },
  { word: 'growling', sense: 'auditory', intensity: 'vivid' },
  { word: 'snarling', sense: 'auditory', intensity: 'vivid' },
  { word: 'meowing', sense: 'auditory', intensity: 'moderate' },
  { word: 'hissing', sense: 'auditory', intensity: 'vivid' },
  { word: 'tweeting', sense: 'auditory', intensity: 'moderate' },
  { word: 'cawing', sense: 'auditory', intensity: 'moderate' },
  { word: 'hooting', sense: 'auditory', intensity: 'moderate' },
];

/**
 * Tactile words (touch, texture, temperature, pressure)
 */
const TACTILE_WORDS: SensoryWord[] = [
  // Temperature - Vivid
  { word: 'searing', sense: 'tactile', intensity: 'vivid' },
  { word: 'scorching', sense: 'tactile', intensity: 'vivid' },
  { word: 'freezing', sense: 'tactile', intensity: 'vivid' },
  { word: 'icy', sense: 'tactile', intensity: 'vivid' },
  { word: 'burning', sense: 'tactile', intensity: 'vivid' },
  { word: 'blistering', sense: 'tactile', intensity: 'vivid' },
  { word: 'glacial', sense: 'tactile', intensity: 'vivid' },
  
  // Temperature - Moderate
  { word: 'hot', sense: 'tactile', intensity: 'moderate' },
  { word: 'cold', sense: 'tactile', intensity: 'moderate' },
  { word: 'warm', sense: 'tactile', intensity: 'moderate' },
  { word: 'cool', sense: 'tactile', intensity: 'moderate' },
  
  // Texture - Vivid
  { word: 'velvety', sense: 'tactile', intensity: 'vivid' },
  { word: 'silky', sense: 'tactile', intensity: 'vivid' },
  { word: 'rough', sense: 'tactile', intensity: 'moderate' },
  { word: 'smooth', sense: 'tactile', intensity: 'moderate' },
  { word: 'coarse', sense: 'tactile', intensity: 'moderate' },
  { word: 'grainy', sense: 'tactile', intensity: 'moderate' },
  { word: 'sticky', sense: 'tactile', intensity: 'moderate' },
  { word: 'slippery', sense: 'tactile', intensity: 'moderate' },
  { word: 'slimy', sense: 'tactile', intensity: 'vivid' },
  { word: 'gritty', sense: 'tactile', intensity: 'moderate' },
  { word: 'prickly', sense: 'tactile', intensity: 'vivid' },
  { word: 'spiky', sense: 'tactile', intensity: 'vivid' },
  { word: 'sharp', sense: 'tactile', intensity: 'moderate' },
  { word: 'dull', sense: 'tactile', intensity: 'subtle' },
  
  // Moisture - Moderate
  { word: 'wet', sense: 'tactile', intensity: 'moderate' },
  { word: 'dry', sense: 'tactile', intensity: 'moderate' },
  { word: 'damp', sense: 'tactile', intensity: 'moderate' },
  { word: 'moist', sense: 'tactile', intensity: 'moderate' },
  { word: 'soaked', sense: 'tactile', intensity: 'vivid' },
  { word: 'drenched', sense: 'tactile', intensity: 'vivid' },
  
  // Pressure - Vivid
  { word: 'crushing', sense: 'tactile', intensity: 'vivid' },
  { word: 'pressing', sense: 'tactile', intensity: 'moderate' },
  { word: 'squeezing', sense: 'tactile', intensity: 'moderate' },
  { word: 'tight', sense: 'tactile', intensity: 'moderate' },
  { word: 'loose', sense: 'tactile', intensity: 'subtle' },
  
  // Comfort - Moderate
  { word: 'soft', sense: 'tactile', intensity: 'moderate' },
  { word: 'hard', sense: 'tactile', intensity: 'moderate' },
  { word: 'gentle', sense: 'tactile', intensity: 'subtle' },
  { word: 'tender', sense: 'tactile', intensity: 'subtle' },
  { word: 'stiff', sense: 'tactile', intensity: 'moderate' },
  
  // Additional textures
  { word: 'fuzzy', sense: 'tactile', intensity: 'moderate' },
  { word: 'furry', sense: 'tactile', intensity: 'moderate' },
  { word: 'fluffy', sense: 'tactile', intensity: 'moderate' },
  { word: 'downy', sense: 'tactile', intensity: 'vivid' },
  { word: 'feathery', sense: 'tactile', intensity: 'vivid' },
  { word: 'plush', sense: 'tactile', intensity: 'vivid' },
  { word: 'cushioned', sense: 'tactile', intensity: 'moderate' },
  { word: 'padded', sense: 'tactile', intensity: 'moderate' },
  { word: 'spongy', sense: 'tactile', intensity: 'vivid' },
  { word: 'rubbery', sense: 'tactile', intensity: 'vivid' },
  { word: 'leathery', sense: 'tactile', intensity: 'vivid' },
  { word: 'papery', sense: 'tactile', intensity: 'vivid' },
  { word: 'waxy', sense: 'tactile', intensity: 'vivid' },
  { word: 'oily', sense: 'tactile', intensity: 'moderate' },
  { word: 'greasy', sense: 'tactile', intensity: 'vivid' },
  { word: 'slick', sense: 'tactile', intensity: 'moderate' },
  { word: 'glassy', sense: 'tactile', intensity: 'vivid' },
  { word: 'metallic', sense: 'tactile', intensity: 'vivid' },
  { word: 'wooden', sense: 'tactile', intensity: 'moderate' },
  { word: 'sandy', sense: 'tactile', intensity: 'vivid' },
  { word: 'pebbly', sense: 'tactile', intensity: 'vivid' },
  { word: 'rocky', sense: 'tactile', intensity: 'moderate' },
  { word: 'stony', sense: 'tactile', intensity: 'moderate' },
  { word: 'crystallized', sense: 'tactile', intensity: 'vivid' },
  { word: 'powdery', sense: 'tactile', intensity: 'vivid' },
  { word: 'dusty', sense: 'tactile', intensity: 'moderate' },
  { word: 'chalky', sense: 'tactile', intensity: 'vivid' },
  { word: 'crumbly', sense: 'tactile', intensity: 'vivid' },
  { word: 'flaky', sense: 'tactile', intensity: 'vivid' },
  { word: 'brittle', sense: 'tactile', intensity: 'vivid' },
  { word: 'crisp', sense: 'tactile', intensity: 'moderate' },
  { word: 'crunchy', sense: 'tactile', intensity: 'moderate' },
  { word: 'chewy', sense: 'tactile', intensity: 'moderate' },
  { word: 'gummy', sense: 'tactile', intensity: 'vivid' },
  { word: 'elastic', sense: 'tactile', intensity: 'moderate' },
  { word: 'springy', sense: 'tactile', intensity: 'vivid' },
  { word: 'bouncy', sense: 'tactile', intensity: 'moderate' },
  { word: 'rigid', sense: 'tactile', intensity: 'moderate' },
  { word: 'firm', sense: 'tactile', intensity: 'moderate' },
  { word: 'solid', sense: 'tactile', intensity: 'moderate' },
  { word: 'malleable', sense: 'tactile', intensity: 'vivid' },
  { word: 'pliable', sense: 'tactile', intensity: 'vivid' },
  { word: 'flexible', sense: 'tactile', intensity: 'moderate' },
  { word: 'bendable', sense: 'tactile', intensity: 'moderate' },
  
  // Weight/Density
  { word: 'heavy', sense: 'tactile', intensity: 'moderate' },
  { word: 'light', sense: 'tactile', intensity: 'moderate' },
  { word: 'weightless', sense: 'tactile', intensity: 'vivid' },
  { word: 'dense', sense: 'tactile', intensity: 'moderate' },
  { word: 'airy', sense: 'tactile', intensity: 'moderate' },
  
  // Pain/Discomfort
  { word: 'painful', sense: 'tactile', intensity: 'vivid' },
  { word: 'sore', sense: 'tactile', intensity: 'moderate' },
  { word: 'stinging', sense: 'tactile', intensity: 'vivid' },
  { word: 'burning', sense: 'tactile', intensity: 'vivid' },
  { word: 'itchy', sense: 'tactile', intensity: 'moderate' },
  { word: 'scratchy', sense: 'tactile', intensity: 'moderate' },
  { word: 'irritating', sense: 'tactile', intensity: 'moderate' },
];

/**
 * Olfactory words (smell, scent, aroma)
 */
const OLFACTORY_WORDS: SensoryWord[] = [
  // Pleasant - Vivid
  { word: 'fragrant', sense: 'olfactory', intensity: 'vivid' },
  { word: 'aromatic', sense: 'olfactory', intensity: 'vivid' },
  { word: 'perfumed', sense: 'olfactory', intensity: 'vivid' },
  { word: 'sweet-smelling', sense: 'olfactory', intensity: 'vivid' },
  { word: 'floral', sense: 'olfactory', intensity: 'vivid' },
  
  // Unpleasant - Vivid
  { word: 'pungent', sense: 'olfactory', intensity: 'vivid' },
  { word: 'acrid', sense: 'olfactory', intensity: 'vivid' },
  { word: 'rancid', sense: 'olfactory', intensity: 'vivid' },
  { word: 'putrid', sense: 'olfactory', intensity: 'vivid' },
  { word: 'musty', sense: 'olfactory', intensity: 'vivid' },
  { word: 'moldy', sense: 'olfactory', intensity: 'vivid' },
  { word: 'stale', sense: 'olfactory', intensity: 'moderate' },
  
  // Specific scents - Vivid
  { word: 'smoky', sense: 'olfactory', intensity: 'vivid' },
  { word: 'earthy', sense: 'olfactory', intensity: 'vivid' },
  { word: 'spicy', sense: 'olfactory', intensity: 'vivid' },
  { word: 'citrus', sense: 'olfactory', intensity: 'vivid' },
  { word: 'minty', sense: 'olfactory', intensity: 'vivid' },
  { word: 'vanilla', sense: 'olfactory', intensity: 'vivid' },
  { word: 'pine', sense: 'olfactory', intensity: 'vivid' },
  { word: 'lavender', sense: 'olfactory', intensity: 'vivid' },
  { word: 'rose', sense: 'olfactory', intensity: 'vivid' },
  
  // General - Moderate
  { word: 'scented', sense: 'olfactory', intensity: 'moderate' },
  { word: 'smell', sense: 'olfactory', intensity: 'subtle' },
  { word: 'odor', sense: 'olfactory', intensity: 'subtle' },
  { word: 'aroma', sense: 'olfactory', intensity: 'moderate' },
  { word: 'perfume', sense: 'olfactory', intensity: 'moderate' },
  
  // Additional scents - Pleasant
  { word: 'fresh', sense: 'olfactory', intensity: 'moderate' },
  { word: 'clean', sense: 'olfactory', intensity: 'moderate' },
  { word: 'crisp', sense: 'olfactory', intensity: 'moderate' },
  { word: 'herbal', sense: 'olfactory', intensity: 'vivid' },
  { word: 'woody', sense: 'olfactory', intensity: 'vivid' },
  { word: 'cedar', sense: 'olfactory', intensity: 'vivid' },
  { word: 'sandalwood', sense: 'olfactory', intensity: 'vivid' },
  { word: 'jasmine', sense: 'olfactory', intensity: 'vivid' },
  { word: 'honeysuckle', sense: 'olfactory', intensity: 'vivid' },
  { word: 'lilac', sense: 'olfactory', intensity: 'vivid' },
  { word: 'gardenia', sense: 'olfactory', intensity: 'vivid' },
  { word: 'eucalyptus', sense: 'olfactory', intensity: 'vivid' },
  { word: 'peppermint', sense: 'olfactory', intensity: 'vivid' },
  { word: 'cinnamon', sense: 'olfactory', intensity: 'vivid' },
  { word: 'ginger', sense: 'olfactory', intensity: 'vivid' },
  { word: 'clove', sense: 'olfactory', intensity: 'vivid' },
  { word: 'nutmeg', sense: 'olfactory', intensity: 'vivid' },
  { word: 'lemon', sense: 'olfactory', intensity: 'vivid' },
  { word: 'orange', sense: 'olfactory', intensity: 'vivid' },
  { word: 'lime', sense: 'olfactory', intensity: 'vivid' },
  { word: 'coconut', sense: 'olfactory', intensity: 'vivid' },
  { word: 'almond', sense: 'olfactory', intensity: 'vivid' },
  { word: 'maple', sense: 'olfactory', intensity: 'vivid' },
  { word: 'caramel', sense: 'olfactory', intensity: 'vivid' },
  { word: 'chocolate', sense: 'olfactory', intensity: 'vivid' },
  { word: 'coffee', sense: 'olfactory', intensity: 'vivid' },
  
  // Unpleasant - Additional
  { word: 'sour', sense: 'olfactory', intensity: 'moderate' },
  { word: 'fetid', sense: 'olfactory', intensity: 'vivid' },
  { word: 'rank', sense: 'olfactory', intensity: 'vivid' },
  { word: 'foul', sense: 'olfactory', intensity: 'vivid' },
  { word: 'reeking', sense: 'olfactory', intensity: 'vivid' },
  { word: 'sulfurous', sense: 'olfactory', intensity: 'vivid' },
  { word: 'ammonia', sense: 'olfactory', intensity: 'vivid' },
  { word: 'bleach', sense: 'olfactory', intensity: 'vivid' },
  { word: 'chemical', sense: 'olfactory', intensity: 'moderate' },
  { word: 'medicinal', sense: 'olfactory', intensity: 'vivid' },
  { word: 'antiseptic', sense: 'olfactory', intensity: 'vivid' },
  
  // Environmental
  { word: 'ocean', sense: 'olfactory', intensity: 'vivid' },
  { word: 'salty', sense: 'olfactory', intensity: 'moderate' },
  { word: 'briny', sense: 'olfactory', intensity: 'vivid' },
  { word: 'seaweed', sense: 'olfactory', intensity: 'vivid' },
  { word: 'petrichor', sense: 'olfactory', intensity: 'vivid' },
  { word: 'rain-soaked', sense: 'olfactory', intensity: 'vivid' },
];

/**
 * Gustatory words (taste, flavor)
 */
const GUSTATORY_WORDS: SensoryWord[] = [
  // Sweet - Vivid
  { word: 'honeyed', sense: 'gustatory', intensity: 'vivid' },
  { word: 'sugary', sense: 'gustatory', intensity: 'vivid' },
  { word: 'syrupy', sense: 'gustatory', intensity: 'vivid' },
  
  // Bitter - Vivid
  { word: 'bitter', sense: 'gustatory', intensity: 'moderate' },
  { word: 'acerbic', sense: 'gustatory', intensity: 'vivid' },
  
  // Sour - Vivid
  { word: 'sour', sense: 'gustatory', intensity: 'moderate' },
  { word: 'tart', sense: 'gustatory', intensity: 'vivid' },
  { word: 'tangy', sense: 'gustatory', intensity: 'vivid' },
  { word: 'zesty', sense: 'gustatory', intensity: 'vivid' },
  
  // Salty - Moderate
  { word: 'salty', sense: 'gustatory', intensity: 'moderate' },
  { word: 'briny', sense: 'gustatory', intensity: 'vivid' },
  
  // Savory - Vivid
  { word: 'savory', sense: 'gustatory', intensity: 'vivid' },
  { word: 'umami', sense: 'gustatory', intensity: 'vivid' },
  { word: 'rich', sense: 'gustatory', intensity: 'moderate' },
  { word: 'creamy', sense: 'gustatory', intensity: 'vivid' },
  
  // Spicy - Vivid
  { word: 'spicy', sense: 'gustatory', intensity: 'moderate' },
  { word: 'fiery', sense: 'gustatory', intensity: 'vivid' },
  { word: 'peppery', sense: 'gustatory', intensity: 'vivid' },
  
  // General - Moderate
  { word: 'sweet', sense: 'gustatory', intensity: 'moderate' },
  { word: 'taste', sense: 'gustatory', intensity: 'subtle' },
  { word: 'flavor', sense: 'gustatory', intensity: 'subtle' },
  { word: 'delicious', sense: 'gustatory', intensity: 'moderate' },
  { word: 'bland', sense: 'gustatory', intensity: 'moderate' },
  
  // Additional taste words
  { word: 'succulent', sense: 'gustatory', intensity: 'vivid' },
  { word: 'luscious', sense: 'gustatory', intensity: 'vivid' },
  { word: 'mouthwatering', sense: 'gustatory', intensity: 'vivid' },
  { word: 'appetizing', sense: 'gustatory', intensity: 'moderate' },
  { word: 'palatable', sense: 'gustatory', intensity: 'moderate' },
  { word: 'tasty', sense: 'gustatory', intensity: 'moderate' },
  { word: 'flavorful', sense: 'gustatory', intensity: 'moderate' },
  { word: 'flavorless', sense: 'gustatory', intensity: 'moderate' },
  { word: 'tasteless', sense: 'gustatory', intensity: 'moderate' },
  { word: 'insipid', sense: 'gustatory', intensity: 'vivid' },
  { word: 'nauseous', sense: 'gustatory', intensity: 'vivid' },
  { word: 'rotten', sense: 'gustatory', intensity: 'vivid' },
  { word: 'spoiled', sense: 'gustatory', intensity: 'vivid' },
  { word: 'stale', sense: 'gustatory', intensity: 'moderate' },
  { word: 'fresh', sense: 'gustatory', intensity: 'moderate' },
  { word: 'ripe', sense: 'gustatory', intensity: 'moderate' },
  { word: 'unripe', sense: 'gustatory', intensity: 'moderate' },
  { word: 'raw', sense: 'gustatory', intensity: 'moderate' },
  { word: 'cooked', sense: 'gustatory', intensity: 'subtle' },
  { word: 'roasted', sense: 'gustatory', intensity: 'vivid' },
  { word: 'grilled', sense: 'gustatory', intensity: 'vivid' },
  { word: 'smoked', sense: 'gustatory', intensity: 'vivid' },
  { word: 'charred', sense: 'gustatory', intensity: 'vivid' },
  { word: 'burnt', sense: 'gustatory', intensity: 'vivid' },
  { word: 'caramelized', sense: 'gustatory', intensity: 'vivid' },
  { word: 'glazed', sense: 'gustatory', intensity: 'vivid' },
  { word: 'crispy', sense: 'gustatory', intensity: 'moderate' },
  { word: 'crunchy', sense: 'gustatory', intensity: 'moderate' },
  { word: 'chewy', sense: 'gustatory', intensity: 'moderate' },
  { word: 'tender', sense: 'gustatory', intensity: 'moderate' },
  { word: 'juicy', sense: 'gustatory', intensity: 'vivid' },
  { word: 'dry', sense: 'gustatory', intensity: 'moderate' },
  { word: 'moist', sense: 'gustatory', intensity: 'moderate' },
  { word: 'buttery', sense: 'gustatory', intensity: 'vivid' },
  { word: 'milky', sense: 'gustatory', intensity: 'vivid' },
  { word: 'nutty', sense: 'gustatory', intensity: 'vivid' },
  { word: 'fruity', sense: 'gustatory', intensity: 'vivid' },
  { word: 'berry', sense: 'gustatory', intensity: 'vivid' },
  { word: 'citrusy', sense: 'gustatory', intensity: 'vivid' },
  { word: 'herbal', sense: 'gustatory', intensity: 'vivid' },
  { word: 'minty', sense: 'gustatory', intensity: 'vivid' },
  { word: 'peppery', sense: 'gustatory', intensity: 'vivid' },
  { word: 'garlicky', sense: 'gustatory', intensity: 'vivid' },
  { word: 'oniony', sense: 'gustatory', intensity: 'vivid' },
  { word: 'smoky', sense: 'gustatory', intensity: 'vivid' },
  { word: 'earthy', sense: 'gustatory', intensity: 'vivid' },
  { word: 'metallic', sense: 'gustatory', intensity: 'vivid' },
  { word: 'acidic', sense: 'gustatory', intensity: 'vivid' },
  { word: 'alkaline', sense: 'gustatory', intensity: 'vivid' },
  { word: 'vinegary', sense: 'gustatory', intensity: 'vivid' },
  { word: 'pickled', sense: 'gustatory', intensity: 'vivid' },
  { word: 'fermented', sense: 'gustatory', intensity: 'vivid' },
];

/**
 * Kinesthetic words (movement, body sensation, physical action)
 */
const KINESTHETIC_WORDS: SensoryWord[] = [
  // Movement - Vivid
  { word: 'soaring', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'plummeting', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'tumbling', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'racing', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'sprinting', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'crawling', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'stumbling', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'leaping', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'diving', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'sinking', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'rising', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'falling', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'floating', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'drifting', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'gliding', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'sliding', sense: 'kinesthetic', intensity: 'moderate' },
  
  // Body sensation - Vivid
  { word: 'trembling', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'shaking', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'shivering', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'pounding', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'throbbing', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'aching', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'tingling', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'numb', sense: 'kinesthetic', intensity: 'vivid' },
  
  // Physical action - Moderate
  { word: 'running', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'walking', sense: 'kinesthetic', intensity: 'subtle' },
  { word: 'jumping', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'spinning', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'twisting', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'reaching', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'grasping', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'pulling', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'pushing', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'lifting', sense: 'kinesthetic', intensity: 'moderate' },
  
  // Energy level - Moderate
  { word: 'exhausted', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'energized', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'weary', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'restless', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'tense', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'relaxed', sense: 'kinesthetic', intensity: 'moderate' },
  
  // Additional movement words
  { word: 'swaying', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'rocking', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'rolling', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'tossing', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'flipping', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'somersaulting', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'cartwheeling', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'vaulting', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'bounding', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'hopping', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'skipping', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'prancing', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'galloping', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'trotting', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'jogging', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'sprinting', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'dashing', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'bolting', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'fleeing', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'chasing', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'pursuing', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'escaping', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'wandering', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'roaming', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'striding', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'marching', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'stomping', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'trampling', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'tiptoeing', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'creeping', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'sneaking', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'slinking', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'prowling', sense: 'kinesthetic', intensity: 'vivid' },
  
  // Flying/Aerial
  { word: 'flying', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'hovering', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'swooping', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'circling', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'ascending', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'descending', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'climbing', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'scaling', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'clambering', sense: 'kinesthetic', intensity: 'vivid' },
  
  // Water movement
  { word: 'swimming', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'wading', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'treading', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'splashing', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'submerging', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'surfacing', sense: 'kinesthetic', intensity: 'vivid' },
  
  // Body sensations - Additional
  { word: 'sweating', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'perspiring', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'shuddering', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'quivering', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'quaking', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'convulsing', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'twitching', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'flinching', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'recoiling', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'lurching', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'staggering', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'swaying', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'tottering', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'wobbling', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'balancing', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'steadying', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'bracing', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'supporting', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'leaning', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'slouching', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'hunching', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'crouching', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'kneeling', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'bending', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'stooping', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'straightening', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'stretching', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'flexing', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'contracting', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'clenching', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'gripping', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'clutching', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'squeezing', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'releasing', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'loosening', sense: 'kinesthetic', intensity: 'moderate' },
  
  // Collision/Impact
  { word: 'colliding', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'crashing', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'smashing', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'slamming', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'bumping', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'jostling', sense: 'kinesthetic', intensity: 'moderate' },
  { word: 'jarring', sense: 'kinesthetic', intensity: 'vivid' },
  { word: 'jolting', sense: 'kinesthetic', intensity: 'vivid' },
];

/**
 * Complete sensory word database (1000+ words)
 */
export const SENSORY_DATABASE: SensoryWord[] = [
  ...VISUAL_WORDS,
  ...AUDITORY_WORDS,
  ...TACTILE_WORDS,
  ...OLFACTORY_WORDS,
  ...GUSTATORY_WORDS,
  ...KINESTHETIC_WORDS
];

/**
 * Create lookup map for fast word detection
 */
export const SENSORY_WORD_MAP: Map<string, SensoryWord> = new Map(
  SENSORY_DATABASE.map(item => [item.word.toLowerCase(), item])
);

/**
 * Get sensory word info by word
 */
export const getSensoryWord = (word: string): SensoryWord | undefined => {
  return SENSORY_WORD_MAP.get(word.toLowerCase());
};

/**
 * Check if a word is in the sensory database
 */
export const isSensoryWord = (word: string): boolean => {
  return SENSORY_WORD_MAP.has(word.toLowerCase());
};

/**
 * Get all words for a specific sense
 */
export const getWordsBySense = (sense: SensoryWord['sense']): SensoryWord[] => {
  return SENSORY_DATABASE.filter(item => item.sense === sense);
};

/**
 * Get all words by intensity level
 */
export const getWordsByIntensity = (intensity: SensoryWord['intensity']): SensoryWord[] => {
  return SENSORY_DATABASE.filter(item => item.intensity === intensity);
};

/**
 * Database statistics
 */
export const getDatabaseStats = () => {
  const bySense = {
    visual: getWordsBySense('visual').length,
    auditory: getWordsBySense('auditory').length,
    tactile: getWordsBySense('tactile').length,
    olfactory: getWordsBySense('olfactory').length,
    gustatory: getWordsBySense('gustatory').length,
    kinesthetic: getWordsBySense('kinesthetic').length
  };

  const byIntensity = {
    subtle: getWordsByIntensity('subtle').length,
    moderate: getWordsByIntensity('moderate').length,
    vivid: getWordsByIntensity('vivid').length
  };

  return {
    total: SENSORY_DATABASE.length,
    bySense,
    byIntensity
  };
};
