/**
 * OpenGravity — i18n dictionary (Español).
 *
 * Estructura: namespace.sección.clave
 * Mantener claves estables entre idiomas — solo cambiar valores.
 */

export const es = {
  // Metadata
  meta: {
    title: 'OpenGravity — Simula la viabilidad de tu negocio con IA',
    description: 'Antes de invertir $50K, simula tu startup en 60 segundos. Deep Research + 1,000 iteraciones Monte Carlo + síntesis LLM.',
  },

  // Ticker bar (top scrolling stats)
  ticker: {
    live: 'EN VIVO',
    stats: [
      '8,560 simulaciones ejecutadas',
      '73% precisión backtested',
      '47s tiempo promedio',
      '0.84 trust score global',
      '1,000 iteraciones por run',
      '5 crawlers en paralelo',
      'P10 / P50 / P90',
      '24h caché L1',
    ],
  },

  // Hero stat ticker labels
  heroStats: {
    costOfFailure: 'COSTO DEL FRACASO',
    timeToVerdict: 'TIEMPO AL VEREDICTO',
    iterations: 'ITERACIONES',
  },

  // Hero terminal (live Monte Carlo demo)
  terminal: {
    titlebar: 'opengravity — monte-carlo-v3 — zsh',
    version: 'v3.0.0',
    cmd: '$ og simulate "SaaS B2B Colombia"',
    crawlerLine: '▸ lanzando 5 crawlers de research...',
    iterationsLine: '▸ 1,000 iteraciones monte carlo',
    synthesisLine: '▸ sintetizando reporte LLM...',
    p50ltv: 'P50 LTV',
    p50cac: 'P50 CAC',
    breakEven: 'break-even',
    months: 'meses',
    verdict: 'veredicto',
    done: '✓ completado en 47s',
    ok: 'ok',
  },

  // Pipeline section
  pipeline: {
    badge: 'PIPELINE INDUSTRIAL V3',
    title: 'Cuatro fases. Una respuesta.',
    subtitle: 'No es un wrapper de ChatGPT. Es un motor estocástico real que combina research, agentes sintéticos, simulación y síntesis — todo orquestado.',
  },

  // Pricing comparison matrix — rows of features with values per plan
  pricingMatrix: {
    planHeader: 'Plan',
    rows: [
      { label: 'Simulaciones / mes', cells: ['3', '50', '∞'] },
      { label: 'Chat con IA', cells: ['10/día', '∞', '∞'] },
      { label: 'Reporte P10 / P50 / P90', cells: ['✓', '✓', '✓'] },
      { label: 'Export PDF', cells: ['—', '✓', '✓'] },
      { label: 'Cron jobs', cells: ['1', '10', '∞'] },
      { label: 'Historial persistente', cells: ['—', '✓', '✓'] },
      { label: 'API access', cells: ['—', '—', '10K / mes'] },
      { label: 'Multi-usuario', cells: ['—', '—', '5 cuentas'] },
      { label: 'Marca blanca', cells: ['—', '—', '✓'] },
      { label: 'Soporte', cells: ['Comunidad', 'Email', 'Prioritario'] },
    ],
  },

  // Final CTA eyebrow
  finalCtaReady: '¿LISTO?',

  // Accessibility
  skipToContent: 'Saltar al contenido',

  // Login page
  login: {
    title: 'Inicia sesión',
    subtitle: 'Accede a tu dashboard de simulaciones',
    welcomeBack: 'Bienvenido de nuevo',
    goToDashboard: 'Ir al dashboard',
    signOut: 'Cerrar sesión',
    github: 'Continuar con GitHub',
    google: 'Continuar con Google',
    devEmail: 'Email (modo desarrollo)',
    devButton: 'Entrar en modo dev',
    devModeNotice: 'OAuth no configurado. Usando login de desarrollo — cualquier email funciona. No usar en producción.',
    loading: 'Cargando proveedores…',
    noProviders: 'No hay proveedores de auth configurados.',
    error: 'Error al iniciar sesión. Verifica que autorizaste la app en el proveedor OAuth.',
    noAccount: '¿No tienes cuenta?',
    seeDemos: 'Ver demos primero',
    legalPrefix: 'Al continuar aceptas nuestros',
    legalAnd: 'y',
  },

  // Nav
  nav: {
    features: 'Features',
    demos: 'Demos',
    pricing: 'Precios',
    faq: 'FAQ',
    login: 'Iniciar sesión',
    cta: 'Prueba gratis',
  },

  // Hero
  hero: {
    badge: 'Motor Monte Carlo V3 · 1,000 iteraciones por simulación',
    title1: 'Antes de invertir',
    titleHighlight1: '$50,000',
    title2: 'simula tu negocio en',
    titleHighlight2: '60 segundos',
    subtitle: 'OpenGravity lanza un ejército de inteligencias artificiales contra tu idea de negocio: research profundo, agentes sintéticos y 1,000 universos paralelos de Monte Carlo. Te dice si tu startup va a sobrevivir — antes de que pongas un peso.',
    ctaPrimary: 'Lanzar simulación gratis',
    ctaSecondary: 'Ver demos en vivo',
    noCard: 'Sin tarjeta de crédito',
    freeSim: '3 simulaciones gratis',
    pdfExport: 'Reporte PDF descargable',
  },

  // Trust badges
  trust: {
    title: 'Tecnología de grado empresarial',
    deepseek: 'LLM reasoning',
    tavily: '5 crawlers paralelos',
    montecarlo: '1,000 iteraciones',
    upstash: 'Storage aislado',
  },

  // Demos
  demos: {
    badge: 'DEMOS REALES',
    title: 'Mira qué devuelve OpenGravity',
    subtitle: 'Tres ejemplos reales de simulaciones. Cada una corre en 60s con datos en vivo del mercado.',
    viability: 'Viabilidad',
    ltv: 'LTV',
    cac: 'CAC',
    breakEven: 'Break-even',
    viewFull: 'Ver completo',
    items: [
      { title: 'SaaS B2B de logística', subtitle: 'Para flotillas en Colombia', verdict: 'Favorable' },
      { title: 'Restaurante de comida rápida', subtitle: 'CDMX, delivery-first', verdict: 'Moderado' },
      { title: 'Tienda online de moda sostenible', subtitle: 'LatAm, suscripción mensual', verdict: 'Excelente' },
    ],
  },

  // Features
  features: {
    badge: 'PIPELINE INDUSTRIAL V3',
    title: 'Cuatro fases. Una respuesta.',
    subtitle: 'No es un wrapper de ChatGPT. Es un motor estocástico real que combina research, agentes sintéticos, simulación y síntesis — todo orquestado.',
    items: [
      {
        title: '01 · Deep Research',
        desc: '5 crawlers Tavily en paralelo: overview, tendencias, competidores, métricas, riesgos. Scoring de confianza 0-100 basado en autoridad, frescura y diversidad de fuentes.',
      },
      {
        title: '02 · Agentes Sintéticos',
        desc: 'DeepSeek genera perfiles demográficos y psicológicos de tus clientes ideales. Power buying, sensitivity de precio, conversion rate por segmento.',
      },
      {
        title: '03 · Monte Carlo',
        desc: '1,000 universos paralelos. PRNG Mulberry32 determinista. Percentiles P10/P50/P90 para LTV, CAC, drawdown y tasa de bancarrota. Seed auditable.',
      },
      {
        title: '04 · Síntesis LLM',
        desc: 'DeepSeek fusiona research + simulación en un reporte ejecutivo. Veredicto, riesgos clave, recomendaciones estratégicas y pricing óptimo.',
      },
    ],
  },

  // How it works
  how: {
    title: 'De idea a veredicto en 3 pasos',
    steps: [
      {
        title: 'Describe tu negocio',
        desc: 'Una frase basta. Ej: "SaaS B2B de logística para flotillas en Colombia". OpenGravity se encarga del resto.',
      },
      {
        title: 'Espera 60 segundos',
        desc: 'El pipeline corre: research → agentes → 1,000 simulaciones Monte Carlo → síntesis LLM. Recibes un jobId y polling automático.',
      },
      {
        title: 'Recibe tu reporte',
        desc: 'Viabilidad 0-100, percentiles P10/P50/P90, riesgos clave, recomendaciones y estrategia de pricing. Exportable a PDF.',
      },
    ],
  },

  // Pricing
  pricing: {
    badge: 'PRECIOS DE LANZAMIENTO',
    title: 'Inversión que se paga sola',
    subtitle: 'Una simulación manual de consultoría cuesta $2,000+. OpenGravity te da 50 por $29.',
    perMonth: '/mes',
    popular: 'MÁS POPULAR',
    plans: [
      {
        name: 'Free',
        description: 'Para validar una idea puntual',
        cta: 'Empezar gratis',
        features: [
          '3 simulaciones por mes',
          'Chat con IA (10 mensajes/día)',
          'Reporte básico P10/P50/P90',
          '1 cron job de marketing',
        ],
      },
      {
        name: 'Pro',
        description: 'Para emprendedores serios',
        cta: 'Probar 14 días gratis',
        features: [
          '50 simulaciones por mes',
          'Chat con IA ilimitado',
          'Reportes completos + export PDF',
          '10 cron jobs de marketing',
          'Historial persistente',
          'Soporte por email',
        ],
      },
      {
        name: 'Agency',
        description: 'Para consultores y agencias',
        cta: 'Hablar con ventas',
        features: [
          'Simulaciones ilimitadas',
          'Multi-usuario (5 cuentas)',
          'API access (10K llamadas/mes)',
          'Cron jobs ilimitados',
          'Marca blanca en reportes',
          'Soporte prioritario + onboarding',
        ],
      },
    ],
  },

  // Testimonials
  testimonials: {
    title: 'Casos de uso reales',
    subtitle: 'Proyectos donde OpenGravity ya está corriendo en producción.',
    result: 'Resultado',
    items: [
      {
        title: 'Dropea-Shop',
        role: 'E-commerce · 1,200 productos',
        quote: 'Automatizamos los posts de Facebook con el cron job de OpenGravity. Subimos engagement 40% en 3 meses sin tocar nada manual.',
        metric: '+40% engagement',
      },
      {
        title: 'autotaxflow',
        role: 'Fintech B2B · LatAm',
        quote: 'Corrimos la simulación antes de levantar pre-seed. El reporte P10/P50/P90 nos ayudó a justificar el TAM con los inversores.',
        metric: 'Pre-seed cerrada',
      },
      {
        title: 'marketnow',
        role: 'SaaS · Marketing automation',
        quote: 'El deep research encontró 3 competidores que no teníamos en el radar. Cambiamos el pricing según la elasticidad simulada.',
        metric: '3 hallazgos críticos',
      },
    ],
  },

  // FAQ
  faq: {
    title: 'Preguntas frecuentes',
    items: [
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
        a: 'Entre 35 y 60 segundos. El pipeline es asíncrono: lanzas la idea, te devuelve un jobId, y el frontend hace polling cada 3-15s hasta que el reporte está listo.',
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
    ],
  },

  // Final CTA
  finalCta: {
    title1: 'Tu próxima idea merece',
    title2: '1,000 simulaciones',
    subtitle: 'No dejes $50K en una decisión sin evidencia. Prueba OpenGravity gratis hoy.',
    cta: 'Empezar gratis',
    note: 'Sin tarjeta · 3 simulaciones gratis · Cancela cuando quieras',
  },

  // Footer
  footer: {
    copyright: '© 2026 · Hecho en LatAm',
    privacy: 'Privacidad',
    terms: 'Términos',
    dashboard: 'Dashboard',
    contact: 'Contacto',
  },
};

export type Dictionary = typeof es;
