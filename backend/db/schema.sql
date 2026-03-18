CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  use_case TEXT,
  call_id TEXT,
  call_status TEXT DEFAULT 'pending',
  qualification TEXT DEFAULT 'unqualified',
  transcript TEXT,
  raw_webhook_payload TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
