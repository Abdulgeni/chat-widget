# AI Chat Widget

Embeddable, Shadow-DOM-isolated AI chat widget with real-time streaming, persistence, RAG document upload, and multi-tab sync.

## Install

npm install

## Environment variables (.env.local)

GOOGLE_API_KEY=your-gemini-api-key
JWT_SECRET=some-random-secret-string

## Run locally

npm run build:widget   # builds public/widget.js, widget-fab.js, widget-chunk.js
npm run dev             # starts the server (Next.js + WebSocket) on http://localhost:3000

Seed a test appId once:

node scripts/seed-widget-config.mjs

## Embed on a third-party site

<script>
(function(w,d,s,o,f,js,fjs){
    w['ChatWidgetObject']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
}(window,document,'script','aiChat','https://yourdomain.com/widget.js'));
aiChat('init', { appId: 'your-app-id', theme: { primaryColor: '#2563eb' } });
</script>

## Architecture

- widget.js — tiny (<1KB) async loader, queues commands until init
- widget-fab.js — Shadow DOM floating button, lazy-loads the chat engine on click/hover
- widget-chunk.js — the React chat UI, code-split from the loader
- server.js — custom Node server: Next.js + WebSocket endpoint (/api/ws) side by side
- lib/db/db.mjs — SQLite: sessions, messages, widget configs, RAG document chunks
- lib/ai/geminiProvider.mjs — pluggable AI provider (swap for OpenAI/other by matching this file's shape)
- lib/security/ — domain allowlisting, JWT verification, rate limiting, input sanitization
- lib/rag/ — PDF upload → chunk → embed → cosine-similarity retrieval, no separate vector DB server needed

## Deployment

Self-host: run `npm run build && npm start` behind any Node-capable host (this project uses a custom server.js for the WebSocket endpoint, so it needs a persistent Node process — not a pure serverless/edge target).

Vercel: WebSocket support requires their Edge/Node runtime configuration for long-lived connections — check current Vercel docs for WebSocket support before deploying there as-is.