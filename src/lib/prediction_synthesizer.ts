/**
 * OpenGravity — Industrial Prediction Synthesizer v3.0 (Monte Carlo V3 Integration)
 * 
 * Reingeniería para soportar el motor estocástico P10/P50/P90.
 */

import type { DeepResearchResult } from './skill_executor';
import type { SimulationResult } from './simulation_runner';
import { sanitizeResponse } from './security';

// ─── DEFINICIÓN ESTRICTA DE TIPOS ─────────────────────────────────────────────

export type MarketVerdict = 'Excelente' | 'Favorable' | 'Moderado' | 'Alto Riesgo' | 'Inviable';
export type RiskSeverity = 'Critico' | 'Alto' | 'Medio' | 'Bajo';

export interface PredictiveRisk {
    title: string;
    severity: RiskSeverity;
    mitigationStrategy: string;
}

export interface FinalPredictionReport {
    viabilityScore: number;            
    marketVerdict: MarketVerdict;
    executiveSummary: string;          
    breakEvenForecast: {
        months: number;
        requiredCapital: number;
        reasoning: string;
    };
    quantAudit: {
        churnAssumed: string;
        conversionAssumed: string;
        elasticityAssumed: string;
        researchIntegrityStatus: string;
    };
    keyRisks: PredictiveRisk[];
    strategicRecommendations: string[];  
    pricingStrategy: {
        recommendedPrice: number;
        elasticityWarning: string;
    };
    emergentWarning: string | null;          
    synthesizerMetadata: {
        processedAt: string;
        isFallback: boolean;
        confidenceLevel: number;
    }
}

// ─── COMPONENTES DEL SISTEMA ──────────────────────────────────────────────────

const MAX_RETRIES = 2; // Reducido para velocidad en Vercel
const TIMEOUT_MS = 25000;

export async function synthesizePrediction(
    businessProposal: string,
    research: DeepResearchResult,
    simulation: SimulationResult,
    historicalMemory: string = "Sin contexto histórico."
): Promise<FinalPredictionReport> {
    
    // Calcular Viability Score basado en Tasa de Bancarrota y Multiplo LTV/CAC (P50)
    const ltvCacRatio = simulation.ltv.p50 / Math.max(simulation.cac.p50, 1);
    const viabilityScore = Math.max(0, Math.min(100, Math.round((1 - simulation.bankruptcyRate) * 70 + (Math.min(ltvCacRatio, 5) / 5) * 30)));

    console.log(`[Synthesizer V3] Iniciando Fusión Analítica para: "${businessProposal.substring(0, 30)}..."`);
    console.log(`[Synthesizer V3] Trazabilidad: Trust=${research.globalConfidenceScore}%, Bankrupt=${(simulation.bankruptcyRate * 100).toFixed(0)}%, Score=${viabilityScore}`);

    // 1. Truncado de Data para evitar Context Overflow
    const safeResearch = truncateResearchToSafeBoundary(research);
    const safeSimulation = summarizeSimulationMetrics(simulation, viabilityScore);
    const safeMemory = truncateText(historicalMemory, 500);

    // 2. Construcción de Prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(businessProposal, safeResearch, safeSimulation, safeMemory);

    // 3. Inferencia con Reintentos
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const rawResponse = await enforceLLMCall(systemPrompt, userPrompt);
            const parsedData = extractAndValidateJSON(rawResponse);
            
            return {
                ...parsedData,
                viabilityScore, // Sobrescribir con el cálculo matemático real si es necesario
                synthesizerMetadata: {
                    processedAt: new Date().toISOString(),
                    isFallback: false,
                    confidenceLevel: research.globalConfidenceScore / 100
                }
            };
        } catch (error: any) {
            console.error(`[Synthesizer V3] Fallo en intento ${attempt}: ${error.message}`);
            if (attempt === MAX_RETRIES) break;
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    // 4. Fallback Determinista
    return generateDeterministicFallback(businessProposal, simulation, viabilityScore);
}

// ─── APOYO ──────────────────────────────────────────────────────────────────

async function enforceLLMCall(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error("DEEPSEEK_API_KEY_MISSING");

    const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'deepseek-chat', 
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
            temperature: 0.1,
            response_format: { type: "json_object" }
        }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json() as any;
    return data.choices[0].message.content || '';
}

function extractAndValidateJSON(rawString: string): Omit<FinalPredictionReport, 'synthesizerMetadata'> {
    const sanitized = sanitizeResponse(rawString);
    let cleanStr = sanitized.trim().replace(/^```(json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const match = cleanStr.match(/(\{[\s\S]*\})/);
    if (match) cleanStr = match[1];

    try {
        return JSON.parse(cleanStr);
    } catch (e: any) {
        throw new Error("JSON_PARSE_ERROR");
    }
}

function buildSystemPrompt(): string {
    return `Eres el "Synthesizer de OpenGravity". 
Genera un análisis ejecutivo basado en resultados de simulación Monte Carlo.
Tus veredictos deben ser fríos, basados en datos P10/P50/P90.
Si el P10 muestra bancarrota rápida o el LTV:CAC < 1.5, el veredicto es Alto Riesgo o Inviable.

ESQUEMA JSON:
{
  "viabilityScore": <NUMBER 0-100>,
  "marketVerdict": "<Excelente|Favorable|Moderado|Alto Riesgo|Inviable>",
  "executiveSummary": "<STRING max 300 caps>",
  "breakEvenForecast": { "months": <NUMBER>, "requiredCapital": <NUMBER>, "reasoning": "<STRING>" },
  "quantAudit": { "churnAssumed": "<STRING>", "conversionAssumed": "<STRING>", "elasticityAssumed": "<STRING>", "researchIntegrityStatus": "<STRING>" },
  "keyRisks": [ { "title": "<STRING>", "severity": "<Critico|Alto|Medio|Bajo>", "mitigationStrategy": "<STRING>" } ],
  "strategicRecommendations": [ "<STRING>" ],
  "pricingStrategy": { "recommendedPrice": <NUMBER>, "elasticityWarning": "<STRING>" },
  "emergentWarning": "<STRING|null>"
}`.trim();
}

function buildUserPrompt(proposal: string, research: string, sim: string, memory: string): string {
    return `PROPOSICIÓN: ${proposal}\n\nRESEARCH: ${research}\n\nSIMULACIÓN: ${sim}\n\nCONTEXTO: ${memory}`.trim();
}

function truncateText(text: string, maxLen: number): string {
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
}

function truncateResearchToSafeBoundary(r: DeepResearchResult): string {
    return `Overview: ${truncateText(r.overview.synthesis, 400)}\nPlayers: ${truncateText(r.keyPlayers?.synthesis || "", 400)}`;
}

function summarizeSimulationMetrics(sim: SimulationResult, score: number): string {
    const input = sim.inputs;
    return `
    ITERACIONES: ${sim.iterationsRun}
    SCORE VIABILIDAD: ${score}/100
    BANCARROTA: ${(sim.bankruptcyRate * 100).toFixed(1)}%
    LTV (P10/P50/P90): $${sim.ltv.p10} / $${sim.ltv.p50} / $${sim.ltv.p90}
    CAC (P10/P50/P90): $${sim.cac.p10} / $${sim.cac.p50} / $${sim.cac.p90}
    BREAK-EVEN: ${sim.breakEvenMonth} meses
    PRECIO USADO: $${input.price}
    ELASTICIDAD: ${input.elasticity}
    TRUST SCORE: ${input.researchTrustScore}
    `.trim();
}

function generateDeterministicFallback(proposal: string, sim: SimulationResult, score: number): FinalPredictionReport {
    const ltvCac = sim.ltv.p50 / Math.max(sim.cac.p50, 1);
    let verdict: MarketVerdict = 'Moderado';
    if (score > 75) verdict = 'Favorable';
    if (score > 85) verdict = 'Excelente';
    if (sim.bankruptcyRate > 0.3) verdict = 'Alto Riesgo';
    if (sim.bankruptcyRate > 0.6) verdict = 'Inviable';

    return {
        viabilityScore: score,
        marketVerdict: verdict,
        executiveSummary: `Análisis automático: El proyecto para "${proposal.substring(0, 20)}" presenta un ratio LTV/CAC de ${ltvCac.toFixed(2)}x con una tasa de falla estocástica del ${(sim.bankruptcyRate * 100).toFixed(0)}%.`,
        breakEvenForecast: {
            months: sim.breakEvenMonth,
            requiredCapital: sim.drawdown.p90, // Peor caso de drawdown
            reasoning: "Basado en P90 de flujo de caja negativo acumulado durante la simulación."
        },
        quantAudit: {
            churnAssumed: `${(sim.inputs.churnRate * 100).toFixed(1)}% mensual`,
            conversionAssumed: `${(sim.inputs.conversionRate * 100).toFixed(1)}%`,
            elasticityAssumed: sim.inputs.elasticity.toString(),
            researchIntegrityStatus: `Trust Score: ${sim.inputs.researchTrustScore * 100}%`
        },
        keyRisks: [{ title: "Riesgo de Capital", severity: sim.bankruptcyRate > 0.4 ? 'Critico' : 'Alto', mitigationStrategy: "Asegurar pista de aterrizaje mínima para cubrir el Drawdown P90." }],
        strategicRecommendations: [`Vigilar el CAC en el nivel P50 ($${sim.cac.p50}) para mantener viabilidad.`],
        pricingStrategy: { recommendedPrice: sim.inputs.price, elasticityWarning: "Elasticidad asumida inelástica si es > -1." },
        emergentWarning: null,
        synthesizerMetadata: { processedAt: new Date().toISOString(), isFallback: true, confidenceLevel: 0 }
    };
}
