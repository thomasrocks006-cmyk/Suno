f# Board Directive v5.0 - FINAL ARCHITECTURE

**Date:** November 25, 2025, 2:30 PM  
**Status:** 🟢 BOARD APPROVED - SOURCE OF TRUTH  
**Supersedes:** All previous architecture documents

---

## Executive Summary

The complete agent system architecture with correct role separation:

| Agent | Model | Role | Produces Scores? |
|-------|-------|------|------------------|
| 1-5 Specialists | Various Pro | DEBATE (ideas, challenges, proposals) | ❌ NO |
| 6. Judge | Gemini 3.0 Pro | DECIDES (mandates from debate) | ❌ NO |
| 7. Analyst | Gemini 3.0 Pro | GRADES (10 categories, PhD rigor) | ✅ YES |
| 8. Planner | Gemini 3.0 Pro | PLANS (execution, rewrite draft) | ❌ NO |

**Key Insight:** The 5 agents DO NOT SCORE. They DEBATE. The Analyst scores INDEPENDENTLY.

---

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: GENERATION (2s)                                    │
│  → Song lyrics, title, style, cover                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: STRUCTURAL SCAN (1s)                                │
│  Model: Gemini 2.0 Flash                                     │
│                                                              │
│  Outputs:                                                    │
│  → DNA Match (find reference song)                           │
│  → Structure Map (V-C-V-C-B-C)                               │
│  → Syllable counts (programmatic)                            │
│  → Rhyme scheme detection                                    │
│                                                              │
│  ❌ NO SCORING - Analyst will do this later                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: THE COUNCIL DEBATES (10-15s)                       │
│                                                              │
│  5 Experts engage in REAL CONVERSATION:                      │
│                                                              │
│  ❌ They DO NOT produce scores                               │
│  ✅ They DISCUSS the song                                    │
│  ✅ They CHALLENGE each other's ideas                        │
│  ✅ They QUESTION assumptions                                │
│  ✅ They PROPOSE improvements                                │
│  ✅ They BOUNCE ideas off each other                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Lyricist: "The chorus uses 'heart on fire' which is    │ │
│  │ extremely clichéd. I'd push for something more         │ │
│  │ original like 'chest of embers'..."                    │ │
│  │                                                         │ │
│  │ Hitmaker: "I disagree. 'Heart on fire' has proven      │ │
│  │ commercial resonance. The DNA match 'Heat Waves'       │ │
│  │ uses similar phrasing. Changing it risks the hook."    │ │
│  │                                                         │ │
│  │ Storyteller: "What if we keep the phrase but add       │ │
│  │ concrete imagery around it? 'Heart on fire in a        │ │
│  │ house of ice' - now it's a metaphor system..."         │ │
│  │                                                         │ │
│  │ Producer: "That's 9 syllables. The original is 4.      │ │
│  │ We'd need to restructure the entire chorus meter."     │ │
│  │                                                         │ │
│  │ Vocal Coach: "The 'f' in 'fire' into 'in' creates      │ │
│  │ a nice flow. But 'house of ice' ends on a hard 's'     │ │
│  │ which is difficult to sustain..."                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  The debate is VIEWABLE to the user in real-time            │
│                                                              │
│  Output: Full debate transcript                              │
│  (ideas, challenges, proposals, counter-arguments)          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: THE JUDGE (Gemini 3.0 Pro - 3s)                    │
│  "The Smartest in the Room"                                  │
│                                                              │
│  Listens to the FULL debate and DECIDES:                     │
│                                                              │
│  ✅ Which ideas have merit                                   │
│  ✅ Which challenges are valid                               │
│  ✅ What the consensus should be                             │
│  ✅ Creates clear MANDATES for action                        │
│  ✅ Cites which expert's argument won and WHY                │
│                                                              │
│  ❌ Does NOT score the song                                  │
│                                                              │
│  Output: JudgeSummary                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ {                                                       │ │
│  │   decisions: [                                          │ │
│  │     {                                                   │ │
│  │       topic: "Chorus cliché debate",                   │ │
│  │       ruling: "Keep 'heart on fire' but add context", │ │
│  │       winner: "Storyteller's compromise",              │ │
│  │       rationale: "Commercial viability + depth",       │ │
│  │       citedArguments: [                                 │ │
│  │         "Hitmaker's DNA evidence (Heat Waves)",        │ │
│  │         "Storyteller's metaphor system idea"           │ │
│  │       ],                                                │ │
│  │       mandates: [                                       │ │
│  │         "Add concrete imagery around cliché",          │ │
│  │         "Maintain 4-syllable phrase length"            │ │
│  │       ]                                                 │ │
│  │     },                                                  │ │
│  │     // ... more decisions                               │ │
│  │   ],                                                    │ │
│  │   overriddenArguments: [                                │ │
│  │     {                                                   │ │
│  │       agent: "Lyricist",                               │ │
│  │       claim: "'chest of embers' is better",           │ │
│  │       overrideReason: "Too obscure for hook"          │ │
│  │     }                                                   │ │
│  │   ],                                                    │ │
│  │   unresolvedIssues: [...]                              │ │
│  │ }                                                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: THE ANALYST (Gemini 3.0 Pro - 4-5s)                │
│  "The PhD Musicologist"                                      │
│                                                              │
│  A SEPARATE, INDEPENDENT expert who brings fresh eyes:       │
│                                                              │
│  ❌ Did NOT participate in the debate                        │
│  ❌ Has NO bias from the discussion                          │
│  ✅ Brings INDEPENDENT scholarly judgment                    │
│                                                              │
│  The Analyst RECEIVES:                                       │
│  1. The actual LYRICS (reads them fresh)                     │
│  2. The DNA match (from Structural Scan)                     │
│  3. The Judge's summary (debate outcomes)                    │
│                                                              │
│  The Analyst PRODUCES:                                       │
│                                                              │
│  ✅ 10-CATEGORY SCORING (with scholarly rigor)              │
│     │                                                        │
│     ├─ Lyrical Originality (1-10)                           │
│     ├─ Narrative Arc (1-10)                                  │
│     ├─ Imagery & Sensory Detail (1-10)                       │
│     ├─ Thematic Cohesion (1-10)                              │
│     ├─ Emotional Impact (1-10)                               │
│     ├─ Vocal Playability (1-10)                              │
│     ├─ Melodic & Phonetic Flow (1-10)                        │
│     ├─ Sonic Density (1-10)                                  │
│     ├─ Structure & Pacing (1-10)                             │
│     └─ Commercial Potential (1-10)                           │
│                                                              │
│  ✅ STORY ARC ANALYSIS                                       │
│     │                                                        │
│     ├─ Narrative structure breakdown                         │
│     ├─ Emotional journey mapping                             │
│     ├─ Tension/release points                                │
│     └─ Character/voice consistency                           │
│                                                              │
│  ✅ IMAGERY AUDIT                                            │
│     │                                                        │
│     ├─ Concrete objects identified                           │
│     ├─ Sensory details catalogued                            │
│     ├─ Abstract vs concrete ratio                            │
│     └─ "Cinema score" (visual evocativeness)                 │
│                                                              │
│  ✅ LINE-BY-LINE IMPROVEMENTS                                │
│     │                                                        │
│     ├─ Specific suggestions per line                         │
│     ├─ Rationale for each change                             │
│     └─ Priority ranking                                      │
│                                                              │
│  ✅ DNA MATCH INSIGHTS                                       │
│     │                                                        │
│     ├─ Structural lessons from reference                     │
│     ├─ Thematic parallels                                    │
│     └─ What to adopt/avoid                                   │
│                                                              │
│  ✅ PHONETIC ANALYSIS                                        │
│     │                                                        │
│     ├─ Consonant cluster issues                              │
│     ├─ Vowel flow assessment                                 │
│     ├─ Breath point recommendations                          │
│     └─ Singability score                                     │
│                                                              │
│  Output: DeepAnalysisReport                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ {                                                       │ │
│  │   scoreBreakdown: [                                     │ │
│  │     { category: "Lyrical Originality",                 │ │
│  │       score: 6.2,                                       │ │
│  │       reasoning: "Uses 3 common clichés but has        │ │
│  │         2 genuinely original metaphors..." }           │ │
│  │     // ... 10 categories                                │ │
│  │   ],                                                    │ │
│  │   overallScore: 68.5,                                   │ │
│  │   storyArcAnalysis: {...},                              │ │
│  │   imageryAudit: {...},                                  │ │
│  │   lineByLineImprovements: [...],                        │ │
│  │   dnaMatchInsights: {...},                              │ │
│  │   phoneticAnalysis: {...}                               │ │
│  │ }                                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ⭐ THIS populates the Deep Analysis page for the user      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  [USER VIEWS DEEP ANALYSIS PAGE]                             │
│                                                              │
│  User sees:                                                  │
│  - 10 category scores with reasoning                         │
│  - Story arc breakdown                                       │
│  - Imagery audit                                             │
│  - Line-by-line suggestions                                  │
│  - DNA insights                                              │
│  - Debate summary (can expand to full transcript)            │
│                                                              │
│  User can explore, then clicks "Create Rewrite Plan"         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 6: THE PLANNER (Gemini 3.0 Pro - 3-4s)                │
│  "The Final and Smartest Agent"                              │
│  Floats in DeepAnalysis page AND Lyrics page                 │
│                                                              │
│  The Planner RECEIVES:                                       │
│  1. Analyst's DeepAnalysisReport (scores, insights)         │
│  2. Judge's Summary (debate mandates)                        │
│  3. The actual lyrics                                        │
│  4. DNA match insights                                       │
│  5. User preferences                                         │
│                                                              │
│  The Planner CRITICALLY EVALUATES everything:                │
│                                                              │
│  ✅ Cross-references Analyst's scores with Judge's mandates │
│  ✅ Identifies conflicts (if any)                            │
│  ✅ Prioritizes changes based on impact                      │
│  ✅ Maps rhyme dependencies (which lines must move together)│
│  ✅ Creates specific, actionable execution plan              │
│                                                              │
│  Output: DraftExecutionPlan                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ {                                                       │ │
│  │   targetScore: 82 (from 68.5),                         │ │
│  │   justification: "Based on Analyst's scores and        │ │
│  │     Judge's mandates, +13.5 points achievable...",     │ │
│  │                                                         │ │
│  │   prioritizedChanges: [                                 │ │
│  │     {                                                   │ │
│  │       priority: 1,                                      │ │
│  │       change: "Add concrete imagery to chorus",        │ │
│  │       source: "Judge mandate + Analyst imagery audit", │ │
│  │       affectedLines: [12, 13, 14],                     │ │
│  │       dependencyGroup: [12, 14], // Rhyme linked       │ │
│  │       expectedImpact: "+1.5 to Imagery score"          │ │
│  │     },                                                  │ │
│  │     // ... more changes                                 │ │
│  │   ],                                                    │ │
│  │                                                         │ │
│  │   lineLevelChanges: [                                   │ │
│  │     {                                                   │ │
│  │       lineNumber: 12,                                   │ │
│  │       original: "My heart is on fire",                 │ │
│  │       proposed: "My heart's on fire in frozen halls", │ │
│  │       rationale: "Adds 'frozen halls' per mandate",    │ │
│  │       sourceAnalysis: "JudgeMandate + AnalystLine12", │ │
│  │       rhymeConstraint: "Must rhyme with line 14"       │ │
│  │     }                                                   │ │
│  │   ],                                                    │ │
│  │                                                         │ │
│  │   fewShotExamples: [                                    │ │
│  │     {                                                   │ │
│  │       before: "I'm lost in the dark",                  │ │
│  │       after: "I'm tangled in torn bedsheets",          │ │
│  │       style: "Abstract → Concrete object"              │ │
│  │     }                                                   │ │
│  │   ]                                                     │ │
│  │ }                                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ⚠️ DOES NOT AUTO-EXECUTE                                   │
│  The plan is a DRAFT for user review                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 7: THE WAR ROOM (User Approval)                        │
│                                                              │
│  User sees DraftExecutionPlan with:                          │
│  - Each proposed change                                      │
│  - Source of each change (Judge mandate? Analyst score?)    │
│  - Expected impact on scores                                 │
│  - Rhyme dependency warnings                                 │
│                                                              │
│  User can:                                                   │
│  ✅ Approve all                                              │
│  ✏️ Veto specific changes                                   │
│  📝 Add manual instructions                                  │
│  🔄 Ask Planner to reconsider specific items                │
│                                                              │
│  ONLY after user clicks "Execute" → Proceed to rewrite      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 8: TWO-PASS REWRITE (4s)                               │
│                                                              │
│  Pass 1 - The Mason (Lyrics & Rhymes):                       │
│  - Apply approved lineLevelChanges                           │
│  - Honor rhyme dependencyGroups                             │
│  - Maintain syllable counts (±2)                            │
│  - Use few-shot examples for style guidance                 │
│                                                              │
│  Pass 2 - The Decorator (Furniture):                         │
│  - Add [Breath] marks                                        │
│  - Add (Ad-libs)                                             │
│  - Add [Visual Cues]                                         │
│  - DO NOT change words from Pass 1                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 9: THE AUDITOR (1s)                                    │
│  Programmatic validation:                                    │
│                                                              │
│  - Did rhyme scheme break?                                   │
│  - Did syllable count drift >20%?                            │
│  - Were all approved changes applied?                        │
│                                                              │
│  If issues: Add warning badges to UI                         │
│  "⚠️ Rhyme scheme may be broken in Verse 2"                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 10: RE-ANALYSIS (Optional)                             │
│                                                              │
│  User can run Analyst again on the rewritten song            │
│  to verify score improvements                                │
└─────────────────────────────────────────────────────────────┘
```

---

## The 8 Agents - Complete Roster

### The Council (5 Debate Participants)

| Agent | Model | Expertise | Role in Debate |
|-------|-------|-----------|----------------|
| **Lyricist** | Gemini 2.5 Pro | Originality, wordplay, clichés | Pushes for creative language |
| **Storyteller** | Gemini 2.5 Pro | Narrative, emotion, imagery | Defends story coherence |
| **Hitmaker** | Gemini 2.5 Pro | Commercial appeal, hooks | Cites DNA evidence for viability |
| **Producer** | Gemini 3.0 Pro | Structure, pacing, arrangement | Guards technical structure |
| **Vocal Coach** | Gemini 2.0 Flash | Phonetics, singability | Provides objective constraints |

**What they DO:** Discuss, challenge, propose, question, bounce ideas
**What they DON'T do:** Score the song

---

### The Arbiters (3 Decision Makers)

| Agent | Model | Role | What They Produce |
|-------|-------|------|-------------------|
| **Judge** | Gemini 3.0 Pro | Debate arbiter | Mandates, decisions, citations |
| **Analyst** | Gemini 3.0 Pro | Independent grader | 10-category scores, deep analysis |
| **Planner** | Gemini 3.0 Pro | Execution strategist | DraftExecutionPlan |

---

## Why The Analyst Is Separate

### The PhD Musicologist Persona

The Analyst is deliberately SEPARATE from the debate because:

1. **No Debate Bias:** The Analyst didn't hear the arguments, so they can't be swayed by persuasive rhetoric. They judge the ACTUAL LYRICS, not the ideas about them.

2. **Scholarly Rigor:** The Analyst brings academic objectivity:
   - "This line has a 6.2 originality score because statistically, 'heart on fire' appears in 40% of pop songs from 2020-2024."
   - Not: "The Hitmaker convinced me it's fine."

3. **Fresh Eyes:** Reading the lyrics without preconceptions from the debate allows genuine assessment.

4. **Validation Function:** The Analyst's scores can VALIDATE or CHALLENGE the Judge's decisions:
   - Judge ruled to keep the cliché
   - Analyst scores Originality at 4.5
   - Planner must reconcile this tension

---

## Why The Planner Comes Last

The Planner is the "Final and Smartest Agent" because they:

1. **See Everything:**
   - Judge's debate mandates (what the experts agreed on)
   - Analyst's objective scores (what the song actually deserves)
   - The actual lyrics (can verify claims)
   - DNA match (structural lessons)

2. **Reconcile Conflicts:**
   - If Judge says "keep cliché" but Analyst scores Originality at 4.5, Planner must decide: follow the mandate or push for originality?
   - Planner weighs user preferences to break ties

3. **Create Actionable Plan:**
   - Specific line changes
   - Rhyme dependencies mapped
   - Priority ordering
   - Expected impact quantified

4. **Float in UI:**
   - Available in DeepAnalysis page
   - Also available in Lyrics page
   - User can interact with Planner to refine plan

---

## Timing Summary

| Step | Duration | Cumulative |
|------|----------|------------|
| Generation | 2s | 2s |
| Structural Scan | 1s | 3s |
| Council Debates | 10-15s | 13-18s |
| Judge | 3s | 16-21s |
| Analyst | 4-5s | 20-26s |
| **User sees Deep Analysis** | — | **~22s** |
| Planner (on demand) | 3-4s | 25-30s |
| User Review | — | — |
| Two-Pass Rewrite | 4s | 29-34s |
| Auditor | 1s | 30-35s |

**To see analysis:** ~22 seconds
**To complete full rewrite:** ~32 seconds (plus user review time)

---

## Key Architectural Principles

### 1. Separation of Concerns
- **Debaters** → Ideas
- **Judge** → Decisions
- **Analyst** → Scores
- **Planner** → Strategy

### 2. Independence of Scoring
The Analyst NEVER participates in debates. Their scoring is objective and unbiased.

### 3. User Control
- User sees debate (real-time)
- User sees analysis (after Analyst)
- User approves plan (War Room)
- User triggers rewrite (explicit action)

### 4. Traceability
Every change in the plan traces back to:
- A Judge mandate, OR
- An Analyst score/recommendation, OR
- A DNA insight, OR
- A user instruction

### 5. No Auto-Execution
The Planner creates a DRAFT. The user APPROVES. Only then does rewrite happen.

---

## Implementation Checklist

### Phase 1: Kill Base Scoring ✅ COMPLETE
- [x] Remove `analyzeSong()` 6-category scoring
- [x] Create `structuralScan()` (DNA, syllables, structure only)
- **Implemented:** `services/structuralScanService.ts`

### Phase 2: Build Debate System ✅ COMPLETE
- [x] Modify 5 agents to DISCUSS, not SCORE
- [x] Implement real sequential conversation
- [x] Create debate transcript format
- [x] Build real-time UI for viewing debates
- **Implemented:** `services/realDebateEngine.ts`

### Phase 3: Build Judge ✅ COMPLETE
- [x] Create `judgeAgent.ts`
- [x] Input: Full debate transcript
- [x] Output: JudgeSummary with mandates and citations
- **Implemented:** `services/judgeAgent.ts`

### Phase 4: Build Analyst ✅ COMPLETE
- [x] Create `analystAgent.ts` (The PhD Musicologist)
- [x] Input: Lyrics + DNA match + Judge summary
- [x] Output: DeepAnalysisReport (10 scores + all breakdowns)
- [x] This powers the Deep Analysis page
- **Implemented:** `services/analystAgent.ts`

### Phase 5: Build Planner ✅ COMPLETE
- [x] Create `plannerAgent.ts`
- [x] Input: AnalysisReport + JudgeSummary + Lyrics + DNA
- [x] Output: DraftExecutionPlan
- [x] Floats in DeepAnalysis + Lyrics pages
- **Implemented:** `services/plannerAgent.ts`

### Phase 6: War Room UI ✅ COMPLETE
- [x] Display DraftExecutionPlan
- [x] Per-change approval toggles
- [x] Manual instruction input
- [x] "Execute" button
- **Implemented:** `components/WarRoom.tsx`

### Phase 7: Two-Pass Rewrite ✅ COMPLETE
- [x] Pass 1: Lyrics/Rhymes
- [x] Pass 2: Furniture
- [x] Use few-shot examples
- **Implemented:** `services/twoPassRewrite.ts`

### Phase 8: Auditor ✅ COMPLETE
- [x] Programmatic rhyme validation
- [x] Syllable drift check
- [x] Warning badges
- **Implemented:** `services/auditorService.ts`

### UI Integration ✅ COMPLETE
- [x] App.tsx uses v5AnalysisPipeline
- [x] AgentDebateModal shows live v5 debates
- [x] AnalysisView displays DeepAnalysisReport
- [x] WarRoom integrated with handlers

---

**🎉 ALL 8 PHASES IMPLEMENTED - November 25, 2025**

**Files Created:**
1. `services/structuralScanService.ts`
2. `services/realDebateEngine.ts`
3. `services/judgeAgent.ts`
4. `services/analystAgent.ts`
5. `services/plannerAgent.ts`
6. `components/WarRoom.tsx`
7. `services/twoPassRewrite.ts`
8. `services/auditorService.ts`
9. `services/v5AnalysisPipeline.ts` (orchestrator)

---

**END OF BOARD DIRECTIVE v5.0**
