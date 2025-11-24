# Visual Architecture Roadmap

**Purpose:** High-level visual guide to the system transformation  
**Audience:** Developers, stakeholders, reviewers  

---

## 🎨 System Architecture: Before & After

### BEFORE (Current System - BROKEN)

```
┌─────────────────────────────────────────────────────────────┐
│  USER CLICKS "GENERATE"                                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  GENERATION (2s)                                             │
│  ┌────────────┐                                              │
│  │ Song Text  │ → Lyrics, title, style                      │
│  │ Image      │ → Album cover                               │
│  └────────────┘                                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  BASE ANALYSIS (3s) ❌ REDUNDANT                            │
│  ┌────────────────────────┐                                 │
│  │ gemini-3-pro-preview   │                                 │
│  │ - Scores 6 categories  │ ← WASTED (agents re-score)     │
│  │ - DNA match           │ ← GOOD but not used in rewrite  │
│  │ - Structural advice   │ ← GOOD but not used in rewrite  │
│  │ - Line-by-line fixes  │ ← Used but incomplete           │
│  └────────────────────────┘                                 │
│  Cost: $0.015 | Time: 3s                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  5 AGENTS (3s) ⚠️ NO COMMUNICATION                          │
│  ┌──────────────────────────────────────────┐               │
│  │  Promise.all([                           │               │
│  │    Lyricist,    ─┐                       │               │
│  │    Storyteller,  │ ← Run in parallel    │               │
│  │    Vocal Coach,  │    NO INTERACTION     │               │
│  │    Producer,     │    NO CONVERSATION    │               │
│  │    Hitmaker     ─┘    ISOLATED SILOS    │               │
│  │  ])                                      │               │
│  └──────────────────────────────────────────┘               │
│                                                              │
│  Result: 10 category scores + reasoning                     │
│  Problem: Agents never see each other's outputs            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  FAKE DEBATES (instant) ❌ SIMULATED                        │
│  ┌──────────────────────────────────────────┐               │
│  │  for (const tradeoff of conflicts) {     │               │
│  │    const lyricistVote =                  │               │
│  │      determineLyricistVote() ← FUNCTION  │               │
│  │    const storytellerVote =               │               │
│  │      determineStorytellerVote() ← FUNCTION│              │
│  │    // ... deterministic logic            │               │
│  │  }                                       │               │
│  └──────────────────────────────────────────┘               │
│                                                              │
│  Problem: Not real AI discussions, just vote simulations   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  DISPLAY ANALYSIS                                            │
│  - Show scores                                               │
│  - Show fake debates ← USER THINKS THESE ARE REAL           │
│  - User clicks "Rewrite with Improvements"                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  REWRITE (4s) ❌ IGNORES AGENT INSIGHTS                     │
│  ┌──────────────────────────────────────────┐               │
│  │  Gathers:                                 │               │
│  │  ✅ scoreBreakdown (agent scores)        │               │
│  │  ✅ weaknesses (from base)               │               │
│  │  ✅ sonicAnalysis                        │               │
│  │  ❌ agentDebates (NOT USED)              │               │
│  │  ❌ dnaMatch insights (NOT USED)         │               │
│  │  ❌ agent reasoning (NOT USED)           │               │
│  │                                          │               │
│  │  Creates generic execution plan          │               │
│  │  No traceability, no DNA application     │               │
│  └──────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘

**TOTAL: $0.070 | 8 seconds | Debates FAKE | DNA NOT USED**
```

---

### AFTER (Proposed System - CORRECT)

```
┌─────────────────────────────────────────────────────────────┐
│  USER CLICKS "GENERATE"                                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  GENERATION (2s) - SAME                                      │
│  ┌────────────┐                                              │
│  │ Song Text  │ → Lyrics, title, style                      │
│  │ Image      │ → Album cover                               │
│  └────────────┘                                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STREAMLINED BASE ANALYSIS (1s) ✅ FOCUSED                   │
│  ┌────────────────────────┐                                 │
│  │ gemini-2.0-flash-exp   │                                 │
│  │ - DNA match ONLY       │ ← Will be used in planner      │
│  │ - Structural advice    │ ← Will be used in planner      │
│  │ - Key observations     │ ← Context for agents           │
│  │ NO SCORING            │ ← Agents will do this          │
│  └────────────────────────┘                                 │
│  Cost: $0.001 | Time: 1s | Savings: -2s, $0.014            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ROUND 1: AGENT ANALYSIS (3s) ✅ WITH CONTEXT               │
│  ┌──────────────────────────────────────────┐               │
│  │  Promise.all([                           │               │
│  │    Lyricist(baseContext),    ─┐          │               │
│  │    Storyteller(baseContext),  │          │               │
│  │    VocalCoach(baseContext),   │ Parallel │               │
│  │    Producer(baseContext),     │ + Context│               │
│  │    Hitmaker(baseContext)     ─┘          │               │
│  │  ])                                      │               │
│  │                                          │               │
│  │  Each agent gets:                        │               │
│  │  - DNA match for reference               │               │
│  │  - Structural advice                     │               │
│  │  - 512 thinking token budget             │               │
│  └──────────────────────────────────────────┘               │
│                                                              │
│  Result: 10 category scores + detailed reasoning            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ROUND 2: FIND CONFLICTS (instant) ✅ SMART SELECTION       │
│  ┌──────────────────────────────────────────┐               │
│  │  Calculate score variances:              │               │
│  │  - Lyrical Originality: 4.8 (Lyricist)  │               │
│  │                         8.2 (Storyteller)│               │
│  │    → Variance: 3.4 ← TOP CONFLICT       │               │
│  │                                          │               │
│  │  - Commercial Potential: 7.1 (Hitmaker) │               │
│  │                          4.5 (Lyricist) │               │
│  │    → Variance: 2.6 ← 2ND CONFLICT       │               │
│  │                                          │               │
│  │  - Vocal Playability: 6.8 (VocalCoach)  │               │
│  │                       4.9 (Storyteller)  │               │
│  │    → Variance: 1.9 ← 3RD CONFLICT       │               │
│  │                                          │               │
│  │  Select expert + dissenter for each      │               │
│  └──────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ROUND 3: REAL DEBATES (4s) ✅ AUTHENTIC                     │
│  ┌──────────────────────────────────────────────────┐       │
│  │  3 DEBATES RUN IN PARALLEL (Promise.all)         │       │
│  │                                                   │       │
│  │  ┌─────────────────────────────────────────┐     │       │
│  │  │ DEBATE 1: Lyrical depth vs simplicity  │     │       │
│  │  │                                         │     │       │
│  │  │ Turn 1 (1s): Lyricist (expert)         │     │       │
│  │  │   "I scored this 4.8/10 because the    │     │       │
│  │  │    metaphors are surface-level..."      │     │       │
│  │  │                                         │     │       │
│  │  │ Turn 2 (1s): Storyteller (dissenter)   │     │       │
│  │  │   "I see that, but from narrative view,│     │       │
│  │  │    the metaphors build a cohesive..."   │     │       │
│  │  │                                         │     │       │
│  │  │ Turn 3 (1s): VocalCoach (questioner)   │     │       │
│  │  │   "How does this affect singability?   │     │       │
│  │  │    Dense metaphors might..."            │     │       │
│  │  │                                         │     │       │
│  │  │ Turn 4 (1s): Producer (synthesizer)    │     │       │
│  │  │   "Both perspectives valid. The user   │     │       │
│  │  │    wants depth AND commercial appeal..." │     │       │
│  │  │                                         │     │       │
│  │  │ Turn 5: All 5 agents vote with context │     │       │
│  │  │   Lyricist: compromise                  │     │       │
│  │  │   Storyteller: A (keep metaphors)      │     │       │
│  │  │   VocalCoach: compromise                │     │       │
│  │  │   Producer: compromise                  │     │       │
│  │  │   Hitmaker: B (simplify)               │     │       │
│  │  │                                         │     │       │
│  │  │ Consensus: "Keep metaphors in verses,  │     │       │
│  │  │  simplify chorus for singability"       │     │       │
│  │  └─────────────────────────────────────────┘     │       │
│  │                                                   │       │
│  │  [Debates 2 & 3 run simultaneously]              │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Result: 3 real debates with consensus outcomes             │
│  Cost: $0.012 | Time: 4s (parallel)                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ROUND 4: BUILD CONSENSUS (instant) ✅ SYNTHESIS            │
│  ┌──────────────────────────────────────────┐               │
│  │  Aggregate all data:                      │               │
│  │                                          │               │
│  │  consensusStrengths: [                   │               │
│  │    "Strong narrative cohesion (4/5)",    │               │
│  │    "Good emotional range (5/5)"          │               │
│  │  ]                                       │               │
│  │                                          │               │
│  │  consensusWeaknesses: [                  │               │
│  │    "Chorus too complex (4/5 agents)",    │               │
│  │    "Missing concrete objects (3/5)"      │               │
│  │  ]                                       │               │
│  │                                          │               │
│  │  tradeoffDecisions: [                    │               │
│  │    {                                     │               │
│  │      area: "Lyrical depth vs simplicity",│               │
│  │      priority: "High",                   │               │
│  │      resolution: "Compromise in chorus"  │               │
│  │    }                                     │               │
│  │  ]                                       │               │
│  └──────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  DISPLAY ANALYSIS                                            │
│  - Show agent scores with reasoning                          │
│  - Show REAL debates (can reopen)                           │
│  - User clicks "Rewrite with Improvements"                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PLANNER AGENT (6s) ✅ COMPREHENSIVE SYNTHESIS              │
│  ┌──────────────────────────────────────────────────┐       │
│  │  6TH AGENT (NEW) - The Planner                   │       │
│  │                                                   │       │
│  │  Receives ALL context:                            │       │
│  │  ✅ Base Analysis (DNA match + structural)       │       │
│  │  ✅ 5 Agent Analyses (full reasoning)            │       │
│  │  ✅ 3 Agent Debates (complete conversations)     │       │
│  │  ✅ Consensus Data (strengths/weaknesses)        │       │
│  │  ✅ Programmatic Scores                          │       │
│  │  ✅ Sonic Analysis (phonetics, density)          │       │
│  │                                                   │       │
│  │  Creates ExecutionPlan:                           │       │
│  │                                                   │       │
│  │  1. targetScore: 82 (from 74)                    │       │
│  │     Justification: "4/5 agents agree 8-point     │       │
│  │     improvement achievable with consensus fixes" │       │
│  │                                                   │       │
│  │  2. scoreImprovementsByCategory: [               │       │
│  │     {                                             │       │
│  │       category: "Lyrical Originality",           │       │
│  │       currentScore: 4.8,                         │       │
│  │       targetScore: 7.5,                          │       │
│  │       strategy: "Add 3 concrete metaphors",      │       │
│  │       dnaInsightApplied: "Use object-based       │       │
│  │         metaphors like 'Bohemian Rhapsody'",     │       │
│  │       debateInfluence: "Debate 1 consensus:      │       │
│  │         Keep depth, simplify chorus",            │       │
│  │       agentSource: "Lyricist"                    │       │
│  │     }                                             │       │
│  │     // ... all 10 categories                     │       │
│  │   ]                                               │       │
│  │                                                   │       │
│  │  3. lineLevelChanges: [                          │       │
│  │     {                                             │       │
│  │       lineNumber: 5,                             │       │
│  │       originalLine: "I'm lost in the dark",      │       │
│  │       newLine: "I'm tangled in torn bedsheets",  │       │
│  │       reason: "Add concrete object (DNA lesson)",│       │
│  │       categoryImproved: "Imagery & Sensory",     │       │
│  │       sourceAnalysis: "DNAMatch",                │       │
│  │       agentSource: "Storyteller",                │       │
│  │       expectedImpact: +1.2                       │       │
│  │     }                                             │       │
│  │     // ... 15-20 line changes                    │       │
│  │   ]                                               │       │
│  │                                                   │       │
│  │  4. agentDebateResolutions: [                    │       │
│  │     {                                             │       │
│  │       debateIssue: "Lyrical depth vs simplicity",│       │
│  │       resolution: "Metaphors in verses, simple   │       │
│  │         chorus with concrete imagery",           │       │
│  │       appliedToCategories: [                     │       │
│  │         "Lyrical Originality",                   │       │
│  │         "Commercial Potential",                  │       │
│  │         "Vocal Playability"                      │       │
│  │       ]                                           │       │
│  │     }                                             │       │
│  │   ]                                               │       │
│  │                                                   │       │
│  │  5. dnaMatchInsights: {                          │       │
│  │     structural: [                                │       │
│  │       "Apply bridge structure from 'Bohemian'",  │       │
│  │       "Use 4-line chorus like hits"              │       │
│  │     ],                                            │       │
│  │     metaphorical: [                              │       │
│  │       "Object-based metaphors (bed, window)",    │       │
│  │       "Progressive metaphor depth"               │       │
│  │     ]                                             │       │
│  │     // ... all DNA lessons mapped                │       │
│  │   }                                               │       │
│  │                                                   │       │
│  │  6. validationChecklist: {                       │       │
│  │     allWeaknessesAddressed: true,                │       │
│  │     allDebatesHonored: true,                     │       │
│  │     dnaInsightsApplied: true,                    │       │
│  │     phoneticIssuesFixed: true,                   │       │
│  │     targetScoresAchievable: true,                │       │
│  │     planTraceability: true                       │       │
│  │   }                                               │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Cost: $0.003 | Time: 6s                                    │
│  Result: Comprehensive, traceable execution plan            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  EXECUTE REWRITE (4s) ✅ PRECISE                            │
│  ┌──────────────────────────────────────────┐               │
│  │  Rewrite Agent receives:                  │               │
│  │  - Original lyrics                        │               │
│  │  - Detailed ExecutionPlan (above)         │               │
│  │                                          │               │
│  │  Applies EVERY specification:             │               │
│  │  - All 15-20 line changes                │               │
│  │  - All phonetic fixes                     │               │
│  │  - All furniture additions                │               │
│  │  - Honors debate consensus                │               │
│  │  - Uses DNA structural patterns           │               │
│  │                                          │               │
│  │  Model: gemini-2.5-flash                 │               │
│  │  Temperature: 0.75                        │               │
│  └──────────────────────────────────────────┘               │
│                                                              │
│  Cost: $0.002 | Time: 4s                                    │
└─────────────────────────────────────────────────────────────┘

**TOTAL: $0.042 | 26 seconds | Debates REAL | DNA APPLIED**
**SAVINGS: -40% cost | +18s time | +∞ authenticity**
```

---

## 📊 Component Architecture: Before & After

### BEFORE: Monolithic AnalysisView (1,043 lines) ❌

```
┌───────────────────────────────────────────────────────┐
│  AnalysisView.tsx (1,043 lines)                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │                                                 │  │
│  │  Score Display Logic (200 lines)               │  │
│  │  - Radar charts                                 │  │
│  │  - Category bars                                │  │
│  │  - Agent score comparisons                      │  │
│  │                                                 │  │
│  │  Analysis Content Logic (400 lines)             │  │
│  │  - DNA match display                            │  │
│  │  - Structural advice                            │  │
│  │  - Line-by-line improvements                    │  │
│  │  - Agent perspectives                           │  │
│  │  - Debate modal trigger                         │  │
│  │                                                 │  │
│  │  Insights Logic (300 lines)                     │  │
│  │  - 12+ insight types                            │  │
│  │  - Cost tracking integration                    │  │
│  │  - Priority sorting                             │  │
│  │                                                 │  │
│  │  Container Logic (143 lines)                    │  │
│  │  - State management                             │  │
│  │  - Props drilling                               │  │
│  │  - Conditional rendering                        │  │
│  │                                                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  PROBLEMS:                                             │
│  ❌ Too large (causes crashes after 1 minute)         │
│  ❌ Hard to test (everything coupled)                 │
│  ❌ Hard to maintain (find specific logic)            │
│  ❌ Slow re-renders (entire component updates)        │
│  ❌ No "View Debates" button (can't reopen)           │
└───────────────────────────────────────────────────────┘
```

### AFTER: Modular Components ✅

```
┌───────────────────────────────────────────────────────┐
│  AnalysisView.tsx (150 lines) ← CONTAINER ONLY        │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Orchestrates 3 child components:               │  │
│  │  - Manages debate modal state                   │  │
│  │  - Handles "View Debates" click                 │  │
│  │  - Passes props to children                     │  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ↓                ↓                ↓
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ ScoreSection   │  │ AnalysisContent│  │ InsightsSection│
│ (200 lines)    │  │ (400 lines)    │  │ (300 lines)    │
│                │  │                │  │                │
│ ┌────────────┐ │  │ ┌────────────┐ │  │ ┌────────────┐ │
│ │ 10 category│ │  │ │ DNA Match  │ │  │ │ 12+ types  │ │
│ │   scores   │ │  │ │ display    │ │  │ │  of tips   │ │
│ │            │ │  │ │            │ │  │ │            │ │
│ │ Radar chart│ │  │ │ Structural │ │  │ │ Color-coded│ │
│ │            │ │  │ │  advice    │ │  │ │            │ │
│ │ Agent score│ │  │ │            │ │  │ │ Priority   │ │
│ │ variations │ │  │ │ Category   │ │  │ │  sorting   │ │
│ │            │ │  │ │  insights  │ │  │ │            │ │
│ │ 🎭 VIEW    │ │  │ │            │ │  │ │ Cost       │ │
│ │  DEBATES   │ │  │ │ Agent      │ │  │ │ tracking   │ │
│ │   BUTTON   │ │  │ │ perspectives│ │ │            │ │
│ └────────────┘ │  │ └────────────┘ │  │ └────────────┘ │
└────────────────┘  └────────────────┘  └────────────────┘

BENEFITS:
✅ Stable (no crashes)
✅ Testable (isolated concerns)
✅ Maintainable (clear boundaries)
✅ Fast re-renders (only changed component updates)
✅ Can reopen debates (button in ScoreSection)
```

---

## 🔄 Data Flow: Before & After

### BEFORE: Data Silos ❌

```
Base Analysis ──────────────┐
                            ↓
5 Agent Analyses ───────────┼─→ Merge scores → Display
(never communicate)         ↓
                            
Fake Debates ───────────────┘
(deterministic votes)       

                            
Rewrite Request → Use only:
                  - Scores (agent)
                  - Weaknesses (base)
                  - Sonic (base)
                  ❌ NOT USED:
                     - Agent reasoning
                     - Debates
                     - DNA insights
```

### AFTER: Unified Data Flow ✅

```
Base Analysis (DNA match + structure)
    ↓
    ├──→ Context for 5 agents
    │
5 Agents (with context)
    ↓
    ├──→ Individual analyses
    ├──→ Score all 10 categories
    │
Conflict Detection
    ↓
    ├──→ Identify top 3 disagreements
    │
3 Real Debates (parallel)
    ↓
    ├──→ 4-turn conversations
    ├──→ All agents vote with context
    │
Consensus Building
    ↓
    ├──→ consensusStrengths
    ├──→ consensusWeaknesses
    ├──→ tradeoffDecisions
    │
                            ┌──────────────────┐
                            │  PLANNER AGENT   │
                            │                  │
Base Analysis ──────────────┤  Synthesizes ALL │
5 Agent Analyses ───────────┤  data sources    │
3 Debates ───────────────────┤                  │
Consensus Data ──────────────┤  Creates         │
Sonic Analysis ──────────────┤  comprehensive   │
Programmatic Scores ─────────┤  ExecutionPlan   │
                            │                  │
                            │  With:           │
                            │  - Traceability  │
                            │  - DNA insights  │
                            │  - Debate outcomes│
                            └──────────────────┘
                                    ↓
                            ExecutionPlan
                            (every change has source)
                                    ↓
                            Rewrite Agent
                            (executes plan precisely)
```

---

## 💰 Cost Breakdown: Before & After

### BEFORE

```
┌─────────────────────────────────────────────┐
│  Generation Phase                           │
├─────────────────────────────────────────────┤
│  Song text (flash)           $0.001         │
│  Image (imagen-3.0)          $0.020         │
├─────────────────────────────────────────────┤
│  Analysis Phase                             │
├─────────────────────────────────────────────┤
│  Base (3-pro, 2048 think)    $0.015  ← EXPENSIVE
│  Lyricist (flash-exp)        $0.001         │
│  Storyteller (3-pro)         $0.015  ← EXPENSIVE
│  Vocal Coach (flash-exp)     $0.001         │
│  Producer (flash-exp)        $0.001         │
│  Hitmaker (flash-exp)        $0.001         │
│  Fake debates                $0.000  ← FREE but FAKE
├─────────────────────────────────────────────┤
│  TOTAL                       $0.055         │
└─────────────────────────────────────────────┘
```

### AFTER

```
┌─────────────────────────────────────────────┐
│  Generation Phase                           │
├─────────────────────────────────────────────┤
│  Song text (flash)           $0.001         │
│  Image (imagen-3.0)          $0.020         │
├─────────────────────────────────────────────┤
│  Analysis Phase                             │
├─────────────────────────────────────────────┤
│  Base (flash, no think)      $0.001  ← CHEAPER
│  Lyricist (flash, 512 think) $0.001         │
│  Storyteller (flash, 512)    $0.001  ← MUCH CHEAPER
│  Vocal Coach (flash, 512)    $0.001         │
│  Producer (flash, 512)       $0.001         │
│  Hitmaker (flash, 512)       $0.001         │
│  3 Debates × 4 turns (flash) $0.012  ← REAL & CHEAP
├─────────────────────────────────────────────┤
│  Rewrite Phase                              │
├─────────────────────────────────────────────┤
│  Planner agent (flash, 2048) $0.003         │
│  Execute rewrite (flash-2.5) $0.002         │
├─────────────────────────────────────────────┤
│  TOTAL                       $0.044         │
│                                             │
│  SAVINGS: -$0.011 (-20%)                    │
│  BUT: Real debates + DNA applied            │
└─────────────────────────────────────────────┘
```

---

## ⏱️ Performance: Before & After

### BEFORE

```
Timeline:
0s ─────────────────────────────────────────────────────→ 8s
│
├─ Generation (2s)
│  └─ Song text + image
│
├─ Base Analysis (3s) ← REDUNDANT SCORING
│  └─ 3-pro with thinking
│
├─ 5 Agents (3s) ← PARALLEL
│  └─ Re-score categories
│
└─ Fake Debates (instant) ← SIMULATED
   └─ Deterministic votes

USER SEES: Analysis complete at 8s
DEBATES: Fake (instant calculation)
QUALITY: ❌ Generic plans, no DNA application
```

### AFTER

```
Timeline:
0s ─────────────────────────────────────────────────────→ 26s
│
├─ Generation (2s)
│  └─ Song text + image
│
├─ Base Analysis (1s) ← FASTER (no scoring)
│  └─ Flash, DNA only
│
├─ 5 Agents (3s) ← PARALLEL + THINKING
│  └─ Score with 512 thinking budget
│
├─ Find Conflicts (instant)
│  └─ Calculate variances
│
├─ 3 Real Debates (4s) ← PARALLEL
│  └─ 4 turns × 3 debates
│
└─ User views analysis ← Can reopen debates

USER CLICKS "REWRITE":

├─ Planner Agent (6s) ← COMPREHENSIVE
│  └─ Synthesize all data
│
├─ Execute Rewrite (4s)
│  └─ Apply execution plan
│
└─ Re-analyze (8s)
   └─ Validate improvements

USER SEES: Analysis at 10s, Full rewrite at 26s
DEBATES: Real (AI conversations)
QUALITY: ✅ Comprehensive plans, DNA applied, traceable
```

---

## 🎯 Key Metrics Comparison

```
┌─────────────────────────┬──────────┬──────────┬──────────┐
│ Metric                  │  Before  │  After   │  Change  │
├─────────────────────────┼──────────┼──────────┼──────────┤
│ Cost per generation     │ $0.055   │ $0.044   │   -20%   │
│ Time to analysis        │    8s    │   10s    │   +25%   │
│ Time to full rewrite    │   12s    │   26s    │  +117%   │
│ Debate authenticity     │   0%     │  100%    │   +∞     │
│ DNA insights applied    │   0%     │  100%    │   +∞     │
│ Plan traceability       │  10%     │  100%    │  +900%   │
│ Agent collaboration     │  None    │   Full   │   +∞     │
│ App stability (2+ min)  │  Crash   │  Stable  │   ✅     │
│ Can reopen debates      │   No     │   Yes    │   ✅     │
└─────────────────────────┴──────────┴──────────┴──────────┘

USER VERDICT: "The tradeoff for real debate is worth it"
             ✅ APPROVED
```

---

**End of Visual Roadmap**

*Use this document to quickly understand the transformation at a high level.*
