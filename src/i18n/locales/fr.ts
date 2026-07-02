/**
 * OpenGravity — i18n dictionary (Français).
 */
import type { Dictionary } from './es';

export const fr: Dictionary = {
  meta: {
    title: 'OpenGravity — Simulez la viabilité de votre business avec l\'IA',
    description: 'Avant d\'investir 50 000 $, simulez votre startup en 60 secondes. Deep Research + 1 000 itérations Monte Carlo + synthèse LLM.',
  },

  ticker: {
    live: 'EN DIRECT',
    stats: [
      '8 560 simulations exécutées',
      '73% précision backtested',
      '47s temps moyen',
      '0.84 trust score global',
      '1 000 itérations par run',
      '5 crawlers en parallèle',
      'P10 / P50 / P90',
      '24h cache L1',
    ],
  },

  heroStats: {
    costOfFailure: 'COÛT DE L\'ÉCHEC',
    timeToVerdict: 'TEMPS JUSQU\'AU VERDICT',
    iterations: 'ITÉRATIONS',
  },

  terminal: {
    titlebar: 'opengravity — monte-carlo-v3 — zsh',
    version: 'v3.0.0',
    cmd: '$ og simulate "SaaS B2B France"',
    crawlerLine: '▸ lancement de 5 crawlers de recherche...',
    iterationsLine: '▸ 1 000 itérations monte carlo',
    synthesisLine: '▸ synthèse du rapport LLM...',
    p50ltv: 'P50 LTV',
    p50cac: 'P50 CAC',
    breakEven: 'seuil-rentabilité',
    months: 'mois',
    verdict: 'verdict',
    done: '✓ terminé en 47s',
    ok: 'ok',
  },

  pipeline: {
    badge: 'PIPELINE INDUSTRIEL V3',
    title: 'Quatre phases. Une réponse.',
    subtitle: 'Pas un wrapper ChatGPT. Un vrai moteur stochastique combinant recherche, agents synthétiques, simulation et synthèse — totalement orchestré.',
  },

  pricingMatrix: {
    planHeader: 'Plan',
    rows: [
      { label: 'Simulations / mois', cells: ['3', '50', '∞'] },
      { label: 'Chat IA', cells: ['10/jour', '∞', '∞'] },
      { label: 'Rapport P10 / P50 / P90', cells: ['✓', '✓', '✓'] },
      { label: 'Export PDF', cells: ['—', '✓', '✓'] },
      { label: 'Cron jobs', cells: ['1', '10', '∞'] },
      { label: 'Historique persistant', cells: ['—', '✓', '✓'] },
      { label: 'Accès API', cells: ['—', '—', '10K / mois'] },
      { label: 'Multi-utilisateur', cells: ['—', '—', '5 comptes'] },
      { label: 'White-label', cells: ['—', '—', '✓'] },
      { label: 'Support', cells: ['Communauté', 'Email', 'Prioritaire'] },
    ],
  },

  finalCtaReady: 'PRÊT ?',

  // Accessibility
  skipToContent: 'Aller au contenu',

  // Login page
  login: {
    title: 'Connexion',
    subtitle: 'Accédez à votre dashboard de simulations',
    welcomeBack: 'Bon retour',
    goToDashboard: 'Aller au dashboard',
    signOut: 'Déconnexion',
    github: 'Continuer avec GitHub',
    google: 'Continuer avec Google',
    devEmail: 'Email (mode dev)',
    devButton: 'Entrer en mode dev',
    devModeNotice: 'OAuth non configuré. Utilisation du login de développement — tout email fonctionne. Ne pas utiliser en production.',
    loading: 'Chargement des fournisseurs…',
    noProviders: 'Aucun fournisseur d\'auth configuré.',
    error: 'Erreur de connexion. Vérifiez que vous avez autorisé l\'app dans le fournisseur OAuth.',
    noAccount: 'Pas de compte ?',
    seeDemos: 'Voir les démos d\'abord',
    legalPrefix: 'En continuant vous acceptez nos',
    legalAnd: 'et',
  },

  nav: {
    features: 'Fonctionnalités',
    demos: 'Démos',
    pricing: 'Tarifs',
    faq: 'FAQ',
    login: 'Connexion',
    cta: 'Essai gratuit',
  },

  hero: {
    badge: 'Moteur Monte Carlo V3 · 1 000 itérations par simulation',
    title1: 'Avant d\'investir',
    titleHighlight1: '50 000 $',
    title2: 'simulez votre business en',
    titleHighlight2: '60 secondes',
    subtitle: 'OpenGravity lance une armée d\'intelligences artificielles contre votre idée de business : recherche approfondie, agents synthétiques et 1 000 univers parallèles de Monte Carlo. Il vous dit si votre startup va survivre — avant que vous ne misiez un centime.',
    ctaPrimary: 'Lancer une simulation gratuite',
    ctaSecondary: 'Voir les démos en direct',
    noCard: 'Sans carte bancaire',
    freeSim: '3 simulations gratuites',
    pdfExport: 'Rapport PDF téléchargeable',
  },

  trust: {
    title: 'Technologie de niveau entreprise',
    deepseek: 'Raisonnement LLM',
    tavily: '5 crawlers parallèles',
    montecarlo: '1 000 itérations',
    upstash: 'Stockage isolé',
  },

  demos: {
    badge: 'DÉMOS RÉELLES',
    title: 'Voyez ce qu\'OpenGravity renvoie',
    subtitle: 'Trois exemples réels de simulations. Chacune tourne en 60s avec des données de marché en direct.',
    viability: 'Viabilité',
    ltv: 'LTV',
    cac: 'CAC',
    breakEven: 'Seuil de rentabilité',
    viewFull: 'Voir tout',
    items: [
      { title: 'SaaS B2B logistique', subtitle: 'Pour flottes en France', verdict: 'Favorable' },
      { title: 'Restaurant fast-food', subtitle: 'Paris, delivery-first', verdict: 'Modéré' },
      { title: 'Boutique en ligne de mode durable', subtitle: 'Europe, abonnement mensuel', verdict: 'Excellent' },
    ],
  },

  features: {
    badge: 'PIPELINE INDUSTRIEL V3',
    title: 'Quatre phases. Une réponse.',
    subtitle: 'Pas un wrapper ChatGPT. Un vrai moteur stochastique combinant recherche, agents synthétiques, simulation et synthèse — totalement orchestré.',
    items: [
      {
        title: '01 · Deep Research',
        desc: '5 crawlers Tavily en parallèle : overview, tendances, concurrents, métriques, risques. Score de confiance 0-100 basé sur l\'autorité, la fraîcheur et la diversité des sources.',
      },
      {
        title: '02 · Agents Synthétiques',
        desc: 'DeepSeek génère des profils démographiques et psychologiques de vos clients idéaux. Pouvoir d\'achat, sensibilité au prix, taux de conversion par segment.',
      },
      {
        title: '03 · Monte Carlo',
        desc: '1 000 univers parallèles. PRNG Mulberry32 déterministe. Percentiles P10/P50/P90 pour LTV, CAC, drawdown et taux de faillite. Seed auditable.',
      },
      {
        title: '04 · Synthèse LLM',
        desc: 'DeepSeek fusionne recherche + simulation en un rapport exécutif. Verdict, risques clés, recommandations stratégiques et pricing optimal.',
      },
    ],
  },

  how: {
    title: 'De l\'idée au verdict en 3 étapes',
    steps: [
      {
        title: 'Décrivez votre business',
        desc: 'Une phrase suffit. Ex : « SaaS B2B logistique pour flottes en France ». OpenGravity s\'occupe du reste.',
      },
      {
        title: 'Attendez 60 secondes',
        desc: 'Le pipeline tourne : recherche → agents → 1 000 simulations Monte Carlo → synthèse LLM. Vous recevez un jobId avec polling automatique.',
      },
      {
        title: 'Recevez votre rapport',
        desc: 'Viabilité 0-100, percentiles P10/P50/P90, risques clés, recommandations et stratégie de pricing. Exportable en PDF.',
      },
    ],
  },

  pricing: {
    badge: 'TARIFS DE LANCEMENT',
    title: 'Un investissement qui se rentabilise seul',
    subtitle: 'Une simulation manuelle de consulting coûte 2 000 $+. OpenGravity vous en donne 50 pour 29 $.',
    perMonth: '/mois',
    popular: 'LE PLUS POPULAIRE',
    plans: [
      {
        name: 'Free',
        description: 'Pour valider une idée ponctuelle',
        cta: 'Commencer gratuitement',
        features: [
          '3 simulations par mois',
          'Chat IA (10 messages/jour)',
          'Rapport basique P10/P50/P90',
          '1 cron job marketing',
        ],
      },
      {
        name: 'Pro',
        description: 'Pour les entrepreneurs sérieux',
        cta: 'Essayer 14 jours gratuits',
        features: [
          '50 simulations par mois',
          'Chat IA illimité',
          'Rapports complets + export PDF',
          '10 cron jobs marketing',
          'Historique persistant',
          'Support par email',
        ],
      },
      {
        name: 'Agency',
        description: 'Pour consultants et agences',
        cta: 'Parler au commercial',
        features: [
          'Simulations illimitées',
          'Multi-utilisateur (5 comptes)',
          'Accès API (10K appels/mois)',
          'Cron jobs illimités',
          'Rapports white-label',
          'Support prioritaire + onboarding',
        ],
      },
    ],
  },

  testimonials: {
    title: 'Cas d\'usage réels',
    subtitle: 'Projets où OpenGravity tourne déjà en production.',
    result: 'Résultat',
    items: [
      {
        title: 'Dropea-Shop',
        role: 'E-commerce · 1 200 produits',
        quote: 'Nous avons automatisé les posts Facebook avec le cron job d\'OpenGravity. L\'engagement a augmenté de 40% en 3 mois sans aucune intervention manuelle.',
        metric: '+40% engagement',
      },
      {
        title: 'autotaxflow',
        role: 'Fintech B2B · LatAm',
        quote: 'Nous avons lancé la simulation avant de lever pre-seed. Le rapport P10/P50/P90 a aidé à justifier le TAM auprès des investisseurs.',
        metric: 'Pre-seed bouclée',
      },
      {
        title: 'marketnow',
        role: 'SaaS · Automation marketing',
        quote: 'La recherche approfondie a trouvé 3 concurrents que nous avions manqués. Nous avons ajusté le pricing selon l\'élasticité simulée.',
        metric: '3 découvertes critiques',
      },
    ],
  },

  faq: {
    title: 'Questions fréquentes',
    items: [
      {
        q: 'En quoi OpenGravity diffère-t-il d\'un calcul manuel ?',
        a: 'OpenGravity exécute 1 000 simulations Monte Carlo avec un PRNG déterministe (Mulberry32), en variant les chocs macro, l\'élasticité des prix, le churn et le CAC. Il livre des percentiles P10/P50/P90 — pas un seul nombre optimiste. Chaque simulation inclut un score de confiance basé sur l\'autorité et la fraîcheur des sources réelles (Bloomberg, WSJ, Statista, McKinsey).',
      },
      {
        q: 'D\'où viennent les données de l\'analyse ?',
        a: 'Nous utilisons l\'API Tavily pour exécuter 5 crawlers en parallèle : overview, tendances, concurrents, métriques quantitatives et risques. Chaque source reçoit un score de confiance (0-100) basé sur l\'autorité du domaine, la fraîcheur des données et la cohérence entre sources.',
      },
      {
        q: 'Combien de temps prend une simulation ?',
        a: 'Entre 35 et 60 secondes. Le pipeline est asynchrone : vous soumettez l\'idée, obtenez un jobId, et le frontend poll toutes les 3-15s jusqu\'à ce que le rapport soit prêt.',
      },
      {
        q: 'Puis-je l\'utiliser pour tout type de business ?',
        a: 'Oui. Le moteur est calibré pour SaaS, e-commerce, restaurants, services professionnels, produits physiques et marketplaces. La simulation ajuste automatiquement la taille de l\'échantillon (0,01% du TAM) et le seuil de saturation du CAC selon le marché.',
      },
      {
        q: 'Mes données sont-elles en sécurité ?',
        a: 'Oui. Toutes les simulations sont stockées dans Upstash Redis avec namespace par utilisateur. Nous ne partageons pas vos idées de business avec des tiers. Les appels LLM vont à DeepSeek avec votre API key. Vous pouvez supprimer votre compte et toutes vos données à tout moment.',
      },
      {
        q: 'Puis-je annuler quand je veux ?',
        a: 'Oui, sans pénalité. Annulez depuis le dashboard et votre plan revient à Free à la fin de la période facturée. Pas de contrat annuel obligatoire.',
      },
    ],
  },

  finalCta: {
    title1: 'Votre prochaine idée mérite',
    title2: '1 000 simulations',
    subtitle: 'Ne laissez pas 50 000 $ sur une décision sans preuve. Essayez OpenGravity gratuitement aujourd\'hui.',
    cta: 'Commencer gratuitement',
    note: 'Sans carte · 3 simulations gratuites · Annulez quand vous voulez',
  },

  footer: {
    copyright: '© 2026 · Fait en LatAm',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    dashboard: 'Dashboard',
    contact: 'Contact',
  },
};
