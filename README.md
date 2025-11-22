# CalcNotes - Offline Calculator & Notes App

A fully offline mobile Progressive Web App (PWA) combining a dual-mode calculator and smart notes functionality.

![CalcNotes App](icon-512.png)

## ✨ Features

### 🧮 Dual-Mode Calculator
- **Normal Mode**: Basic arithmetic, percentage, memory functions (M+, M-, MR, MC)
- **Scientific Mode**: Trigonometry, logarithms, exponentials, factorials, angle conversion (DEG/RAD)
- Keyboard support for quick calculations
- Instant mode switching

### 📝 Smart Notes
- Full CRUD operations (Create, Read, Update, Delete)
- Auto-save functionality (debounced at 500ms)
- Search and filter notes by title or content
- Pin/favorite important notes
- Timestamps (created and last modified)
- Local storage for data persistence

### 📱 PWA Capabilities
- **Fully Offline**: Works without internet connection via Service Worker
- **Installable**: Add to home screen as standalone app
- **Responsive**: Optimized for mobile and desktop
- **Dark Theme**: Battery-efficient design
- **Fast**: Zero external dependencies

## 🚀 Quick Start

### Option 1: Direct File Access
Simply open `index.html` in your browser:
```
file:///path/to/index.html
```

### Option 2: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server -p 8000

# Then open http://localhost:8000
```

### Install as PWA
1. Open the app in Chrome or Edge
2. Click the install icon in the address bar
3. Or use browser menu → "Install CalcNotes"
4. App opens as standalone application

## 📁 Project Structure

```
├── index.html          # Main application structure
├── styles.css          # Modern CSS with design system
├── calculator.js       # Calculator module (Normal + Scientific)
├── notes.js           # Notes module with CRUD operations
├── manifest.json      # PWA manifest configuration
├── service-worker.js  # Offline functionality
├── icon-*.png        # App icons (72px to 512px)
└── README.md         # This file
```

## 🎮 Usage

### Calculator
1. Switch to **Calculator** tab
2. Use on-screen buttons or keyboard
3. Click **Scientific** button to toggle mode
4. Use **DEG/RAD** button for angle units
5. Memory buttons store values across calculations

### Notes
1. Switch to **Notes** tab
2. Click **+** button to create new note
3. Type title and content (auto-saves)
4. Click **back arrow** to return to list
5. Use **search bar** to filter notes
6. Click **pin icon** to favorite a note
7. Click **trash icon** to delete (with confirmation)

## 🛠️ Technical Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Storage**: LocalStorage API
- **Offline**: Service Worker with cache-first strategy
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Fonts**: Inter (Google Fonts)
- **Icons**: SVG inline icons

## 🌟 Key Highlights

- ✅ Zero framework dependencies
- ✅ Complete offline functionality
- ✅ Modern, responsive UI with smooth animations
- ✅ Local-first data architecture
- ✅ Privacy-focused (no external API calls)
- ✅ Battery-efficient dark theme
- ✅ Keyboard shortcuts support
- ✅ PWA best practices

## 📱 Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| LocalStorage | ✅ | ✅ | ✅ | ✅ |
| PWA Install | ✅ | ✅ | ⚠️ | ⚠️ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |

*⚠️ = Limited PWA installation support*

## 🎨 Design Philosophy

- **Mobile-First**: Optimized for touch interfaces
- **Offline-First**: Zero dependency on network connectivity
- **Privacy-First**: All data stored locally on device
- **Performance-First**: Minimal resource usage

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Developer

Built with ❤️ as a fully offline, privacy-focused productivity tool.

---

**Note**: This application requires no backend server and stores all data locally in your browser's storage.
