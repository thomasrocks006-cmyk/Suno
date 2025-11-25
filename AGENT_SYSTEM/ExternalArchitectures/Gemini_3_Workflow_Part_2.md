# Gemini 3 Workflow - Part 2: Base Analysis Refactor & Implementation Plan

**Date:** November 25, 2025  
**Source:** External LLM Consultation (Gemini 3)  
**Context:** Critical Analysis - Base Analysis Redundancy Discovery  
**Status:** Architecture Correction - Pending Board Review

---

## Critical Realization: The Base Analysis Redundancy

### The Logic Shift

Previously, the "Base Analysis" did a generic pass of scoring the song. Then the Agents did specific scoring. **This is wasteful and confusing.**

### Correction

**We should kill the old "Base Analysis" scoring loop.**

**Replacement:** The "Deep Analysis" is no longer a single step at the start. It is the **Sum Total of the 5 Agents + The Debate Results + The DNA Match**.

The Planner Agent effectively becomes the creator of the "Deep Analysis Report" by combining these streams.

---

## 📋 Implementation Todo List (For Claude Sonnet 4.5 Agent)

**Status:** Ready for Handoff  
**Priority:** P0

### 1. Refactor Analysis Pipeline (The "Base Analysis" Fix)

**Task:** Remove the legacy `analyzeSong` function that performs generic scoring on 6 categories immediately after generation.

**New Flow:**

**Create `structuralScan()`:** A lightweight, non-scoring pass. Runs immediately.

**Output:** 
- DNA Match
- Structure Map (V-C-V-C)
- Syllable Counts (Programmatic)

**Pass this `structuralScan` data to the 5 Agents as context.**

**Logic:** The "Analysis" object is now constructed **after** the Agents return, by aggregating their specific outputs (Lyricist, Storyteller, etc.).

---

### 2. Implement "Planner Agent" & Interactive Review

**Task:** Build the `services/plannerAgent.ts` service.

**Input:** 
- Agent Scores
- Debate Resolutions
- DNA Constraints

**Intermediate Step (NEW):** The Planner outputs a `DraftExecutionPlan`.

**UI Hook:** Create a breakpoint where this Draft Plan is sent to the Client.

**Allow User to:**
- Toggle specific changes (e.g., "Ignore the Hitmaker's advice on the bridge")
- Add manual "Force Fixes" (e.g., "Change line 4 manually")

**Final Step:** Commit the Draft Plan to `FinalExecutionPlan` for the Rewrite Agent.

---

### 3. Syllable Guardrails (Programmatic)

**Task:** Create a utility `countSyllables(text: string): number`.

**Integration:**
- Run on original lyrics
- Pass counts to Rewrite Agent

**Constraint:** If the Rewrite Agent generates a line that deviates by >2 syllables from the original (and it wasn't requested to change flow), trigger a retry or flag it.

---

### 4. The Auditor (Post-Processing)

**Task:** Create a lightweight validation step after the rewrite.

**Check:** Does the new Rhyme Scheme match the intended scheme?

**Action:** If Failure, return a visible warning flag in the UI: `"Warning: Rhyme scheme may be broken in Verse 2."`

---

## 🏛️ Master Architecture Plan: "The Agency" v2.0

**Objective:** A collaborative, synthesized workflow that allows human intervention before the destructive rewrite action.

### Phase 1: The Structural Scan (Lightweight)

**Logic:** Don't score yet. Just understand the physics of the song.

**Structural Scanner (Machine + Flash):**
- **DNA Match:** Identify reference track
- **Syllable Map:** Count beats per line
- **Rhyme Scheme Detect:** Identify AABB vs ABAB

**Outcome:** A context object, not a score.

---

### Phase 2: The Council (Expert Scoring)

**Logic:** The Agents ARE the analysis.

**Parallel Agent Execution:**
- Lyricist, Storyteller, Vocal Coach, Producer, Hitmaker
- They score the song based on their domains
- They receive the Structural Scan as context

---

### Phase 3: The Arena (Adversarial Debate)

**Logic:** Agents fight over tradeoffs.

**Conflict & Debate:**
- Identify top 3 conflicts
- Run Adversarial Debates (Dissenter vs Expert)
- Synthesizer outputs Mandates

---

### Phase 4: The Architect (Draft Planning)

**Logic:** Synthesize everything into a plan, but don't pull the trigger yet.

**Planner Agent:**
- Synthesizes Agent Scores + Debate Mandates + DNA Structure
- Identifies Rhyme Dependency Groups
- Output: `DraftExecutionPlan`

---

### 🚨 Phase 5: The War Room (Interactive Review) 🚨

**Logic:** The User is the Executive Producer. They get final say on the Plan.

**User/System Review:**

**System Display:** Shows the Draft Plan. "We plan to simplify the Chorus because the Hitmaker won the debate. Do you agree?"

**User Action:**
- Approve Plan
- Veto specific changes
- Add manual instructions

**Finalize:** System updates the JSON to `FinalExecutionPlan`.

---

### Phase 6: The Construction (Two-Pass Execution)

**Logic:** Build the structure, then add the furniture.

**Rewrite Agent (Pass 1 - Structural):**
- Writes Lyrics & Rhymes
- Syllable Check: Ensures lines fit the meter

**Rewrite Agent (Pass 2 - Sonic Overlay):**
- Adds Ad-libs, Breath marks, and Visual Cues

---

### Phase 7: The Auditor

**Logic:** Trust but verify.

**Validation:**
- Did we break the rhyme scheme?
- Did we address the "Mandates"?

**Output:** Final Song + "Verification Report" (e.g., 98% Compliance with Plan)

---

**End of Part 2**
