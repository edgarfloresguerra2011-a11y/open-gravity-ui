/**
 * OpenGravity V3 — Master Pipeline (Bridge)
 *
 * Adapter that maps the new job_queue interface to the existing
 * runPredictionCycle orchestrator. Replace this file when the
 * canonical MasterPipeline is provided.
 */

import { runPredictionCycle } from './ai_logic';
import type { FinalPredictionReport } from './types';

interface PipelineInput {
  jobId: string;
  seed: string;
  idea: string;
  financials: Record<string, unknown>;
}

export const MasterPipeline = {
  /**
   * Runs the full 4-phase prediction cycle.
   * Maps from the new PipelineInput schema to the existing orchestrator.
   */
  async run(input: PipelineInput): Promise<FinalPredictionReport> {
    const result = await runPredictionCycle(input.idea, input.jobId);

    if (!result.success) {
      throw new Error(result.error || 'Pipeline returned unsuccessful result');
    }

    // The existing orchestrator returns { report, quantPayload }.
    // The new job_queue stores the full report as `data`.
    // We merge both payloads into a single FinalPredictionReport-compatible object.
    const report = result.report as any;
    const quant = result.quantPayload as any;

    return {
      ...report,
      // Attach quant payload so the status route can extract it
      quantPayload: quant,
      // Preserve pipeline metadata
      _pipelineMetrics: result.metrics,
    } as FinalPredictionReport;
  },
};
