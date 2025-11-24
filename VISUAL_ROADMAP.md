# 🗺️ VISUAL PROJECT ROADMAP

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SUNO AI ENHANCEMENT PROJECT                      │
│                              November 2025                               │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
  PHASE 1: FOUNDATION (Week 1) ✅ COMPLETE
═══════════════════════════════════════════════════════════════════════════

✅ Workflow Validation System        [████████████████████] 100%
   → 7 validation pairs, coherence scoring, conflict detection
   → FILE: planValidationService.ts (556 lines)

✅ Auto-Plan Generation               [████████████████████] 100%
   → Triggers when analysis completes
   → FILE: ResultDisplay.tsx (enhanced)

✅ Dual-Agent Debate System           [████████████████████] 100%
   → Songwriter + Producer + Judge
   → 20+ grounding principles
   → FILE: agentDebateService.ts (400+ lines)

✅ DNA Match Lyrics Fetching          [████████████████████] 100%
   → Lyrics.ovh + Genius API fallback
   → Structural comparison analysis
   → FILE: dnaLyricsFetchService.ts (260 lines)

✅ Agent Coverage Analysis            [████████████████████] 100%
   → Coverage %, uncovered lines, hotspots
   → FILE: agentCoverageService.ts (220 lines)

✅ Genre Profiles (9 Genres)          [████████████████████] 100%
   → Pop, Hip Hop, Indie, Country, R&B, Rock, EDM, Folk, Latin
   → Optional enforcement (not required)
   → FILE: genreProfileService.ts (500 lines)

✅ Iterative Refinement Loop          [████████████████████] 100%
   → Draft → Critique → Polish
   → Quality threshold & diminishing returns detection
   → FILE: iterativeRefinementService.ts (380 lines)

───────────────────────────────────────────────────────────────────────────
TOTAL: 7 Features Implemented (~2,300 lines of code)
───────────────────────────────────────────────────────────────────────────


═══════════════════════════════════════════════════════════════════════════
  PHASE 2: BRAINSTORMING (Week 2) 🔍 IN PROGRESS
═══════════════════════════════════════════════════════════════════════════

🔍 Interactive Lyrics Analysis        [████████░░░░░░░░░░░░] 40% (Prep Done)
   → Brainstorm document created (650 lines)
   → 10 design areas with open questions
   → Needs external LLM to answer questions
   → FILE: BRAINSTORM_INTERACTIVE_LYRICS_ANALYSIS.md

🔍 Comprehensive Scoring Coverage     [████████░░░░░░░░░░░░] 40% (Prep Done)
   → Brainstorm document created (800 lines)
   → 18 candidate categories to evaluate
   → Agent architecture decision needed
   → FILE: BRAINSTORM_COMPREHENSIVE_SCORING_COVERAGE.md

📋 Brainstorming Guide                [████████████████████] 100%
   → Step-by-step instructions for external LLM
   → Validation checklists
   → Success criteria
   → FILE: BRAINSTORMING_GUIDE.md

───────────────────────────────────────────────────────────────────────────
BLOCKING: Cannot proceed to Phase 3 until brainstorms complete
───────────────────────────────────────────────────────────────────────────


═══════════════════════════════════════════════════════════════════════════
  PHASE 3: VISUAL INTELLIGENCE (Weeks 3-7) ⏳ WAITING
═══════════════════════════════════════════════════════════════════════════

⏳ Interactive Lyrics Canvas          [░░░░░░░░░░░░░░░░░░░░] 0% (Blocked)
   → Color-coded highlights for critiques
   → Hover tooltips with inline editing
   → Section-level warnings
   → 30+ line-level metrics visualization
   → ESTIMATED: 2-3 weeks

⏳ Scoring System Expansion           [░░░░░░░░░░░░░░░░░░░░] 0% (Blocked)
   → Add 3-5 new categories (TBD from brainstorm)
   → Expand agent architecture (2→5 agents?)
   → Genre weight matrices
   → ESTIMATED: 2-3 weeks

⏳ Emotional Arc Mapping              [░░░░░░░░░░░░░░░░░░░░] 0%
   → Sentiment analysis per line
   → Plot emotional trajectory
   → Validate arc vs genre expectations
   → ESTIMATED: 1 week

⏳ Rhythm Visualization               [░░░░░░░░░░░░░░░░░░░░] 0%
   → Syllable stress patterns (◉ ○ ◉)
   → Consonant cluster heatmap
   → Rhyme scheme diagram
   → ESTIMATED: 1 week

───────────────────────────────────────────────────────────────────────────
TOTAL: 4 Features (7-8 weeks estimated)
───────────────────────────────────────────────────────────────────────────


═══════════════════════════════════════════════════════════════════════════
  PHASE 4: ADVANCED INTELLIGENCE (Weeks 8-11) ⏳ FUTURE
═══════════════════════════════════════════════════════════════════════════

⏳ Deep Audio Listening Module        [░░░░░░░░░░░░░░░░░░░░] 0%
   → Upload MP3/WAV for analysis
   → 13-point production analysis
   → Gemini multimodal integration
   → ESTIMATED: 2-3 weeks

⏳ Hit Predictor Simulation           [░░░░░░░░░░░░░░░░░░░░] 0%
   → 5 listener personas
   → Aggregate hit probability score
   → ESTIMATED: 1 week

───────────────────────────────────────────────────────────────────────────
TOTAL: 2 Features (3-4 weeks estimated)
───────────────────────────────────────────────────────────────────────────


═══════════════════════════════════════════════════════════════════════════
  PHASE 5: USER EXPERIENCE (Week 12) ⏳ FUTURE
═══════════════════════════════════════════════════════════════════════════

⏳ Progressive Disclosure UI          [░░░░░░░░░░░░░░░░░░░░] 0%
   → 3-level details (Overview → Details → Debug)
   → Collapsible sections
   → Reduced cognitive load
   → ESTIMATED: 2 days

───────────────────────────────────────────────────────────────────────────
TOTAL: 1 Feature (2 days estimated)
───────────────────────────────────────────────────────────────────────────


═══════════════════════════════════════════════════════════════════════════
  PHASE 6: PERFORMANCE & SCALE (Weeks 13-14) ⏳ FUTURE
═══════════════════════════════════════════════════════════════════════════

⏳ Caching & Partial Updates          [░░░░░░░░░░░░░░░░░░░░] 0%
   → Cache analysis for 30 days
   → Skip re-analysis on partial changes
   → IndexedDB storage
   → ESTIMATED: 2 days

⏳ Historical Learning System         [░░░░░░░░░░░░░░░░░░░░] 0%
   → Track user accept/reject patterns
   → Build preference model
   → Personalize AI over time
   → ESTIMATED: 2 weeks

───────────────────────────────────────────────────────────────────────────
TOTAL: 2 Features (2 weeks estimated)
───────────────────────────────────────────────────────────────────────────


═══════════════════════════════════════════════════════════════════════════
  PROJECT TOTALS
═══════════════════════════════════════════════════════════════════════════

COMPLETED:     7/14 features  (50% by count, 25% by time)
IN PROGRESS:   2/14 features  (brainstorming phase)
BLOCKED:       2/14 features  (waiting on brainstorm results)
FUTURE:        3/14 features  (planned for later phases)

ESTIMATED TIMELINE:
  Weeks 1:      ✅ Foundation (DONE)
  Week 2:       🔍 Brainstorming (IN PROGRESS)
  Weeks 3-7:    ⏳ Visual Intelligence (5 weeks)
  Weeks 8-11:   ⏳ Advanced Intelligence (4 weeks)
  Week 12:      ⏳ User Experience (2 days)
  Weeks 13-14:  ⏳ Performance & Scale (2 weeks)
  
  TOTAL: ~14 WEEKS (3.5 months)


═══════════════════════════════════════════════════════════════════════════
  CRITICAL PATH
═══════════════════════════════════════════════════════════════════════════

CURRENT BOTTLENECK: External LLM brainstorming (7-12 hours)

→ Once brainstorms complete:
  1. Interactive Lyrics implementation can begin
  2. Scoring expansion can begin
  3. These unlock all subsequent features

DEPENDENCIES:
  - Interactive Lyrics blocks: Emotional Arc (uses same highlighting system)
  - Scoring Expansion blocks: Agent expansion, genre weights
  - Audio Listening blocks: Nothing (can start anytime)
  - Historical Learning blocks: User base needed (requires production usage)


═══════════════════════════════════════════════════════════════════════════
  NEXT ACTIONS
═══════════════════════════════════════════════════════════════════════════

IMMEDIATE (This Week):
  1. Run BRAINSTORM_INTERACTIVE_LYRICS_ANALYSIS.md through external LLM
  2. Run BRAINSTORM_COMPREHENSIVE_SCORING_COVERAGE.md through external LLM
  3. Consolidate results into implementation specs
  4. Add optional genre selector to input form
  5. Integrate DNA lyrics fetching (add button to UI)

SHORT-TERM (Next 2 Weeks):
  1. Build Interactive Lyrics canvas MVP
  2. Add top 3 new scoring categories
  3. Display agent coverage report after debate

MID-TERM (Weeks 4-7):
  1. Emotional Arc Mapping implementation
  2. Rhythm Visualization component
  3. Progressive Disclosure UI

LONG-TERM (Weeks 8-14):
  1. Deep Audio Listening Module
  2. Hit Predictor Simulation
  3. Caching system
  4. Historical Learning (after user base exists)


═══════════════════════════════════════════════════════════════════════════
  COST ANALYSIS (Monthly, 1000 Songs)
═══════════════════════════════════════════════════════════════════════════

Current System:
  Base Analysis:              $20    (1 call per song)
  Dual-Agent Debate:          $900   (90 calls for 30 lines)
  Iterative Refinement:       $60    (3 passes)
  DNA Lyrics:                 $0     (free external API)
  ───────────────────────────────
  TOTAL:                      $980/month

Optimized System (Proposed):
  Base Analysis:              $20
  Selective Agent Debate:     $360   (60% cost reduction)
  Cached Refinement:          $12    (80% savings on repeat analyses)
  DNA Lyrics:                 $0
  ───────────────────────────────
  TOTAL:                      $392/month (60% savings!)

With Future Features:
  Audio Listening:            +$50   (1 multimodal call per song)
  Hit Predictor:              +$50   (5 persona simulations)
  ───────────────────────────────
  FUTURE TOTAL:               $492/month


═══════════════════════════════════════════════════════════════════════════
  QUESTIONS & ANSWERS
═══════════════════════════════════════════════════════════════════════════

Q: Are two agents enough?
A: Currently covers all 6 categories, but brainstorm may recommend expanding
   to 5 agents (+ Hook Specialist, Pacing Specialist, DNA Matcher).

Q: What models power the agents?
A: Both Songwriter + Producer use Gemini 3.0 Pro Preview (temp 0.7, 4096 
   token thinking budget). Brainstorm will decide if we should use multi-model
   ensemble (Claude for emotion, GPT-4o for hooks).

Q: Is genre profile enforced?
A: NO - it's optional. If user doesn't select genre, AI uses universal 
   songwriting principles. Only enforced when explicitly selected.

Q: How much have we completed?
A: 7/14 features (50% by count), ~2,300 lines of production code, plus 
   ~2,000 lines of documentation and brainstorming prep.


═══════════════════════════════════════════════════════════════════════════
  FILES REFERENCE
═══════════════════════════════════════════════════════════════════════════

SERVICES (Production Code):
  /services/planValidationService.ts              (556 lines)
  /services/agentDebateService.ts                 (400 lines)
  /services/dnaLyricsFetchService.ts              (260 lines)
  /services/agentCoverageService.ts               (220 lines)
  /services/genreProfileService.ts                (500 lines)
  /services/iterativeRefinementService.ts         (380 lines)

DOCUMENTATION:
  /docs/BRAINSTORM_INTERACTIVE_LYRICS_ANALYSIS.md (650 lines)
  /docs/BRAINSTORM_COMPREHENSIVE_SCORING_COVERAGE.md (800 lines)
  /docs/BRAINSTORMING_GUIDE.md                    (200 lines)
  /docs/AGENT_ARCHITECTURE.md                     (400 lines)
  /FEATURE_ROADMAP.md                             (Updated)
  /SESSION_SUMMARY.md                             (Summary)
  /VISUAL_ROADMAP.md                              (This file)


═══════════════════════════════════════════════════════════════════════════
  END OF ROADMAP
═══════════════════════════════════════════════════════════════════════════
```
