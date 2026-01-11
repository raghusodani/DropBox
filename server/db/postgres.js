const { Pool } = require('pg');

class PostgresDB {
  constructor() {
    this.pool = new Pool({
      user: process.env.PGUSER || 'user',
      host: process.env.PGHOST || 'db',
      database: process.env.PGDATABASE || 'dropbox_clone',
      password: process.env.PGPASSWORD || 'password',
      port: process.env.PGPORT || 5432,
    });
  }

  async init() {
    try {
      // Simple retry logic for Docker startup
      let retries = 5;
      while (retries > 0) {
        try {
          await this.pool.query('SELECT 1');
          break;
        } catch (err) {
          console.log(`Waiting for PostgreSQL... (${retries} retries left)`);
          retries -= 1;
          await new Promise(res => setTimeout(res, 2000));
        }
      }

      console.log('Connected to the PostgreSQL database.');
      
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS files (
          id SERIAL PRIMARY KEY,
          filename TEXT NOT NULL,
          originalName TEXT NOT NULL,
          mimeType TEXT,
          size BIGINT,
          path TEXT NOT NULL,
          uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (err) {
      console.error('Error connecting to/initializing PostgreSQL', err.message);
      throw err;
    }
  }

  async addFile(filename, originalName, mimeType, size, path) {
    const result = await this.pool.query(
      `INSERT INTO files (filename, "originalName", "mimeType", size, path) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [filename, originalName, mimeType, size, path]
    );
    return { id: result.rows[0].id, filename, originalName, mimeType, size };
  }

  async getAllFiles() {
    const result = await this.pool.query('SELECT * FROM files ORDER BY uploadedAt DESC');
    // Map camelCase for compatibility if needed, but PG returns lowercase unless quoted. 
    // For consistency with SQLite, we should normalize.
    return result.rows.map(row => ({
      id: row.id,
      filename: row.filename,
      originalName: row.originalname || row.originalName,
      mimeType: row.mimetype || row.mimeType,
      size: row.size,
      path: row.path,
      uploadedAt: row.uploadedat || row.uploadedAt
    }));
  }

  async getFileById(id) {
    const result = await this.pool.query('SELECT * FROM files WHERE id = $1', [id]);
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id,
      filename: row.filename,
      originalName: row.originalname || row.originalName,
      mimeType: row.mimetype || row.mimeType,
      size: row.size,
      path: row.path,
      uploadedAt: row.uploadedat || row.uploadedAt
    };
  }
}

module.exports = new PostgresDB();
