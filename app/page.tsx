'use client';

import Script from 'next/script';

const features = [
  { title: 'Fully isolated embed', body: 'Shadow DOM keeps every style and script sealed off from the host page — no CSS conflicts, in either direction.', big: true },
  { title: 'Real-time streaming', body: 'WebSocket-first with automatic SSE + HTTP fallback.' },
  { title: 'Document-aware answers', body: 'Upload a PDF, ask real questions about it.' },
  { title: 'Per-client security', body: 'Domain allowlisting, rate limiting, and sanitization scoped to each client.' },
  { title: 'Persistent conversations', body: 'Close the tab, come back — history is exactly where it was left.' },
  { title: 'No-code onboarding', body: 'A domain, a color, a script tag — from a dashboard, not a deploy.', big: true },
];

const highlights = [
  { k: 'Isolation', v: 'Shadow DOM boundary — verified with DevTools, not assumed.' },
  { k: 'Resilience', v: 'Falls back from WebSocket to SSE to plain HTTP automatically.' },
  { k: 'Observability', v: 'Structured logs and error tracking on every request path.' },
  { k: 'Data hygiene', v: 'Automatic daily backups and retention purging, unattended.' },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#08090b] text-gray-200 antialiased overflow-x-hidden selection:bg-violet-500/30">
      {/* Grain texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Ambient glow orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[15%] right-[5%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#08090b]/70 backdrop-blur-xl">
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
      <section className="relative max-w-4xl mx-auto px-6 pt-28 pb-16 text-center z-10">
        <div
          className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/[0.04] px-3 py-1 text-xs text-amber-100/80 mb-8 opacity-0 animate-[fadeIn_0.6s_ease_forwards]"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="w-1 h-1 rounded-full bg-amber-200/80" />
          Enterprise-grade embed, built from the ground up
        </div>

        <h1
          className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl font-medium tracking-tight mb-6 leading-[1.05] bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent opacity-0 animate-[fadeIn_0.7s_ease_forwards]"
          style={{ animationDelay: '0.2s' }}
        >
          One script tag.
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent italic">
            A living conversation.
          </span>
        </h1>

        <p
          className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed opacity-0 animate-[fadeIn_0.7s_ease_forwards]"
          style={{ animationDelay: '0.35s' }}
        >
          Real-time streaming answers, document-aware support, and a fully isolated
          embed that never touches your site&apos;s styles or scripts — live on this
          page right now.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 opacity-0 animate-[fadeIn_0.7s_ease_forwards]"
          style={{ animationDelay: '0.5s' }}
        >
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
          </a>
        </div>

        {/* Glass mockup card */}
        <div
          className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 shadow-2xl shadow-black/60 relative opacity-0 animate-[fadeIn_0.8s_ease_forwards]"
          style={{ animationDelay: '0.65s' }}
        >
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

      {/* Bento features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white mb-2">Built with restraint, not bloat.</h2>
        <p className="text-gray-500 text-sm mb-10 max-w-lg">Six decisions that make the difference between a widget and a toy.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-white/20 transition-colors ${
                f.big ? 'md:col-span-2' : ''
              }`}
            >
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering highlights (honest, not fake testimonials) */}
      <section id="engineering" className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white mb-10">What we actually verified, not just claimed.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {highlights.map((h) => (
            <div key={h.k} className="flex gap-4">
              <div className="w-1 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 flex-shrink-0" />
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