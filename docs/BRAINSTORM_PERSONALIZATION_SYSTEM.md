# 🎯 BRAINSTORM: Personalization System

## 📋 Executive Summary
Create an **optional personalization modal** that transforms generic songwriting into deeply personal storytelling by grounding the song in the user's real-world context. This system will collect user-specific data (location, relationships, memories, preferences) and intelligently weave it into the song generation process.

### Core Philosophy
**"Your Story, Your Song"** - Move from generic "I met someone in the city" to specific "I met you at Fitzroy Gardens, Melbourne sun warming our skin."

---

## 🎨 1. UI DESIGN: THE PERSONALIZATION MODAL

### Trigger Location
**Parameters Page**: Add a prominent button below the existing form fields:

```
┌─────────────────────────────────────────┐
│  [Artist Reference]                      │
│  [Topic]                                 │
│  [Mood]                                  │
│  [Genre]                                 │
│  ...existing fields...                   │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  ✨ PERSONALIZE THIS SONG           │ │
│  │  Make it uniquely yours with real  │ │
│  │  places, people & metaphors        │ │
│  │  [Open Personalization Studio] →   │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Modal Structure (3-Tab Design)

```
╔═══════════════════════════════════════════════════════════╗
║  ✨ PERSONALIZATION STUDIO                      [X Close] ║
╠═══════════════════════════════════════════════════════════╣
║  [📍 Your World] [💭 Metaphor Lab] [💎 Power Lines]      ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  [Tab content goes here]                                  ║
║                                                            ║
║                                                            ║
╠═══════════════════════════════════════════════════════════╣
║  [Cancel]                        [Apply Personalization] ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 📍 2. TAB 1: "YOUR WORLD" (Grounding Context)

### Purpose
Collect real-world details that replace generic references with specific, authentic details.

### Input Fields

#### 2.1 Location Context
```
┌─ LOCATION GROUNDING ─────────────────────────────┐
│                                                   │
│  Where do you live?                              │
│  [                                            ] │
│  Example: "South Yarra, Melbourne, Australia"    │
│                                                   │
│  🤖 AI Suggestion: "I can reference:"            │
│  • Chapel Street, Toorak Road                    │
│  • Yarra River views                             │
│  • Melbourne's laneways & coffee culture         │
│  • Australian slang (arvo, servo, bottle-o)      │
│                                                   │
│  ☑️ Use location-specific details                │
│  ☑️ Include local landmarks                      │
│  ☐ Keep it subtle (don't overuse)               │
│                                                   │
└───────────────────────────────────────────────────┘
```

#### 2.2 Relationship Context (Optional)
```
┌─ WHO IS THIS SONG ABOUT? ────────────────────────┐
│                                                   │
│  Person's Name (or leave blank)                  │
│  [                                            ] │
│                                                   │
│  Relationship Type:                              │
│  ○ Romantic Partner                              │
│  ○ Ex-Partner                                    │
│  ○ Crush                                         │
│  ○ Friend                                        │
│  ○ Family Member                                 │
│  ○ Myself (introspective)                        │
│  ○ Abstract/No specific person                   │
│                                                   │
│  Key Detail (Optional):                          │
│  [                                            ] │
│  Example: "Their laugh", "Blue eyes", "Scar on their hand"
│                                                   │
└───────────────────────────────────────────────────┘
```

#### 2.3 Memory Anchor (Specific Event)
```
┌─ ANCHOR THIS SONG TO A MEMORY ───────────────────┐
│                                                   │
│  Describe a specific moment (optional):          │
│  [                                            ] │
│  [                                            ] │
│  Example: "The night we drove to the beach at 2am"
│  Example: "When I got the call about my promotion"
│                                                   │
│  🤖 AI will extract:                             │
│  • Time of day (night, dawn, afternoon)          │
│  • Setting (beach, car, office, home)            │
│  • Sensory details (sound of waves, smell of coffee)
│  • Emotion (excitement, sadness, relief)         │
│                                                   │
└───────────────────────────────────────────────────┘
```

#### 2.4 Cultural/Personal Preferences
```
┌─ YOUR VIBE ───────────────────────────────────────┐
│                                                   │
│  I prefer language that is:                      │
│  ○ Poetic & Abstract                             │
│  ○ Direct & Conversational                       │
│  ○ Slang & Casual                                │
│  ○ Formal & Elevated                             │
│                                                   │
│  References I love (optional):                   │
│  ☐ Movies/TV shows I watch                      │
│  ☐ Books I read                                  │
│  ☐ Hobbies (sports, art, gaming, etc.)          │
│  ☐ Cultural background/heritage                  │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

## 💭 3. TAB 2: "METAPHOR LAB" (Central Hook)

### Purpose
Generate metaphor suggestions based on user's topic/mood, then let them choose one as the song's thematic anchor.

### Workflow

#### Step 1: AI Generates 5 Metaphor Options
Based on the user's **Topic** + **Mood** + **Genre** from main form:

```
┌─ METAPHOR SUGGESTIONS ────────────────────────────────────┐
│                                                            │
│  Based on your topic "Lost Love" + mood "Melancholic"     │
│  + genre "Indie Folk", here are metaphor themes:          │
│                                                            │
│  ○ 1. "Fading Polaroids" (Visual)                         │
│     → Memories losing color over time                     │
│     Works well for: Storytelling, nostalgic imagery       │
│                                                            │
│  ○ 2. "Empty Passenger Seat" (Spatial)                    │
│     → Physical absence, routine disrupted                 │
│     Works well for: Specific, relatable moments           │
│                                                            │
│  ○ 3. "Crumbling Lighthouse" (Symbolic)                   │
│     → Lost guidance, fading beacon                        │
│     Works well for: Poetic, dramatic tone                 │
│                                                            │
│  ○ 4. "Silence After the Song Ends" (Auditory)            │
│     → Void left behind, echoing absence                   │
│     Works well for: Musicians, introspective              │
│                                                            │
│  ○ 5. "Garden Overgrown" (Natural)                        │
│     → Neglect, untended love                              │
│     Works well for: Folk, earthy imagery                  │
│                                                            │
│  ○ None - Let AI choose naturally                         │
│                                                            │
│  [Generate More Metaphors]                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Step 2: Metaphor Refinement (Optional)
```
┌─ REFINE YOUR METAPHOR ────────────────────────────────────┐
│                                                            │
│  Selected: "Fading Polaroids"                             │
│                                                            │
│  Customize (optional):                                    │
│  Replace "Polaroids" with: [                        ]     │
│  Example: "Photographs", "Memories", "Postcards"          │
│                                                            │
│  Intensity:                                               │
│  [Subtle]─────●───────────[Central Theme]                 │
│                                                            │
│  • Subtle: Mentioned 1-2 times, background element        │
│  • Central: Repeated throughout, song revolves around it  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 💎 4. TAB 3: "POWER LINES" (Pre-Written Hooks)

### Purpose
AI generates 5-7 powerful, metaphor-aligned lines. User selects up to 3 to include in the song.

### Workflow

#### Step 1: AI Generates Lines (Based on Metaphor + Context)
```
┌─ POWER LINE SUGGESTIONS ──────────────────────────────────┐
│                                                            │
│  These lines complement "Fading Polaroids" metaphor:      │
│                                                            │
│  ☐ 1. "Your smile's blurring at the edges now"           │
│     Best fit: Verse 2, Pre-Chorus                         │
│     Syllable count: 11 (fits most meters)                 │
│                                                            │
│  ☐ 2. "I keep you in a shoebox under my bed"             │
│     Best fit: Bridge, Verse 1                             │
│     Syllable count: 12 (standard pop line)                │
│                                                            │
│  ☐ 3. "Fading faster than I can remember you"            │
│     Best fit: Chorus (hook potential)                     │
│     Syllable count: 13 (slightly long, but singable)      │
│                                                            │
│  ☐ 4. "The colors don't look right anymore"              │
│     Best fit: Post-Chorus, Outro                          │
│     Syllable count: 10 (smooth, concise)                  │
│                                                            │
│  ☐ 5. "Ghosts of what we were, captured in a moment"     │
│     Best fit: Bridge (climactic)                          │
│     Syllable count: 14 (requires breath control)          │
│                                                            │
│  [Generate More Lines]                                    │
│                                                            │
│  📋 Selected: 0/3                                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Step 2: Placement Preferences
```
┌─ PLACEMENT STRATEGY ──────────────────────────────────────┐
│                                                            │
│  How should these lines be used?                          │
│                                                            │
│  ○ Automatic - AI decides best placement                  │
│  ○ Prioritize Chorus - Use strongest line as hook         │
│  ○ Spread Evenly - Distribute across verses               │
│  ○ Climactic - Build toward bridge/final chorus           │
│                                                            │
│  ☑️ Adapt lines to fit song structure if needed           │
│  ☑️ Allow AI to modify syllable count for flow            │
│  ☐ Keep lines exactly as written (risky)                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🔗 5. INTEGRATION WITH SONG GENERATION

### Data Flow

```
User Fills Parameters Page
         ↓
Clicks "Personalize This Song"
         ↓
Opens Personalization Modal (3 tabs)
         ↓
Tab 1: Location + Memory Context
Tab 2: Choose Metaphor
Tab 3: Select Power Lines (0-3)
         ↓
Clicks "Apply Personalization"
         ↓
Modal Closes, Parameters Page shows:
  "✅ Personalization Applied (3 details)"
         ↓
User clicks "Generate Song"
         ↓
System sends to Gemini:
  - All standard parameters
  - Personalization Context Object
         ↓
Gemini Agents:
  1. Lyricist: Weaves in location details
  2. Storyteller: Centers narrative around metaphor
  3. Hitmaker: Integrates Power Lines into structure
  4. Vocal Coach: Ensures Power Lines are singable
  5. Producer: Validates syllable counts, adapts if needed
         ↓
Generated Song with Personal Touch
```

### Personalization Context Object (New Type)

```typescript
interface PersonalizationContext {
  yourWorld: {
    location?: {
      city: string;
      neighborhood?: string;
      country: string;
      landmarks: string[]; // AI-extracted
      culturalNotes: string[]; // AI-suggested slang, references
    };
    relationship?: {
      personName?: string; // Can be redacted in lyrics if user wants
      relationshipType: 'romantic' | 'ex' | 'crush' | 'friend' | 'family' | 'self' | 'abstract';
      keyDetail?: string;
    };
    memory?: {
      description: string;
      extractedElements: {
        timeOfDay?: string;
        setting?: string;
        sensoryDetails?: string[];
        emotion?: string;
      };
    };
    languagePreference?: 'poetic' | 'conversational' | 'slang' | 'formal';
  };
  
  metaphorLab?: {
    chosenMetaphor: string; // e.g., "Fading Polaroids"
    metaphorType: 'visual' | 'spatial' | 'symbolic' | 'auditory' | 'natural' | 'custom';
    intensity: 'subtle' | 'moderate' | 'central';
    customization?: string; // User's variation
  };
  
  powerLines: {
    selectedLines: Array<{
      text: string;
      suggestedPlacement: string[]; // ["verse2", "chorus", "bridge"]
      syllableCount: number;
      allowAdaptation: boolean;
    }>;
    placementStrategy: 'automatic' | 'prioritize-chorus' | 'spread-evenly' | 'climactic';
  };
  
  enabled: boolean; // Quick toggle for debugging
}
```

---

## 🧠 6. AI AGENT INSTRUCTIONS (Prompt Additions)

### For Lyricist Agent
```
PERSONALIZATION CONTEXT:
- Location: {location.city}, {location.country}
- Available landmarks: {location.landmarks.join(', ')}
- Language style: {languagePreference}

INSTRUCTIONS:
1. Replace generic location references with specific ones:
   ❌ "walking down the street" 
   ✅ "walking down Chapel Street"
   
2. Use local cultural details naturally:
   ❌ "let's grab a drink at the bar"
   ✅ "let's grab a drink at the pub on Toorak Road"
   
3. If relationship.keyDetail provided, reference it subtly:
   Example: "the scar on your hand" → weave into imagery

CONSTRAINT: Don't force location into every line. Use 2-3 specific references maximum.
```

### For Storyteller Agent
```
CENTRAL METAPHOR: {metaphorLab.chosenMetaphor}
Intensity: {metaphorLab.intensity}

INSTRUCTIONS:
1. If intensity = "subtle": Mention metaphor 1-2 times as background texture
2. If intensity = "central": Build entire narrative around this metaphor
   - Introduce in Verse 1
   - Expand in Verse 2
   - Climax in Bridge
   - Resolve/transform in final Chorus

3. Memory anchor provided: {memory.description}
   - Extract: {memory.extractedElements}
   - Ground the story in this specific moment
   - Use sensory details: {sensoryDetails}

CONSTRAINT: Metaphor should feel organic, not forced. If it doesn't fit the song's natural flow, adapt it creatively.
```

### For Hitmaker Agent
```
POWER LINES TO INTEGRATE:
{powerLines.selectedLines.map(line => `- "${line.text}" (${line.syllableCount} syllables, suggested: ${line.suggestedPlacement})`)}

PLACEMENT STRATEGY: {powerLines.placementStrategy}

INSTRUCTIONS:
1. Prioritize Power Lines for emotional peaks (Chorus, Bridge)
2. If syllable count doesn't match meter:
   - If allowAdaptation = true: Modify line while preserving core meaning
   - If allowAdaptation = false: Adjust surrounding lines to accommodate

3. Placement Strategy execution:
   - "prioritize-chorus": Use strongest line as main hook
   - "spread-evenly": Distribute 1 line per section
   - "climactic": Save best line for Bridge or final Chorus
   - "automatic": You decide based on song flow

CONSTRAINT: Power Lines must enhance, not disrupt. If a line kills the vibe, paraphrase it.
```

---

## 📊 7. UX FLOW DIAGRAM

```
Parameters Page
      │
      ├─ User fills: Artist, Topic, Mood, Genre, etc.
      │
      ├─ [Optional] User clicks "✨ Personalize This Song"
      │        │
      │        └─► Modal Opens (3 Tabs)
      │               │
      │               ├─ Tab 1: Your World
      │               │    • Location input → AI suggests landmarks
      │               │    • Relationship context
      │               │    • Memory anchor
      │               │
      │               ├─ Tab 2: Metaphor Lab
      │               │    • AI generates 5 metaphor options
      │               │    • User selects 1
      │               │    • Customize intensity
      │               │
      │               └─ Tab 3: Power Lines
      │                    • AI generates 7 lines based on metaphor
      │                    • User selects 0-3 lines
      │                    • Choose placement strategy
      │
      ├─ User clicks "Apply Personalization"
      │        │
      │        └─► Modal closes
      │            Badge appears: "✅ Personalization Applied"
      │
      └─ User clicks "Generate Song"
             │
             └─► Gemini receives:
                  • Standard parameters
                  • PersonalizationContext object
                  • Agents weave in personal details
                  │
                  └─► Song generated with personal touch
```

---

## 🎯 8. SMART FEATURES & ENHANCEMENTS

### 8.1 Auto-Detection
```
User types Topic: "Missing my hometown Melbourne"
                         ↓
🤖 Smart Suggestion Appears:
"I noticed you mentioned Melbourne! 
 Want to personalize this with Melbourne-specific details?
 [Yes, Personalize] [No Thanks]"
```

### 8.2 Genre-Aware Metaphors
```
If genre = "Country":
  → Suggest: "Old pickup truck", "Dusty roads", "Porch light"
  
If genre = "Hip Hop":
  → Suggest: "Crown", "Throne", "Concrete jungle"
  
If genre = "Indie Folk":
  → Suggest: "Fading photographs", "Old journals", "Empty coffee shops"
```

### 8.3 Mood-Aligned Power Lines
```
If mood = "Uplifting":
  → Generate lines with: "rising", "soaring", "breaking free", "light"
  
If mood = "Melancholic":
  → Generate lines with: "fading", "empty", "silence", "shadows"
```

### 8.4 Save Personalization Profiles
```
┌─ SAVE THIS PROFILE ───────────────────────────────────────┐
│                                                            │
│  Save these details for future songs?                     │
│  Profile Name: [My Melbourne Profile              ]      │
│                                                            │
│  ☑️ Save location (South Yarra, Melbourne)                │
│  ☑️ Save language preferences (Conversational)            │
│  ☐ Save metaphor preferences                              │
│                                                            │
│  [Save Profile]                                           │
│                                                            │
│  Saved Profiles:                                          │
│  • My Melbourne Profile (Load | Edit | Delete)            │
│  • NYC Romance (Load | Edit | Delete)                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 9. IMPLEMENTATION ROADMAP

### Phase 1: Core Modal (Week 1-2)
- [ ] Create `PersonalizationModal.tsx` component
- [ ] Build 3-tab UI (Your World, Metaphor Lab, Power Lines)
- [ ] Add trigger button to Parameters page
- [ ] Create `PersonalizationContext` type in `types.ts`

### Phase 2: AI Integration (Week 2-3)
- [ ] Create `personalizationService.ts`
- [ ] Implement `generateMetaphorSuggestions()` (uses Gemini)
- [ ] Implement `generatePowerLines()` (uses Gemini)
- [ ] Extract location landmarks from city name (Google Places API or Gemini)
- [ ] Update agent prompts to accept PersonalizationContext

### Phase 3: Smart Features (Week 3-4)
- [ ] Auto-detection from Topic field
- [ ] Genre-aware metaphor filtering
- [ ] Mood-aligned power line generation
- [ ] Syllable count validation for Power Lines
- [ ] Adaptive line modification logic

### Phase 4: Polish (Week 4)
- [ ] Save/Load personalization profiles (localStorage)
- [ ] "Clear Personalization" button
- [ ] Preview: "Here's how your song might sound with this personalization..."
- [ ] A/B test: Generic vs Personalized song comparison

---

## 💡 10. EXAMPLE USE CASES

### Example 1: Melbourne Breakup Song
```
User Input:
  Topic: "Lost Love"
  Mood: "Melancholic"
  Genre: "Indie Folk"
  
Personalization:
  Location: "South Yarra, Melbourne, Australia"
  Relationship: Ex-Partner, "their laugh"
  Memory: "Walked along Yarra River at sunset"
  Metaphor: "Fading Polaroids"
  Power Lines: 
    - "Your smile's blurring at the edges now"
    - "Fading faster than I can remember you"

Generated Song (Excerpt):
[Verse 1]
Walking down Toorak Road, the autumn air feels cold
Your laugh still echoes where the Yarra River flows
We watched the sunset paint South Yarra gold
Now I'm holding onto fading Polaroids

[Chorus]
Your smile's blurring at the edges now
Fading faster than I can remember you
The colors don't look right anymore
```

### Example 2: NYC Hustle Anthem
```
User Input:
  Topic: "Chasing Dreams"
  Mood: "Determined"
  Genre: "Hip Hop"
  
Personalization:
  Location: "Brooklyn, New York City"
  Relationship: Myself (introspective)
  Memory: "First day in the city, subway ride to Manhattan"
  Metaphor: "Crown I'm Building"
  Power Lines:
    - "Concrete jungle raised me from the ground"
    - "Every setback just another stepping stone"

Generated Song (Excerpt):
[Verse 1]
Stepped off the L train, Brooklyn to my back
Manhattan skyline, yeah I'm chasing that
Concrete jungle raised me from the ground
Building my crown, brick by brick, profound
```

---

## 🔒 11. PRIVACY & DATA HANDLING

### Storage
- **Personalization data** stored in localStorage (not sent to servers)
- **AI processing** happens server-side, but user details are anonymized
- **Names** can be replaced with placeholders if user opts in

### User Controls
```
☑️ Use my location in songs
☐ Store my personalization profiles locally
☐ Share anonymous usage data to improve suggestions
```

---

## ✅ 12. SUCCESS METRICS

**Engagement**:
- % of users who open Personalization Modal (Target: 30%)
- % who apply personalization (Target: 60% of those who open)
- Avg time spent in modal (Target: 2-3 minutes)

**Quality**:
- User satisfaction: "Did personalization improve your song?" (Target: 80% yes)
- Re-use rate: Users who personalize 2+ songs (Target: 40%)

**Impact**:
- Songs with personalization score +10 points higher in Emotional Impact
- Songs with personalization have 2x higher "favorite" rate

---

## 🎉 END GOAL

Transform Suno Architect from a "generic song generator" into a **personal storytelling engine** that feels like it was written specifically for you, about your life, in your city, with your memories woven into every line.

**From**: "I met someone in the city"  
**To**: "I met you at Fitzroy Gardens, Chapel Street lights guiding us home"

🚀 **Ready to implement!**
