# Gemini 3 Workflow - Part 3: Visual Architecture Critique & v3.0 Master Plan

**Date:** November 25, 2025  
**Source:** External LLM Consultation (Gemini 3)  
**Context:** Visual Roadmap Analysis & Critical Disconnect Discovery  
**Status:** Architecture Refinement v3.0 - Source of Truth

---

## Visual Architecture Analysis

This is a fantastic visual breakdown. It exposes exactly where the waste was (the redundant Base Analysis) and where the value is missing (the fake debates).

However, looking at the Visual Roadmap vs. our Logical Discussion, I see a **Critical Disconnect** in the "After" flow.

---

## The Critique: Missing Approval Gate

**In your "After" visual, the flow is:**  
`Planner Agent (Creates Plan) → Execute Rewrite (Immediately)`

**The Flaw:** This bypasses the "War Room" (User Review) we discussed. If the Planner Agent decides to "Remove the Bridge" because the Hitmaker won the debate, and the user loves that bridge, the user will be furious when the rewrite creates a song without it.

**The Fix:** We must insert the **Approval Gate** between the Planner and the Rewrite Agent.

---

## 🏛️ Master Architecture Plan: "The Agency" v3.0 (Source of Truth)

**Status:** 🟢 APPROVED FOR IMPLEMENTATION  
**Core Philosophy:** Analyze in parallel, Debate for consensus, Plan transparently, Execute in stages.

---

### Phase 1: The Structural Scan (1s)

**Logic:** Machine vision before creative opinion. No scoring yet.

**Input:** Original Lyrics + User Metadata

**Action:** `gemini-2.0-flash-exp` (Low temp)

**Outputs:**
- **DNA Match:** (e.g., "Matches 'Hotel California' structure")
- **Syllable Map:** Programmatic count of syllables per line
- **Rhyme Scheme:** (e.g., AABB)
- **Structural Skeleton:** (e.g., V1-V2-C-V3-C-B-C)

**NO SCORING.**

---

### Phase 2: The Council (3s - Parallel)

**Logic:** 5 distinct personas analyzing the same object with different lenses.

**Actors:** Lyricist, Storyteller, Vocal Coach, Producer, Hitmaker

**Input:** Song + Phase 1 Skeleton + DNA Match

**Constraint:** Thinking Budget (512 tokens)

**Output:** Score (1-10) + Reasoning + Specific Line Citations

---

### Phase 3: The Arena (4s - Parallel)

**Logic:** Conflict reveals truth.

**Conflict Engine:** Calculate Variance. Pick Top 3 Hotspots.

**The Debates (4-Turn Chain):**
- **Turn 1 (Expert):** Defends the score
- **Turn 2 (Dissenter):** Attacks the logic (Adversarial)
- **Turn 3 (Synthesizer):** Proposes a solution based on DNA + User Intent
- **Turn 4 (Vote):** All 5 agents vote

**Output:** `DebateResolutions` (Mandates)

---

### Phase 4: The Architect (Drafting) (6s)

**Logic:** Synthesis of data into instructions.

**Context Compressor:**
- Strip full transcripts
- Keep only `DebateResolutions` and `AgentInsights`

**Planner Agent:**

**Input:** Compressed Context + DNA Skeleton

**Logic:**
- **Rhyme Locking:** Identify dependency groups (Couplets)
- **Mandate Application:** "Debate 1 said simplify Chorus -> Tag Chorus lines for rewrite"
- **Few-Shot Gen (NEW):** Generate 2 examples of the desired change style for the Rewrite Agent to mimic

**Output:** `DraftExecutionPlan` (JSON)

---

### Phase 5: The War Room (User Intervention) 🛑

**Logic:** The User is the Executive Producer.

**UI Interaction:**

**Display:** `DraftExecutionPlan`

**Show:** "We are changing lines 12-14 because [Hitmaker] won Debate #2."

**User Controls:**
- ✅ **Approve All**
- ✏️ **Veto specific changes** (removes them from JSON)
- 📝 **Add Manual Instruction**

**Commit:** User click converts `DraftExecutionPlan` → `FinalExecutionPlan`

---

### Phase 6: The Construction (4s - Two-Pass)

**Logic:** Structure first, decoration second.

**Pass 1 (The Mason):**
- **Role:** Rewrite Agent
- **Task:** Change lyrics/rhymes based on `FinalExecutionPlan`
- **Constraint:** Maintain Syllable Map (±2) unless instructed otherwise

**Pass 2 (The Decorator):**
- **Role:** Same Agent (Chain of Thought)
- **Task:** Inject `furnitureAdditions` (Ad-libs, breaths, brackets)
- **Constraint:** DO NOT change the words from Pass 1

---

### Phase 7: The Auditor (2s)

**Logic:** Quality Assurance.

**Programmatic Check:**
- Did rhyme scheme break?
- Did syllable count drift >20%?

**Feedback:**
- **If Pass:** Show Song
- **If Fail:** Add "Warning Badge" to UI (`"⚠️ Rhythm deviation detected in V2"`)

---

## ⚔️ The Challenger Section (Remaining Risks)

### 1. The "Hallucinated Constraint" Risk

**Critique:** The Planner might tell the Rewrite Agent to "Use a syncopated rhythm." Text models cannot hear rhythm; they can only count syllables.

**Fix:** We must strip "musical" instructions (tempo, syncopation, pitch) from the Planner's output and convert them into "text" instructions (short words, repeating consonants, syllable counts).

---

### 2. The "Context Drift" in Debates

**Critique:** In Turn 4 of the debate, agents might forget the original lyrics and just vote based on the previous argument.

**Fix:** Every Debate Turn prompt must re-inject the specific 4 lines of lyrics being discussed so they are always in the immediate context window.

---

**End of Part 3**
