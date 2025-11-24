# 🎨 PHASE 1 DESIGN REVIEW: Component Refactoring
## Ready-to-Use Prompt for Gemini 3.0 Pro

**Copy everything below this line and paste into Gemini:**

---

You are a **senior UX/UI designer** reviewing a component refactoring plan for a music generation web app.

## YOUR ROLE
You are NOT a product manager or feature designer. You are a **visual design critic** focused on polish, spacing, typography, colors, and micro-interactions.

## CONTEXT
We're splitting 3 massive React components into smaller, modular pieces:
- **ResultDisplay.tsx** (1,648 lines) → 8 components
- **InputForm.tsx** (741 lines) → 5 components  
- **PersonalizationModal.tsx** (579 lines) → 4 components

The architecture is already decided. We need **visual design specifications** for these new components.

---

## ROADMAP SECTION TO REVIEW

### DAY 1-3: COMPONENT REFACTORING (24 hours)

#### 1.1 ResultDisplay.tsx Split (1,648 lines → 8 components)

**New Structure:**
```typescript
ResultDisplay.tsx (200 lines) ✅
├── SongMetadataCard.tsx (100 lines)
│   ├── Album art with hover zoom
│   ├── Title + version badge
│   ├── Style prompt with copy
│   └── Logic badges
├── LyricsView.tsx (150 lines)
│   ├── Section headers (Verse, Chorus)
│   ├── Lyric line display
│   ├── Copy button
│   └── SmartLineEditor integration
├── DeepAnalysisView.tsx (300 lines)
│   ├── ScoreBreakdown.tsx (100 lines)
│   │   ├── Score cards (6 categories)
│   │   ├── Color coding logic
│   │   └── Expandable reasoning
│   ├── SonicAnalysis.tsx (80 lines)
│   │   ├── Phonetics chart
│   │   ├── Density analysis
│   │   └── Cinema audit objects
│   ├── LineImprovements.tsx (120 lines)
│   │   ├── Old → New line display
│   │   ├── Reason explanations
│   │   └── Accept/reject actions
│   └── DNAMatchSection.tsx (150 lines)
│       ├── Real-world hit comparison
│       ├── Similarity metrics
│       └── "Discuss with Agent" integration
├── VariationsView.tsx (150 lines)
│   ├── Generate button
│   ├── Variation cards
│   ├── Copy/create version actions
│   └── Empty state
├── AudioGenerationView.tsx (200 lines)
│   ├── Model selector (cards)
│   ├── Instrumental toggle
│   ├── Generate button
│   └── Status polling display
└── TabNavigation.tsx (50 lines)
    └── Tab switcher with animations
```

#### 1.2 InputForm.tsx Split (741 lines → 5 components)

**New Structure:**
```typescript
InputForm.tsx (150 lines) ✅
├── InspirationSection.tsx (100 lines)
│   ├── Artist input
│   ├── Song input
│   └── Smart Suggest button
├── CoreParametersSection.tsx (150 lines)
│   ├── Topic/Concept
│   ├── Genre/Style + Style Builder
│   ├── Mood + Vocals
│   ├── Instruments + Selector
│   └── Structure + Syllable pattern
├── AdvancedOptionsSection.tsx (180 lines)
│   ├── Collapsible section
│   ├── 3 toggle switches (Lyric Logic, Metaphor, Commercial)
│   ├── Toggle state management
│   └── Descriptions
├── PersonalizationSection.tsx (80 lines)
│   ├── "Your World" button
│   ├── Metaphor Lab status
│   ├── Power Lines count
│   └── Modal trigger
└── QuickAddHelpers.tsx (80 lines)
    ├── Custom instructions textarea
    ├── Rhyme scheme quick-adds
    ├── Vocal tag quick-adds
    └── Assistant check button
```

#### 1.3 PersonalizationModal.tsx Split (579 lines → 4 components)

**New Structure:**
```typescript
PersonalizationModal.tsx (100 lines) ✅
├── Modal wrapper
├── Tab navigation
├── Save/Cancel buttons
└── PersonalizationContext.tsx (30 lines)
    └── Shared state for tabs
├── YourWorldTab.tsx (150 lines)
│   ├── Reference type selector
│   ├── Movie/Book/Album inputs
│   ├── Favorite artists list
│   └── Life events textarea
├── MetaphorLabTab.tsx (150 lines)
│   ├── Core metaphor input
│   ├── Extended metaphor textarea
│   ├── AI suggestion button
│   └── Examples/tips
└── PowerLinesTab.tsx (150 lines)
    ├── Power words list
    ├── Add word input
    ├── Remove word buttons
    └── Import from song feature
```

#### 2.1 Color Contrast (Accessibility)

**Current Issue:**
```css
.text-gray-500 { color: #6b7280; } /* 3.2:1 on #020617 ❌ */
.text-gray-600 { color: #4b5563; } /* 2.1:1 on #020617 ❌ */
```

**Proposed Fix:**
```css
.text-gray-400 { color: #9ca3af; } /* 4.9:1 on #020617 ✅ */
.text-gray-300 { color: #d1d5db; } /* 8.1:1 on #020617 ✅ */
```

#### 2.3 Keyboard Navigation

**Current Plan:**
```css
*:focus-visible {
  @apply ring-2 ring-suno-primary ring-offset-2 ring-offset-suno-dark;
  outline: none;
}
```

---

## YOUR TASK (Design Specifications Only)

### 1. VISUAL HIERARCHY (Spacing & Typography)

For each component, define:

**A) SongMetadataCard.tsx**
- Album art size (desktop vs mobile)?
- Spacing: Album art → Title (px)?
- Spacing: Title → Style prompt (px)?
- Spacing: Style prompt → Badges (px)?
- Typography:
  - Title: Font size / line height / weight?
  - Style prompt: Font size / color / weight?
  - Badges: Font size / padding?

**B) LyricsView.tsx**
- Section headers (Verse, Chorus):
  - Font size / weight / color?
  - Margin above section?
- Lyric lines:
  - Line height for readability?
  - Font size?
  - Color for inactive vs editable state?
- Copy button:
  - Size / position (top-right corner)?
  - Hover state?

**C) TabNavigation.tsx**
- Tab spacing (gap between tabs)?
- Active tab:
  - Font weight / size?
  - Underline thickness / color?
  - Background treatment?
- Inactive tab:
  - Opacity / color?
  - Hover state (color change? underline preview)?

**D) ScoreBreakdown.tsx (Score Cards)**
- Card dimensions (width × height)?
- Grid gap between cards (4/8/16px)?
- Score number:
  - Font size / weight?
  - Color for different score ranges (0-3/4-6/7-8/9-10)?
- Category label:
  - Font size / weight / color?
- Expandable reasoning:
  - Collapsed: Show "..." or "View reasoning" link?
  - Expanded: Max height before scroll?

**E) Toggle Switches (AdvancedOptionsSection)**
- Switch dimensions (width × height)?
- Thumb size?
- Active state color?
- Inactive state color?
- Transition duration / easing?

---

### 2. COMPONENT STATES (Define Visual Appearance)

For each component, specify:

**A) SongMetadataCard**
- **Default:** Border? Shadow? Background opacity?
- **Hover:** Scale transform? Shadow increase? Border glow?
- **Loading:** Skeleton screen style? Shimmer effect?

**B) LyricsView**
- **Default:** Line opacity? Color?
- **Editing:** Background highlight color? Border?
- **Saved (success):** Brief green flash duration? Checkmark icon?

**C) TabNavigation**
- **Active:** Underline color? Gradient? Solid?
- **Inactive:** Opacity level (50%? 70%)?
- **Hover (inactive):** Opacity increase? Color change?
- **Disabled:** How to indicate (gray out? remove entirely)?

**D) Score Cards (ScoreBreakdown)**
- **Collapsed:** Height? Visible content?
- **Expanding:** Animation duration? Easing function?
- **Expanded:** Max height? Overflow scroll style?

**E) Variation Cards (VariationsView)**
- **Unselected:** Border style? Opacity?
- **Selected:** Border color? Glow? Scale up?
- **Hover:** Lift effect (translateY)? Shadow?

---

### 3. MICRO-INTERACTIONS (Animations & Transitions)

Specify exact timing and easing:

**A) Tab Switching Animation**
- Transition type: Slide? Fade? Scale?
- Duration (ms)?
- Easing function (ease-out, cubic-bezier)?
- Should inactive tab fade out first, then active fade in? Or crossfade?

**B) Score Card Expansion**
- Duration when opening (ms)?
- Duration when closing (ms)?
- Easing (ease-in-out? spring?)?
- Should reasoning text fade in after card expands?

**C) "Copy" Button Feedback**
- On click:
  - Icon change: Copy → Checkmark?
  - Duration of checkmark display (ms)?
  - Color change (green flash)?
  - Scale pulse animation?

**D) Toggle Switch Animation**
- Thumb slide duration (ms)?
- Background color transition duration (ms)?
- Easing function?
- Should there be a subtle bounce when thumb reaches end?

**E) Badge Hover (Logic Badges)**
- Should badges react on hover?
- Scale effect (1.0 → 1.05)?
- Glow effect (box-shadow)?
- Tooltip appearance delay (ms)?

---

### 4. ACCESSIBILITY POLISH (Beyond WCAG Compliance)

**A) Focus Indicators**
- Ring thickness (2px? 3px?)?
- Ring color (cyan? blue? match primary brand?)?
- Ring offset (2px? 4px from element edge?)?
- Should focus ring be solid or have gradient?

**B) Color Coding for Scores**
- **0-3 (Poor):** Red shade (exact hex)?
- **4-6 (Fair):** Yellow/Orange shade (exact hex)?
- **7-8 (Good):** Green shade (exact hex)?
- **9-10 (Excellent):** Cyan/Vibrant shade (exact hex)?
- Should these colors have background fills or just text color?

**C) Empty States**
- VariationsView when no variations:
  - Illustration? Icon? Text message?
  - CTA button style ("Generate Variations")?
- LyricsView before lyrics generated:
  - Placeholder text? Skeleton lines?

**D) Error States**
- Failed to load song metadata:
  - Border color (red)?
  - Icon (⚠️)?
  - Retry button placement?

---

## CONSTRAINTS (DO NOT DO THESE)

❌ **DO NOT** suggest new features (no "Add voice input", "Add 3D rendering", etc.)  
❌ **DO NOT** suggest technology changes (no Three.js, shaders, WebGL)  
❌ **DO NOT** redesign the component architecture (the 8-component split is final)  
❌ **DO NOT** add new tabs or sections  
❌ **DO NOT** suggest semantic search or AI features  

## WHAT TO FOCUS ON

✅ **Exact pixel values** (16px, not "some spacing")  
✅ **Exact hex colors** (#3B82F6, not "a nice blue")  
✅ **Exact durations** (300ms, not "smooth transition")  
✅ **Easing functions** (cubic-bezier(0.4, 0, 0.2, 1), not "ease")  
✅ **Design rationale** (why 16px instead of 12px?)  
✅ **Consistency rules** (when to use 8px gap vs 16px gap?)

---

## OUTPUT FORMAT

Please structure your response like this:

```markdown
## PHASE 1: Component Visual Specifications

### 1. SongMetadataCard.tsx

#### Spacing
- Album art size: 128px × 128px (desktop), 96px × 96px (mobile)
- Album art → Title: 16px
- Title → Style prompt: 8px
- Style prompt → Badges: 12px
- Badge gap: 6px

#### Typography
- Title: 24px / 32px line-height / font-weight 600 / color: #FFFFFF
- Style prompt: 14px / 20px line-height / font-weight 400 / color: #9CA3AF
- Badges: 11px / font-weight 500 / padding: 4px 8px

#### States
- Default: border-white/10, shadow-lg, bg-white/5
- Hover: scale(1.02), shadow-2xl, border-white/20, transition 200ms ease-out
- Loading: Skeleton with shimmer gradient moving left-to-right, duration 1.5s

#### Rationale
- 16px spacing between art and title creates clear separation without feeling distant
- 24px title size is large enough for prominence but doesn't overwhelm the card
- Badges use 11px (slightly smaller than body text) to feel supplementary

---

### 2. LyricsView.tsx

[Continue with same detail level]
```

---

**IMPORTANT:** This is Phase 1 only. We'll review your specifications before moving to Phase 2 (Audio Player Design).

Are you ready to provide these visual design specifications?
