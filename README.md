<div align="center">

<h1>📱 Mobile Disk Usage Analyzer</h1>
<h3>Beautifully designed, mobile-first disk & data usage visualizer</h3>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-JSX-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Mobile First](https://img.shields.io/badge/Mobile-First-00C896?style=for-the-badge&logo=android&logoColor=white)
![No Build](https://img.shields.io/badge/No%20Build-Zero%20Config-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br/>

> A clean, intuitive **mobile-first UI/UX** for analyzing disk and data usage — delivered as lightweight, zero-dependency HTML files you can open directly in any browser, no install needed.

<br/>

[✨ Features](#-features) • [🚀 Quick Start](#-quick-start) • [📁 Files](#-files-in-this-repo) • [📐 UI Design](#-ui--ux-design) • [🔧 Customization](#-customization) • [🤝 Contributing](#-contributing)

</div>

---

## ✨ Features

### 📊 Visual Data Analysis
- **Interactive charts** — pie charts, progress bars, and bar graphs for at-a-glance storage breakdown
- **Category breakdown** — images, videos, audio, documents, apps, system files, and other
- **Size formatting** — automatic conversion between B, KB, MB, GB for readable display
- **Color-coded categories** — consistent visual language across all views

### 📱 Mobile-First UI/UX
- Designed specifically for **small screen usability** — thumb-friendly tap targets, readable font sizes
- **Responsive layout** that adapts naturally to phone, tablet, and desktop viewports
- Smooth, native-feeling **CSS animations and transitions**
- Clean card-based design with well-structured information hierarchy

### ⚡ Zero Dependencies
- Runs as a **plain HTML file** — open in any browser, no server or build step needed
- `DiskAnalyzer.html` — Version 1, pure HTML + CSS + vanilla JS
- `DiskAnalyzerV2.html` — Version 2, refined UI with improved layout and interactions
- `Diskanalyzer.jsx` — React component version for embedding into React projects

### 🎨 Two Complete Versions
- **V1** (`DiskAnalyzer.html`) — clean, functional baseline implementation
- **V2** (`DiskAnalyzerV2.html`) — polished design iteration with enhanced UX and visual improvements

---

## 🚀 Quick Start

### Option 1 — Open Directly in Browser (Easiest)

```bash
# Clone the repo
git clone https://github.com/MilindLate/mobile-Disk-Usage-Analyzer.git
cd mobile-Disk-Usage-Analyzer

# Open V2 (recommended) directly in your default browser
# On Linux:
xdg-open DiskAnalyzerV2.html

# On macOS:
open DiskAnalyzerV2.html

# On Windows:
start DiskAnalyzerV2.html
```

Or simply **double-click** `DiskAnalyzerV2.html` in your file manager.

> ✅ No npm, no server, no build tools required — it just works.

### Option 2 — Serve Locally (Optional)

If you prefer a local server (e.g., to avoid any browser CORS restrictions):

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js (npx)
npx serve .

# Then open:
# http://localhost:8080/DiskAnalyzerV2.html
```

### Option 3 — Use the React Component

Copy `Diskanalyzer.jsx` into your React project:

```bash
cp Diskanalyzer.jsx your-react-project/src/components/DiskAnalyzer.jsx
```

Then import and use it:

```jsx
import DiskAnalyzer from './components/DiskAnalyzer';

function App() {
  return (
    <div>
      <DiskAnalyzer />
    </div>
  );
}
```

---

## 📁 Files in This Repo

| File | Type | Description |
|------|------|-------------|
| `DiskAnalyzer.html` | HTML + JS | **Version 1** — Core disk usage analyzer, clean baseline UI |
| `DiskAnalyzerV2.html` | HTML + JS | **Version 2** — Refined UI/UX with improved visuals and layout ✅ Recommended |
| `Diskanalyzer.jsx` | React JSX | React component version — drop into any React/Next.js project |

---

## 📐 UI & UX Design

### Design Goals

The primary goal of this project is to solve a real mobile usability problem: **disk usage apps are usually desktop-first and hard to read on phones**. This project inverts that — designing for the smallest screen first, then scaling up.

### Key Design Decisions

| Design Choice | Rationale |
|--------------|-----------|
| **Card-based layout** | Each storage category is a scannable card — easy to skim on a phone |
| **Large tap targets** | All interactive elements are at least 44×44px — thumb-friendly |
| **Color-coded categories** | Instant visual recognition without reading text labels |
| **Circular/donut chart** | Best use of vertical mobile space vs. horizontal bar charts |
| **Progress bars per category** | Relative comparison at a glance — no mental math needed |
| **Bottom-anchored controls** | Reachable with one thumb on tall phones |
| **High contrast text** | Readable in outdoor / bright-screen conditions |

### Layout Structure

```
┌─────────────────────────┐
│  Header / App Title     │
├─────────────────────────┤
│                         │
│   Donut / Pie Chart     │
│   (total usage visual)  │
│                         │
├─────────────────────────┤
│  Storage Summary Card   │
│  Used: X GB / Total: Y  │
├─────────────────────────┤
│  Category Cards         │
│  ┌───────────────────┐  │
│  │ 🖼 Images   2.3 GB│  │
│  │ ████████░░  58%   │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ 🎵 Audio    1.1 GB│  │
│  │ ████░░░░░░  28%   │  │
│  └───────────────────┘  │
│  ...                    │
└─────────────────────────┘
```

### V1 → V2 Improvements

| Area | V1 | V2 |
|------|----|----|
| Chart | Simple bar chart | Animated donut/pie chart |
| Category icons | Text labels | Emoji / icon prefixes |
| Color palette | Basic colors | Curated, accessible palette |
| Spacing | Functional | Refined padding and rhythm |
| Animations | None | Smooth transitions on load |
| Summary card | Basic text | Visual used/free split |
| Typography | System default | Consistent size scale |

---

## 🎨 Color System

Each file category has a consistent color used across charts and category cards:

| Category | Color | Hex |
|----------|-------|-----|
| 🖼️ Images | Coral | `#FF6B6B` |
| 🎬 Videos | Blue | `#4ECDC4` |
| 🎵 Audio | Purple | `#A29BFE` |
| 📄 Documents | Yellow | `#FFEAA7` |
| 📦 Apps | Orange | `#FD9644` |
| ⚙️ System | Gray-Blue | `#74B9FF` |
| 🗂️ Other | Light Gray | `#DFE6E9` |

---

## 🔧 Customization

### Change Storage Data (HTML Versions)

The storage data is defined as a JavaScript object near the top of each HTML file. Edit the values to match your actual device:

```javascript
const storageData = {
  total: 128,        // Total storage in GB
  used: 89.4,        // Used storage in GB
  categories: [
    { name: 'Images',    size: 23.5, color: '#FF6B6B', icon: '🖼️' },
    { name: 'Videos',    size: 18.2, color: '#4ECDC4', icon: '🎬' },
    { name: 'Audio',     size: 11.1, color: '#A29BFE', icon: '🎵' },
    { name: 'Documents', size: 8.4,  color: '#FFEAA7', icon: '📄' },
    { name: 'Apps',      size: 17.6, color: '#FD9644', icon: '📦' },
    { name: 'System',    size: 7.2,  color: '#74B9FF', icon: '⚙️' },
    { name: 'Other',     size: 3.4,  color: '#DFE6E9', icon: '🗂️' },
  ]
};
```

### Change Color Theme

The color palette is defined using CSS custom properties at the top of each file:

```css
:root {
  --bg-primary:    #0F0F23;   /* Dark background */
  --bg-card:       #1A1A2E;   /* Card background */
  --text-primary:  #EAEAEA;   /* Main text */
  --text-secondary:#A0A0B0;   /* Muted text */
  --accent:        #6C63FF;   /* Accent / highlight */
  --border:        #2A2A3E;   /* Card borders */
}
```

Switch to a light theme by changing these variables.

### Use React Component with Real Data

Pass your own data as props to the JSX component:

```jsx
<DiskAnalyzer
  totalStorage={128}
  usedStorage={89.4}
  categories={[
    { name: 'Images', size: 23.5, color: '#FF6B6B', icon: '🖼️' },
    // ...
  ]}
/>
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Target | Layout |
|-----------|--------|--------|
| `< 480px` | Small phones | Single column, compact cards |
| `480px – 768px` | Large phones / small tablets | Single column, comfortable spacing |
| `768px – 1024px` | Tablets | Two-column category grid |
| `> 1024px` | Desktop | Two-column with sidebar chart |

---

## 🤝 Contributing

Contributions, feedback, and UI improvement ideas are welcome!

```bash
# 1. Fork the repo on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/mobile-Disk-Usage-Analyzer.git

# 3. Create a feature branch
git checkout -b feature/your-improvement

# 4. Make your changes — open the HTML file in browser to test
open DiskAnalyzerV2.html

# 5. Commit and push
git add .
git commit -m "improve: describe your change"
git push origin feature/your-improvement

# 6. Open a Pull Request
```

### Ideas for Contribution

- [ ] Add a **dark / light theme toggle**
- [ ] Add **animated number counters** on page load
- [ ] Add a **drill-down view** to see files within each category
- [ ] Add **localStorage persistence** so data survives page refresh
- [ ] Add **export to JSON/CSV** button
- [ ] Create a **PWA version** with a manifest and service worker
- [ ] Add **drag-to-compare** between two storage profiles

---

## 🛠️ Troubleshooting

<details>
<summary>❌ Page looks unstyled or broken</summary>

- Make sure you are opening the file in a **modern browser** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Try a different browser — some privacy-focused browsers block inline scripts
- If using the JSX file directly, you need a React build environment — see [Option 3](#option-3--use-the-react-component) above

</details>

<details>
<summary>❌ Charts not rendering</summary>

- The charts are drawn using the **Canvas API** — ensure your browser supports it (all modern browsers do)
- Try a hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (macOS)
- Check browser console (F12 → Console) for any JavaScript errors

</details>

<details>
<summary>❌ File opened but shows blank page</summary>

- Some browsers block JavaScript in locally-opened HTML files — use a local server instead:
  ```bash
  npx serve .
  # then open http://localhost:3000/DiskAnalyzerV2.html
  ```

</details>

<details>
<summary>❌ JSX version not working in React project</summary>

- Ensure your project has React 16.8+ installed
- If using Vite or Create React App, make sure the file has a `.jsx` extension
- The component expects props — check the [customization section](#-customization) for the correct prop format

</details>

---



<div align="center">

Built with ❤️ by <a href="https://github.com/MilindLate">MilindLate</a>

<br/><br/>

<b>Mobile Disk Usage Analyzer</b> &nbsp;|&nbsp; HTML + JS &nbsp;|&nbsp; React JSX &nbsp;|&nbsp; Mobile-First UI

<br/><br/>

⭐ If this helped you, consider giving it a star!

</div>
