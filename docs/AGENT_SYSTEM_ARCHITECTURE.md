# 🤖 AGENT SYSTEM ARCHITECTURE
**Complete Analysis of the Multi-Agent Workflow**

*Last Updated: November 24, 2025*

---

## 📊 EXECUTIVE SUMMARY

**Total Agents: 7 + 1 Main Generator**

| Agent Type | Count | Purpose | Total Token Budget |
|------------|-------|---------|-------------------|
| **Specialist Agents** | 5 | Deep analysis of specific quality dimensions | 30,720 tokens |
| **Workflow Agents** | 2 | Generation & rewrite planning | Variable |
| **Assistant Agents** | 2 | User interaction & parameter validation | Variable |

**Total System Intelligence: 8 Specialized AI Agents**

---

## 🎯 THE 5 SPECIALIST AGENTS
*Analysis System: Post-generation quality evaluation*

### 1. 🎤 HITMAKER AGENT
**File:** `services/hitmakerAgent.ts`  
**Model:** Gemini 2.0 Flash Experimental  
**Token Budget:** 2,048 tokens (smallest - pattern matching focused)  
**Function:** `analyzeHitmaker()`

**OWNERSHIP:**
- Hook Factor (0-10)
- Commercial Potential (0-10)

**GROUNDING PRINCIPLES (Built-in "Skills"):**
```typescript
{
  hook_factor: [
    "Title should repeat 3-5x for memorability - backed by: Billboard Top 100 analysis",
    "Hook in first 50 seconds captures streaming listeners - backed by: Skip-rate data",
    "Chorus repetition builds familiarity - backed by: 'Mere exposure effect' psychology",
    "Simple, monosyllabic hooks are most memorable - backed by: 'Hey Jude', 'Let It Be' analysis"
  ],
  commercial_patterns: [
    "Shorter songs (3:00-3:30) perform better on streaming - backed by: Spotify data",
    "Universal themes (love, heartbreak, celebration) have broad appeal",
    "4th grade reading level maximizes accessibility - backed by: Lyric complexity studies",
    "Emotional authenticity beats technical perfection"
  ],
  memorability: [
    "Repetition of key phrases aids recall - backed by: Marketing psychology (rule of 7)",
    "Unexpected word pairings create stickiness - backed by: Cognitive surprise studies",
    "Phonetic catchiness beats semantic complexity - backed by: 'Earworm' research",
    "Call-and-response structures engage listeners"
  ],
  marketability: [
    "TikTok-friendly moments (15-30 sec clips) boost virality",
    "Genre-crossing elements widen audience",
    "Relatable specifics beat vague abstractions - backed by: Taylor Swift's relatability method",
    "Strong opening line hooks playlist curators"
  ]
}
```

**CURRENT "SKILLS":**
✅ Commercial pattern recognition (streaming optimization, TikTok virality)  
✅ Hook memorability analysis  
✅ Market viability assessment  
✅ Audience targeting  

**WHAT'S MISSING (vs Claude Skills):**
❌ No Suno V5-specific knowledge (BPM sweet spots, repetition mechanics)  
❌ No access to actual market data (Spotify/TikTok trends)  
❌ No genre-specific commercial patterns library  
❌ No real-time hit song database

---

### 2. ✍️ LYRICIST AGENT
**File:** `services/lyricistAgent.ts`  
**Model:** Gemini 2.0 Flash Experimental  
**Token Budget:** 4,096 tokens  
**Function:** `analyzeLyricist()`

**OWNERSHIP:**
- Lyrical Originality (0-10)

**GROUNDING PRINCIPLES:**
```typescript
{
  cliche_avoidance: [
    "Avoid overused phrases ('heart of gold', 'time will tell') - backed by: BMI songwriting workshops",
    "Replace abstract emotions with concrete imagery - backed by: 'Show don't tell' principle",
    "Unexpected word pairings increase memorability",
    "Fresh metaphors beat familiar similes"
  ],
  word_choice: [
    "Strong verbs beat adjectives (e.g., 'crashed' > 'fell quickly')",
    "Specific nouns beat generic ones (e.g., 'Mustang' > 'car')",
    "Monosyllabic words work best for hooks",
    "Multisyllabic words add sophistication to verses"
  ],
  rhyme_craft: [
    "Perfect rhymes feel predictable - mix with slant rhymes",
    "Internal rhymes add texture - backed by: Hip hop production techniques",
    "Rhyme placement affects emphasis",
    "Rhyme density varies by genre - Pop: moderate, Hip Hop: high, Folk: light"
  ],
  originality: [
    "First thought is often cliché - go to 3rd or 4th idea",
    "Genre-bending word choices surprise listeners",
    "Personal specifics beat universal abstractions - backed by: Taylor Swift's writing method",
    "Unique perspectives on common themes create connection"
  ]
}
```

**CURRENT "SKILLS":**
✅ Cliché detection  
✅ Word choice precision analysis  
✅ Rhyme scheme evaluation  
✅ Originality scoring  

**WHAT'S MISSING:**
❌ No cliché database (relies on general knowledge)  
❌ No rhyme dictionary integration  
❌ No synonym suggestion engine  
❌ No genre-specific lyrical conventions

---

### 3. 📖 STORYTELLER AGENT
**File:** `services/storytellerAgent.ts`  
**Model:** Gemini 2.0 Flash Experimental  
**Token Budget:** 8,192 tokens (largest scope - 4 categories)  
**Function:** `analyzeStoryteller()`

**OWNERSHIP:**
- Narrative Arc (0-10)
- Imagery & Sensory Detail (0-10)
- Thematic Cohesion (0-10)
- Emotional Impact (0-10)

**GROUNDING PRINCIPLES:**
```typescript
{
  narrative_arc: [
    "Three-act structure (Setup → Conflict → Resolution) creates satisfaction",
    "Emotional progression should build to climax",
    "Verses tell story, chorus delivers message",
    "Bridge provides perspective shift or revelation - backed by: 87% of #1 hits"
  ],
  imagery: [
    "Concrete sensory details beat abstract emotions - backed by: 'Show don't tell' principle",
    "Engage multiple senses (sight, sound, touch, smell, taste)",
    "Specific imagery creates universal connection - backed by: Ed Sheeran's 'Photograph' analysis",
    "Visual imagery works best for memorable lines"
  ],
  thematic_cohesion: [
    "Central metaphor anchors the song",
    "All verses should relate to core theme - backed by: Taylor Swift's 'All Too Well' breakdown",
    "Repetition of key imagery reinforces theme",
    "Mixed metaphors confuse listeners"
  ],
  emotional_impact: [
    "Vulnerability creates connection - backed by: Brené Brown's research on authenticity",
    "Emotional specificity beats generic sentiment",
    "Contrast enhances emotion (quiet → loud, sad → hopeful)",
    "Universal experiences expressed through personal lens"
  ]
}
```

**CURRENT "SKILLS":**
✅ Narrative structure analysis (3-act, emotional arc)  
✅ Multi-sensory imagery detection  
✅ Thematic coherence tracking  
✅ Emotional resonance assessment  

**WHAT'S MISSING:**
❌ No story archetype library (Hero's Journey, etc.)  
❌ No emotional intensity mapping tools  
❌ No sensory word database  
❌ No metaphor consistency checker

---

### 4. 🎙️ VOCAL COACH AGENT
**File:** `services/vocalCoachAgent.ts`  
**Model:** Gemini 2.0 Flash Experimental  
**Token Budget:** 8,192 tokens  
**Function:** `analyzeVocalCoach()`

**OWNERSHIP:**
- Vocal Playability (0-10)
- Melodic & Phonetic Flow / Rhythmic Flow (0-10)

**GROUNDING PRINCIPLES:**
```typescript
{
  breath_control: [
    "Ideal phrase length: 8-12 syllables before breath - backed by: Vocal pedagogy studies",
    "Natural breath points (commas, line breaks) prevent awkward phrasing",
    "Genre affects breath capacity - Pop: 12 syl, Rap: 20 syl, Ballad: 8 syl",
    "Breath markers improve vocal performance"
  ],
  phonetic_flow: [
    "Open vowels (ah, oh, ay) work best on sustained notes - backed by: Vocal formant research",
    "Consonant clusters slow delivery and hurt clarity",
    "Alliteration aids memorability but hurts speed",
    "Rhyme scheme affects vocal rhythm - AABB feels bouncy, ABAB feels balanced"
  ],
  melodic_fit: [
    "Stressed syllables should align with strong beats - backed by: Prosody research",
    "Monosyllabic words give flexibility for melody",
    "Multisyllabic words work better in verses than hooks",
    "Word stress patterns create natural rhythm"
  ],
  performance: [
    "Emotional words need vocal space (fewer syllables)",
    "Fast sections need simpler consonants",
    "Repetition builds muscle memory for live performance",
    "Awkward phoneme transitions cause vocal strain"
  ]
}
```

**CURRENT "SKILLS":**
✅ Breath control analysis  
✅ Phonetic flow evaluation  
✅ Syllable stress pattern recognition  
✅ Singability assessment  

**WHAT'S MISSING:**
❌ No vocal range considerations  
❌ No phoneme transition difficulty database  
❌ No genre-specific breath capacity benchmarks  
❌ No prosody visualization tools

---

### 5. 🎚️ PRODUCER AGENT
**File:** `services/producerAgent.ts`  
**Model:** Gemini 2.0 Flash Experimental  
**Token Budget:** 8,192 tokens  
**Function:** `analyzeProducer()`

**OWNERSHIP:**
- Sonic Density (phonetic texture) (0-10)
- Structure & Pacing (0-10)

**GROUNDING PRINCIPLES:**
```typescript
{
  sonic_texture: [
    "Consonant density creates rhythmic punch - backed by: Phonetic analysis of rap/rock",
    "Open vowels add sustain and melody - backed by: Vocal formant studies",
    "Alliteration builds sonic identity - backed by: Branding through sound patterns",
    "Phonetic contrast prevents monotony"
  ],
  structure: [
    "Verse-Chorus-Verse-Chorus-Bridge-Chorus is proven - backed by: 78% of Billboard #1 hits",
    "Chorus should be energy peak",
    "Bridge provides contrast before final chorus",
    "Intro should grab attention in 8 seconds - backed by: Streaming skip-rate data"
  ],
  pacing: [
    "Optimal song length 3:00-3:30 for streaming - backed by: Spotify completion rates",
    "Chorus should arrive by 0:50 - backed by: Attention span research",
    "Energy curve: build → peak → resolve",
    "Verses can be longer if chorus is punchy"
  ],
  density: [
    "Genre affects ideal word density - Ballad: 60 wpm, Pop: 100 wpm, Rap: 150 wpm",
    "High density needs simpler words - backed by: Cognitive load theory",
    "Space allows emotional impact - backed by: 'Less is more' production philosophy",
    "Texture variety prevents listener fatigue"
  ]
}
```

**CURRENT "SKILLS":**
✅ Phonetic texture analysis  
✅ Song structure pattern recognition  
✅ Energy curve mapping  
✅ Density balancing  

**WHAT'S MISSING:**
❌ No general songwriting knowledge base (this was the proposal)  
❌ No successful song pattern library  
❌ No genre-specific arrangement templates  
❌ No production technique database

---

## 🔧 THE 2 WORKFLOW AGENTS
*Generation & Planning: Core creative engines*

### 6. 🎵 MAIN SONG GENERATOR
**File:** `services/geminiService.ts`  
**Model:** Gemini 2.5 Flash  
**Token Budget:** Variable (full generation context)  
**Function:** `generateSongAssets()`

**SYSTEM INSTRUCTION:**
```
"You are an elite Suno v5 Prompt Engineer and Songwriter..."
```

**OWNERSHIP:**
- Initial song concept generation
- Lyrics creation
- Style prompt engineering
- Cover art prompt creation

**CURRENT "SKILLS":**
✅ Multi-input synthesis (genre, mood, artist references)  
✅ Structure optimization (Commercial Mode, Advanced Logic)  
✅ Feature integration (Central Metaphor, Advanced Lyric Logic)  
✅ Temperature-based creativity control  

**WHAT'S MISSING:**
❌ **NO SUNO V5-SPECIFIC KNOWLEDGE** (this is the gap we identified)  
❌ No prompt optimization techniques  
❌ No genre-specific generation patterns  
❌ No quality pre-validation

**INTEGRATION TARGET:** This agent does NOT need V5 knowledge (user corrected us)

---

### 7. 📋 REWRITE PLAN GENERATOR
**File:** `services/geminiService.ts`  
**Model:** Gemini 2.5 Flash (inferred)  
**Token Budget:** Variable (full analysis + validation context)  
**Function:** `generateRewritePlan()`

**SYSTEM INSTRUCTION:**
```
"You are creating a COMPREHENSIVE REWRITE PLAN that the user must review and approve before execution."
```

**OWNERSHIP:**
- Workflow validation analysis
- Metric relationship assessment
- Conflict detection and resolution
- DNA match technique adaptation
- User chat insight integration

**CURRENT "SKILLS":**
✅ Comprehensive workflow validation (validateCompleteWorkflow)  
✅ Metric relationship analysis (value scoring 0-100)  
✅ DNA match technique extraction  
✅ User discussion synthesis  
✅ Line-by-line improvement tracking  

**WHAT'S MISSING:**
❌ **NO SUNO V5-SPECIFIC KNOWLEDGE** (user wants this added)  
❌ No historical rewrite success pattern analysis  
❌ No A/B testing recommendation engine  

**INTEGRATION TARGET:** ✅ User confirmed - add V5 knowledge here

---

## 💬 THE 2 ASSISTANT AGENTS
*User Interaction: Validation & guidance*

### 8. 🔍 PARAMETER VALIDATION ASSISTANT
**File:** `services/geminiService.ts`  
**Model:** Gemini 2.5 Flash  
**Token Budget:** Minimal (parameter checking only)  
**Function:** `analyzeSongConcept()`

**SYSTEM INSTRUCTION:**
```
"You are a helpful music production assistant. Be concise and constructive."
```

**OWNERSHIP:**
- Input contradiction detection (e.g., "Death Metal" + "Relaxing")
- Missing element identification (e.g., "Trap" needs "Auto-tune")
- Vague input clarification (e.g., Genre "Music" too broad)
- Artist/Song reference alignment checking

**CURRENT "SKILLS":**
✅ Logical consistency checking  
✅ Genre convention validation  
✅ Artist style alignment  
✅ Suggestion generation  

**WHAT'S MISSING:**
❌ No genre convention database  
❌ No artist style profiles  
❌ No historical conflict pattern learning

---

### 9. 🧠 DEEP ANALYSIS CHAT AGENT
**File:** `services/geminiService.ts`  
**Model:** Gemini 3 Pro Preview  
**Token Budget:** Variable (conversation context)  
**Function:** `sendChatMessage()`

**SYSTEM INSTRUCTION:**
```
"You are an honest, evidence-based music analysis agent. You engage thoughtfully with user feedback. 
You are NOT a yes-man - you respectfully challenge ideas that don't align with the analysis or 
songwriting best practices. You reference specific data points to support your reasoning."
```

**OWNERSHIP:**
- User concern understanding
- Analysis data interpretation
- Constructive challenge (not a "yes man")
- Evidence-based reasoning
- Rewrite plan insight extraction

**CURRENT "SKILLS":**
✅ Conversational intelligence  
✅ Evidence-based argumentation  
✅ Analysis data referencing  
✅ DNA match technique explanation  
✅ Rewrite insight flagging  

**WHAT'S MISSING:**
❌ No conversation memory across sessions  
❌ No user preference learning  
❌ No contradiction tracking

---

## 🆚 CLAUDE SKILLS vs CURRENT AGENT SKILLS

### What Are Claude Skills?
Claude Skills are specialized, context-aware capabilities that can be dynamically loaded:
- **Code Execution:** Run Python/JavaScript in sandboxed environments
- **Web Search:** Real-time information retrieval
- **File Operations:** Complex file system operations
- **API Integration:** Connect to external services
- **Memory:** Persistent context across conversations

### Current Agent System vs Claude Skills

| Claude Skill | Equivalent in Our System | Gap Analysis |
|--------------|-------------------------|--------------|
| **Code Execution** | ❌ None | Agents cannot test phonetic patterns programmatically |
| **Web Search** | ❌ None | No access to current hit song trends, Suno forums |
| **Memory** | ⚠️ Partial | Cache exists for parameter validation, but no cross-session learning |
| **Specialized Knowledge** | ✅ Grounding Principles | Each agent has domain-specific "skills" (see above) |
| **Tool Use** | ❌ None | Agents cannot invoke external tools (rhyme dictionaries, etc.) |

### What We ALREADY Have (Agent "Skills"):
1. **Hitmaker:** Commercial pattern recognition, market assessment
2. **Lyricist:** Cliché detection, word choice precision, rhyme analysis
3. **Storyteller:** Narrative structure, sensory imagery, thematic tracking
4. **Vocal Coach:** Breath control, phonetic flow, singability assessment
5. **Producer:** Sonic texture, structure patterns, density balancing
6. **Rewrite Planner:** Workflow validation, metric relationship analysis, DNA adaptation
7. **Chat Agent:** Evidence-based dialogue, constructive challenge, insight extraction

### What We DON'T Have (Potential Skill Additions):

#### 🎯 HITMAKER Skill Additions:
- [ ] **Suno V5 Commercial Optimization**
  - BPM sweet spots for streaming (120-130 pop, 128 EDM, 90-100 hip-hop)
  - Section length optimization (4-8 lines)
  - Repetition mechanics (3x chorus minimum)
  - Energy marker effectiveness
- [ ] **Real-Time Market Data** (requires external API)
  - Current TikTok viral patterns
  - Spotify trending genres
  - Billboard chart analysis

#### ✍️ LYRICIST Skill Additions:
- [ ] **Cliché Database**
  - Curated list of 500+ overused phrases
  - Genre-specific cliché patterns
- [ ] **Rhyme Dictionary Integration** (external tool)
- [ ] **Synonym Suggestion Engine** (external tool)

#### 📖 STORYTELLER Skill Additions:
- [ ] **Story Archetype Library**
  - Hero's Journey templates
  - Redemption arc patterns
  - Love story structures
- [ ] **Sensory Word Database**
  - 1000+ sensory-specific words categorized by sense

#### 🎙️ VOCAL COACH Skill Additions:
- [ ] **Phoneme Transition Difficulty Database**
  - Hard consonant clusters (str-, -nths, -rld)
  - Tongue-twister detection
- [ ] **Vocal Range Considerations** (requires external tool)

#### 🎚️ PRODUCER Skill Additions:
- [ ] **General Songwriting Knowledge Base** (PROPOSED)
  - Proven song structures from 1000+ hits
  - Genre-specific arrangement templates
  - Production technique library
- [ ] **Successful Song Pattern Library**
  - A-tier reference database
  - Technique extraction from hits

#### 📋 REWRITE PLANNER Skill Additions:
- [ ] **Suno V5 Optimization Knowledge** (APPROVED TO ADD)
  - Model-specific behaviors
  - Prompt engineering techniques
  - Genre-specific quirks
- [ ] **Historical Rewrite Success Patterns**
  - What changes yield biggest score improvements
  - A/B testing recommendations

---

## 📈 SKILL INTEGRATION PRIORITY

### IMMEDIATE (User Approved):
1. ✅ **Add Suno V5 Knowledge to Hitmaker Agent** - Commercial optimization (BPM, repetition, structure)
2. ✅ **Add Suno V5 Knowledge to Rewrite Planner** - Model behavior understanding for better plans

### UNDER CONSIDERATION (User wants critical evaluation):
3. ❓ **Add General Songwriting Library to Producer Agent** - Could improve or dilute focus?

### FUTURE ENHANCEMENTS:
4. ⏳ Web search integration for real-time market data
5. ⏳ External tool APIs (rhyme dictionaries, phoneme databases)
6. ⏳ Cross-session memory for user preference learning

---

## 🔍 CRITICAL EVALUATION: Should Producer Get General Songwriting Knowledge?

### PROS:
✅ Producer already handles structure & pacing - natural fit  
✅ Could provide evidence-based arrangement suggestions  
✅ Complements existing PRODUCER_PRINCIPLES with real examples  
✅ Separates "how Suno works" (V5 knowledge) from "what works in songs" (general knowledge)

### CONS:
❌ Producer scope is already large (Sonic Density + Structure & Pacing)  
❌ Risk of diluting phonetic texture focus  
❌ Other agents (Storyteller, Lyricist) might need this knowledge too  
❌ Could create information overload (8192 token budget already maxed)  

### ALTERNATIVE APPROACHES:
1. **Create a 6th "Arranger Agent"** - New specialist solely for song structure knowledge
2. **Integrate into Rewrite Planner** - Planning stage uses general + V5 knowledge together
3. **Make it a shared resource** - All agents can reference it when needed
4. **User-facing only** - Knowledge base shown to users, not injected into agents

### RECOMMENDATION:
**Start with Rewrite Planner integration** - It's already the "planning brain" that synthesizes all agent feedback. Adding general songwriting patterns alongside V5-specific knowledge creates a comprehensive planning context without overloading any single specialist agent.

---

## 📊 TOKEN BUDGET SUMMARY

| Agent | Model | Token Budget | Utilization |
|-------|-------|--------------|-------------|
| Hitmaker | Gemini 2.0 Flash | 2,048 | Pattern matching (smallest) |
| Lyricist | Gemini 2.0 Flash | 4,096 | Word-level analysis |
| Storyteller | Gemini 2.0 Flash | 8,192 | 4 categories (largest specialist) |
| Vocal Coach | Gemini 2.0 Flash | 8,192 | Performance + flow |
| Producer | Gemini 2.0 Flash | 8,192 | Sonic + structure |
| Main Generator | Gemini 2.5 Flash | Variable | Full generation context |
| Rewrite Planner | Gemini 2.5 Flash | Variable | Full analysis + validation |
| Parameter Assistant | Gemini 2.5 Flash | Minimal | Parameter checking |
| Chat Agent | Gemini 3 Pro | Variable | Conversation context |

**Total Specialist Budget:** 30,720 tokens  
**Flash vs Pro Split:** 7 Flash agents, 1 Pro agent

---

## 🎯 NEXT STEPS

### Phase 1: Suno V5 Knowledge Sourcing (IN PROGRESS)
- [ ] Define data collection strategy
- [ ] Source official Suno V5 documentation
- [ ] Run Gemini Deep Research on V5 behavior
- [ ] Scrape community forums (Reddit, Discord)
- [ ] Create automated testing framework
- [ ] Validate knowledge accuracy

### Phase 2: Selective Integration
- [ ] Inject V5 knowledge into Hitmaker Agent
- [ ] Inject V5 knowledge into Rewrite Planner
- [ ] Test impact on analysis quality

### Phase 3: General Songwriting Library (PENDING EVALUATION)
- [ ] Critically evaluate: Producer agent enhancement vs new Arranger agent
- [ ] Source successful song patterns
- [ ] Structure knowledge base
- [ ] Test integration approach

---

*End of Architecture Analysis*
