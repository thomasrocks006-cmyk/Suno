# Agent Debate Architecture Rewrite - Master Implementation Plan
## Part 2 of 4: Proposed Solution Architecture (v5 FINAL)

**Created:** November 25, 2025, 12:09 PM  
**Updated:** November 25, 2025, 3:45 PM  
**Status:** 🟢 BOARD APPROVED (v5)  
**Canonical Reference:** `BOARD_DIRECTIVE_v5_FINAL.md`  
**Depends On:** Part 1 (Overview & Current State Analysis)  

---

## 📋 Overview

This document details the **v5 FINAL architecture** for the agent debate system. 

### CRITICAL CHANGE FROM PREVIOUS VERSIONS

| Previous (Wrong) | v5 Final (Correct) |
|------------------|-------------------|
| 5 agents produce scores | 5 agents DEBATE ONLY (no scoring) |
| 6 agents total | 8 agents total |
| Base analysis does scoring | Structural Scan (no scoring) |
| No separate Analyst | **Analyst Agent** (PhD Musicologist) scores independently |
| Judge combined with Planner | Judge and Planner are SEPARATE roles |

---

## 🎯 Architectural Vision

### Core Principle
**Separation of Concerns: Debaters DEBATE, Analyst SCORES, Planner PLANS**

```
Song → Structural Scan → 5 Agents DEBATE → Judge DECIDES → Analyst SCORES → Planner PLANS → User APPROVES
              ↓               ↓                ↓                 ↓                ↓
           (DNA, Structure)  (Ideas, Challenges)  (Mandates)    (10 Scores)    (Draft Plan)
```

### The 8 Agents

| # | Agent | Model | Role | Produces Scores? |
|---|-------|-------|------|------------------|
| 1 | Lyricist | Gemini 2.5 Pro | DEBATES originality, wordplay, clichés | ❌ NO |
| 2 | Storyteller | Gemini 2.5 Pro | DEBATES narrative, emotion, imagery | ❌ NO |
| 3 | Hitmaker | Gemini 2.5 Pro | DEBATES commercial appeal, hooks | ❌ NO |
| 4 | Producer | Gemini 3.0 Pro | DEBATES structure, pacing, arrangement | ❌ NO |
| 5 | Vocal Coach | Gemini 2.0 Flash | DEBATES phonetics, singability | ❌ NO |
| 6 | **Judge** | Gemini 3.0 Pro | DECIDES - creates mandates from debate | ❌ NO |
| 7 | **Analyst** | Gemini 3.0 Pro | GRADES - PhD Musicologist, ALL 10 scores | ✅ **YES** |
| 8 | **Planner** | Gemini 3.0 Pro | PLANS - creates DraftExecutionPlan | ❌ NO |

---

## 🔬 Step 1: Structural Scan (NOT Scoring)

**Model:** Gemini 2.0 Flash (fast, cheap)  
**Duration:** ~1 second  
**Purpose:** Gather objective data about the song

### Outputs (Data Only, NO Scores)

```typescript
interface StructuralScanResult {
  // DNA Matching
  dnaMatch: {
    songTitle: string;
    artist: string;
    matchPercentage: number;
    structuralLessons: string[];
  };
  
  // Structure Mapping
  structure: {
    sections: Array<{
      type: 'verse' | 'chorus' | 'bridge' | 'pre-chorus' | 'outro' | 'intro';
      startLine: number;
      endLine: number;
      lines: string[];
    }>;
    format: string; // e.g., "V-C-V-C-B-C"
  };
  
  // Syllable Analysis (programmatic)
  syllables: {
    perLine: number[];
    average: number;
    variance: number;
  };
  
  // Rhyme Detection (programmatic)
  rhymeScheme: {
    pattern: string; // e.g., "ABAB CDCD"
    rhymePairs: Array<[number, number]>;
  };
  
  // ❌ NO SCORING - Analyst does this later
}
```

### What Changed from Base Analysis

| Old Base Analysis | New Structural Scan |
|-------------------|---------------------|
| ❌ 6 category scores | ✅ NO scores |
| ❌ Strengths/weaknesses | ✅ Just data |
| ✅ DNA match | ✅ DNA match |
| ✅ Structure detection | ✅ Structure detection |
| ❌ Agent insights | ✅ Just structure |

---

## 🗣️ Step 2: The Council Debates (10-15 seconds)

### Key Design Principle
> **The 5 agents DO NOT produce scores. They DISCUSS the song.**

### What Agents Do in Debates

✅ **DISCUSS** the song's qualities  
✅ **CHALLENGE** each other's ideas  
✅ **QUESTION** assumptions  
✅ **PROPOSE** improvements  
✅ **BOUNCE** ideas off each other  
❌ **DO NOT** produce individual scores  

### Debate Flow

```
Phase 1: Opening Statements (2-3s)
   Each agent reads the lyrics and DNA match
   Each agent shares initial observations (NOT scores)
   "I notice the chorus uses 'heart on fire' which is clichéd..."

Phase 2: Discussion & Challenge (5-8s)
   Agents respond to each other's observations
   Challenges are raised: "But that cliché has commercial resonance..."
   Proposals are made: "What if we add concrete imagery around it?"
   Counter-arguments: "That would break the syllable count..."

Phase 3: Final Positions (2-3s)
   Each agent summarizes their position
   Key recommendations crystallized
   Areas of agreement/disagreement noted
```

### Example Debate Transcript

```
┌────────────────────────────────────────────────────────────────────┐
│ LYRICIST:                                                          │
│ "The chorus uses 'heart on fire' - this phrase appears in 40% of  │
│ pop songs from 2020-2024. I'd push for something more original    │
│ like 'chest of embers' or even 'ribcage inferno'..."              │
│                                                                    │
│ HITMAKER:                                                          │
│ "I disagree. 'Heart on fire' has proven commercial resonance. The │
│ DNA match 'Heat Waves' uses similar phrasing. Changing it risks   │
│ the hook's memorability. We need to think about radio play."      │
│                                                                    │
│ STORYTELLER:                                                       │
│ "What if we keep the phrase but add concrete imagery around it?   │
│ 'Heart on fire in a house of ice' - now it's a metaphor system    │
│ that tells a story. We get both originality AND resonance."       │
│                                                                    │
│ PRODUCER:                                                          │
│ "That's 9 syllables. The original is 4. We'd need to restructure  │
│ the entire chorus meter. Not impossible, but significant work."   │
│                                                                    │
│ VOCAL COACH:                                                       │
│ "The 'f' in 'fire' into 'in' creates a nice flow. But 'house of   │
│ ice' ends on a hard 's' which is difficult to sustain on a long   │
│ note. Consider 'frozen halls' instead for better singability."    │
│                                                                    │
│ LYRICIST:                                                          │
│ "I accept the compromise. 'Heart on fire in frozen halls' keeps   │
│ the commercial hook, adds imagery, and flows better phonetically."│
│                                                                    │
│ HITMAKER:                                                          │
│ "Still concerned about syllable count. Can Producer confirm?"     │
│                                                                    │
│ PRODUCER:                                                          │
│ "7 syllables vs 4. Doable with a triplet rhythm on 'frozen halls'.│
│ The arrangement can accommodate this."                             │
│                                                                    │
│ ALL:                                                                │
│ "Agreement reached on chorus imagery enhancement."                 │
└────────────────────────────────────────────────────────────────────┘
```

### Debate Output

```typescript
interface DebateTranscript {
  debates: Array<{
    topic: string;
    turns: Array<{
      agent: string;
      statement: string;
      type: 'observation' | 'challenge' | 'proposal' | 'counter' | 'agreement';
    }>;
    outcome: 'consensus' | 'split' | 'unresolved';
    agreements: string[];
    disagreements: string[];
  }>;
  
  fullTranscript: string; // For user viewing
  
  // ❌ NO SCORES - Just discussion outcomes
}
```

---

## ⚖️ Step 3: The Judge (3 seconds)

**Model:** Gemini 3.0 Pro ("The Smartest in the Room")  
**Input:** Full debate transcript  
**Purpose:** Create binding decisions and mandates from debate outcomes

### What the Judge Does

✅ Listens to the FULL debate  
✅ Identifies which arguments won  
✅ Creates clear MANDATES for action  
✅ Cites which expert's argument prevailed and WHY  
❌ Does NOT score the song  

### Judge Output

```typescript
interface JudgeSummary {
  decisions: Array<{
    topic: string;               // "Chorus cliché debate"
    ruling: string;              // "Keep 'heart on fire' but add context"
    winner: string;              // "Storyteller's compromise"
    rationale: string;           // "Commercial viability + added depth"
    citedArguments: string[];    // Which arguments were decisive
    mandates: string[];          // Specific actionable directives
  }>;
  
  overriddenArguments: Array<{
    agent: string;
    claim: string;
    overrideReason: string;
  }>;
  
  unresolvedIssues: string[];    // Things Judge couldn't decide
  
  // ❌ NO SCORES
}
```

### Example Judge Decision

```json
{
  "topic": "Chorus cliché debate",
  "ruling": "Keep 'heart on fire' phrase but add concrete imagery context",
  "winner": "Storyteller's compromise, validated by Vocal Coach",
  "rationale": "Preserves commercial hook (Hitmaker) while adding originality (Lyricist). Producer confirmed syllable accommodation possible.",
  "citedArguments": [
    "Hitmaker's DNA evidence (Heat Waves uses similar phrasing)",
    "Storyteller's metaphor system proposal",
    "Vocal Coach's 'frozen halls' phonetic improvement",
    "Producer's triplet rhythm accommodation"
  ],
  "mandates": [
    "Change 'heart on fire' to 'heart on fire in frozen halls'",
    "Maintain 4-beat feel using triplet subdivision",
    "Ensure 's' in 'halls' isn't held longer than 1 beat"
  ]
}
```

---

## 📊 Step 4: The Analyst (4-5 seconds)

**Model:** Gemini 3.0 Pro  
**Persona:** PhD Musicologist  
**CRITICAL:** This agent is SEPARATE and INDEPENDENT

### Why The Analyst Is Separate

> "The scores should be graded independently by the separate analyst agent who grades and breaks down the metrics based on his expertise as a student of music and musicology phd" - Board Directive

1. **No Debate Bias:** The Analyst didn't participate in debates. They judge the ACTUAL LYRICS, not the discussion about them.

2. **Fresh Eyes:** Reads lyrics without preconceptions from agent discussions.

3. **Scholarly Rigor:** Applies academic musicology standards, not persuasive debate outcomes.

4. **Validation Function:** Can agree with or challenge Judge's decisions based on objective analysis.

### Analyst Inputs

```typescript
interface AnalystInputs {
  // 1. The actual lyrics (reads them FRESH)
  lyrics: string;
  
  // 2. DNA match from Structural Scan
  dnaMatch: DNAMatchResult;
  
  // 3. Judge's summary (what the debate concluded)
  judgeSummary: JudgeSummary;
  
  // ❌ Does NOT receive full debate transcript (no bias)
}
```

### Analyst Outputs (THE ONLY SCORING AGENT)

```typescript
interface DeepAnalysisReport {
  // ✅ 10-CATEGORY SCORING (with scholarly rigor)
  scoreBreakdown: Array<{
    category: string;           // e.g., "Lyrical Originality"
    score: number;              // 1-10
    reasoning: string;          // "Uses 3 clichés but has 2 original metaphors..."
    evidence: string[];         // Specific lines cited
    improvementPotential: number; // How much this could improve
  }>;
  
  overallScore: number;         // Weighted average
  
  // ✅ STORY ARC ANALYSIS
  storyArcAnalysis: {
    structure: string;          // "Rising action → Climax → Resolution"
    emotionalJourney: string[];
    tensionPoints: number[];    // Line numbers
    characterConsistency: number; // 1-10
  };
  
  // ✅ IMAGERY AUDIT
  imageryAudit: {
    concreteObjects: string[];  // "fire", "ice", "halls"
    sensoryDetails: string[];   // "cold", "burning"
    abstractVsConcrete: number; // Ratio
    cinemaScore: number;        // 1-10 visual evocativeness
  };
  
  // ✅ LINE-BY-LINE IMPROVEMENTS
  lineByLineImprovements: Array<{
    lineNumber: number;
    original: string;
    suggestion: string;
    rationale: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  
  // ✅ DNA MATCH INSIGHTS
  dnaMatchInsights: {
    structuralLessons: string[];
    thematicParallels: string[];
    whatToAdopt: string[];
    whatToAvoid: string[];
  };
  
  // ✅ PHONETIC ANALYSIS
  phoneticAnalysis: {
    consonantClusterIssues: Array<{line: number, issue: string}>;
    vowelFlowScore: number;
    breathPointRecommendations: number[];
    singabilityScore: number;
  };
}
```

### The 10 Scoring Categories

| Category | What Analyst Evaluates |
|----------|------------------------|
| 1. Lyrical Originality | Cliché count, unique metaphors, fresh language |
| 2. Narrative Arc | Story structure, character journey |
| 3. Imagery & Sensory Detail | Concrete objects, sensory language |
| 4. Thematic Cohesion | Unified message, consistent metaphors |
| 5. Emotional Impact | Catharsis points, emotional resonance |
| 6. Vocal Playability | Singability, breath points |
| 7. Melodic & Phonetic Flow | Vowel/consonant patterns, rhythm |
| 8. Sonic Density | Word packing, syllable distribution |
| 9. Structure & Pacing | Section balance, dynamic range |
| 10. Commercial Potential | Hook strength, memorability |

### How Analyst Validates Judge Decisions

The Analyst can AGREE or CHALLENGE the Judge:

```typescript
interface AnalystValidation {
  judgeDecisionValidation: Array<{
    judgeMandate: string;
    analystAgreement: 'agree' | 'challenge' | 'partial';
    reasoning: string;
    scoreImpact: number; // If mandate followed
  }>;
}
```

**Example:**
- Judge mandated: "Keep 'heart on fire' with added imagery"
- Analyst scores Originality: 4.5/10
- Analyst note: "Judge's compromise is reasonable. If executed well, Originality could reach 6.5/10. However, recommend considering complete phrase replacement for maximum impact (+2.5 points)."

---

## 📋 Step 5: The Planner (3-4 seconds)

**Model:** Gemini 3.0 Pro ("The Final and Smartest Agent")  
**Location:** Floats in DeepAnalysis page AND Lyrics page  
**Purpose:** Create actionable execution plan from ALL inputs

### Planner Inputs

```typescript
interface PlannerInputs {
  // 1. Analyst's deep analysis (scores + insights)
  analystReport: DeepAnalysisReport;
  
  // 2. Judge's mandates (debate outcomes)
  judgeSummary: JudgeSummary;
  
  // 3. The actual lyrics
  lyrics: string;
  
  // 4. DNA match insights
  dnaMatch: DNAMatchResult;
  
  // 5. User preferences
  userPreferences: {
    targetScore?: number;
    priorityCategories?: string[];
    offLimitsLines?: number[];
  };
}
```

### What the Planner Does

✅ Cross-references Analyst's scores with Judge's mandates  
✅ Identifies conflicts (if any)  
✅ Prioritizes changes based on impact  
✅ Maps rhyme dependencies (which lines must move together)  
✅ Creates specific, actionable execution plan  
❌ Does NOT auto-execute  

### Planner Output

```typescript
interface DraftExecutionPlan {
  // Target improvement
  targetScore: number;          // e.g., 82 (from 68.5)
  justification: string;        // Why this target is achievable
  
  // Prioritized changes
  prioritizedChanges: Array<{
    priority: number;           // 1 = highest
    change: string;             // "Add concrete imagery to chorus"
    source: string;             // "Judge mandate + Analyst imagery audit"
    affectedLines: number[];    // [12, 13, 14]
    dependencyGroup: number[];  // [12, 14] - rhyme linked, move together
    expectedImpact: string;     // "+1.5 to Imagery score"
  }>;
  
  // Line-level specifics
  lineLevelChanges: Array<{
    lineNumber: number;
    original: string;
    proposed: string;
    rationale: string;
    sourceAnalysis: string;     // "JudgeMandate + AnalystLine12"
    rhymeConstraint: string;    // "Must rhyme with line 14"
  }>;
  
  // Few-shot examples for rewrite agent
  fewShotExamples: Array<{
    before: string;
    after: string;
    style: string;              // "Abstract → Concrete object"
  }>;
  
  // ⚠️ DRAFT - Requires user approval
  status: 'draft';
}
```

### Rhyme Dependency Groups

```typescript
// Critical: Lines that rhyme must change TOGETHER
const dependencyGroups = [
  [1, 3],   // Verse 1 lines 1 & 3 rhyme
  [2, 4],   // Verse 1 lines 2 & 4 rhyme
  [12, 14], // Chorus lines rhyme
  // ...
];

// If line 12 changes, line 14 MUST also change to maintain rhyme
```

---

## 🎖️ Step 6: War Room (User Approval)

**CRITICAL:** The Planner does NOT auto-execute. User must approve.

### War Room UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  📋 DRAFT EXECUTION PLAN                                            │
│  Target: 68.5 → 82 (+13.5 points)                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PRIORITY 1: Chorus Imagery Enhancement                              │
│  Source: Judge Mandate + Analyst Imagery Audit                       │
│  Expected Impact: +1.5 Imagery, +0.5 Originality                    │
│                                                                      │
│  Line 12: "My heart is on fire"                                     │
│         → "My heart's on fire in frozen halls"                       │
│  [✅ Approve] [❌ Veto] [✏️ Edit]                                    │
│                                                                      │
│  ⚠️ WARNING: Line 12 rhymes with Line 14                            │
│     Line 14 will also be updated:                                    │
│     "Through these empty walls" → "Through these frozen halls"       │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│  PRIORITY 2: Verse 2 Emotional Depth                                 │
│  Source: Analyst Story Arc Analysis                                  │
│  Expected Impact: +1.0 Emotional Impact                              │
│  ...                                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [📝 Add Manual Instruction]                                         │
│  [🔄 Ask Planner to Reconsider]                                      │
│  [▶️ EXECUTE APPROVED CHANGES]                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### User Actions

| Action | Result |
|--------|--------|
| ✅ Approve | Change will be applied |
| ❌ Veto | Change skipped |
| ✏️ Edit | User modifies proposed text |
| 📝 Manual | User adds custom instruction |
| 🔄 Reconsider | Planner regenerates that change |
| ▶️ Execute | Proceed to Two-Pass Rewrite |

---

## ✍️ Step 7: Two-Pass Rewrite (4 seconds)

### Pass 1: The Mason (Lyrics & Rhymes)

**Focus:** Apply approved line-level changes
- Honor rhyme dependency groups
- Maintain syllable counts (±2)
- Use few-shot examples for style guidance
- DO NOT add furniture yet

### Pass 2: The Decorator (Furniture)

**Focus:** Add performance annotations
- [Breath] marks
- (Ad-libs)
- [Visual Cues]
- DO NOT change words from Pass 1

### Why Two Passes?

Single-pass rewrites often LOSE furniture (ad-libs, breath marks) because the model focuses on lyrics. By separating:
1. Pass 1 perfects the WORDS
2. Pass 2 adds the PERFORMANCE LAYER

---

## ✅ Step 8: The Auditor (1 second)

**Type:** Programmatic validation (not AI)

### Checks

```typescript
interface AuditResult {
  rhymeIntegrity: {
    passed: boolean;
    issues: Array<{
      rhymePair: [number, number];
      original: [string, string];
      rewritten: [string, string];
      stillRhymes: boolean;
    }>;
  };
  
  syllableDrift: {
    passed: boolean;
    maxDrift: number;      // Acceptable: ±20%
    issues: Array<{
      lineNumber: number;
      original: number;
      rewritten: number;
      drift: number;
    }>;
  };
  
  changesApplied: {
    approved: number;
    applied: number;
    skipped: number;
    reasons: string[];
  };
}
```

### Warning Badges

If issues detected, UI shows:
- ⚠️ "Rhyme scheme may be broken in Verse 2"
- ⚠️ "Line 14 syllable count increased by 40%"

User can choose to accept or request fix.

---

## ⏱️ Timing Summary

| Step | Duration | Cumulative |
|------|----------|------------|
| Generation | 2s | 2s |
| Structural Scan | 1s | 3s |
| Council Debates | 10-15s | 13-18s |
| Judge | 3s | 16-21s |
| Analyst | 4-5s | 20-26s |
| **User sees Deep Analysis** | — | **~22s** |
| Planner (on demand) | 3-4s | 25-30s |
| User Review (War Room) | — | — |
| Two-Pass Rewrite | 4s | 29-34s |
| Auditor | 1s | 30-35s |

---

## 💰 Cost Analysis (Per Song)

| Step | Model | Input Tokens | Output Tokens | Cost |
|------|-------|--------------|---------------|------|
| Structural Scan | Flash | 1,000 | 500 | $0.0004 |
| 5 Debates (parallel) | Mixed | 5,000 | 3,000 | $0.012 |
| Judge | Pro | 4,000 | 1,000 | $0.008 |
| Analyst | Pro | 3,000 | 2,500 | $0.010 |
| Planner | Pro | 5,000 | 2,000 | $0.012 |
| Rewrite (2 passes) | Pro | 4,000 | 1,500 | $0.010 |
| **TOTAL** | — | 22,000 | 10,500 | **~$0.052** |

**vs Current (Fake Debates):** $0.070 → $0.052 = **26% cheaper** with REAL debates

---

## 📐 Architectural Principles

### 1. Separation of Concerns
- **Debaters** → Ideas only
- **Judge** → Decisions only
- **Analyst** → Scores only
- **Planner** → Strategy only

### 2. Independence of Scoring
The Analyst NEVER participates in debates. Their scoring is objective and unbiased by rhetoric.

### 3. User Control
- User sees debate (real-time)
- User sees analysis (after Analyst)
- User approves plan (War Room)
- User triggers rewrite (explicit action)

### 4. Full Traceability
Every change in the plan traces back to:
- A Judge mandate, OR
- An Analyst score/recommendation, OR
- A DNA insight, OR
- A user instruction

### 5. No Auto-Execution
The Planner creates a DRAFT. The user APPROVES. Only then does rewrite happen.

---

## Reference

**Canonical Source:** `/workspaces/Suno/AGENT_SYSTEM/MasterPlan/BOARD_DIRECTIVE_v5_FINAL.md`

This document is derived from and consistent with BOARD_DIRECTIVE_v5_FINAL.md.

---

**END OF PART 2 (v5 FINAL)**
