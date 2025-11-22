# UI Overhaul Plan: Suno v5 Architect

## 1. Executive Summary
The current UI is functional but lacks visual cohesion and modern polish. This overhaul aims to transform the application into a professional-grade "Studio" environment, emphasizing focus, clarity, and a premium aesthetic suitable for creative work.

## 2. Design Philosophy
- **"Glass & Neon" Aesthetic**: Dark mode default with subtle glassmorphism (blur effects) and neon accents (purple/cyan) to match the "AI/Future" vibe of Suno.
- **Content-First**: The lyrics and analysis are the stars. UI chrome should recede.
- **Fluidity**: Smooth transitions between states (Input -> Generation -> Analysis).

## 3. Layout Restructuring

### 3.1 Current Issues
- **Crowded 3-Column Layout**: On smaller desktop screens, the 3-column layout (History | Input | Tips) squeezes the main content.
- **Visual Noise**: Too many borders and distinct "cards".
- **Vertical Rhythm**: Inconsistent spacing between sections.

### 3.2 Proposed Layout (The "Studio" View)
- **Collapsible Sidebar (Left)**: Combine "History" and "Tips" into a single tabbed or collapsible sidebar to reclaim horizontal space.
- **Split View (Main)**:
  - **Left Panel (40%)**: Input Controls (Sticky).
  - **Right Panel (60%)**: Live Preview / Results (Scrollable).
- **Floating Action Bar**: Move primary actions (Generate, Clear) to a floating or sticky footer/header for easy access.

## 4. Component Refactoring

### 4.1 InputForm.tsx
- **Grouped Sections**: Use accordion-style collapsible sections for "Advanced Settings" (Structure, Logic) to declutter the initial view.
- **Visual Selectors**: Replace standard dropdowns with visual cards for "Mood" and "Genre" (e.g., clicking a "Melancholy" card with an icon).
- **Smart Defaults**: Hide empty optional fields until requested.

### 4.2 ResultDisplay.tsx
- **Lyrics View**: Typography overhaul. Use a monospaced font for lyrics (like a code editor or screenplay) for better readability.
- **Analysis Dashboard**: Convert text-heavy analysis into visual charts (Radar charts for scores).
- **Audio Player**: Dock the audio player at the bottom of the screen (global player) so users can browse history while listening.

### 4.3 Navigation
- **Unified Header**: Clean header with simple branding and "New Song" button.
- **Breadcrumbs**: Easy navigation back to parent songs in the history tree.

## 5. Visual Polish (Tailwind Implementation)

### 5.1 Color Palette
- **Background**: `bg-slate-950` (Deep dark blue/black)
- **Surface**: `bg-slate-900/50` with `backdrop-blur-md`
- **Primary**: `text-cyan-400` (Suno Blue)
- **Secondary**: `text-purple-400` (Creative/AI)
- **Borders**: `border-white/10` (Subtle)

### 5.2 Typography
- **Headings**: `Inter` or `Outfit` (Modern Sans)
- **Body**: `Inter` (High readability)
- **Lyrics**: `JetBrains Mono` or `Fira Code` (Technical/Script feel)

## 6. Implementation Phases

### Phase 1: Foundation (The "Clean Up")
- [ ] Standardize all padding/margins using a spacing scale.
- [ ] Unify color palette (remove random hex values, use semantic names).
- [ ] Implement the collapsible sidebar to free up space.

### Phase 2: Component Redesign
- [ ] Redesign `InputForm` with accordions and visual selectors.
- [ ] Redesign `ResultDisplay` with better typography and visual scorecards.

### Phase 3: "Studio" Polish
- [ ] Add glassmorphism effects to containers.
- [ ] Add micro-interactions (hover states, loading animations).
- [ ] Implement the global docked audio player.

## 7. Next Steps
1. Approve this plan.
2. Begin Phase 1: Refactor `App.tsx` layout.
