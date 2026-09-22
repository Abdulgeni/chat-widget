'use client';

import Script from 'next/script';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import FeatureScene from '../components/FeatureScene';
import { staggerContainer, unfoldItem, Parallax } from '../components/Motion';
import {
  ShieldCheck, Zap, FileText, Lock, Clock, Settings2,
  MessageCircle, Database, Radio, Sparkles, ArrowRight,
  KeyRound, Gauge, Paintbrush,
} from 'lucide-react';
import Reveal from '../components/Reveal';

const features = [
  { icon: Lock, title: 'Fully isolated embed', body: 'Shadow DOM keeps every style and script sealed off from the host page.' },
  { icon: Zap, title: 'Real-time streaming', body: 'WebSocket-first with automatic SSE and HTTP fallback.' },
  { icon: FileText, title: 'Document-aware', body: 'Upload a document, ask real questions about it.' },
  { icon: ShieldCheck, title: 'Per-client security', body: 'Domain allowlisting and rate limiting, scoped per client.' },
  { icon: Clock, title: 'Persistent history', body: 'Close the tab, return later — nothing is lost.' },
  { icon: Settings2, title: 'No-code onboarding', body: 'A domain, a color, a script tag. No deploys.' },
  { icon: MessageCircle, title: 'Multi-tab sync', body: 'Open the site in two tabs — one conversation, always in sync.' },
  { icon: Database, title: 'Automatic backups', body: 'The database backs itself up daily, unattended.' },
  { icon: Sparkles, title: 'Quick replies', body: 'Guided prompts that reduce typing and speed up resolution.' },
  { icon: KeyRound, title: 'JWT identity', body: 'Link a conversation to a logged-in visitor with a signed token.' },
  { icon: Gauge, title: 'Rate limiting', body: 'IP-aware limits stop abuse without punishing real visitors.' },
  { icon: Paintbrush, title: 'Brand theming', body: 'Every client gets their own color, matched end to end.' },
];

const stack = [
  { name: 'Gemini AI' }, { name: 'WebSocket' }, { name: 'Shadow DOM' },
  { name: 'SQLite' }, { name: 'Railway' }, { name: 'Next.js' },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#08090b] text-gray-200 antialiased overflow-x-hidden selection:bg-violet-500/30 font-sans">
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <Parallax speed={0.4} className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-gradient-to-br from-rose-600/[0.12] via-fuchsia-600/[0.07] to-violet-600/[0.10] rounded-full blur-[140px] pointer-events-none" />

      {/* Floating glass nav */}
      <nav className="sticky top-4 z-40 w-full px-4">
        <div className="max-w-3xl mx-auto rounded-full border border-white/[0.08] bg-[#0a0b0d]/80 backdrop-blur-xl px-5 h-14 flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2.5">
            <Logo size={26} />
            <span className="text-[13px] font-semibold text-white tracking-tight">ChatWidget</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] text-gray-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#showcase" className="hover:text-white transition-colors duration-200">Showcase</a>
            <a href="#embed" className="hover:text-white transition-colors duration-200">Embed</a>
            <a href="#engineering" className="hover:text-white transition-colors duration-200">Engineering</a>
          </div>
          <a
            href="/api/health"
            className="rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] font-medium text-white/80 hover:text-white hover:border-white/20 transition-all duration-200"
          >
            Status
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-2xl mx-auto px-6 pt-24 pb-10 text-center z-10">
        <div
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-gray-300 mb-8 opacity-0 animate-[fadeIn_0.6s_ease_forwards]"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          Live on this page
        </div>

        <h1
          className="text-5xl sm:text-6xl font-semibold tracking-tight mb-6 leading-[1.1] text-white opacity-0 animate-[fadeIn_0.7s_ease_forwards]"
          style={{ animationDelay: '0.2s' }}
        >
          Your visitors&apos; questions.
          <br />
          <span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
            Answered instantly.
          </span>
        </h1>

        <p
          className="text-gray-400 text-base max-w-md mx-auto mb-10 leading-relaxed opacity-0 animate-[fadeIn_0.7s_ease_forwards]"
          style={{ animationDelay: '0.35s' }}
        >
          One script tag. Real-time streaming AI, isolated from your site, live
          in under a minute.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0 animate-[fadeIn_0.7s_ease_forwards]"
          style={{ animationDelay: '0.5s' }}
        >
          <motion.a
            href="#embed"
            whileHover={{ scale: 1.035, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-gray-200 transition-colors duration-200 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset]"
          >
            Get the embed code
          </motion.a>
          <motion.a
            href="#features"
            whileHover={{ scale: 1.035, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-full sm:w-auto rounded-lg border border-white/[0.08] bg-white/[0.03] px-6 py-2.5 text-[13px] font-medium text-white/85 hover:bg-white/[0.06] transition-colors duration-200"
          >
            See how it works
          </motion.a>
        </div>

        {/* Tactile mockup */}
        <div
          className="max-w-xl mx-auto rounded-2xl p-px bg-gradient-to-b from-rose-500/30 via-white/10 to-violet-500/25 shadow-2xl shadow-rose-900/10 opacity-0 animate-[fadeIn_0.8s_ease_forwards]"
          style={{ animationDelay: '0.65s' }}
        >
          <div className="rounded-2xl bg-[#0a0b0d] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] p-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/[0.08]" />
                <span className="w-2 h-2 rounded-full bg-white/[0.08]" />
                <span className="w-2 h-2 rounded-full bg-white/[0.08]" />
                <span className="pl-2 font-mono">yoursite.com</span>
              </div>
              <div
                className="font-mono text-[10px] text-gray-400 bg-[#050607] px-2 py-1 rounded border border-white/[0.06]"
                style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)' }}
              >
                widget active
              </div>
            </div>
            <div className="pt-4 pb-1 flex items-center gap-3">
              <Radio className="w-4 h-4 text-rose-400 flex-shrink-0" strokeWidth={1.5} />
              <span className="text-[13px] text-gray-500">The real widget runs in the corner of this page</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="max-w-xl mx-auto px-6 py-20 text-center border-t border-white/[0.06] mt-14">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white/90 leading-snug">
            It isn&apos;t about adding a chatbot.
            <br />
            <span className="text-gray-500">It&apos;s about not losing the visitor who almost left.</span>
          </h2>
        </Reveal>
      </section>

      {/* Tech stack badge row — Raycast "there's an extension for that" beat */}
      <section className="max-w-3xl mx-auto px-6 py-10 border-t border-white/[0.06]">
        <p className="text-center text-[11px] tracking-wide text-gray-500 mb-6">BUILT ON A REAL STACK, NOT A DEMO</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {stack.map((s) => (
            <span
              key={s.name}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[12px] text-gray-300"
            >
              {s.name}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-6 py-14 border-t border-white/[0.06]">
        <div className="grid grid-cols-3 gap-8">
          {[
            { num: '<1kb', lbl: 'loader footprint' },
            { num: '3', lbl: 'layer transport fallback' },
            { num: '24h', lbl: 'backup cycle' },
          ].map((s) => (
            <div key={s.lbl} className="text-center">
              <div className="text-3xl font-semibold text-white">{s.num}</div>
              <div className="text-[11px] text-gray-500 mt-2">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Unfolding 3D-backed feature grid — 12 items */}
      <section id="features" className="relative max-w-5xl mx-auto px-6 py-24 border-t border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <FeatureScene />
        </div>

        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2 text-center">There&apos;s a reason for every detail.</h2>
          <p className="text-gray-500 text-sm mb-14 text-center">Restraint, not accumulation.</p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {features.map((f) => {
              const IconEl = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={unfoldItem}
                  whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
                  className="h-full rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-6 hover:border-[#ff6363]/30 hover:shadow-[0_12px_40px_rgba(255,99,99,0.12)] transition-colors duration-200"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg border border-white/[0.08] bg-[#0d0e11] flex items-center justify-center mb-5 text-[#ff6363]"
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    <IconEl className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[14px] font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-[13px] leading-relaxed">{f.body}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Showcase — larger in-depth capability spotlight, Raycast "Magic at your fingertips" beat */}
      <section id="showcase" className="max-w-5xl mx-auto px-6 py-24 border-t border-white/[0.06]">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.06] px-3 py-1 text-[11px] text-violet-300 mb-5">
                Retrieval-augmented
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 leading-snug">
                It reads the document.
                <br />
                Then it answers from it.
              </h2>
              <p className="text-gray-400 text-[14px] leading-relaxed max-w-sm">
                Visitors can upload a PDF mid-conversation. The widget chunks it,
                embeds it, and grounds its next answer in what&apos;s actually
                written there — not a guess from general training data.
              </p>
            </div>
            <div
              className="rounded-2xl border border-white/[0.08] bg-[#0a0b0d] p-5"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.4)' }}
            >
              <div className="flex items-center gap-2 text-[11px] text-gray-500 pb-3 border-b border-white/[0.06]">
                <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="font-mono">cover-letter.pdf</span>
              </div>
              <div className="pt-4 space-y-2.5">
                <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-[12px] text-gray-300 max-w-[85%]">
                  What role is this letter for?
                </div>
                <div className="rounded-lg bg-gradient-to-br from-rose-500/15 to-violet-500/15 border border-white/[0.06] px-3 py-2 text-[12px] text-gray-200 max-w-[90%] ml-auto">
                  Based on the document, it&apos;s an application for a Senior
                  Frontend Engineer position.
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Engineering */}
      <section id="engineering" className="max-w-3xl mx-auto px-6 py-24 border-t border-white/[0.06]">
        <Reveal>
          <h2 className="text-2xl font-semibold text-white mb-12 text-center">What we verified, not just claimed.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            {[
              { k: 'Isolation', v: 'Shadow DOM boundary — confirmed in DevTools, not assumed.' },
              { k: 'Resilience', v: 'Falls back from WebSocket to SSE to plain HTTP automatically.' },
              { k: 'Observability', v: 'Structured logs and error tracking on every request path.' },
              { k: 'Data hygiene', v: 'Automatic daily backups and retention purging, unattended.' },
            ].map((h) => (
              <div key={h.k} className="flex gap-3">
                <span className="w-1 h-1 mt-2 rounded-full bg-rose-400 flex-shrink-0" />
                <div>
                  <div className="text-[13px] font-semibold text-white mb-1">{h.k}</div>
                  <div className="text-[13px] text-gray-400 leading-relaxed">{h.v}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Embed */}
      <section id="embed" className="max-w-2xl mx-auto px-6 py-24 border-t border-white/[0.06]">
        <Reveal>
          <h2 className="text-2xl font-semibold text-white mb-2 text-center">One snippet. The whole integration.</h2>
          <p className="text-gray-500 text-[13px] mb-8 text-center">Exactly what a client pastes into their site.</p>
          <pre
            className="rounded-xl border border-white/[0.08] bg-[#0a0b0d] p-5 text-[12px] text-gray-300 overflow-x-auto font-mono leading-relaxed"
            style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}
          >
{`<script>
(function(w,d,s,o,f,js,fjs){
  w['ChatWidgetObject']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
  js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
}(window,document,'script','aiChat','https://your-domain.com/widget.js'));
aiChat('init', { appId: 'your-app-id', theme: { primaryColor: '#ff6363' } });
</script>`}
          </pre>
        </Reveal>
      </section>

      {/* Closing CTA band */}
      <section className="max-w-3xl mx-auto px-6 py-24 border-t border-white/[0.06] text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6 leading-snug">
          Ready to see it on your own site?
        </h2>
        <motion.a
          href="#embed"
          whileHover={{ scale: 1.035, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-gray-200 transition-colors duration-200"
        >
          Get the embed code
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </motion.a>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-14 border-t border-white/[0.06] text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>Embeddable AI Chat Widget</span>
        <div className="flex gap-8">
          <a href="/admin" className="hover:text-gray-300 transition-colors duration-200">Admin</a>
          <a href="/api/health" className="hover:text-gray-300 transition-colors duration-200">Status</a>
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
          aiChat('init', { appId: 'test-app', theme: { primaryColor: '#ff6363' } });
        `}
      </Script>
    </div>
  );
}