const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'scope.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS blocks (
    id TEXT PRIMARY KEY,
    fase TEXT NOT NULL,
    domein TEXT NOT NULL,
    activiteit TEXT NOT NULL,
    inc_items TEXT NOT NULL DEFAULT '[]',
    exc_items TEXT NOT NULL DEFAULT '[]',
    variabel INTEGER DEFAULT 0,
    variabele_velden TEXT DEFAULT '[]',
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    naam TEXT NOT NULL,
    cl_nummer TEXT,
    datum TEXT,
    opdrachtgever TEXT DEFAULT 'Liander',
    aannemer TEXT DEFAULT 'Visser en Smit Hanab',
    status TEXT DEFAULT 'concept',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS project_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    block_id TEXT NOT NULL REFERENCES blocks(id),
    sort_order INTEGER NOT NULL DEFAULT 0,
    active_inc_items TEXT NOT NULL DEFAULT '[]',
    extra_exc_items TEXT DEFAULT '[]',
    variabele_waarden TEXT DEFAULT '{}'
  );
`);

module.exports = db;
