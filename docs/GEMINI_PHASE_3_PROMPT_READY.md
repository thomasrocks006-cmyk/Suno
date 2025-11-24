# 🎨 PHASE 3 DESIGN REVIEW: Design System & Polish
## Ready-to-Use Prompt for Gemini 3.0 Pro

**Copy everything below this line and paste into Gemini:**

---

You are a **design systems architect** reviewing a component library and design token system for a music generation web app.

## YOUR ROLE
You are NOT adding new components or features. You are a **design token specialist** focused on creating a consistent, scalable design system with precise color palettes, spacing scales, typography systems, and component variants.

## CONTEXT
We're creating a comprehensive design system with:
- **Component Library** (Button, Card, Input, Badge, Modal)
- **Spacing System** (4/8/12/16/24/32/48/64px scale)
- **Typography Scale** (6 sizes with line heights)
- **Color System** (Primary/Secondary/Accent + Status colors)
- **Theme System** (Dark/Light/Midnight modes)

We have Phase 1 specs that defined some colors (#38BDF8 Sky-400, #F8FAFC Slate-50, etc.). Now we need to expand and systematize these into a complete design language.

---

## ROADMAP SECTION TO REVIEW

### WEEK 5: COMPONENT LIBRARY

**Components to Define:**
1. **Button** - 4 variants (primary, secondary, ghost, danger) × 3 sizes (sm, md, lg)
2. **Card** - 3 elevations (flat, elevated, elevated-high)
3. **Input** - 3 states (default, focus, error) + label styling
4. **Badge** - 5 variants (default, success, warning, error, info)
5. **Modal** - Overlay + container + header + footer styling

**Current Implementation:**
```typescript
// Button
<motion.button
  className="px-4 py-2 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500"
  whileTap={{ scale: 0.97 }}
/>

// Card
<div className="glass-card p-4 rounded-xl">

// Input
<input className="glass-input px-4 py-3 rounded-xl" />

// Badge
<span className="px-2 py-1 text-xs rounded-full bg-white/10">
```

### WEEK 5.5-6: THEME SYSTEM

**Themes to Define:**
- **Dark** (default, #020617 background)
- **Light** (#F8FAFC background)
- **Midnight** (#000000 background, deeper dark)

**Current Color Palette (from Phase 1):**
```css
--slate-50: #F8FAFC
--slate-200: #E2E8F0
--slate-400: #9CA3AF
--slate-500: #64748B
--slate-600: #475569
--slate-700: #334155
--slate-900: #0F172A
--slate-950: #020617
--sky-400: #38BDF8
--cyan-400: #22D3EE
```

### WEEK 6.5-7: ADVANCED FEATURES

**Features Needing Design:**
1. **History Search** - Filter chips, search results highlighting
2. **Export to PDF/JSON** - Button states, modal design
3. **Keyboard Shortcuts** - Overlay design, key badge styling
4. **Empty States** - Illustrations, messaging, CTAs

---

## YOUR TASK (Design Tokens & System)

### 1. COMPLETE COLOR PALETTE

Based on Phase 1 foundation, define ALL semantic colors:

**A) Primary (Interactive Elements)**
- Primary-400: ? (lighter variant for hover)
- Primary-500: ? (main action color)
- Primary-600: ? (darker variant for active)
- Should primary be Sky-400 (#38BDF8) or create new blue?
- Gradient version: from-? to-? (for hero buttons)

**B) Secondary (Supporting Actions)**
- Secondary-400: ?
- Secondary-500: ?
- Secondary-600: ?
- Should secondary be Purple/Pink or Gray-based?

**C) Accent (Highlights/Badges)**
- Accent-400: ?
- Accent-500: ?
- Used for: Special badges, "NEW" labels, highlights

**D) Status Colors** (Expand from Phase 1's score colors)
- Success-300/400/500/600: ? (green scale)
- Warning-300/400/500/600: ? (amber scale)
- Error-300/400/500/600: ? (red scale)
- Info-300/400/500/600: ? (blue scale)

**E) Neutral Grays** (Confirm/expand Phase 1)
- Gray-50 through Gray-950 (full scale needed?)
- Which grays for: body text, muted text, borders, dividers?

**F) Semantic Mappings**
```css
--color-text-primary: ? (main text)
--color-text-secondary: ? (metadata, labels)
--color-text-tertiary: ? (captions, timestamps)
--color-text-disabled: ?
--color-border-default: ?
--color-border-focus: ?
--color-background-elevated: ? (cards, modals)
--color-background-overlay: ? (modal backdrop)
```

---

### 2. TYPOGRAPHY SYSTEM

Define complete scale with usage guidelines:

**A) Font Sizes**
```css
--text-2xs: ? (9px? 10px? for tiny labels)
--text-xs: ? (Phase 1 says 11px for section headers)
--text-sm: ? (Phase 1 says 12px for badges)
--text-base: ? (Phase 1 says 14px for body)
--text-lg: ? (Phase 1 says 16px for lyrics)
--text-xl: ? (Phase 1 says 20px for card titles)
--text-2xl: ? (Phase 1 says 32px for scores)
--text-3xl: ? (for page headers)
--text-4xl: ? (for hero text)
```

**B) Line Heights**
```css
--leading-none: 1
--leading-tight: ? (for headings)
--leading-normal: ? (for body)
--leading-relaxed: ? (Phase 1 says 1.75 for lyrics)
--leading-loose: ?
```

**C) Font Weights**
```css
--font-regular: 400
--font-medium: 500 (for badges)
--font-semibold: 600 (for tabs)
--font-bold: 700 (for headings)
```

**D) Letter Spacing**
```css
--tracking-tight: ?
--tracking-normal: 0
--tracking-wide: ? (Phase 1 says 0.05em for uppercase labels)
```

**E) Usage Matrix**
| Element | Size | Weight | Line Height | Color |
|---------|------|--------|-------------|-------|
| H1 (Page Title) | ? | ? | ? | ? |
| H2 (Section) | ? | ? | ? | ? |
| H3 (Card Title) | text-xl (20px) | bold (700) | ? | slate-50 |
| Body | text-base (14px) | regular (400) | ? | ? |
| Caption | ? | ? | ? | ? |
| Label | ? | ? | ? | ? |

---

### 3. SPACING SYSTEM

Phase 1 defined: 8/12/16/24/32px. Expand with usage rules:

**A) Full Scale**
```css
--space-0: 0
--space-1: 4px (when to use?)
--space-2: 8px (Phase 1: lyric line gap)
--space-3: 12px (Phase 1: score card gap)
--space-4: 16px (Phase 1: album art to title)
--space-5: 20px
--space-6: 24px (Phase 1: card padding)
--space-8: 32px (Phase 1: section header margin)
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

**B) Usage Guidelines**
- Component padding: space-4 (16px) or space-6 (24px)?
- Stack gap (vertical spacing): space-2/3/4?
- Grid gap: space-3 (12px confirmed from Phase 1)?
- Section spacing: space-8 (32px)?
- Modal to edge: space-4/6/8?

**C) Responsive Adjustments**
- Mobile: Reduce all spacing by 25%?
- Tablet: Keep as-is?
- Desktop: Keep as-is?

---

### 4. COMPONENT VARIANTS

For each component, define ALL visual states:

**A) Button Variants**

**Primary Button:**
- Default: gradient from-? to-? or solid?
- Hover: scale 1.02 (confirmed from Phase 1), opacity change?
- Active/Pressed: scale 0.97 (confirmed)
- Focus: ring-2 ring-? ring-offset-?
- Disabled: opacity-50, cursor-not-allowed
- Loading: spinner color? text change?

**Secondary Button (Glass):**
- Default: bg-white/10, border-white/20
- Hover: bg-white/20
- Active: bg-white/15
- Focus: same as primary?
- Disabled: opacity-30?

**Ghost Button:**
- Default: transparent
- Hover: bg-white/10
- Active: bg-white/5
- Focus: same as primary?

**Danger Button:**
- Default: gradient from-red-? to-red-?
- Hover: opacity-90
- Active: scale 0.97

**Sizes:**
- Small: px-3 py-1.5 text-sm (confirmed from Phase 1)
- Medium: px-4 py-2 text-base (confirmed)
- Large: px-6 py-3 text-lg (confirmed)

**B) Card Elevations**

**Flat (glass-card):**
- Background: bg-white/5 (confirmed from Phase 1)
- Border: border-white/10 (confirmed)
- Backdrop: backdrop-blur-xl (confirmed)
- Shadow: none?

**Elevated (glass-card-elevated):**
- Background: bg-white/10 (confirmed)
- Border: border-white/20 (confirmed)
- Shadow: shadow-2xl (0 25px 50px -12px rgba(0,0,0,?))
- Hover: should cards lift more?

**Elevated-High (for modals):**
- Background: bg-white/15?
- Border: border-white/30?
- Shadow: shadow-3xl? (custom value needed?)

**C) Input States**

**Default:**
- Background: glass-input (bg-white/5)
- Border: border-white/10
- Text: color-?
- Placeholder: color-? (Phase 1 changed to gray-500)

**Focus:**
- Border: border-sky-400 (focus color confirmed)
- Background: bg-white/10
- Ring: ring-2 ring-sky-400 ring-offset-2

**Error:**
- Border: border-red-500
- Background: bg-red-500/5?
- Text below: color-red-400, size text-xs

**Success (after save):**
- Border: border-green-500
- Flash animation duration?

**D) Badge Variants**

Phase 1 defined colors for score badges. Expand for all uses:

**Default:**
- Background: bg-white/10
- Text: text-gray-300
- Border: none or border-white/20?

**Success:**
- Background: bg-green-500/20 (confirmed)
- Text: text-green-300 (confirmed)
- Border: border-green-500/30 (confirmed)

**Warning:**
- Background: bg-amber-500/20
- Text: text-amber-300
- Border: border-amber-500/30

**Error:**
- Background: bg-red-500/20
- Text: text-red-300
- Border: border-red-500/30

**Info:**
- Background: bg-cyan-500/20
- Text: text-cyan-300
- Border: border-cyan-500/30

**NEW Badge (special):**
- Background: gradient or solid?
- Text: contrasting color?
- Animation: pulse? glow?

---

### 5. THEME ADAPTATIONS

For Light and Midnight themes, define color mappings:

**A) Light Theme (#F8FAFC background)**
- Text primary: #0F172A (dark)?
- Text secondary: #64748B?
- Border: rgba(0,0,0,0.1)?
- Card background: #FFFFFF?
- Elevated card: #F1F5F9?
- Shadow values: darker shadows needed?
- Focus ring: still Sky-400 or change to darker blue?

**B) Midnight Theme (#000000 background)**
- How different from Dark theme?
- More contrast or less?
- Border: rgba(255,255,255,0.05) (even more subtle)?
- Should colors be more vibrant to pop against pure black?

**C) Theme Toggle Component**
- Icon style: sun/moon? three circles?
- Animation when switching: crossfade duration?
- Indicator for active theme: background? underline?

---

### 6. ADVANCED FEATURE DESIGNS

**A) History Search**
- **Filter Chips:**
  - Size/padding: match badges?
  - Active chip: solid color or outlined?
  - Remove button (X): size, hover effect?
- **Search Results:**
  - Highlight matched text: background color? (yellow-400/20?)
  - Result item hover: lift effect?

**B) Export Buttons**
- Icon placement: left or right of text?
- PDF icon color: red-400 (standard PDF color)?
- JSON icon color: gray-400?
- Hover effect: different from primary button?

**C) Keyboard Shortcuts Overlay**
- Backdrop: rgba(0,0,0,0.8)?
- Key badges:
  - Background: glass or solid?
  - Border: border-white/20?
  - Font: monospace?
  - Size: text-sm?
  - Padding: px-2 py-1?

**D) Empty States**
- Icon size: 48px (confirmed from Phase 1) or larger 64px?
- Icon color: gray-600 (Phase 1) or gray-500?
- Message text: size text-base or text-lg?
- Message color: gray-400?
- CTA button: primary style?
- Spacing: icon to text, text to CTA?

---

## CONSTRAINTS (DO NOT DO THESE)

❌ **DO NOT** add new component types (no Tooltip, Popover, etc.)  
❌ **DO NOT** suggest font changes (we're using system fonts)  
❌ **DO NOT** add icon libraries (we'll handle icons separately)  
❌ **DO NOT** suggest animation libraries beyond Framer Motion  
❌ **DO NOT** redesign existing components from Phase 1/2  

## WHAT TO FOCUS ON

✅ **Exact hex values** for every color  
✅ **Exact pixel values** for every spacing increment  
✅ **Clear usage guidelines** (when to use each variant)  
✅ **Accessibility checks** (contrast ratios for all text colors)  
✅ **Semantic naming** (use purpose, not appearance)  
✅ **Theme mappings** (how colors change in Light/Midnight)  

---

## OUTPUT FORMAT

Please structure your response like this:

```markdown
## PHASE 3: Design System Specifications

### 1. Complete Color Palette

#### Primary (Interactive)
- primary-400: #60A5FA (lighter hover state)
- primary-500: #38BDF8 (main Sky-400 from Phase 1)
- primary-600: #0284C7 (pressed state)
- primary-gradient: linear-gradient(135deg, #22D3EE 0%, #A855F7 100%)

#### Secondary (Supporting)
- secondary-400: #C084FC
- secondary-500: #A855F7
- secondary-600: #9333EA

[Continue for all color categories]

#### Semantic Mappings (Dark Theme)
- text-primary: #F8FAFC (Slate-50)
- text-secondary: #9CA3AF (Gray-400, WCAG AA compliant)
- text-tertiary: #64748B (Slate-500)
- border-default: rgba(255, 255, 255, 0.1)
- border-focus: #38BDF8 (Sky-400)

---

### 2. Typography System

#### Font Scale
| Token | Size | Use Case |
|-------|------|----------|
| text-2xs | 10px | Micro labels, legal text |
| text-xs | 11px | Section headers (uppercase) |
| text-sm | 12px | Badges, tags |
| text-base | 14px | Body text, inputs |
| text-lg | 16px | Lyrics, emphasized text |
| text-xl | 20px | Card titles |
| text-2xl | 24px | Modal headers |
| text-3xl | 32px | Score numbers |
| text-4xl | 40px | Hero text |

#### Line Heights
[detailed mappings]

#### Usage Matrix
[complete table]

---

### 3. Spacing System

#### Scale with Usage
- space-1 (4px): Icon to text gap, tight spacing
- space-2 (8px): Lyric lines, badge gaps
- space-3 (12px): Grid gaps, form field stacks
- space-4 (16px): Component padding (small), element separation
- space-6 (24px): Component padding (default), section spacing
- space-8 (32px): Large section gaps, modal padding

#### Rationale
[explain 8px grid system]

---

### 4. Component Variants

[detailed specs for each component]

---

### 5. Theme Adaptations

[Light and Midnight theme color mappings]
```

---

**IMPORTANT:** Provide exact values for every token. If a value is TBD, explain what criteria should determine it.

Are you ready to provide these design system specifications?
