# Dropbox Clone Frontend

A premium React application built with **Vite** and **Tailwind CSS v4**.

## 🎨 Design Philosophy
- **Glassmorphism**: Using backdrop blurs and subtle white borders for a modern feel.
- **Micro-animations**: Smooth transitions using `framer-motion`.
- **Responsive**: Fully adapted for desktop and mobile layouts.

## 📦 Core Components
- **App**: Main orchestrator for state and layout.
- **FileUpload**: Drag-and-drop zone with MIME validation.
- **FileList**: Interactive items with dynamic icons and size formatting.
- **FilePreview**: Modal viewer for text, images, and JSON.

## 🛠️ Styling (Tailwind v4)
This project uses **Tailwind CSS v4**. Note the modern syntax in `index.css`:
- `@import "tailwindcss"`
- `@reference "tailwindcss"`
- Slash-opacity utility classes: `bg-white/70`.

## 🚀 Development
```bash
npm install
npm run dev
```
By default, the dev server runs on `http://localhost:5173`.
