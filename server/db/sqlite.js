const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class SQLiteDB {
  constructor() {
    const DB_MODE = process.env.DB_MODE || 'file';
    this.dbPath = DB_MODE === 'memory' ? ':memory:' : path.join(__dirname, '..', 'database.sqlite');
    this.db = null;
    this.mode = DB_MODE;
  }

  init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening SQLite database', err.message);
          return reject(err);
        }
        console.log(`Connected to the SQLite database (${this.mode}).`);
        
        this.db.run(`CREATE TABLE IF NOT EXISTS files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          filename TEXT NOT NULL,
          originalName TEXT NOT NULL,
          mimeType TEXT,
          size INTEGER,
          path TEXT NOT NULL,
          uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (err) {
            console.error('Error creating SQLite table', err.message);
            return reject(err);
          }
          resolve();
        });
      });
    });
  }

  addFile(filename, originalName, mimeType, size, path) {
    return new Promise((resolve, reject) => {
      const self = this;
      this.db.run(
        `INSERT INTO files (filename, originalName, mimeType, size, path) VALUES (?, ?, ?, ?, ?)`,
        [filename, originalName, mimeType, size, path],
        function(err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, filename, originalName, mimeType, size });
        }
      );
    });
  }

  getAllFiles() {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM files ORDER BY uploadedAt DESC`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  getFileById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM files WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
}

module.exports = new SQLiteDB();
