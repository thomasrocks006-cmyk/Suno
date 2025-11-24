# PHASE 3: Design System Specifications

## 1. Complete Color Palette

### Primary (Interactive)
*Based on the Sky/Cyan identity established in Phase 1.*
- **primary-400:** `#7DD3FC` (Hover state - lighter, more luminous)
- **primary-500:** `#38BDF8` (Main Brand Color - Sky-400)
- **primary-600:** `#0284C7` (Pressed/Active state - Sky-600)
- **primary-gradient:** `linear-gradient(135deg, #22D3EE 0%, #A855F7 100%)` (Cyan-400 to Purple-500)

### Secondary (Supporting)
*Based on the Purple accents used in the Audio Player.*
- **secondary-400:** `#C084FC` (Hover - Purple-400)
- **secondary-500:** `#A855F7` (Main - Purple-500)
- **secondary-600:** `#7E22CE` (Pressed - Purple-700)

### Accent (Highlights)
- **accent-400:** `#F472B6` (Pink-400 - used for "New" or special highlights)
- **accent-500:** `#EC4899` (Pink-500)

### Status Colors
*WCAG AA compliant text colors on dark backgrounds.*
- **Success (Green):**
  - 300: `#86EFAC` (Text/Icon)
  - 500: `#22C55E` (Border/Graphic)
  - 900: `#14532D` (Background tint)
- **Warning (Amber):**
  - 300: `#FCD34D` (Text/Icon)
  - 500: `#F59E0B` (Border/Graphic)
  - 900: `#78350F` (Background tint)
- **Error (Red):**
  - 300: `#FCA5A5` (Text/Icon)
  - 500: `#EF4444` (Border/Graphic)
  - 900: `#7F1D1D` (Background tint)
- **Info (Blue):**
  - 300: `#93C5FD` (Text/Icon)
  - 500: `#3B82F6` (Border/Graphic)
  - 900: `#1E3A8A` (Background tint)

### Neutral Grays (Slate Scale)
- **gray-50:** `#F8FAFC` (Light Theme Bg / Dark Theme Text High-Emphasis)
- **gray-100:** `#F1F5F9`
- **gray-200:** `#E2E8F0` (Dark Theme Text Medium-Emphasis)
- **gray-300:** `#CBD5E1` (Dark Theme Text Low-Emphasis)
- **gray-400:** `#9CA3AF` (Placeholder / Muted Text - WCAG AA Large)
- **gray-500:** `#64748B` (Disabled Text / Icons)
- **gray-600:** `#475569` (Borders - Subtle)
- **gray-700:** `#334155` (Borders - Strong)
- **gray-800:** `#1E293B` (Card Bg - Elevated)
- **gray-900:** `#0F172A` (Card Bg - Default)
- **gray-950:** `#020617` (App Background)

### Semantic Mappings (Dark Theme)
- **text-primary:** `#F8FAFC` (Slate-50)
- **text-secondary:** `#9CA3AF` (Slate-400)
- **text-tertiary:** `#64748B` (Slate-500)
- **text-disabled:** `#475569` (Slate-600)
- **border-default:** `rgba(255, 255, 255, 0.08)`
- **border-hover:** `rgba(255, 255, 255, 0.15)`
- **border-focus:** `#38BDF8` (Sky-400)
- **bg-app:** `#020617` (Slate-950)
- **bg-card:** `rgba(255, 255, 255, 0.03)`
- **bg-overlay:** `rgba(2, 6, 23, 0.8)` (Slate-950 at 80%)

---

## 2. Typography System

### Font Scale
| Token | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| **text-2xs** | 10px | 12px | Micro labels, legal text |
| **text-xs** | 11px | 16px | Section headers (uppercase), badges |
| **text-sm** | 12px | 16px | Secondary labels, timestamps |
| **text-base** | 14px | 20px | Body text, inputs, buttons |
| **text-lg** | 16px | 24px | Lyrics, emphasized body |
| **text-xl** | 20px | 28px | Card titles, subheaders |
| **text-2xl** | 24px | 32px | Modal headers, major stats |
| **text-3xl** | 32px | 40px | Score numbers, hero titles |
| **text-4xl** | 40px | 48px | Page titles |

### Line Heights
- **leading-none:** `1` (Headings, Scores)
- **leading-tight:** `1.25` (Card Titles)
- **leading-normal:** `1.5` (Body Text)
- **leading-relaxed:** `1.75` (Lyrics - optimized for readability)

### Font Weights
- **font-regular:** `400` (Body, Inputs)
- **font-medium:** `500` (Buttons, Badges, Tabs)
- **font-semibold:** `600` (Section Headers, Active States)
- **font-bold:** `700` (Page Titles, Scores)

### Letter Spacing
- **tracking-tight:** `-0.025em` (Headings > 20px)
- **tracking-normal:** `0` (Body)
- **tracking-wide:** `0.05em` (Uppercase Labels/Headers)

---

## 3. Spacing System

### Scale with Usage
- **space-0:** `0px`
- **space-1:** `4px` (Icon-to-text gap, tight grouping)
- **space-2:** `8px` (Lyric line gap, badge internal padding)
- **space-3:** `12px` (Grid gaps, card internal separation)
- **space-4:** `16px` (Standard padding, component separation)
- **space-5:** `20px` (Large button padding)
- **space-6:** `24px` (Card padding, section spacing)
- **space-8:** `32px` (Major section gaps, modal padding)
- **space-10:** `40px` (Layout columns)
- **space-12:** `48px` (Page margins)
- **space-16:** `64px` (Hero section padding)

### Usage Guidelines
- **Component Padding:** `space-4` (16px) for compact, `space-6` (24px) for standard cards.
- **Stack Gap:** `space-3` (12px) for form fields, `space-2` (8px) for tight lists.
- **Grid Gap:** `space-4` (16px) standard.
- **Modal to Edge:** `space-4` (16px) minimum on mobile.

### Responsive Adjustments
- **Mobile:** Reduce `space-6` and above by one step (e.g., 24px → 20px).
- **Desktop:** Use full scale.

---

## 4. Component Variants

### A) Button Variants

**Primary Button (Gradient)**
- **Bg:** `linear-gradient(135deg, #22D3EE 0%, #A855F7 100%)`
- **Text:** `#FFFFFF` (White), font-medium.
- **Hover:** Scale `1.02`, Brightness `1.1`.
- **Active:** Scale `0.97`, Brightness `0.9`.
- **Focus:** Ring `2px` solid `#38BDF8`, offset `2px`.
- **Disabled:** Opacity `0.5`, grayscale `100%`.

**Secondary Button (Glass)**
- **Bg:** `rgba(255, 255, 255, 0.05)`
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Text:** `#F8FAFC`
- **Hover:** Bg `rgba(255, 255, 255, 0.1)`, Border `rgba(255, 255, 255, 0.2)`.
- **Active:** Bg `rgba(255, 255, 255, 0.08)`.

**Ghost Button**
- **Bg:** Transparent
- **Text:** `#9CA3AF` (Hover: `#F8FAFC`)
- **Hover:** Bg `rgba(255, 255, 255, 0.05)`.

**Danger Button**
- **Bg:** `rgba(239, 68, 68, 0.1)`
- **Text:** `#FCA5A5`
- **Border:** `1px solid rgba(239, 68, 68, 0.2)`
- **Hover:** Bg `rgba(239, 68, 68, 0.2)`, Text `#FFFFFF`.

### B) Card Elevations

**Flat (Default)**
- **Bg:** `rgba(255, 255, 255, 0.03)`
- **Border:** `1px solid rgba(255, 255, 255, 0.08)`
- **Backdrop:** `blur(12px)`
- **Shadow:** None.

**Elevated (Hover/Interactive)**
- **Bg:** `rgba(255, 255, 255, 0.07)`
- **Border:** `1px solid rgba(255, 255, 255, 0.15)`
- **Shadow:** `0 10px 30px -10px rgba(0, 0, 0, 0.5)`

**High (Modal/Dropdown)**
- **Bg:** `#0F172A` (Slate-900)
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Shadow:** `0 25px 50px -12px rgba(0, 0, 0, 0.7)`

### C) Input States

**Default**
- **Bg:** `rgba(255, 255, 255, 0.03)`
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Text:** `#F8FAFC`
- **Placeholder:** `#64748B`

**Focus**
- **Border:** `#38BDF8`
- **Ring:** `0 0 0 2px rgba(56, 189, 248, 0.2)`
- **Bg:** `rgba(255, 255, 255, 0.05)`

**Error**
- **Border:** `#EF4444`
- **Text:** `#FCA5A5` (Input text remains white, error message is red)

### D) Badge Variants

**Base Style:** `px-2 py-0.5 rounded-full text-xs font-medium border`

- **Default:** Bg `white/5`, Text `gray-300`, Border `white/10`
- **Success:** Bg `green-500/10`, Text `green-300`, Border `green-500/20`
- **Warning:** Bg `amber-500/10`, Text `amber-300`, Border `amber-500/20`
- **Error:** Bg `red-500/10`, Text `red-300`, Border `red-500/20`
- **Info:** Bg `cyan-500/10`, Text `cyan-300`, Border `cyan-500/20`
- **NEW:** Bg `linear-gradient(90deg, #F472B6, #A855F7)`, Text `white`, Border `none`, Animation `pulse`.

---

## 5. Theme Adaptations

### Light Theme (#F8FAFC)
- **bg-app:** `#F8FAFC` (Slate-50)
- **text-primary:** `#0F172A` (Slate-900)
- **text-secondary:** `#64748B` (Slate-500)
- **border-default:** `#E2E8F0` (Slate-200)
- **bg-card:** `#FFFFFF` (White)
- **shadow-card:** `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- **primary-500:** `#0EA5E9` (Sky-500 - slightly darker for contrast)

### Midnight Theme (#000000)
- **bg-app:** `#000000` (Pure Black)
- **bg-card:** `#0A0A0A` (Zinc-950)
- **border-default:** `#1F1F1F` (Zinc-900)
- **text-primary:** `#FFFFFF`
- **primary-500:** `#22D3EE` (Cyan-400 - more vibrant)
- **Contrast:** Higher contrast borders required due to lack of elevation depth.

---

## 6. Advanced Feature Designs

### History Search
- **Filter Chips:**
  - Height: `24px`
  - Radius: `4px` (Rounded-md)
  - Active: Bg `#38BDF8`, Text `#0F172A`
  - Inactive: Bg `white/5`, Text `gray-400`
- **Highlight:** Bg `rgba(250, 204, 21, 0.2)` (Yellow-400/20), Text `#FEF08A` (Yellow-200).

### Export Buttons
- **PDF Icon:** `#F87171` (Red-400)
- **JSON Icon:** `#FBBF24` (Amber-400)
- **Layout:** Icon Left (`space-2` gap), Text Right.
- **Hover:** Lift `translateY(-1px)`.

### Keyboard Shortcuts
- **Backdrop:** `rgba(0, 0, 0, 0.85)` backdrop-blur-sm.
- **Key Badge:**
  - Font: `font-mono`
  - Bg: `rgba(255, 255, 255, 0.1)`
  - Border-bottom: `2px solid rgba(255, 255, 255, 0.2)` (Simulate key depth)
  - Radius: `4px`
  - Padding: `2px 6px`

### Empty States
- **Icon:** `48px`, Color `#475569` (Slate-600).
- **Message:** `text-base`, Color `#9CA3AF` (Slate-400).
- **Spacing:** Icon → Text `16px`, Text → CTA `24px`.
