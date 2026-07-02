import Link from 'next/link';
import { ArrowRight, Brain, Target, BarChart3, Zap, Shield, Globe, Check, Star } from 'lucide-react';

/**
 * Landing page pública de OpenGravity.
 *
 * Conversión: visitante → "Prueba gratis" → /app (dashboard con login)
 *
 * Estructura:
 *   1. Hero con propuesta de valor + CTA
 *   2. Logos / trust badges
 *   3. Demo embebida (3 ejemplos clicables)
 *   4. Features (3 columnas)
 *   5. Cómo funciona (3 pasos)
 *   6. Pricing (3 planes)
 *   7. Testimonios / casos de uso
 *   8. FAQ
 *   9. CTA final
 *   10. Footer
 */

const DEMOS = [
  {
    id: 'saas-colombia',
    title: 'SaaS B2B de logística',
    subtitle: 'Para flotillas en Colombia',
    idea: 'SaaS B2B de logística para flotillas en Colombia',
    viabilityScore: 72,
    verdict: 'Favorable',
    ltv: '$340',
    cac: '$45',
    breakEven: '8 meses',
    color: 'from-emerald-500/20 to-emerald-500/5',
    accent: 'text-emerald-400',
  },
  {
    id: 'restaurante-cdmx',
    title: 'Restaurante de comida rápida',
    subtitle: 'CDMX, delivery-first',
    idea: 'Restaurante de comida rápida en CDMX con modelo delivery-first',
    viabilityScore: 58,
    verdict: 'Moderado',
    ltv: '$180',
    cac: '$28',
    breakEven: '14 meses',
    color: 'from-amber-500/20 to-amber-500/5',
    accent: 'text-amber-400',
  },
  {
    id: 'moda-sostenible',
    title: 'Tienda online de moda sostenible',
    subtitle: 'LatAm, suscripción mensual',
    idea: 'Tienda online de moda sostenible con suscripción mensual',
    viabilityScore: 81,
    verdict: 'Excelente',
    ltv: '$520',
    cac: '$62',
    breakEven: '6 meses',
    color: 'from-violet-500/20 to-violet-500/5',
    accent: 'text-violet-400',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/mes',
    description: 'Para validar una idea puntual',
    features: [
      '3 simulaciones por mes',
      'Chat con IA (10 mensajes/día)',
      'Reporte básico P10/P50/P90',
      '1 cron job de marketing',
    ],
    cta: 'Empezar gratis',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mes',
    description: 'Para emprendedores serios',
    features: [
      '50 simulaciones por mes',
      'Chat con IA ilimitado',
      'Reportes completos + export PDF',
      '10 cron jobs de marketing',
      'Historial persistente',
      'Soporte por email',
    ],
    cta: 'Probar 14 días gratis',
    highlighted: true,
  },
  {
    name: 'Agency',
    price: '$99',
    period: '/mes',
    description: 'Para consultores y agencias',
    features: [
      'Simulaciones ilimitadas',
      'Multi-usuario (5 cuentas)',
      'API access (10K llamadas/mes)',
      'Cron jobs ilimitados',
      'Marca blanca en reportes',
      'Soporte prioritario + onboarding',
    ],
    cta: 'Hablar con ventas',
    highlighted: false,
  },
];

const FAQ = [
  {
    q: '¿En qué se diferencia OpenGravity de un cálculo manual?',
    a: 'OpenGravity corre 1,000 simulaciones Monte Carlo con PRNG determinista (Mulberry32), variando macro shocks, elasticidad de precio, churn y CAC. Te entrega percentiles P10/P50/P90 — no un único número optimista. Cada simulación incluye scoring de confianza basado en la autoridad y frescura de fuentes reales (Bloomberg, WSJ, Statista, McKinsey).',
  },
  {
    q: '¿De dónde salen los datos del análisis?',
    a: 'Usamos Tavily API para correr 5 crawlers en paralelo: overview, tendencias, competidores, métricas cuantitativas y riesgos. Cada fuente recibe un score de confianza (0-100) basado en autoridad del dominio, frescura de los datos y consistencia entre fuentes.',
  },
  {
    q: '¿Cuánto tarda una simulación?',
    a: 'Entre 35 y 60 segundos. El pipeline es asíncrono: lanzas la idea, te devuelve un jobId, y el frontend hace polling cada 3-15s hasta que el reporte está listo. Recibirás notificación cuando termine.',
  },
  {
    q: '¿Puedo usarlo para cualquier tipo de negocio?',
    a: 'Sí. El motor está calibrado para SaaS, e-commerce, restaurantes, servicios profesionales, productos físicos y marketplaces. La simulación ajusta automáticamente el tamaño de muestra (0.01% del TAM) y el umbral de saturación de CAC según el mercado.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Todas las simulaciones se guardan en Upstash Redis con namespace por usuario. No compartimos tus ideas de negocio con terceros. Los LLM calls van a DeepSeek con tu API key. Puedes borrar tu cuenta y todos tus datos en cualquier momento.',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí, sin penalización. Cancelas desde el dashboard y tu plan vuelve a Free al final del período facturado. No hay contrato anual obligatorio.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#050508]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-violet-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Brain size={20} className="text-black" />
            </div>
            <span className="font-bold text-lg tracking-tight">OpenGravity</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demos" className="hover:text-white transition-colors">Demos</a>
            <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/app" className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors">
              Iniciar sesión
            </Link>
            <Link
              href="/app"
              className="bg-white text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              Prueba gratis <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-emerald-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Motor Monte Carlo V3 · 1,000 iteraciones por simulación
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[1.05] mb-6">
            Antes de invertir{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-violet-400 bg-clip-text text-transparent">
              $50,000
            </span>
            <br />
            simula tu negocio en{' '}
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              60 segundos
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            OpenGravity lanza un ejército de inteligencias artificiales contra tu idea de negocio:
            research profundo, agentes sintéticos y 1,000 universos paralelos de Monte Carlo.
            Te dice si tu startup va a sobrevivir — antes de que pongas un peso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/app"
              className="group bg-gradient-to-r from-emerald-400 to-emerald-500 text-black px-8 py-4 rounded-xl font-bold text-base hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-emerald-500/30"
            >
              Lanzar simulación gratis
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#demos"
              className="px-8 py-4 rounded-xl font-semibold text-base border border-white/10 hover:bg-white/5 transition-colors"
            >
              Ver demos en vivo
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-400" />
              Sin tarjeta de crédito
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-400" />
              3 simulaciones gratis
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-400" />
              Reporte PDF descargable
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BADGES ═══ */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-widest text-gray-600 mb-8">
            Tecnología de grado empresarial
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Brain, label: 'DeepSeek V3', sub: 'LLM reasoning' },
              { icon: Globe, label: 'Tavily', sub: '5 crawlers paralelos' },
              { icon: BarChart3, label: 'Monte Carlo', sub: '1,000 iteraciones' },
              { icon: Shield, label: 'Upstash Redis', sub: 'Storage aislado' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center gap-2">
                <b.icon size={28} className="text-gray-500" strokeWidth={1.5} />
                <div className="text-sm font-semibold text-gray-300">{b.label}</div>
                <div className="text-xs text-gray-600">{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DEMOS ═══ */}
      <section id="demos" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-400 mb-4">
              DEMOS REALES
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Mira qué devuelve OpenGravity
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Tres ejemplos reales de simulaciones. Cada una corre en 60s con datos en vivo del mercado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {DEMOS.map((demo) => (
              <Link
                key={demo.id}
                href={`/app/predict?demo=${demo.id}`}
                className={`group relative p-8 rounded-3xl bg-gradient-to-br ${demo.color} border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]`}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{demo.title}</h3>
                  <p className="text-sm text-gray-400">{demo.subtitle}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs uppercase tracking-wider text-gray-500">Viabilidad</span>
                      <span className={`text-3xl font-black ${demo.accent}`}>{demo.viabilityScore}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-violet-400 rounded-full"
                        style={{ width: `${demo.viabilityScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">LTV</div>
                      <div className="text-sm font-semibold">{demo.ltv}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">CAC</div>
                      <div className="text-sm font-semibold">{demo.cac}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Break-even</div>
                      <div className="text-sm font-semibold">{demo.breakEven}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span className={`text-xs font-bold uppercase tracking-wider ${demo.accent}`}>
                      {demo.verdict}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-white transition-colors flex items-center gap-1">
                      Ver completo <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 mb-4">
              PIPELINE INDUSTRIAL V3
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Cuatro fases. Una respuesta.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              No es un wrapper de ChatGPT. Es un motor estocástico real que combina research,
              agentes sintéticos, simulación y síntesis — todo orquestado.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Globe,
                title: '01 · Deep Research',
                desc: '5 crawlers Tavily en paralelo: overview, tendencias, competidores, métricas, riesgos. Scoring de confianza 0-100 basado en autoridad, frescura y diversidad de fuentes.',
                color: 'text-emerald-400',
              },
              {
                icon: Brain,
                title: '02 · Agentes Sintéticos',
                desc: 'DeepSeek genera perfiles demográficos y psicológicos de tus clientes ideales. Power buying, sensitivity de precio, conversion rate por segmento.',
                color: 'text-violet-400',
              },
              {
                icon: BarChart3,
                title: '03 · Monte Carlo',
                desc: '1,000 universos paralelos. PRNG Mulberry32 determinista. Percentiles P10/P50/P90 para LTV, CAC, drawdown y tasa de bancarrota. Seed auditable.',
                color: 'text-cyan-400',
              },
              {
                icon: Zap,
                title: '04 · Síntesis LLM',
                desc: 'DeepSeek fusiona research + simulación en un reporte ejecutivo. Veredicto, riesgos clave, recomendaciones estratégicas y pricing óptimo.',
                color: 'text-amber-400',
              },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <f.icon size={28} className={`${f.color} mb-4`} strokeWidth={1.5} />
                <h3 className="font-bold mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CÓMO FUNCIONA ═══ */}
      <section className="py-24 px-6 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              De idea a veredicto en 3 pasos
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Describe tu negocio',
                desc: 'Una frase basta. Ej: "SaaS B2B de logística para flotillas en Colombia". OpenGravity se encarga del resto.',
              },
              {
                step: '02',
                title: 'Espera 60 segundos',
                desc: 'El pipeline corre: research → agentes → 1,000 simulaciones Monte Carlo → síntesis LLM. Recibes un jobId y polling automático.',
              },
              {
                step: '03',
                title: 'Recibe tu reporte',
                desc: 'Viabilidad 0-100, percentiles P10/P50/P90, riesgos clave, recomendaciones y estrategia de pricing. Exportable a PDF.',
              },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-6xl font-black text-white/5 mb-4">{s.step}</div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-400 mb-4">
              PRECIOS DE LANZAMIENTO
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Inversión que se paga sola
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Una simulación manual de consultoría cuesta $2,000+. OpenGravity te da 50 por $29.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-3xl border transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/40 shadow-2xl shadow-emerald-500/10 scale-105'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-400 text-black text-xs font-bold px-4 py-1 rounded-full">
                    MÁS POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-400 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm">
                      <Check size={16} className={`mt-0.5 shrink-0 ${plan.highlighted ? 'text-emerald-400' : 'text-gray-500'}`} />
                      <span className="text-gray-300">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/app"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? 'bg-emerald-400 text-black hover:bg-emerald-300'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIOS / CASOS ═══ */}
      <section className="py-24 px-6 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Casos de uso reales
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Proyectos donde OpenGravity ya está corriendo en producción.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Dropea-Shop',
                role: 'E-commerce · 1,200 productos',
                quote: 'Automatizamos los posts de Facebook con el cron job de OpenGravity. Subimos engagement 40% en 3 meses sin tocar nada manual.',
                metric: '+40% engagement',
                gradient: 'from-emerald-500/20 to-emerald-500/0',
              },
              {
                title: 'autotaxflow',
                role: 'Fintech B2B · LatAm',
                quote: 'Corrimos la simulación antes de levantar pre-seed. El reporte P10/P50/P90 nos ayudó a justificar el TAM con los inversores.',
                metric: 'Pre-seed cerrada',
                gradient: 'from-violet-500/20 to-violet-500/0',
              },
              {
                title: 'marketnow',
                role: 'SaaS · Marketing automation',
                quote: 'El deep research encontró 3 competidores que no teníamos en el radar. Cambiamos el pricing según la elasticidad simulada.',
                metric: '3 hallazgos críticos',
                gradient: 'from-cyan-500/20 to-cyan-500/0',
              },
            ].map((t) => (
              <div key={t.title} className={`p-8 rounded-3xl bg-gradient-to-b ${t.gradient} border border-white/10`}>
                <div className="mb-4">
                  <h3 className="text-lg font-bold">{t.title}</h3>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-white/5">
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Resultado</div>
                  <div className="text-lg font-bold text-emerald-400">{t.metric}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <summary className="cursor-pointer flex items-center justify-between gap-4 font-semibold text-base">
                  {item.q}
                  <span className="text-emerald-400 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="mt-4 text-sm text-gray-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-violet-500/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <Star size={48} className="mx-auto text-emerald-400 mb-6" />
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6">
            Tu próxima idea merece
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
              1,000 simulaciones
            </span>
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
            No dejes $50K en una decisión sin evidencia. Prueba OpenGravity gratis hoy.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black px-10 py-5 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-emerald-500/30"
          >
            Empezar gratis <ArrowRight size={20} />
          </Link>
          <p className="text-xs text-gray-600 mt-6">
            Sin tarjeta · 3 simulaciones gratis · Cancela cuando quieras
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-violet-500 flex items-center justify-center">
              <Brain size={16} className="text-black" />
            </div>
            <div>
              <div className="font-bold text-sm">OpenGravity</div>
              <div className="text-xs text-gray-500">© 2026 · Hecho en LatAm</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Términos</Link>
            <Link href="/app" className="hover:text-white transition-colors">Dashboard</Link>
            <a href="mailto:hola@opengravity.dev" className="hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
