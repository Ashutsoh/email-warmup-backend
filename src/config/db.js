const Database = sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(process.env.DATABASE_FILE);

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
