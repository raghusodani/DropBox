const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Database Setup
db.init().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'image/jpeg', 'image/png', 'application/json'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only txt, jpg, png, and json are allowed.'));
    }
  }
});

// API Endpoints

// 1. Upload File
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { filename, originalname, mimetype, size, path: filePath } = req.file;

  try {
    const savedFile = await db.addFile(filename, originalname, mimetype, size, filePath);
    res.status(201).json({ 
      message: 'File uploaded successfully',
      fileId: savedFile.id,
      file: savedFile
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get List of All Files
app.get('/api/files', async (req, res) => {
  try {
    const rows = await db.getAllFiles();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Download File
app.get('/api/files/download/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const row = await db.getFileById(id);
    if (!row) return res.status(404).json({ error: 'File not found' });

    res.download(row.path, row.originalName);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. View File (Stream for preview)
app.get('/api/files/view/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const row = await db.getFileById(id);
    if (!row) return res.status(404).json({ error: 'File not found' });

    res.sendFile(row.path);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
