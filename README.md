<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Suno v5 Architect - AI-Powered Song Creation Studio

> **📊 Project Status:** 26/26 AI features complete | UI/UX polish in progress  
> **🎯 See:** [`ROADMAP_UPDATE_QUICK_REF.md`](docs/ROADMAP_UPDATE_QUICK_REF.md) for current roadmap

An advanced AI-powered songwriting assistant that generates optimized lyrics, analyzes song structure, creates cover images, and produces full audio tracks using cutting-edge AI services.

## 🎵 Features

### Core Songwriting (Phase 0-3)
- **11-Category Scoring System**: Enhanced analysis (Hook Factor, Singability, Imagery, etc.)
- **AI Lyrics Generation**: Professional-grade song structures with Gemini 2.0 Flash
- **Smart Line Editor**: AI-assisted lyric improvements with real-time evaluation
- **Style Prompt Builder**: 50+ instruments with advanced customization
- **Audio Generation**: Full song creation via Suno API (V3.5, V4, V5)
- **Version Control**: Iterative improvements with V1/V2 comparison
- **Multi-Version Generation**: Create 3 alternative variations
- **Export System**: TXT/PDF export with formatting

### Advanced Analysis Tools (Phase 1-2)
- **Interactive Lyrics Editor**: Advanced editing with breath marks, imagery, narrative arc
- **Polished Lyrics Editor**: Full-featured editor with WCAG 2.1 AA compliance
- **Rhythm Visualization**: Syllable stress, clusters, rhyme scheme overlay
- **Deep Analysis Assistant**: Gemini chat interface (3 free questions, then $0.01/question)
- **Audio Upload Analyzer**: Multimodal audio analysis with Gemini
- **Hit Predictor**: 5-persona prediction system (Producer, A&R, Radio, Critic, Fan)

### Intelligence Systems (Phase 3) ⭐ NEW
- **🔬 Quality Validation Study**: A/B testing framework with mock expert ratings
  - 5 expert profiles (Producer, Lyricist, A&R, Musicologist, Journalist)
  - Statistical analysis (p-values, confidence intervals, consensus scoring)
  - 4-tab dashboard (Overview, Songs, Experts, Raw Data)
  - Access: Click **🔬 Validation** button in header
  
- **🧠 Historical Learning System**: Preference learning and adaptation
  - Tracks all accept/reject/modify actions with context
  - Extracts 3 pattern types (preference, avoidance, style)
  - 4D style signature analysis (formality, complexity, imagery, emotion)
  - Vocabulary preferences (preferred/avoided words)
  - Learning analytics dashboard with improvement trends
  - Access: Click **🧠 Learning** button in header

### Additional Features
- **Advanced Lyric Logic**: Strict formatting with section headers and vocal cues
- **Central Metaphor Logic**: Unified imagery across entire song
- **Cinema Audit**: Visual grounding test (counts physical objects in lyrics)
- **Sonic Analysis**: Phonetics and syllabic density evaluation
- **Real-time Status Polling**: Track audio generation progress
- **Progressive Disclosure UI**: Collapsible sections for better UX
- **Caching & Partial Updates**: Smart caching to reduce API costs

## 🚀 Run Locally

**Prerequisites:**  
- Node.js 18+
- API Keys: Google Gemini, Suno API

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.env` file with:
   ```bash
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUNO_API_KEY=your_suno_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the app:**
   - Local: `http://localhost:5173`
   - Network: Use the network URL shown in terminal

### Production Deployment

For public access (e.g., in Codespaces):

1. **Start the proxy server:**
   ```bash
   node proxy-server.cjs &
   ```

2. **Start Vite with tunnel config:**
   ```bash
   npm run dev -- --config vite.config.tunnel.ts
   ```

3. **Create Cloudflare tunnel:**
   ```bash
   cloudflared tunnel --url http://localhost:8080
   ```

## 🧪 Testing

Run Playwright visual verification tests:
```bash
npx playwright test test_tunnel.spec.ts
```

## 📱 Mobile Support

Fully responsive design optimized for all screen sizes:
- Compact layouts on mobile devices
- Touch-friendly controls
- Responsive typography
- Optimized spacing and padding

## 🛠️ Tech Stack

- **Frontend**: React 19.2.0 + TypeScript 5.6.2 + Vite 6.4.1
- **Styling**: Tailwind CSS 3.4.17
- **AI Services**: 
  - Gemini 2.0 Flash (gemini-2.0-flash-exp) - Lyrics, analysis, chat
  - Nano Banana Pro (image generation)
  - Suno API (V3.5, V4, V5) - Audio generation
- **Testing**: Playwright + Chromium
- **Infrastructure**: Node.js proxy + Cloudflare tunnel
- **Storage**: LocalStorage (500 entry limit for learning data)

## 📦 Component Architecture

### Main Components (24 total)
- `App.tsx` - Main application shell with modal orchestration
- `InputForm.tsx` - Song parameter input interface
- `ResultDisplay.tsx` - Primary results view with tabs (1,648 lines - needs refactoring)
- `ComparisonView.tsx` - Version comparison interface
- `SmartLineEditor.tsx` - AI-assisted line editing
- `StyleBuilderModal.tsx` - Genre/style selector
- `InstrumentSelector.tsx` - 50+ instrument picker
- `SongHistorySidebar.tsx` - Version history navigation
- `MiniPlayer.tsx` - Audio playback controls
- `FullPlayerView.tsx` - Immersive player experience

### Advanced Features Components (NEW)
- `ValidationDashboard.tsx` (403 lines) - Quality validation study interface
- `LearningInsightsDashboard.tsx` (415 lines) - Learning system analytics
- `InteractiveLyricsCanvas.tsx` - Advanced lyrics visualization
- `InteractiveLyricsEditor.tsx` - Interactive editing features
- `PolishedLyricsEditor.tsx` - WCAG 2.1 AA compliant editor
- `DeepAnalysisAssistant.tsx` - Gemini chat interface
- `RhythmVisualizationOverlay.tsx` - Rhythm analysis display
- `AudioUploadAnalyzer.tsx` - Audio analysis interface
- `HitPredictor.tsx` - Hit prediction UI (5 personas)
- `LiveRewritePlan.tsx` - Rewrite planning interface
- `FloatingAnalysisAgent.tsx` - Floating analysis agent

### Services Layer (25+ files, ~18,631 lines)
- `geminiService.ts` - Gemini 2.0 Flash API integration
- `scoringService.ts` - 11-category scoring engine
- `qualityValidationService.ts` (485 lines) - A/B testing simulation
- `historicalLearningService.ts` (485 lines) - Preference learning
- `interactiveLyricsService.ts` - Lyrics analysis
- `advancedLyricsFeatures.ts` - Breath marks, imagery, narrative
- `rhythmVisualizationService.ts` - Syllable stress analysis
- `audioAnalysisService.ts` - Multimodal audio analysis
- `hitPredictorService.ts` - 5-persona prediction system
- `iterativeRefinementService.ts` - Draft→Critique→Polish loop
- Plus 15+ specialized agent services

## 📖 Documentation

### Main Docs
- [README.md](README.md) - This file (overview)
- [FINAL_STATUS.md](FINAL_STATUS.md) - 26 features completion status
- [PROJECT_COMPLETION.md](PROJECT_COMPLETION.md) - Detailed completion summary
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - How to use new features

### Roadmap Docs (Updated Nov 24, 2025)
- [ROADMAP_UPDATE_QUICK_REF.md](docs/ROADMAP_UPDATE_QUICK_REF.md) - **START HERE** (Quick summary)
- [ROADMAP_STATUS_UPDATE.md](docs/ROADMAP_STATUS_UPDATE.md) - Comprehensive analysis
- [UPDATED_IMPLEMENTATION_ROADMAP.md](docs/UPDATED_IMPLEMENTATION_ROADMAP.md) - 3.5-week plan

### Original Roadmap (Reference)
- [IMPLEMENTATION_ROADMAP_PART_1_OVERVIEW.md](docs/IMPLEMENTATION_ROADMAP_PART_1_OVERVIEW.md)
- [IMPLEMENTATION_ROADMAP_PART_2_PHASES_1_2.md](docs/IMPLEMENTATION_ROADMAP_PART_2_PHASES_1_2.md)
- [IMPLEMENTATION_ROADMAP_PART_3_PHASES_3_4.md](docs/IMPLEMENTATION_ROADMAP_PART_3_PHASES_3_4.md)
- [IMPLEMENTATION_ROADMAP_PART_4_LAUNCH.md](docs/IMPLEMENTATION_ROADMAP_PART_4_LAUNCH.md)

### Other Docs
- [REPOSITORY_ANALYSIS.md](REPOSITORY_ANALYSIS.md) - Technical analysis
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [ANALYSIS_SUMMARY.txt](ANALYSIS_SUMMARY.txt) - Feature overview

## 🔍 Repository Tools

### Indexing System

Index the entire repository for quick reference and AI context:

```bash
# Index the repository
npm run index

# Verify index completeness
npm run verify-index

# Search indexed files
npm run search <query>
```

See [docs/REPO_INDEXING.md](docs/REPO_INDEXING.md) for complete documentation.

## 🎯 Usage Guide

1. **Input Song Parameters**: Topic, mood, genre, vocals
2. **Select Advanced Options**: Instruments, structure, logic modes
3. **Generate**: AI creates lyrics, style prompt, and metadata
4. **Analyze**: Deep analysis with scoring and improvement suggestions
5. **Generate Audio**: Click Audio tab to create full song with Suno
6. **Iterate**: Create variations or improved versions

## 🔧 Troubleshooting

### Port Already in Use
```bash
lsof -ti:5173 | xargs kill -9
```

### Vite Host Issues (Codespaces)
Use the proxy server setup described in Production Deployment section.

### Audio Generation Stuck
Check console logs (filter by `[Audio]`) for detailed status information.

## 📊 Project Stats

- **Lines of Code**: ~3,500+
- **Components**: 8
- **Services**: 2 (geminiService, sunoService)
- **Grade**: **A** (Production Ready)

## 📄 License

See [LICENSE](LICENSE) for details.

---

**Version**: 2.0.0  
**Last Updated**: November 22, 2024  
**AI Studio App**: https://ai.studio/apps/drive/1haSkw1gbEEN1MX7k-P7_f3MZz8gwCbR_
