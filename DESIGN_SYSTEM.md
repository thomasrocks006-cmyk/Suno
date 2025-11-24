# Suno v5 Architect - Design System

> **Consistent, accessible, and beautiful UI patterns for the Suno platform.**

---

## 🎨 Color Palette

### Primary Colors
```css
--suno-dark: #020617;      /* slate-950 - Main background */
--suno-card: #0f172a;      /* slate-900 - Card backgrounds */
--suno-surface: #1e293b;   /* slate-800 - Surface elements */
--suno-primary: #22d3ee;   /* cyan-400 - Primary accent (links, buttons) */
--suno-secondary: #c084fc; /* purple-400 - Secondary accent */
--suno-accent: #f472b6;    /* pink-400 - Tertiary accent */
```

### Usage Guidelines
- **Background:** `bg-suno-dark` for page background
- **Cards:** `bg-suno-card` for contained content
- **Interactive Elements:** `bg-suno-primary` for primary actions
- **Hover States:** Add `/80` opacity (e.g., `hover:bg-suno-primary/80`)
- **Borders:** `border-white/10` for subtle separation

### Semantic Colors
```css
/* Success */
--success: #10b981;        /* green-500 */
--success-bg: rgb(16 185 129 / 0.1);
--success-border: rgb(16 185 129 / 0.3);

/* Error */
--error: #ef4444;          /* red-500 */
--error-bg: rgb(239 68 68 / 0.1);
--error-border: rgb(239 68 68 / 0.5);

/* Warning */
--warning: #f59e0b;        /* amber-500 */
--warning-bg: rgb(245 158 11 / 0.1);
--warning-border: rgb(245 158 11 / 0.3);

/* Info */
--info: #3b82f6;           /* blue-500 */
--info-bg: rgb(59 130 246 / 0.1);
--info-border: rgb(59 130 246 / 0.3);
```

---

## 📐 Spacing Scale

### Tailwind Standard (Base: 4px)
```
1 = 0.25rem (4px)
2 = 0.5rem (8px)
3 = 0.75rem (12px)
4 = 1rem (16px)
6 = 1.5rem (24px)
8 = 2rem (32px)
12 = 3rem (48px)
16 = 4rem (64px)
```

### Common Spacing Patterns
- **Component Padding:** `p-4 md:p-6` (16px mobile, 24px desktop)
- **Card Spacing:** `p-6` (24px)
- **Modal Padding:** `p-6 md:p-8` (24px mobile, 32px desktop)
- **Section Gaps:** `space-y-6` or `gap-6` (24px vertical spacing)
- **Button Padding:** `px-4 py-2` (16px horizontal, 8px vertical)

---

## 🔤 Typography

### Font Families
```css
--font-sans: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Type Scale
```css
/* Display - Hero text */
text-4xl md:text-6xl      /* 36px → 60px */
font-bold

/* Heading 1 */
text-2xl md:text-4xl      /* 24px → 36px */
font-bold

/* Heading 2 */
text-xl md:text-2xl       /* 20px → 24px */
font-semibold

/* Heading 3 */
text-lg                   /* 18px */
font-semibold

/* Body Large */
text-base                 /* 16px */
font-normal

/* Body */
text-sm                   /* 14px */
font-normal

/* Small */
text-xs                   /* 12px */
font-normal

/* Tiny */
text-[10px]               /* 10px */
font-normal
```

### Text Colors
- **Primary:** `text-white` - Main content
- **Secondary:** `text-gray-400` - Supporting text
- **Tertiary:** `text-gray-500` - Muted text
- **Accent:** `text-suno-primary` - Links, highlights
- **Error:** `text-red-400` - Error messages

### Text Styles
```css
/* Uppercase Labels */
text-xs font-bold uppercase tracking-wider text-gray-400

/* Code/Mono */
font-mono text-xs text-gray-300

/* Truncate */
truncate min-w-0

/* Multi-line Truncate */
line-clamp-2
```

---

## 🔘 Buttons

### Primary Button
```tsx
<button className="bg-suno-primary hover:bg-suno-primary/80 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg">
  Primary Action
</button>
```

### Secondary Button
```tsx
<button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
  Secondary Action
</button>
```

### Ghost Button
```tsx
<button className="text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded transition-colors">
  Ghost Action
</button>
```

### Icon Button
```tsx
<button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
  <svg className="w-5 h-5">...</svg>
</button>
```

### Pill Button
```tsx
<button className="bg-suno-primary hover:bg-suno-primary/80 text-white px-6 py-2 rounded-full text-sm font-bold transition-all hover:scale-105">
  Pill Action
</button>
```

### Button Sizes
```css
/* Small */
px-3 py-1.5 text-xs

/* Medium (Default) */
px-4 py-2 text-sm

/* Large */
px-6 py-3 text-base
```

### Button States
```tsx
/* Disabled */
disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100

/* Loading */
opacity-50 cursor-wait

/* Active/Selected */
bg-suno-primary text-white ring-2 ring-suno-primary/50
```

---

## 📦 Cards

### Basic Card
```tsx
<div className="bg-suno-card rounded-xl border border-white/10 p-6">
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-gray-400">Card content goes here.</p>
</div>
```

### Gradient Card
```tsx
<div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/50 rounded-xl p-6">
  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Gradient Card</h3>
  <p className="text-gray-300">Enhanced visual hierarchy.</p>
</div>
```

### Hover Card
```tsx
<div className="bg-suno-card rounded-xl border border-white/10 p-6 hover:border-white/20 hover:bg-suno-surface/50 transition-all cursor-pointer">
  <h3 className="text-lg font-semibold mb-2">Hover Card</h3>
  <p className="text-gray-400">Interactive card.</p>
</div>
```

### Compact Card
```tsx
<div className="bg-black/30 rounded-lg border border-white/5 p-4">
  <p className="text-sm text-gray-300">Compact content</p>
</div>
```

---

## 🪟 Modals

### Full Screen Modal
```tsx
<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
  <div className="bg-suno-card rounded-2xl border border-white/10 max-w-6xl w-full max-h-[90vh] overflow-hidden">
    {/* Header */}
    <div className="border-b border-white/10 p-6 flex items-center justify-between">
      <h2 className="text-xl font-bold">Modal Title</h2>
      <button className="p-2 hover:bg-white/10 rounded-full">
        <svg className="w-5 h-5">...</svg>
      </button>
    </div>
    
    {/* Content */}
    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
      Content here
    </div>
  </div>
</div>
```

### Centered Modal
```tsx
<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
  <div className="bg-suno-card rounded-xl border border-white/10 p-6 max-w-md w-full shadow-2xl">
    <h2 className="text-xl font-bold mb-4">Modal Title</h2>
    <p className="text-gray-400 mb-6">Modal content</p>
    <div className="flex gap-3 justify-end">
      <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg">Cancel</button>
      <button className="bg-suno-primary hover:bg-suno-primary/80 px-4 py-2 rounded-lg">Confirm</button>
    </div>
  </div>
</div>
```

---

## 📋 Forms

### Input Field
```tsx
<div>
  <label className="block text-sm font-semibold text-gray-400 mb-2">Label</label>
  <input 
    type="text"
    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-suno-primary focus:outline-none transition-colors"
    placeholder="Placeholder text"
  />
</div>
```

### Textarea
```tsx
<textarea 
  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-suno-primary focus:outline-none transition-colors min-h-[120px] resize-y"
  placeholder="Enter text here..."
/>
```

### Select Dropdown
```tsx
<select className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-suno-primary focus:outline-none transition-colors">
  <option value="">Select option</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

### Checkbox
```tsx
<label className="flex items-center gap-2 cursor-pointer group">
  <input 
    type="checkbox" 
    className="w-4 h-4 rounded bg-gray-800 border-white/10 text-suno-primary focus:ring-suno-primary focus:ring-2"
  />
  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
    Checkbox label
  </span>
</label>
```

---

## 🎭 Animations

### Fade In
```css
animate-fade-in
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Slide Up
```css
animate-slide-up
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Scale In
```css
hover:scale-105 transition-transform
```

### Pulse (Loading)
```css
animate-pulse
```

### Spin (Loading)
```css
animate-spin
```

---

## 🔔 Notifications & Alerts

### Success Alert
```tsx
<div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
  <svg className="w-5 h-5 text-green-400 flex-shrink-0">...</svg>
  <div>
    <h4 className="font-semibold text-green-400 mb-1">Success!</h4>
    <p className="text-sm text-gray-300">Operation completed successfully.</p>
  </div>
</div>
```

### Error Alert
```tsx
<div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
  <svg className="w-5 h-5 text-red-400 flex-shrink-0">...</svg>
  <div>
    <h4 className="font-semibold text-red-400 mb-1">Error</h4>
    <p className="text-sm text-gray-300">Something went wrong.</p>
  </div>
</div>
```

### Info Alert
```tsx
<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
  <svg className="w-5 h-5 text-blue-400 flex-shrink-0">...</svg>
  <div>
    <h4 className="font-semibold text-blue-400 mb-1">Info</h4>
    <p className="text-sm text-gray-300">Helpful information.</p>
  </div>
</div>
```

---

## 📊 Data Display

### Table
```tsx
<div className="overflow-x-auto rounded-lg border border-white/10">
  <table className="w-full">
    <thead className="bg-white/5 border-b border-white/10">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Column 1</th>
        <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Column 2</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-white/5">
      <tr className="hover:bg-white/5">
        <td className="px-4 py-3 text-sm text-white">Data 1</td>
        <td className="px-4 py-3 text-sm text-gray-400">Data 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Badge
```tsx
<span className="bg-suno-primary/20 text-suno-primary px-2 py-1 rounded-full text-xs font-semibold">
  Badge
</span>
```

### Progress Bar
```tsx
<div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
  <div className="bg-suno-primary h-full" style={{ width: '60%' }} />
</div>
```

---

## ♿ Accessibility

### ARIA Labels
```tsx
<button aria-label="Close modal">
  <svg>...</svg>
</button>

<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Modal Title</h2>
</div>
```

### Focus States
```css
/* All interactive elements should have visible focus */
focus:outline-none focus:ring-2 focus:ring-suno-primary focus:ring-offset-2 focus:ring-offset-suno-dark
```

### Touch Targets
```css
/* Minimum 44x44px on mobile */
@media (max-width: 768px) {
  button, a, [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
```css
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Common Patterns
```tsx
/* Hide on mobile, show on desktop */
<div className="hidden lg:block">Desktop only</div>

/* Mobile column, desktop row */
<div className="flex flex-col md:flex-row gap-4">...</div>

/* Responsive padding */
<div className="p-4 md:p-6 lg:p-8">...</div>

/* Responsive text */
<h1 className="text-2xl md:text-4xl lg:text-6xl">Title</h1>
```

---

## 🎯 Best Practices

1. **Consistency** - Use design tokens, not arbitrary values
2. **Accessibility** - Always include ARIA labels and keyboard support
3. **Performance** - Lazy load heavy components, optimize images
4. **Responsiveness** - Test on mobile (375px), tablet (768px), desktop (1440px)
5. **Dark Mode First** - Design is optimized for dark backgrounds
6. **Touch Friendly** - Minimum 44px touch targets on mobile
7. **Animations** - Keep transitions subtle (200-300ms)
8. **Loading States** - Always show skeleton loaders or spinners
9. **Error Handling** - Clear, actionable error messages
10. **Semantic HTML** - Use proper tags (button, nav, main, section)

---

*Last Updated: November 24, 2025*
