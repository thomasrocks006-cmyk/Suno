# Audio Studio Rewrite Plan

## 1. Overview
The goal is to transform the current "Result Display" into a full-featured "Audio Studio" with a persistent library, a dedicated player view, and a global mini-player that continues playback across the application.

## 2. Architecture Changes

### 2.1. Global Audio Context (`AudioProvider`)
We need to lift the audio playback state out of individual components and into a global context.
- **State:**
  - `currentTrack`: The song currently playing (or paused).
  - `isPlaying`: Boolean.
  - `queue`: List of songs to play next.
  - `progress`: Current playback time.
  - `volume`: Global volume.
- **Actions:**
  - `play(song)`: Start playing a song.
  - `pause()`: Pause playback.
  - `resume()`: Resume playback.
  - `next()`, `previous()`: Navigation.
  - `seek(time)`: Jump to time.

### 2.2. Layout Restructuring (`App.tsx`)
The main application layout needs to change to accommodate the persistent player.
- **Current:** `Sidebar` | `Main Content` (Input or Result)
- **New:** 
  - `Sidebar` | `Main Content`
  - `Bottom Bar` (Persistent Mini Player) - Always visible if a track is loaded.

## 3. New Components

### 3.1. `AudioPlayerContext.tsx`
- React Context provider wrapping the entire application.
- Manages the `<audio>` element instance (or `useAudio` hook).

### 3.2. `MiniPlayer.tsx`
- **Location:** Fixed at the bottom of the screen (or a floating circle as requested, but a bottom bar is usually more functional for controls).
- **Features:**
  - Song Thumbnail (Small).
  - Song Title & Artist/Style.
  - Play/Pause, Next/Prev buttons.
  - Progress bar (mini).
  - Click to expand to "Full Player".

### 3.3. `FullPlayerView.tsx` (The "Audio Studio" Detail View)
- **Trigger:** Clicking the Mini Player or selecting a song from the Library.
- **Layout:**
  - **Left/Top:** Large Album Art (generated image or placeholder).
  - **Center/Right:** Scrolling Lyrics.
    - Highlight current line (if timing data available, otherwise just scrollable).
  - **Controls:** Big Play/Pause, Waveform visualization (optional), Download buttons.

### 3.4. `LibraryView.tsx`
- **Replacement for:** `SongHistorySidebar` (or an expansion of it).
- **Layout:** Grid or List view of all generated songs.
- **Cards:** Show artwork, title, tags, and duration.
- **Search/Filter:** Filter by genre, mood, etc.

## 4. Implementation Steps

### Phase 1: Foundation (Context & Layout)
1.  Create `AudioContext` and `AudioProvider`.
2.  Wrap `App` in `AudioProvider`.
3.  Create a basic `MiniPlayer` component and add it to the `App` layout.

### Phase 2: The Library
1.  Refactor `SongHistorySidebar` into a more robust `Library` component.
2.  Ensure clicking a song in the library plays it via the `AudioContext` but doesn't necessarily navigate away from the current work unless requested.

### Phase 3: The Full Player (Detail View)
1.  Create `SongDetailView` (or `FullPlayer`).
2.  Display Lyrics prominently.
3.  Show "Album Art" (we can use the style/mood to generate a gradient or placeholder if no real image exists yet).

### Phase 4: Persistence & Polish
1.  Ensure audio keeps playing when switching between "Input Form" and "Library".
2.  Add animations (slide up for full player).
3.  "Circle" mode for Mini Player (optional, if user strictly prefers it over a bar).

## 5. UI/UX Mockup Description
- **Mini Player:** A sleek, dark-glass bar at the bottom.
  - [ Art ] [ Title - Style ] [ << |> >> ]
- **Full Player:**
  - Background: Blurred version of the song "art".
  - Content: Two columns.
    - Col 1: Square Art, Playback Controls, Metadata.
    - Col 2: Large, readable Lyrics.

## 6. Technical Considerations
- **Audio Source:** The `streamAudioUrl` from Suno API.
- **State Persistence:** `localStorage` is already used for history; we will continue this.
- **Concurrency:** Ensure generating a new song doesn't break the playback of the old one until the new one is ready.
