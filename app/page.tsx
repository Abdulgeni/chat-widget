'use client';

import Script from 'next/script';

const features = [
  { title: 'Fully isolated embed', body: 'Shadow DOM keeps every style and script sealed off from the host page.' },
  { title: 'Real-time streaming', body: 'WebSocket-first with automatic SSE and HTTP fallback.' },
  { title: 'Document-aware', body: 'Upload a document, ask real questions about it.' },
  { title: 'Per-client security', body: 'Domain allowlisting and rate limiting, scoped per client.' },
  { title: 'Persistent history', body: 'Close the tab, return later — nothing is lost.' },
  { title: 'No-code onboarding', body: 'A domain, a color, a script tag. No deploys.' },
];

function Icon({ name }: { name: string }) {
  const common = 'w-4 h-4';
  switch (name) {
    case 'shield':
      return <svg className={common} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /></svg>;
    case 'bolt':
      return <svg className={common} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" /></svg>;
    case 'doc':
      return <svg className={common} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v13H7V3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" /></svg>;
    case 'lock':
      return <svg className={common} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="1.5" /><path strokeLinecap="round" d="M8 11V7a4 4 0 018 0v4" /></svg>;
    case 'clock':
      return <svg className={common} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><path strokeLinecap="round" d="M12 7v5l3 2" /></svg>;
    default:
      return <svg className={common} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" /><path strokeLinecap="round" d="M12 3v4M12 17v4M3 12h4M17 12h4" /></svg>;
  }
}

const icons = ['lock', 'bolt', 'doc', 'shield', 'clock', 'gear'];

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 my-2" aria-hidden>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/15" />
      <span className="w-1 h-1 rotate-45 bg-white/25" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-white/15" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#08090a] text-[#c9c9cf] antialiased overflow-x-hidden selection:bg-rose-500/25">
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-br from-rose-600/[0.12] via-fuchsia-600/[0.06] to-violet-600/[0.10] rounded-full blur-[150px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#08090a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-rose-500 to-violet-500 flex items-center justify-center">
              <span className="font-[family-name:var(--font-display)] italic text-white text-xs">c</span>
            </div>
            <span className="text-sm font-medium text-white/90 tracking-tight">ChatWidget</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[13px] text-white/45">
            <a href="#features" className="hover:text-white/90 transition-colors duration-300">Features</a>
            <a href="#embed" className="hover:text-white/90 transition-colors duration-300">Embed</a>
            <a href="#engineering" className="hover:text-white/90 transition-colors duration-300">Engineering</a>
          </div>
          <a
            href="/api/health"
            className="rounded-full border border-white/10 px-4 py-1.5 text-[11px] tracking-wide text-white/70 hover:text-white hover:border-white/20 transition-all duration-300"
          >
            System status
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-2xl mx-auto px-6 pt-32 pb-8 text-center z-10">
        <p
          className="text-[11px] tracking-[0.15em] text-white/35 mb-8 opacity-0 animate-[fadeIn_0.7s_ease_forwards]"
          style={{ animationDelay: '0.1s' }}
        >
          LIVE ON THIS PAGE
        </p>

        <h1
          className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl font-medium tracking-tight mb-8 leading-[1.12] text-white/95 opacity-0 animate-[fadeIn_0.8s_ease_forwards]"
          style={{ animationDelay: '0.22s' }}
        >
          Your visitors&apos; questions,
          <br />
          <span className="italic bg-gradient-to-r from-rose-300 via-fuchsia-200 to-violet-300 bg-clip-text text-transparent">
            answered instantly.
          </span>
        </h1>

        <p
          className="text-white/40 text-[15px] max-w-md mx-auto mb-12 leading-relaxed opacity-0 animate-[fadeIn_0.8s_ease_forwards]"
          style={{ animationDelay: '0.38s' }}
        >
          A single script tag. Real-time streaming AI, quietly isolated from
          your site, live in under a minute.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24 opacity-0 animate-[fadeIn_0.8s_ease_forwards]"
          style={{ animationDelay: '0.52s' }}
        >
          <a
            href="#embed"
            className="relative w-full sm:w-auto px-7 py-3 rounded-full bg-white text-black text-[13px] font-medium tracking-wide overflow-hidden group"
          >
            <span className="absolute inset-x-0 top-0 h-1/2 bg-white/40 rounded-t-full pointer-events-none" />
            <span className="relative">Get the embed code</span>
          </a>
          <a
            href="#features"
            className="text-[13px] text-white/50 hover:text-white/90 transition-colors duration-300 tracking-wide"
          >
            See how it works
          </a>
        </div>

        {/* Mockup */}
        <div
          className="max-w-xl mx-auto rounded-2xl p-px bg-gradient-to-b from-white/15 via-white/[0.04] to-white/[0.08] opacity-0 animate-[fadeIn_0.9s_ease_forwards]"
          style={{ animationDelay: '0.66s' }}
        >
          <div className="rounded-2xl bg-[#0c0d10] p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-[11px] text-white/30">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/[0.08]" />
                <span className="w-2 h-2 rounded-full bg-white/[0.08]" />
                <span className="w-2 h-2 rounded-full bg-white/[0.08]" />
                <span className="pl-2 font-mono">yoursite.com</span>
              </div>
              <div className="font-mono text-[10px] text-white/25">widget active</div>
            </div>
            <div className="pt-5 pb-1 text-white/30 text-[13px] font-mono">
              The real widget is in the corner of this page. →
            </div>
          </div>
        </div>
      </section>

      <Ornament />

      {/* Statement */}
      <section className="max-w-xl mx-auto px-6 py-28 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-white/85 leading-snug">
          It isn&apos;t about adding a chatbot.
          <br />
          <span className="italic text-white/40">It&apos;s about not losing the visitor who almost left.</span>
        </h2>
      </section>

      <Ornament />

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-8">
          {[
            { num: '<1kb', lbl: 'loader footprint' },
            { num: '3', lbl: 'layer transport fallback' },
            { num: '24h', lbl: 'automatic backup cycle' },
          ].map((s) => (
            <div key={s.lbl} className="text-center">
              <div className="font-[family-name:var(--font-display)] italic text-3xl text-white/85">{s.num}</div>
              <div className="text-[11px] text-white/35 mt-2 tracking-wide">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-28">
        <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-white/90 mb-3 text-center">
          There&apos;s a reason for every detail.
        </h2>
        <p className="text-white/35 text-sm mb-16 text-center">Restraint, not accumulation.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
          {features.map((f, i) => (
            <div key={f.title} className="bg-[#0a0b0d] p-8 hover:bg-[#0d0e11] transition-colors duration-300">
              <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center mb-5 text-white/50">
                <Icon name={icons[i]} />
              </div>
              <h3 className="text-[14px] font-medium text-white/85 mb-2 tracking-wide">{f.title}</h3>
              <p className="text-white/40 text-[13px] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Ornament />

      {/* Engineering */}
      <section id="engineering" className="max-w-3xl mx-auto px-6 py-24">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-white/90 mb-12 text-center">
          What we verified, not just claimed.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
          {[
            { k: 'Isolation', v: 'Shadow DOM boundary — confirmed in DevTools, not assumed.' },
            { k: 'Resilience', v: 'Falls back from WebSocket to SSE to plain HTTP automatically.' },
            { k: 'Observability', v: 'Structured logs and error tracking on every request path.' },
            { k: 'Data hygiene', v: 'Automatic daily backups and retention purging, unattended.' },
          ].map((h) => (
            <div key={h.k}>
              <div className="text-[13px] font-medium text-white/80 mb-1.5 tracking-wide">{h.k}</div>
              <div className="text-[13px] text-white/40 leading-relaxed">{h.v}</div>
            </div>
          ))}
        </div>
      </section>

      <Ornament />

      {/* Embed */}
      <section id="embed" className="max-w-2xl mx-auto px-6 py-24">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-white/90 mb-2 text-center">
          One snippet. The whole integration.
        </h2>
        <p className="text-white/35 text-[13px] mb-8 text-center">Exactly what a client pastes into their site.</p>
        <pre className="rounded-xl border border-white/[0.08] bg-black/50 p-5 text-[12px] text-white/50 overflow-x-auto font-mono leading-relaxed">
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
      <footer className="max-w-5xl mx-auto px-6 py-14 border-t border-white/[0.06] text-[11px] text-white/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>Embeddable AI Chat Widget</span>
        <div className="flex gap-8">
          <a href="/admin" className="hover:text-white/60 transition-colors duration-300">Admin</a>
          <a href="/api/health" className="hover:text-white/60 transition-colors duration-300">Status</a>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
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