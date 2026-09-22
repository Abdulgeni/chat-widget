'use client';

import Script from 'next/script';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0d] text-gray-200 antialiased overflow-x-hidden selection:bg-violet-500/30">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[15%] right-[5%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0a0a0d]/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-violet-500/20">
              C
            </div>
            <span className="font-semibold text-white tracking-tight">ChatWidget</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#embed" className="hover:text-white transition-colors">Embed</a>
          </div>
          <a
            href="/api/health"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors"
          >
            System status
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 text-center z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          Live demo — click the button in the corner
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-[1.1] bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          One script tag.
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            A real AI support widget.
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Real-time streaming answers, document-aware support, and a fully isolated
          embed that never touches your site&apos;s styles or scripts — live on this
          page right now.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#embed"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors shadow-xl shadow-white/5"
          >
            Get the embed code
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            See how it works
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Glass mockup card */}
        <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 shadow-2xl shadow-black/60 relative">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="pl-2 font-mono">yoursite.com</span>
            </div>
            <div className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded">widget active</div>
          </div>
          <div className="pt-6 pb-8 text-left">
            <p className="text-sm text-gray-500 font-mono mb-2">Nothing else on this mockup is real —</p>
            <p className="text-sm text-gray-500 font-mono">the chat widget bottom-right is the actual product, running live.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: '01', title: 'Fully isolated embed', body: 'Shadow DOM keeps every style and script sealed off from the host page — no CSS conflicts, in either direction.' },
            { n: '02', title: 'Real-time streaming', body: 'WebSocket-first with automatic SSE + HTTP fallback, so it degrades gracefully on any network.' },
            { n: '03', title: 'Document-aware answers', body: 'Visitors can upload a PDF and ask questions about it — answered with real retrieval, not guesswork.' },
            { n: '04', title: 'Per-client security', body: 'Domain allowlisting, rate limiting, and sanitization scoped to each client, out of the box.' },
            { n: '05', title: 'Persistent conversations', body: 'Visitors can close the tab and come back — their history is exactly where they left it.' },
            { n: '06', title: 'No-code onboarding', body: 'A new client gets a domain, a color, and a script tag from a simple dashboard — no deploys.' },
          ].map((f) => (
            <div key={f.n} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300 mb-4 font-bold text-sm">
                {f.n}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Embed snippet */}
      <section id="embed" className="max-w-3xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white mb-3">One snippet. That&apos;s the whole integration.</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-xl">
          This is the exact code a client pastes into their site. Nothing else changes on their end.
        </p>
        <pre className="rounded-2xl border border-white/10 bg-black/60 p-5 text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed">
{`<script>
(function(w,d,s,o,f,js,fjs){
  w['ChatWidgetObject']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
  js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
}(window,document,'script','aiChat','https://your-domain.com/widget.js'));
aiChat('init', { appId: 'your-app-id', theme: { primaryColor: '#4f46e5' } });
</script>`}
        </pre>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>Embeddable AI Chat Widget — architecture, demo, and admin dashboard.</span>
        <div className="flex gap-6">
          <a href="/admin" className="hover:text-gray-300 transition-colors">Admin</a>
          <a href="/api/health" className="hover:text-gray-300 transition-colors">Status</a>
        </div>
      </footer>

      {/* The real, live widget */}
      <Script id="ai-chat-loader" strategy="afterInteractive">
        {`
          (function(w,d,s,o,f,js,fjs){
            w['ChatWidgetObject']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
            js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
          }(window,document,'script','aiChat','/widget.js'));
          aiChat('init', { appId: 'test-app', theme: { primaryColor: '#8b5cf6' } });
        `}
      </Script>
    </div>
  );
}