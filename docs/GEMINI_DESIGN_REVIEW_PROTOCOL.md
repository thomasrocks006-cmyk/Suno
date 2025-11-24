# 🎨 GEMINI 3.0 PRO DESIGN REVIEW PROTOCOL
## How to Get Actionable Design Feedback (Not Feature Ideas)

**Problem:** When asked to "review and enhance" long roadmaps, LLMs tend to add features rather than improve existing design.

**Solution:** Break reviews into focused, single-phase prompts with specific design questions.

---

## PHASE 1 DESIGN REVIEW PROMPT

```
You are a senior UX/UI designer reviewing a component refactoring plan.

CONTEXT:
We're splitting 3 massive React components (ResultDisplay: 1,648 lines, InputForm: 741 lines, PersonalizationModal: 579 lines) into smaller, modular components.

READ THIS SECTION:
[Paste IMPLEMENTATION_ROADMAP_PART_2_PHASES_1_2.md - Lines 1-300 only]

YOUR TASK (Design Enhancement Only):
1. **Visual Hierarchy**: For each new component (e.g., SongMetadataCard, LyricsView), suggest:
   - Optimal spacing between elements (using 8px grid)
   - Typography scale (heading sizes, line heights)
   - Color usage (when to use primary vs secondary vs muted)

2. **Component States**: Define visual states for:
   - SongMetadataCard: Default, Hover, Selected
   - LyricsView: Default, Editing, Saved
   - TabNavigation: Active, Inactive, Hover, Disabled

3. **Micro-Interactions**: Suggest subtle animations for:
   - Tab switching (slide? fade? scale?)
   - Score cards expanding (accordion behavior)
   - "Copy" button feedback (checkmark animation duration?)

4. **Accessibility Polish**: Beyond WCAG compliance:
   - Suggest focus indicator styles (color, thickness, offset)
   - Loading state designs (skeleton screens vs spinners)
   - Error message placement and styling

DO NOT:
- Add new features (voice input, 3D effects, etc.)
- Suggest technology changes (no Three.js, shaders, etc.)
- Redesign the architecture (we're keeping the 8-component split)

FOCUS ON:
- Making existing components visually polished
- Defining precise design tokens (colors, spacing, timing)
- Improving micro-interactions and transitions
```

---

## PHASE 2 DESIGN REVIEW PROMPT (Audio Player)

```
You are a motion designer and audio visualization expert.

CONTEXT:
We're redesigning the audio player with:
- MiniPlayer (bottom bar with waveform)
- FullPlayerView (immersive modal with vinyl + lyrics)
- AudioGenerationView (model selection interface)

READ THIS SECTION:
[Paste IMPLEMENTATION_ROADMAP_PART_2_PHASES_1_2.md - Lines 500-700 only]
[Paste IMPLEMENTATION_ROADMAP_PART_3_PHASES_3_4.md - Lines 1-200 only]

YOUR TASK (Visual Polish Only):
1. **Waveform Design**:
   - What colors should idle vs playing states use?
   - Should bars be rounded or sharp?
   - Gradient direction (vertical or horizontal)?
   - Gap size between bars?

2. **Vinyl Animation Refinement**:
   - The roadmap has CSS rotation. Suggest:
     - Easing function (linear? ease-in-out?)
     - Shadow depth (how many layers? opacity?)
     - Reflection effects (gradient overlay?)
     - Hover state behavior (tilt? scale? both?)

3. **Lyrics Scroll Behavior**:
   - Active line: Font weight? Size increase? Glow effect?
   - Inactive lines: Opacity level? Blur amount?
   - Scroll timing: Snap to line? Smooth scroll speed?

4. **Model Selector Cards**:
   - Unselected state: Border? Shadow? Background opacity?
   - Selected state: Gradient border? Inner glow? Scale up?
   - Hover state: Lift effect? Subtle animation?

DO NOT:
- Add 3D rendering (Three.js is overkill)
- Suggest shader-based backgrounds (performance risk)
- Add kinetic typography (complexity creep)

FOCUS ON:
- CSS/Framer Motion animations only
- Performance-friendly effects (60fps target)
- Precise timing values (300ms? 500ms? ease-out? spring?)
```

---

## PHASE 3 DESIGN REVIEW PROMPT (Design System)

```
You are a design systems architect.

CONTEXT:
We're creating a component library with: Button, Card, Input, Badge, Modal.
We need to define spacing, typography, and color systems.

READ THIS SECTION:
[Paste IMPLEMENTATION_ROADMAP_PART_3_PHASES_3_4.md - Lines 200-600]

YOUR TASK (Design Tokens):
1. **Color Palette Refinement**:
   - The roadmap mentions "cyan-400, purple-500, pink-500"
   - Define exact hex values for:
     - Primary (interactive elements)
     - Secondary (supporting actions)
     - Accent (highlights/badges)
     - Success/Warning/Error (feedback)
     - Muted text (metadata, timestamps)

2. **Typography Scale**:
   - Define sizes for: H1, H2, H3, Body, Small, Tiny
   - Specify line heights for readability
   - Suggest font weights (400, 500, 600, 700?)

3. **Spacing System**:
   - The roadmap suggests 4/8/12/16/24/32/48/64px
   - Suggest when to use each:
     - 4px: ?
     - 8px: ?
     - 16px: ?
     - 32px: ?

4. **Component Variants**:
   - Button: Size variations? Icon placement rules?
   - Card: Elevation levels (0dp, 2dp, 8dp)?
   - Input: Error state border color? Success state?

DO NOT:
- Suggest theme systems (we already have Dark/Light/Midnight)
- Add component types (no "Tooltip", "Popover", etc.)
- Redesign existing components

FOCUS ON:
- Exact values (not "use a nice blue" → "use #3B82F6")
- Design decisions with rationale
- Consistency rules across components
```

---

## PHASE 4 DESIGN REVIEW PROMPT (Polish)

```
You are a QA-focused designer reviewing edge cases.

CONTEXT:
We're preparing for launch and need to handle:
- Empty states (no songs generated yet)
- Error states (API failures)
- Loading states (generation in progress)

READ THIS SECTION:
[Paste IMPLEMENTATION_ROADMAP_PART_4_LAUNCH.md - Lines 1-400]

YOUR TASK (Edge Case Design):
1. **Empty States**:
   - SongHistorySidebar when empty: Illustration? Message? CTA?
   - ResultDisplay before first generation: What to show?
   - Personalization tabs when not filled: Placeholder design?

2. **Error States**:
   - API timeout: Modal? Toast? Inline message?
   - Audio generation failed: Retry button placement?
   - Invalid input: Field-level vs form-level errors?

3. **Loading States**:
   - Lyrics generation: Skeleton screen? Progress bar? Spinner?
   - Audio polling: Linear progress? Percentage? Time estimate?
   - History sidebar loading: Shimmer effect? Fade in?

4. **Success Feedback**:
   - "Copied to clipboard": Toast duration? Position?
   - "Song saved": Checkmark animation? Confetti?
   - "Settings updated": Subtle notification style?

DO NOT:
- Suggest new features
- Change existing component structure

FOCUS ON:
- User reassurance (never leave them wondering)
- Recovery paths (always offer next action)
- Feedback timing (how long should toasts show?)
```

---

## HOW TO USE THIS PROTOCOL

### Step 1: Choose One Phase
Don't give Gemini all 4 parts at once. Pick Phase 1 first.

### Step 2: Copy the Relevant Prompt
Use the "PHASE 1 DESIGN REVIEW PROMPT" above.

### Step 3: Paste ONLY the Relevant Roadmap Section
- For Phase 1: Give only Part 2, Lines 1-300
- For Phase 2: Give only Part 2, Lines 500-700 + Part 3, Lines 1-200
- This keeps context manageable

### Step 4: Emphasize Constraints
The key phrases are:
- "DO NOT add features"
- "FOCUS ON visual polish"
- "Specify exact values"

### Step 5: Iterate Per Phase
- Get Phase 1 feedback → Review → Move to Phase 2
- Don't try to get all phases at once

---

## EXAMPLE GOOD OUTPUT (What You Want)

```markdown
## Phase 1: Component Visual Specifications

### SongMetadataCard.tsx
**Spacing:**
- Album art to title: 16px
- Title to style prompt: 8px
- Style prompt to badges: 12px
- Badge gap: 6px

**Typography:**
- Title: 24px / 32px line-height / font-weight 600
- Style prompt: 14px / 20px / font-weight 400 / color: #9CA3AF

**Hover State:**
- Album art: scale(1.05) + shadow-xl (0 20px 25px rgba(0,0,0,0.3))
- Transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1)

**Color Logic:**
- Primary badges: bg-cyan-500/20 border-cyan-500/50 text-cyan-300
- Secondary badges: bg-purple-500/20 border-purple-500/50 text-purple-300
```

---

## EXAMPLE BAD OUTPUT (What to Reject)

```markdown
## Phase 1: Feature Enhancements

### New Feature: Voice Input for Song Metadata
Let's add a microphone button that uses speech-to-text...

### New Feature: 3D Album Art Viewer
Instead of a 2D hover effect, we should use Three.js to render...

### New Feature: AI-Generated Color Schemes
Based on the song mood, we should dynamically generate...
```

**Why it's bad:** These are features, not design polish.

---

## SUMMARY

**The Problem:** Asking "review and enhance the roadmap" is too vague.

**The Solution:** 
1. One phase at a time
2. Specific design questions
3. Explicit constraints (no features, exact values only)
4. Small context windows (300 lines max per prompt)

This forces Gemini to act as a **design critic** rather than a **product manager**.
