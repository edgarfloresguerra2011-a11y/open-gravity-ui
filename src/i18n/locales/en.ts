/**
 * OpenGravity — i18n dictionary (English).
 */
import type { Dictionary } from './es';

export const en: Dictionary = {
  meta: {
    title: 'OpenGravity — Simulate your business viability with AI',
    description: 'Before investing $50K, simulate your startup in 60 seconds. Deep Research + 1,000 Monte Carlo iterations + LLM synthesis.',
  },

  // Ticker bar
  ticker: {
    live: 'LIVE',
    stats: [
      '8,560 simulations run',
      '73% backtested accuracy',
      '47s average response',
      '0.84 global trust score',
      '1,000 iterations per run',
      '5 crawlers in parallel',
      'P10 / P50 / P90',
      '24h L1 cache',
    ],
  },

  // Hero stat ticker labels
  heroStats: {
    costOfFailure: 'COST OF FAILURE',
    timeToVerdict: 'TIME TO VERDICT',
    iterations: 'ITERATIONS',
  },

  // Hero terminal
  terminal: {
    titlebar: 'opengravity — monte-carlo-v3 — zsh',
    version: 'v3.0.0',
    cmd: '$ og simulate "B2B SaaS Colombia"',
    crawlerLine: '▸ spawning 5 research crawlers...',
    iterationsLine: '▸ 1,000 monte carlo iterations',
    synthesisLine: '▸ synthesizing LLM report...',
    p50ltv: 'P50 LTV',
    p50cac: 'P50 CAC',
    breakEven: 'break-even',
    months: 'months',
    verdict: 'verdict',
    done: '✓ done in 47s',
    ok: 'ok',
  },

  // Pipeline section
  pipeline: {
    badge: 'INDUSTRIAL PIPELINE V3',
    title: 'Four phases. One answer.',
    subtitle: 'Not a ChatGPT wrapper. A real stochastic engine combining research, synthetic agents, simulation, and synthesis — fully orchestrated.',
  },

  pricingMatrix: {
    planHeader: 'Plan',
    rows: [
      { label: 'Simulations / month', cells: ['3', '50', '∞'] },
      { label: 'AI chat', cells: ['10/day', '∞', '∞'] },
      { label: 'Report P10 / P50 / P90', cells: ['✓', '✓', '✓'] },
      { label: 'PDF export', cells: ['—', '✓', '✓'] },
      { label: 'Cron jobs', cells: ['1', '10', '∞'] },
      { label: 'Persistent history', cells: ['—', '✓', '✓'] },
      { label: 'API access', cells: ['—', '—', '10K / mo'] },
      { label: 'Multi-user', cells: ['—', '—', '5 seats'] },
      { label: 'White-label', cells: ['—', '—', '✓'] },
      { label: 'Support', cells: ['Community', 'Email', 'Priority'] },
    ],
  },

  finalCtaReady: 'READY?',

  // Accessibility
  skipToContent: 'Skip to content',

  // Login page
  login: {
    title: 'Sign in',
    subtitle: 'Access your simulation dashboard',
    welcomeBack: 'Welcome back',
    goToDashboard: 'Go to dashboard',
    signOut: 'Sign out',
    github: 'Continue with GitHub',
    google: 'Continue with Google',
    devEmail: 'Email (dev mode)',
    devButton: 'Enter dev mode',
    devModeNotice: 'OAuth not configured. Using dev login — any email works. Do not use in production.',
    loading: 'Loading providers…',
    noProviders: 'No auth providers configured.',
    error: 'Sign-in failed. Make sure you authorized the app in the OAuth provider.',
    noAccount: "Don't have an account?",
    seeDemos: 'See demos first',
    legalPrefix: 'By continuing you accept our',
    legalAnd: 'and',
  },

  nav: {
    features: 'Features',
    demos: 'Demos',
    pricing: 'Pricing',
    faq: 'FAQ',
    login: 'Sign in',
    cta: 'Try free',
  },

  hero: {
    badge: 'Monte Carlo Engine V3 · 1,000 iterations per simulation',
    title1: 'Before investing',
    titleHighlight1: '$50,000',
    title2: 'simulate your business in',
    titleHighlight2: '60 seconds',
    subtitle: 'OpenGravity launches an army of AI agents against your business idea: deep research, synthetic personas, and 1,000 parallel Monte Carlo universes. It tells you whether your startup will survive — before you bet a dollar.',
    ctaPrimary: 'Launch free simulation',
    ctaSecondary: 'Watch live demos',
    noCard: 'No credit card',
    freeSim: '3 free simulations',
    pdfExport: 'Downloadable PDF report',
  },

  trust: {
    title: 'Enterprise-grade technology',
    deepseek: 'LLM reasoning',
    tavily: '5 parallel crawlers',
    montecarlo: '1,000 iterations',
    upstash: 'Isolated storage',
  },

  demos: {
    badge: 'REAL DEMOS',
    title: 'See what OpenGravity returns',
    subtitle: 'Three real simulation examples. Each runs in 60s with live market data.',
    viability: 'Viability',
    ltv: 'LTV',
    cac: 'CAC',
    breakEven: 'Break-even',
    viewFull: 'View full',
    items: [
      { title: 'B2B Logistics SaaS', subtitle: 'For fleets in Colombia', verdict: 'Favorable' },
      { title: 'Fast food restaurant', subtitle: 'CDMX, delivery-first', verdict: 'Moderate' },
      { title: 'Sustainable fashion online store', subtitle: 'LatAm, monthly subscription', verdict: 'Excellent' },
    ],
  },

  features: {
    badge: 'INDUSTRIAL PIPELINE V3',
    title: 'Four phases. One answer.',
    subtitle: 'Not a ChatGPT wrapper. A real stochastic engine combining research, synthetic agents, simulation, and synthesis — fully orchestrated.',
    items: [
      {
        title: '01 · Deep Research',
        desc: '5 Tavily crawlers in parallel: overview, trends, competitors, metrics, risks. Confidence scoring 0-100 based on authority, recency, and source diversity.',
      },
      {
        title: '02 · Synthetic Agents',
        desc: 'DeepSeek generates demographic and psychological profiles of your ideal customers. Buying power, price sensitivity, conversion rate per segment.',
      },
      {
        title: '03 · Monte Carlo',
        desc: '1,000 parallel universes. Deterministic Mulberry32 PRNG. P10/P50/P90 percentiles for LTV, CAC, drawdown, and bankruptcy rate. Auditable seed.',
      },
      {
        title: '04 · LLM Synthesis',
        desc: 'DeepSeek fuses research + simulation into an executive report. Verdict, key risks, strategic recommendations, and optimal pricing.',
      },
    ],
  },

  how: {
    title: 'From idea to verdict in 3 steps',
    steps: [
      {
        title: 'Describe your business',
        desc: 'One sentence is enough. E.g.: "B2B Logistics SaaS for fleets in Colombia". OpenGravity handles the rest.',
      },
      {
        title: 'Wait 60 seconds',
        desc: 'The pipeline runs: research → agents → 1,000 Monte Carlo simulations → LLM synthesis. You get a jobId with automatic polling.',
      },
      {
        title: 'Get your report',
        desc: 'Viability 0-100, P10/P50/P90 percentiles, key risks, recommendations, and pricing strategy. Exportable to PDF.',
      },
    ],
  },

  pricing: {
    badge: 'LAUNCH PRICING',
    title: 'Investment that pays for itself',
    subtitle: 'A manual consulting simulation costs $2,000+. OpenGravity gives you 50 for $29.',
    perMonth: '/mo',
    popular: 'MOST POPULAR',
    plans: [
      {
        name: 'Free',
        description: 'To validate one specific idea',
        cta: 'Start free',
        features: [
          '3 simulations per month',
          'AI chat (10 messages/day)',
          'Basic report P10/P50/P90',
          '1 marketing cron job',
        ],
      },
      {
        name: 'Pro',
        description: 'For serious entrepreneurs',
        cta: 'Try 14 days free',
        features: [
          '50 simulations per month',
          'Unlimited AI chat',
          'Full reports + PDF export',
          '10 marketing cron jobs',
          'Persistent history',
          'Email support',
        ],
      },
      {
        name: 'Agency',
        description: 'For consultants and agencies',
        cta: 'Talk to sales',
        features: [
          'Unlimited simulations',
          'Multi-user (5 accounts)',
          'API access (10K calls/mo)',
          'Unlimited cron jobs',
          'White-label reports',
          'Priority support + onboarding',
        ],
      },
    ],
  },

  testimonials: {
    title: 'Real use cases',
    subtitle: 'Projects where OpenGravity is already running in production.',
    result: 'Result',
    items: [
      {
        title: 'Dropea-Shop',
        role: 'E-commerce · 1,200 products',
        quote: 'We automated Facebook posts with OpenGravity\'s cron job. Engagement went up 40% in 3 months with zero manual work.',
        metric: '+40% engagement',
      },
      {
        title: 'autotaxflow',
        role: 'B2B Fintech · LatAm',
        quote: 'We ran the simulation before raising pre-seed. The P10/P50/P90 report helped justify the TAM with investors.',
        metric: 'Pre-seed closed',
      },
      {
        title: 'marketnow',
        role: 'SaaS · Marketing automation',
        quote: 'The deep research found 3 competitors we had missed. We adjusted pricing based on the simulated elasticity.',
        metric: '3 critical findings',
      },
    ],
  },

  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'How is OpenGravity different from a manual calculation?',
        a: 'OpenGravity runs 1,000 Monte Carlo simulations with a deterministic PRNG (Mulberry32), varying macro shocks, price elasticity, churn, and CAC. It delivers P10/P50/P90 percentiles — not a single optimistic number. Each simulation includes a confidence score based on the authority and recency of real sources (Bloomberg, WSJ, Statista, McKinsey).',
      },
      {
        q: 'Where does the analysis data come from?',
        a: 'We use the Tavily API to run 5 crawlers in parallel: overview, trends, competitors, quantitative metrics, and risks. Each source gets a confidence score (0-100) based on domain authority, data recency, and cross-source consistency.',
      },
      {
        q: 'How long does a simulation take?',
        a: 'Between 35 and 60 seconds. The pipeline is asynchronous: you submit the idea, get a jobId, and the frontend polls every 3-15s until the report is ready.',
      },
      {
        q: 'Can I use it for any type of business?',
        a: 'Yes. The engine is calibrated for SaaS, e-commerce, restaurants, professional services, physical products, and marketplaces. The simulation automatically adjusts sample size (0.01% of TAM) and CAC saturation threshold based on the market.',
      },
      {
        q: 'Is my data safe?',
        a: 'Yes. All simulations are stored in Upstash Redis with per-user namespacing. We don\'t share your business ideas with third parties. LLM calls go to DeepSeek with your API key. You can delete your account and all your data at any time.',
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Yes, no penalty. Cancel from the dashboard and your plan reverts to Free at the end of the billing period. No mandatory annual contract.',
      },
    ],
  },

  finalCta: {
    title1: 'Your next idea deserves',
    title2: '1,000 simulations',
    subtitle: 'Don\'t leave $50K on an evidence-free decision. Try OpenGravity free today.',
    cta: 'Start free',
    note: 'No card · 3 free simulations · Cancel anytime',
  },

  footer: {
    copyright: '© 2026 · Made in LatAm',
    privacy: 'Privacy',
    terms: 'Terms',
    dashboard: 'Dashboard',
    contact: 'Contact',
  },
};
