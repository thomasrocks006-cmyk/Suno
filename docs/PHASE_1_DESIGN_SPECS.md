# 🎨 PHASE 1: COMPONENT VISUAL SPECIFICATIONS
## Design Review Output from Gemini 3.0 Pro

**Review Date:** November 24, 2025  
**Reviewer:** Gemini 3.0 Pro (Preview)  
**Environment:** Dark Mode (#020617 background)

---

## 1. SongMetadataCard.tsx

### Spacing
- **Album art size:** 120px × 120px (desktop), 80px × 80px (mobile)
- **Album art → Title:** 16px (horizontal on desktop, vertical on mobile)
- **Title → Style prompt:** 8px
- **Style prompt → Badges:** 16px
- **Badge gap:** 8px
- **Padding:** 24px (internal card padding)

### Typography
- **Title:** 20px / 28px line-height / font-weight 700 (Bold) / color: #F8FAFC (Slate-50)
- **Style prompt:** 14px / 20px line-height / font-weight 400 (Regular) / color: #9CA3AF (Gray-400)
- **Badges:** 12px / 16px line-height / font-weight 500 (Medium) / padding: 4px 10px / radius: 999px

### States
- **Default:** `bg-slate-900/50` (#0F172A at 50%), `border-white/5`, `backdrop-blur-sm`
- **Hover:** `bg-slate-800/50`, `border-white/10`, `shadow-xl` (0 20px 25px -5px rgba(0,0,0,0.1)), `scale(1.01)`, transition 200ms `cubic-bezier(0.4, 0, 0.2, 1)`
- **Loading:** Skeleton pulse animation (opacity: 0.5 ↔ 1) on gray blocks (#1E293B), duration 1.5s infinite linear

### Rationale
- **120px Art:** Large enough to appreciate generative details but compact enough to leave room for metadata.
- **8px Title/Prompt Gap:** Keeps the song identity (Title) and its sonic character (Style) visually connected.
- **Badge Radius 999px:** Fully rounded pills distinguish metadata tags from interactive buttons (which usually have smaller radii).

---

## 2. LyricsView.tsx

### Spacing
- **Section Headers (Verse/Chorus):** Margin-top: 32px, Margin-bottom: 12px
- **Lyric Lines:** Margin-bottom: 8px (paragraph spacing)
- **Container Padding:** 24px all sides
- **Copy Button:** Positioned absolute, top: 16px, right: 16px

### Typography
- **Section Headers:** 11px / 16px line-height / font-weight 700 / letter-spacing: 0.05em (uppercase) / color: #64748B (Slate-500)
- **Lyric Lines:** 16px / 28px line-height (1.75 ratio) / font-weight 400 / color: #E2E8F0 (Slate-200)
- **Inactive/Past Lines:** Color: #475569 (Slate-600)

### States
- **Default:** Clean text, no background.
- **Editing (SmartLineEditor):** `bg-indigo-500/10`, `border-l-2 border-indigo-500`, `padding-left: 12px` (compensate for border).
- **Saved (Success):** Flash background #22C55E at 10% opacity for 300ms, then fade out.

### Micro-interactions
**Copy Button:**
- **Default:** Icon color #9CA3AF.
- **Hover:** `bg-white/10`, `rounded-md`, transition 150ms.
- **Click:** Icon transforms to Checkmark (`scale(1.2)` → `scale(1)`), color #4ADE80 (Green-400). Reverts after 2000ms.

### Rationale
- **1.75 Line Height:** Crucial for readability when lyrics are being sung/read quickly.
- **Uppercase Headers:** Visually distinct from the lyrics themselves, acting as structural anchors.

---

## 3. TabNavigation.tsx

### Spacing
- **Tab Gap:** 32px (using underline style)
- **Tab Padding:** 12px vertical, 4px horizontal (hit area)

### Typography
- **Active Tab:** 14px / font-weight 600 / color: #F8FAFC (White)
- **Inactive Tab:** 14px / font-weight 500 / color: #9CA3AF (Gray-400)

### States
- **Active:** Bottom border: 2px solid #38BDF8 (Sky-400), bottom-offset: -1px
- **Inactive:** No border
- **Hover (Inactive):** Color shifts to #E2E8F0 (Slate-200), transition 150ms ease
- **Disabled:** Opacity 0.3, cursor-not-allowed

### Micro-interactions
**Switching:**
- **Indicator:** The colored underline slides to the new position
- **Duration:** 250ms
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Content:** Crossfade (Opacity 0 → 1, `translateY(4px)` → 0) duration 200ms

### Rationale
- **Sliding Underline:** Provides a sense of physical continuity and spatial relationship between views.
- **Color Shift:** White vs. Gray-400 provides sufficient contrast (approx 4.5:1 difference) to clearly indicate state without relying solely on the underline.

---

## 4. ScoreBreakdown.tsx (Score Cards)

### Spacing
- **Card Dimensions:** Flexible width (grid), min-height 100px
- **Grid Gap:** 12px
- **Internal Padding:** 16px

### Typography
- **Score Number:** 32px / 32px line-height / font-weight 700 / tabular-nums
- **Category Label:** 12px / 16px line-height / font-weight 600 / color: #9CA3AF
- **Reasoning Text:** 13px / 20px line-height / color: #CBD5E1

### Color Coding (Accessibility Polish)
- **0-3 (Poor):** Text #F87171 (Red-400), Bg #450A0A (Red-950)
- **4-6 (Fair):** Text #FBBF24 (Amber-400), Bg #451A03 (Amber-950)
- **7-8 (Good):** Text #A3E635 (Lime-400), Bg #1A2E05 (Lime-950)
- **9-10 (Excellent):** Text #22D3EE (Cyan-400), Bg #083344 (Cyan-950)

**Note:** Use colored text for the score number and a subtle 10% opacity background for the card.

### States & Expansion
- **Collapsed:** Height ~100px. Shows Score + Label + 1 line of summary.
- **Expanded:** Max-height 300px (scroll if needed). Shows full reasoning.

**Animation:**
- **Open:** Height transitions from auto (~100px) to measure (~200px). Duration 300ms, `cubic-bezier(0.4, 0, 0.2, 1)`
- **Chevron:** Rotates 180deg

### Rationale
- **Tabular Nums:** Ensures score numbers align vertically if stacked.
- **Color/Bg Pairing:** Using a dark background of the same hue as the text improves perceived brightness and reinforces the status without being blindingly bright in dark mode.

---

## 5. Toggle Switches (AdvancedOptionsSection)

### Dimensions
- **Track:** 44px width × 24px height
- **Thumb:** 20px diameter
- **Padding:** 2px (space between thumb and track edge)

### Colors
- **Active Track:** #3B82F6 (Blue-500)
- **Inactive Track:** #334155 (Slate-700)
- **Thumb:** #FFFFFF (White)

### Animation
- **Thumb Slide:** Duration 200ms, `cubic-bezier(0.4, 0, 0.2, 1)`
- **Track Color:** Duration 200ms linear
- **Interaction:** No bounce needed for standard toggles; crispness is preferred for settings

### Rationale
- **44px Width:** Standard touch target size (even on desktop, it feels substantial).
- **2px Padding:** Creates a "contained" look for the thumb, which is more modern than the thumb overhanging the track.

---

## 6. VariationsView (Variation Cards)

### Spacing
- **Card Size:** 100% width of column
- **Gap:** 16px

### States
- **Unselected:** Border 1px solid #334155 (Slate-700), bg transparent
- **Selected:** Border 1px solid #38BDF8 (Sky-400), bg #0EA5E9/10 (Sky-500 at 10%), Box-shadow 0 0 0 1px #38BDF8
- **Hover (Unselected):** Border #94A3B8 (Slate-400), `translateY(-2px)`, `shadow-lg`

### Empty State
- **Icon:** 48px stroke-width 1.5, color #475569
- **Text:** "No variations generated yet." (14px, #9CA3AF)
- **CTA:** Button "Generate Variations" (Primary Blue)

### Rationale
- **Selected State:** Uses both border color and background tint to ensure the active item is unmistakable, even for color-blind users (due to contrast difference).

---

## 7. Accessibility Polish

### Focus Indicators
- **Ring:** 2px solid
- **Color:** #38BDF8 (Sky-400)
- **Offset:** 2px (ensures ring doesn't overlap border)
- **Property:** `outline: none; ring-2 ring-sky-400 ring-offset-2 ring-offset-[#020617]`

### Error States
**Failed Metadata:**
- **Border:** 1px solid #EF4444 (Red-500)
- **Icon:** Exclamation Circle (#EF4444)
- **Text:** "Failed to load." (#FCA5A5)
- **Retry Button:** Small, ghost button style, text-only

### Contrast Checks
- All text colors specified (#9CA3AF, #64748B, #F8FAFC) have been selected to pass WCAG AA on #020617 background.
- **Critical:** Avoid using #4B5563 (Gray-600) for body text; it fails on slate-950. Use #9CA3AF (Gray-400) minimum.

---

## IMPLEMENTATION NOTES

### CSS Custom Properties to Define
```css
:root {
  /* Spacing Scale */
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* Typography */
  --text-xs: 11px;
  --text-sm: 12px;
  --text-base: 14px;
  --text-lg: 16px;
  --text-xl: 20px;
  --text-2xl: 32px;
  
  /* Colors (Slate) */
  --slate-50: #F8FAFC;
  --slate-200: #E2E8F0;
  --slate-400: #9CA3AF;
  --slate-500: #64748B;
  --slate-600: #475569;
  --slate-700: #334155;
  --slate-800: #1E293B;
  --slate-900: #0F172A;
  --slate-950: #020617;
  
  /* Colors (Sky/Cyan) */
  --sky-400: #38BDF8;
  --cyan-400: #22D3EE;
  --cyan-950: #083344;
  
  /* Colors (Status) */
  --red-400: #F87171;
  --red-500: #EF4444;
  --red-950: #450A0A;
  --amber-400: #FBBF24;
  --amber-950: #451A03;
  --lime-400: #A3E635;
  --lime-950: #1A2E05;
  --green-400: #4ADE80;
  --green-500: #22C55E;
  
  /* Timing */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Key Takeaways for Claude (Implementation Phase)
1. **Use exact hex values** - no more generic "gray" or "blue"
2. **Spacing is 8px-based** - 8/12/16/24/32px grid
3. **Transitions are 150-300ms** - with cubic-bezier easing
4. **Focus rings are 2px Sky-400** - consistent across all interactive elements
5. **Color coding is semantic** - Red (poor) → Amber (fair) → Lime (good) → Cyan (excellent)

---

## NEXT STEPS

1. **Claude:** Implement these specs in the component refactoring (Phase 1, Days 1-3)
2. **Gemini (Next):** Review Phase 2 (Audio Player) for visual polish
3. **Validation:** Build a Storybook or visual regression suite to verify these specs
