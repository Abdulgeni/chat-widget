'use client';

import Script from 'next/script';

const features = [
  { icon: '🔒', color: 'from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-300', title: 'Fully isolated embed', body: 'Shadow DOM keeps every style and script sealed off from the host page.' },
  { icon: '⚡', color: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-300', title: 'Real-time streaming', body: 'WebSocket-first with automatic SSE + HTTP fallback.' },
  { icon: '📄', color: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-300', title: 'Document-aware', body: 'Upload a PDF, ask real questions about it.' },
  { icon: '🛡️', color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-300', title: 'Per-client security', body: 'Domain allowlisting and rate limiting, scoped per client.' },
  { icon: '💾', color: 'from-sky-500/20 to-sky-500/5 border-sky-500/20 text-sky-300', title: 'Persistent history', body: 'Close the tab, come back — nothing is lost.' },
  { icon: '⚙️', color: 'from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-300', title: 'No-code onboarding', body: 'A domain, a color, a script tag — no deploys.' },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#08090b] text-gray-200 antialiased overflow-x-hidden selection:bg-rose-500/30">
      {/* Grain texture */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Big Raycast-style radial glow behind hero */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-gradient-to-br from-rose-600/25 via-fuchsia-600/15 to-violet-600/20 rounded-full blur-[130px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#08090b]/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 to-violet-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-rose-500/30">
              C
            </div>
            <span className="font-semibold text-white tracking-tight">ChatWidget</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#embed" className="hover:text-white transition-colors">Embed</a>
            <a href="#engineering" className="hover:text-white transition-colors">Engineering</a>
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
      <section className="relative max-w-3xl mx-auto px-6 pt-28 pb-16 text-center z-10">
        <div
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 mb-8 opacity-0 animate-[fadeIn_0.6s_ease_forwards]"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          Live on this page — click the corner
        </div>

        <h1
          className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl font-medium tracking-tight mb-6 leading-[1.05] text-white opacity-0 animate-[fadeIn_0.7s_ease_forwards]"
          style={{ animationDelay: '0.2s' }}
        >
          Your visitors&apos; questions.
          <br />
          <span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
            Answered instantly.
          </span>
        </h1>

        <p
          className="text-gray-400 text-lg max-w-lg mx-auto mb-10 leading-relaxed opacity-0 animate-[fadeIn_0.7s_ease_forwards]"
          style={{ animationDelay: '0.35s' }}
        >
          One script tag. Real-time streaming AI, isolated from your site, live in
          under a minute.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 opacity-0 animate-[fadeIn_0.7s_ease_forwards]"
          style={{ animationDelay: '0.5s' }}
        >
          <a
            href="#embed"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors shadow-xl shadow-white/10"
          >
            Get the embed code
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            See how it works
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Glowing-edge console mockup, Raycast style */}
        <div
          className="max-w-2xl mx-auto rounded-2xl p-[1px] bg-gradient-to-b from-rose-500/40 via-white/10 to-violet-500/30 shadow-2xl shadow-rose-900/20 opacity-0 animate-[fadeIn_0.8s_ease_forwards]"
          style={{ animationDelay: '0.65s' }}
        >
          <div className="rounded-2xl bg-[#0d0e12]/95 backdrop-blur-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="pl-2 font-mono">yoursite.com</span>
              </div>
              <div className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded">widget active</div>
            </div>
            <div className="pt-4 pb-2 px-1 flex items-center gap-3">
              <svg className="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm text-gray-500">The real widget runs in the corner of this page →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Big centered statement — Raycast's "it's not about saving time" beat */}
      <section className="max-w-2xl mx-auto px-6 py-24 text-center border-t border-white/5">
        <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-white leading-snug">
          It&apos;s not about adding a chatbot.
          <br />
          <span className="text-gray-500">It&apos;s about not losing the visitor who almost left.</span>
        </h2>
      </section>

      {/* Stats bar */}
      <section className="max-w-4xl mx-auto px-6 py-10 border-t border-white/5">
        <div className="grid grid-cols-3 divide-x divide-white/5">
          {[
            { num: '<1KB', lbl: 'loader footprint' },
            { num: '3-layer', lbl: 'transport fallback' },
            { num: '24h', lbl: 'automatic backup cycle' },
          ].map((s) => (
            <div key={s.lbl} className="text-center px-4">
              <div className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-white">{s.num}</div>
              <div className="text-xs text-gray-500 mt-1">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Colored-icon feature grid, Raycast store style */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white mb-2 text-center">There&apos;s a reason for every detail.</h2>
        <p className="text-gray-500 text-sm mb-12 text-center">Six decisions that make the difference between a widget and a toy.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-white/20 transition-colors">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} border flex items-center justify-center mb-4 text-base`}>
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering highlights */}
      <section id="engineering" className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white mb-10">What we actually verified, not just claimed.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { k: 'Isolation', v: 'Shadow DOM boundary — verified with DevTools, not assumed.' },
            { k: 'Resilience', v: 'Falls back from WebSocket to SSE to plain HTTP automatically.' },
            { k: 'Observability', v: 'Structured logs and error tracking on every request path.' },
            { k: 'Data hygiene', v: 'Automatic daily backups and retention purging, unattended.' },
          ].map((h) => (
            <div key={h.k} className="flex gap-4">
              <div className="w-1 rounded-full bg-gradient-to-b from-rose-500 to-violet-500 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white mb-1">{h.k}</div>
                <div className="text-sm text-gray-400 leading-relaxed">{h.v}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Embed snippet */}
      <section id="embed" className="max-w-3xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white mb-3">One snippet. That&apos;s the whole integration.</h2>
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

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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