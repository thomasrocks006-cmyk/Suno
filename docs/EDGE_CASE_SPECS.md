# PHASE 4: Edge Case Design Specifications

## 1. Empty States

### SongHistorySidebar (No Songs)
- **Icon:** `MusicNote` (Outline), 64px, color `#475569` (Slate-600).
- **Primary Text:** "Your library is empty", `text-lg` (16px), font-medium, color `#9CA3AF` (Slate-400).
- **Secondary Text:** "Create your first song to start building your collection.", `text-sm` (12px), color `#64748B` (Slate-500).
- **CTA:** "Create Song" button, Primary variant, Medium size.
- **Layout:** Centered vertically in sidebar container. Spacing: Icon → Text `16px`, Text → CTA `24px`.
- **Animation:** Fade in `opacity 0 → 1`, duration 300ms `ease-out`.

### ResultDisplay (Before First Generation)
- **Visual:** Illustration of a sound wave transforming into a musical note. Style: Minimalist line art, color `#334155` (Slate-700).
- **Primary Text:** "Ready to make music?", `text-2xl` (24px), font-bold, color `#F8FAFC` (Slate-50).
- **Secondary Text:** "Describe your idea in the form on the left and hit Generate.", `text-base` (14px), color `#9CA3AF` (Slate-400).
- **Animation:** Staggered fade-in (Illustration → Title → Text), 100ms delay each.

### VariationsView (No Variations)
- **Icon:** `Copy` (Outline), 48px, color `#334155` (Slate-700).
- **Text:** "No variations yet", `text-sm`, color `#64748B`.
- **CTA:** "Generate Variations" button, Ghost variant (border only), Small size.
- **Context:** Displayed inside the variations panel area.

### PersonalizationModal Tabs (Empty)
- **Your World:** Dashed border card (`border-dashed border-2 border-slate-700`), height 120px. Center text: "Add a reference to guide the AI", `text-sm text-slate-500`. Plus icon.
- **Metaphor Lab:** "Need inspiration?" card. Light bulb icon. "Try: 'Love is a battlefield' or 'Time is a river'".
- **Power Lines:** "No power words added." List of 3 popular suggestions (e.g., "Neon", "Whisper", "Thunder") as clickable chips.

### DeepAnalysisView (Analysis Pending)
- **State:** Loading Skeleton.
- **Visual:** 6 card outlines. Shimmer effect `bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800`.
- **Text:** "Analyzing lyrics..." centered overlay, `text-sm text-slate-400`, pulsing opacity.

---

## 2. Error States

### API Timeout (Generation > 2 mins)
- **Visual:** Replace loading spinner with `AlertTriangle` icon (48px, `#F59E0B` Amber-500).
- **Primary Text:** "Generation timed out", `text-lg`, font-medium, `#F8FAFC`.
- **Secondary Text:** "The server is taking longer than expected.", `text-sm`, `#9CA3AF`.
- **Actions:**
  - "Retry" (Primary Button).
  - "Cancel" (Ghost Button).
  - Layout: Side-by-side, gap `12px`.

### Failed to Load Song Metadata
- **Visual:** Card border turns `#EF4444` (Red-500), 1px solid. Background tint `#EF4444` at 5% opacity.
- **Icon:** `AlertCircle` (16px, Red-500) top-right corner.
- **Text:** "Failed to load song details." `text-xs text-red-400`.
- **Action:** "Retry" text-link (`text-xs underline text-red-400`) next to error text.

### Invalid Form Input
- **Field-Level:**
  - Border: `#EF4444` (Red-500).
  - Message: `text-xs text-red-400` below input. Slide down animation (200ms).
  - Icon: `AlertCircle` (14px) inline with error text.
- **Form-Level:**
  - Toast notification (Top-Center).
  - Style: Error variant (Red border/icon).
  - Text: "Please fix the errors in the form."

### Audio Playback Failure
- **Visual:** MiniPlayer waveform replaced by error message.
- **Text:** "Playback Error", `text-sm text-red-400`.
- **Icon:** `XCircle` (Red-400) in place of Play button.
- **Action:** "Reload" button (Ghost, small) replaces time display.

### Network Disconnection
- **Global Handler:** Toast notification (Bottom-Center, fixed).
- **Style:** Warning variant (Amber-500).
- **Icon:** `WifiOff`.
- **Text:** "No internet connection. Reconnecting..."
- **Behavior:** Persists until connection restored. Auto-dismisses with "Back online" (Green) toast.

---

## 3. Loading States

### Skeleton Screens (SongMetadataCard)
- **Structure:**
  - Image: 120px square block.
  - Title: 60% width bar, 24px height.
  - Subtitle: 40% width bar, 16px height.
  - Badges: 3x pill shapes, 48px width each.
- **Animation:** Shimmer gradient `linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)`. Duration 1.5s infinite.
- **Color:** Base `#1E293B` (Slate-800).

### Lyrics Generation Loading
- **Visual:** "Typewriter" effect placeholder.
- **Animation:** Gray bars (`#334155`) appearing one by one, varying widths (40-80%).
- **Speed:** 1 line every 500ms.
- **Text:** "Writing lyrics..." label at top, `text-xs text-cyan-400` pulsing.

### Audio Generation Progress
- **Visual:** Linear progress bar at bottom of generation card.
- **Dimensions:** Height 4px, Width 100%.
- **Color:** Gradient `from-cyan-400 to-purple-500`.
- **Animation:** Indeterminate (striped moving gradient) for first 5s, then determinate based on estimated time (30s).
- **Label:** "Generating audio..." `text-xs text-slate-400` above bar.
- **Cancel:** "X" button on right side, visible on hover.

### Modal Lazy Loading
- **Visual:** Spinner (32px, `#38BDF8`) centered in viewport.
- **Backdrop:** Immediate `bg-slate-950/50` fade-in.
- **Content:** Fades in (`opacity 0 → 1`, `scale 0.95 → 1`) once loaded.

### Image Lazy Loading
- **Placeholder:** Solid color `#1E293B` (Slate-800).
- **Icon:** `Music` (Outline, 24px, Slate-700) centered.
- **Transition:** Blur-up effect (`filter: blur(10px) → blur(0)`), duration 300ms.

---

## 4. Success Feedback

### "Copied to Clipboard"
- **Type:** Toast (Bottom-Center).
- **Style:** Glass-card dark (`bg-slate-900/90`).
- **Icon:** `Check` (Green-400).
- **Text:** "Copied to clipboard".
- **Duration:** 2000ms.
- **Animation:** Slide up `translateY(100%) → translateY(0)`.

### "Song Saved"
- **Visual:** Save button icon transforms to Checkmark.
- **Color:** Icon turns `#4ADE80` (Green-400).
- **Animation:** Scale pulse (`1.0 → 1.2 → 1.0`).
- **Duration:** 2000ms, then reverts to Save icon.

### "Settings Updated"
- **Type:** Inline message next to "Save" button in modal footer.
- **Text:** "Saved", `text-sm text-green-400`.
- **Icon:** `Check` (14px).
- **Behavior:** Fades out after 3s.

### "Audio Generated Successfully"
- **Visual:** MiniPlayer slides up from bottom (`translateY(100%) → 0`).
- **Auto-play:** Yes (if user setting allows).
- **Notification:** "Song ready!" toast (Top-Right).

### "Improved Line Accepted"
- **Visual:** Line background flashes `#22C55E` (Green-500) at 20% opacity.
- **Duration:** 500ms flash, then fade to transparent.
- **Text:** Updates immediately.

---

## 5. Accessibility Edge Cases

### Keyboard-Only Navigation
- **Skip Links:** "Skip to Main Content", "Skip to Player", "Skip to Sidebar".
- **Style:** Hidden by default. Visible on focus (`top: 0`, `z-index: 50`, `bg-cyan-500`, `text-black`, `px-4 py-2`).
- **Focus Ring:** `ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950`.

### Focus Order Issues
- **Modal:** Focus trapped inside. Initial focus on first interactive element (usually Input or Close button if no inputs).
- **Sidebar:** Tab order follows visual flow. Hidden sidebar items removed from tab order (`display: none` or `visibility: hidden`).

### Screen Reader Announcements
- **Generation Complete:** `aria-live="polite"`. "Audio generation complete. Playing song: [Title]."
- **Errors:** `aria-live="assertive"`. "Error: [Error Message]."
- **Tabs:** `role="tablist"`, `aria-selected="true/false"`.

### Reduced Motion
- **Detection:** `@media (prefers-reduced-motion: reduce)`.
- **Adjustments:**
  - Waveform: Static bars (opacity varies instead of height).
  - Vinyl: Static image (no rotation).
  - Modals: Fade in only (no scale/slide).
  - Toasts: Instant appearance (no slide).

### High Contrast Mode
- **Detection:** `@media (prefers-contrast: high)`.
- **Adjustments:**
  - Borders: Increase to 2px.
  - Backgrounds: Remove transparency (solid colors).
  - Text: Ensure pure white/black contrast.

---

## 6. Mobile-Specific Edge Cases

### Keyboard Covering Input
- **Behavior:** Active input scrolls to center of remaining viewport.
- **Padding:** Add `padding-bottom: env(safe-area-inset-bottom)` to container to prevent content hiding behind keyboard bar.

### Small Screen Overflows
- **Deep Analysis:** Switch to single-column stack below `640px`.
- **FullPlayer:** Hide "Lyrics" side-panel, move to tab/bottom-sheet.
- **Vinyl:** Reduce size to 200px (from 300px).

### Touch Gestures
- **Waveform:** Drag to seek enabled. Tap to seek enabled.
- **Swipe:** Swipe down on FullPlayer modal to close.
- **Conflict:** Horizontal swipe on tabs disabled if content scrolls horizontally.

### iOS Safari Quirks
- **Audio:** Show "Tap to Play" overlay if auto-play blocked.
- **Viewport:** Use `min-height: 100dvh` for full-screen containers to handle dynamic address bar.
