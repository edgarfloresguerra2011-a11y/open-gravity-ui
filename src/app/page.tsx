'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react';
import { useI18n } from '@/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

/* ════════════════════════════════════════════════════════════════════════
   OpenGravity — Landing V2
   Design refs: Linear · Vercel · Resend · marketnow.site
   Pure black #050505 · mint #00F299 · cyan #00d1ff · paper #f4f3ec
   Geist display · Inter body · JetBrains Mono for code/data
   Asymmetric grid · sharp 4px corners · 1px hairlines · terminal windows
   ════════════════════════════════════════════════════════════════════════ */

const DEMOS = [
  {
    id: 'saas-colombia',
    viabilityScore: 72,
    ltv: '$340',
    cac: '$45',
    breakEven: '8',
    filename: 'sim_saas_colombia.log',
    barColor: '#00F299', // mint
  },
  {
    id: 'restaurante-cdmx',
    viabilityScore: 58,
    ltv: '$180',
    cac: '$28',
    breakEven: '14',
    filename: 'sim_restaurante_cdmx.log',
    barColor: '#ffd479', // amber
  },
  {
    id: 'moda-sostenible',
    viabilityScore: 81,
    ltv: '$520',
    cac: '$62',
    breakEven: '6',
    filename: 'sim_moda_sostenible.log',
    barColor: '#00d1ff', // cyan
  },
];

// Pricing matrix labels — translated at runtime via t.pricingMatrix.*
// (defined in i18n dictionaries)
const PRICING_PRICES = ['$0', '$29', '$99'];

export default function LandingPage() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-og-bg text-paper overflow-x-hidden">
      <a href="#main" className="skip-link">
        {t.skipToContent}
      </a>

      {/* Fixed technical grid background (Linear/Vercel) */}
      <div className="og-grid-bg" aria-hidden />

      {/* ════════════════════════════════════════ 1. TICKER ════════════════════════════════════════ */}
      <TickerBar t={t} />

      {/* ════════════════════════════════════════ 2. NAV ════════════════════════════════════════ */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-og-bg/85 backdrop-blur-xl border-b border-hairline'
            : 'bg-transparent border-b border-transparent'
        }`}
        aria-label="Primary"
      >
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-[15px] font-medium tracking-tight text-paper hover:text-mint transition-colors"
          >
            OpenGravity
            <span className="text-mint">_</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-mono">
            <a
              href="#demos"
              className="text-paper/60 hover:text-paper transition-colors"
            >
              {t.nav.demos}
            </a>
            <a
              href="#pipeline"
              className="text-paper/60 hover:text-paper transition-colors"
            >
              {t.nav.features}
            </a>
            <a
              href="#pricing"
              className="text-paper/60 hover:text-paper transition-colors"
            >
              {t.nav.pricing}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <Link
              href="/app"
              className="hidden sm:block font-mono text-[13px] text-paper/60 hover:text-paper transition-colors"
            >
              {t.nav.login}
            </Link>
            <Link href="/app" className="btn-primary text-[13px]">
              {t.nav.cta}
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </nav>

      <main id="main">
        {/* ════════════════════════════════════════ 3. HERO ════════════════════════════════════════ */}
        <Hero t={t} />

        {/* ════════════════════════════════════════ 4. TRUST STRIP ════════════════════════════════════════ */}
        <TrustStrip t={t} />

        {/* ════════════════════════════════════════ 5. DEMOS ════════════════════════════════════════ */}
        <DemosSection t={t} />

        {/* ════════════════════════════════════════ 6. PIPELINE ════════════════════════════════════════ */}
        <PipelineSection t={t} />

        {/* ════════════════════════════════════════ 7. PRICING ════════════════════════════════════════ */}
        <PricingSection t={t} />

        {/* ════════════════════════════════════════ 8. FINAL CTA ════════════════════════════════════════ */}
        <FinalCta t={t} />
      </main>

      {/* ════════════════════════════════════════ 9. FOOTER ════════════════════════════════════════ */}
      <Footer t={t} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   1. TICKER — auto-scrolling stats marquee at top
   ════════════════════════════════════════════════════════════════════════ */
function TickerBar({ t }: { t: ReturnType<typeof useI18n>['t'] }) {
  // Duplicate the list so the marquee can loop seamlessly (-50% translate)
  const stats = t.ticker.stats;
  const doubled = [...stats, ...stats];
  return (
    <div
      className="relative z-50 h-8 bg-og-bg border-b border-hairline overflow-hidden flex items-center"
      role="status"
      aria-live="off"
      aria-label={t.ticker.live}
    >
      <div className="flex items-center h-full">
        <div className="h-full px-3 flex items-center bg-mint text-og-bg font-mono text-[10px] font-bold uppercase tracking-[0.15em] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-og-bg animate-pulse mr-2" />
          {t.ticker.live}
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap will-change-transform">
            {doubled.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center font-mono text-[11px] text-paper/55 px-5"
              >
                <span className="text-mint mr-2">▸</span>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   3. HERO — asymmetric 7/5 split
   ════════════════════════════════════════════════════════════════════════ */
function Hero({ t }: { t: ReturnType<typeof useI18n>['t'] }) {
  const heroRef = useRef<HTMLDivElement>(null);

  // Cursor-following gradient (subtle, hero-only)
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;
      el.style.setProperty('--mx', mx.toFixed(3));
      el.style.setProperty('--my', my.toFixed(3));
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="cursor-glow relative pt-16 lg:pt-24 pb-24 lg:pb-32 px-5 lg:px-10 overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Glowing intersection dots over the grid (mint) */}
      <div className="og-grid-dots" aria-hidden />

      <div className="relative max-w-[1280px] mx-auto">
        {/* Asymmetric grid 7 / 5 */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* LEFT — 7 cols */}
          <div className="lg:col-span-7 relative z-10">
            {/* Eyebrow */}
            <div className="flex items-center mb-8 animate-fade-up">
              <span className="rule-accent" />
              <span className="eyebrow">{t.hero.badge}</span>
            </div>

            {/* Headline — Geist, very tight tracking, $50K + 60s in mint */}
            <h1
              id="hero-title"
              className="font-display text-[clamp(2.4rem,6.2vw,5.25rem)] leading-[0.95] tracking-[-0.045em] mb-8 animate-fade-up"
              style={{ animationDelay: '80ms' }}
            >
              {t.hero.title1}{' '}
              <span className="hl-mint">{t.hero.titleHighlight1}</span>
              <br />
              {t.hero.title2}{' '}
              <span className="hl-mint">{t.hero.titleHighlight2}</span>
              <span className="text-mint">.</span>
            </h1>

            {/* Subhead using the i18n subtitle */}
            <p
              className="text-[15px] lg:text-[17px] text-paper/55 max-w-[640px] leading-relaxed mb-10 animate-fade-up"
              style={{ animationDelay: '160ms' }}
            >
              {t.hero.subtitle}
            </p>

            {/* Inline price-ticker row — big mono numbers */}
            <div
              className="flex items-stretch gap-px border border-hairline mb-10 animate-fade-up"
              style={{ animationDelay: '220ms' }}
            >
              <StatTicker
                label={t.heroStats.costOfFailure}
                value={t.hero.titleHighlight1}
                accent="mint"
              />
              <div className="w-px bg-hairline" />
              <StatTicker
                label={t.heroStats.timeToVerdict}
                value={t.hero.titleHighlight2}
                accent="cyan"
              />
              <div className="w-px bg-hairline" />
              <StatTicker
                label={t.heroStats.iterations}
                value="1,000"
                accent="paper"
              />
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 animate-fade-up"
              style={{ animationDelay: '280ms' }}
            >
              <Link href="/app" className="btn-primary">
                {t.hero.ctaPrimary}
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <a href="#demos" className="btn-ghost">
                {t.hero.ctaSecondary}
              </a>
            </div>

            {/* Fine print — mono */}
            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 font-mono text-[11px] text-paper/40 animate-fade-up"
              style={{ animationDelay: '340ms' }}
            >
              <span className="flex items-center gap-2">
                <Check size={11} className="text-mint" strokeWidth={3} />
                {t.hero.noCard}
              </span>
              <span className="flex items-center gap-2">
                <Check size={11} className="text-mint" strokeWidth={3} />
                {t.hero.freeSim}
              </span>
              <span className="flex items-center gap-2">
                <Check size={11} className="text-mint" strokeWidth={3} />
                {t.hero.pdfExport}
              </span>
            </div>
          </div>

          {/* RIGHT — 5 cols : live simulation terminal */}
          <div
            className="lg:col-span-5 relative z-10 animate-fade-up"
            style={{ animationDelay: '380ms' }}
          >
            <HeroTerminal t={t} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Hero stat ticker — like a price ticker (mono, big) */
function StatTicker({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: 'mint' | 'cyan' | 'paper';
}) {
  const color =
    accent === 'mint'
      ? 'text-mint'
      : accent === 'cyan'
      ? 'text-cyan-elec'
      : 'text-paper';
  return (
    <div className="flex-1 px-4 py-3 bg-og-panel/60 backdrop-blur-sm">
      <div className="font-mono text-[9px] tracking-[0.16em] text-paper/40 uppercase mb-1">
        {label}
      </div>
      <div className={`font-mono text-2xl lg:text-3xl font-medium tabular-nums ${color}`}>
        {value}
      </div>
    </div>
  );
}

/* Hero terminal — fake live Monte Carlo simulation output */
function HeroTerminal({ t }: { t: ReturnType<typeof useI18n>['t'] }) {
  const lines: { ln: string; content: React.ReactNode }[] = [
    { ln: '01', content: <><span className="prompt">$</span> {t.terminal.cmd.replace(/^\$\s*/, '')}</> },
    { ln: '02', content: <><span className="dim">▸</span> {t.terminal.crawlerLine.replace(/^▸\s*/, '')} <span className="ok">{t.terminal.ok}</span></> },
    { ln: '03', content: <><span className="dim">▸</span> {t.terminal.iterationsLine.replace(/^▸\s*/, '')} <span className="ok">{t.terminal.ok}</span></> },
    { ln: '04', content: <><span className="dim">▸</span> {t.terminal.synthesisLine.replace(/^▸\s*/, '')} <span className="ok">{t.terminal.ok}</span></> },
    { ln: '05', content: <span className="dim">─────────────────────────────────────────</span> },
    { ln: '06', content: <><span className="accent">{t.terminal.p50ltv}</span>      <span className="ok">$340</span>   ±12%</> },
    { ln: '07', content: <><span className="accent">{t.terminal.p50cac}</span>      <span className="ok">$45</span></> },
    { ln: '08', content: <><span className="accent">{t.terminal.breakEven}</span>  <span className="ok">8 {t.terminal.months}</span></> },
    { ln: '09', content: <span className="dim">─────────────────────────────────────────</span> },
    { ln: '10', content: <>{t.terminal.verdict}  <span className="ok">████████</span><span className="dim">██</span>  <span className="ok">72 / 100</span></> },
    { ln: '11', content: <><span className="ok">{t.terminal.done}</span><span className="term-cursor" /></> },
  ];
  return (
    <div className="terminal shadow-glow-mint">
      <div className="terminal-titlebar">
        <span className="terminal-dot" style={{ background: '#ff5f57' }} />
        <span className="terminal-dot" style={{ background: '#febc2e' }} />
        <span className="terminal-dot" style={{ background: '#28c840' }} />
        <span className="ml-2">{t.terminal.titlebar}</span>
        <span className="ml-auto text-paper/30">{t.terminal.version}</span>
      </div>
      <div className="terminal-body">
        {lines.map((l, i) => (
          <div key={i}>
            <span className="ln">{l.ln}</span>
            {l.content}
          </div>
        ))}
      </div>
      {/* Subtle scan-line animation across the terminal */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-12 bottom-0 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute inset-x-0 h-px bg-mint/40 animate-scan-line"
          style={{ filter: 'blur(0.5px)' }}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   4. TRUST STRIP — mono names, dot-separated
   ════════════════════════════════════════════════════════════════════════ */
function TrustStrip({ t }: { t: ReturnType<typeof useI18n>['t'] }) {
  const items = [
    t.trust.deepseek,
    t.trust.tavily,
    t.trust.montecarlo,
    t.trust.upstash,
  ];
  return (
    <section
      className="relative border-y border-hairline py-8 px-5 lg:px-10"
      aria-label={t.trust.title}
    >
      <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-[13px]">
        {items.map((name, i) => (
          <span key={i} className="flex items-center gap-6">
            <span className="text-paper/55 hover:text-paper transition-colors">
              {name}
            </span>
            {i < items.length - 1 && (
              <span className="text-mint/60 select-none" aria-hidden>
                ·
              </span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   5. DEMOS — 3 terminal windows with titlebar + verdict as big mono number
   ════════════════════════════════════════════════════════════════════════ */
function DemosSection({ t }: { t: ReturnType<typeof useI18n>['t'] }) {
  return (
    <section
      id="demos"
      className="relative py-24 lg:py-32 px-5 lg:px-10"
      aria-labelledby="demos-title"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header — asymmetric */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="section-index">02 / 06</span>
              <span className="rule-accent" />
              <span className="eyebrow">{t.demos.badge}</span>
            </div>
            <h2
              id="demos-title"
              className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1] tracking-[-0.04em]"
            >
              {t.demos.title}
              <span className="hl-mint">.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-6">
            <p className="text-[15px] text-paper/50 leading-relaxed">
              {t.demos.subtitle}
            </p>
          </div>
        </div>

        {/* Three terminal cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {DEMOS.map((demo, i) => (
            <DemoTerminalCard key={demo.id} demo={demo} index={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoTerminalCard({
  demo,
  index,
  t,
}: {
  demo: (typeof DEMOS)[number];
  index: number;
  t: ReturnType<typeof useI18n>['t'];
}) {
  const demoT = t.demos.items[index];
  const filled = Math.round(demo.viabilityScore / 10);
  const bar = Array.from({ length: 10 }, (_, i) =>
    i < filled ? '█' : '░'
  ).join('');

  return (
    <Link
      href={`/app/predict?demo=${demo.id}`}
      className="terminal group hover:border-mint/40 transition-colors duration-300"
      aria-label={`${demoT.title} — ${demoT.verdict}`}
    >
      <div className="terminal-titlebar">
        <span className="terminal-dot" style={{ background: '#ff5f57' }} />
        <span className="terminal-dot" style={{ background: '#febc2e' }} />
        <span className="terminal-dot" style={{ background: '#28c840' }} />
        <span className="ml-2 truncate">{demo.filename}</span>
        <ArrowUpRight
          size={13}
          className="ml-auto text-paper/30 group-hover:text-mint transition-colors shrink-0"
        />
      </div>

      <div className="terminal-body min-h-[260px] flex flex-col">
        {/* Title + subtitle */}
        <div className="mb-4">
          <div className="font-mono text-[10px] text-paper/40 mb-1">
            0{index + 1}
          </div>
          <div className="font-sans text-[15px] font-semibold text-paper leading-tight mb-1">
            {demoT.title}
          </div>
          <div className="font-sans text-[12px] text-paper/45">
            {demoT.subtitle}
          </div>
        </div>

        <div className="border-t border-hairline pt-4 mb-4">
          <span className="dim">▸ {t.terminal.crawlerLine.replace(/^▸\s*/, '')}</span>{' '}
          <span className="ok">{t.terminal.ok}</span>
          <br />
          <span className="dim">▸ {t.terminal.verdict}:</span>
        </div>

        {/* BIG verdict number in mono — the centerpiece */}
        <div className="flex items-baseline justify-between mb-3">
          <span className="font-mono text-[10px] tracking-[0.16em] text-paper/40 uppercase">
            {t.demos.viability}
          </span>
          <span
            className="font-mono text-5xl font-medium tabular-nums leading-none"
            style={{ color: demo.barColor, textShadow: `0 0 24px ${demo.barColor}55` }}
          >
            {demo.viabilityScore}
          </span>
        </div>

        {/* ASCII bar in mono */}
        <div className="font-mono text-[12px] mb-4" style={{ color: demo.barColor }}>
          {bar}
        </div>

        {/* Stats — mono, tabular */}
        <div className="grid grid-cols-3 gap-px bg-hairline border border-hairline mb-4">
          <DemoStat label={t.demos.ltv} value={demo.ltv} />
          <DemoStat label={t.demos.cac} value={demo.cac} />
          <DemoStat label={t.demos.breakEven} value={demo.breakEven} />
        </div>

        {/* Verdict label */}
        <div className="mt-auto pt-3 border-t border-hairline flex items-center justify-between">
          <span
            className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]"
            style={{ color: demo.barColor }}
          >
            {demoT.verdict}
          </span>
          <span className="font-mono text-[11px] text-paper/40 group-hover:text-mint transition-colors">
            {t.demos.viewFull} →
          </span>
        </div>
      </div>
    </Link>
  );
}

function DemoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-og-panel px-3 py-2">
      <div className="font-mono text-[9px] tracking-[0.14em] text-paper/40 uppercase mb-0.5">
        {label}
      </div>
      <div className="font-mono text-[13px] text-paper tabular-nums">{value}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   6. PIPELINE — vertical timeline (uses t.features.items = 4 phases)
   ════════════════════════════════════════════════════════════════════════ */
function PipelineSection({ t }: { t: ReturnType<typeof useI18n>['t'] }) {
  return (
    <section
      id="pipeline"
      className="relative py-24 lg:py-32 px-5 lg:px-10 border-t border-hairline bg-og-panel/40"
      aria-labelledby="pipeline-title"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="section-index">03 / 06</span>
              <span className="rule-accent" />
              <span className="eyebrow">{t.features.badge}</span>
            </div>
            <h2
              id="pipeline-title"
              className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1] tracking-[-0.04em]"
            >
              {t.features.title}
              <span className="hl-mint">.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-6">
            <p className="text-[15px] text-paper/50 leading-relaxed">
              {t.features.subtitle}
            </p>
          </div>
        </div>

        {/* Vertical timeline */}
        <ol className="relative border-l border-hairline pl-8 lg:pl-12 space-y-12">
          {t.features.items.map((phase, i) => {
            const num = String(i + 1).padStart(2, '0');
            const isLast = i === t.features.items.length - 1;
            return (
              <li key={i} className="relative animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                {/* Node on the line — mint glow dot */}
                <span
                  className="absolute -left-[42px] lg:-left-[58px] top-1 flex items-center justify-center"
                  aria-hidden
                >
                  <span className="w-3 h-3 bg-mint rounded-full shadow-glow-mint" />
                  <span className="absolute w-3 h-3 bg-mint rounded-full animate-ping opacity-40" />
                </span>

                {/* Phase number + horizontal rule + title */}
                <div className="flex items-center gap-4 mb-3">
                  <span className="font-mono text-[13px] font-medium text-mint tabular-nums">
                    {num}
                  </span>
                  <span className="flex-1 h-px bg-gradient-to-r from-mint/60 via-hairline to-transparent" />
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5">
                    <h3 className="font-display text-2xl lg:text-[28px] tracking-[-0.025em] text-paper">
                      {phase.title.replace(/^\d+\s·\s/, '')}
                    </h3>
                  </div>
                  <div className="lg:col-span-7">
                    <p className="text-[14px] text-paper/55 leading-relaxed">
                      {phase.desc}
                    </p>
                  </div>
                </div>

                {/* Terminal preview for the last node */}
                {isLast && (
                  <div className="mt-6 terminal max-w-2xl">
                    <div className="terminal-titlebar">
                      <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                      <span className="terminal-dot" style={{ background: '#febc2e' }} />
                      <span className="terminal-dot" style={{ background: '#28c840' }} />
                      <span className="ml-2">synthesis.log</span>
                    </div>
                    <div className="terminal-body text-[11.5px]">
                      <div>
                        <span className="ln">$</span>
                        <span className="prompt">og</span> synthesize --job=85a3
                      </div>
                      <div>
                        <span className="ln">·</span>
                        <span className="dim">▸</span> executive summary...{' '}
                        <span className="ok">ok</span>
                      </div>
                      <div>
                        <span className="ln">·</span>
                        <span className="dim">▸</span> key risks extracted...{' '}
                        <span className="ok">ok</span>
                      </div>
                      <div>
                        <span className="ln">·</span>
                        <span className="dim">▸</span> pricing strategy...{' '}
                        <span className="ok">ok</span>
                      </div>
                      <div>
                        <span className="ln">✓</span>
                        <span className="ok">report ready</span> ·{' '}
                        <span className="accent">report_p50.pdf</span>
                        <span className="term-cursor" />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   7. PRICING — single-column comparison matrix table
   ════════════════════════════════════════════════════════════════════════ */
function PricingSection({ t }: { t: ReturnType<typeof useI18n>['t'] }) {
  const plans = t.pricing.plans;
  const popularIdx = 1; // Pro is the highlighted plan

  return (
    <section
      id="pricing"
      className="relative py-24 lg:py-32 px-5 lg:px-10 border-t border-hairline"
      aria-labelledby="pricing-title"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="section-index">04 / 06</span>
              <span className="rule-accent" />
              <span className="eyebrow">{t.pricing.badge}</span>
            </div>
            <h2
              id="pricing-title"
              className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1] tracking-[-0.04em]"
            >
              {t.pricing.title}
              <span className="hl-mint">.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-6">
            <p className="text-[15px] text-paper/50 leading-relaxed">
              {t.pricing.subtitle}
            </p>
          </div>
        </div>

        {/* Comparison table */}
        <div className="terminal">
          {/* Header row — plan names + prices */}
          <div className="grid grid-cols-4 border-b border-hairline">
            <div className="p-5 lg:p-6">
              <span className="font-mono text-[10px] tracking-[0.16em] text-paper/40 uppercase">
                {t.pricingMatrix.planHeader}
              </span>
            </div>
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative p-5 lg:p-6 border-l border-hairline ${
                  i === popularIdx ? 'bg-mint/[0.04]' : ''
                }`}
              >
                {i === popularIdx && (
                  <span className="absolute top-0 left-0 right-0 h-px bg-mint" />
                )}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-lg lg:text-xl text-paper tracking-tight">
                    {plan.name}
                  </span>
                  {i === popularIdx && (
                    <span className="font-mono text-[9px] tracking-[0.14em] text-mint uppercase border border-mint/40 px-1.5 py-0.5">
                      {t.pricing.popular}
                    </span>
                  )}
                </div>
                <div className="font-mono text-2xl lg:text-3xl text-paper tabular-nums">
                  {PRICING_PRICES[i]}
                  {i < 2 && (
                    <span className="font-mono text-[11px] text-paper/40 ml-1">
                      {t.pricing.perMonth}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Feature rows */}
          {t.pricingMatrix.rows.map((row, ri) => (
            <div
              key={row.label}
              className={`grid grid-cols-4 ${
                ri % 2 === 0 ? 'bg-paper/[0.012]' : ''
              } border-b border-hairline last:border-b-0`}
            >
              <div className="p-4 lg:p-5 font-mono text-[12px] text-paper/65">
                {row.label}
              </div>
              {row.cells.map((cell, ci) => (
                <div
                  key={ci}
                  className={`p-4 lg:p-5 border-l border-hairline font-mono text-[12px] ${
                    ci === popularIdx ? 'bg-mint/[0.02]' : ''
                  } ${cell === '✓' ? 'text-mint' : cell === '—' ? 'text-paper/25' : 'text-paper/80'}`}
                >
                  {cell === '✓' ? (
                    <Check size={14} strokeWidth={3} className="inline" />
                  ) : cell === '—' ? (
                    <X size={13} strokeWidth={2.5} className="inline opacity-60" />
                  ) : (
                    <span className="tabular-nums">{cell}</span>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* CTA row */}
          <div className="grid grid-cols-4">
            <div className="p-5 lg:p-6" />
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`p-5 lg:p-6 border-l border-hairline ${
                  i === popularIdx ? 'bg-mint/[0.04]' : ''
                }`}
              >
                <Link
                  href="/app"
                  className={
                    i === popularIdx
                      ? 'btn-primary w-full text-[12px]'
                      : 'btn-ghost w-full text-[12px]'
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   8. FINAL CTA — full-width mint glow
   ════════════════════════════════════════════════════════════════════════ */
function FinalCta({ t }: { t: ReturnType<typeof useI18n>['t'] }) {
  return (
    <section
      className="relative py-28 lg:py-40 px-5 lg:px-10 border-t border-hairline overflow-hidden"
      aria-labelledby="final-cta-title"
    >
      {/* Full-width mint glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(0, 242, 153, 0.16), transparent 70%)',
        }}
      />
      {/* Diagonal sharp divider at top */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--mint), transparent)',
        }}
      />

      <div className="relative max-w-[900px] mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="rule-accent" />
          <span className="eyebrow">{t.finalCtaReady}</span>
          <span className="rule-accent" style={{ marginRight: 0, marginLeft: 12 }} />
        </div>

        <h2
          id="final-cta-title"
          className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.95] tracking-[-0.045em] mb-8"
        >
          {t.finalCta.title1} <span className="hl-mint">{t.finalCta.title2}</span>
          <span className="hl-mint">.</span>
        </h2>

        <p className="text-[16px] lg:text-[17px] text-paper/55 mb-10 max-w-[560px] mx-auto leading-relaxed">
          {t.finalCta.subtitle}
        </p>

        <Link href="/app" className="btn-primary text-base px-10 py-4">
          {t.finalCta.cta}
          <ArrowRight size={17} strokeWidth={2.5} />
        </Link>

        <p className="font-mono text-[11px] text-paper/35 mt-6">
          {t.finalCta.note}
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   9. FOOTER — minimal, mono
   ════════════════════════════════════════════════════════════════════════ */
function Footer({ t }: { t: ReturnType<typeof useI18n>['t'] }) {
  return (
    <footer className="border-t border-hairline py-10 px-5 lg:px-10">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[12px]">
        <div className="flex items-center gap-3">
          <span className="text-paper font-medium">
            OpenGravity<span className="text-mint">_</span>
          </span>
          <span className="text-paper/30">·</span>
          <span className="text-paper/40">{t.footer.copyright}</span>
        </div>
        <div className="flex items-center gap-5 text-paper/40">
          <Link href="/privacy" className="hover:text-mint transition-colors">
            {t.footer.privacy}
          </Link>
          <Link href="/terms" className="hover:text-mint transition-colors">
            {t.footer.terms}
          </Link>
          <Link href="/app" className="hover:text-mint transition-colors">
            {t.footer.dashboard}
          </Link>
          <a
            href="mailto:hola@opengravity.dev"
            className="hover:text-mint transition-colors"
          >
            {t.footer.contact}
          </a>
          <LanguageSwitcher compact />
        </div>
      </div>
    </footer>
  );
}
