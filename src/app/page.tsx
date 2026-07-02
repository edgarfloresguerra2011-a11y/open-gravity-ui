'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, Check, Plus, Minus } from 'lucide-react';
import { useI18n } from '@/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

/**
 * Landing editorial premium.
 *
 * Principios de diseño:
 *   - Tipografía serif para headlines (Playfair Display) — distingue del SaaS genérico
 *   - Layouts asimétricos (no todo centrado)
 *   - Paleta champagne + navy oscuro — no verde neón
 *   - Líneas finas decorativas, no blobs
 *   - Animaciones sutiles (fade-up), no parpadeos
 *   - Hierarquía clara con eyebrow labels + reglas
 */

const DEMOS = [
  {
    id: 'saas-colombia',
    viabilityScore: 72,
    verdictKey: 'Favorable',
    ltv: '$340',
    cac: '$45',
    breakEven: '8m',
    accent: '#7fb069',
  },
  {
    id: 'restaurante-cdmx',
    viabilityScore: 58,
    verdictKey: 'Moderado',
    ltv: '$180',
    cac: '$28',
    breakEven: '14m',
    accent: '#d4a574',
  },
  {
    id: 'moda-sostenible',
    viabilityScore: 81,
    verdictKey: 'Excelente',
    ltv: '$520',
    cac: '$62',
    breakEven: '6m',
    accent: '#9d7bd8',
  },
];

const TRUST_LOGOS = [
  { label: 'DeepSeek V3', sub: 'LLM reasoning' },
  { label: 'Tavily', sub: '5 parallel crawlers' },
  { label: 'Monte Carlo', sub: '1,000 iterations' },
  { label: 'Upstash Redis', sub: 'Isolated storage' },
];

export default function LandingPage() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c10] text-[#f5f3ee] overflow-x-hidden">
      {/* Texture overlay muy sutil */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-0"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
        }}
      />

      {/* ════════════════════════════════════════ NAV ════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#0c0c10]/80 backdrop-blur-xl border-b border-white/5' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-champagne to-champagne-deep flex items-center justify-center">
              <span className="text-ink font-serif font-bold text-sm">OG</span>
            </div>
            <span className="font-serif text-lg tracking-tight">OpenGravity</span>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-sm">
            <a href="#features" className="text-white/60 hover:text-white transition-colors">{t.nav.features}</a>
            <a href="#demos" className="text-white/60 hover:text-white transition-colors">{t.nav.demos}</a>
            <a href="#pricing" className="text-white/60 hover:text-white transition-colors">{t.nav.pricing}</a>
            <a href="#faq" className="text-white/60 hover:text-white transition-colors">{t.nav.faq}</a>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <Link
              href="/app"
              className="hidden sm:block text-sm text-white/70 hover:text-white transition-colors px-3 py-2"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/app"
              className="bg-champagne text-ink px-4 py-2 rounded-md text-sm font-semibold hover:bg-champagne-light transition-colors flex items-center gap-2 group"
            >
              {t.nav.cta}
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════ HERO ════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Layout asimétrico: 2/3 + 1/3 */}
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8 animate-fade-up">
                <span className="rule-accent" />
                <span className="eyebrow text-champagne">{t.hero.badge}</span>
              </div>

              {/* Headline editorial — Playfair italic para énfasis */}
              <h1 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-tight mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                {t.hero.title1}{' '}
                <em className="text-champagne not-italic font-bold">{t.hero.titleHighlight1}</em>
                <br />
                {t.hero.title2}{' '}
                <em className="text-champagne not-italic font-bold">{t.hero.titleHighlight2}</em>
                <span className="text-champagne">.</span>
              </h1>

              <p className="text-lg lg:text-xl text-white/60 max-w-2xl leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <Link
                  href="/app"
                  className="group inline-flex items-center justify-center gap-2 bg-champagne text-ink px-7 py-4 rounded-md font-semibold hover:bg-champagne-light transition-all"
                >
                  {t.hero.ctaPrimary}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#demos"
                  className="inline-flex items-center justify-center gap-2 border border-white/15 px-7 py-4 rounded-md font-medium hover:bg-white/5 transition-colors"
                >
                  {t.hero.ctaSecondary}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-xs text-white/40 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                <span className="flex items-center gap-2"><Check size={12} className="text-champagne" />{t.hero.noCard}</span>
                <span className="flex items-center gap-2"><Check size={12} className="text-champagne" />{t.hero.freeSim}</span>
                <span className="flex items-center gap-2"><Check size={12} className="text-champagne" />{t.hero.pdfExport}</span>
              </div>
            </div>

            {/* Right column: floating stat card */}
            <div className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-white/8 animate-fade-up" style={{ animationDelay: '0.5s' }}>
              <div className="space-y-8">
                <div>
                  <div className="eyebrow mb-3">A single simulation gives you</div>
                  <ul className="space-y-3 text-sm">
                    {[
                      '1,000 Monte Carlo iterations',
                      'P10 / P50 / P90 percentiles',
                      '5-source confidence scoring',
                      'Executive PDF report',
                    ].map((item, i) => (
                      <li key={i} className="flex items-baseline gap-3">
                        <span className="text-champagne font-mono text-xs">0{i + 1}</span>
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/8">
                  <div className="font-serif text-5xl text-champagne mb-1">60s</div>
                  <div className="text-xs text-white/40">average simulation time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ TRUST BAR ════════════════════════════════════════ */}
      <section className="border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-white/30 mb-10">
            {t.trust.title}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TRUST_LOGOS.map((logo, i) => (
              <div key={i} className="text-center">
                <div className="font-serif text-xl text-white/70 mb-1">{logo.label}</div>
                <div className="text-xs text-white/30">{logo.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ DEMOS ════════════════════════════════════════ */}
      <section id="demos" className="py-32 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="rule-accent" />
              <span className="eyebrow">{t.demos.badge}</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-6xl tracking-tight mb-6">
              {t.demos.title}
              <span className="text-champagne">.</span>
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">{t.demos.subtitle}</p>
          </div>

          {/* Cards asimétricas — no 3 columnas iguales */}
          <div className="grid md:grid-cols-3 gap-6">
            {DEMOS.map((demo, i) => {
              const demoT = t.demos.items[i];
              return (
                <Link
                  key={demo.id}
                  href={`/app/predict?demo=${demo.id}`}
                  className="group relative p-8 rounded-xl border border-white/8 hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background: `linear-gradient(180deg, ${demo.accent}08 0%, transparent 60%)`,
                  }}
                >
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="text-xs text-white/40 mb-1">0{i + 1}</div>
                      <h3 className="font-serif text-2xl mb-1">{demoT.title}</h3>
                      <p className="text-sm text-white/50">{demoT.subtitle}</p>
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="text-white/30 group-hover:text-champagne transition-colors"
                    />
                  </div>

                  {/* Score grande */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xs uppercase tracking-wider text-white/40">{t.demos.viability}</span>
                      <span
                        className="font-serif text-5xl font-bold"
                        style={{ color: demo.accent }}
                      >
                        {demo.viabilityScore}
                      </span>
                    </div>
                    <div className="h-px bg-white/8 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 transition-all duration-700"
                        style={{
                          width: `${demo.viabilityScore}%`,
                          background: demo.accent,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/5">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{t.demos.ltv}</div>
                      <div className="font-mono text-sm">{demo.ltv}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{t.demos.cac}</div>
                      <div className="font-mono text-sm">{demo.cac}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{t.demos.breakEven}</div>
                      <div className="font-mono text-sm">{demo.breakEven}</div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: demo.accent }}
                    >
                      {demoT.verdict}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ FEATURES ════════════════════════════════════════ */}
      <section id="features" className="py-32 px-6 lg:px-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 mb-20">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="rule-accent" />
                <span className="eyebrow">{t.features.badge}</span>
              </div>
              <h2 className="font-serif text-4xl lg:text-6xl tracking-tight">
                {t.features.title}
                <span className="text-champagne">.</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-12">
              <p className="text-lg text-white/50 leading-relaxed">{t.features.subtitle}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {t.features.items.map((f, i) => (
              <div
                key={i}
                className="bg-[#0c0c10] p-8 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="font-mono text-xs text-champagne mb-6">PHASE</div>
                <h3 className="font-serif text-xl mb-4 leading-tight">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ HOW IT WORKS ════════════════════════════════════════ */}
      <section className="py-32 px-6 lg:px-10 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="rule-accent" />
              <span className="eyebrow">PROCESS</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-6xl tracking-tight">
              {t.how.title}
              <span className="text-champagne">.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {t.how.steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="font-serif text-7xl text-champagne/20 mb-6 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-serif text-2xl mb-4">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                {i < t.how.steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-6 text-champagne/30">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ PRICING ════════════════════════════════════════ */}
      <section id="pricing" className="py-32 px-6 lg:px-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 mb-20">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="rule-accent" />
                <span className="eyebrow">{t.pricing.badge}</span>
              </div>
              <h2 className="font-serif text-4xl lg:text-6xl tracking-tight">
                {t.pricing.title}
                <span className="text-champagne">.</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-12">
              <p className="text-lg text-white/50 leading-relaxed">{t.pricing.subtitle}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.pricing.plans.map((plan, i) => {
              const prices = ['$0', '$29', '$99'];
              const highlighted = i === 1;
              return (
                <div
                  key={plan.name}
                  className={`relative p-8 rounded-xl border transition-all ${
                    highlighted
                      ? 'border-champagne/40 bg-gradient-to-b from-champagne/[0.06] to-transparent shadow-premium'
                      : 'border-white/8 bg-white/[0.01] hover:border-white/15'
                  }`}
                >
                  {highlighted && (
                    <div className="absolute -top-3 left-8 bg-champagne text-ink text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {t.pricing.popular}
                    </div>
                  )}
                  <h3 className="font-serif text-2xl mb-2">{plan.name}</h3>
                  <p className="text-sm text-white/40 mb-8 min-h-[40px]">{plan.description}</p>
                  <div className="mb-8">
                    <span className="font-serif text-5xl font-bold tracking-tight">{prices[i]}</span>
                    <span className="text-white/40 text-sm">{t.pricing.perMonth}</span>
                  </div>
                  <ul className="space-y-3 mb-10">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm">
                        <Check
                          size={14}
                          className={`mt-1 shrink-0 ${highlighted ? 'text-champagne' : 'text-white/30'}`}
                        />
                        <span className="text-white/70">{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/app"
                    className={`block text-center py-3 rounded-md font-semibold text-sm transition-all ${
                      highlighted
                        ? 'bg-champagne text-ink hover:bg-champagne-light'
                        : 'border border-white/15 hover:bg-white/5'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ TESTIMONIALS ════════════════════════════════════════ */}
      <section className="py-32 px-6 lg:px-10 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="rule-accent" />
              <span className="eyebrow">CASE STUDIES</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-6xl tracking-tight">
              {t.testimonials.title}
              <span className="text-champagne">.</span>
            </h2>
            <p className="text-lg text-white/50 mt-6">{t.testimonials.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.testimonials.items.map((item, i) => (
              <div key={i} className="p-8 rounded-xl border border-white/8 bg-white/[0.01]">
                <h3 className="font-serif text-xl mb-1">{item.title}</h3>
                <p className="text-xs text-white/40 mb-6">{item.role}</p>
                <blockquote className="text-sm text-white/70 leading-relaxed italic mb-8">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="pt-6 border-t border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{t.testimonials.result}</div>
                  <div className="font-serif text-xl text-champagne">{item.metric}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ FAQ ════════════════════════════════════════ */}
      <section id="faq" className="py-32 px-6 lg:px-10 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="rule-accent" />
              <span className="eyebrow">FAQ</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-6xl tracking-tight">
              {t.faq.title}
              <span className="text-champagne">.</span>
            </h2>
          </div>

          <div className="divide-y divide-white/8 border-y border-white/8">
            {t.faq.items.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ FINAL CTA ════════════════════════════════════════ */}
      <section className="py-40 px-6 lg:px-10 border-t border-white/5 relative overflow-hidden">
        {/* Glow sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-champagne/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="font-serif text-4xl lg:text-7xl tracking-tight mb-8 leading-[0.95]">
            {t.finalCta.title1}
            <br />
            <em className="text-champagne not-italic font-bold">{t.finalCta.title2}</em>
            <span className="text-champagne">.</span>
          </h2>
          <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">{t.finalCta.subtitle}</p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-champagne text-ink px-10 py-5 rounded-md font-bold text-lg hover:bg-champagne-light transition-all group"
          >
            {t.finalCta.cta}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-xs text-white/30 mt-6">{t.finalCta.note}</p>
        </div>
      </section>

      {/* ════════════════════════════════════════ FOOTER ════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-12 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-champagne to-champagne-deep flex items-center justify-center">
              <span className="text-ink font-serif font-bold text-xs">OG</span>
            </div>
            <div>
              <div className="font-serif text-sm">OpenGravity</div>
              <div className="text-xs text-white/30">{t.footer.copyright}</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <Link href="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t.footer.terms}</Link>
            <Link href="/app" className="hover:text-white transition-colors">{t.footer.dashboard}</Link>
            <a href="mailto:hola@opengravity.dev" className="hover:text-white transition-colors">{t.footer.contact}</a>
            <LanguageSwitcher compact />
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── FAQ Item con animación ──────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group"
        aria-expanded={open}
      >
        <span className="font-serif text-lg group-hover:text-champagne transition-colors">{q}</span>
        <span className="text-champagne shrink-0">
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      {open && (
        <div className="pb-6 text-sm text-white/60 leading-relaxed animate-fade-up">
          {a}
        </div>
      )}
    </div>
  );
}
