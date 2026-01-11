const sqlite = require('./sqlite');
const postgres = require('./postgres');

const DB_TYPE = process.env.DB_TYPE || 'sqlite';

let db;

if (DB_TYPE === 'postgres') {
  db = postgres;
} else {
  db = sqlite;
}

module.exports = db;
