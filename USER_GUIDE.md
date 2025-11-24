# Suno v5 Architect - User Guide

> **Professional AI-powered songwriting assistant with deep analysis, iterative refinement, and quality validation.**

---

## 🚀 Quick Start

### 1. Generate Your First Song

1. **Open the Input Panel** - Click the "New Song" button (or press `Ctrl/Cmd + N`)
2. **Fill in the form:**
   - **Artist Reference** - Inspiration artist (e.g., "Taylor Swift", "The Weeknd")
   - **Song Reference** - Example song for style (e.g., "Blinding Lights", "Anti-Hero")
   - **Topic** - What your song is about (e.g., "heartbreak", "summer vibes")
   - **Mood** - Emotional tone (e.g., "melancholic", "upbeat", "nostalgic")
   - **Genre** (optional) - Musical style (e.g., "synth-pop", "indie rock")
   - **Song Structure** - Choose from templates or create custom
3. **Click "Generate Suno Assets"** - AI will create lyrics, style prompts, and metadata

### 2. Explore Advanced Features

#### **Style Builder** 🎨
- Click "Open Style Builder" for granular style control
- Configure: Genre, Vocals, Instruments, Tempo, Mood, Effects
- Get AI-powered suggestions based on your inputs
- Real-time style prompt preview

#### **Agent Debate Analysis** 🤖
- After generation, watch 5 AI agents analyze your song in real-time
- See collaborative debates about strengths/weaknesses
- Get consensus recommendations for improvements
- View detailed quality scores across 8 dimensions

#### **Smart Line Editor** ✏️
- Click any lyric line to edit with AI assistance
- Choose editing mode:
  - **Quick Fix** - Maintain flow, fix one issue
  - **Moderate** - Adjust tone/style
  - **Deep Rewrite** - Complete transformation
- AI suggests improvements while maintaining song coherence

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | New Song (open input panel) |
| `Ctrl/Cmd + G` | Generate Song (when form is filled) |
| `Ctrl/Cmd + K` | Open Validation Dashboard |
| `Ctrl/Cmd + L` | Open Learning Insights Dashboard |
| `Esc` | Close modal/dashboard |

---

## 🎯 Key Features

### **1. Validation Dashboard** (`Ctrl/Cmd + K`)
**Purpose:** A/B test song quality with side-by-side comparisons

**Features:**
- Compare original vs. revised versions
- See improvements/regressions across quality dimensions
- Visual diff highlighting (green = better, red = worse, blue = neutral)
- Detailed quality breakdown with scoring

**Use Case:** Perfect for deciding which version to keep after iterative refinement

---

### **2. Learning Insights Dashboard** (`Ctrl/Cmd + L`)
**Purpose:** Track AI performance and identify patterns

**Features:**
- Agent performance analytics (accuracy, debate participation)
- Coverage tracking - which quality dimensions get most attention
- Pattern recognition - common strengths/weaknesses
- Quality distribution heatmaps

**Use Case:** Understand how the AI is improving and where it focuses most

---

### **3. Iterative Refinement**
**Purpose:** Create improved versions of your song

**How to Use:**
1. Generate initial song
2. Review agent analysis in the Analysis tab
3. Click "Create Refined Version" in the Variations tab
4. Choose refinement options:
   - **Advanced Logic** - Complex metaphors and wordplay
   - **Metaphor-Based Rewrite** - Poetic, figurative language
   - **Commercial Mode** - Radio-friendly, accessible style
5. AI generates new version with improvements
6. Compare using Validation Dashboard

---

### **4. Song History Sidebar**
**Purpose:** Track all your creations

**Features:**
- Chronological list of all generated songs
- Visual indicators for song versions (V2, V3, etc.)
- Click any song to view details
- Clear history button
- Automatically saves to browser storage

---

### **5. Style Builder Modal**
**Purpose:** Fine-tune musical style with precision

**Categories:**
- **Genre** - Pop, rock, electronic, hip-hop, etc.
- **Vocals** - Male, female, smooth, raspy, soulful, etc.
- **Instruments** - Guitar, synth, piano, drums, bass, etc.
- **Tempo** - Slow ballad, moderate, upbeat, fast
- **Mood** - Happy, sad, energetic, dark, dreamy
- **Effects** - Reverb, autotune, lo-fi, polished

**Pro Tip:** The AI generates a comprehensive style prompt from your selections

---

### **6. Audio Player**
**Purpose:** Listen to your songs with professional playback

**Features:**
- **Mini Player** (bottom bar):
  - Quick play/pause
  - Progress bar with timestamp
  - Click to expand to full player
  - Album art thumbnail
- **Full Player** (click mini player):
  - Large album art display
  - Synchronized lyrics view
  - Seekable progress bar
  - Immersive background blur
  - Previous/next track buttons

---

## 📊 Quality Analysis Dimensions

The AI agents evaluate songs across **8 key dimensions:**

1. **Lyrical Creativity** - Originality, wordplay, metaphors
2. **Emotional Depth** - Authenticity, resonance, vulnerability
3. **Structural Coherence** - Song flow, verse/chorus balance
4. **Melodic Potential** - Catchiness, hook strength, musicality
5. **Theme Consistency** - Message clarity, topic focus
6. **Commercial Viability** - Mass appeal, radio-friendliness
7. **Technical Quality** - Rhyme scheme, syllable count, meter
8. **Innovation Factor** - Uniqueness, boundary-pushing elements

**Scoring System:**
- **90-100** - Exceptional, professional-grade
- **80-89** - Strong, above average
- **70-79** - Good, solid foundation
- **60-69** - Acceptable, needs refinement
- **Below 60** - Needs significant work

---

## 🎵 Song Structure Templates

### **Verse-Chorus** (Most Popular)
```
Verse 1 → Chorus → Verse 2 → Chorus → Bridge → Chorus
```
**Best for:** Pop, rock, country - universal structure

### **Verse-PreChorus-Chorus**
```
Verse 1 → PreChorus → Chorus → Verse 2 → PreChorus → Chorus → Bridge → Chorus
```
**Best for:** Modern pop, building tension

### **AABA** (Classic)
```
A (Verse 1) → A (Verse 2) → B (Bridge) → A (Verse 3)
```
**Best for:** Jazz, classic standards, ballads

### **Verse-Chorus-Verse-Chorus**
```
Verse 1 → Chorus → Verse 2 → Chorus
```
**Best for:** Punk, indie, minimalist songs

### **Custom Structure**
- Define your own: Intro, Verse, PreChorus, Chorus, Bridge, Outro
- Use StructureEditor for drag-and-drop customization

---

## 🔧 Troubleshooting

### **Song Won't Generate**
- Check internet connection (requires Gemini API access)
- Verify all required fields are filled (Artist, Song, Topic, Mood)
- Try refreshing the page
- Check browser console for API errors

### **Audio Won't Play**
- Ensure audio URL is valid (check Audio tab in song details)
- Try different browser (Chrome/Firefox recommended)
- Check if audio file exists in Suno's backend

### **History Disappeared**
- History is stored in browser localStorage
- Clearing browser data will reset history
- Export important songs before clearing cache

### **Modal Won't Close**
- Press `Esc` key
- Click outside the modal
- Refresh page if stuck

### **Performance Issues**
- Close unused browser tabs
- Disable browser extensions
- Try incognito/private mode
- Use latest Chrome/Firefox version

---

## 🎨 Design Tokens (For Developers)

### **Color Palette**
```css
--suno-dark: #020617;      /* Background */
--suno-card: #0f172a;      /* Card backgrounds */
--suno-surface: #1e293b;   /* Surface elements */
--suno-primary: #22d3ee;   /* Cyan accent */
--suno-secondary: #c084fc; /* Purple accent */
--suno-accent: #f472b6;    /* Pink accent */
```

### **Spacing Scale**
- Small: 0.25rem - 0.5rem (4px - 8px)
- Medium: 1rem - 1.5rem (16px - 24px)
- Large: 2rem - 3rem (32px - 48px)
- XL: 4rem+ (64px+)

### **Typography**
- **Headings:** Inter font, 600-700 weight, uppercase tracking
- **Body:** Inter font, 400-500 weight
- **Code/Mono:** JetBrains Mono, 400-700 weight

### **Common Patterns**
- **Cards:** `bg-suno-card rounded-xl border border-white/10 p-6`
- **Buttons:** `bg-suno-primary hover:bg-suno-primary/80 px-4 py-2 rounded-lg`
- **Modals:** `bg-black/80 backdrop-blur-md fixed inset-0 z-50`
- **Hover Effects:** `hover:scale-105 transition-transform`

---

## 💡 Pro Tips

1. **Use Specific References** - "Taylor Swift's folklore era" > "Taylor Swift"
2. **Combine Modes** - Enable both Advanced Logic + Metaphor for best results
3. **Iterate Strategically** - Generate 2-3 versions, compare in Validation Dashboard
4. **Study Debates** - Agent discussions reveal nuanced quality insights
5. **Save Early** - Browser history is your friend, but export important songs
6. **Experiment with Structures** - Different structures suit different moods
7. **Review Analysis Before Refining** - Check what needs improvement first
8. **Use Keyboard Shortcuts** - 5x faster workflow
9. **Compare Versions** - Always validate improvements quantitatively
10. **Trust the Process** - AI agents debate for a reason - read their insights!

---

## 📱 Mobile Usage

- **Touch Targets:** All buttons are ≥44px for accessibility
- **Responsive Design:** Works on phones (375px+), tablets, and desktops
- **Swipe Gestures:** Swipe sidebar open/closed on mobile
- **Portrait/Landscape:** Optimized for both orientations
- **Performance:** Lazy-loaded dashboards save bandwidth

---

## 🌟 Best Practices

### **For Maximum Quality:**
1. Fill all optional fields (genre, custom structure)
2. Use the Style Builder for precision
3. Generate 2-3 versions with different modes
4. Compare in Validation Dashboard
5. Refine based on agent consensus feedback

### **For Fast Iteration:**
1. Use keyboard shortcuts (`Ctrl+N`, `Ctrl+G`)
2. Keep input form open while browsing history
3. Duplicate similar songs and tweak inputs
4. Use Smart Line Editor for quick lyric fixes

### **For Learning:**
1. Open Learning Insights Dashboard weekly
2. Study agent debate patterns
3. Track which quality dimensions you excel at
4. Review coverage heatmaps for blind spots

---

## 🆘 Support

**Found a bug?** Open an issue on GitHub  
**Feature request?** Submit a PR or discussion  
**Questions?** Check the FAQ or reach out to maintainers

**Built with:** React 19, TypeScript, Vite, Tailwind CSS, Google Gemini AI

---

*Last Updated: November 24, 2025*  
*Version: 1.0.0*  
*License: MIT*
