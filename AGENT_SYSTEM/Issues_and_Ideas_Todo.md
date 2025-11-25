# Agent System - Issues & Ideas Todo List

**Created:** November 25, 2025  
**Last Updated:** November 25, 2025  
**Status:** Pending Review & Implementation  
**Priority:** Mixed (See individual items)

---

## 🔴 Critical Issues

### Issue #1: Producer Model Upgrade to 3.0 Pro
**Priority:** P0  
**Status:** ❌ Pending Implementation

**Problem Statement:**

The Producer agent is currently using a lower-tier model (likely Gemini 2.0 Flash), but Producer responsibilities (Structure, Pacing, Vibe, "The Container") require **abstract reasoning** that Flash models cannot provide effectively.

**Required Action:**
- [ ] Upgrade `analyzeProducer` service to use `gemini-1.5-pro` (or `3.0-pro` if available)
- [ ] Update service configuration in `geminiService.ts`
- [ ] Test performance and cost impact
- [ ] Document model selection rationale

**Justification (from Gemini 3 Analysis):**
> "Structure and Pacing are abstract art forms, not simple math."

**Related:** See Part 5 Model Hierarchy - Producer moved to Tier 1 (Visionaries)

---

### Issue #2: Base Deep Analysis Timing & Dependencies
**Priority:** P0  
**Status:** ❌ Needs Investigation & Decision

**Problem Statement:**

Is the base deep analysis currently running based off the old 6-category creation system? If so, this is fundamentally broken in the new architecture.

**Key Questions:**

1. **When should deep analysis run?**
   - Currently: Runs immediately after generation
   - Proposed: Wait until debate process has finished AND song creation is complete

2. **What should be the basis for analysis?**
   - Currently: Raw generated song only
   - Proposed: Information from debate + song creation process

3. **What is "base deep analysis" in the new architecture?**
   - Option A: Run once debate process and song creation are complete, then combine with DNA match information
   - Option B: Create independently of DNA match, then have Planner Agent combine and make sense of both datasets

**Proposed Flow (Needs Board Approval):**

```
Generation → Structural Scan → 5 Agents → Debates → Planner Creates Draft Plan
                                                              ↓
                                              Deep Analysis combines:
                                              - Debate outcomes
                                              - Agent analyses
                                              - DNA match data
                                                              ↓
                                              Draft Plan Complete → User Review
```

**Required Actions:**
- [ ] Verify current implementation in codebase
- [ ] Determine if we already have capability to sequence this properly
- [ ] Decide between Option A vs Option B
- [ ] Update architecture diagram accordingly

---

### Issue #3: Planner Agent Authority & Model Verification
**Priority:** P0  
**Status:** ❌ Needs Verification & Enhancement

**Problem Statement:**

The Planner Agent must have "God Mode" authority as the Executive Producer and Final Judge, but:
1. Need to verify it's using Gemini 3.0 Pro (not Flash)
2. Need to inject proper "Judge" persona with override authority
3. Must rank agent inputs based on intelligence hierarchy

**Required Actions:**
- [ ] Verify `plannerAgent.ts` is using `gemini-1.5-pro` or `3.0-pro`
- [ ] Inject "Executive Producer/Judge" system instruction
- [ ] Implement hierarchy-aware decision logic (Pro opinions > Flash opinions on abstract topics)
- [ ] Add override capability to ignore lower-tier agent suggestions when appropriate

**New System Instruction Required:**
```
"You are the Executive Producer and Final Judge. You are NOT a peer to the other agents; you are their boss.

Authority: If the 'Hitmaker' suggests a change that ruins the 'Storyteller's' narrative arc, you must OVERRULE the Hitmaker.

Intelligence: Use your superior reasoning (Gemini 3.0 Pro) to detect when the 'Flash' agents are hallucinating or being too literal.

Goal: Do not seek compromise. Seek the Best Song. If that means ignoring 3 agents to follow the DNA of a hit, do it."
```

**Related:** See Part 5 - Section 7: The Planner Agent "God Mode" Skill

---

### Issue #4: Synthesizer Role Definition & Implementation
**Priority:** P0  
**Status:** ❌ Needs Implementation

**Problem Statement:**

The Synthesizer is currently undefined or potentially executed by the wrong model tier. 

**Critical Discovery (from Gemini 3):**
> "If the Synthesizer is just the 'Hitmaker' (Flash model) putting on a different hat, it will likely fail to resolve a complex argument between the 'Lyricist' and 'Storyteller.' It will just split the difference mathematically, which leads to mediocrity."

**Architectural Decision:**

The Synthesizer is a **Dynamic Role** (not a permanent agent), executed by the **Planner Agent's Model (Gemini 3.0 Pro)** during debate resolution.

**Required Actions:**
- [ ] In `agentDebateService.ts`, hardcode "Turn 4: Consensus" prompt to use **Pro Model**
- [ ] Ensure Synthesizer outputs clear **Mandates** (e.g., "Winner: Storyteller. Action: Keep the complex metaphor")
- [ ] Prevent Flash models from performing synthesis role
- [ ] Document Synthesizer as "Judge's Representative" in debates

**Synthesizer Responsibilities:**
- Validate Expert's evidence
- Validate Dissenter's attack
- Check DNA Match (Precedent)
- Write the Mandate (clear, actionable)

**Related:** See Part 5 - Section 5: The Synthesizer Agent or Role?

---

### Issue #5: Flash Agent Voting Rights
**Priority:** P1  
**Status:** 💡 Architecture Decision Needed

**Problem Statement:**

Flash agents (Lyricist, Vocal Coach, Hitmaker) are "Technicians" who provide objective constraints, but they lack the nuance to judge complex artistic decisions.

**Gemini 3 Verdict:**
> "You should use Flash for the dissenters, but do not let them vote."

**Proposed Architecture:**

1. **Flash Agents generate constraints and warnings**  
   - "Line 4 is too long"
   - "Rhyme scheme broken in V2"
   - "No breath mark for 8 seconds"

2. **Pro Agent (Synthesizer) sees warnings and decides**  
   - Fix them (technical violation)
   - Ignore them (artistic license)

3. **Flash agents are "inspectors," not "judges"**

**Board Decision Needed:**
- Do we implement full voting restrictions on Flash agents?
- Or do we weight votes by model tier (Pro votes = 2x, Flash votes = 1x)?
- How do we handle consensus when Flash flags conflict with Pro artistic vision?

**Related:** See Part 5 - Section 4: The Verdict - Cost vs. Intelligence

---

### Issue #2 (renumbered): Base Deep Analysis Timing & Dependencies
**Priority:** P0  
**Status:** ❌ Needs Investigation & Decision

## 🟡 Enhancement Ideas

### Idea #1: Collaborative Review Stage Enhancement
**Priority:** P1  
**Status:** 💡 Proposed - Not Yet Implemented

**Concept:**

Once rewrite plan is complete with debate data and analysis incorporated, open to **collaborative review** by agent AND user together.

**User Capabilities:**
- Make manual edits to plan
- Add suggestions
- Veto specific changes
- Force specific changes

**Agent Capabilities:**
- Point out what's weak
- Highlight what works
- Suggest what could still be improved
- Add recommendations to rewrite plan

**Implementation Notes:**

This aligns with "The War Room" (Phase 5) in the v3.0 architecture, but adds the agent as an **active collaborator** during review, not just a passive plan generator.

**UI Requirements:**
- Split-panel view: Plan on left, Agent commentary on right
- Real-time agent feedback as user toggles changes
- Agent can flag conflicts: "Warning: Removing line 12 will break rhyme scheme"

**Required Actions:**
- [ ] Design "Collaborative Review" UI mockup
- [ ] Implement agent commentary system
- [ ] Create conflict detection logic
- [ ] Build interactive plan editor

---

## 📋 Questions for Board

### Question #1: Deep Analysis Architecture Decision

**Context:** Gemini 3 workflow proposes eliminating redundant "Base Analysis" scoring.

**Options:**

**Option A (Recommended by Gemini 3):**
- Kill old Base Analysis entirely
- Deep Analysis = Sum of (5 Agents + Debates + DNA Match)
- Planner Agent becomes creator of "Deep Analysis Report"

**Option B (Conservative):**
- Keep Base Analysis but run it AFTER debates
- Deep Analysis runs independently, then merges with DNA match
- Planner synthesizes both

**Board Decision Needed:**
- Which option aligns better with project goals?
- Do we have the infrastructure for Option A currently?
- Timeline implications?

---

### Question #2: Agent Collaboration Scope

**Context:** Proposed enhancement for collaborative review stage.

**Question:** How autonomous should the agent be during the review phase?

**Scope Options:**

**Minimal (War Room v1):**
- Agent just presents plan
- User approves/edits
- Agent executes

**Moderate (War Room v2):**
- Agent presents plan + reasoning
- User edits
- Agent validates edits for conflicts
- User approves final

**Maximum (War Room v3):**
- Agent presents plan + reasoning
- User edits
- Agent actively suggests improvements to user's edits
- Back-and-forth collaboration until both approve

**Board Decision Needed:**
- Which scope provides best user experience?
- Cost/performance implications of each option?

---

## 🔧 Technical Debt

### Tech Debt #1: Model Tier Architecture Documentation
**Priority:** P1

**Description:** Need to create comprehensive documentation of the 3-tier model hierarchy and role assignments.

**Required Documentation:**
- [ ] Create visual diagram of model hierarchy
- [ ] Document objective vs subjective task assignments
- [ ] Create decision tree for "when to use which model"
- [ ] Cost analysis of tier assignments

**Tier Structure:**
- **Tier 1 (Visionaries):** Planner, Storyteller, Producer → Gemini 3.0 Pro
- **Tier 2 (Technicians):** Lyricist, Vocal Coach, Hitmaker → Gemini 2.0 Flash
- **Tier 3 (Moderator):** Synthesizer (dynamic role) → Gemini 3.0 Pro

---

### Tech Debt #2: Verify Agent Sequencing Capability

**Description:** Need to verify whether we currently have the ability to properly sequence the deep analysis AFTER debates complete.

**Investigation Required:**
- [ ] Check current `geminiService.ts` flow
- [ ] Verify promise chaining in analysis pipeline
- [ ] Test if we can inject "wait points" before deep analysis
- [ ] Document current limitations

**Priority:** P0 (Blocking other work)

---

## 📝 Notes & Context

### Key Insight from Gemini 3 Workflow

> "The Logic Shift: Previously, the 'Base Analysis' did a generic pass of scoring the song. Then the Agents did specific scoring. **This is wasteful and confusing.**"

**Implication:** We need to fundamentally rethink when and how "deep analysis" runs in our system. It's not a preprocessing step—it's a synthesis step.

---

### Related Documents

- `/workspaces/Suno/AGENT_SYSTEM/ExternalArchitectures/Gemini_3_Workflow_Part_1.md` - Deep dive solutions
- `/workspaces/Suno/AGENT_SYSTEM/ExternalArchitectures/Gemini_3_Workflow_Part_2.md` - Base analysis refactor
- `/workspaces/Suno/AGENT_SYSTEM/ExternalArchitectures/Gemini_3_Workflow_Part_3.md` - v3.0 architecture
- `/workspaces/Suno/AGENT_SYSTEM/ExternalArchitectures/Gemini_3_Workflow_Part_4_Implementation_Checklist.md` - Implementation checklist
- `/workspaces/Suno/AGENT_SYSTEM/ExternalArchitectures/Gemini_3_Workflow_Part_5_Model_Hierarchy.md` - **Model intelligence hierarchy & critical evaluation**

---

## 🎯 Implementation Priority Order

Based on dependencies and critical path analysis:

### Phase 1: Model Infrastructure (Week 1)
1. Issue #1: Upgrade Producer to 3.0 Pro
2. Issue #3: Verify & enhance Planner authority
3. Issue #4: Implement Synthesizer role
4. Tech Debt #1: Document model hierarchy

### Phase 2: Architecture Refactor (Week 2)
1. Issue #2: Refactor deep analysis timing
2. Part 4 Checklist: Build debate engine
3. Part 4 Checklist: Refactor geminiService.ts

### Phase 3: UI & Review System (Week 3)
1. Idea #1: Collaborative review stage
2. Part 4 Checklist: Build "War Room" modal
3. Part 7 Checklist: Build Auditor

### Phase 4: Testing & Optimization (Week 4)
1. Issue #5: Implement Flash voting restrictions
2. Tech Debt #2: Verify sequencing capability
3. End-to-end testing of full pipeline

---

**Next Steps:**
1. Board review of all issues and ideas
2. Prioritization decisions
3. Technical investigation of current capabilities
4. Architecture decision: Option A vs Option B
5. Begin implementation based on decisions

---

**End of Issues & Ideas Todo List**
