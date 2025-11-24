# 🤖 AGENT ARCHITECTURE DOCUMENTATION

## Current Agent System

### Agent Models & Configuration

**Current Implementation** (as of November 2025):
- **Model**: Google Gemini 3.0 Pro Preview (via `@google/genai` SDK)
- **API Key**: Shared from `VITE_GEMINI_API_KEY` environment variable
- **Temperature**: 0.7-0.8 (varies by task)
- **Deep Think Budget**: 2048-8192 tokens (varies by complexity)

**IMPORTANT**: GPT-4o is now considered a "legacy frontier" model (mid-2024). The current state-of-the-art (November 2025) includes:
- **Gemini 3.0 Pro Preview** (Deep Think & Multimodal King) - Current choice ✅
- **Claude 4.5 Sonnet** (Autonomous Agent, Computer Use) - Recommended for Producer Agent
- **GPT-5.1** (Adaptive Generalist, Dual-Mode) - Recommended for Hook Specialist

See `/docs/MODEL_CAPABILITIES_GUIDE.md` for comprehensive model comparison and orchestration logic.

---

## Active Agents

### 1. **Songwriter Agent** (Depth & Emotion Specialist)
- **File**: `/services/agentDebateService.ts`
- **Model**: Gemini 3.0 Pro Preview (November 2025)
- **Temperature**: 0.8 (creative but grounded)
- **Deep Think Mode**: Enabled for novel metaphor generation
- **Context Window**: 2M tokens (can analyze full song + references)
- **Focus Areas**:
  - Lyrical Originality (avoiding clichés)
  - Emotional Impact (authenticity, depth)
  - Thematic Cohesion (story consistency)
  - Metaphor Quality (vivid imagery vs generic)
- **Why This Model**: Deep Think mode enables PhD-level reasoning for emotional depth analysis. Massive context allows loading full song + DNA match + genre profile simultaneously.
  
**Grounding Principles** (from `SONGWRITING_PRINCIPLES`):
- Metaphor Rules: Avoid mixing metaphors, prefer specific over abstract
- Emotional Depth: Show don't tell, personal details over generic statements
- Structure Rules: Pay off setups, maintain consistent voice

### 2. **Producer Agent** (Commercial & Flow Specialist)
- **File**: `/services/agentDebateService.ts`
- **Recommended Model**: Claude 4.5 Sonnet (upgrade from Gemini)
- **Current Model**: Gemini 3.0 Pro Preview (temporary)
- **Temperature**: 0.6 (precise, consistent)
- **Agentic Mode**: Enabled for multi-step validation
- **Focus Areas**:
  - Melodic Flow (syllable patterns, singability)
  - Sonic Density (phonetic texture, consonant/vowel balance)
  - Structure & Pacing (hook placement, section lengths)
  - Commercial Potential (memorability, repetition, accessibility)
- **Why Claude 4.5**: Technical precision benefits from Claude's reliability. Agentic endurance allows analyzing 30+ lines without context drift. ASL-3 safety prevents hallucinated music theory.

**Grounding Principles**:
- Phonetics Rules: Avoid consonant clusters, balance harsh/smooth sounds
- Commercial Rules: Hook in first 8 lines, repeat chorus 3-5x
- Density Rules: 3-5 syllables/second ideal, adjust for genre/tempo
- Structure Rules: Verse 8-12 lines, chorus 4-8 lines (genre-dependent)

### 3. **Judge Agent** (Compromise Synthesizer)
- **File**: `/services/agentDebateService.ts`
- **Recommended Model**: Claude 4.5 Sonnet
- **Current Model**: Gemini 3.0 Pro Preview (temporary)
- **Temperature**: 0.5 (balanced, fair)
- **Context**: All agent positions + grounding principles + genre profile
- **Mode**: Long-session (maintains consistency across all line debates)
- **Role**: 
  - Resolves disagreements between Songwriter + Producer
  - Weighs genre expectations from genre profiles (if provided)
  - Generates alternative compromise suggestions
  - Cites which principles justify final decision
- **Why Claude 4.5**: Compromise synthesis requires reliability (Claude's strength). Must consider all agent positions without bias. ASL-3 safety ensures no hallucinated compromises. Agentic endurance maintains consistency across 30+ line debates.

---

## Proposed Specialist Agents (NOT YET IMPLEMENTED)

### 4. **Hook Specialist** (Memorability Expert)
- **Recommended Model**: GPT-5.1 Thinking (November 2025)
- **Mode**: Auto (Instant for basic checks, Thinking for novel hooks)
- **Temperature**: 0.8 (creative hook alternatives)
- **Persona**: "Chart-Topping Hitmaker" (tone customization)
- **Focus**: 
  - Identify strongest hook candidate in song
  - Validate hook placement (should be in first 8 lines)
  - Suggest catchier alternatives
  - Evaluate repetition effectiveness
- **Why GPT-5.1**: Pattern recognition is GPT's strength. Adaptive reasoning automatically triggers for complex catchiness analysis. Fast iteration useful for trying multiple alternatives. Codex-Max remembers successful hook patterns across sessions.
- **When to invoke**: Only on lines marked as potential hooks

### 5. **Pacing Specialist** (Timing & Energy Expert)
- **Recommended Model**: Gemini 3.0 Pro Preview
- **Temperature**: 0.7 (balanced)
- **Deep Think**: Enabled for complex pacing decisions
- **Context**: Full song + genre profile + DNA match structure (2M window)
- **Focus**:
  - Time-to-hook calculation (which line = catchiest?)
  - Section balance (verse:chorus ratio)
  - Energy curve analysis (does song build appropriately?)
  - Drag detection (verses too long before chorus?)
- **Why Gemini 3.0**: Structural analysis (section balance, energy curve) requires deep reasoning. Benefits from seeing entire song structure in 2M context. Can analyze emotional arc across song with video-level understanding.
- **When to invoke**: After full plan generation, as validation pass

### 6. **DNA Matcher** (A-Tier Pattern Applier)
- **Recommended Model**: Gemini 3.0 Pro Preview (Multimodal)
- **Temperature**: 0.6 (precise matching)
- **Multimodal**: Enabled for audio/video reference analysis
- **Context**: Load reference song lyrics + audio + metadata together
- **Focus**:
  - Compare structure to DNA match reference song
  - Identify what reference does better
  - Suggest specific techniques to borrow
  - Validate genre authenticity against proven hits
- **Why Gemini 3.0**: If fetching audio, Gemini's multimodal capabilities are unmatched (87.6% Video-MMMU benchmark). Can analyze reference songs in multiple modalities simultaneously. Nano Banana Pro useful for visual comparisons (album art, lyric sheets).
- **When to invoke**: When DNA match confidence > 70%, after lyrics fetched

---

## Multi-Model Strategy (PROPOSED)

### Why Use Different Models?

**Current State**: All agents use Gemini 3.0 Pro Preview
- ✅ **Pros**: Consistent behavior, simpler integration, single API key
- ❌ **Cons**: Not optimized for each specialty, same "voice" across agents

**Proposed State**: Specialized models per agent type

| Agent | Proposed Model | Why This Model? | Cost Impact |
|-------|----------------|-----------------|-------------|
| Songwriter | **Claude 3.5 Sonnet** | Best emotional nuance, authenticity detection | +$0.02/call |
| Producer | **Gemini 3.0 Pro Preview** | Strong technical analysis, fast | Baseline |
| Hook Specialist | **GPT-4o** | Superior pattern recognition for catchy phrases | +$0.015/call |
| Pacing Specialist | **Gemini 3.0 Pro Preview** | Excellent structural reasoning | Baseline |
| DNA Matcher | **Gemini 3.0 Pro Preview** | Multimodal (when analyzing fetched lyrics) | Baseline |
| Judge | **Claude 3.5 Sonnet** | Best at nuanced compromise synthesis | +$0.02/call |

**Cost Comparison** (30-line debate):
- **All Gemini**: 90 calls × $0.01 = $0.90
- **Multi-Model**: (30 Claude + 30 Gemini + 30 GPT-4o + 30 Claude Judge) = ~$1.35
- **Increase**: +50% cost for +30% quality improvement (estimated)

**Decision**: Stick with Gemini for now, revisit after comprehensive scoring expansion

---

## Agent Coverage Matrix

### Current Coverage (6 Score Categories)

| Category | Songwriter | Producer | Hook Spec. | Pacing Spec. | DNA Matcher |
|----------|------------|----------|------------|--------------|-------------|
| **Lyrical Originality** | ✅ Primary | ○ Secondary | - | - | ○ Validates |
| **Emotional Impact** | ✅ Primary | - | - | - | - |
| **Melodic Flow** | - | ✅ Primary | ○ Validates | - | ○ Compares |
| **Sonic Density** | - | ✅ Primary | - | - | ○ Compares |
| **Thematic Cohesion** | ✅ Primary | - | - | - | - |
| **Structure & Pacing** | ○ Secondary | ✅ Primary | - | ✅ Primary | ○ Compares |
| **Commercial Potential** | - | ✅ Primary | ✅ Primary | ○ Validates | - |

**Legend**:
- ✅ Primary = Main responsibility
- ○ Secondary/Validates = Provides input but not main focus
- `-` = Not covered

**Coverage Score**: 6/6 categories covered by at least one primary agent

---

## Proposed Expanded Coverage (18 Candidates)

After comprehensive scoring brainstorm completes, this matrix will expand to include:
- Imagery & Sensory Detail
- Narrative Coherence
- Wordplay & Cleverness
- Vocal Delivery Mapping
- Energy Dynamics
- Contrast & Variety
- Cultural Relevance
- Authenticity & Voice
- Risk & Innovation
- Quotability & Shareability
- Accessibility vs Depth Balance
- ... and others

**Action Item**: Run external brainstorm, then update this document with final agent assignments

---

## Agent Invocation Flow

### Current Flow (Dual-Agent Debate)

```
1. User generates rewrite plan
2. User toggles "Use Agent Debate" ON
3. For each line change:
   a. Songwriter Agent evaluates (depth/emotion lens)
   b. Producer Agent evaluates (commercial/flow lens)
   c. If agreement → proceed
   d. If disagreement → Judge synthesizes compromise
4. Return AgentDebateResult[] array
5. Display in UI with 🎭 badge
```

**Trigger**: Optional toggle in `ResultDisplay.tsx`

### Proposed Flow (5-Agent System)

```
1. User generates rewrite plan
2. Core debate (Songwriter + Producer) runs first
3. If enabled, invoke specialists:
   → Hook Specialist on lines 1-8 (early hook zone)
   → Pacing Specialist on section boundaries
   → DNA Matcher if DNA match confidence > 70%
4. Aggregate all agent positions
5. Judge synthesizes final recommendation
6. Return enhanced AgentDebateResult[]
```

**Trigger**: User can toggle individual specialists on/off

---

## Performance Optimization

### Current Cost: $0.90 for 30-line debate

**Optimization Strategies**:

1. **Selective Invocation**: Don't debate every line
   - Only debate lines with `confidence < 80%`
   - Only debate lines flagged by validation conflicts
   - **Savings**: ~60% cost reduction

2. **Batch Processing**: Combine multiple lines in single call
   - Instead of 1 API call per line, group 5 lines together
   - **Savings**: ~40% cost reduction (overhead reduction)

3. **Cache Agent Positions**: Don't re-debate unchanged lines
   - If user edits line 10, only re-debate line 10 (not all 30)
   - **Savings**: ~80% on iterative refinement passes

4. **Tiered Debate Depth**:
   - **Quick Mode**: Only Songwriter + Producer (no Judge unless disagree)
   - **Standard Mode**: Current flow
   - **Deep Mode**: Include all 5 specialists
   - **Savings**: User choice based on budget

**Recommended Default**: Selective Invocation + Caching = ~$0.20 per song

---

## Genre Profile Integration

### How Agents Use Genre Profiles

**If `genreProfile` is set** (e.g., `genreProfile: "pop"`):
- Agents load profile from `genreProfileService.ts`
- Adjust scoring expectations:
  - Example: Pop expects Melodic Flow = 8-10, Lyrical Originality = 6-8
- Weight categories differently:
  - Example: Pop weights Commercial Potential 2x, Originality 1x
- Apply genre-specific rules:
  - Example: Pop requires hook in first 8 lines, chorus repeated 3-5x

**If `genreProfile` is NOT set** (default):
- Agents use universal songwriting principles
- No strict genre enforcement
- AI evaluates based on best practices across all genres
- More creative freedom, less rigid structure

**Implementation**:
```typescript
// In agentDebateService.ts
const genreProfile = inputs.genreProfile 
  ? getGenreProfile(inputs.genreProfile) 
  : null;

const prompt = genreProfile
  ? `Evaluate as ${genreProfile.name} song with these expectations: ${JSON.stringify(genreProfile.scoreExpectations)}`
  : `Evaluate using universal songwriting principles`;
```

---

## Open Questions (For External Brainstorm)

1. Should we use multi-model ensemble (Gemini + Claude + GPT-4o) or stick with Gemini?
2. Is 2 agents sufficient or should we expand to 3-5 specialists?
3. What's the optimal temperature for each agent type?
4. Should Judge always run, or only on disagreements?
5. How do we measure if agent feedback actually improves songs?
6. Should users be able to "train" agents on their preferences over time?

---

## Next Steps

1. ✅ Document current agent architecture (this file)
2. ⏳ Run external brainstorm on comprehensive scoring coverage
3. ⏳ Decide final agent count (2, 3, 4, or 5)
4. ⏳ Implement specialist agents (Hook, Pacing, DNA Matcher)
5. ⏳ A/B test multi-model vs single-model approach
6. ⏳ Add agent performance tracking (do users accept agent suggestions?)
