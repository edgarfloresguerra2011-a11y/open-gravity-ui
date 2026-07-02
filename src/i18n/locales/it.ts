/**
 * OpenGravity — i18n dictionary (Italiano).
 */
import type { Dictionary } from './es';

export const it: Dictionary = {
  meta: {
    title: 'OpenGravity — Simula la fattibilità del tuo business con l\'IA',
    description: 'Prima di investire $50K, simula la tua startup in 60 secondi. Deep Research + 1.000 iterazioni Monte Carlo + sintesi LLM.',
  },

  ticker: {
    live: 'IN DIRETTA',
    stats: [
      '8.560 simulazioni eseguite',
      '73% precisione backtested',
      '47s tempo medio',
      '0.84 trust score globale',
      '1.000 iterazioni per run',
      '5 crawler in parallelo',
      'P10 / P50 / P90',
      '24h cache L1',
    ],
  },

  heroStats: {
    costOfFailure: 'COSTO DEL FALLIMENTO',
    timeToVerdict: 'TEMPO AL VERDETTO',
    iterations: 'ITERAZIONI',
  },

  terminal: {
    titlebar: 'opengravity — monte-carlo-v3 — zsh',
    version: 'v3.0.0',
    cmd: '$ og simulate "SaaS B2B Italia"',
    crawlerLine: '▸ lancio di 5 crawler di ricerca...',
    iterationsLine: '▸ 1.000 iterazioni monte carlo',
    synthesisLine: '▸ sintesi del report LLM...',
    p50ltv: 'P50 LTV',
    p50cac: 'P50 CAC',
    breakEven: 'break-even',
    months: 'mesi',
    verdict: 'verdetto',
    done: '✓ completato in 47s',
    ok: 'ok',
  },

  pipeline: {
    badge: 'PIPELINE INDUSTRIALE V3',
    title: 'Quattro fasi. Una risposta.',
    subtitle: 'Non è un wrapper ChatGPT. È un vero motore stocastico che combina ricerca, agenti sintetici, simulazione e sintesi — tutto orchestrato.',
  },

  pricingMatrix: {
    planHeader: 'Piano',
    rows: [
      { label: 'Simulazioni / mese', cells: ['3', '50', '∞'] },
      { label: 'Chat IA', cells: ['10/giorno', '∞', '∞'] },
      { label: 'Report P10 / P50 / P90', cells: ['✓', '✓', '✓'] },
      { label: 'Export PDF', cells: ['—', '✓', '✓'] },
      { label: 'Cron job', cells: ['1', '10', '∞'] },
      { label: 'Cronologia persistente', cells: ['—', '✓', '✓'] },
      { label: 'Accesso API', cells: ['—', '—', '10K / mese'] },
      { label: 'Multi-utente', cells: ['—', '—', '5 account'] },
      { label: 'White-label', cells: ['—', '—', '✓'] },
      { label: 'Supporto', cells: ['Community', 'Email', 'Prioritario'] },
    ],
  },

  finalCtaReady: 'PRONTO?',

  // Accessibility
  skipToContent: 'Vai al contenuto',

  // Login page
  login: {
    title: 'Accedi',
    subtitle: 'Accedi alla tua dashboard di simulazioni',
    welcomeBack: 'Bentornato',
    goToDashboard: 'Vai alla dashboard',
    signOut: 'Esci',
    github: 'Continua con GitHub',
    google: 'Continua con Google',
    devEmail: 'Email (modalità dev)',
    devButton: 'Entra in modalità dev',
    devModeNotice: 'OAuth non configurato. Uso del login di sviluppo — qualsiasi email funziona. Non usare in produzione.',
    loading: 'Caricamento provider…',
    noProviders: 'Nessun provider di auth configurato.',
    error: 'Errore di accesso. Verifica di aver autorizzato l\'app nel provider OAuth.',
    noAccount: 'Non hai un account?',
    seeDemos: 'Vedi le demo prima',
    legalPrefix: 'Continuando accetti i nostri',
    legalAnd: 'e',
  },

  nav: {
    features: 'Funzioni',
    demos: 'Demo',
    pricing: 'Prezzi',
    faq: 'FAQ',
    login: 'Accedi',
    cta: 'Prova gratis',
  },

  hero: {
    badge: 'Motore Monte Carlo V3 · 1.000 iterazioni per simulazione',
    title1: 'Prima di investire',
    titleHighlight1: '$50.000',
    title2: 'simula il tuo business in',
    titleHighlight2: '60 secondi',
    subtitle: 'OpenGravity lancia un esercito di intelligenze artificiali contro la tua idea di business: ricerca approfondita, agenti sintetici e 1.000 universi paralleli di Monte Carlo. Ti dice se la tua startup sopravviverà — prima che tu scommetta un centesimo.',
    ctaPrimary: 'Lancia simulazione gratuita',
    ctaSecondary: 'Vedi demo dal vivo',
    noCard: 'Senza carta di credito',
    freeSim: '3 simulazioni gratis',
    pdfExport: 'Report PDF scaricabile',
  },

  trust: {
    title: 'Tecnologia di livello enterprise',
    deepseek: 'Ragionamento LLM',
    tavily: '5 crawler paralleli',
    montecarlo: '1.000 iterazioni',
    upstash: 'Storage isolato',
  },

  demos: {
    badge: 'DEMO REALI',
    title: 'Guarda cosa restituisce OpenGravity',
    subtitle: 'Tre esempi reali di simulazioni. Ognuna gira in 60s con dati di mercato dal vivo.',
    viability: 'Fattibilità',
    ltv: 'LTV',
    cac: 'CAC',
    breakEven: 'Break-even',
    viewFull: 'Vedi tutto',
    items: [
      { title: 'SaaS B2B di logistica', subtitle: 'Per flotte in Italia', verdict: 'Favorevole' },
      { title: 'Ristorante fast food', subtitle: 'Milano, delivery-first', verdict: 'Moderato' },
      { title: 'Negozio online di moda sostenibile', subtitle: 'Europa, abbonamento mensile', verdict: 'Eccellente' },
    ],
  },

  features: {
    badge: 'PIPELINE INDUSTRIALE V3',
    title: 'Quattro fasi. Una risposta.',
    subtitle: 'Non è un wrapper ChatGPT. È un vero motore stocastico che combina ricerca, agenti sintetici, simulazione e sintesi — tutto orchestrato.',
    items: [
      {
        title: '01 · Deep Research',
        desc: '5 crawler Tavily in parallelo: overview, trend, competitor, metriche, rischi. Score di fiducia 0-100 basato su autorità, freschezza e diversità delle fonti.',
      },
      {
        title: '02 · Agenti Sintetici',
        desc: 'DeepSeek genera profili demografici e psicologici dei tuoi clienti ideali. Potere d\'acquisto, sensibilità al prezzo, tasso di conversione per segmento.',
      },
      {
        title: '03 · Monte Carlo',
        desc: '1.000 universi paralleli. PRNG Mulberry32 deterministico. Percentili P10/P50/P90 per LTV, CAC, drawdown e tasso di fallimento. Seed auditabile.',
      },
      {
        title: '04 · Sintesi LLM',
        desc: 'DeepSeek fonde ricerca + simulazione in un report esecutivo. Verdetto, rischi chiave, raccomandazioni strategiche e pricing ottimale.',
      },
    ],
  },

  how: {
    title: 'Dall\'idea al verdetto in 3 passi',
    steps: [
      {
        title: 'Descrivi il tuo business',
        desc: 'Una frase basta. Es: "SaaS B2B di logistica per flotte in Italia". OpenGravity fa il resto.',
      },
      {
        title: 'Aspetta 60 secondi',
        desc: 'La pipeline gira: ricerca → agenti → 1.000 simulazioni Monte Carlo → sintesi LLM. Ricevi un jobId con polling automatico.',
      },
      {
        title: 'Ricevi il tuo report',
        desc: 'Fattibilità 0-100, percentili P10/P50/P90, rischi chiave, raccomandazioni e strategia di pricing. Esportabile in PDF.',
      },
    ],
  },

  pricing: {
    badge: 'PREZZI DI LANCIO',
    title: 'Investimento che si ripaga da solo',
    subtitle: 'Una simulazione manuale di consulenza costa $2.000+. OpenGravity te ne dà 50 per $29.',
    perMonth: '/mese',
    popular: 'PIÙ POPOLARE',
    plans: [
      {
        name: 'Free',
        description: 'Per validare un\'idea specifica',
        cta: 'Inizia gratis',
        features: [
          '3 simulazioni al mese',
          'Chat IA (10 messaggi/giorno)',
          'Report base P10/P50/P90',
          '1 cron job di marketing',
        ],
      },
      {
        name: 'Pro',
        description: 'Per imprenditori seri',
        cta: 'Prova 14 giorni gratis',
        features: [
          '50 simulazioni al mese',
          'Chat IA illimitata',
          'Report completi + export PDF',
          '10 cron job di marketing',
          'Cronologia persistente',
          'Supporto via email',
        ],
      },
      {
        name: 'Agency',
        description: 'Per consulenti e agenzie',
        cta: 'Parla con le vendite',
        features: [
          'Simulazioni illimitate',
          'Multi-utente (5 account)',
          'Accesso API (10K chiamate/mese)',
          'Cron job illimitati',
          'Report white-label',
          'Supporto prioritario + onboarding',
        ],
      },
    ],
  },

  testimonials: {
    title: 'Casi d\'uso reali',
    subtitle: 'Progetti dove OpenGravity è già in produzione.',
    result: 'Risultato',
    items: [
      {
        title: 'Dropea-Shop',
        role: 'E-commerce · 1.200 prodotti',
        quote: 'Abbiamo automatizzato i post Facebook con il cron job di OpenGravity. L\'engagement è salito del 40% in 3 mesi senza lavoro manuale.',
        metric: '+40% engagement',
      },
      {
        title: 'autotaxflow',
        role: 'Fintech B2B · LatAm',
        quote: 'Abbiamo lanciato la simulazione prima di raccogliere pre-seed. Il report P10/P50/P90 ha aiutato a giustificare il TAM con gli investitori.',
        metric: 'Pre-seed chiuso',
      },
      {
        title: 'marketnow',
        role: 'SaaS · Marketing automation',
        quote: 'La ricerca approfondita ha trovato 3 competitor che ci erano sfuggiti. Abbiamo aggiustato il pricing secondo l\'elasticità simulata.',
        metric: '3 scoperte critiche',
      },
    ],
  },

  faq: {
    title: 'Domande frequenti',
    items: [
      {
        q: 'In cosa OpenGravity differisce da un calcolo manuale?',
        a: 'OpenGravity esegue 1.000 simulazioni Monte Carlo con PRNG deterministico (Mulberry32), variando shock macro, elasticità del prezzo, churn e CAC. Restituisce percentili P10/P50/P90 — non un singolo numero ottimistico. Ogni simulazione include uno score di fiducia basato su autorità e freschezza di fonti reali (Bloomberg, WSJ, Statista, McKinsey).',
      },
      {
        q: 'Da dove arrivano i dati dell\'analisi?',
        a: 'Usiamo l\'API Tavily per eseguire 5 crawler in parallelo: overview, trend, competitor, metriche quantitative e rischi. Ogni fonte riceve uno score di fiducia (0-100) basato su autorità del dominio, freschezza dei dati e coerenza tra fonti.',
      },
      {
        q: 'Quanto dura una simulazione?',
        a: 'Tra 35 e 60 secondi. La pipeline è asincrona: invii l\'idea, ricevi un jobId, e il frontend fa polling ogni 3-15s finché il report non è pronto.',
      },
      {
        q: 'Posso usarlo per qualsiasi tipo di business?',
        a: 'Sì. Il motore è calibrato per SaaS, e-commerce, ristoranti, servizi professionali, prodotti fisici e marketplace. La simulazione aggiusta automaticamente la dimensione del campione (0,01% del TAM) e la soglia di saturazione del CAC secondo il mercato.',
      },
      {
        q: 'I miei dati sono al sicuro?',
        a: 'Sì. Tutte le simulazioni sono salvate in Upstash Redis con namespace per utente. Non condividiamo le tue idee di business con terzi. Le chiamate LLM vanno a DeepSeek con la tua API key. Puoi eliminare il tuo account e tutti i tuoi dati in qualsiasi momento.',
      },
      {
        q: 'Posso cancellare quando voglio?',
        a: 'Sì, senza penalità. Cancelli dal dashboard e il tuo piano torna a Free alla fine del periodo fatturato. Nessun contratto annuale obbligatorio.',
      },
    ],
  },

  finalCta: {
    title1: 'La tua prossima idea merita',
    title2: '1.000 simulazioni',
    subtitle: 'Non lasciare $50K su una decisione senza evidenza. Prova OpenGravity gratis oggi.',
    cta: 'Inizia gratis',
    note: 'Senza carta · 3 simulazioni gratis · Cancella quando vuoi',
  },

  footer: {
    copyright: '© 2026 · Fatto in LatAm',
    privacy: 'Privacy',
    terms: 'Termini',
    dashboard: 'Dashboard',
    contact: 'Contatto',
  },
};
