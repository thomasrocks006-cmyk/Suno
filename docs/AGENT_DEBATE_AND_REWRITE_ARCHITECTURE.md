# Agent Debate & Rewrite Planner Architecture

**Status:** 🔴 ARCHITECTURE REDESIGN REQUIRED  
**Created:** November 24, 2025  
**Priority:** P0 - Foundational system design  

---

## 📋 Executive Summary

This document defines the **correct architecture** for:
1. **Agent Debate System** - How 5 expert agents collaborate with real conversations
2. **Rewrite Planner System** - How all analysis data flows into execution plans

**Current Problems:**
- ❌ Agents run in parallel with NO communication (fake debates via vote simulation)
- ❌ Rewrite planner ignores agent insights (only uses base analysis)
- ❌ Agent scores not used in execution plan
- ❌ No clear data flow from 5 agents → consensus → rewrite plan
- ❌ Debates happen AFTER analysis (too late to influence planning)

**Proposed Architecture:**
- ✅ Real-time agent collaboration with chain-of-thought
- ✅ Agent insights flow directly into execution plan
- ✅ Planner agent synthesizes ALL data sources (5 agents + DNA + sonic + line-by-line)
- ✅ Clear data layering: Raw Analysis → Agent Discussion → Consensus → Execution Plan
- ✅ Debates inform planning (not just post-analysis theater)

---

## 🏗️ Part 1: Current System Analysis

### 1.1 Current Agent Debate System (BROKEN)

**File:** `services/agentDebateService.ts`

**Current Flow:**
```
User clicks "Generate"
    ↓
Base Analysis (gemini-3-pro) - 3s
├─ Scores 6 categories
├─ DNA match
├─ Line-by-line improvements
└─ Sonic analysis
    ↓
5 Agents run in PARALLEL (Promise.all) - 3s
├─ Lyricist (scores 1 category)
├─ Storyteller (scores 4 categories)
├─ Vocal Coach (scores 2 categories)
├─ Producer (scores 2 categories)
└─ Hitmaker (scores 1 category)
    ↓
    [AGENTS NEVER SEE EACH OTHER'S OUTPUTS]
    ↓
Calculate tradeoffs (instant)
├─ Find score conflicts between agents
├─ Identify top 3 disagreements
└─ Slice to max 3 debates
    ↓
Simulate votes with deterministic functions (instant)
├─ determineLyricistVote()
├─ determineStorytellerVote()
├─ determineVocalCoachVote()
├─ determineProducerVote()
└─ determineHitmakerVote()
    ↓
Display "debates" to user (not real)
```

**Code Evidence:**
```typescript
// services/agentDebateService.ts:66-90
const [lyricist, storyteller, vocalCoach, producer, hitmaker] = await Promise.all([
  analyzeLyricist(song, inputs),
  analyzeStoryteller(song, inputs, programmaticScores),
  analyzeVocalCoach(song, inputs, programmaticScores),
  analyzeProducer(song, inputs, sonicAnalysis),
  analyzeHitmaker(song, inputs, programmaticScores)
]);
// ❌ Agents run in parallel, never communicate
```

**Current Agent Responsibilities:**

| Agent | Categories Scored | Focus Area | Model | Cost |
|-------|-------------------|------------|-------|------|
| **Lyricist** | 1 (Lyrical Originality) | Clichés, metaphors, originality | flash-exp | $0.001 |
| **Storyteller** | 4 (Narrative Arc, Imagery, Thematic Cohesion, Emotional Impact) | Story structure, emotions, themes | 3-pro | $0.015 |
| **Vocal Coach** | 2 (Vocal Playability, Melodic Flow) | Singability, phonetics, breath | flash-exp | $0.001 |
| **Producer** | 2 (Sonic Density, Structure & Pacing) | Production quality, pacing | flash-exp | $0.001 |
| **Hitmaker** | 1 (Commercial Potential) | Radio viability, hooks | flash-exp | $0.001 |

**Current Debate Generation:**
```typescript
// services/agentDebateService.ts:185-220
// ❌ POST-HOC vote simulation
for (const tradeoff of tradeoffDecisions.slice(0, 3)) {
  const lyricistVote = determineLyricistVote(tradeoff, lyricist, ...);
  // ^ Deterministic function, not AI-generated
  
  debates.push({
    issue: tradeoff.area,
    agents: [lyricistVote, storytellerVote, ...],
    resolution: { decision: 'compromise', reasoning: '...' }
  });
}
```

**Problems:**
1. ❌ Agents don't see each other's analysis
2. ❌ Votes are deterministic (not real AI discussion)
3. ❌ Debates happen AFTER all scoring (can't influence results)
4. ❌ Limited to 3 debates (arbitrary)
5. ❌ No chain-of-thought or conversation history
6. ❌ Debates are for show (don't affect execution plan)

---

### 1.2 Current Rewrite Planner System (INCOMPLETE)

**File:** `services/geminiService.ts:1164-1297` (`rewriteSongWithImprovements`)

**Current Flow:**
```
User clicks "Rewrite with Improvements"
    ↓
Gather context from song.analysis
├─ scoreBreakdown (10 categories from agents) ← USED ✅
├─ weaknesses (from base analysis) ← USED ✅
├─ sonicAnalysis (phonetics, density, cinema) ← USED ✅
├─ lineByLineImprovements (from base) ← USED ✅
├─ dnaMatch ← NOT USED ❌
├─ agentDebates ← NOT USED ❌
└─ Agent-specific insights ← NOT USED ❌
    ↓
Build rewrite prompt with:
├─ Current scores by category
├─ Weaknesses list
├─ Phonetic issues
├─ Density issues
├─ Cinema audit (object count)
└─ Line-by-line improvements
    ↓
Call AI with structured schema (ExecutionPlan)
├─ Model: flash-2.5 (score ≥6) or 3-pro (score <6)
├─ Temperature: 0.75
└─ Thinking budget: 4096 tokens (only if 3-pro)
    ↓
Return ExecutionPlan with:
├─ targetScore
├─ scoreImprovementsByCategory[]
├─ lineLevelChanges[]
├─ phoneticFixes[]
└─ furnitureAdditions[]
```

**Code Evidence:**
```typescript
// services/geminiService.ts:1164-1200
export const rewriteSongWithImprovements = async (
  song: GeneratedSong, 
  useAdvancedLogic: boolean, 
  useMetaphorLogic: boolean,
  useCommercialMode: boolean
): Promise<GeneratedSong> => {
  if (!song.analysis) throw new Error("Analysis required before rewriting");

  // ❌ Only uses aggregate data, ignores agent-specific insights
  const currentScoreByCategory = song.analysis.scoreBreakdown.reduce((acc, item) => {
    acc[item.category] = item.score;
    return acc;
  }, {} as Record<string, number>);

  const phoneticIssues = song.analysis.sonicAnalysis?.phonetics || "No phonetic issues";
  const densityIssues = song.analysis.sonicAnalysis?.density || "No density issues";
  const currentObjects = song.analysis.sonicAnalysis?.cinemaAudit?.objects || [];
  const weaknesses = song.analysis.weaknesses || [];
  
  // ❌ DNA match insights NOT included
  // ❌ Agent debates NOT included
  // ❌ Agent-specific reasoning NOT included
  
  const prompt = `
    **SCORE BREAKDOWN (Current):**
    ${song.analysis.scoreBreakdown.map(s => 
      `- ${s.category}: ${s.score}/10 (${s.reason})`
    ).join('\n')}
    // ^ Only shows final scores, not agent discussions
  `;
```

**What's Missing:**

| Data Source | Currently Used? | Should Use? | Impact |
|-------------|----------------|-------------|---------|
| **Agent Debates** | ❌ No | ✅ Yes | High - shows why scores conflict |
| **DNA Match Insights** | ❌ No | ✅ Yes | High - structural lessons from hits |
| **Agent-Specific Reasoning** | ⚠️ Partial | ✅ Full | Medium - shows expertise per category |
| **Consensus Strengths** | ❌ No | ✅ Yes | Low - validation of what works |
| **Consensus Weaknesses** | ⚠️ Via base | ✅ Agent-driven | Medium - more targeted fixes |
| **Tradeoff Decisions** | ❌ No | ✅ Yes | High - resolves conflicts intelligently |

**Problems:**
1. ❌ Rewrite planner operates in isolation (ignores agent collaboration)
2. ❌ No DNA match insights applied to execution plan
3. ❌ Agent debates don't influence rewrite strategy
4. ❌ Missing "sourceAnalysis" field in lineLevelChanges (can't trace decisions)
5. ❌ No validation that execution plan aligns with agent consensus
6. ❌ Single AI call makes plan, no iterative refinement

---

### 1.3 Current ExecutionPlan Schema (INCOMPLETE)

**File:** `types.ts:168-200`

**Current Schema:**
```typescript
export interface ExecutionPlan {
  targetScore: number;
  scoreImprovementsByCategory: {
    category: ScoringCategory;
    currentScore: number;
    targetScore: number;
    strategy: string;
    dnaInsightApplied?: string; // ✅ GOOD but not populated
  }[];
  lineLevelChanges: {
    lineNumber: number;
    originalLine: string;
    newLine: string;
    reason: string;
    categoryImproved: ScoringCategory;
    sourceAnalysis: 'LineByLine' | 'Phonetic' | 'DNAMatch' | 'ChatAgent' | 'Density';
    // ✅ GOOD field but not used in rewrite
  }[];
  phoneticFixes?: {
    issue: string;
    fix: string;
  }[];
  furnitureAdditions?: string[];
  dnaMatchInsights?: {
    structural: string[];
    wordSpacing: string[];
    metaphorical: string[];
    narrative: string[];
    sonic: string[];
    // ✅ GOOD structure but never populated
  };
  userApproved?: boolean;
  chatAgentNotes?: string[]; // ✅ GOOD but not from agent debates
}
```

**Problems:**
1. ⚠️ `dnaInsightApplied` field exists but never populated
2. ⚠️ `sourceAnalysis` field exists but rewrite doesn't specify it
3. ⚠️ `dnaMatchInsights` structure exists but never filled
4. ❌ No field for agent debate resolutions
5. ❌ No field for tradeoff decisions
6. ❌ No field for consensus priorities
7. ❌ No validation that plan addresses all agent concerns

---

## 🎯 Part 2: Correct Architecture Design

### 2.1 Real Agent Debate System

**New Flow:**
```
User clicks "Generate"
    ↓
Streamlined Base Analysis (1s)
├─ DNA match ONLY
├─ Structural advice ONLY
└─ Key observations for agents
    [NO SCORING - agents do that]
    ↓
Round 1: Parallel Initial Analysis (3s)
├─ Lyricist analyzes + scores
├─ Storyteller analyzes + scores
├─ Vocal Coach analyzes + scores
├─ Producer analyzes + scores
└─ Hitmaker analyzes + scores
    [Each agent gets base analysis context]
    ↓
Round 2: Identify Conflicts (instant)
├─ Calculate score variances per category
├─ Find top 3 most contentious areas
└─ Select expert + dissenter for each
    ↓
Round 3: Real-Time Debates (4s, parallelized)
FOR EACH OF 3 CONFLICTS (run in parallel):
  ├─ Turn 1: Expert states position (1s)
  │   Input: Their analysis, base context, category
  │   Output: "I scored X because..."
  │
  ├─ Turn 2: Dissenter responds (1s)
  │   Input: Expert's statement + their analysis
  │   Output: "I see that, but from my view..."
  │
  ├─ Turn 3: Questioner asks (1s)
  │   Input: Both statements + their domain
  │   Output: "How does this affect Y?"
  │
  ├─ Turn 4: Synthesizer builds consensus (1s)
  │   Input: All 3 turns + tradeoff context
  │   Output: "Both have merit. The solution is..."
  │
  └─ Turn 5: All agents vote with full context
      Input: Full debate history
      Output: Vote (A/B/compromise) with reasoning
    ↓
Round 4: Build Consensus (instant)
├─ Aggregate debate outcomes
├─ Create consensus strengths/weaknesses
├─ Prioritize improvements by vote results
└─ Package for execution planner
```

**Key Improvements:**
1. ✅ Agents see each other's outputs (chain-of-thought)
2. ✅ Real AI-generated conversations (not deterministic votes)
3. ✅ 4-turn debate structure (expert → dissenter → questioner → synthesizer)
4. ✅ All agents vote AFTER hearing full discussion
5. ✅ Debates inform consensus (used in rewrite planning)
6. ✅ Parallelized debates (3 debates in 4s, not 12s)

**New Agent Responsibilities:**

| Agent | Primary Role | Debate Role | When Expert | When Questioner |
|-------|-------------|-------------|-------------|-----------------|
| **Lyricist** | Score lyrics | Defend word choice | Lyrical Originality conflicts | Ask about singability |
| **Storyteller** | Score narrative | Defend story arc | Narrative/Theme conflicts | Ask about emotional flow |
| **Vocal Coach** | Score vocals | Defend phonetics | Vocal Playability conflicts | Ask about breath marks |
| **Producer** | Score production | Defend sonic density | Production conflicts | Ask about mix balance |
| **Hitmaker** | Score commercial | Defend hooks | Commercial Potential conflicts | Ask about radio viability |

---

### 2.2 New Execution Planner System (Planner Agent)

**Concept:** A **6th agent** (Planner Agent) synthesizes ALL data sources into execution plan

**New Flow:**
```
User clicks "Rewrite with Improvements"
    ↓
Planner Agent receives ALL context:
├─ Base Analysis
│   ├─ DNA Match (structural lessons from A-tier songs)
│   └─ Key observations
│
├─ 5 Agent Analyses
│   ├─ Lyricist (originality insights)
│   ├─ Storyteller (narrative insights)
│   ├─ Vocal Coach (phonetic insights)
│   ├─ Producer (sonic insights)
│   └─ Hitmaker (commercial insights)
│
├─ Agent Debates (3 debates)
│   ├─ Debate 1 outcome (vote results + consensus)
│   ├─ Debate 2 outcome
│   └─ Debate 3 outcome
│
├─ Consensus Data
│   ├─ consensusStrengths[]
│   ├─ consensusWeaknesses[]
│   └─ tradeoffDecisions[]
│
├─ Programmatic Scores
│   ├─ Hook Factor analysis
│   ├─ Vocal Playability metrics
│   ├─ Imagery count
│   └─ Narrative arc structure
│
└─ Sonic Analysis
    ├─ Phonetics (vowel endings, breath marks)
    ├─ Density (word spacing, pacing)
    └─ Cinema Audit (concrete objects)
    ↓
Planner Agent creates ExecutionPlan:
├─ Phase 1: Analyze Conflicts
│   ├─ Map debate outcomes to categories
│   ├─ Identify which agent "won" each debate
│   └─ Prioritize fixes based on consensus
│
├─ Phase 2: Apply DNA Insights
│   ├─ Extract structural lessons from DNA match
│   ├─ Apply to weak categories
│   └─ Document which insights used where
│
├─ Phase 3: Map Line-Level Changes
│   ├─ For each weak category:
│   │   ├─ Reference agent reasoning
│   │   ├─ Apply debate consensus
│   │   ├─ Use DNA structural patterns
│   │   └─ Specify sourceAnalysis
│   └─ Ensure every change is traceable
│
├─ Phase 4: Validate Plan
│   ├─ Check all consensus weaknesses addressed
│   ├─ Verify DNA insights applied
│   ├─ Ensure debate resolutions honored
│   └─ Confirm target scores achievable
│
└─ Output: Comprehensive ExecutionPlan
    ├─ targetScore (based on consensus)
    ├─ scoreImprovementsByCategory (with dnaInsightApplied)
    ├─ lineLevelChanges (with sourceAnalysis)
    ├─ phoneticFixes (from Vocal Coach + Producer)
    ├─ furnitureAdditions (from Storyteller + cinema audit)
    ├─ dnaMatchInsights (structured by type)
    ├─ agentDebateResolutions (which debates influenced plan)
    └─ consensusPriorities (ranked list of fixes)
```

**Planner Agent Prompt Structure:**
```typescript
const plannerPrompt = `
You are the PLANNER AGENT - an elite songwriter who synthesizes insights from 
5 expert agents, DNA match analysis, and debate outcomes to create a systematic 
execution plan for song improvement.

**YOUR INPUTS:**

**1. BASE ANALYSIS (DNA Match)**
${song.analysis.dnaMatch}
Key Structural Lessons:
${extractStructuralLessons(song.analysis.dnaMatch)}

**2. FIVE AGENT ANALYSES**

Lyricist (Lyrical Originality: ${lyricist.score}/10):
${lyricist.reasoning}
Key Insight: ${lyricist.keyInsight}

Storyteller (4 categories):
- Narrative Arc: ${storyteller.narrativeArc.score}/10
  Reasoning: ${storyteller.narrativeArc.reasoning}
- Imagery: ${storyteller.imagerySensory.score}/10
  Reasoning: ${storyteller.imagerySensory.reasoning}
- Thematic Cohesion: ${storyteller.thematicCohesion.score}/10
  Reasoning: ${storyteller.thematicCohesion.reasoning}
- Emotional Impact: ${storyteller.emotionalImpact.score}/10
  Reasoning: ${storyteller.emotionalImpact.reasoning}

Vocal Coach (2 categories):
- Vocal Playability: ${vocalCoach.vocalPlayability.score}/10
  Reasoning: ${vocalCoach.vocalPlayability.reasoning}
- Melodic Flow: ${vocalCoach.melodicFlow.score}/10
  Reasoning: ${vocalCoach.melodicFlow.reasoning}

Producer (2 categories):
- Sonic Density: ${producer.sonicDensity.score}/10
  Reasoning: ${producer.sonicDensity.reasoning}
- Structure & Pacing: ${producer.structurePacing.score}/10
  Reasoning: ${producer.structurePacing.reasoning}

Hitmaker (Commercial Potential: ${hitmaker.score}/10):
${hitmaker.reasoning}
Key Insight: ${hitmaker.keyInsight}

**3. AGENT DEBATES (3 Real Conversations)**

Debate 1: ${debate1.issue}
Expert: ${debate1.turns[0].agent} said: "${debate1.turns[0].message}"
Dissenter: ${debate1.turns[1].agent} said: "${debate1.turns[1].message}"
Questioner: ${debate1.turns[2].agent} asked: "${debate1.turns[2].message}"
Synthesizer: ${debate1.turns[3].agent} concluded: "${debate1.turns[3].message}"
Final Votes: ${formatVotes(debate1.finalVotes)}
Consensus: ${debate1.consensus}

[Repeat for debates 2 & 3]

**4. CONSENSUS DATA**

Strengths (all agents agree):
${consensusStrengths.map((s, i) => `${i+1}. ${s}`).join('\n')}

Weaknesses (all agents agree):
${consensusWeaknesses.map((w, i) => `${i+1}. ${w}`).join('\n')}

Tradeoff Decisions:
${tradeoffDecisions.map((t, i) => 
  `${i+1}. ${t.area}: ${t.priority} (${t.reasoning})`
).join('\n')}

**5. SONIC ANALYSIS**

Phonetics: ${sonicAnalysis.phonetics}
Density: ${sonicAnalysis.density}
Cinema Audit: ${sonicAnalysis.cinemaAudit.score}/10 (${sonicAnalysis.cinemaAudit.objects.length} objects)

**YOUR TASK:**

Create a comprehensive ExecutionPlan that:

1. **Honors Debate Outcomes**
   - Apply consensus from each debate
   - When agents disagreed, follow the vote results
   - Document which debate influenced each decision

2. **Applies DNA Insights**
   - Use structural lessons from A-tier song
   - Map DNA patterns to weak categories
   - Document which DNA insight used where

3. **Addresses All Weaknesses**
   - Every consensus weakness must have a fix
   - Each fix must reference the agent who identified it
   - Prioritize by debate outcomes

4. **Traces All Decisions**
   - Every line change must have sourceAnalysis
   - Every strategy must reference agent reasoning
   - Every target score must be justified by agent input

5. **Validates Feasibility**
   - Target scores must be achievable
   - Strategies must be specific and measurable
   - Plan must be executable in one rewrite pass

**OUTPUT SCHEMA:**
{
  targetScore: number, // Justified by agent consensus
  scoreImprovementsByCategory: [
    {
      category: string,
      currentScore: number,
      targetScore: number,
      strategy: string, // Reference agent reasoning
      dnaInsightApplied: string, // Which DNA lesson applied
      debateInfluence: string // Which debate outcome informed this
    }
  ],
  lineLevelChanges: [
    {
      lineNumber: number,
      originalLine: string,
      newLine: string,
      reason: string,
      categoryImproved: string,
      sourceAnalysis: 'AgentDebate' | 'DNAMatch' | 'SonicAnalysis' | 'AgentInsight',
      agentSource: string // Which agent drove this change
    }
  ],
  phoneticFixes: [
    {
      issue: string, // From Vocal Coach + Producer
      fix: string
    }
  ],
  furnitureAdditions: string[], // From cinema audit + Storyteller
  dnaMatchInsights: {
    structural: string[], // Applied structural lessons
    wordSpacing: string[], // Applied phrasing lessons
    metaphorical: string[], // Applied metaphor techniques
    narrative: string[], // Applied storytelling techniques
    sonic: string[] // Applied phonetic patterns
  },
  agentDebateResolutions: [
    {
      debateIssue: string,
      resolution: string,
      appliedToCategories: string[]
    }
  ],
  consensusPriorities: [
    {
      priority: number, // 1 = highest
      category: string,
      fix: string,
      justification: string // Why this is high priority
    }
  ]
}

**CRITICAL RULES:**
1. NEVER make a change without tracing it to an agent or DNA insight
2. ALWAYS honor debate consensus (don't override vote results)
3. EVERY weak category must have a specific improvement strategy
4. DNA insights must be ACTIONABLE (not generic like "improve metaphors")
5. Line changes must specify EXACTLY which line and why

Begin planning:
`;
```

---

### 2.3 Updated ExecutionPlan Schema

**File:** `types.ts:168-200` (ENHANCED)

**New Schema:**
```typescript
export interface ExecutionPlan {
  // Core plan
  targetScore: number;
  plannerJustification: string; // Why this target is achievable
  
  // Category improvements (enhanced)
  scoreImprovementsByCategory: {
    category: ScoringCategory;
    currentScore: number;
    targetScore: number;
    strategy: string;
    
    // NEW: Traceability fields
    dnaInsightApplied?: string; // Which DNA lesson influences this
    debateInfluence?: string; // Which debate outcome informed this
    agentSource: string; // Which agent identified this weakness
    priorityRank: number; // 1-10, based on consensus
  }[];
  
  // Line changes (enhanced)
  lineLevelChanges: {
    lineNumber: number;
    originalLine: string;
    newLine: string;
    reason: string;
    categoryImproved: ScoringCategory;
    
    // NEW: More specific source tracking
    sourceAnalysis: 'AgentDebate' | 'DNAMatch' | 'SonicAnalysis' | 'AgentInsight' | 'ConsensusWeakness';
    agentSource: string; // Which agent drove this change
    debateReference?: string; // If from debate, which one
    expectedImpact: number; // +0.5 to +2.0 score improvement
  }[];
  
  // Phonetic fixes (existing)
  phoneticFixes?: {
    issue: string;
    fix: string;
    agentSource: 'VocalCoach' | 'Producer'; // NEW
  }[];
  
  // Furniture additions (existing)
  furnitureAdditions?: string[];
  
  // NEW: DNA match insights (properly structured)
  dnaMatchInsights: {
    structural: string[]; // Applied structural lessons
    wordSpacing: string[]; // Applied phrasing lessons
    metaphorical: string[]; // Applied metaphor techniques
    narrative: string[]; // Applied storytelling techniques
    sonic: string[]; // Applied phonetic patterns
  };
  
  // NEW: Agent debate resolutions
  agentDebateResolutions: {
    debateIssue: string; // e.g., "Lyrical depth vs Commercial appeal"
    debateIndex: number; // 0, 1, or 2
    resolution: string; // Consensus from debate
    winningPosition: 'A' | 'B' | 'compromise';
    voteBreakdown: Record<string, 'A' | 'B' | 'compromise'>; // How each agent voted
    appliedToCategories: ScoringCategory[]; // Which categories this affects
  }[];
  
  // NEW: Consensus priorities
  consensusPriorities: {
    priority: number; // 1 = highest priority
    category: ScoringCategory;
    fix: string; // Specific action to take
    justification: string; // Why this is high priority (from agent consensus)
    agentsInAgreement: string[]; // Which agents flagged this
  }[];
  
  // NEW: Validation checklist
  validationChecklist: {
    allWeaknessesAddressed: boolean;
    allDebatesHonored: boolean;
    dnaInsightsApplied: boolean;
    phoneticIssuesFixed: boolean;
    targetScoresAchievable: boolean;
    planTraceability: boolean; // Every change has source
  };
  
  // Existing fields
  userApproved?: boolean;
  chatAgentNotes?: string[];
}
```

---

### 2.4 Data Flow Architecture

**Complete Data Flow:**
```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1: GENERATION (2s)                                   │
│  ┌──────────────────┐                                       │
│  │ Generate Song    │ → Song lyrics, style, title           │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 2: BASE ANALYSIS (1s)                                │
│  ┌──────────────────┐                                       │
│  │ DNA Match Only   │ → Structural lessons from A-tier hits │
│  │ (gemini-flash)   │ → Key observations for agents         │
│  └──────────────────┘                                       │
│                                                              │
│  NO SCORING - agents will do that                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 3: AGENT ANALYSIS (3s)                               │
│  ┌───────────────────────────────────────────────┐          │
│  │  5 Agents run in PARALLEL (Promise.all)      │          │
│  │                                               │          │
│  │  Each agent receives:                         │          │
│  │  - Song lyrics                                │          │
│  │  - Base analysis (DNA match + observations)   │          │
│  │  - User preferences                           │          │
│  │                                               │          │
│  │  Each agent outputs:                          │          │
│  │  - Scores for their categories                │          │
│  │  - Detailed reasoning per category            │          │
│  │  - Key insights from their expertise          │          │
│  │  - Specific improvement suggestions           │          │
│  └───────────────────────────────────────────────┘          │
│                                                              │
│  Agent outputs stored as:                                   │
│  - lyricist: LyricistAnalysis                               │
│  - storyteller: StorytellerAnalysis                         │
│  - vocalCoach: VocalCoachAnalysis                           │
│  - producer: ProducerAnalysis                               │
│  - hitmaker: HitmakerAnalysis                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 4: CONFLICT DETECTION (instant)                      │
│  ┌──────────────────────────────────────────────┐           │
│  │  Calculate score variances per category      │           │
│  │  - Find where agents disagree most           │           │
│  │  - Identify expert vs dissenter for each     │           │
│  │  - Select top 3 most contentious areas       │           │
│  └──────────────────────────────────────────────┘           │
│                                                              │
│  Output: tradeoffDecisions[]                                │
│  [                                                           │
│    { area: "Lyrical depth", variance: 3.2, ... },          │
│    { area: "Commercial appeal", variance: 2.8, ... },      │
│    { area: "Vocal playability", variance: 2.1, ... }       │
│  ]                                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 5: AGENT DEBATES (4s, parallelized)                 │
│  ┌────────────────────────────────────────────┐             │
│  │  FOR EACH OF 3 CONFLICTS (run in parallel) │             │
│  │                                             │             │
│  │  Turn 1: Expert states position (1s)       │             │
│  │  Input:                                     │             │
│  │  - Expert's full analysis                   │             │
│  │  - Category scores                          │             │
│  │  - Tradeoff description                     │             │
│  │  Output:                                    │             │
│  │  - Position statement (2-3 sentences)       │             │
│  │                                             │             │
│  │  Turn 2: Dissenter responds (1s)           │             │
│  │  Input:                                     │             │
│  │  - Expert's statement                       │             │
│  │  - Dissenter's full analysis                │             │
│  │  - Category scores                          │             │
│  │  Output:                                    │             │
│  │  - Counter-argument (2-3 sentences)         │             │
│  │                                             │             │
│  │  Turn 3: Questioner asks (1s)              │             │
│  │  Input:                                     │             │
│  │  - Both statements above                    │             │
│  │  - Questioner's domain expertise            │             │
│  │  Output:                                    │             │
│  │  - Clarifying question (1-2 sentences)      │             │
│  │                                             │             │
│  │  Turn 4: Synthesizer builds consensus (1s) │             │
│  │  Input:                                     │             │
│  │  - All 3 turns above                        │             │
│  │  - User preferences                         │             │
│  │  - Tradeoff context                         │             │
│  │  Output:                                    │             │
│  │  - Consensus statement (2-3 sentences)      │             │
│  │                                             │             │
│  │  Turn 5: All agents vote                   │             │
│  │  Input:                                     │             │
│  │  - Full debate transcript                   │             │
│  │  - Their original analysis                  │             │
│  │  Output:                                    │             │
│  │  - Vote (A/B/compromise) with reasoning     │             │
│  └────────────────────────────────────────────┘             │
│                                                              │
│  Output: agentDebates[]                                     │
│  [                                                           │
│    {                                                         │
│      issue: "Lyrical depth vs Commercial appeal",          │
│      turns: [DebateTurn, ...],                             │
│      finalVotes: { Lyricist: 'A', Hitmaker: 'B', ... },   │
│      consensus: "Use metaphors in verses, simple chorus"   │
│    },                                                        │
│    { ... }, // Debate 2                                    │
│    { ... }  // Debate 3                                    │
│  ]                                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 6: BUILD CONSENSUS (instant)                         │
│  ┌──────────────────────────────────────────────┐           │
│  │  Aggregate agent analyses + debate outcomes  │           │
│  │                                               │           │
│  │  consensusStrengths: [                        │           │
│  │    "Strong metaphorical imagery",             │           │
│  │    "Consistent emotional tone"                │           │
│  │  ]                                            │           │
│  │                                               │           │
│  │  consensusWeaknesses: [                       │           │
│  │    "Chorus too complex for singalong",        │           │
│  │    "Missing concrete objects"                 │           │
│  │  ]                                            │           │
│  │                                               │           │
│  │  tradeoffDecisions: [                         │           │
│  │    {                                          │           │
│  │      area: "Lyrical depth vs simplicity",     │           │
│  │      priority: "High",                        │           │
│  │      reasoning: "3/5 agents voted compromise" │           │
│  │    }                                          │           │
│  │  ]                                            │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 7: USER VIEWS ANALYSIS                               │
│  - Show agent scores                                         │
│  - Show consensus strengths/weaknesses                      │
│  - Allow user to open debate modal                          │
│  - User clicks "Rewrite with Improvements"                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 8: PLANNER AGENT (6s)                                │
│  ┌──────────────────────────────────────────────┐           │
│  │  Planner Agent receives ALL context:         │           │
│  │                                               │           │
│  │  1. Base Analysis (DNA match insights)       │           │
│  │  2. 5 Agent Analyses (full reasoning)        │           │
│  │  3. Agent Debates (3 conversations)          │           │
│  │  4. Consensus Data (strengths/weaknesses)    │           │
│  │  5. Programmatic Scores (hook, vocal, etc)   │           │
│  │  6. Sonic Analysis (phonetics, density)      │           │
│  │                                               │           │
│  │  Planner creates ExecutionPlan:              │           │
│  │  ├─ targetScore (justified by consensus)     │           │
│  │  ├─ scoreImprovementsByCategory (with DNA)   │           │
│  │  ├─ lineLevelChanges (with sourceAnalysis)   │           │
│  │  ├─ phoneticFixes (from Vocal Coach)         │           │
│  │  ├─ furnitureAdditions (from Storyteller)    │           │
│  │  ├─ dnaMatchInsights (structured)            │           │
│  │  ├─ agentDebateResolutions (applied)         │           │
│  │  └─ consensusPriorities (ranked)             │           │
│  │                                               │           │
│  │  Model: gemini-2.0-flash-exp                 │           │
│  │  Thinking budget: 2048 tokens                │           │
│  │  Temperature: 0.7                             │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 9: DISPLAY EXECUTION PLAN                            │
│  ┌──────────────────────────────────────────────┐           │
│  │  Show user the plan:                          │           │
│  │  - Target scores by category                  │           │
│  │  - Specific line changes with reasoning       │           │
│  │  - Which debates influenced decisions         │           │
│  │  - Which DNA insights were applied            │           │
│  │  - Validation checklist                       │           │
│  │                                               │           │
│  │  User can:                                    │           │
│  │  - Approve (execute rewrite)                  │           │
│  │  - Reject (back to analysis)                  │           │
│  │  - Modify (chat with planner agent)           │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 10: EXECUTE REWRITE (4s)                             │
│  ┌──────────────────────────────────────────────┐           │
│  │  Rewrite Agent receives:                      │           │
│  │  - Original lyrics                            │           │
│  │  - ExecutionPlan (detailed)                   │           │
│  │                                               │           │
│  │  Rewrite Agent applies:                       │           │
│  │  - Every lineLevelChange                      │           │
│  │  - Every phoneticFix                          │           │
│  │  - Every furnitureAddition                    │           │
│  │  - Honors debate consensus                    │           │
│  │  - Uses DNA insights                          │           │
│  │                                               │           │
│  │  Model: gemini-2.5-flash                      │           │
│  │  Temperature: 0.75                            │           │
│  │  Structured output: New lyrics + summary      │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 11: ANALYSIS OF REWRITE (repeat from Stage 2)       │
│  - New song analyzed by 5 agents                            │
│  - Compare to original                                      │
│  - Validate execution plan was followed                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Part 3: Implementation Details

### 3.1 New File: `services/plannerAgent.ts`

**Purpose:** 6th agent that creates execution plans from all analysis data

**Key Functions:**
```typescript
export interface PlannerAgentInput {
  song: GeneratedSong;
  baseAnalysis: {
    dnaMatch: string;
    keyObservations: string;
  };
  agentAnalyses: {
    lyricist: LyricistAnalysis;
    storyteller: StorytellerAnalysis;
    vocalCoach: VocalCoachAnalysis;
    producer: ProducerAnalysis;
    hitmaker: HitmakerAnalysis;
  };
  agentDebates: AgentDebate[];
  consensusData: {
    strengths: string[];
    weaknesses: string[];
    tradeoffDecisions: TradeoffDecision[];
  };
  sonicAnalysis: SonicAnalysis;
  programmaticScores: ProgrammaticScores;
}

export async function generateExecutionPlan(
  input: PlannerAgentInput,
  userPreferences: {
    useAdvancedLogic: boolean;
    useMetaphorLogic: boolean;
    useCommercialMode: boolean;
  }
): Promise<ExecutionPlan> {
  // Build comprehensive prompt with ALL data
  const prompt = buildPlannerPrompt(input, userPreferences);
  
  // Call AI with enhanced schema
  const response = await callGeminiAPI(
    prompt,
    'gemini-2.0-flash-exp',
    {
      responseMimeType: 'application/json',
      responseSchema: ENHANCED_EXECUTION_PLAN_SCHEMA,
      thinkingBudget: 2048,
      temperature: 0.7,
      systemInstruction: PLANNER_SYSTEM_INSTRUCTION
    }
  );
  
  const plan = JSON.parse(response.text) as ExecutionPlan;
  
  // Validate plan
  validateExecutionPlan(plan, input);
  
  return plan;
}

function validateExecutionPlan(
  plan: ExecutionPlan,
  input: PlannerAgentInput
): void {
  const errors: string[] = [];
  
  // 1. Check all consensus weaknesses addressed
  const addressedWeaknesses = new Set(
    plan.lineLevelChanges.map(c => c.categoryImproved)
  );
  
  input.consensusData.weaknesses.forEach(weakness => {
    const category = mapWeaknessToCategory(weakness);
    if (!addressedWeaknesses.has(category)) {
      errors.push(`Consensus weakness "${weakness}" not addressed in plan`);
    }
  });
  
  // 2. Check all debates honored
  input.agentDebates.forEach((debate, idx) => {
    const resolution = plan.agentDebateResolutions.find(r => r.debateIndex === idx);
    if (!resolution) {
      errors.push(`Debate ${idx} ("${debate.issue}") not reflected in plan`);
    }
  });
  
  // 3. Check DNA insights applied
  if (!plan.dnaMatchInsights || 
      Object.values(plan.dnaMatchInsights).every(arr => arr.length === 0)) {
    errors.push('DNA match insights not applied to plan');
  }
  
  // 4. Check source traceability
  plan.lineLevelChanges.forEach((change, idx) => {
    if (!change.sourceAnalysis) {
      errors.push(`Line change ${idx} missing sourceAnalysis`);
    }
    if (!change.agentSource) {
      errors.push(`Line change ${idx} missing agentSource`);
    }
  });
  
  // 5. Check target scores realistic
  plan.scoreImprovementsByCategory.forEach(improvement => {
    const delta = improvement.targetScore - improvement.currentScore;
    if (delta > 3) {
      errors.push(
        `Unrealistic target for ${improvement.category}: ` +
        `+${delta} points in one rewrite`
      );
    }
    if (delta <= 0) {
      errors.push(
        `No improvement planned for ${improvement.category}: ` +
        `${improvement.currentScore} → ${improvement.targetScore}`
      );
    }
  });
  
  if (errors.length > 0) {
    console.warn('⚠️  Execution Plan Validation Warnings:');
    errors.forEach(err => console.warn(`  - ${err}`));
  }
  
  plan.validationChecklist = {
    allWeaknessesAddressed: !errors.some(e => e.includes('weakness')),
    allDebatesHonored: !errors.some(e => e.includes('Debate')),
    dnaInsightsApplied: !errors.some(e => e.includes('DNA')),
    phoneticIssuesFixed: plan.phoneticFixes && plan.phoneticFixes.length > 0,
    targetScoresAchievable: !errors.some(e => e.includes('Unrealistic')),
    planTraceability: !errors.some(e => e.includes('missing'))
  };
}
```

---

### 3.2 Modified: `services/geminiService.ts`

**Change `rewriteSongWithImprovements` to use Planner Agent:**

```typescript
export const rewriteSongWithImprovements = async (
  song: GeneratedSong, 
  useAdvancedLogic: boolean, 
  useMetaphorLogic: boolean,
  useCommercialMode: boolean
): Promise<GeneratedSong> => {
  if (!song.analysis) throw new Error("Analysis required before rewriting");
  
  console.log('🎯 Starting rewrite with Planner Agent...');
  
  // NEW: Gather ALL analysis data for planner
  const plannerInput: PlannerAgentInput = {
    song,
    baseAnalysis: {
      dnaMatch: song.analysis.dnaMatch,
      keyObservations: song.analysis.structuralAdvice
    },
    agentAnalyses: {
      lyricist: song.analysis.agentAnalyses.lyricist,
      storyteller: song.analysis.agentAnalyses.storyteller,
      vocalCoach: song.analysis.agentAnalyses.vocalCoach,
      producer: song.analysis.agentAnalyses.producer,
      hitmaker: song.analysis.agentAnalyses.hitmaker
    },
    agentDebates: song.analysis.agentDebates || [],
    consensusData: {
      strengths: song.analysis.consensusStrengths || [],
      weaknesses: song.analysis.consensusWeaknesses || [],
      tradeoffDecisions: song.analysis.tradeoffDecisions || []
    },
    sonicAnalysis: song.analysis.sonicAnalysis,
    programmaticScores: song.analysis.programmaticScores
  };
  
  // NEW: Generate comprehensive execution plan
  const executionPlan = await generateExecutionPlan(
    plannerInput,
    { useAdvancedLogic, useMetaphorLogic, useCommercialMode }
  );
  
  console.log('📋 Execution Plan Generated:');
  console.log(`  Target Score: ${executionPlan.targetScore}`);
  console.log(`  Line Changes: ${executionPlan.lineLevelChanges.length}`);
  console.log(`  Debates Applied: ${executionPlan.agentDebateResolutions.length}`);
  console.log(`  DNA Insights: ${Object.values(executionPlan.dnaMatchInsights).flat().length}`);
  
  // Execute rewrite with detailed plan
  const rewriteResult = await executeRewrite(song, executionPlan);
  
  return {
    ...song,
    lyrics: rewriteResult.lyrics,
    technicalExplanation: rewriteResult.changesSummary,
    executionPlan, // Store the plan for validation
    hasAdvancedLogic: useAdvancedLogic,
    hasMetaphorLogic: useMetaphorLogic,
    hasCommercialMode: useCommercialMode
  };
};

async function executeRewrite(
  song: GeneratedSong,
  plan: ExecutionPlan
): Promise<{ lyrics: string; changesSummary: string }> {
  const prompt = `
    You are executing a systematic song rewrite based on a detailed execution plan.
    
    **ORIGINAL LYRICS:**
    ${song.lyrics}
    
    **EXECUTION PLAN:**
    Target Score: ${plan.targetScore}
    
    **CATEGORY IMPROVEMENTS:**
    ${plan.scoreImprovementsByCategory.map(imp => `
      ${imp.category}: ${imp.currentScore} → ${imp.targetScore}
      Strategy: ${imp.strategy}
      DNA Insight: ${imp.dnaInsightApplied || 'None'}
      Debate Influence: ${imp.debateInfluence || 'None'}
    `).join('\n')}
    
    **LINE-LEVEL CHANGES:**
    ${plan.lineLevelChanges.map(change => `
      Line ${change.lineNumber}: "${change.originalLine}" → "${change.newLine}"
      Reason: ${change.reason}
      Improves: ${change.categoryImproved}
      Source: ${change.sourceAnalysis} (${change.agentSource})
    `).join('\n')}
    
    **PHONETIC FIXES:**
    ${plan.phoneticFixes?.map(fix => `
      Issue: ${fix.issue}
      Fix: ${fix.fix}
    `).join('\n') || 'None'}
    
    **FURNITURE ADDITIONS:**
    ${plan.furnitureAdditions?.join(', ') || 'None'}
    
    **DNA INSIGHTS TO APPLY:**
    Structural: ${plan.dnaMatchInsights.structural.join(', ')}
    Word Spacing: ${plan.dnaMatchInsights.wordSpacing.join(', ')}
    Metaphorical: ${plan.dnaMatchInsights.metaphorical.join(', ')}
    Narrative: ${plan.dnaMatchInsights.narrative.join(', ')}
    Sonic: ${plan.dnaMatchInsights.sonic.join(', ')}
    
    **AGENT DEBATE RESOLUTIONS TO HONOR:**
    ${plan.agentDebateResolutions.map(res => `
      ${res.debateIssue}: ${res.resolution}
      Winning Position: ${res.winningPosition}
      Applies to: ${res.appliedToCategories.join(', ')}
    `).join('\n')}
    
    **YOUR TASK:**
    1. Apply EVERY line change specified above
    2. Fix EVERY phonetic issue listed
    3. Add EVERY furniture item listed
    4. Honor EVERY debate resolution
    5. Apply EVERY DNA insight where relevant
    6. Ensure the new lyrics match the target scores
    
    **CRITICAL RULES:**
    - Follow the execution plan EXACTLY
    - Don't make changes not in the plan
    - If a line change is specified, USE THAT EXACT NEW LINE
    - Validate all debate resolutions are honored
    
    Output new lyrics and a summary of changes.
  `;
  
  const response = await callGeminiAPI(
    prompt,
    'gemini-2.5-flash',
    {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lyrics: { type: Type.STRING },
          changesSummary: { type: Type.STRING }
        },
        required: ['lyrics', 'changesSummary']
      },
      temperature: 0.75,
      systemInstruction: 
        'You are a meticulous songwriter who executes plans precisely. ' +
        'Follow instructions exactly. Never deviate from the execution plan.'
    }
  );
  
  return JSON.parse(response.text);
}
```

---

### 3.3 Cost Analysis

**New System Costs:**

| Stage | API Calls | Model | Cost | Time |
|-------|-----------|-------|------|------|
| **Base Analysis** | 1 | flash-exp | $0.001 | 1s |
| **5 Agents (initial)** | 5 | flash-exp (512 thinking) | $0.005 | 3s |
| **3 Debates (parallel)** | 12 (3×4 turns) | flash-exp (256 thinking) | $0.012 | 4s |
| **Planner Agent** | 1 | flash-exp (2048 thinking) | $0.003 | 6s |
| **Execute Rewrite** | 1 | flash-2.5 | $0.002 | 4s |
| **Re-analysis** | 6 | (same as generation) | $0.019 | 8s |
| **TOTAL** | **26** | Mixed | **$0.042** | **26s** |

**Comparison:**

| System | Cost | Time | Authentic Debates | DNA Applied | Agent Insights Used |
|--------|------|------|-------------------|-------------|---------------------|
| **Current** | $0.070 | 8s | ❌ No | ❌ No | ⚠️ Partial |
| **Proposed** | $0.042 | 26s | ✅ Yes | ✅ Yes | ✅ Full |

**Trade-offs:**
- ✅ 40% cheaper ($0.070 → $0.042)
- ⚠️ 3x slower (8s → 26s)
- ✅ Real debates (not simulated)
- ✅ DNA insights applied
- ✅ Full agent collaboration

**User's Position:** "The tradeoff for real debate is worth it, do not mind the longer time"

---

## 📝 Part 4: Summary & Next Steps

### 4.1 What We Discovered

**Current System Issues:**
1. ❌ Agents never communicate (parallel execution, no conversation)
2. ❌ Debates are fake (deterministic vote functions)
3. ❌ Rewrite planner ignores agent debates
4. ❌ DNA insights not applied to execution plan
5. ❌ No traceability (can't see which agent influenced which change)
6. ❌ Execution plan schema has good fields but they're never populated

**Architecture Gaps:**
1. Missing: Real-time agent collaboration
2. Missing: Planner Agent (6th agent) to synthesize all data
3. Missing: Data flow from debates → execution plan
4. Missing: DNA insight application to specific categories
5. Missing: Validation that execution plan honors consensus

### 4.2 Proposed Solutions

**1. Real Agent Debates** (4s, parallelized)
- 4-turn conversation structure (expert → dissenter → questioner → synthesizer)
- All agents vote AFTER hearing full discussion
- Debates run in parallel (3 debates in 4s)
- Real AI-generated conversations, not deterministic

**2. Planner Agent** (6s)
- New 6th agent synthesizes ALL analysis data
- Creates comprehensive execution plan
- Honors debate outcomes
- Applies DNA insights
- Ensures traceability

**3. Enhanced ExecutionPlan Schema**
- Add `debateInfluence`, `agentSource`, `expectedImpact`
- Add `agentDebateResolutions[]`
- Add `consensusPriorities[]`
- Add `validationChecklist`
- Populate existing fields (`dnaMatchInsights`, `sourceAnalysis`)

**4. Complete Data Flow**
- Base Analysis → Agent Analysis → Debates → Consensus → Planner → Execution → Validation
- Every decision traceable to source
- No data ignored

### 4.3 Implementation Order

**Phase 1: Real Agent Debates** (from CRITICAL_FIXES_PLAN.md)
1. Streamline base analysis (remove scoring)
2. Add thinking budget to agents
3. Implement 4-turn debate system
4. Parallelize debate generation

**Phase 2: Planner Agent** (THIS DOCUMENT)
1. Create `services/plannerAgent.ts`
2. Define enhanced ExecutionPlan schema
3. Build comprehensive planner prompt
4. Implement plan validation
5. Update `rewriteSongWithImprovements` to use planner

**Phase 3: Integration** 
1. Wire agent debates → planner input
2. Wire DNA insights → planner input
3. Wire consensus data → planner input
4. Test full data flow
5. Validate execution plans

**Phase 4: UI Updates**
1. Display execution plan with traceability
2. Show which debates influenced plan
3. Show which DNA insights applied
4. Add validation checklist visualization

### 4.4 Success Criteria

**Functional:**
- ✅ Agents have real conversations (not simulated votes)
- ✅ Execution plans trace every change to source
- ✅ DNA insights applied to specific categories
- ✅ Debate outcomes honored in plan
- ✅ All consensus weaknesses addressed

**Performance:**
- ✅ Total time < 30s (user accepts this)
- ✅ Cost < $0.05 per generation
- ✅ Debates run in parallel (4s not 12s)
- ✅ No crashes or timeouts

**Quality:**
- ✅ Debates feel authentic (agents build on each other)
- ✅ Plans are comprehensive (not generic)
- ✅ Every change is justified
- ✅ Validation checklist passes
- ✅ Rewrites improve scores reliably

---

**End of Architecture Document**

*This document defines the correct architecture for both agent debates and execution planning. Ready to integrate into CRITICAL_FIXES_PLAN.md.*
