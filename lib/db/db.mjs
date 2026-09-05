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
    CREATE TABLE IF NOT EXISTS widget_configs (
    app_id TEXT PRIMARY KEY,
    allowed_domains TEXT NOT NULL,
    theme TEXT NOT NULL
  );
`);
try {
  db.exec('ALTER TABLE doc_chunks ADD COLUMN created_at INTEGER');
  db.prepare('UPDATE doc_chunks SET created_at = ? WHERE created_at IS NULL').run(Date.now());
} catch {
  // column already exists from a previous run — fine, ignore
}
export function purgeOldData(days = 30) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const messagesDeleted = db.prepare('DELETE FROM messages WHERE created_at < ?').run(cutoff).changes;
  const chunksDeleted = db.prepare('DELETE FROM doc_chunks WHERE created_at < ?').run(cutoff).changes;
  const sessionsDeleted = db
    .prepare(`DELETE FROM sessions WHERE created_at < ? AND id NOT IN (SELECT DISTINCT session_id FROM messages)`)
    .run(cutoff).changes;
  return { messagesDeleted, chunksDeleted, sessionsDeleted };
}

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
export function upsertWidgetConfig(appId, allowedDomains, theme) {
  db.prepare(`
    INSERT INTO widget_configs (app_id, allowed_domains, theme)
    VALUES (?, ?, ?)
    ON CONFLICT(app_id) DO UPDATE SET allowed_domains = excluded.allowed_domains, theme = excluded.theme
  `).run(appId, JSON.stringify(allowedDomains), JSON.stringify(theme || {}));
}

export function getWidgetConfig(appId) {
  const row = db.prepare('SELECT * FROM widget_configs WHERE app_id = ?').get(appId);
  if (!row) return null;
  return {
    appId: row.app_id,
    allowedDomains: JSON.parse(row.allowed_domains),
    theme: JSON.parse(row.theme),
  };
}