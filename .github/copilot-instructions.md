<!-- Copilot customization for 3D Town Navigation Demo -->

## Project Setup Checklist

- [x] Verify copilot-instructions.md file in .github directory
- [x] Scaffold the Vite React project
- [x] Install project dependencies
- [x] Add town-nav-demo component and integrate with App
- [x] Create and run dev server task
- [x] Verify project runs successfully

## Project Context

This is a Vite + React + TypeScript project featuring a 3D town navigation demo using Three.js.

### Key Features
- Interactive 3D scene with multiple building sections
- Point-and-click navigation between locations
- Real-time coordinate display and status HUD
- Animated character movement with pathfinding
- Dynamic lighting, shadows, and particle effects
- Beautiful dark-themed environment with multiple buildings

### Technologies
- Vite 4 (build tool and dev server)
- React 18 (UI framework)
- Three.js (3D graphics library)
- TypeScript (type safety)

### Development Server
Run `npm run dev` to start the development server at http://localhost:5173

The application features:
- 5 interactive buildings: About Us, Projects, Work, Contact, Lab
- Real-time character animation with walking, bobbing, and particle effects
- Smooth camera follow
- Responsive design with automatic resizing

### Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build

### Project Files
- `src/components/TownNavDemo.tsx` - Main 3D scene component (600+ lines)
- `src/App.tsx` - Root component
- `src/main.tsx` - React entry point
- `src/index.css` - Global styles
- `src/App.css` - App styling
- `vite.config.ts` - Vite configuration

### Status: ✅ COMPLETE

All setup tasks completed and verified. The 3D town navigation demo is fully operational with:
- ✅ Interactive character movement
- ✅ Point-and-click navigation UI
- ✅ Real-time HUD display
- ✅ 3D scene rendering with Three.js
- ✅ Smooth animations and transitions
- ✅ Development server running on localhost:5173
