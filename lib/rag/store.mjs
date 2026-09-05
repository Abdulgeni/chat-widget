import { db } from '../db/db.mjs';

db.exec(`
  CREATE TABLE IF NOT EXISTS doc_chunks (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    text TEXT NOT NULL,
    embedding TEXT NOT NULL
  );
`);

export function saveChunk(sessionId, id, text, embedding) {
  db.prepare(
    'INSERT OR REPLACE INTO doc_chunks (id, session_id, text, embedding) VALUES (?, ?, ?, ?)'
  ).run(id, sessionId, text, JSON.stringify(embedding));
}

export function getChunks(sessionId) {
  return db
    .prepare('SELECT id, text, embedding FROM doc_chunks WHERE session_id = ?')
    .all(sessionId)
    .map((r) => ({ id: r.id, text: r.text, embedding: JSON.parse(r.embedding) }));
}

function cosineSim(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

export function topKChunks(sessionId, queryEmbedding, k = 3) {
  const chunks = getChunks(sessionId);
  return chunks
    .map((c) => ({ ...c, score: cosineSim(c.embedding, queryEmbedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}