/**
 * OpenGravity — i18n dictionary (Português brasileño).
 */
import type { Dictionary } from './es';

export const pt: Dictionary = {
  meta: {
    title: 'OpenGravity — Simule a viabilidade do seu negócio com IA',
    description: 'Antes de investir $50K, simule sua startup em 60 segundos. Deep Research + 1.000 iterações Monte Carlo + síntese LLM.',
  },

  nav: {
    features: 'Recursos',
    demos: 'Demos',
    pricing: 'Preços',
    faq: 'FAQ',
    login: 'Entrar',
    cta: 'Teste grátis',
  },

  hero: {
    badge: 'Motor Monte Carlo V3 · 1.000 iterações por simulação',
    title1: 'Antes de investir',
    titleHighlight1: '$50.000',
    title2: 'simule seu negócio em',
    titleHighlight2: '60 segundos',
    subtitle: 'OpenGravity lança um exército de inteligências artificiais contra sua ideia de negócio: pesquisa profunda, agentes sintéticos e 1.000 universos paralelos de Monte Carlo. Diz se sua startup vai sobreviver — antes de você apostar um centavo.',
    ctaPrimary: 'Lançar simulação grátis',
    ctaSecondary: 'Ver demos ao vivo',
    noCard: 'Sem cartão de crédito',
    freeSim: '3 simulações grátis',
    pdfExport: 'Relatório PDF para download',
  },

  trust: {
    title: 'Tecnologia de nível empresarial',
    deepseek: 'Raciocínio LLM',
    tavily: '5 crawlers paralelos',
    montecarlo: '1.000 iterações',
    upstash: 'Armazenamento isolado',
  },

  demos: {
    badge: 'DEMOS REAIS',
    title: 'Veja o que OpenGravity retorna',
    subtitle: 'Três exemplos reais de simulações. Cada uma roda em 60s com dados de mercado ao vivo.',
    viability: 'Viabilidade',
    ltv: 'LTV',
    cac: 'CAC',
    breakEven: 'Break-even',
    viewFull: 'Ver completo',
    items: [
      { title: 'SaaS B2B de logística', subtitle: 'Para frotas no Brasil', verdict: 'Favorável' },
      { title: 'Restaurante de fast food', subtitle: 'São Paulo, delivery-first', verdict: 'Moderado' },
      { title: 'Loja online de moda sustentável', subtitle: 'LatAm, assinatura mensal', verdict: 'Excelente' },
    ],
  },

  features: {
    badge: 'PIPELINE INDUSTRIAL V3',
    title: 'Quatro fases. Uma resposta.',
    subtitle: 'Não é um wrapper do ChatGPT. É um motor estocástico real que combina pesquisa, agentes sintéticos, simulação e síntese — tudo orquestrado.',
    items: [
      {
        title: '01 · Deep Research',
        desc: '5 crawlers Tavily em paralelo: overview, tendências, concorrentes, métricas, riscos. Score de confiança 0-100 baseado em autoridade, atualidade e diversidade de fontes.',
      },
      {
        title: '02 · Agentes Sintéticos',
        desc: 'DeepSeek gera perfis demográficos e psicológicos dos seus clientes ideais. Poder de compra, sensibilidade a preço, taxa de conversão por segmento.',
      },
      {
        title: '03 · Monte Carlo',
        desc: '1.000 universos paralelos. PRNG Mulberry32 determinístico. Percentis P10/P50/P90 para LTV, CAC, drawdown e taxa de falência. Seed auditável.',
      },
      {
        title: '04 · Síntese LLM',
        desc: 'DeepSeek funde pesquisa + simulação em um relatório executivo. Veredito, riscos chave, recomendações estratégicas e pricing ótimo.',
      },
    ],
  },

  how: {
    title: 'Da ideia ao veredito em 3 passos',
    steps: [
      {
        title: 'Descreva seu negócio',
        desc: 'Uma frase basta. Ex: "SaaS B2B de logística para frotas no Brasil". OpenGravity cuida do resto.',
      },
      {
        title: 'Espere 60 segundos',
        desc: 'O pipeline roda: pesquisa → agentes → 1.000 simulações Monte Carlo → síntese LLM. Você recebe um jobId com polling automático.',
      },
      {
        title: 'Receba seu relatório',
        desc: 'Viabilidade 0-100, percentis P10/P50/P90, riscos chave, recomendações e estratégia de pricing. Exportável em PDF.',
      },
    ],
  },

  pricing: {
    badge: 'PREÇOS DE LANÇAMENTO',
    title: 'Investimento que se paga sozinho',
    subtitle: 'Uma simulação manual de consultoria custa $2.000+. OpenGravity te dá 50 por $29.',
    perMonth: '/mês',
    popular: 'MAIS POPULAR',
    plans: [
      {
        name: 'Free',
        description: 'Para validar uma ideia específica',
        cta: 'Começar grátis',
        features: [
          '3 simulações por mês',
          'Chat com IA (10 mensagens/dia)',
          'Relatório básico P10/P50/P90',
          '1 cron job de marketing',
        ],
      },
      {
        name: 'Pro',
        description: 'Para empreendedores sérios',
        cta: 'Testar 14 dias grátis',
        features: [
          '50 simulações por mês',
          'Chat com IA ilimitado',
          'Relatórios completos + export PDF',
          '10 cron jobs de marketing',
          'Histórico persistente',
          'Suporte por email',
        ],
      },
      {
        name: 'Agency',
        description: 'Para consultores e agências',
        cta: 'Falar com vendas',
        features: [
          'Simulações ilimitadas',
          'Multi-usuário (5 contas)',
          'Acesso à API (10K chamadas/mês)',
          'Cron jobs ilimitados',
          'Relatórios white-label',
          'Suporte prioritário + onboarding',
        ],
      },
    ],
  },

  testimonials: {
    title: 'Casos de uso reais',
    subtitle: 'Projetos onde OpenGravity já está rodando em produção.',
    result: 'Resultado',
    items: [
      {
        title: 'Dropea-Shop',
        role: 'E-commerce · 1.200 produtos',
        quote: 'Automatizamos os posts de Facebook com o cron job do OpenGravity. Aumentamos o engagement 40% em 3 meses sem trabalho manual.',
        metric: '+40% engagement',
      },
      {
        title: 'autotaxflow',
        role: 'Fintech B2B · LatAm',
        quote: 'Rodamos a simulação antes de levantar pre-seed. O relatório P10/P50/P90 ajudou a justificar o TAM com os investidores.',
        metric: 'Pre-seed fechada',
      },
      {
        title: 'marketnow',
        role: 'SaaS · Automação de marketing',
        quote: 'A pesquisa profunda encontrou 3 concorrentes que não tínhamos no radar. Mudamos o pricing segundo a elasticidade simulada.',
        metric: '3 descobertas críticas',
      },
    ],
  },

  faq: {
    title: 'Perguntas frequentes',
    items: [
      {
        q: 'Como o OpenGravity difere de um cálculo manual?',
        a: 'OpenGravity roda 1.000 simulações Monte Carlo com PRNG determinístico (Mulberry32), variando choques macro, elasticidade de preço, churn e CAC. Entrega percentis P10/P50/P90 — não um único número otimista. Cada simulação inclui score de confiança baseado na autoridade e atualidade de fontes reais (Bloomberg, WSJ, Statista, McKinsey).',
      },
      {
        q: 'De onde vêm os dados da análise?',
        a: 'Usamos a API Tavily para rodar 5 crawlers em paralelo: overview, tendências, concorrentes, métricas quantitativas e riscos. Cada fonte recebe um score de confiança (0-100) baseado em autoridade do domínio, atualidade dos dados e consistência entre fontes.',
      },
      {
        q: 'Quanto tempo dura uma simulação?',
        a: 'Entre 35 e 60 segundos. O pipeline é assíncrono: você envia a ideia, recebe um jobId, e o frontend faz polling a cada 3-15s até o relatório ficar pronto.',
      },
      {
        q: 'Posso usar para qualquer tipo de negócio?',
        a: 'Sim. O motor está calibrado para SaaS, e-commerce, restaurantes, serviços profissionais, produtos físicos e marketplaces. A simulação ajusta automaticamente o tamanho da amostra (0,01% do TAM) e o limiar de saturação de CAC conforme o mercado.',
      },
      {
        q: 'Meus dados estão seguros?',
        a: 'Sim. Todas as simulações são guardadas no Upstash Redis com namespace por usuário. Não compartilhamos suas ideias de negócio com terceiros. As chamadas LLM vão para DeepSeek com sua API key. Você pode excluir sua conta e todos os seus dados a qualquer momento.',
      },
      {
        q: 'Posso cancelar quando quiser?',
        a: 'Sim, sem penalidade. Cancele pelo dashboard e seu plano volta para Free no final do período faturado. Sem contrato anual obrigatório.',
      },
    ],
  },

  finalCta: {
    title1: 'Sua próxima ideia merece',
    title2: '1.000 simulações',
    subtitle: 'Não deixe $50K numa decisão sem evidência. Teste OpenGravity grátis hoje.',
    cta: 'Começar grátis',
    note: 'Sem cartão · 3 simulações grátis · Cancele quando quiser',
  },

  footer: {
    copyright: '© 2026 · Feito na LatAm',
    privacy: 'Privacidade',
    terms: 'Termos',
    dashboard: 'Dashboard',
    contact: 'Contato',
  },
};
