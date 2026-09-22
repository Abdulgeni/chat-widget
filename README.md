# AI Chat Widget






## Embed on a third-party site



## Architecture

- widget.js — tiny (<1KB) async loader, queues commands until init
- widget-fab.js — Shadow DOM floating button, lazy-loads the chat engine on click/hover
- widget-chunk.js — the React chat UI, code-split from the loader
- server.js — custom Node server: Next.js + WebSocket endpoint (/api/ws) side by side
- lib/db/db.mjs — SQLite: sessions, messages, widget configs, RAG document chunks
- lib/ai/geminiProvider.mjs — pluggable AI provider (swap for OpenAI/other by matching this file's shape)
- lib/security/ — domain allowlisting, JWT verification, rate limiting, input sanitization
- lib/rag/ — PDF upload → chunk → embed → cosine-similarity retrieval, no separate vector DB server needed



