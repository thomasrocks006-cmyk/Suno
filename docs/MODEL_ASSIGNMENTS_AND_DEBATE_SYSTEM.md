# 🤖 AGENT MODEL ASSIGNMENTS & DEBATE ARCHITECTURE
**Current State + Recommendations for Model Optimization**

*Date: November 24, 2025*

---

## 📊 CURRENT MODEL ASSIGNMENTS

### 🎯 THE 5 SPECIALIST AGENTS

| Agent | Current Model | Token Budget | Primary Task | Reasoning Power Needed |
|-------|--------------|--------------|--------------|----------------------|
| **Hitmaker** | Gemini 2.0 Flash Exp | 2,048 | Pattern matching (hooks, commercial appeal) | LOW - Recognition |
| **Lyricist** | Gemini 2.0 Flash Exp | 4,096 | Word-level analysis (clichés, rhymes) | MEDIUM - Analysis |
| **Storyteller** | Gemini 2.0 Flash Exp | 8,192 | 4 categories (narrative, imagery, theme, emotion) | HIGH - Synthesis |
| **Vocal Coach** | Gemini 2.0 Flash Exp | 8,192 | Breath control, phonetics, singability | MEDIUM - Technical |
| **Producer** | Gemini 2.0 Flash Exp | 8,192 | Sonic texture + structure/pacing | HIGH - Multi-domain |

**Total Specialist Cost:** 5x Flash calls per analysis

---

### 🔧 THE WORKFLOW AGENTS

| Agent | Current Model | Task | Reasoning Power Needed |
|-------|--------------|------|----------------------|
| **Main Generator** | Gemini 2.5 Flash | Initial song creation | HIGH - Creative synthesis |
| **Rewrite Planner** | Gemini 2.5 Flash | Synthesize all feedback into plan | VERY HIGH - Multi-agent synthesis |
| **Parameter Validator** | Gemini 2.5 Flash | Check input contradictions | LOW - Logic checking |
| **Deep Analysis Chat** | Gemini 3 Pro Preview | User discussion, nuanced debate | VERY HIGH - Conversational reasoning |

---

### 🎭 THE DEBATE SYSTEM (Judge)

| Component | Current Model | Task |
|-----------|--------------|------|
| **Judge Synthesizer** | Gemini 2.0 Flash Exp | Synthesize compromise from 5 agent votes | VERY HIGH - Multi-perspective reasoning |

---

## 🚨 IDENTIFIED ISSUES

### Issue #1: Judge Using Wrong Model
**Problem:**
```typescript
// services/agentDebateService.ts, line 416
async function synthesize5AgentCompromise(...) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",  // ❌ TOO SIMPLE for this task
```

**Why This is Wrong:**
- Judge must synthesize 5 different perspectives
- Needs to weigh trade-offs (lyrical depth vs commercial appeal vs vocal playability)
- Requires nuanced reasoning, not pattern matching
- Similar complexity to Deep Analysis Chat (which uses Gemini 3 Pro)

**Impact:** Poor compromise decisions, favors first opinion seen, misses subtle trade-offs

---

### Issue #2: Storyteller Overloaded
**Problem:**
- Storyteller owns **4 categories** (Narrative Arc, Imagery, Thematic Cohesion, Emotional Impact)
- Uses same model as other specialists (Flash Exp)
- 8,192 token budget (shared with Producer, Vocal Coach)

**Why This is Wrong:**
- Storyteller synthesizes multiple narrative dimensions
- Should arguably use a stronger reasoning model
- Or: Split into 2 agents (Narrative Specialist + Imagery Specialist)

---

### Issue #3: Parameter Validator Overpowered
**Problem:**
```typescript
// services/geminiService.ts, line 880
export const analyzeSongConcept = async (inputs: SongInputs) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",  // ⚠️ OVERKILL for simple validation
```

**Why This is Inefficient:**
- Task: Check if "Death Metal" + "Relaxing" contradict
- Requires logic checking, not creative reasoning
- Could use cheaper/faster model (2.0 Flash Exp)

---

## 💡 RECOMMENDED MODEL ASSIGNMENTS

### 🎯 TIER 1: Pro Model (Gemini 3 Pro) - Reserved for Complex Reasoning

**Who Should Use Pro:**
1. ✅ **Deep Analysis Chat Agent** (current: Pro) - User discussion, nuanced debate
2. 🆕 **Judge Synthesizer** (change from Flash Exp → Pro) - Multi-agent compromise
3. 🆕 **Rewrite Planner** (upgrade from 2.5 Flash → Pro) - Synthesize all agent feedback + DNA match + user chat

**Reasoning:**
- These agents must reason across multiple perspectives
- Judge weighs 5 agent opinions (Lyricist vs Hitmaker vs Producer tradeoffs)
- Rewrite Planner integrates 10 score categories + DNA insights + workflow validation
- Pro model has superior multi-step reasoning

**Cost Impact:**
- Judge: Only used if user edits lines AND agents disagree (rare)
- Rewrite Planner: Once per rewrite request (acceptable)
- Deep Analysis Chat: Already using Pro

---

### 🎯 TIER 2: Gemini 2.5 Flash - Creative Synthesis

**Who Should Use 2.5 Flash:**
1. ✅ **Main Generator** (current: 2.5 Flash) - Song creation
2. ⬇️ **Parameter Validator** (downgrade if 2.0 Flash can handle) - Input checking

**Reasoning:**
- Main Generator needs creative synthesis (genre + mood + topic → full song)
- 2.5 Flash good for structured creative tasks

---

### 🎯 TIER 3: Gemini 2.0 Flash Exp - Specialized Analysis

**Who Should Use 2.0 Flash Exp:**
1. ✅ **Hitmaker Agent** (current: Flash Exp) - Pattern matching
2. ✅ **Lyricist Agent** (current: Flash Exp) - Word-level analysis
3. ✅ **Storyteller Agent** (current: Flash Exp) - Narrative synthesis
4. ✅ **Vocal Coach Agent** (current: Flash Exp) - Technical analysis
5. ✅ **Producer Agent** (current: Flash Exp) - Multi-domain analysis
6. 🆕 **Parameter Validator** (downgrade from 2.5 Flash) - Logic checking

**Reasoning:**
- These tasks are domain-specific pattern recognition
- Flash Exp fast and cost-effective for parallel analysis
- Grounding Principles guide responses (don't need heavy reasoning)

---

## 🏗️ DEBATE SYSTEM ARCHITECTURE

### How the Debate Works:

#### 1. **User Proposes Line Change** (in Smart Line Editor)
```typescript
// User is in AnalysisView, editing a line
Original: "I'm lost in the darkness tonight"
Proposed: "I'm drowning in shadows and rain"
```

#### 2. **All 5 Agents Vote in Parallel** (`run5AgentDebate()`)
```typescript
// services/agentDebateService.ts, lines 268-310

Lyricist: SUPPORT - "Better concrete imagery (drowning, shadows, rain)"
Storyteller: SUPPORT - "Stronger sensory detail"
Vocal Coach: OPPOSE - "Consonant cluster 'drowning' slows delivery"
Producer: COMPROMISE - "Shadows good, but 'drowning' too dense"
Hitmaker: SUPPORT - "More memorable, specific"

Vote Tally: 3 Support, 1 Oppose, 1 Compromise
```

#### 3. **Judge Synthesizes Decision** (if votes are mixed)
```typescript
// If clear majority (3+ votes), auto-decide
// If mixed, Judge creates compromise:

Judge (Gemini 2.0 Flash Exp - SHOULD BE PRO):
  Decision: COMPROMISE
  Final Change: "I'm lost in the shadows and rain"
  Rationale: "Keeps concrete imagery (shadows, rain) without 
             problematic consonant cluster. Balances lyrical 
             depth (Lyricist/Storyteller) with singability 
             (Vocal Coach)."
```

#### 4. **Result Displayed to User**

**YES - Debate Results ARE Shown to User:**

```typescript
// components/AnalysisView.tsx, lines 187-199

<div className="bg-black/30 rounded p-3 border border-cyan-500/20">
  <div className="text-xs font-bold text-cyan-400 mb-2">
    Debates {coverageReport.debateHotspots.length > 0 && `(${coverageReport.debateHotspots.length})`}
  </div>
  {coverageReport.debateHotspots.length === 0 ? (
    <div className="text-xs text-gray-400">No disagreements</div>
  ) : (
    <div className="space-y-1 text-xs max-h-24 overflow-y-auto">
      {coverageReport.debateHotspots.slice(0, 3).map((item, i) => (
        <div key={i} className="text-gray-300 text-[10px]">
          L{item.lineNumber}: {item.agentCount} agents
        </div>
      ))}
    </div>
  )}
</div>
```

**What User Sees:**
- Coverage report showing which lines have agent disagreements
- "Debates (3)" count in UI
- "L5: 3 agents" - Line 5 has 3 agents debating
- Can expand to see full debate details (Support/Oppose/Compromise votes)

---

## 📋 DEBATE WORKFLOW VISUALIZATION

```
┌─────────────────────────────────────────────────────────────┐
│                    USER EDITS LINE                          │
│  Original: "I'm feeling sad tonight"                        │
│  Proposed: "I'm drowning in sorrow"                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  RUN 5-AGENT DEBATE   │
         │  (Parallel Voting)    │
         └───────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        │  5 AGENTS VOTE (async)  │
        └────────────┬────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌────────┐      ┌────────┐      ┌────────┐
│Lyricist│      │Storytel│      │Vocal C.│
│SUPPORT │      │OPPOSE  │      │COMPROM.│
└────────┘      └────────┘      └────────┘
    │                │                │
    └────────────────┴────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  COUNT VOTES   │
            │ 2S, 1O, 2C     │
            └────────┬───────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   MIXED VOTES?        │
         │   YES → JUDGE         │
         │   NO → AUTO DECIDE    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  JUDGE SYNTHESIZES    │
         │  (Gemini 2.0 Flash)   │  ← ⚠️ SHOULD BE PRO
         │  Creates compromise   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  RETURN DECISION      │
         │  ADOPT / REJECT /     │
         │  COMPROMISE           │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  DISPLAY TO USER      │
         │  Show vote breakdown  │
         │  Show final decision  │
         │  Show rationale       │
         └───────────────────────┘
```

---

## 🎨 USER-FACING DEBATE DISPLAY

### Location: `AnalysisView.tsx`

**What User Sees:**

1. **Coverage Report Summary:**
   ```
   ┌─────────────────────────┐
   │ 🎯 Agent Coverage       │
   │                         │
   │ Gaps (2)                │
   │ L3: Metaphor unclear    │
   │ L8: Weak hook           │
   │                         │
   │ Debates (3)             │  ← Shows debate count
   │ L5: 3 agents            │  ← Line 5 has 3-agent debate
   │ L12: 4 agents           │
   │ L20: 2 agents           │
   └─────────────────────────┘
   ```

2. **Expandable Debate Details** (when user clicks line):
   ```
   Line 5: "I'm drowning in sorrow"
   
   🎭 AGENT DEBATE:
   ✅ Lyricist: SUPPORT - "Concrete imagery"
   ✅ Storyteller: SUPPORT - "Strong emotion"
   ❌ Vocal Coach: OPPOSE - "Consonant cluster slows delivery"
   🤝 Producer: COMPROMISE - "Good imagery, problematic phonetics"
   ✅ Hitmaker: SUPPORT - "More memorable"
   
   ⚖️ RESOLUTION:
   Decision: COMPROMISE
   Final: "I'm lost in the sorrow"
   Rationale: "Removes 'drowning' consonant cluster while keeping emotion"
   ```

3. **Agent Debate Toggle** (enable/disable feature):
   ```typescript
   // components/AnalysisView.tsx, line 916
   <label>
     <input 
       type="checkbox" 
       checked={useAgentDebate} 
       onChange={e => setUseAgentDebate(e.target.checked)}
     />
     🎭 Agent Debate
   </label>
   ```

---

## 🔄 RECOMMENDED CHANGES

### Priority 1: Fix Judge Model (HIGH)
```typescript
// services/agentDebateService.ts, line 416

// BEFORE:
model: "gemini-2.0-flash-exp",

// AFTER:
model: "gemini-3-pro-preview",
```

**Why:** Judge must reason across 5 perspectives with trade-offs. Pro model essential.

---

### Priority 2: Upgrade Rewrite Planner (MEDIUM)
```typescript
// services/geminiService.ts, line 1333+ (generateRewritePlan)

// BEFORE:
model: "gemini-2.5-flash",

// AFTER:
model: "gemini-3-pro-preview",
```

**Why:** Planner synthesizes:
- 5 agent analyses
- DNA match insights
- Workflow validation
- User chat discussion
- Line-by-line improvements

This is complex multi-perspective reasoning → needs Pro.

---

### Priority 3: Downgrade Parameter Validator (LOW - Cost Optimization)
```typescript
// services/geminiService.ts, line 880

// BEFORE:
model: "gemini-2.5-flash",

// AFTER:
model: "gemini-2.0-flash-exp",
```

**Why:** Task is simple logic checking (does "Death Metal" + "Relaxing" contradict?). Flash sufficient.

---

### Priority 4: Consider Storyteller Split (FUTURE)
**Option A:** Upgrade Storyteller to Pro (expensive)
**Option B:** Split into 2 agents:
- Narrative Agent (Arc + Theme) - Flash
- Imagery Agent (Sensory + Emotion) - Flash

Keeps costs down, improves focus.

---

## 💰 COST IMPACT ANALYSIS

### Current Cost Per Song Analysis:
```
5x Specialists (2.0 Flash Exp) = 5 calls
1x Main Generator (2.5 Flash) = 1 call
1x Parameter Validator (2.5 Flash) = 1 call
Total: 7 API calls
```

### After Recommended Changes:
```
5x Specialists (2.0 Flash Exp) = 5 calls
1x Main Generator (2.5 Flash) = 1 call
1x Parameter Validator (2.0 Flash Exp) = 1 call ⬇️ downgrade
1x Rewrite Planner (3 Pro) = 1 call ⬆️ upgrade (only if rewrite requested)
1x Judge (3 Pro) = 1 call ⬆️ upgrade (only if user edits + agents disagree)
1x Deep Analysis Chat (3 Pro) = 1 call (existing, on-demand)

Total per generation: 7 calls (same)
Total per rewrite: +1 Pro call
Total per debate: +1 Pro call (rare - only if mixed votes)
```

**Impact:** Marginal cost increase for rewrite/debate (acceptable for quality improvement)

---

## 🎯 IMPLEMENTATION CHECKLIST

### Phase 1: Critical Fixes
- [ ] Change Judge model from Flash Exp → Pro (agentDebateService.ts:416)
- [ ] Test: Verify Judge produces better compromises
- [ ] Monitor: Judge reasoning quality in mixed-vote scenarios

### Phase 2: Optimization
- [ ] Upgrade Rewrite Planner from 2.5 Flash → Pro (geminiService.ts:1333+)
- [ ] Downgrade Parameter Validator from 2.5 Flash → 2.0 Flash Exp (geminiService.ts:880)
- [ ] Test: Verify parameter validation still accurate
- [ ] Test: Verify rewrite plans more nuanced

### Phase 3: Evaluation
- [ ] Monitor Pro model costs (Judge + Rewrite Planner)
- [ ] Collect user feedback on compromise quality
- [ ] Evaluate if Storyteller needs splitting or upgrade

---

## 📊 SUMMARY TABLE: BEFORE vs AFTER

| Component | Before | After | Reasoning |
|-----------|--------|-------|-----------|
| **Judge** | 2.0 Flash Exp | **3 Pro** ⬆️ | Multi-perspective synthesis |
| **Rewrite Planner** | 2.5 Flash | **3 Pro** ⬆️ | Complex integration task |
| **Parameter Validator** | 2.5 Flash | **2.0 Flash Exp** ⬇️ | Simple logic checking |
| **Deep Analysis Chat** | 3 Pro | 3 Pro ✅ | Already correct |
| **5 Specialists** | 2.0 Flash Exp | 2.0 Flash Exp ✅ | Correct for domain analysis |
| **Main Generator** | 2.5 Flash | 2.5 Flash ✅ | Correct for creative synthesis |

**Net Change:** 
- +2 Pro upgrades (Judge, Rewrite Planner)
- -1 downgrade (Parameter Validator)
- Cost impact: Moderate increase for rewrite/debate quality

---

*End of Analysis*
