# 3D Town Navigation Demo

A beautiful, interactive 3D wayfinding navigation experience built with **React**, **Three.js**, and **Vite**.

## Features

- 🌆 **Interactive 3D Scene** - Navigate through a stylized town with five colorful buildings
- 🧑 **Character Movement** - Control a low-poly explorer character to walk between locations
- 🎮 **Point-and-Click Navigation** - Simple button-based wayfinding system
- 📍 **Real-time HUD** - Live coordinate display and movement status
- ✨ **Dynamic Animations** - Smooth camera follow, character bobbing, footstep particles, and beacon pulses
- 🎨 **Beautiful Aesthetics** - Dark theme with colorful accent lighting and shadows

## Project Setup

### Prerequisites
- Node.js (v16+)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Controls

- **Mouse**: Navigate and look around (via camera follow)
- **Buttons**: Click on any section button to navigate to that location
  - About Us
  - Projects
  - Work
  - Contact
  - Lab

## Architecture

### Key Files

- `src/App.tsx` - Main application component
- `src/components/TownNavDemo.tsx` - Core 3D scene and interaction logic
- `src/index.css` - Global styles
- `vite.config.ts` - Vite configuration with React plugin

### Technologies

- **React 18** - UI framework
- **Three.js** - 3D graphics library
- **Vite 4** - Build tool and dev server
- **TypeScript** - Type-safe development

### Scene Elements

- **Buildings**: Five colorful structures (About, Projects, Work, Contact, Lab) with names, doors, windows, and glowing details
- **Paths**: Connecting routes from the central plaza to each building
- **Character**: A simple low-poly explorer with animated walking, bobbing, and a beacon ring
- **Particles**: Footstep dust effects during movement
- **Lighting**: Hemisphere light, directional moon light, and point light for ambiance
- **Environment**: Grid floor, fog, and dark atmospheric background

## Interaction Flow

1. Character starts at the center plaza
2. Click a destination button to initiate travel
3. Character navigates to the hub (if needed), then to the destination building
4. Character arrives and the door glows brightly
5. HUD displays current coordinates and status

## Browser Compatibility

Works best in modern browsers with WebGL support:
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Performance Notes

- Optimized for 60fps on standard hardware
- Uses efficient shadow mapping and material settings
- Responsive design with automatic resizing

## License

MIT

## Credits

Interactive 3D navigation demo - Proof of Concept
