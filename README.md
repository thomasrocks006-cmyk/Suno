<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Suno v5 Architect - AI-Powered Song Creation Studio

An advanced AI-powered songwriting assistant that generates optimized lyrics, analyzes song structure, creates cover images, and produces full audio tracks using cutting-edge AI services.

## 🎵 Features

### Core Capabilities
- **AI Lyrics Generation**: Professional-grade song structures with Google Gemini 3.0 Pro
- **Style Prompt Builder**: 50+ instruments with advanced customization
- **Audio Generation**: Full song creation via Suno API V4 integration
- **Deep Analysis**: 6-category scoring system (Lyrical Originality, Melodic Flow, Emotional Impact, etc.)
- **Smart Line Editor**: AI-assisted lyric improvements with contextual suggestions
- **Version Control**: Iterative improvements with V1/V2 comparison
- **Cover Art**: Automatic album cover generation with Nano Banana Pro

### Advanced Features
- **Advanced Lyric Logic**: Strict formatting with section headers and vocal cues
- **Central Metaphor Logic**: Unified imagery across entire song
- **Cinema Audit**: Visual grounding test (counts physical objects in lyrics)
- **Sonic Analysis**: Phonetics and syllabic density evaluation
- **Variations Generator**: Create alternative takes (rhythmic & structural)
- **Real-time Status Polling**: Track audio generation progress

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
  - Google Gemini 3.0 Pro (lyrics & analysis)
  - Nano Banana Pro (image generation)
  - Suno API V4 (audio generation)
- **Testing**: Playwright + Chromium
- **Infrastructure**: Node.js proxy + Cloudflare tunnel

## 📖 Documentation

- [REPOSITORY_ANALYSIS.md](REPOSITORY_ANALYSIS.md) - Comprehensive technical analysis
- [CHANGELOG.md](CHANGELOG.md) - Version history and updates
- [ANALYSIS_SUMMARY.txt](ANALYSIS_SUMMARY.txt) - Quick feature overview

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
