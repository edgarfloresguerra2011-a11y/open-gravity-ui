/**
 * OpenGravity — Demographic Engine V3 (Statistical Distribution)
 */

import type { DeepResearchResult } from './skill_executor';
import type { SimulationInput } from './simulation_runner';

// ─── TIPOS DE DATOS ──────────────────────────────────────────────────────────

export type IncomeLevel = 'bajo' | 'medio-bajo' | 'medio' | 'medio-alto' | 'alto';
export type PersonalityTrait = 'price_sensitive' | 'quality_seeker' | 'convenience_driven' | 'brand_loyal' | 'trend_follower' | 'traditional' | 'social_proof_driven';

export interface ClientPersona {
    id: string;
    type: PersonalityTrait;
    incomeLevel: IncomeLevel;
    buyingPower: number;               
    baseConversionProbability: number; 
    priceSensitivity: number;          
}

export interface CompetitorPersona {
    id: string;
    name: string;
    aggressiveness: number; 
    marketShare: number;    
}

export interface EnvironmentPersona {
    description: string;
    inflationRate: number;     
    consumerConfidence: number;
}

export interface MarketPersonas {
    clients: ClientPersona[];
    competitors: CompetitorPersona[];
    environment: EnvironmentPersona;
    simulationDefaults: Omit<SimulationInput, 'jobId' | 'seed'>;
}

// ─── UTILIDADES ESTADÍSTICAS ───────────────────────────────────

function randomNormal(mean: number, stdDev: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + (num * stdDev);
}

function randomLogNormal(mu: number, sigma: number): number {
    return Math.exp(mu + (randomNormal(0, 1) * sigma));
}

function weightedRandom<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
        r -= weights[i];
        if (r <= 0) return items[i];
    }
    return items[items.length - 1];
}

function assignIncomeLevel(power: number, mean: number): IncomeLevel {
    if (power < mean * 0.4) return 'bajo';
    if (power < mean * 0.8) return 'medio-bajo';
    if (power < mean * 1.2) return 'medio';
    if (power < mean * 1.8) return 'medio-alto';
    return 'alto';
}

// ─── GENERADOR PRINCIPAL ──────────────────────────────────────────────────

export async function generateMarketPersonas(
    proposal: string,
    research: DeepResearchResult,
    populationSize: number = 50
): Promise<MarketPersonas> {
    
    console.log(`[Demographic Engine] Extrayendo variables estadísticas de mercado vía LLM...`);

    const params = await fetchMarketParameters(proposal, research);

    const clients: ClientPersona[] = [];
    const traits = params.populationParameters.traitsWeights.map((t: any) => t.trait);
    const weights = params.populationParameters.traitsWeights.map((t: any) => t.weight);

    for (let i = 0; i < populationSize; i++) {
        const M = params.populationParameters.buyingPower.mean;
        const V = Math.pow(params.populationParameters.buyingPower.stdDev, 2);
        const mu = Math.log(Math.pow(M, 2) / Math.sqrt(V + Math.pow(M, 2)));
        const sigma = Math.sqrt(Math.log(1 + (V / Math.pow(M, 2))));

        const rawPower = randomLogNormal(mu, sigma);
        const trait = weightedRandom(traits, weights);

        let sensitivity = randomNormal(0.5, 0.2);
        if (trait === 'price_sensitive') sensitivity += 0.3;
        if (trait === 'quality_seeker') sensitivity -= 0.3;
        sensitivity = Math.min(Math.max(sensitivity, 0.1), 0.99);

        const baseConv = Math.min(Math.max(randomNormal(0.3, 0.15), 0.01), 0.9);

        clients.push({
            id: `p_agent_${i}`,
            type: trait as PersonalityTrait,
            incomeLevel: assignIncomeLevel(rawPower, M),
            buyingPower: Math.round(rawPower),
            baseConversionProbability: Number(baseConv.toFixed(2)),
            priceSensitivity: Number(sensitivity.toFixed(2))
        });
    }

    return {
        clients,
        competitors: params.competitors,
        environment: params.environment,
        simulationDefaults: params.simulationDefaults
    };
}

async function fetchMarketParameters(proposal: string, research: DeepResearchResult) {
    const prompt = `Actúa como Director de Estocástica y Estratega Industrial.
Analiza la propuesta y el research para extraer los parámetros de simulación.

CRÍTICO: Prioriza modelos de negocio LEAN. 
- Evita gastos fijos (fixedOpEx) inflados (> $5k) a menos que sea una industria pesada.
- Busca un CAC inicial razonable ($10-$60) para startups.
- La conversión debe reflejar realismo industrial (0.5% - 5%).
- El objetivo es que la simulación refleje un camino viable hacia el break-even, no una quiebra por falta de optimización inicial.

PROYECTO: ${proposal}
RESEARCH: ${research.rawSynthesis.substring(0, 2000)}

REQUERIDO (JSON):
{
  "populationParameters": {
    "buyingPower": { "mean": <NUMBER>, "stdDev": <NUMBER> },
    "traitsWeights": [ { "trait": "price_sensitive", "weight": <NUMBER> }, ... ]
  },
  "simulationDefaults": {
    "price": <NUMBER, precio sugerido unitario>,
    "baseCac": <NUMBER, costo adquisición inicial>,
    "fixedOpEx": <NUMBER, costos fijos mensuales (manténlo lean)>,
    "initialCash": <NUMBER, capital inicial recomendado para 12-18 meses de pista>,
    "estimatedTAM": <NUMBER, personas totales en mercado objetivo>,
    "marketRefPrice": <NUMBER, precio de referencia competencia>,
    "elasticity": <NUMBER, ej -1.5>,
    "churnRate": <NUMBER, ej 0.05>,
    "conversionRate": <NUMBER, ej 0.02>,
    "researchTrustScore": ${research.globalConfidenceScore / 100}
  },
  "competitors": [ ... ],
  "environment": { ... }
}`.trim();

    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    try {
        const req = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'system', content: prompt }],
                temperature: 0.1,
                response_format: { type: "json_object" }
            })
        });

        const json = await req.json();
        return JSON.parse(json.choices[0].message.content);
    } catch (e) {
        // Fallback robusto
        return {
            populationParameters: { buyingPower: { mean: 100, stdDev: 30 }, traitsWeights: [{ trait: "price_sensitive", weight: 1.0 }] },
            simulationDefaults: {
                price: 50, baseCac: 20, fixedOpEx: 1000, initialCash: 5000, estimatedTAM: 100000,
                marketRefPrice: 55, elasticity: -1.2, churnRate: 0.1, conversionRate: 0.03, researchTrustScore: 0.5
            },
            competitors: [],
            environment: { description: "Std", inflationRate: 0.05, consumerConfidence: 5 }
        };
    }
}
