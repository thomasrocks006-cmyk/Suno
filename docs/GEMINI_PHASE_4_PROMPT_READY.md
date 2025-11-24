# 🎨 PHASE 4 DESIGN REVIEW: Edge Cases & Polish
## Ready-to-Use Prompt for Gemini 3.0 Pro

**Copy everything below this line and paste into Gemini:**

---

You are a **QA-focused UX designer** reviewing edge cases, error states, empty states, and loading patterns for a music generation web app.

## YOUR ROLE
You are NOT adding new features. You are a **completeness specialist** ensuring every possible user state has appropriate visual design. Your focus is on making the app feel polished and professional in ALL scenarios, not just the happy path.

## CONTEXT
We've designed the main components (Phase 1), audio player (Phase 2), and design system (Phase 3). Now we need to handle:
- **Empty States** (no songs generated yet)
- **Error States** (API failures, timeouts)
- **Loading States** (generation in progress)
- **Success Feedback** (confirmations, notifications)
- **Accessibility Edge Cases** (keyboard-only, screen readers)

The goal is to ensure users are NEVER confused or stuck, even when things go wrong.

---

## ROADMAP SECTION TO REVIEW

### DAY 43-45: USER ACCEPTANCE TESTING

**Expected Issues from Testing:**
- Mobile keyboard covering input fields
- Audio generation timeout not handled gracefully
- Confusion about "Assistant Check" button placement
- Waveform crashes on Safari iOS
- History search doesn't highlight matches
- Deep analysis cards overflow on small screens
- Floating agent doesn't remember position

### DAY 46-48: PERFORMANCE OPTIMIZATION

**Loading Patterns Needed:**
- Lazy-loaded components (modals) need loading UI
- Skeleton screens for content loading
- Progress indicators for audio generation
- Image lazy loading placeholders

---

## YOUR TASK (Edge Case Design)

### 1. EMPTY STATES

Design visuals for when content doesn't exist yet:

**A) SongHistorySidebar (No Songs)**
- **Visual Elements:**
  - Icon: What type? (music note? empty folder? custom illustration?)
  - Icon size: 64px? 80px? 96px?
  - Icon color: gray-500? gray-600?
  - Icon style: outline? filled? duotone?
- **Messaging:**
  - Primary text: "No songs yet" or more engaging like "Your journey begins here"?
  - Text size: text-lg? text-xl?
  - Text color: gray-400? gray-300?
  - Secondary text: "Generate your first song to get started"?
  - Secondary text size: text-sm? text-base?
- **Call-to-Action:**
  - Button text: "Create Your First Song" or "Get Started"?
  - Button style: primary (gradient) or secondary (ghost)?
  - Button size: large for prominence?
  - Button placement: centered below text?
- **Layout:**
  - Vertical centering in sidebar or top-aligned?
  - Spacing: icon to text, text to CTA?
  - Container padding?

**B) ResultDisplay (Before First Generation)**
- **Visual Approach:**
  - Show placeholder UI (skeleton) or empty message?
  - If message: illustration or icon?
  - If illustration: what imagery conveys "AI music creation"?
- **Messaging:**
  - Instructional ("Fill out the form on the left") or encouraging?
  - Should it show sample output to set expectations?
- **Animation:**
  - Fade in when component mounts?
  - Pulse effect on CTA?

**C) VariationsView (No Variations Generated)**
- **Current:** Empty state already specified in Phase 1
- **Questions:**
  - Should it explain WHAT variations are?
  - Show examples of what variations look like?
  - Different empty state for "first time" vs "you haven't generated yet"?

**D) PersonalizationModal Tabs (Empty)**
- **Your World Tab (no references added):**
  - Placeholder cards with dashed borders?
  - Instructional text in each section?
  - "Add" button prominence?
- **Metaphor Lab (no core metaphor):**
  - Examples of good metaphors?
  - Template suggestions?
- **Power Lines (no power words):**
  - Starter pack of common power words?
  - Import from template button?

**E) DeepAnalysisView (Analysis Pending)**
- **Loading State:**
  - Skeleton screens for score cards?
  - Generic message: "Analyzing lyrics..."?
  - Progress indicator (spinner, progress bar, steps?)?
  - Estimated time display?

---

### 2. ERROR STATES

Design visuals for failures and problems:

**A) API Timeout (Generation Takes Too Long)**
- **Trigger:** Audio generation >2 minutes
- **Visual Treatment:**
  - Replace loading spinner with error icon?
  - Error icon: ⚠️ or custom?
  - Error icon color: red-500 or amber-500 (warning not error?)?
  - Error icon size: 48px?
- **Messaging:**
  - Primary: "Taking longer than expected" or "Generation timed out"?
  - Secondary: Explain why? Suggest action?
  - Tone: Apologetic or matter-of-fact?
- **Actions:**
  - "Retry" button style: primary or secondary?
  - "Cancel" button: ghost style?
  - Button arrangement: side-by-side or stacked?
  - Auto-retry option with countdown?

**B) Failed to Load Song Metadata**
- **Visual Treatment:**
  - Card border turns red (red-500, 1px)?
  - Error icon position: top-left corner? center?
  - Background change (red-500/5 tint)?
- **Messaging:**
  - "Failed to load song" or more specific "Connection error"?
  - Show error details (for devs) or hide behind "Details" expando?
- **Actions:**
  - Retry button placement: inside card or overlay?
  - "Remove from history" option?

**C) Invalid Form Input**
- **Field-Level Errors:**
  - Border: border-red-500 (confirmed from Phase 1)
  - Background: bg-red-500/5?
  - Icon: ⚠️ inline with input?
  - Message below field:
    - Color: text-red-400
    - Size: text-xs
    - Icon: show icon in message too?
- **Form-Level Errors:**
  - Toast notification at top?
  - Alert banner above form?
  - Modal overlay for critical errors?

**D) Audio Playback Failure**
- **Trigger:** File not found, format unsupported, network error
- **Visual Treatment:**
  - MiniPlayer shows error state?
  - Error text replaces waveform?
  - Red border on player?
- **Messaging:**
  - "Unable to play audio" or more specific?
  - Suggest downloading file instead?
- **Actions:**
  - Retry button?
  - "Generate new version" button?

**E) Network Disconnection**
- **Global Handler:**
  - Toast notification position: top-center? bottom-center?
  - Icon: WiFi off icon?
  - Color scheme: amber (warning) or red (error)?
  - Auto-dismiss when reconnected?
  - Retry queue visualization?

---

### 3. LOADING STATES

Design visuals for in-progress operations:

**A) Skeleton Screens**
- **SongMetadataCard Loading:**
  - Skeleton blocks for: album art, title, style prompt, badges
  - Block colors: gray-800? animated shimmer?
  - Shimmer animation: left-to-right gradient sweep?
  - Shimmer duration: 1.5s (confirmed from Phase 1)?
  - Shimmer colors: from-gray-800 via-gray-700 to-gray-800?
  - Border radius: match actual component (rounded-xl)?

**B) Lyrics Generation Loading**
- **Visual Options:**
  - Option 1: Skeleton lines (how many? 8-10 lines?)
  - Option 2: Spinner with message ("Writing lyrics...")
  - Option 3: Progress bar showing sections (Verse 1... Chorus... Verse 2...)
  - Option 4: Typewriter effect (show lyrics as they generate?)
- **Recommendation:** Which feels best for 10-30 second wait?

**C) Audio Generation Progress**
- **Current:** Status polling display
- **Enhancement Questions:**
  - Linear progress bar: thickness (4px? 8px?)?
  - Progress bar color: gradient or solid primary?
  - Progress bar animation: smooth or stepped?
  - Percentage display: show number or just bar?
  - Estimated time: "~30 seconds remaining"?
  - Steps visualization: "Generating melody... Adding vocals..."?
  - Cancel button: show always or on hover?

**D) Modal Lazy Loading**
- **Trigger:** Opening PersonalizationModal, StyleBuilderModal
- **Fallback UI:**
  - Spinner: size (32px? 48px?), color?
  - Spinner position: center of viewport or where modal will appear?
  - Backdrop: show immediately or wait for content?
  - Transition: fade in when loaded?

**E) Image Lazy Loading (Album Art)**
- **Placeholder:**
  - Solid color: gray-800?
  - Gradient: from-gray-800 to-gray-900?
  - Icon: music note icon?
  - Blur-up effect when loaded?
  - Fade-in duration: 200ms?

---

### 4. SUCCESS FEEDBACK

Design visuals for confirmations and positive outcomes:

**A) "Copied to Clipboard"**
- **Notification Type:**
  - Toast: position (bottom-right? top-center?)?
  - Inline: replace button temporarily?
  - Both?
- **Toast Design (if used):**
  - Background: glass-card or solid?
  - Icon: checkmark color (green-400)?
  - Text: "Copied!" or "Copied to clipboard"?
  - Duration: 2000ms (confirmed from Phase 1)?
  - Animation: slide in from where?
  - Dismiss: auto only or X button?
  - Max visible toasts: 3? 5?

**B) "Song Saved"**
- **Visual Feedback:**
  - Checkmark animation: scale pulse?
  - Checkmark color: green-400?
  - Checkmark duration: 300ms appear, 2000ms visible, 300ms fade?
  - Confetti effect: too much? subtle sparkles?
  - Background flash on save button?

**C) "Settings Updated"**
- **Notification Style:**
  - Toast or inline message?
  - Icon: checkmark or settings icon?
  - Color: green (success) or blue (info)?
  - Position in PersonalizationModal?
  - Persist until modal closed or auto-dismiss?

**D) "Audio Generated Successfully"**
- **Celebration Moment:**
  - Auto-play audio?
  - Visual flourish: what kind?
  - MiniPlayer slides in with animation?
  - Focus shifts to player?
  - Notification: "Your song is ready!"?

**E) "Improved Line Accepted"**
- **Feedback in SmartLineEditor:**
  - Green flash background (color/duration)?
  - Checkmark icon appears where?
  - Old text strikethrough animation?
  - New text highlight duration?

---

### 5. ACCESSIBILITY EDGE CASES

Design for users with specific needs:

**A) Keyboard-Only Navigation**
- **Skip Links:**
  - "Skip to main content" confirmed from Phase 1
  - Additional skip links needed?
    - "Skip to player"?
    - "Skip to history"?
    - "Skip to form"?
  - Skip link styling: same as Phase 1 or variations?

**B) Focus Order Issues**
- **Modal Focus Trap:**
  - First focused element: close button or first input?
  - Last focused element before wrapping?
  - Focus visible on modal backdrop?
- **Sidebar Focus:**
  - Should song items be in tab order always?
  - Or only when sidebar is open/focused?

**C) Screen Reader Announcements**
- **Dynamic Content Updates:**
  - Generation complete: assertive or polite?
  - Tab switched: announce new tab name?
  - Score card expanded: announce content or not?
  - Audio playing: announce song title?
- **Live Region Design:**
  - aria-live="polite" for most updates?
  - aria-live="assertive" for errors only?
  - aria-atomic="true" or "false"?

**D) Reduced Motion Users**
- **Fallback Behaviors:**
  - Waveform: static bars or hide?
  - Vinyl spin: show static image?
  - Tab transitions: instant swap, no crossfade?
  - Button animations: remove scale effects?
  - Toast notifications: no slide, just fade?
- **Detection:**
  - @media (prefers-reduced-motion: reduce)
  - Duration 0ms or instant state change?

**E) High Contrast Mode**
- **Browser Detection:**
  - @media (prefers-contrast: high)
- **Adjustments Needed:**
  - Border thickness increase?
  - Remove glassmorphism (too subtle)?
  - Increase all text/background contrast?
  - Icons: filled instead of outline?

---

### 6. MOBILE-SPECIFIC EDGE CASES

Design for mobile challenges:

**A) Keyboard Covering Input**
- **Solution Options:**
  - Auto-scroll input into view?
  - Shrink content above input?
  - Close button that dismisses keyboard?
- **Scroll Behavior:**
  - Smooth scroll duration (300ms)?
  - Scroll to: input top, center, or just visible?
  - Padding above input (24px safe area)?

**B) Small Screen Overflows**
- **Deep Analysis Cards:**
  - Switch from grid to stack at what breakpoint?
  - Card min-height on mobile (120px instead of 100px)?
  - Font size reductions?
- **FullPlayerView:**
  - Lyrics section max-height on small screens?
  - Controls: shrink or hide some buttons?
  - Vinyl size reduction threshold?

**C) Touch Gesture Conflicts**
- **Waveform Interaction:**
  - Tap to seek or only drag?
  - Prevent scroll while dragging?
  - Touch feedback (ripple? highlight)?
- **Swipe Gestures:**
  - Swipe to dismiss modals?
  - Swipe between tabs?
  - Conflict with horizontal scroll?

**D) iOS Safari Quirks**
- **Audio Playback:**
  - Play button must be tapped by user (no auto-play)?
  - Visual indicator that play button is required?
- **100vh Issues:**
  - Use `100dvh` or `calc(100vh - env(safe-area-inset-bottom))`?
  - How to handle address bar appearing/disappearing?

---

## CONSTRAINTS (DO NOT DO THESE)

❌ **DO NOT** add new features (analytics, social sharing, etc.)  
❌ **DO NOT** suggest new components beyond empty/error/loading states  
❌ **DO NOT** redesign main components (those are done)  
❌ **DO NOT** suggest complex animations (keep it simple for edge cases)  

## WHAT TO FOCUS ON

✅ **User clarity** (never leave user wondering what to do)  
✅ **Error recovery** (always offer a next action)  
✅ **Consistent patterns** (reuse notification styles)  
✅ **Accessibility** (keyboard, screen reader, reduced motion)  
✅ **Mobile edge cases** (keyboard, touch, viewport)  
✅ **Performance** (skeleton screens over spinners)  

---

## OUTPUT FORMAT

Please structure your response like this:

```markdown
## PHASE 4: Edge Case Design Specifications

### 1. Empty States

#### SongHistorySidebar (No Songs)
- Icon: Music note (outline style), 80px, color #475569 (Slate-600)
- Primary text: "Your library is empty", 20px, semibold, #9CA3AF
- Secondary text: "Create your first song to start building your collection", 14px, regular, #64748B
- CTA: "Create Your First Song" button, primary variant, large size
- Layout: Vertically centered, 32px gap between icon/text/button
- Animation: Fade in 300ms when component mounts

#### Rationale
- 80px icon large enough to anchor the empty space
- "Library" language feels more premium than "history"
- Primary button drives action

---

### 2. Error States

[Continue with same detail level]

---

### 3. Loading States

[Continue with same detail level]

---

### 4. Success Feedback

[Continue with same detail level]

---

### 5. Accessibility Edge Cases

[Continue with same detail level]
```

---

**IMPORTANT:** Prioritize user confidence. Every edge case should make the user feel the app is polished and professional, not broken.

Are you ready to provide these edge case design specifications?
