# PHASE 2: Audio Player Visual Specifications

## 1. MiniPlayer

### Animated Gradient Border
- **Gradient:** `linear-gradient(90deg, #22D3EE 0%, #A855F7 50%, #22D3EE 100%)`
- **Animation:** Background position slide (200% width), 8s duration, linear, infinite loop.
- **Thickness:** 2px (top border only).
- **Glow:** `box-shadow: 0 -4px 15px -2px rgba(34, 211, 238, 0.4)` (pulsing opacity 0.4 ↔ 0.6 on beat).

### Album Art 3D Hover
- **Transform:** `perspective(1000px) rotateY(12deg) rotateX(4deg) scale(1.05)`
- **Transition:** 400ms `cubic-bezier(0.34, 1.56, 0.64, 1)` (Spring-like overshoot).
- **Shadow:** `box-shadow: -12px 12px 24px rgba(0, 0, 0, 0.4)` (Directional shadow opposite to rotation).
- **Reflection:** Overlay `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)` to simulate glass surface.

### Waveform Visualization
- **Bar Shape:** `rounded-full` (Pill shape).
- **Gap:** 2px.
- **Min Height:** 4px (prevents disappearance).
- **Gradient:** Bottom-to-top `linear-gradient(to top, #22D3EE 0%, #818CF8 50%, #A855F7 100%)`.
- **Animation:** Framer Motion `layout` prop with `type: "spring", stiffness: 300, damping: 25` for snappy but smooth movement.
- **Beat Reaction:** Scale Y 1.2 on kick drum frequencies (simulated or analyzed).

### Progress Bar
- **Track:** 4px height, `bg-slate-700/50`.
- **Thumb:** 12px circle, `bg-white`, `shadow-[0_0_10px_rgba(255,255,255,0.5)]`. Hidden by default, visible on hover/drag.
- **Active Portion:** `linear-gradient(90deg, #22D3EE, #A855F7)`.
- **Hover:** Track expands to 6px height, thumb scales from 0 to 1. Transition 200ms `ease-out`.

### Volume Popup
- **Animation:** Slide up `translateY(8px) → 0`, Fade `opacity 0 → 1`. Duration 200ms `cubic-bezier(0.2, 0, 0, 1)`.
- **Position:** Bottom-aligned with volume icon, offset 16px upwards.
- **Backdrop:** `bg-slate-900/90` with `backdrop-blur-md` and `border border-white/10`.
- **Slider:** Vertical orientation, 96px height.

### Rationale
- **Spring Physics:** Using spring transitions for the album art makes it feel physical and tactile, not just a CSS transform.
- **Directional Shadow:** Moving the shadow opposite to the rotation reinforces the 3D perspective.
- **Pill Waveforms:** Rounded tips look more modern and friendly than sharp digital bars, matching the app's rounded UI.

---

## 2. FullPlayerView

### Dynamic Background
- **Composition:** 3 radial gradients.
- **Animation:** "Breathing" effect - scale 1.0 ↔ 1.2, opacity 0.1 ↔ 0.2. Duration 6s ease-in-out infinite.
- **Darkening:** `bg-slate-950/85` overlay to ensure lyric text passes WCAG AAA contrast.
- **Position Shift:** Slow drift (20px range) to avoid static feeling.

### Vinyl Disc Design
- **Grooves:** `repeating-radial-gradient(#111 0, #111 2px, #222 3px, #222 4px)`. Opacity 0.6.
- **Shadow:** Layered depth: `0 20px 50px rgba(0,0,0,0.6), 0 10px 20px rgba(0,0,0,0.4)`.
- **Rotation:** 20s per revolution, linear.
- **Tone Arm:** Rotates from 25deg (start) to 45deg (end) mapped to track progress.
- **Reflection:** `conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.1) 20%, transparent 40%)` rotating counter-clockwise to simulate light source.

### Frequency Spectrum Visualizer
- **Bar Shape:** `rounded-t-sm`.
- **Gap:** 1px (tight packing for high fidelity).
- **Gradient:** `linear-gradient(to top, #22D3EE 0%, #C084FC 50%, #F472B6 100%)`.
- **Reflection:** `transform: scaleY(-1)` with `mask-image: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)`.
- **Glow:** `filter: drop-shadow(0 -4px 8px rgba(192, 132, 252, 0.3))`.

### Synced Lyrics
- **Active Line:** Scale 1.05, Color `#FFFFFF`, `text-shadow: 0 0 20px rgba(255,255,255,0.2)`.
- **Inactive Lines:** Scale 1.0, Color `#94A3B8`, `filter: blur(0.8px)`.
- **Transition:** 300ms `ease-out`.
- **Scroll:** Smooth scroll with `behavior: 'smooth'` centering the active line.

### Advanced Controls
- **Play Button:** 64px circle, `bg-gradient-to-br from-cyan-400 to-purple-500`.
- **Hover:** Scale 1.1, `box-shadow: 0 0 30px rgba(34, 211, 238, 0.4)`.
- **Secondary Buttons:** 40px circle, `bg-white/5`. Hover `bg-white/10`.
- **Active State (Shuffle/Repeat):** Icon color `#22D3EE`, `bg-cyan-400/10`, `box-shadow: inset 0 0 0 1px rgba(34, 211, 238, 0.3)`.

### Rationale
- **Vinyl Skeuomorphism:** The detailed grooves and tone arm movement provide a nostalgic, tangible anchor in a digital interface.
- **Blurred Inactive Lyrics:** Helps focus the user's eye strictly on the current line, reducing cognitive load during karaoke/sing-along.

---

## 3. Audio Generation Tab

### Model Selector Cards
- **Unselected:** Border `1px solid rgba(255,255,255,0.08)`, bg `transparent`.
- **Selected:** Border `1px solid #A855F7`, bg `rgba(168, 85, 247, 0.08)`, `box-shadow: 0 0 20px rgba(168, 85, 247, 0.15)`.
- **Hover (Unselected):** Scale 1.02, Border `rgba(255,255,255,0.2)`, `translateY(-2px)`.
- **Badge (V5):** Gradient `bg-gradient-to-r from-pink-500 to-rose-500`. Text white, 10px bold. Pulse animation `opacity 0.8 ↔ 1.0`.

### Instrumental Toggle
- **Dimensions:** 48px width × 26px height.
- **Active Color:** `#A855F7` (Purple-500).
- **Thumb:** 20px circle, white.
- **Animation:** Spring transition `stiffness: 500, damping: 30`.
- **Label:** "Instrumental" text to the left, `text-sm font-medium text-slate-300`.

### Live Preview Card
- **Entrance:** `initial={{ opacity: 0, y: 20 }}` `animate={{ opacity: 1, y: 0 }}`.
- **Update:** Crossfade content (150ms).
- **Elevation:** `shadow-xl` (`0 20px 25px -5px rgba(0, 0, 0, 0.2)`).
- **Border:** Top border `1px solid rgba(255,255,255,0.1)`.

### Epic Generate Button
- **Gradient:** `linear-gradient(135deg, #22D3EE 0%, #A855F7 50%, #F472B6 100%)`.
- **Shine Effect:** Overlay `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)`.
- **Shine Animation:** Translate X from -100% to 200%, duration 3s, repeat delay 5s.
- **Hover:** Scale 1.02, `box-shadow: 0 0 40px rgba(168, 85, 247, 0.5)`.
- **Click:** Scale 0.96 (tactile feedback).
- **Loading:** Text changes to "Generating...", gradient animates (background-size 200%, position shift).

### Rationale
- **Epic Button:** The generate button is the primary action. The "shine" effect draws attention to it periodically without being annoying.
- **Purple Identity:** Using Purple (#A855F7) for selection states distinguishes "creation mode" from the "playback mode" (Cyan/Blue).

---

## 4. Animation Timing & Easing

### Waveform Updates
- **Frame Rate:** 60fps (Desktop), 30fps (Mobile - throttled).
- **Easing:** `type: "spring", stiffness: 300, damping: 25`.
- **Behavior:** Independent bar scaling for organic "dancing" feel.

### Vinyl Spin
- **Duration:** 20s per revolution.
- **Easing:** `linear`.
- **Pause/Play:** Accelerate/Decelerate duration 0.8s `ease-out` (simulates motor torque).

### Tab Switching
- **Transition:** Slide & Fade.
- **Duration:** 300ms.
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design standard).

### Modal Open/Close
- **Entrance:** Scale 0.95 → 1.0, Opacity 0 → 1.
- **Duration:** 400ms.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Expo Out - very smooth landing).

---

## 5. Color Palette Refinement

### Audio Visualization
- **Waveform Gradient:** Start `#22D3EE` (Cyan-400) → End `#A855F7` (Purple-500).
- **Spectrum Gradient:** Start `#22D3EE` → Middle `#C084FC` (Purple-400) → End `#F472B6` (Pink-400).
- **Idle Color:** `#334155` (Slate-700) at 50% opacity.

### Player Controls
- **Active:** `#22D3EE` (Cyan-400).
- **Hover:** `#E2E8F0` (Slate-200).
- **Disabled:** Opacity 0.3.

### Model Cards
- **V3.5:** Accent `#60A5FA` (Blue-400).
- **V4:** Accent `#A855F7` (Purple-500).
- **V5:** Accent `#F43F5E` (Rose-500).
