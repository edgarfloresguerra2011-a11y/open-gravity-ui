/**
 * OpenGravity V3 — Master Pipeline (Bridge)
 *
 * Adapter that maps the new job_queue interface to the existing
 * runPredictionCycle orchestrator.
 *
 * FIX A2: Genera `narrativePayload` con la estructura esperada por el
 * componente PredictionReport del frontend.
 */

import { runPredictionCycle } from './ai_logic';
import type { FinalPredictionReport } from './types';

interface PipelineInput {
  jobId: string;
  seed: string;
  idea: string;
  financials: Record<string, unknown>;
}

/**
 * Forma del objeto almacenado en Redis y devuelto por /api/predict/status.
 * Extiende FinalPredictionReport con los payloads que el frontend necesita.
 */
export interface StoredJobData extends FinalPredictionReport {
  quantPayload?: {
    jobId: string;
    iterationsRun: number;
    ltv: { p10: number; p50: number; p90: number };
    cac: { p10: number; p50: number; p90: number };
    drawdown: { p10: number; p50: number; p90: number };
    bankruptcyRate: number;
    breakEvenMonth: number;
    trustScore: number;
    emergentInsights: string[];
  };
  narrativePayload?: {
    executiveSummary: string;
    keyRisks: string[];
    recommendations: string[];
    blackSwanWarning: string | null;
  };
  _pipelineMetrics?: {
    researchFallback: boolean;
    personaFallback: boolean;
    simulationFallback: boolean;
  };
}

export const MasterPipeline = {
  /**
   * Runs the full 4-phase prediction cycle.
   * Maps from the new PipelineInput schema to the existing orchestrator.
   */
  async run(input: PipelineInput): Promise<StoredJobData> {
    const result = await runPredictionCycle(input.idea, input.jobId, input.seed);

    if (!result.success) {
      throw new Error(result.error || 'Pipeline returned unsuccessful result');
    }

    const report = result.report as FinalPredictionReport;
    const quant = result.quantPayload;

    // FIX A2: Generar narrativePayload con la forma esperada por el frontend
    const narrativePayload = {
      executiveSummary: report.executiveSummary,
      keyRisks: Array.isArray(report.keyRisks)
        ? report.keyRisks.map(r => typeof r === 'string' ? r : r.title)
        : [],
      recommendations: Array.isArray(report.strategicRecommendations)
        ? report.strategicRecommendations
        : [],
      blackSwanWarning: report.emergentWarning ?? null,
    };

    return {
      ...report,
      // Attach quant payload so the status route can extract it
      quantPayload: quant,
      // FIX A2: narrative payload explícito, no fallback al objeto completo
      narrativePayload,
      // Preserve pipeline metadata
      _pipelineMetrics: result.metrics,
    } as StoredJobData;
  },
};
