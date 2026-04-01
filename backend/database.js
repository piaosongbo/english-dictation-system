const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');

let db = null;

function getDatabase() {
  if (!db) {
    db = new Database(DB_PATH);
    console.log('Connected to SQLite database');
  }
  return db;
}

function initDatabase() {
  const database = getDatabase();
  
  // Create items table
  database.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      translation TEXT,
      image_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      next_review DATETIME DEFAULT CURRENT_TIMESTAMP,
      review_count INTEGER DEFAULT 0,
      level INTEGER DEFAULT 0,
      ease_factor REAL DEFAULT 2.5,
      interval_days INTEGER DEFAULT 0
    )
  `);

  // Create practice_history table
  database.exec(`
    CREATE TABLE IF NOT EXISTS practice_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      accuracy REAL,
      practiced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES items(id)
    )
  `);

  // Create settings table
  database.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Insert default settings
  const defaultSettings = [
    { key: 'daily_review_count', value: '10' },
    { key: 'theme', value: 'light' },
    { key: 'language', value: 'en' }
  ];

  const insertSetting = database.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  defaultSettings.forEach(setting => {
    insertSetting.run(setting.key, setting.value);
  });

  console.log('Database initialized');
}

function run(sql, params = []) {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  return stmt.run(params);
}

function get(sql, params = []) {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  return stmt.get(params);
}

function all(sql, params = []) {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  return stmt.all(params);
}

module.exports = {
  initDatabase,
  run,
  get,
  all
};
