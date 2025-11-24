# 🔬 SUNO V5 KNOWLEDGE SOURCING PLAN
**Multi-Pronged Research Strategy for Accurate Model Behavior Documentation**

*Created: November 24, 2025*

---

## 🎯 OBJECTIVE

Source **verified, accurate, and actionable** Suno V5 model behavior knowledge through:
1. Official documentation
2. Community empirical testing
3. Automated experimentation
4. Deep AI research synthesis

---

## 📋 MULTI-PRONGED APPROACH

### 🗂️ STRATEGY 1: Official Documentation Scraping

**Target Sources:**
- [ ] **Suno.ai Official Documentation**
  - URL: `https://docs.suno.ai` (if exists)
  - URL: `https://help.suno.ai` (if exists)
  - URL: `https://suno.ai/blog` (release notes, model updates)
  
- [ ] **Suno API Documentation**
  - Model specifications
  - Parameter descriptions
  - Example usage patterns
  - Rate limits and constraints

- [ ] **Suno V5 Release Notes**
  - Changes from V4 to V5
  - New features
  - Known limitations
  - Deprecated behaviors

**Execution Plan:**
```bash
# Option A: Manual Collection
# 1. Visit official sites
# 2. Document all V5-specific mentions
# 3. Screenshot/save relevant sections

# Option B: Automated Scraping
# If documentation is publicly accessible:
curl https://docs.suno.ai/v5 > suno_v5_docs.html
# Parse HTML for model behavior sections

# Option C: API Exploration
# If API docs are available:
# Document all V5 endpoint parameters
# Test parameter effects systematically
```

**Questions to Answer:**
- What parameters does Suno V5 officially support? (BPM, energy markers, section tags)
- What are the documented limitations? (max length, token limits, supported genres)
- What does Suno say about prompt engineering best practices?

---

### 🤖 STRATEGY 2: Gemini Deep Research

**Execution:**
Use Gemini's deep research capabilities to synthesize information from across the web:

```
Research Query Template:
"Conduct comprehensive research on Suno AI V5 music generation model:
1. How does Suno V5 interpret style prompts and genre descriptions?
2. What are the documented behaviors for section tags ([Verse], [Chorus], etc.)?
3. How does V5 handle tempo (BPM) specifications?
4. What are known issues, bugs, or limitations in V5?
5. What prompt engineering techniques work best for V5?
6. How does V5 differ from V4 or earlier versions?

Sources to prioritize:
- Official Suno documentation
- Suno community forums (Reddit r/SunoAI, Discord)
- Music production blogs reviewing Suno V5
- YouTube tutorials and experiments
- AI music generation research papers

For each claim, provide:
- The specific source (URL, author, date)
- Whether it's officially documented or community-observed
- Confidence level (verified, likely, speculative)
"
```

**Gemini Deep Research Prompt:**
```bash
# Run this in Gemini AI Studio or via API:
"I need you to conduct deep research on Suno AI V5 model behavior.

CONTEXT: I'm building a songwriting assistant that generates songs using Suno V5. 
I need to understand exactly how the model behaves to give accurate guidance.

RESEARCH QUESTIONS:
1. Vocal Clarity: Does V5 struggle with vocals when genre descriptions are complex? 
   What triggers 'hallucination' (ignoring lyrics)?

2. Repetition Mechanics: Does repeating sections (e.g., chorus 3x) actually improve 
   consistency and energy? Is this documented or community-observed?

3. Energy Markers: Do tags like [Verse 1 - 4/10 energy] actually work? Where did 
   this technique originate?

4. BPM Sensitivity: Are there genre-specific BPM ranges where V5 performs best? 
   (e.g., 128 BPM for EDM, 120-130 for pop)

5. Section Length: Is there an optimal line count per section (4-8 lines)? 
   What happens with shorter/longer sections?

6. Pronunciation Issues: How literal is V5's text-to-speech? Does phonetic spelling 
   actually fix mispronunciations?

7. Instrumental Intro: Does starting with [Instrumental Intro] improve quality?

8. Negative Prompts: Do they work? Are they effective for audio quality or lyrics?

9. Loop Prevention: Is [End] tag necessary to prevent infinite repetition?

10. Duet Markers: Do (M)/(F) markers consistently work for duets?

REQUIREMENTS:
- Cite specific sources (URLs, forum posts, official docs)
- Distinguish between 'verified', 'community-observed', and 'speculative'
- Note any contradictory information
- Highlight gaps where no information exists

FORMAT: Provide a structured report with sections for each question, including 
confidence levels and source citations."
```

**Expected Output:**
- Gemini will search across multiple sources
- Synthesize findings into a coherent report
- Provide source URLs and confidence assessments

---

### 🌐 STRATEGY 3: Community Forum Mining

**Target Communities:**

#### Reddit: r/SunoAI
- [ ] Search for "V5 tips"
- [ ] Search for "V5 prompt engineering"
- [ ] Search for "V5 vs V4"
- [ ] Search for "V5 problems"
- [ ] Read top posts from past 6 months

**Execution:**
```bash
# Manual approach:
1. Go to https://reddit.com/r/SunoAI
2. Search: "V5 tips" OR "V5 behavior" OR "V5 prompt"
3. Filter by: Top posts, Past year
4. Document patterns in highly upvoted posts/comments

# Automated approach (if Reddit API access):
# Use Reddit API to fetch posts mentioning "Suno V5"
# Analyze for common themes, techniques, complaints
```

#### Discord: Suno Community Server
- [ ] Join official Suno Discord
- [ ] Search `#tips-and-tricks` channel
- [ ] Search `#v5-discussion` channel (if exists)
- [ ] Review pinned messages
- [ ] Ask community for empirical observations

**Questions to Ask Community:**
```
"Hey Suno community! I'm building a tool to help with V5 prompt engineering.
Looking for empirically tested behaviors:

1. Have you noticed V5 performing better at specific BPM ranges per genre?
2. Do energy markers like [Verse 1 - 4/10 energy] actually work for you?
3. Does repeating the chorus 3+ times improve consistency?
4. Any genre-specific quirks or tricks you've discovered?
5. What prompt patterns consistently produce high-quality results?

Would love to hear what you've ACTUALLY TESTED vs what you've just heard."
```

#### YouTube & Tutorial Sites
- [ ] Search: "Suno V5 tutorial"
- [ ] Search: "Suno V5 tips and tricks"
- [ ] Search: "Suno V5 prompt engineering"
- [ ] Watch top 10 most-viewed videos
- [ ] Document techniques demonstrated with results

**Data Collection Template:**
```markdown
## Source: [URL]
**Author:** [Name/Handle]
**Date:** [YYYY-MM-DD]
**Confidence:** [Verified / Community-Observed / Speculative]

**Claim:** [What behavior is described]
**Evidence:** [Did they show A/B testing? Just anecdotal?]
**Reproducibility:** [Can this be tested?]
**Contradictions:** [Any sources disagree?]
```

---

### 🧪 STRATEGY 4: Automated Experimentation Framework

**Goal:** Systematically test Suno V5 behaviors through controlled A/B experiments

**Test Categories:**

#### Test 1: BPM Sweet Spots
```typescript
interface BPMTest {
  genre: string;
  bpmRange: number[];
  testLyrics: string; // Same lyrics across all tests
  stylePrompt: string; // Only BPM varies
}

const tests: BPMTest[] = [
  { genre: "Pop", bpmRange: [110, 120, 130, 140, 150], testLyrics: "..." },
  { genre: "EDM", bpmRange: [120, 124, 128, 132, 140], testLyrics: "..." },
  { genre: "Hip-Hop", bpmRange: [80, 90, 100, 110, 120], testLyrics: "..." }
];

// Generate 5 versions per genre (25 total songs)
// Compare: Vocal clarity, adherence to lyrics, overall quality
```

#### Test 2: Repetition Mechanics
```typescript
interface RepetitionTest {
  chorusRepeats: number; // 1, 2, 3, 4, 5
  testLyrics: string; // Same base structure
  stylePrompt: string; // Same across all
}

// Generate versions with 1x, 2x, 3x, 4x, 5x chorus repetition
// Measure: Consistency of melody, energy delivery, listener memory
```

#### Test 3: Energy Markers
```typescript
interface EnergyTest {
  useEnergyMarkers: boolean;
  sectionEnergy: string; // "[Verse 1 - 3/10 energy]" vs "[Verse 1]"
  testLyrics: string;
}

// Generate A/B pairs: with vs without energy markers
// Measure: Dynamic range, section differentiation
```

#### Test 4: Section Length
```typescript
interface SectionLengthTest {
  linesPerSection: number; // 2, 4, 6, 8, 10, 12
  testLyrics: string; // Scaled to match line count
  stylePrompt: string;
}

// Generate versions with varying section lengths
// Measure: Completion rate, quality consistency, awkward transitions
```

**Implementation Plan:**
```typescript
// services/v5ExperimentFramework.ts

export interface ExperimentConfig {
  testName: string;
  variations: Array<{
    label: string;
    lyrics: string;
    stylePrompt: string;
    negativePrompt?: string;
  }>;
  evaluationCriteria: string[]; // e.g., ["vocal_clarity", "lyric_adherence", "energy_curve"]
}

export async function runExperiment(config: ExperimentConfig): Promise<ExperimentResults> {
  const results = [];
  
  for (const variation of config.variations) {
    // Generate song via Suno API
    const song = await generateSunoSong(variation);
    
    // Evaluate with our agent system
    const analysis = await analyzeGeneratedSong(song);
    
    results.push({
      variation: variation.label,
      scores: analysis.scores,
      notes: analysis.weaknesses
    });
  }
  
  return {
    testName: config.testName,
    results,
    winner: determineWinner(results),
    insights: synthesizeInsights(results)
  };
}
```

**Execution:**
```bash
# Run experiments in batches
npm run experiment:bpm
npm run experiment:repetition
npm run experiment:energy-markers
npm run experiment:section-length

# Generate report
npm run experiment:report
```

**Data Storage:**
```json
{
  "experiment_name": "BPM Sweet Spots - Pop Genre",
  "date": "2025-11-24",
  "variations": [
    {
      "bpm": 110,
      "vocal_clarity": 7.5,
      "lyric_adherence": 8.0,
      "overall_quality": 7.8,
      "notes": "Slightly sluggish feel, vocals clear"
    },
    {
      "bpm": 120,
      "vocal_clarity": 9.0,
      "lyric_adherence": 9.5,
      "overall_quality": 9.2,
      "notes": "Optimal - energetic, clear, well-paced"
    }
  ],
  "conclusion": "Pop songs perform best at 120-130 BPM",
  "confidence": "high",
  "sample_size": 5
}
```

---

## 📊 KNOWLEDGE VALIDATION FRAMEWORK

### Confidence Levels:

#### ✅ VERIFIED (Gold Standard)
- Officially documented by Suno
- Reproduced in controlled experiments
- Consistent across multiple independent sources

#### 🟢 HIGH CONFIDENCE
- Widely reported in community
- Reproduced by multiple users
- Logical technical explanation exists

#### 🟡 MODERATE CONFIDENCE
- Reported by some users
- Plausible but not extensively tested
- Conflicting reports exist

#### 🔴 EXPERIMENTAL
- Single-source claim
- Anecdotal evidence only
- Needs systematic testing

#### ⚫ UNVERIFIED / THEORETICAL
- Logical inference but no evidence
- Best practice from general AI knowledge
- Not specific to Suno V5

### Knowledge Entry Template:

```typescript
interface V5Knowledge {
  title: string;
  category: 'model_behavior' | 'optimization' | 'bugs_workarounds' | 'advanced_techniques' | 'genre_specific';
  description: string;
  explanation: string;
  
  // CRITICAL: Source verification
  sources: Array<{
    type: 'official_docs' | 'community_forum' | 'experiment' | 'youtube' | 'inference';
    url?: string;
    author?: string;
    date?: string;
    notes?: string;
  }>;
  
  // CRITICAL: Confidence assessment
  confidence: 'verified' | 'high' | 'moderate' | 'experimental' | 'unverified';
  lastVerified: string; // ISO date
  
  // Evidence
  examples?: string[];
  experimentData?: {
    testName: string;
    sampleSize: number;
    results: string;
  };
  
  // Agent guidance
  agentGuidance: string;
  userTip: string;
}
```

---

## 🗓️ EXECUTION TIMELINE

### Week 1: Data Collection
- **Day 1-2:** Official documentation scraping
- **Day 3:** Gemini Deep Research execution
- **Day 4-5:** Community forum mining (Reddit, Discord)
- **Day 6-7:** YouTube tutorial analysis

### Week 2: Experimentation
- **Day 8-10:** Build automated testing framework
- **Day 11-13:** Run controlled experiments (BPM, repetition, energy)
- **Day 14:** Analyze experimental results

### Week 3: Synthesis & Integration
- **Day 15-16:** Consolidate all findings into knowledge base
- **Day 17-18:** Validate confidence levels and sources
- **Day 19:** Integrate into Hitmaker Agent
- **Day 20:** Integrate into Rewrite Planner
- **Day 21:** Test impact on song quality

---

## 🤔 KEY QUESTIONS FOR YOU (USER)

Before we proceed, I need your input:

### 1. **Do you have access to:**
- [ ] Official Suno V5 documentation links?
- [ ] Suno API credentials for testing?
- [ ] Suno Discord/community server links?
- [ ] Any internal Suno knowledge base or guides?

### 2. **What have YOU observed empirically?**
- What V5 behaviors have you personally tested and confirmed?
- What techniques have worked consistently in your songs?
- What claims have you heard but not verified?

### 3. **Resource allocation:**
- Should I prioritize manual research (faster) or build automation framework (slower but reusable)?
- Do you want to run experiments yourself, or should I design tests for you?
- What's the urgency? Days? Weeks? Months?

### 4. **Integration approach:**
- Should we start with a SMALL, VERIFIED knowledge base (10-15 entries) or comprehensive (50+ entries)?
- Do you want to review each entry before integration, or trust the sourcing process?

### 5. **Community engagement:**
- Are you willing to post questions on Reddit/Discord to gather data?
- Should I draft community outreach posts for you?

---

## 📝 IMMEDIATE NEXT STEPS

**Option A: Start with Manual Research (Fast, 2-3 days)**
1. I'll search for official Suno V5 documentation
2. Run Gemini Deep Research query
3. Mine Reddit r/SunoAI for top tips
4. Compile findings into sourced knowledge base (15-20 entries)
5. Present for your review before integration

**Option B: Build Experiment Framework (Slower, 1-2 weeks)**
1. Create automated testing system
2. Run systematic A/B tests on Suno V5
3. Generate empirical evidence for all claims
4. Build knowledge base from experimental data

**Option C: Hybrid Approach (Recommended, 1 week)**
1. Immediate: Scrape docs + Gemini research + Reddit (Days 1-3)
2. Build quick knowledge base with sourced claims (Day 4)
3. Integrate verified entries into agents (Day 5)
4. Identify gaps that need experimental testing (Day 6)
5. Design experiments for you to run OR automate (Day 7+)

---

**What's your preference? Let's nail down the sourcing strategy before touching any agent code.**
