/**
 * OpenGravity — Deep Research Agent v3.0 (General Knowledge + Cache & Trust Scoring)
 * 
 * Ejecuta investigaciones profundas, paralelas y multifacéticas.
 * Ahora incluye caché en memoria (Zero-Latency for repeated inputs) 
 * y un Algoritmo de Scoring de Confianza sobre las fuentes recopiladas,
 * evitando que la simulación tome alucinaciones llm o webs falsas como verdades absolutas.
 */

// ─── CACHÉ PARAMÉTRICA V1 ───────────────────────────────────────────────────────

// En un entorno serverless (Vercel/NextJS), este Map persistirá temporalmente 
// mientras el worker esté caliente. Suficiente para deduplicar requests masivas idénticas.
const RESEARCH_CACHE = new Map<string, { timestamp: number; result: DeepResearchResult }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 Horas de validez térmica.

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface TavilyResult {
    title: string;
    url: string;
    content: string;
    score: number;
    published_date?: string;
}

export interface TavilyResponse {
    results: TavilyResult[];
    answer?: string;           
    query: string;
    response_time: number;
}

export interface ResearchResult {
    query: string;
    sources: {
        title: string;
        url: string;
        domain: string;
        snippet: string;
        relevance: number;
        date?: string;
    }[];
    synthesis: string;         
    searchTime: number;
    metrics: {
        confidenceScore: number;     // 0 a 100
        uniqueDomainsCount: number;
        totalSources: number;
    };
}

export interface DeepResearchResult {
    topic: string;
    context: string;
    overview: ResearchResult;
    trends: ResearchResult;
    keyPlayers: ResearchResult;
    dataMetrics: ResearchResult;
    challenges: ResearchResult;
    rawSynthesis: string;      
    totalSearchTime: number;
    globalConfidenceScore: number;   // Promedio de confiabilidad 0-100
    isCachedResult: boolean;
}

// ─── CLIENTE TAVILY ──────────────────────────────────────────────────────────

async function tavilySearch(
    query: string,
    options: {
        searchDepth?: 'basic' | 'advanced';
        maxResults?: number;
        includeAnswer?: boolean;
        includeDomains?: string[];
        excludeDomains?: string[];
        topic?: 'general' | 'news' | 'finance';
    } = {}
): Promise<TavilyResponse> {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) throw new Error('TAVILY_API_KEY no dictaminada en el entorno seguro.');

    const body = {
        api_key: apiKey,
        query,
        search_depth: options.searchDepth || 'basic',
        max_results: options.maxResults || 5,
        include_answer: options.includeAnswer ?? true,
        include_domains: options.includeDomains || [],
        exclude_domains: options.excludeDomains || [],
        topic: options.topic || 'general',
    };

    const start = Date.now();
    const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`[Tavily Critical Error] HTTP ${response.status}: ${err.substring(0, 150)}`);
    }

    const data = await response.json() as TavilyResponse;
    data.response_time = Date.now() - start;
    return data;
}

// ─── ANALISIS ESTRICTO Y SCORING ──────────────────────────────────────────────

function extractDomain(url: string): string {
    try { return new URL(url).hostname.replace(/^www\./, ''); } 
    catch { return 'dominio-desconocido.com'; }
}

// Diccionario empírico de Autoridad (Source Authority)
const HIGH_AUTHORITY_DOMAINS = new Set([
    'bloomberg.com', 'wsj.com', 'ft.com', 'reuters.com', 'economist.com', 
    'mckinsey.com', 'gartner.com', 'forrester.com', 'statista.com', 
    'hbr.org', 'cnbc.com', 'worldbank.org', 'imf.org'
]);

function getDomainAuthority(domain: string): number {
    const isHighAuth = HIGH_AUTHORITY_DOMAINS.has(domain.toLowerCase());
    if (isHighAuth) return 1.0;
    if (domain.endsWith('.gov') || domain.endsWith('.edu')) return 0.95;
    if (domain.endsWith('.org')) return 0.8;
    return 0.5; // Dominio genérico
}

function calculateConfidenceScore(sources: ResearchResult['sources']): number {
    if (sources.length === 0) return 0;
    
    // Pesos Explícitos (w1, w2, w3)
    const W1_AUTHORITY = 0.40;
    const W2_RECENCY = 0.30;
    const W3_CONSISTENCY = 0.30;

    let totalScore = 0;

    // Calcular promedios para cada dimensión
    const now = new Date().getTime();

    sources.forEach(s => {
        // 1. Autoridad de la Fuente [0.0 - 1.0]
        const authorityScore = getDomainAuthority(s.domain);
        
        // 2. Recency (Frescura de los datos) [0.0 - 1.0]
        let recencyScore = 0.6; // Valor neutro si no hay fecha
        if (s.date) {
            const pubDate = new Date(s.date).getTime();
            const daysOld = (now - pubDate) / (1000 * 60 * 60 * 24);
            if (daysOld <= 30) recencyScore = 1.0;          // < 1 mes
            else if (daysOld <= 180) recencyScore = 0.85;   // < 6 meses
            else if (daysOld <= 365) recencyScore = 0.70;   // < 1 año
            else recencyScore = 0.40;                       // Viejo
        }

        // 3. Consistency / Relevance (Tavily Score) [0.0 - 1.0]
        const consistencyScore = s.relevance; 

        // Score Compuesto de este source
        const sourceScore = (authorityScore * W1_AUTHORITY) + 
                            (recencyScore * W2_RECENCY) + 
                            (consistencyScore * W3_CONSISTENCY);
        
        totalScore += sourceScore;
    });

    // Promedio global del batch de fuentes
    let finalScore = totalScore / sources.length;

    // 4. Penalización por Eco-Chamber (Falta de Diversidad)
    const uniqueDomains = new Set(sources.map(s => s.domain)).size;
    if (uniqueDomains === 1 && sources.length > 1) {
        finalScore *= 0.6; // Si todas las fuentes son de 1 solo dominio, se tumba el trust 40%
    }

    return Math.min(Math.max(Math.round(finalScore * 100), 0), 100);
}

function formatResults(data: TavilyResponse, query: string): ResearchResult {
    const rawSources = data.results || [];
    
    const formattedSources = rawSources.map(r => ({
        title: r.title,
        url: r.url,
        domain: extractDomain(r.url),
        snippet: r.content.substring(0, 300),
        relevance: r.score, // Base 0-1
        date: r.published_date,
    }));

    const uniqueDomains = new Set(formattedSources.map(s => s.domain)).size;
    const confidenceScore = calculateConfidenceScore(formattedSources);

    const synthesis = [
        `=== FACT-CHECK: ${query.toUpperCase()} [Confianza: ${confidenceScore}%] ===`,
        data.answer ? `RESUMEN NEUTRAL: ${data.answer}` : '',
        '',
        'CITAS BIBLIOGRÁFICAS E INDEXACIÓN:',
        formattedSources.map((s, i) =>
            `[${i + 1}] ${s.domain} — ${s.title}\n    ${s.snippet}`
        ).join('\n\n'),
        '=== FIN FACT-CHECK ===',
    ].filter(Boolean).join('\n');

    return {
        query,
        sources: formattedSources,
        synthesis,
        searchTime: data.response_time,
        metrics: {
            confidenceScore,
            uniqueDomainsCount: uniqueDomains,
            totalSources: formattedSources.length
        }
    };
}

// ─── DEEP RESEARCH AGENT PRINCIPAL ────────────────────────────────────────────

export async function runDeepResearch(topic: string, context: string = ""): Promise<DeepResearchResult> {
    const startTime = Date.now();
    const cacheKey = `${topic.trim().toLowerCase()}_${context.trim().toLowerCase()}`;

    // Validación de Memoria L1 (Caché)
    const cached = RESEARCH_CACHE.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
        console.log(`[DeepResearchAgent] CACHE HIT: Recuperando investigación estática de "${topic}". (Latencia Cero)`);
        return { ...cached.result, isCachedResult: true };
    }

    console.log(`[DeepResearchAgent] Iniciando Network Crawling para: "${topic}"...`);

    // ── 5 CRAWLERS EN PARALELO ──────────────────────────────────────────────
    const [overviewData, trendsData, playersData, metricsData, challengesData] = await Promise.allSettled([
        tavilySearch(`análisis profundo conceptos macro sobre ${topic} ${context}`, { searchDepth: 'advanced', maxResults: 5 }),
        tavilySearch(`tendencias disruptivas macroeconomía noticias recientes ${topic} ${context}`, { searchDepth: 'advanced', maxResults: 5, topic: 'news' }),
        tavilySearch(`empresas cuota mercado jugadores monopolios leads en ${topic} ${context}`, { searchDepth: 'basic', maxResults: 4 }),
        tavilySearch(`números crudos estadísticas TAM SAM SOM márgenes ${topic} ${context}`, { searchDepth: 'basic', maxResults: 4 }),
        tavilySearch(`riesgos quiebras problemas regulatorios amenazas en ${topic} ${context}`, { searchDepth: 'advanced', maxResults: 4 }),
    ]);

    const extractResult = (settled: PromiseSettledResult<TavilyResponse>, fallbackQuery: string): ResearchResult => {
        if (settled.status === 'fulfilled') return formatResults(settled.value, fallbackQuery);
        console.warn(`[DeepResearchAgent] Caída de Sub-Crawler [${fallbackQuery}]:`, settled.reason);
        return {
            query: fallbackQuery, sources: [], synthesis: `[ÁNGULO CIEGO: No se obtuvieron datos confiables.]`,
            searchTime: 0, metrics: { confidenceScore: 0, uniqueDomainsCount: 0, totalSources: 0 }
        };
    };

    const overview = extractResult(overviewData, `Overview de ${topic}`);
    const trends = extractResult(trendsData, `Tendencias de ${topic}`);
    const keyPlayers = extractResult(playersData, `Competidores en ${topic}`);
    const dataMetrics = extractResult(metricsData, `Estadísticas de ${topic}`);
    const challenges = extractResult(challengesData, `Desafíos de ${topic}`);

    // Cálculo global de certeza matemática
    const scores = [overview, trends, keyPlayers, dataMetrics, challenges].map(r => r.metrics.confidenceScore);
    const globalConfidenceScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.filter(s => s > 0).length || 0);

    const rawSynthesis = `
╔══════════════════════════════════════════════════════════╗
║     REPORTE DE INTELIGENCIA ESTRUCTURADA                 ║
║     TARGET: ${topic}
║     NIVEL DE CONFIANZA GLOBAL: ${globalConfidenceScore}%
╚══════════════════════════════════════════════════════════╝

► ÁNGULO 1: RESUMEN Y CONCEPTOS [Confianza: ${overview.metrics.confidenceScore}%]
${overview.synthesis}

► ÁNGULO 2: TENDENCIAS Y SHOCKS [Confianza: ${trends.metrics.confidenceScore}%]
${trends.synthesis}

► ÁNGULO 3: ACTORES Y COMPETENCIA [Confianza: ${keyPlayers.metrics.confidenceScore}%]
${keyPlayers.synthesis}

► ÁNGULO 4: DATA CUANTITATIVA [Confianza: ${dataMetrics.metrics.confidenceScore}%]
${dataMetrics.synthesis}

► ÁNGULO 5: RIESGOS [Confianza: ${challenges.metrics.confidenceScore}%]
${challenges.synthesis}
    `.trim();

    const finalResult: DeepResearchResult = {
        topic, context, overview, trends, keyPlayers, dataMetrics, challenges, rawSynthesis,
        totalSearchTime: Date.now() - startTime,
        globalConfidenceScore,
        isCachedResult: false
    };

    // Almacenamiento en Memoria L1
    RESEARCH_CACHE.set(cacheKey, { timestamp: Date.now(), result: finalResult });

    return finalResult;
}
