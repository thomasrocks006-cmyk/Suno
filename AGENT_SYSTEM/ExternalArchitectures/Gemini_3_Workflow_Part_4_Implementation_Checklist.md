# Gemini 3 Workflow - Part 4: Complete Implementation Checklist

**Date:** November 25, 2025  
**Source:** External LLM Consultation (Gemini 3)  
**Context:** Final Implementation Todo List for Claude Agent  
**Status:** Ready for Handoff to Coding Agent

---

## 📋 Implementation Todo List (For Claude Agent)

**Priority:** P0 (Critical Path)

---

## A. Infrastructure & Analysis (Phases 1-3)

### Refactor geminiService.ts:

- [ ] **Remove legacy `analyzeSong`** (the expensive one)
- [ ] **Create `structuralScan()`** (Phase 1 - Flash, no scoring)
- [ ] **Update `analyze...` functions** for 5 Agents to accept `structuralScan` data as context

---

### Build Debate Engine (agentDebateService.ts):

- [ ] **Implement `detectConflicts()` logic** (Variance calculation)
- [ ] **Build `runParallelDebates()`** using the 4-turn prompt structure
- [ ] **Ensure "Dissenter" prompt instruction is adversarial** ("Do not compromise")

---

## B. Planning & Review (Phases 4-5)

### Build Planner Service (plannerAgent.ts):

- [ ] **Define `ExecutionPlan` schema** (with traceability and `dependencyGroup` fields)
- [ ] **Implement `generateDraftPlan()`** using compressed context

---

### UI Updates (AnalysisView.tsx):

- [ ] **Create "War Room" Modal:**
  - Display Plan items
  - Allow toggle (Active/Inactive) for each change
  - "Execute" button sends final JSON to rewrite

---

## C. Execution & Audit (Phases 6-7)

### Update Rewrite Logic:

- [ ] **Modify `rewriteSongWithImprovements`** to accept `FinalExecutionPlan`
- [ ] **Implement "Two-Pass" Prompting** (Lyrics first, then Furniture)

---

### Build Auditor:

- [ ] **Create `validateRhymeScheme()` utility**
- [ ] **Display validation warnings** in the final Song Card

---

## Summary

Hand this Todo List and the v3.0 Architecture Plan to the coding agent. It has everything needed to execute.

---

**End of Part 4 - Implementation Complete**
