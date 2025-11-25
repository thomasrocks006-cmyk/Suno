# Agent Debate Architecture Rewrite - Master Implementation Plan
## Part 3 of 4: Implementation Roadmap (v5 FINAL)

**Created:** November 25, 2025, 12:11 PM  
**Updated:** November 25, 2025, 3:50 PM  
**Status:** 🟢 READY FOR IMPLEMENTATION  
**Canonical Reference:** `BOARD_DIRECTIVE_v5_FINAL.md`  
**Depends On:** Parts 1-2 (Overview & Proposed Solution v5)  

---

## 📋 Overview

This document provides the **step-by-step implementation roadmap** for the v5 8-agent architecture.

### Implementation Phases (8 Total)

| Phase | Component | Duration | Priority |
|-------|-----------|----------|----------|
| 1 | Structural Scan Service | 1 day | P0 |
| 2 | Real Debate Engine | 2-3 days | P0 |
| 3 | Judge Agent | 1-2 days | P0 |
| 4 | Analyst Agent (PhD) | 2 days | P0 |
| 5 | Planner Agent Update | 1-2 days | P1 |
| 6 | War Room UI | 2 days | P1 |
| 7 | Two-Pass Rewrite | 1 day | P2 |
| 8 | Auditor & Testing | 1-2 days | P2 |

**Total Duration:** 12-16 days

---

## 🔧 Phase 1: Structural Scan Service (1 day)

### Objective
Replace the scoring base analysis with a data-only structural scan.

### Current State (TO BE REMOVED)
- `geminiService.ts` → `analyzeSong()` produces 6-category scores
- This scoring is REDUNDANT (Analyst will do all scoring)

### Target State
- New `structuralScanService.ts`
- Produces ONLY: DNA match, structure map, syllables, rhyme scheme
- NO SCORING

### Implementation

**File:** `/workspaces/Suno/services/structuralScanService.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface StructuralScanResult {
  // DNA Matching
  dnaMatch: {
    songTitle: string;
    artist: string;
    matchPercentage: number;
    structuralLessons: string[];
  };
  
  // Structure Mapping
  structure: {
    sections: Array<{
      type: 'verse' | 'chorus' | 'bridge' | 'pre-chorus' | 'outro' | 'intro';
      startLine: number;
      endLine: number;
      lines: string[];
    }>;
    format: string; // e.g., "V-C-V-C-B-C"
  };
  
  // Syllable Analysis (can be programmatic)
  syllables: {
    perLine: number[];
    average: number;
    variance: number;
  };
  
  // Rhyme Detection
  rhymeScheme: {
    pattern: string;
    rhymePairs: Array<[number, number]>;
  };
}

export async function performStructuralScan(
  lyrics: string,
  style: string,
  genAI: GoogleGenerativeAI
): Promise<StructuralScanResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  const prompt = `You are a structural analyst. Analyze these lyrics for STRUCTURE ONLY.
  
DO NOT SCORE. Just identify:
1. Which popular song this is most similar to (DNA match)
2. The section structure (verse, chorus, bridge, etc.)
3. Syllable counts per line (can be approximate)
4. Rhyme scheme pattern

Lyrics:
${lyrics}

Style: ${style}

Return JSON matching this schema:
{
  "dnaMatch": { "songTitle": "", "artist": "", "matchPercentage": 0, "structuralLessons": [] },
  "structure": { "sections": [], "format": "" },
  "syllables": { "perLine": [], "average": 0, "variance": 0 },
  "rhymeScheme": { "pattern": "", "rhymePairs": [] }
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  // Parse JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse structural scan');
  
  return JSON.parse(jsonMatch[0]) as StructuralScanResult;
}
```

### Changes to Existing Code

1. **`geminiService.ts`:**
   - Remove or deprecate `analyzeSong()` scoring functionality
   - Keep DNA matching logic if reusable
   - Add import of `structuralScanService`

2. **`agentDebateService.ts`:**
   - Change `baseAnalysis` usage to `structuralScan`
   - Remove expectation of scores from base analysis

3. **UI Components:**
   - `AnalysisView.tsx`: Update to not expect base scores
   - Display structural data differently

### Acceptance Criteria
- [ ] `structuralScanService.ts` created
- [ ] Returns DNA match, structure, syllables, rhyme scheme
- [ ] NO scores in output
- [ ] Gemini 2.0 Flash model used (fast, cheap)
- [ ] Tests pass

---

## 🗣️ Phase 2: Real Debate Engine (2-3 days)

### Objective
Transform fake deterministic debates into real AI conversations.

### Current State (TO BE REPLACED)
```typescript
// agentDebateService.ts - FAKE debates
function determineLyricistVote(tradeoff, analysis) {
  if (tradeoff.area.includes('Originality')) {
    return { agent: 'Lyricist', position: 'SUPPORT', reasoning: 'Canned response...' };
  }
}
```

### Target State
- Real conversational debates
- Agents DISCUSS, CHALLENGE, PROPOSE
- NO SCORING by agents
- Viewable transcripts

### Implementation

**File:** `/workspaces/Suno/services/realDebateEngine.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StructuralScanResult } from './structuralScanService';

export interface DebateTurn {
  agent: string;
  statement: string;
  type: 'observation' | 'challenge' | 'proposal' | 'counter' | 'agreement';
  timestamp: number;
}

export interface DebateTopic {
  topic: string;
  turns: DebateTurn[];
  outcome: 'consensus' | 'split' | 'unresolved';
  agreements: string[];
  disagreements: string[];
}

export interface DebateTranscript {
  debates: DebateTopic[];
  fullTranscript: string;
  startTime: number;
  endTime: number;
}

const AGENT_PERSONAS = {
  Lyricist: {
    model: 'gemini-2.5-pro',
    expertise: 'word choice, originality, metaphors, clichés',
    voice: 'Push for creative, unexpected language. Challenge common phrases.',
  },
  Storyteller: {
    model: 'gemini-2.5-pro',
    expertise: 'narrative arc, emotional journey, thematic cohesion',
    voice: 'Defend story integrity. Focus on emotional impact.',
  },
  Hitmaker: {
    model: 'gemini-2.5-pro',
    expertise: 'commercial viability, hooks, radio appeal',
    voice: 'Cite DNA match evidence. Prioritize accessibility.',
  },
  Producer: {
    model: 'gemini-3.0-pro',
    expertise: 'structure, pacing, arrangement, syllable counts',
    voice: 'Guard technical constraints. Provide feasibility checks.',
  },
  VocalCoach: {
    model: 'gemini-2.0-flash',
    expertise: 'phonetics, singability, breath points',
    voice: 'Focus on how words feel to sing. Identify flow issues.',
  },
};

export async function conductDebate(
  lyrics: string,
  structuralScan: StructuralScanResult,
  genAI: GoogleGenerativeAI,
  onTurn?: (turn: DebateTurn) => void // For real-time streaming
): Promise<DebateTranscript> {
  const debates: DebateTopic[] = [];
  const allTurns: DebateTurn[] = [];
  const startTime = Date.now();
  
  // Phase 1: Opening Observations (parallel)
  const openingObservations = await Promise.all(
    Object.entries(AGENT_PERSONAS).map(async ([agent, persona]) => {
      const model = genAI.getGenerativeModel({ model: persona.model });
      
      const prompt = `You are ${agent}, a music industry expert.
Your expertise: ${persona.expertise}
Your voice: ${persona.voice}

Read these lyrics and share your INITIAL OBSERVATION. Do NOT score them.
Focus on what stands out from your expertise perspective.

Lyrics:
${lyrics}

DNA Match: ${structuralScan.dnaMatch.songTitle} by ${structuralScan.dnaMatch.artist} (${structuralScan.dnaMatch.matchPercentage}% match)
Structure: ${structuralScan.structure.format}

Speak in first person. Be specific. Cite line numbers. 2-3 sentences max.`;

      const result = await model.generateContent(prompt);
      const statement = result.response.text();
      
      const turn: DebateTurn = {
        agent,
        statement,
        type: 'observation',
        timestamp: Date.now(),
      };
      
      onTurn?.(turn);
      return turn;
    })
  );
  
  allTurns.push(...openingObservations);
  
  // Phase 2: Discussion & Challenge (sequential for coherence)
  const discussionContext = openingObservations
    .map(t => `${t.agent}: "${t.statement}"`)
    .join('\n\n');
  
  // Each agent responds to others' observations
  for (const [agent, persona] of Object.entries(AGENT_PERSONAS)) {
    const model = genAI.getGenerativeModel({ model: persona.model });
    
    const prompt = `You are ${agent}. You've heard these observations:

${discussionContext}

Your previous observation: "${openingObservations.find(t => t.agent === agent)?.statement}"

Now RESPOND to the most relevant observation from another agent.
- If you AGREE, say so and ADD to their point
- If you DISAGREE, explain why from your expertise
- If you have a PROPOSAL, share it

Stay in character. Be constructive. 2-3 sentences.`;

    const result = await model.generateContent(prompt);
    const statement = result.response.text();
    
    // Determine turn type based on content
    const type = statement.toLowerCase().includes('disagree') || statement.toLowerCase().includes('but')
      ? 'challenge'
      : statement.toLowerCase().includes('propose') || statement.toLowerCase().includes('what if')
        ? 'proposal'
        : 'agreement';
    
    const turn: DebateTurn = {
      agent,
      statement,
      type,
      timestamp: Date.now(),
    };
    
    onTurn?.(turn);
    allTurns.push(turn);
  }
  
  // Phase 3: Synthesis (parallel final positions)
  const fullContext = allTurns.map(t => `${t.agent}: "${t.statement}"`).join('\n\n');
  
  const finalPositions = await Promise.all(
    Object.entries(AGENT_PERSONAS).map(async ([agent, persona]) => {
      const model = genAI.getGenerativeModel({ model: persona.model });
      
      const prompt = `You are ${agent}. Here's the full discussion so far:

${fullContext}

Give your FINAL POSITION. What do you recommend based on the discussion?
Acknowledge any valid points others made. State your key recommendation.
2-3 sentences.`;

      const result = await model.generateContent(prompt);
      
      const turn: DebateTurn = {
        agent,
        statement: result.response.text(),
        type: 'agreement',
        timestamp: Date.now(),
      };
      
      onTurn?.(turn);
      return turn;
    })
  );
  
  allTurns.push(...finalPositions);
  
  // Package debate
  const endTime = Date.now();
  
  // Identify agreements and disagreements
  const agreements = extractAgreements(allTurns);
  const disagreements = extractDisagreements(allTurns);
  
  debates.push({
    topic: 'Full Song Analysis',
    turns: allTurns,
    outcome: disagreements.length === 0 ? 'consensus' : 'split',
    agreements,
    disagreements,
  });
  
  return {
    debates,
    fullTranscript: allTurns.map(t => `**${t.agent}:** ${t.statement}`).join('\n\n'),
    startTime,
    endTime,
  };
}

function extractAgreements(turns: DebateTurn[]): string[] {
  // Find statements where agents explicitly agree
  return turns
    .filter(t => t.type === 'agreement')
    .map(t => t.statement)
    .slice(0, 5);
}

function extractDisagreements(turns: DebateTurn[]): string[] {
  return turns
    .filter(t => t.type === 'challenge')
    .map(t => t.statement)
    .slice(0, 5);
}
```

### Real-Time Streaming UI

Update `AgentDebateModal.tsx` to show turns as they happen:

```typescript
const [turns, setTurns] = useState<DebateTurn[]>([]);

const handleTurn = useCallback((turn: DebateTurn) => {
  setTurns(prev => [...prev, turn]);
}, []);

// In component
{turns.map((turn, i) => (
  <div key={i} className={`debate-turn ${turn.type}`}>
    <span className="agent-name">{turn.agent}</span>
    <p>{turn.statement}</p>
  </div>
))}
```

### Acceptance Criteria
- [ ] `realDebateEngine.ts` created
- [ ] Agents have distinct personas and expertise
- [ ] Real conversations generated (not canned)
- [ ] NO scores produced by agents
- [ ] Real-time turn callbacks work
- [ ] Transcript viewable to user
- [ ] ~10-15 seconds total debate time

---

## ⚖️ Phase 3: Judge Agent (1-2 days)

### Objective
Create the Judge agent that synthesizes debate outcomes into mandates.

### Implementation

**File:** `/workspaces/Suno/services/judgeAgent.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DebateTranscript } from './realDebateEngine';

export interface JudgeDecision {
  topic: string;
  ruling: string;
  winner: string;
  rationale: string;
  citedArguments: string[];
  mandates: string[];
}

export interface JudgeSummary {
  decisions: JudgeDecision[];
  overriddenArguments: Array<{
    agent: string;
    claim: string;
    overrideReason: string;
  }>;
  unresolvedIssues: string[];
}

export async function judgeDebate(
  debateTranscript: DebateTranscript,
  genAI: GoogleGenerativeAI
): Promise<JudgeSummary> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.0-pro' });
  
  const prompt = `You are the JUDGE - the smartest in the room.
  
You've listened to this debate between music experts:

${debateTranscript.fullTranscript}

Your job is to:
1. Identify the key topics of disagreement
2. Rule on each topic - who's argument was stronger and why
3. Create MANDATES - specific actionable directives for the rewrite

For each decision:
- State the topic
- State your ruling
- Name whose argument won
- Explain your rationale
- List the mandates (specific actions)

DO NOT score the song. Just make decisions and create mandates.

Return JSON:
{
  "decisions": [
    {
      "topic": "...",
      "ruling": "...",
      "winner": "...",
      "rationale": "...",
      "citedArguments": ["..."],
      "mandates": ["..."]
    }
  ],
  "overriddenArguments": [
    { "agent": "...", "claim": "...", "overrideReason": "..." }
  ],
  "unresolvedIssues": ["..."]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse judge summary');
  
  return JSON.parse(jsonMatch[0]) as JudgeSummary;
}
```

### Acceptance Criteria
- [ ] `judgeAgent.ts` created
- [ ] Uses Gemini 3.0 Pro
- [ ] Produces decisions with citations
- [ ] Creates actionable mandates
- [ ] NO scores (just decisions)
- [ ] ~3 seconds execution time

---

## 📊 Phase 4: Analyst Agent - PhD Musicologist (2 days)

### Objective
Create the independent Analyst who produces ALL scores.

### Key Design Principle
> The Analyst is SEPARATE. They did NOT participate in debates. Fresh eyes.

### Implementation

**File:** `/workspaces/Suno/services/analystAgent.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StructuralScanResult } from './structuralScanService';
import { JudgeSummary } from './judgeAgent';

export interface ScoreBreakdown {
  category: string;
  score: number;
  reasoning: string;
  evidence: string[];
  improvementPotential: number;
}

export interface LineImprovement {
  lineNumber: number;
  original: string;
  suggestion: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DeepAnalysisReport {
  scoreBreakdown: ScoreBreakdown[];
  overallScore: number;
  
  storyArcAnalysis: {
    structure: string;
    emotionalJourney: string[];
    tensionPoints: number[];
    characterConsistency: number;
  };
  
  imageryAudit: {
    concreteObjects: string[];
    sensoryDetails: string[];
    abstractVsConcrete: number;
    cinemaScore: number;
  };
  
  lineByLineImprovements: LineImprovement[];
  
  dnaMatchInsights: {
    structuralLessons: string[];
    thematicParallels: string[];
    whatToAdopt: string[];
    whatToAvoid: string[];
  };
  
  phoneticAnalysis: {
    consonantClusterIssues: Array<{line: number; issue: string}>;
    vowelFlowScore: number;
    breathPointRecommendations: number[];
    singabilityScore: number;
  };
  
  // Validation of Judge decisions
  judgeDecisionValidation: Array<{
    judgeMandate: string;
    analystAgreement: 'agree' | 'challenge' | 'partial';
    reasoning: string;
    scoreImpact: number;
  }>;
}

const SCORING_CATEGORIES = [
  'Lyrical Originality',
  'Narrative Arc',
  'Imagery & Sensory Detail',
  'Thematic Cohesion',
  'Emotional Impact',
  'Vocal Playability',
  'Melodic & Phonetic Flow',
  'Sonic Density',
  'Structure & Pacing',
  'Commercial Potential',
];

export async function analyzeAsPhD(
  lyrics: string,
  structuralScan: StructuralScanResult,
  judgeSummary: JudgeSummary,
  genAI: GoogleGenerativeAI
): Promise<DeepAnalysisReport> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.0-pro' });
  
  const prompt = `You are a PhD Musicologist with expertise in lyric analysis.
  
You are analyzing these lyrics with FRESH EYES. You did NOT participate in any debate.
Your job is to provide INDEPENDENT, SCHOLARLY analysis.

## LYRICS
${lyrics}

## DNA MATCH
Song: ${structuralScan.dnaMatch.songTitle} by ${structuralScan.dnaMatch.artist}
Match: ${structuralScan.dnaMatch.matchPercentage}%
Structure: ${structuralScan.structure.format}

## JUDGE'S DECISIONS (from earlier debate)
${judgeSummary.decisions.map(d => `- ${d.topic}: ${d.ruling}`).join('\n')}

---

Your analysis must include:

### 1. SCORE BREAKDOWN (10 categories, 1-10 each)
${SCORING_CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join('\n')}

For each score, provide:
- The score (1-10)
- Detailed reasoning (cite specific lines)
- Evidence (exact phrases)
- Improvement potential (how many points could be gained)

### 2. STORY ARC ANALYSIS
- Narrative structure (rising action, climax, etc.)
- Emotional journey (map the feelings)
- Tension points (which line numbers)
- Character consistency (1-10)

### 3. IMAGERY AUDIT
- List all concrete objects
- List all sensory details
- Calculate abstract vs concrete ratio
- Cinema score (how visual is this? 1-10)

### 4. LINE-BY-LINE IMPROVEMENTS
For each line that could be better:
- Line number and original text
- Suggested improvement
- Rationale
- Priority (high/medium/low)

### 5. DNA MATCH INSIGHTS
- What structural lessons from the reference?
- Thematic parallels?
- What to adopt?
- What to avoid?

### 6. PHONETIC ANALYSIS
- Consonant cluster issues (hard to sing)
- Vowel flow score (1-10)
- Where should breath marks go?
- Singability score (1-10)

### 7. JUDGE DECISION VALIDATION
For each Judge mandate, state whether you:
- AGREE: The mandate is sound
- CHALLENGE: The mandate may hurt the song
- PARTIAL: Some aspects are good, others concerning

Return as JSON matching the DeepAnalysisReport schema.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse analyst report');
  
  const report = JSON.parse(jsonMatch[0]) as DeepAnalysisReport;
  
  // Calculate overall score
  report.overallScore = report.scoreBreakdown.reduce((sum, s) => sum + s.score, 0) / 10;
  
  return report;
}
```

### Acceptance Criteria
- [ ] `analystAgent.ts` created
- [ ] Uses Gemini 3.0 Pro
- [ ] Produces all 10 category scores
- [ ] Story arc analysis included
- [ ] Imagery audit included
- [ ] Line-by-line improvements
- [ ] DNA insights
- [ ] Phonetic analysis
- [ ] Judge decision validation
- [ ] ~4-5 seconds execution time

---

## 📋 Phase 5: Planner Agent Update (1-2 days)

### Objective
Update existing Planner to integrate all new inputs.

### Implementation

**File:** Update `/workspaces/Suno/services/` planner functionality

Key changes:
- Input: Analyst report + Judge summary + lyrics + DNA
- Output: DraftExecutionPlan with rhyme dependencies
- Add few-shot examples
- NO auto-execution

See BOARD_DIRECTIVE_v5_FINAL.md for complete schema.

### Acceptance Criteria
- [ ] Planner receives all inputs
- [ ] Rhyme dependency groups calculated
- [ ] Few-shot examples included
- [ ] Status always 'draft'
- [ ] ~3-4 seconds execution

---

## 🎖️ Phase 6: War Room UI (2 days)

### Objective
Create the user approval interface.

### Components Needed

1. **DraftPlanDisplay.tsx**
   - Shows prioritized changes
   - Per-change approve/veto toggles
   - Rhyme warnings

2. **ChangeCard.tsx**
   - Single change with before/after
   - Source attribution
   - Impact estimate

3. **ManualInstructionInput.tsx**
   - User adds custom instructions
   - Planner reconsider button

### Acceptance Criteria
- [ ] All plan changes visible
- [ ] Approve/veto per change
- [ ] Rhyme warnings display
- [ ] Manual instruction input
- [ ] Execute button (explicit action)

---

## ✍️ Phase 7: Two-Pass Rewrite (1 day)

### Objective
Implement the two-pass rewrite system.

### Passes

1. **Pass 1: The Mason**
   - Apply approved line changes
   - Honor rhyme dependencies
   - Maintain syllable counts

2. **Pass 2: The Decorator**
   - Add [Breath] marks
   - Add (Ad-libs)
   - DO NOT change words

### Acceptance Criteria
- [ ] Pass 1 changes lyrics correctly
- [ ] Pass 2 adds furniture only
- [ ] Words not changed in Pass 2
- [ ] Few-shot examples used

---

## ✅ Phase 8: Auditor & Testing (1-2 days)

### Objective
Validate rewrites and test entire pipeline.

### Auditor Checks
- Rhyme integrity
- Syllable drift (<20%)
- All approved changes applied

### Testing
- Unit tests for each service
- Integration test for full pipeline
- Performance benchmarks (target: ~32s total)

### Acceptance Criteria
- [ ] Auditor validation works
- [ ] Warning badges display
- [ ] All unit tests pass
- [ ] Integration test passes
- [ ] Performance within target

---

## 📅 Implementation Order

Based on dependencies:

```
Week 1:
├── Day 1: Phase 1 (Structural Scan)
├── Day 2-3: Phase 2 (Real Debate Engine)
├── Day 4: Phase 3 (Judge Agent)
└── Day 5: Phase 4 (Analyst Agent - Part 1)

Week 2:
├── Day 6: Phase 4 (Analyst Agent - Part 2)
├── Day 7-8: Phase 5 (Planner Update)
├── Day 9-10: Phase 6 (War Room UI)
└── Day 11: Phase 7 (Two-Pass Rewrite)

Week 3:
├── Day 12-13: Phase 8 (Auditor & Testing)
└── Day 14-16: Polish & Deploy
```

---

## 🚀 Ready to Begin

**Starting Point:** Phase 1 - Structural Scan Service

**First File to Create:** `/workspaces/Suno/services/structuralScanService.ts`

**Command to verify Gemini setup:**
```bash
grep -r "GEMINI" /workspaces/Suno/.env* 2>/dev/null | head -5
```

---

**END OF PART 3 (v5 FINAL)**
