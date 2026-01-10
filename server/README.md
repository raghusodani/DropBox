# Dropbox Clone Backend

The backend is built with **Node.js** and **Express**, providing a lightweight RESTful API for file management.

## 🛠️ Features
- **File Upload**: Handled via `multer` with MIME type filtering.
- **Metadata Persistence**: Uses a local **SQLite** database.
- **Static Serving**: Streams files for preview and download.
- **Clean Architecture**: Single-file entry for simplicity with clear separation of middleware.

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/upload` | Upload a file (multipart/form-data) |
| `GET` | `/api/files` | Get a list of all uploaded file metadata |
| `GET` | `/api/files/download/:id` | Download a specific file |
| `GET` | `/api/files/view/:id` | Preview a file (stream) |

## ⚙️ Configuration
The server runs on port `5001` by default.

### Database Schema
The `files` table tracks:
- `id`, `filename`, `originalName`, `mimeType`, `size`, `uploadedAt`.

## 🚀 Running
```bash
npm install
npm start # runs node index.js
```
