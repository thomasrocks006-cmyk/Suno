# 🚀 COMPREHENSIVE UI/UX IMPLEMENTATION ROADMAP - PART 3
## Phase 2 (cont.) & Phase 3 Detailed Implementation

> **📢 IMPORTANT UPDATE (November 24, 2025):**  
> **26 AI features have been completed!** This document contains detailed implementation steps from the original plan.  
> See `IMPLEMENTATION_ROADMAP_PART_1_OVERVIEW.md` for the **REVISED 3.5-week plan** that reflects current project state.  
> Use this document as a **reference for technical implementation details** but follow the updated scope in Part 1.  
> **Note:** Full Design System (Phase 3) has been DEPRIORITIZED in the revised plan.

**Original Focus:** Audio Player Redesign (Week 3.5-4.5) + Design System & Polish (Week 5-7)  
**Revised Focus:** See Part 1 for adjusted timeline and priorities

---

## PHASE 2 (CONTINUED): AUDIO PLAYER REDESIGN

### WEEK 3.5-4: FULLPLAYERVIEW REDESIGN (5 improvements)

#### Implementation: FullPlayerView.tsx

```typescript
import { motion } from 'framer-motion';
import { audioService } from '@/services/audioService';
import { useEffect, useState, useRef } from 'react';

export function FullPlayerView({ song, isPlaying, onClose }) {
  const [frequencyData, setFrequencyData] = useState<number[]>(Array(64).fill(0));
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const lyricsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Dynamic Animated Background
  const backgroundStyle = {
    background: `
      radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(192, 132, 252, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 50% 80%, rgba(244, 114, 182, 0.15) 0%, transparent 50%)
    `,
  };

  // 2. Update frequency data for visualizer
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      const data = audioService.getFrequencyData();
      setFrequencyData(Array.from(data.slice(0, 64)));
    }, 50); // 20fps for visualizer
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  // 3. Synced Lyrics Auto-Scroll
  useEffect(() => {
    if (!lyricsRef.current) return;
    
    const activeLine = lyricsRef.current.querySelector(`[data-index="${activeLyricIndex}"]`);
    if (activeLine) {
      activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLyricIndex]);

  // 4. Update active lyric based on time
  useEffect(() => {
    if (!song.lyrics || !song.lyricTimestamps) return;
    
    const index = song.lyricTimestamps.findIndex((timestamp, i) => {
      const nextTimestamp = song.lyricTimestamps[i + 1];
      return song.currentTime >= timestamp && 
             (nextTimestamp === undefined || song.currentTime < nextTimestamp);
    });
    
    if (index !== -1) {
      setActiveLyricIndex(index);
    }
  }, [song.currentTime]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center glass-card"
      style={backgroundStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-6xl h-full flex flex-col p-8">
        {/* Close Button */}
        <button
          className="self-end w-11 h-11 rounded-full glass-button mb-4"
          onClick={onClose}
          aria-label="Close player"
        >
          <CloseIcon />
        </button>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Album Art + Visualizer */}
          <div className="flex flex-col items-center justify-center gap-6">
            {/* 2. 3D Vinyl Disc Animation */}
            <motion.div
              className="relative w-72 h-72 lg:w-96 lg:h-96"
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: 'linear' 
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Vinyl Disc */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl">
                {/* Grooves */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full border border-gray-700/30"
                    style={{ 
                      width: `${100 - i * 8}%`, 
                      height: `${100 - i * 8}%`,
                      margin: 'auto',
                      inset: 0,
                    }}
                  />
                ))}
                
                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-xl">
                    <img 
                      src={song.albumArt} 
                      alt={song.title}
                      className="w-28 h-28 rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Tone Arm (decorative) */}
              <motion.div
                className="absolute -right-4 top-1/4 w-2 h-32 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full origin-top-right"
                animate={isPlaying ? { rotate: 25 } : { rotate: 0 }}
                style={{ transformOrigin: 'top right' }}
              />
            </motion.div>

            {/* 3. Frequency Spectrum Visualizer */}
            <div className="w-full max-w-md h-32 flex items-end justify-center gap-1 px-4">
              {frequencyData.map((value, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-cyan-400 via-purple-500 to-pink-500 rounded-t-full"
                  style={{ height: `${(value / 255) * 100}%`, minHeight: '4px' }}
                  animate={{ height: `${(value / 255) * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Song Info + Lyrics */}
          <div className="flex flex-col gap-6">
            {/* Song Info */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {song.title}
              </h1>
              <p className="text-lg text-gray-400">
                {song.stylePrompt}
              </p>
            </div>

            {/* 4. Synced Lyrics with Auto-Scroll */}
            <div 
              ref={lyricsRef}
              className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-3"
            >
              {song.lyrics.split('\n').map((line, index) => (
                <motion.p
                  key={index}
                  data-index={index}
                  className={`text-lg transition-all duration-300 ${
                    index === activeLyricIndex
                      ? 'text-white font-semibold text-2xl'
                      : 'text-gray-500 text-base'
                  }`}
                  animate={{
                    scale: index === activeLyricIndex ? 1.05 : 1,
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* 5. Advanced Controls */}
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={song.duration}
                  value={song.currentTime}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      rgb(34, 211, 238) 0%, 
                      rgb(192, 132, 252) ${(song.currentTime / song.duration) * 100}%, 
                      rgba(255,255,255,0.1) ${(song.currentTime / song.duration) * 100}%)`,
                  }}
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatTime(song.currentTime)}</span>
                  <span>{formatTime(song.duration)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4">
                {/* Shuffle */}
                <motion.button
                  className="w-11 h-11 rounded-full glass-button"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Shuffle"
                >
                  <ShuffleIcon />
                </motion.button>

                {/* Previous */}
                <motion.button
                  className="w-11 h-11 rounded-full glass-button"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Previous"
                >
                  <PrevIcon />
                </motion.button>

                {/* Play/Pause */}
                <motion.button
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-xl"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={onPlayPause}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </motion.button>

                {/* Next */}
                <motion.button
                  className="w-11 h-11 rounded-full glass-button"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Next"
                >
                  <NextIcon />
                </motion.button>

                {/* Repeat */}
                <motion.button
                  className="w-11 h-11 rounded-full glass-button"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Repeat"
                >
                  <RepeatIcon />
                </motion.button>
              </div>

              {/* Secondary Controls */}
              <div className="flex items-center justify-between">
                {/* Volume */}
                <div className="flex items-center gap-2 w-32">
                  <VolumeIcon className="w-5 h-5 text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-white/10 rounded-full"
                  />
                </div>

                {/* Playback Speed */}
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="glass-button px-3 py-1 rounded-full text-sm"
                >
                  <option value="0.5">0.5×</option>
                  <option value="0.75">0.75×</option>
                  <option value="1">1×</option>
                  <option value="1.25">1.25×</option>
                  <option value="1.5">1.5×</option>
                  <option value="2">2×</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

**Testing Checklist:**
- [ ] Vinyl animation spins smoothly
- [ ] Frequency visualizer updates (20fps)
- [ ] Lyrics auto-scroll to active line
- [ ] Active lyric highlights correctly
- [ ] All controls functional (shuffle, repeat, speed)
- [ ] Volume slider works
- [ ] Mobile layout stacks vertically

---

### WEEK 4-4.5: AUDIO TAB REDESIGN (4 improvements)

#### Implementation: AudioGenerationView.tsx

```typescript
import { motion } from 'framer-motion';
import { useState } from 'react';

const models = [
  { 
    id: 'v3.5', 
    name: 'V3.5', 
    description: 'Classic sound, reliable',
    color: 'from-blue-400 to-cyan-500'
  },
  { 
    id: 'v4', 
    name: 'V4', 
    description: 'Improved quality, faster',
    color: 'from-purple-400 to-pink-500'
  },
  { 
    id: 'v5', 
    name: 'V5', 
    description: 'Latest model, best quality',
    color: 'from-orange-400 to-red-500',
    badge: 'NEW'
  },
];

export function AudioGenerationView({ song, onGenerate }) {
  const [selectedModel, setSelectedModel] = useState('v5');
  const [isInstrumental, setIsInstrumental] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 1. Interactive Model Selector Cards
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Select Suno Model</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {models.map((model) => (
            <motion.button
              key={model.id}
              className={`relative p-6 rounded-2xl border-2 transition-all ${
                selectedModel === model.id
                  ? 'border-white shadow-2xl'
                  : 'border-white/20 hover:border-white/40'
              }`}
              style={{
                background: selectedModel === model.id
                  ? `linear-gradient(135deg, ${model.color})`
                  : 'rgba(255,255,255,0.05)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedModel(model.id)}
            >
              {/* Badge */}
              {model.badge && (
                <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-white text-black rounded-full">
                  {model.badge}
                </span>
              )}

              {/* Model Name */}
              <div className="text-2xl font-bold text-white mb-2">
                {model.name}
              </div>

              {/* Description */}
              <p className="text-sm text-white/80">
                {model.description}
              </p>

              {/* Check Icon */}
              {selectedModel === model.id && (
                <motion.div
                  className="absolute bottom-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <CheckIcon className="w-4 h-4 text-black" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 2. Smooth Animated Toggle */}
      <div className="flex items-center justify-between p-4 glass-card rounded-xl">
        <div>
          <h4 className="text-sm font-semibold text-white">Instrumental</h4>
          <p className="text-xs text-gray-400">Generate without vocals</p>
        </div>
        
        <motion.button
          className={`relative w-14 h-8 rounded-full transition-colors ${
            isInstrumental ? 'bg-gradient-to-r from-cyan-400 to-purple-500' : 'bg-white/20'
          }`}
          onClick={() => setIsInstrumental(!isInstrumental)}
          aria-label="Toggle instrumental mode"
        >
          <motion.div
            className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
            animate={{ x: isInstrumental ? 26 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </div>

      {/* 3. Live Preview Card */}
      <motion.div
        className="p-6 glass-card-elevated rounded-2xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="text-sm font-semibold text-white">Preview</h4>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Model:</span>
            <span className="text-white font-semibold">
              {models.find(m => m.id === selectedModel)?.name}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Mode:</span>
            <span className="text-white font-semibold">
              {isInstrumental ? 'Instrumental' : 'With Vocals'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Est. Time:</span>
            <span className="text-white font-semibold">~30 seconds</span>
          </div>
        </div>

        {/* Mock Waveform Preview */}
        <div className="flex items-center justify-center gap-1 h-16 bg-black/30 rounded-lg px-4">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-cyan-500/30 to-purple-500/30 rounded-full"
              style={{ height: `${Math.random() * 60 + 20}%` }}
            />
          ))}
        </div>
      </motion.div>

      {/* 4. Epic Generate Button */}
      <motion.button
        className="w-full relative overflow-hidden py-6 rounded-2xl font-bold text-lg text-white shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #f472b6 100%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: isGenerating ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
        }}
        transition={{
          duration: 3,
          repeat: isGenerating ? Infinity : 0,
          ease: 'linear',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGenerate}
        disabled={isGenerating}
      >
        {/* Shine Effect */}
        {!isGenerating && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        )}

        {/* Button Text */}
        <span className="relative z-10">
          {isGenerating ? (
            <span className="flex items-center justify-center gap-3">
              <motion.div
                className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Generating Audio...
            </span>
          ) : (
            '🎵 Generate Audio Now'
          )}
        </span>

        {/* Particle Effects */}
        {isGenerating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </motion.button>

      {/* Status Display */}
      {isGenerating && (
        <motion.div
          className="p-4 glass-card rounded-xl space-y-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className="flex items-center gap-2 text-sm text-white">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Status: Processing...
          </div>
          <div className="text-xs text-gray-400">
            Your audio is being generated. This usually takes 20-40 seconds.
          </div>
        </motion.div>
      )}
    </div>
  );
}
```

**Testing Checklist:**
- [ ] Model cards interactive
- [ ] Selected card highlights with gradient
- [ ] Toggle animates smoothly
- [ ] Preview card updates with selections
- [ ] Generate button animates (gradient + shine)
- [ ] Status display shows during generation
- [ ] Mobile layout stacks cards

---

## PHASE 2 DELIVERABLES CHECKLIST

### MiniPlayer
- [ ] Gradient animated border
- [ ] 3D album art hover
- [ ] Waveform visualization (40 bars at 60fps)
- [ ] Interactive progress bar (seekable)
- [ ] Volume control popup
- [ ] Smart context buttons

### FullPlayerView
- [ ] Dynamic animated background
- [ ] 3D spinning vinyl disc
- [ ] Frequency spectrum visualizer (64 bars at 20fps)
- [ ] Synced lyrics with auto-scroll
- [ ] Advanced controls (shuffle, repeat, speed, volume)

### Audio Generation Tab
- [ ] Interactive model selector cards
- [ ] Smooth animated toggle
- [ ] Live preview card
- [ ] Epic generate button with animations
- [ ] Real-time status display

### Performance
- [ ] Waveform runs at 60fps on desktop
- [ ] Visualizer runs at 20fps without lag
- [ ] No memory leaks (Web Audio API cleanup)
- [ ] Mobile performance acceptable (30fps minimum)

---

## PHASE 3: DESIGN SYSTEM & POLISH

### Week 5-7 (15 days, 120 hours, $15,000)

---

## 📐 PHASE 3 DESIGN SPECIFICATIONS
### Design System by Gemini 3.0 Pro

**See full specifications in:** `/docs/DESIGN_SYSTEM_SPECS.md`

**Quick Reference:**

**Color Palette:**
- Primary: Sky-400 (#38BDF8), gradient Cyan-400→Purple-500
- Secondary: Purple-500 (#A855F7)
- Accent: Pink-400 (#F472B6)
- Status: Success (Green-300), Warning (Amber-300), Error (Red-300), Info (Blue-300)
- Neutrals: Slate scale 50-950

**Typography Scale:**
- 2xs: 10px | xs: 11px | sm: 12px | base: 14px | lg: 16px | xl: 20px | 2xl: 24px | 3xl: 32px | 4xl: 40px
- Line heights: Tight 1.25 (headings), Normal 1.5 (body), Relaxed 1.75 (lyrics)
- Weights: Regular 400, Medium 500, Semibold 600, Bold 700

**Spacing System (8px grid):**
- space-1: 4px | space-2: 8px | space-3: 12px | space-4: 16px | space-6: 24px | space-8: 32px

**Component Variants:**
- **Button:** Primary (gradient), Secondary (glass bg-white/5), Ghost (transparent), Danger (red tint)
- **Card:** Flat (bg-white/3), Elevated (bg-white/7 + shadow-xl), High (Slate-900 + shadow-3xl)
- **Input:** Default (bg-white/3), Focus (Sky-400 ring), Error (Red-500 border)
- **Badge:** 5 variants with semantic colors, NEW badge with gradient + pulse

**Theme Adaptations:**
- Light: bg-Slate-50, text-Slate-900, borders Slate-200
- Midnight: bg-Black, higher contrast borders, more vibrant colors

---

### WEEK 5: COMPONENT LIBRARY (5 days)

#### 5.1 Create `/components/ui/` Folder

```typescript
// Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading, 
  disabled,
  children,
  onClick 
}: ButtonProps) {
  const baseClasses = 'rounded-full font-semibold transition-all focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-cyan-400 to-purple-500 text-white hover:opacity-90',
    secondary: 'glass-button text-white hover:bg-white/20',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    danger: 'bg-gradient-to-br from-red-500 to-pink-600 text-white hover:opacity-90',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : children}
    </motion.button>
  );
}

// Card.tsx
export function Card({ children, elevated = false }) {
  return (
    <div className={elevated ? 'glass-card-elevated' : 'glass-card'}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="p-4 border-b border-white/10">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}

export function CardFooter({ children }) {
  return <div className="p-4 border-t border-white/10">{children}</div>;
}

// Input.tsx
export function Input({ label, error, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 glass-input rounded-xl text-white ${
          error ? 'border-red-500 focus:border-red-500' : ''
        }`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

// Badge.tsx
export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-white/10 text-gray-300',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-300 border border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
}
```

#### 5.2 Refactor Existing Components

Update all existing components to use new design system:
- Replace custom buttons with `<Button>`
- Replace divs with `<Card>`, `<CardHeader>`, etc.
- Replace input fields with `<Input>`
- Replace badges with `<Badge>`

**Estimated refactoring time:** 2 days (all 17 components)

---

### WEEK 5.5-6: THEME SYSTEM (3 days)

#### 6.1 Create Theme Context

```typescript
// /contexts/ThemeContext.tsx

export type Theme = 'dark' | 'light' | 'midnight';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<Theme>('dark');
  
  useEffect(() => {
    // Apply theme class to body
    document.body.className = `theme-${theme}`;
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

#### 6.2 Define Light Mode Palette

```css
/* /styles/themes.css */

/* Dark Theme (default) */
:root,
.theme-dark {
  --color-background: #020617;
  --color-surface: #0f172a;
  --color-elevated: #1e293b;
  --color-text-primary: #ffffff;
  --color-text-secondary: #9ca3af;
  --color-border: rgba(255, 255, 255, 0.1);
}

/* Light Theme */
.theme-light {
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-elevated: #f1f5f9;
  --color-text-primary: #0f172a;
  --color-text-secondary: #64748b;
  --color-border: rgba(0, 0, 0, 0.1);
}

/* Midnight Theme (deeper dark) */
.theme-midnight {
  --color-background: #000000;
  --color-surface: #0a0a0a;
  --color-elevated: #1a1a1a;
  --color-text-primary: #ffffff;
  --color-text-secondary: #737373;
  --color-border: rgba(255, 255, 255, 0.05);
}
```

#### 6.3 Theme Toggle Component

```typescript
export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  const themes: Theme[] = ['dark', 'light', 'midnight'];
  
  return (
    <div className="flex gap-2 p-2 glass-card rounded-full">
      {themes.map((t) => (
        <motion.button
          key={t}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            theme === t 
              ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(t)}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </motion.button>
      ))}
    </div>
  );
}
```

---

### WEEK 6.5-7: ADVANCED FEATURES (3 days)

#### 7.1 History Search & Filter

```typescript
// Update SongHistorySidebar.tsx

function SongHistorySidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModel, setFilterModel] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  
  const filteredSongs = songs
    .filter(song => {
      // Search by title/lyrics/genre
      const matchesSearch = searchQuery === '' || 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.lyrics?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.genre?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by model
      const matchesModel = filterModel === null || song.model === filterModel;
      
      return matchesSearch && matchesModel;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  
  return (
    <div className="space-y-4 p-4">
      {/* Search */}
      <Input
        placeholder="Search songs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      {/* Filters */}
      <div className="flex gap-2">
        <select 
          value={filterModel || ''}
          onChange={(e) => setFilterModel(e.target.value || null)}
          className="glass-input px-3 py-2 rounded-lg text-sm"
        >
          <option value="">All Models</option>
          <option value="v3.5">V3.5</option>
          <option value="v4">V4</option>
          <option value="v5">V5</option>
        </select>
        
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
          className="glass-input px-3 py-2 rounded-lg text-sm"
        >
          <option value="date">Date</option>
          <option value="title">Title</option>
        </select>
      </div>
      
      {/* Results */}
      <div className="space-y-2">
        {filteredSongs.map(song => (
          <SongHistoryItem key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}
```

#### 7.2 Export to PDF/JSON

```typescript
// Install jsPDF
npm install jspdf

// /utils/export.ts
import jsPDF from 'jspdf';

export function exportToPDF(song: GeneratedSong) {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text(song.title, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Genre: ${song.genre}`, 20, 35);
  doc.text(`Style: ${song.stylePrompt}`, 20, 42);
  
  doc.setFontSize(14);
  doc.text('Lyrics:', 20, 55);
  
  doc.setFontSize(10);
  const lyrics = doc.splitTextToSize(song.lyrics, 170);
  doc.text(lyrics, 20, 65);
  
  doc.save(`${song.title}.pdf`);
}

export function exportToJSON(song: GeneratedSong) {
  const data = JSON.stringify(song, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${song.title}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}
```

---

**Continue to [Part 4: Phase 4 & Launch →](IMPLEMENTATION_ROADMAP_PART_4_LAUNCH.md)**
