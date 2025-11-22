# Suno v5 Architect - Development Plan

## Phase 1: Core Experience Improvements (Current Focus)
- [x] **Switch Image Model**: Update to `nano-banana-pro-001` for better cover art. (Completed)
- [x] **Suno API Integration**: Setup API key and service layer. (Completed)
- [ ] **Export Functionality**: Allow users to download lyrics (.txt) and style prompts (.json).
- [ ] **Undo/Redo System**: Implement history tracking for the Smart Line Editor.
- [ ] **UI Polish**: Improve mobile responsiveness and add tooltips for complex metrics.

## Phase 2: Advanced Features
- [ ] **Audio Preview**: Integrate a TTS engine to read lyrics rhythmically (to check flow).
- [ ] **Direct Suno Generation**: Use the Suno API to generate actual audio from the Architect interface.
- [ ] **Collaboration**: Simple link sharing for songs (using URL parameters or a lightweight backend).
- [ ] **Search & Filter**: Add search bar and filters (by genre, mood, score) to the History sidebar.
- [ ] **Custom Templates**: Allow users to save their own "Style Presets" (e.g., "My Synthwave Setup").

## Phase 3: Long-Term Vision
- [ ] **Direct Suno Integration**: If/when Suno releases an API, integrate direct audio generation.
- [ ] **Marketplace**: A platform for users to share high-scoring prompts.
- [ ] **Multi-Language Support**: Add support for Spanish, French, and Japanese.

## Immediate Next Steps
1.  Verify `nano-banana-pro-001` works (requires generating a song).
2.  Implement **Export Functionality** (low hanging fruit, high value).
3.  Implement **Undo/Redo** for the editor.
