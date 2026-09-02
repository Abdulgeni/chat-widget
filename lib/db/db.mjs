import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../chat.db');

export const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

export function ensureSession(sessionId) {
  const existing = db.prepare('SELECT id FROM sessions WHERE id = ?').get(sessionId);
  if (!existing) {
    db.prepare('INSERT INTO sessions (id, created_at) VALUES (?, ?)').run(sessionId, Date.now());
  }
}

export function saveMessage(sessionId, id, role, text) {
  db.prepare(
    'INSERT OR REPLACE INTO messages (id, session_id, role, text, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(id, sessionId, role, text, Date.now());
}

export function getHistory(sessionId) {
  return db
    .prepare('SELECT id, role, text, created_at FROM messages WHERE session_id = ? ORDER BY created_at ASC')
    .all(sessionId);
}