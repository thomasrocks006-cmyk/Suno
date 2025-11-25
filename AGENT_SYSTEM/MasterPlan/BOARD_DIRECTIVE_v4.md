# Board-Approved Architecture v4.0

**Date:** November 25, 2025, 12:45 PM  
**Status:** 🟢 BOARD DIRECTIVE - SUPERSEDES ALL PREVIOUS PROPOSALS  
**CEO Acknowledgment:** Previous gap analysis contained errors regarding base analysis. This is the corrected vision.

---

## 🎯 Executive Summary

The Board has clarified the correct architectural vision:

1. **Base Analysis IS redundant** - Remove scoring from base analysis (agents do the real scoring)
2. **5 Expert Agents** engage in REAL conversation (back-and-forth, viewable to user)
3. **6th Agent = The Judge** (Gemini 3.0 Pro) - Smartest in the room, decides what to use
4. **Planner Agent** = Floats in Deep Analysis & Lyrics pages - Creates rewrite plan but DOES NOT AUTO-EXECUTE
5. **User must approve** the rewrite plan before execution

---

## 🏛️ The New Agent Hierarchy

### The 5 Expert Agents (The Council)
These agents engage in **real conversation** - challenging, questioning, suggesting - viewable to user as it happens.

| Agent | Model | Domain | Role in Debate |
|-------|-------|--------|----------------|
| **Lyricist** | Gemini 2.5 Pro | Originality, Wordplay | Creative word judgment |
| **Storyteller** | Gemini 2.5 Pro | Narrative, Imagery, Emotion | Story structure |
| **Vocal Coach** | Gemini 2.0 Flash | Phonetics, Singability | Technical performance |
| **Producer** | **Gemini 3.0 Pro** ⬆️ | Structure, Pacing, Sonic | Technical + artistic (UPGRADED) |
| **Hitmaker** | Gemini 2.5 Pro | Commercial, Hooks | Market awareness |

**Debate Format:**
- Real back-and-forth chain of thought
- Each agent challenges others in their expert field
- Viewable to user in real-time (streaming)
- Not isolated silos - they SEE each other's responses

---

### The Judge (6th Agent) - Gemini 3.0 Pro
**Role:** The smartest in the room. Listens to ALL debate, makes final decisions.

**Responsibilities:**
- Observes the full 5-agent debate
- Evaluates arguments based on logic + parameters set
- Decides WHAT to take and WHAT to discard
- Produces final consensus with clear rationale
- **Model:** Gemini 3.0 Pro (flagship - highest capability)

**Output:**
```typescript
interface JudgeDecision {
  debatesConsidered: string[];
  decisionsReached: {
    topic: string;
    winner: string; // Which agent's argument won
    rationale: string; // Why this decision
    action: string; // What to do
  }[];
  overriddenArguments: {
    agent: string;
    claim: string;
    overrideReason: string;
  }[];
  finalRecommendations: string[];
}
```

---

### The Planner Agent - Floating in Deep Analysis + Lyrics
**Role:** Final judge AFTER song is created. Creates the rewrite plan.

**Location:** Floats in:
- Deep Analysis page
- Lyrics page (can navigate between)

**Responsibilities:**
1. Takes ALL input from 5 expert agents
2. Incorporates DNA match analysis
3. Incorporates Judge's decisions
4. Dissects everything, adds own analysis
5. Creates comprehensive rewrite plan
6. **DOES NOT AUTO-EXECUTE** - User must approve

**Critical:** The Planner synthesizes but the USER is the final decision maker.

---

## 📊 Corrected Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: GENERATION (2s)                                    │
│  → Song lyrics, title, style, cover                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: STRUCTURAL SCAN (1s) - NO SCORING                  │
│  → DNA Match (structural lessons)                           │
│  → Structure Map (V-C-V-C-B-C)                              │
│  → Syllable counts (programmatic)                           │
│  → Rhyme scheme detection                                   │
│  ❌ NO CATEGORY SCORES (agents will do this)               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: AGENT COUNCIL DEBATE (10-15s) - REAL CONVERSATION │
│                                                              │
│  5 Agents engage in REAL back-and-forth:                    │
│  ┌────────────────────────────────────────┐                 │
│  │ Lyricist: "The chorus lacks originality │                │
│  │   because 'heart on fire' is cliché..." │                │
│  │                                         │                │
│  │ Hitmaker: "But that phrase is proven to │                │
│  │   resonate with mass audiences. The DNA │                │
│  │   match shows 'Heat Waves' used similar"│                │
│  │                                         │                │
│  │ Storyteller: "I agree with Hitmaker -   │                │
│  │   the cliché works IF we add concrete   │                │
│  │   objects around it..."                 │                │
│  │                                         │                │
│  │ Producer: "Structurally, we need that   │                │
│  │   anchor phrase for the hook. But the   │                │
│  │   verses could be more original..."     │                │
│  │                                         │                │
│  │ Vocal Coach: "From a singability view,  │                │
│  │   'heart on fire' has good vowel flow..." │               │
│  └────────────────────────────────────────┘                 │
│                                                              │
│  USER SEES THIS HAPPENING IN REAL-TIME (STREAMING)          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: THE JUDGE (Gemini 3.0 Pro) - 3s                    │
│                                                              │
│  → Listens to entire debate                                  │
│  → Applies logic + user parameters                           │
│  → Makes binding decisions on each conflict                  │
│  → Outputs structured decision document                      │
│                                                              │
│  "Based on the debate, I rule:                               │
│   1. Keep 'heart on fire' (Hitmaker wins)                   │
│   2. BUT add concrete imagery around it (Storyteller)       │
│   3. Verses should have more original language (Lyricist)"  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: DISPLAY RESULTS                                     │
│                                                              │
│  → Show agent debate (user can re-read)                      │
│  → Show Judge's decisions with rationale                     │
│  → Show category scores (from agent consensus)               │
│  → User can explore Deep Analysis page                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 6: PLANNER AGENT (Floats in Deep Analysis + Lyrics)   │
│                                                              │
│  The Planner:                                                │
│  → Takes ALL 5 agent analyses                                │
│  → Takes Judge's decisions                                   │
│  → Takes DNA match insights                                  │
│  → Dissects and adds own analysis                            │
│  → Creates comprehensive REWRITE PLAN                        │
│                                                              │
│  ⚠️ DOES NOT AUTO-EXECUTE                                   │
│                                                              │
│  Outputs: RewritePlan with:                                  │
│  - Line-by-line proposed changes                             │
│  - Source of each change (which agent, which debate)         │
│  - Expected score improvements                               │
│  - Rhyme dependency groups                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 7: USER REVIEW (The War Room)                          │
│                                                              │
│  User sees Draft Plan and can:                               │
│  ✅ Approve entire plan                                      │
│  ✏️ Veto specific changes                                   │
│  📝 Add manual instructions                                  │
│  🔄 Ask Planner to reconsider specific items                │
│                                                              │
│  ONLY AFTER USER APPROVAL → Execute rewrite                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 8: EXECUTE REWRITE (Two-Pass)                          │
│                                                              │
│  Pass 1: Structural changes (lyrics, rhymes)                 │
│  Pass 2: Furniture overlay (ad-libs, breath marks)           │
│                                                              │
│  → Only runs after user explicitly approves                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Key Corrections from Previous Analysis

### ❌ My Error: "Don't kill base analysis"
**Correction:** The Board is RIGHT. Base analysis scoring IS redundant:
- Base analysis currently scores 6 categories
- Then agents RE-SCORE the same categories
- This is wasteful and confusing

**New Approach:**
- Base analysis becomes **Structural Scan** (no scoring)
- Outputs: DNA match, structure map, syllable counts
- ALL SCORING done by the 5 agents during debate

### ❌ My Error: Misunderstood debate → analysis relationship
**Correction:** Deep analysis should be based on DEBATE OUTPUTS, not base analysis:
- Current: Base analysis → agents → fake debate → display
- New: Structural scan → REAL debate → Judge decision → display

### ✅ Correct: Model upgrades
**Producer:** Upgraded to Gemini 3.0 Pro (structure/pacing is artistic, not just technical)
**Judge:** Gemini 3.0 Pro (smartest in the room)
**Planner:** Gemini 3.0 Pro (final synthesis requires highest capability)

---

## 📐 Updated Model Hierarchy

| Agent | Model | Reasoning |
|-------|-------|-----------|
| **Judge** | Gemini 3.0 Pro | Must be smartest - evaluates all arguments |
| **Planner** | Gemini 3.0 Pro | Final synthesis of everything |
| **Producer** | Gemini 3.0 Pro | Structure/pacing is artistic judgment |
| **Lyricist** | Gemini 2.5 Pro | Originality requires deep reasoning |
| **Storyteller** | Gemini 2.5 Pro | Narrative is abstract |
| **Hitmaker** | Gemini 2.5 Pro | Commercial judgment is subjective |
| **Vocal Coach** | Gemini 2.0 Flash | Phonetics is measurable |

**Cost Impact:** 
- More Pro-tier calls = ~$0.005 more per analysis
- **Value:** Dramatically better debate quality and decisions

---

## 🎬 Debate Viewing Experience

The user should see the debate happening in REAL-TIME:

```
┌─────────────────────────────────────────────────────────────┐
│  🎭 AGENT COUNCIL DEBATE                           [LIVE]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🎨 LYRICIST (12:45:23)                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ I'm concerned about the chorus. "Heart on fire" is     │ │
│  │ a cliché we see in 40% of pop songs. The Originality   │ │
│  │ score suffers because of predictable phrasing.         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  💰 HITMAKER (12:45:26)                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ That's exactly WHY it works commercially. The DNA      │ │
│  │ match to "Heat Waves" shows proven audience response   │ │
│  │ to that exact phrase family. Removing it risks the     │ │
│  │ hook's memorability.                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  📖 STORYTELLER (12:45:29)                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Both valid. The compromise: keep the anchor phrase     │ │
│  │ but surround it with concrete imagery. "Heart on fire" │ │
│  │ in a world of "crumbled letters" and "rusted keys"...  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  🎛️ PRODUCER (12:45:32)                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Structurally, we need that repetition for the hook.    │ │
│  │ The verses can carry more original language. This      │ │
│  │ balances commercial viability with artistic depth.     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [Typing...]                                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 The Planner Agent's Floating Behavior

**Locations:**
1. **Deep Analysis Page** - Primary home, full context
2. **Lyrics Page** - Can float here, edit suggestions inline

**Capabilities:**
- Access to all debate history
- Access to Judge's decisions
- Access to DNA analysis
- Can dissect any line and explain its provenance
- Creates rewrite plan with full traceability

**User Interaction:**
- User can chat with Planner about specific lines
- Planner explains why changes are proposed
- User can request modifications to the plan
- User must explicitly approve before rewrite executes

---

## ✅ Implementation Checklist (Updated)

### Phase 1: Structural Scan (Remove Base Scoring)
- [ ] Modify `analyzeGeneratedSong()` to NOT score
- [ ] Create `structuralScan()` - DNA match, structure map, syllables
- [ ] Pass structural data to agents as context only

### Phase 2: Real Agent Debate (The Council)
- [ ] Build streaming debate interface (visible to user)
- [ ] Implement real back-and-forth conversation
- [ ] Each agent sees previous agent responses
- [ ] Adversarial prompting (challenge, don't compromise easily)
- [ ] Producer upgraded to Gemini 3.0 Pro

### Phase 3: The Judge (6th Agent)
- [ ] Create `judgeAgent.ts` service
- [ ] Gemini 3.0 Pro for highest reasoning
- [ ] Input: Full debate transcript
- [ ] Output: Binding decisions with rationale
- [ ] Logic + parameter-based ruling

### Phase 4: The Planner (Floating Agent)
- [ ] Modify `FloatingAnalysisAgent.tsx` to float between pages
- [ ] Takes all inputs: debate, judge, DNA
- [ ] Creates RewritePlan with full traceability
- [ ] **NEVER auto-executes** - requires user approval

### Phase 5: War Room UI
- [ ] Display draft plan with per-change approval
- [ ] Show source of each change (which agent, which debate)
- [ ] User can veto, modify, add instructions
- [ ] Explicit "Execute Rewrite" button

### Phase 6: Two-Pass Rewrite
- [ ] Pass 1: Structural changes (lyrics/rhymes)
- [ ] Pass 2: Furniture overlay (ad-libs/breaths)
- [ ] Only runs after user approval

---

## 📝 Key Takeaways

1. **Base analysis scoring = KILL IT** (agents do real scoring)
2. **Real debates = STREAMING, VIEWABLE, INTERACTIVE**
3. **The Judge = Gemini 3.0 Pro, smartest in room**
4. **The Planner = Floats, synthesizes, creates plan, DOES NOT AUTO-EXECUTE**
5. **User approval = MANDATORY before rewrite**
6. **Producer upgrade = Gemini 3.0 Pro**
7. **Longer time = ACCEPTABLE tradeoff for quality**

---

**Status:** BOARD DIRECTIVE CAPTURED  
**Next:** Begin implementation per this specification
