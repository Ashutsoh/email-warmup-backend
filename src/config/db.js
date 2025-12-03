const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// -----------------------------------
// Ensure data directory exists (IMPORTANT FOR RENDER)
// -----------------------------------
const dataDir = path.join(__dirname, "../data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log("✔ Created data directory:", dataDir);
}

// -----------------------------------
// Actual SQLite database file path
// -----------------------------------
const dbPath = path.join(dataDir, "database.db");

console.log("✔ Using SQLite database file at:", dbPath);

// -----------------------------------
// Initialize SQLite DB
// -----------------------------------
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite:", err.message);
  } else {
    console.log("✔ Connected to SQLite database");
  }
});

// -----------------------------------
// Create Tables EXACTLY as your code
// -----------------------------------
db.exec(`
CREATE TABLE IF NOT EXISTS smtp_accounts (
  id TEXT PRIMARY KEY,
  label TEXT,
  host TEXT,
  port INTEGER,
  secure INTEGER,
  user TEXT,
  pass TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  email TEXT,
  smtp_account_id TEXT,
  total INTEGER,
  sent INTEGER DEFAULT 0,
  status TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS sends (
  id TEXT PRIMARY KEY,
  campaign_id TEXT,
  to_email TEXT,
  message_id TEXT,
  status TEXT,
  error TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS replies (
  id TEXT PRIMARY KEY,
  send_id TEXT,
  from_email TEXT,
  body TEXT,
  created_at TEXT
);
`);

module.exports = db;
