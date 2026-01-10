# Typeface Dropbox Clone

A modern, simplified Dropbox clone featuring a React frontend and a Node.js/Express backend. Users can upload, list, download, and preview files in a sleek, glassmorphism-inspired interface.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### 1. Setup Backend
```bash
cd server
npm install
npm start
```
The server will run on `http://localhost:5001`.

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```text
.
├── client/                # React (Vite) Frontend
│   ├── src/components/    # UI Components (Upload, List, Preview)
│   └── src/index.css      # Tailwind v4 Styles
├── server/                # Node.js/Express Backend
│   ├── uploads/           # Physical file storage
│   ├── database.sqlite    # Metadata storage
│   └── index.js           # API Endpoints
└── Requirement/           # Project specifications
```

## ✨ Key Features
- **Modern UI**: Glassmorphism design with Tailwind CSS v4 and Framer Motion.
- **File Restrictions**: Only `txt`, `jpg`, `png`, and `json` are allowed.
- **Live Preview**: View images and code files directly in the browser.
- **Persistent Storage**: SQLite tracks metadata, local filesystem stores files.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS v4, Lucide Icons, Framer Motion, Axios.
- **Backend**: Node.js, Express, Multer (File handles), SQLite3 (Metadata).
