# Deep Analytics Workflow - Comprehensive Data Flow

## Overview

The Deep Analytics system creates a comprehensive, validated execution plan by analyzing **relationships between all metrics**. Every data point is cross-validated to ensure all improvements complement each other and add maximum value to the final product.

---

## Phase 1: Analysis Loaded

When a song's deep analysis completes, the system has access to:

### Core Data Sources

1. **Score Breakdown** (6 categories)
   - Lyrical Originality
   - Melodic & Phonetic Flow
   - Emotional Impact
   - Structure & Pacing
   - Commercial Potential
   - Thematic Cohesion

2. **Sonic Analysis**
   - Phonetics (flow, singability)
   - Density (word count, pacing)
   - Cinema Audit (concrete objects, visual imagery)

3. **Line-by-Line Improvements**
   - Original line → Improved line
   - Reason for change
   - Source (AI, User, DNA Match, etc.)

4. **DNA Match** (if available)
   - A-tier reference song
   - Structural improvements
   - Word spacing techniques
   - Metaphorical patterns
   - Narrative strategies
   - Sonic patterns

5. **Weaknesses & Strengths**
   - Specific issues identified
   - What's already working well

---

## Phase 2: Workflow Validation

**File:** `services/planValidationService.ts`

The system runs comprehensive validation to establish **relationships between all metrics**:

### Validation Types

#### 1. Score Breakdown ↔ Line-by-Line Improvements

**Question:** Do the proposed line changes actually address the low-scoring categories?

**Logic:**
- Identify categories scoring < 7/10
- Check if line improvements target those categories
- **Complement:** Line improvements address low scores → Value: 75/100
- **Conflict:** Low scores but no line improvements target them → Value: 20/100
- **Resolution:** Add line changes specifically targeting weak categories

**Example:**
```
Category: "Lyrical Originality" scores 5/10 (Reason: "Too many clichés")
Line Improvements: 3 changes mention "add unique metaphor"
Result: COMPLEMENT ✅ (Value: 75/100)
```

#### 2. Sonic Analysis ↔ Line-by-Line Improvements

**Question:** Do line improvements address phonetic/density issues?

**Logic:**
- Check phonetics for issues (awkward, clunky, harsh)
- Check density for issues (too sparse, too crowded)
- Count how many line improvements address these
- **Complement:** Issues identified AND line improvements fix them → Value: 80/100
- **Conflict:** Issues exist but no fixes proposed → Value: 15/100

**Example:**
```
Phonetics: "Harsh consonant clusters in verse 2 hurt singability"
Line Improvements: 2 changes mention "smoother phonetic flow"
Result: COMPLEMENT ✅ (Value: 80/100)
```

#### 3. DNA Match ↔ Current Analysis

**Question:** Are DNA match insights compatible with our song's style? Do they conflict?

**Logic:**
- For each DNA improvement category (structural, metaphorical, sonic, etc.):
  - Check if our song scores poorly in that area
  - **Complement:** DNA provides technique AND we need it → Value: 85/100
  - **Independent:** DNA provides technique but we're already strong → Value: 40/100

**Example:**
```
DNA Match: "Ed Sheeran - Photograph" provides structural improvements
Our Structure Score: 4/10 (weak)
Result: COMPLEMENT ✅ (Value: 85/100) - "A-tier technique highly applicable"
```

#### 4. Phonetics ↔ Density

**Question:** Can both be addressed simultaneously? Do they conflict?

**Critical Conflict Detection:**
- Phonetics says "too fast/rushed" + Density says "too sparse" = **CONFLICT**
  - These are opposing forces (slow down vs add more)
  - Resolution: Prioritize singability, add words strategically
  - Value: 60/100 (reduced until resolved)

- Phonetics says "too slow" + Density says "too crowded" = **COMPLEMENT**
  - Both suggest cutting back
  - Value: 85/100 (high alignment)

**Example Conflict:**
```
Phonetics: "Lines feel rushed and hard to sing"
Density: "Not enough narrative detail, feels sparse"
Result: CONFLICT ⚠️
Question: "Should we prioritize singability or narrative completeness?"
Resolution: "Add strategic words without rushing pace - use shorter, punchier phrases"
```

#### 5. Cinema Audit ↔ Metaphor Improvements

**Question:** Do we have enough concrete objects? Are we adding the right ones?

**Logic:**
- Cinema audit shows object count and grade (A/B/C/F)
- Count line improvements that add physical objects (car, window, street, etc.)
- **Complement:** Low cinema score AND improvements add objects → Value: 80/100
- **Conflict:** Low cinema score but NO objects being added → Value: 30/100

**Example:**
```
Cinema Audit: Grade C (only 3 objects: "heart", "sky", "road")
Line Improvements: Add "steering wheel", "rearview mirror", "headlights"
Result: COMPLEMENT ✅ (Value: 80/100) - "Adding concrete imagery"
```

#### 6. Commercial Mode ↔ Density

**Question:** If commercial mode is ON, are we actually making lines more concise?

**Logic:**
- Commercial mode = "Less is More" approach
- Check if density analysis says "too crowded/wordy"
- **Complement:** Commercial mode ON + Density too high → Value: 90/100
  - Perfect alignment for cutting down
- **Override:** Commercial mode ON + Density already good → Value: 60/100
  - May still trim for punchier hooks

**Example:**
```
Commercial Mode: ENABLED
Density: "Lines are wordy and crowd the melody"
Result: COMPLEMENT ✅ (Value: 90/100) - "Perfect alignment for 'less is more'"
```

#### 7. Target Scores ↔ Current Weaknesses

**Question:** Are target score improvements realistic given the weaknesses?

**Logic:**
- Calculate score gap (projected - current)
- Count major weaknesses
- **Conflict:** Gap > 15 points AND 5+ major weaknesses → Value: 40/100
  - Too ambitious, likely unrealistic
- **Complement:** Reasonable gap for weakness count → Value: 75/100

**Example:**
```
Current Score: 58/100
Projected Score: 85/100 (Gap: +27 points)
Weaknesses: 7 major issues
Result: CONFLICT ⚠️
Question: "Can we realistically fix 7 issues and gain 27 points?"
Resolution: "Adjust projected score to 73 (more conservative) OR ensure EVERY weakness has concrete solution"
```

---

## Phase 3: Conflict Resolution

**File:** `services/planValidationService.ts` → `identifyConflicts()`

### Conflict Types

1. **Metric Contradiction**
   - Two data sources suggest opposite actions
   - Example: Phonetics vs Density conflict
   - Severity: BLOCKING or WARNING
   - Requires: Strategic choice + explanation

2. **Target Impossible**
   - Projected improvement is unrealistic
   - Example: 30-point jump with minimal fixes
   - Severity: WARNING
   - Requires: Adjust targets or add more solutions

3. **Data Missing**
   - Critical data not available
   - Example: No DNA Match found
   - Severity: INFO
   - Requires: Optional enhancement

4. **User Override**
   - User decision overrides analysis
   - Example: User wants specific style despite low score
   - Severity: INFO
   - Requires: Document reasoning

---

## Phase 4: Coherence Calculation

**Formula:**
```typescript
weights = {
  complement: 1.0,    // Perfect alignment
  independent: 0.5,   // Doesn't interact
  conflict: -1.0,     // Opposing forces
  override: 0.3       // One overrides the other
}

totalWeight = sum(validation.relationship * weight)
maxWeight = total validations (if all were complements)

coherence = (totalWeight / maxWeight) * 100

// Penalize blocking conflicts
coherence -= (blocking conflicts * 15)

// Final score: 0-100%
```

**Interpretation:**
- **90-100%:** All data sources work together perfectly
- **70-89%:** Good coherence, minor conflicts
- **50-69%:** Moderate conflicts, needs resolution
- **Below 50%:** Major conflicts, agent discussion required

---

## Phase 5: Plan Generation with Validation Context

**File:** `services/geminiService.ts` → `generateRewritePlan()`

The AI receives **complete validation context**:

### Input to AI

```
⚙️ WORKFLOW VALIDATION COMPLETE
Overall Coherence Score: 78%

📊 METRIC RELATIONSHIPS (top 10):
• DNA Match: Sonic Patterns ↔ Melodic & Phonetic Flow Score
  Relationship: COMPLEMENT
  Impact: positive (Value: 85/100)
  Phonetic Flow scores 5/10. DNA match provides 4 proven sonic patterns

• Score: Lyrical Originality ↔ Line-by-Line Improvements
  Relationship: CONFLICT
  Impact: negative (Value: 25/100)
  Lyrical Originality scores 4/10 but no line improvements address it
  → Strategy: Add line changes targeting: "Overuse of generic phrases"

⚠️ CONFLICTS DETECTED (2):
[WARNING] CONFLICT: Phonetics suggests slowing down, but Density suggests adding more words
  Affects: Sonic Analysis: Phonetics, Sonic Analysis: Density
  Resolution: Prioritize phonetic flow. Add words strategically without rushing
  ❓ Should we prioritize singability or narrative completeness?

💡 STRATEGIC RECOMMENDATIONS:
• ✅ LEVERAGE: 5 high-value data sources aligned. Prioritize in rewrite plan.
• 🧬 DNA PRIORITY: 3 A-tier techniques from "Photograph" highly applicable
• 📈 COMMERCIAL BOOST: "Less is More" mode aligns perfectly with density issues

🎯 HIGH-VALUE OPPORTUNITIES (80+ value score):
• DNA Match: Sonic Patterns → Proven phonetic techniques to fix flow issues
• Commercial Mode → Perfect alignment for cutting wordy lines
• Cinema Audit ↔ Line Improvements → Adding concrete objects successfully
```

### AI Instructions

The AI must:
1. **RESOLVE ALL CONFLICTS** explicitly in the plan
2. **PRIORITIZE HIGH-VALUE METRICS** (80+ scores)
3. **EXPLAIN TRADE-OFFS** when overriding one metric for another
4. **TRACE EVERY DECISION** back to validation + analysis data

### Output Format

Every line change must show:
- What validation it addresses
- What analysis finding it's based on
- Which conflict (if any) it resolves

**Example:**
```json
{
  "lineNumber": 5,
  "originalLine": "My heart is beating fast tonight",
  "newLine": "My pulse hammers against the steering wheel",
  "reason": "Add concrete object (steering wheel) + replace generic 'heart' with visceral 'pulse hammers'. ADDRESSES: Validation showing Cinema Audit needs more objects (Grade C, only 3). Inspired by DNA Match technique from Ed Sheeran's use of 'photograph' as anchor object.",
  "categoryImproved": "Lyrical Originality",
  "sourceAnalysis": "DNAMatch"
}
```

---

## Phase 6: User Review with Full Transparency

**Component:** `LiveRewritePlan.tsx`

User sees:
1. **Workflow Validation Summary**
   - Coherence score: 78%
   - Conflicts: 1/2 Resolved
   - Warnings (expandable)

2. **Target Score**
   - Current → Projected
   - Realistic given validation

3. **Category Improvements** (expandable)
   - Shows which validation drove each strategy
   - DNA insights applied (if any)

4. **Line-Level Changes** (expandable)
   - Every change traces back to validation
   - Source analysis badge (DNA, Phonetic, Chat, etc.)

5. **Rationale**
   - Why this plan addresses all concerns
   - How conflicts were resolved

6. **Expected Impact**
   - Predicted improvements
   - Based on coherence score

---

## Phase 7: Agent Discussion (Continuous)

**Component:** `FloatingAnalysisAgent.tsx`

User can click **any metric** to discuss with agent:
- Agent has full validation context
- Can explain why conflicts exist
- Suggests resolution strategies
- Extracts key insights that trigger plan updates

**Auto-Plan Generation:**
When agent says keywords like "key point", "flag this", "important", "should", "recommend":
→ Automatically regenerates plan with new insights

---

## Phase 8: Plan Approval

User can:
- **Approve:** Execute the plan as-is
- **Reject:** Provide feedback, discuss with agent
- **Modify:** Chat with agent to refine specific parts

---

## Value-Add Scoring System

Each validation assigns a **Value-Add Score (0-100)**:
- How much does this metric interaction improve the final product?

### High Value (80-100)
- Strong complementary relationships
- Critical data aligns perfectly
- Proven techniques applicable to weak areas

### Medium Value (50-79)
- Helpful but not critical
- Independent metrics that don't conflict
- Nice-to-have improvements

### Low Value (0-49)
- Conflicting data sources (reduced value until resolved)
- Metrics that don't add much (already strong)
- Impossible targets

**System prioritizes high-value relationships** in the plan generation.

---

## Example: Complete Workflow

### Input Song
- **Score:** 58/100
- **Weaknesses:** "Generic metaphors", "Rushed phonetics", "Low object count"
- **DNA Match:** "Photograph" by Ed Sheeran (85% match)

### Validation Results

```
✅ DNA Match: Metaphorical ↔ Lyrical Originality Score
   Relationship: COMPLEMENT (Value: 90/100)
   "Ed Sheeran uses 'photograph' as concrete anchor. We score 4/10 on originality."

✅ Cinema Audit ↔ Line-by-Line Improvements
   Relationship: COMPLEMENT (Value: 80/100)
   "Grade C (3 objects). Line improvements add 'steering wheel', 'dashboard', 'mirror'."

⚠️ Phonetics ↔ Density
   Relationship: CONFLICT (Value: 60/100)
   "Phonetics says slow down, Density says add more. RESOLUTION: Add shorter, punchier phrases."

✅ Commercial Mode ↔ Density
   Relationship: COMPLEMENT (Value: 85/100)
   "'Less is More' mode + wordy lines = perfect alignment"
```

**Coherence: 82%** (Good coherence, 1 conflict to resolve)

### Generated Plan

```
TARGET SCORE: 73/100 (+15 points, realistic for 3 major fixes)

CATEGORY: Lyrical Originality (4/10 → 7/10)
Strategy: Apply DNA Match technique - add central metaphor using concrete object
DNA Insight: Ed Sheeran's "photograph" = tangible memory anchor. We'll use "steering wheel" as freedom/control anchor.

LINE CHANGES:
Line 5: "My heart is free" → "My hands grip the steering wheel"
Reason: Replace abstract "heart/free" with concrete "steering wheel" + physical action "grip". 
ADDRESSES: Cinema Audit needs objects (Grade C) + Lyrical Originality needs unique metaphor.
Category: Lyrical Originality
Source: DNAMatch

Line 12: "I feel alive when the music plays loud" → "The bass shakes my dashboard"
Reason: Shorter (8 words → 5), adds concrete object "dashboard", visceral verb "shakes"
ADDRESSES: Phonetics says rushed + Density says wordy + Cinema Audit needs objects
Category: Melodic & Phonetic Flow
Source: Phonetic + DNAMatch + Density

CONFLICT RESOLUTION:
Phonetics vs Density: Resolved by using shorter but more impactful phrases. Each word counts.
Commercial Mode applied: Cut 35% of word count without losing narrative.

EXPECTED IMPACT:
• +3 Lyrical Originality (DNA Match anchor object technique)
• +2 Phonetic Flow (fewer, punchier words)
• +1 Thematic Cohesion (steering wheel = freedom motif throughout)
• Cinema Grade: C → B (6 objects total)
```

---

## Summary: Complete Data Flow

```
ANALYSIS LOADED
    ↓
WORKFLOW VALIDATION
    ├─ Score ↔ Line Improvements
    ├─ Sonic ↔ Line Improvements  
    ├─ DNA Match ↔ Scores
    ├─ Phonetics ↔ Density
    ├─ Cinema ↔ Metaphors
    ├─ Commercial ↔ Density
    └─ Targets ↔ Weaknesses
    ↓
CONFLICT DETECTION
    ├─ Complementary (prioritize)
    ├─ Independent (optional)
    ├─ Conflicts (require resolution)
    └─ Overrides (explain trade-off)
    ↓
COHERENCE CALCULATION
    └─ 0-100% score
    ↓
PLAN GENERATION (AI)
    ├─ Sees full validation context
    ├─ Resolves all conflicts
    ├─ Prioritizes high-value metrics
    └─ Traces every decision to data
    ↓
USER REVIEW
    ├─ Validation summary visible
    ├─ Click any section to discuss with agent
    └─ Approve / Reject / Refine
    ↓
AGENT DISCUSSION (continuous loop)
    ├─ User asks questions
    ├─ Agent explains with evidence
    ├─ Key insights trigger plan updates
    └─ Plan auto-refines
    ↓
APPROVAL & EXECUTION
```

---

## Key Principles

1. **Every metric must interact with others** - No isolated decisions
2. **Conflicts are opportunities** - Force us to make strategic choices
3. **High-value prioritization** - Focus on what actually improves output
4. **Full transparency** - User sees exactly how decisions are made
5. **Agent as orchestrator** - Central brain coordinating all data sources
6. **Continuous refinement** - Plan updates as discussion reveals insights

The goal: **Maximum value to the finished product by ensuring all improvements complement each other.**
