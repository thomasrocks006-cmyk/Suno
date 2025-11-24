# 🎨 PHASE 2 DESIGN REVIEW: Audio Player Redesign
## Ready-to-Use Prompt for Gemini 3.0 Pro

**Copy everything below this line and paste into Gemini:**

---

You are a **motion designer and audio visualization expert** reviewing an audio player redesign for a music generation web app.

## YOUR ROLE
You are NOT adding new features or technologies. You are a **visual polish specialist** focused on animation timing, color gradients, visual effects, and micro-interactions for audio components.

## CONTEXT
We're redesigning three audio player components:
- **MiniPlayer** (bottom bar with waveform visualization)
- **FullPlayerView** (immersive modal with vinyl + lyrics)
- **AudioGenerationView** (model selection interface)

The technical implementation is decided (Web Audio API, Framer Motion, CSS). We need **visual design specifications** for polish.

---

## ROADMAP SECTION TO REVIEW

### WEEK 3: MINIPLAYER REDESIGN

**Components:**
1. Animated gradient border (top edge)
2. 3D hover effect on album art
3. Waveform visualization (40 bars, 60fps)
4. Interactive progress bar (seekable)
5. Volume control popup
6. Smart context buttons

**Current Implementation:**
```typescript
// Gradient animated border
border-t-2 border-gradient-animated

// Album art with 3D hover
<motion.img
  whileHover={{ scale: 1.05, rotateY: 10 }}
  transition={{ type: 'spring' }}
/>

// Waveform bars (40 bars)
{waveform.map((height, i) => (
  <motion.div
    className="flex-1 bg-gradient-to-t from-cyan-400 to-purple-500"
    style={{ height: `${height * 100}%` }}
    animate={{ height: `${height * 100}%` }}
  />
))}

// Progress bar
<input type="range" className="w-full h-2" />
```

### WEEK 3.5-4: FULLPLAYERVIEW REDESIGN

**Components:**
1. Dynamic animated background (radial gradients)
2. 3D spinning vinyl disc with grooves
3. Frequency spectrum visualizer (64 bars, 20fps)
4. Synced lyrics with auto-scroll
5. Advanced controls (shuffle, repeat, speed, volume)

**Current Implementation:**
```typescript
// Animated background
background: `
  radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
  radial-gradient(circle at 80% 50%, rgba(192, 132, 252, 0.15) 0%, transparent 50%),
  radial-gradient(circle at 50% 80%, rgba(244, 114, 182, 0.15) 0%, transparent 50%)
`

// Vinyl rotation
<motion.div
  animate={isPlaying ? { rotate: 360 } : {}}
  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
>

// Active lyric
className={index === activeLyricIndex
  ? 'text-white font-semibold text-2xl'
  : 'text-gray-500 text-base'
}
```

### WEEK 4-4.5: AUDIO GENERATION TAB REDESIGN

**Components:**
1. Interactive model selector cards (V3.5, V4, V5)
2. Smooth animated toggle (instrumental mode)
3. Live preview card
4. Epic generate button with animations

**Current Implementation:**
```typescript
// Model cards
{models.map(model => (
  <motion.button
    className={selectedModel === model.id 
      ? 'border-purple-500 bg-purple-500/10' 
      : 'border-white/10'
    }
    whileHover={{ scale: 1.02 }}
  />
))}

// Generate button
<motion.button
  className="w-full py-6 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

---

## YOUR TASK (Visual Polish Only)

### 1. MINIPLAYER VISUAL SPECIFICATIONS

**A) Animated Gradient Border**
- Current: `border-t-2 border-gradient-animated`
- Questions:
  - Exact gradient colors (start/middle/end hex codes)?
  - Animation speed (how many seconds for full loop)?
  - Gradient angle (left-to-right? diagonal?)?
  - Should it pulse/glow when audio peaks?

**B) Album Art 3D Hover**
- Current: `scale(1.05), rotateY(10deg)`
- Questions:
  - Exact transform values (scale amount, rotation degrees)?
  - Transition duration (ms)?
  - Easing function (spring damping/stiffness values)?
  - Shadow increase on hover (shadow-xl sufficient?)?
  - Should it have a subtle glow/reflection effect?

**C) Waveform Visualization**
- Current: 40 bars, gradient from cyan-400 to purple-500
- Questions:
  - Bar shape: Rounded tops? Sharp? Pill-shaped (rounded-full)?
  - Gap between bars (1px? 2px?)?
  - Minimum bar height when idle (2px? 4px?)?
  - Gradient direction (bottom-to-top confirmed or top-to-bottom?)?
  - Exact gradient stops (cyan-400 0%, purple-500 100% or add middle color?)?
  - Animation easing when height changes (linear? ease-out?)?
  - Should bars "bounce" slightly on beat detection?

**D) Progress Bar**
- Current: `<input type="range" />`
- Questions:
  - Track height (2px confirmed or thicker for mobile?)?
  - Thumb size (hidden? 12px circle?)?
  - Active/played portion color (gradient or solid?)?
  - Hover state (show thumb? thicken track?)?
  - Transition when seeking (instant or smooth 100ms?)?

**E) Volume Popup**
- Questions:
  - Popup appearance animation (fade in? slide up?)?
  - Popup position (above icon, offset by how much?)?
  - Slider orientation (vertical or horizontal?)?
  - Slider color (match waveform gradient?)?
  - Backdrop (glass effect? solid?)?

---

### 2. FULLPLAYERVIEW VISUAL SPECIFICATIONS

**A) Dynamic Background**
- Current: 3 radial gradients at 15% opacity
- Questions:
  - Should gradients pulse/breathe during playback (expand/contract)?
  - If yes, pulse duration (2s? 4s?)?
  - Should gradient positions shift based on frequency data?
  - Exact opacity values (15% confirmed or adjust to 10%/20%?)?
  - Should background darken slightly for better lyric contrast?

**B) Vinyl Disc Design**
- Current: 12 groove rings, 20s rotation
- Questions:
  - Groove ring opacity (30% confirmed or darker?)?
  - Should grooves have a shimmer/reflection effect?
  - Vinyl disc shadow depth (how many shadow layers?)?
  - Exact shadow values (0 20px 40px rgba(0,0,0,0.5)?)?
  - Tone arm animation timing (how fast should it move?)?
  - Should vinyl have a subtle "wobble" effect based on bass?

**C) Frequency Spectrum Visualizer**
- Current: 64 bars, 20fps, gradient cyan→purple→pink
- Questions:
  - Bar shape (rounded-t-full confirmed or sharp?)?
  - Gap between bars (1px confirmed or 0px for dense look?)?
  - Gradient stops (3 colors or more? exact percentages?)?
  - Should bars have glow effect (box-shadow blur?)?
  - Reflection effect below bars (mirror with opacity gradient?)?
  - Should spectrum respond to specific frequencies (bass=thicker bars?)?

**D) Synced Lyrics**
- Current: Active line is white/2xl, inactive is gray-500/base
- Questions:
  - Active line scale (1.05 confirmed or more dramatic 1.1?)?
  - Transition duration between lines (300ms confirmed?)?
  - Should active line have a glow/shadow effect?
  - Blur effect on inactive lines (filter: blur(0.5px)?)?
  - Line height for active vs inactive (different spacing?)?
  - Fade-in animation for upcoming line (preview next line?)?

**E) Advanced Controls**
- Current: Glass buttons, gradient play button
- Questions:
  - Control button sizes (11×11 confirmed for icons?)?
  - Play button size (16×16 confirmed?)?
  - Hover effects (scale 1.05? glow?)?
  - Active state colors (shuffle/repeat when on)?
  - Speed control UI (dropdown? slider? buttons?)?
  - Volume slider appearance (match mini player?)?

---

### 3. AUDIO GENERATION TAB VISUAL SPECIFICATIONS

**A) Model Selector Cards**
- Current: Cards change border/background when selected
- Questions:
  - Unselected state:
    - Border color/thickness (white/10, 1px?)?
    - Background opacity (transparent or slight tint?)?
    - Shadow (none? subtle?)?
  - Selected state:
    - Border color (purple-500 confirmed or gradient border?)?
    - Background color/opacity (purple-500/10 confirmed?)?
    - Should it have an inner glow effect?
    - Checkmark icon or just visual change?
  - Hover state (unselected):
    - Scale increase (1.02 confirmed?)?
    - Border color change (white/20?)?
    - Lift effect (translateY -2px? shadow increase?)?
  - Badge ("NEW" on V5):
    - Position (top-right corner?)?
    - Colors (exact hex for background/text)?
    - Animation (pulse? glow?)?

**B) Instrumental Toggle**
- Questions:
  - Toggle dimensions (44×24 confirmed from Phase 1?)?
  - Active color (match model cards purple theme?)?
  - Animation timing (200ms confirmed?)?
  - Label placement (left of toggle? right? above?)?
  - Description text size/color below toggle?

**C) Live Preview Card**
- Questions:
  - Card appearance animation (fade in? slide up?)?
  - Update animation when selections change (crossfade? flash?)?
  - Preview text format:
    - Model name display style (badge? bold text?)?
    - Lyric/instrumental indicator (icon? text?)?
    - Style prompt preview (truncated? scrollable?)?
  - Card elevation (shadow-lg? shadow-xl?)?

**D) Epic Generate Button**
- Current: Gradient background, scale on hover/tap
- Questions:
  - Gradient exact colors (cyan-400 0%, purple-500 100%?)?
  - Gradient angle (to bottom-right confirmed?)?
  - Hover effect:
    - Scale (1.02 confirmed?)?
    - Gradient shift animation?
    - Glow effect (box-shadow color/blur?)?
  - Click/tap effect:
    - Scale down (0.98 confirmed?)?
    - Ripple effect from click point?
  - Loading state:
    - Spinner or progress bar?
    - Button disabled opacity (50%? 70%?)?
    - Text change ("Generating..." animation?)?
  - Shine effect:
    - Should button have a moving shine/gloss overlay?
    - If yes, shine duration (2s? 3s?)?
    - Shine gradient opacity (20%? 30%?)?

---

### 4. ANIMATION TIMING & EASING

For each animation, specify:

**A) Waveform Updates (MiniPlayer)**
- Frame rate: 60fps on desktop, 30fps on mobile?
- Easing: Linear? Ease-out? Custom cubic-bezier?
- Should bars animate independently or in waves?

**B) Vinyl Spin (FullPlayerView)**
- Rotation duration: 20s confirmed?
- Easing: Linear (constant speed) or slight ease for organic feel?
- Should it slow down when paused (deceleration duration?)?

**C) Tab Switching in Audio Generation**
- Transition type: Crossfade? Slide? Scale?
- Duration: 200ms? 300ms?
- Easing: cubic-bezier(0.4, 0, 0.2, 1)?

**D) Modal Open/Close (FullPlayerView)**
- Entrance: Fade in? Scale up? Slide up?
- Duration: 300ms? 400ms?
- Exit: Reverse of entrance?
- Background overlay fade duration (same or faster?)?

---

### 5. COLOR PALETTE REFINEMENT

Based on Phase 1 specs (#38BDF8 Sky-400, #22D3EE Cyan-400), define:

**A) Audio Visualization Colors**
- Primary gradient for waveforms: Exact hex start/end?
- Secondary gradient for spectrum: Exact hex start/middle/end?
- Inactive/idle state color: Gray shade (which gray-X?)?

**B) Player Controls**
- Active state (shuffle/repeat on): Color + opacity?
- Hover state: Color + opacity?
- Disabled state: Opacity level?

**C) Model Cards**
- V3.5 accent color: Blue-400?
- V4 accent color: Purple-400?
- V5 accent color: Orange-400/Red-400?

---

## CONSTRAINTS (DO NOT DO THESE)

❌ **DO NOT** suggest adding 3D rendering libraries (Three.js, React Three Fiber)  
❌ **DO NOT** suggest shader-based backgrounds (WebGL/GLSL)  
❌ **DO NOT** suggest kinetic typography or per-word animations  
❌ **DO NOT** add new audio features (EQ, filters, effects)  
❌ **DO NOT** redesign the component structure  
❌ **DO NOT** suggest voice input or AI features  

## WHAT TO FOCUS ON

✅ **Exact timing values** (200ms, 300ms, 20fps, 60fps)  
✅ **Exact easing functions** (cubic-bezier(0.4, 0, 0.2, 1))  
✅ **Exact color values** (#22D3EE, rgba(34, 211, 238, 0.15))  
✅ **CSS/Framer Motion only** (no WebGL, no external libraries)  
✅ **Performance-conscious** (30fps mobile, 60fps desktop targets)  
✅ **Design rationale** (why this timing? why this color?)  

---

## OUTPUT FORMAT

Please structure your response like this:

```markdown
## PHASE 2: Audio Player Visual Specifications

### 1. MiniPlayer

#### Animated Gradient Border
- Gradient: linear-gradient(90deg, #22D3EE 0%, #A855F7 50%, #22D3EE 100%)
- Animation: 8s linear infinite
- Thickness: 2px
- Glow on peaks: box-shadow 0 -2px 10px rgba(34, 211, 238, 0.5) when waveform > 80%

#### Album Art 3D Hover
- Scale: 1.05
- Rotation: rotateY(8deg) rotateX(2deg)
- Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Shadow: 0 8px 16px rgba(0, 0, 0, 0.3)
- Reflection: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent) overlay

#### Rationale
- 8s gradient loop feels organic without being distracting
- 8deg Y-rotation creates depth without being jarring
- Shadow increase reinforces the "lift" effect

---

### 2. FullPlayerView

[Continue with same detail level]
```

---

**IMPORTANT:** Focus on visual polish that can be achieved with CSS and Framer Motion. No new libraries.

Are you ready to provide these audio player design specifications?
