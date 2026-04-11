import { runDeepResearch, DeepResearchResult } from './skill_executor';
import { generateMarketPersonas, MarketPersonas } from './persona_generator';
import { runMonteCarlo, SimulationResult } from './simulation_runner';
import { synthesizePrediction, FinalPredictionReport } from './prediction_synthesizer';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface QuantPayload {
    jobId: string;
    iterationsRun: number;
    ltv: SimulationResult['ltv'];
    cac: SimulationResult['cac'];
    drawdown: SimulationResult['drawdown'];
    bankruptcyRate: number;
    breakEvenMonth: number;
    trustScore: number;
    emergentInsights: string[];
}

export interface PredictionCycleResult {
    success: boolean;
    proposal: string;
    report?: FinalPredictionReport;
    quantPayload?: QuantPayload;
    error?: string;
    metrics?: {
        researchFallback: boolean;
        personaFallback: boolean;
        simulationFallback: boolean;
    };
}

// ─── ORQUESTADOR V3 ──────────────────────────────────────────────────────────

export async function runPredictionCycle(businessProposal: string, jobId: string = "anon"): Promise<PredictionCycleResult> {
    console.log(`[Orchestrator V3] Iniciando Predicción para Job: ${jobId}`);

    let research: DeepResearchResult;
    let personas: MarketPersonas;
    let simulation: SimulationResult;

    const metrics = { researchFallback: false, personaFallback: false, simulationFallback: false };

    // 1. RESEARCH
    try {
        research = await runDeepResearch(businessProposal);
    } catch (e) {
        metrics.researchFallback = true;
        research = generateResearchFallback(businessProposal);
    }

    // 2. PARÁMETROS Y PERSONAS
    try {
        personas = await generateMarketPersonas(businessProposal, research);
    } catch (e) {
        metrics.personaFallback = true;
        personas = generatePersonaFallback();
    }

    // 3. SIMULACIÓN MONTE CARLO
    try {
        const simInput = {
            jobId,
            seed: jobId, // Usamos el ID como semilla
            ...personas.simulationDefaults,
        };
        simulation = runMonteCarlo(simInput);
    } catch (e) {
        metrics.simulationFallback = true;
        simulation = generateSimulationFallback(jobId, personas);
    }

    // 4. SÍNTESIS FINAL
    try {
        const report = await synthesizePrediction(businessProposal, research, simulation);

        const quantPayload: QuantPayload = {
            jobId,
            iterationsRun: simulation.iterationsRun,
            ltv: simulation.ltv,
            cac: simulation.cac,
            drawdown: simulation.drawdown,
            bankruptcyRate: simulation.bankruptcyRate,
            breakEvenMonth: simulation.breakEvenMonth,
            trustScore: research.globalConfidenceScore / 100,
            emergentInsights: [
                `Elasticidad detectada: ${simulation.inputs.elasticity}`,
                `Poder adquisitivo promedio: $${simulation.ltv.p50 / (1/simulation.inputs.churnRate) }`, // Estimado
                `Ratio LTV/CAC (Mediana): ${(simulation.ltv.p50 / Math.max(simulation.cac.p50, 1)).toFixed(2)}x`
            ]
        };

        return { success: true, proposal: businessProposal, report, quantPayload, metrics };
    } catch (e: any) {
        return { success: false, proposal: businessProposal, error: e.message, metrics };
    }
}

// ─── FALLBACKS ──────────────────────────────────────────────────────────────

function generateResearchFallback(q: string): DeepResearchResult {
    return {
        topic: q, context: "", globalConfidenceScore: 20, isCachedResult: false, totalSearchTime: 0,
        overview: { synthesis: "Error en Research.", metrics: { confidenceScore: 0 } } as any,
        trends: {} as any, keyPlayers: {} as any, dataMetrics: {} as any, challenges: {} as any, rawSynthesis: "FALLBACK"
    };
}

function generatePersonaFallback(): MarketPersonas {
    return {
        clients: [], competitors: [], environment: { description: "Mercado Emergente Optimizada", inflationRate: 0.02, consumerConfidence: 7 },
        simulationDefaults: {
            price: 79, baseCac: 35, fixedOpEx: 1200, initialCash: 25000, estimatedTAM: 150000,
            marketRefPrice: 85, elasticity: -1.3, churnRate: 0.04, conversionRate: 0.045, researchTrustScore: 0.7
        }
    };
}

function generateSimulationFallback(jobId: string, p: MarketPersonas): SimulationResult {
    const fallbackInput = { jobId, seed: jobId, ...p.simulationDefaults };
    return {
        ltv: { p10: 100, p50: 200, p90: 300 },
        cac: { p10: 40, p50: 50, p90: 80 },
        drawdown: { p10: 1000, p50: 2000, p90: 5000 },
        bankruptcyRate: 0.5,
        breakEvenMonth: 12,
        iterationsRun: 1,
        seed: jobId,
        inputs: fallbackInput
    };
}
// ─── LEGACY COMPATIBILITY (CHAT & WEBHOOKS) ──────────────────────────────────

/**
 * Builds the payload for a streaming chat response.
 * Used by /api/chat/route.ts
 */
export async function buildStreamPayload(messages: any[]) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = 'https://api.deepseek.com/chat/completions';
    
    return {
        apiUrl,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: {
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: 'Eres OpenGravity, un asistente experto en estrategia de negocios y análisis estocástico.' },
                ...messages
            ],
            stream: true,
            temperature: 0.7,
        },
        engine: 'DeepSeek-V3'
    };
}

/**
 * Processes a single message for non-streaming bots (like Telegram).
 * Used by /api/webhook/telegram/route.ts
 */
export async function processAiMessage(text: string) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    try {
        const res = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: text }],
                temperature: 0.7,
            }),
        });
        const data = await res.json() as any;
        return { reply: data.choices[0].message.content };
    } catch (e) {
        return { reply: "Lo siento, tuve un error procesando tu mensaje." };
    }
}
