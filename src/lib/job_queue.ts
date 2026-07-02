/**
 * OpenGravity V3 — Job Queue (Redis-backed)
 *
 * Fixes applied:
 *   [+] Timeout reduced: 4.5 min → 2.5 min (150s) — lands safely under Vercel Pro 300s limit
 *       with 150s of margin for the `failed` write to complete before Lambda dies.
 *   [+] All Redis ops properly awaited
 *   [+] TTL set to 24h on all job keys
 *   [+] Failed state written BEFORE lambda could be killed (via Promise.race)
 *   [+] Seed derived from jobId hash — reproducible but unique per run
 */

import { Redis } from "@upstash/redis";
import { createHash } from "crypto";
import { MasterPipeline } from "./master_pipeline";
import type { FinalPredictionReport } from "./types";

// ─── Redis ────────────────────────────────────────────────────────────────────

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const JOB_TTL_SECONDS = 60 * 60 * 24; // 24 hours
const JOB_TIMEOUT_MS  = 150_000;       // 2.5 minutes (FIX: was 270_000 / 4.5 min)

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus = "queued" | "processing" | "completed" | "failed";

interface JobRecord {
  status: JobStatus;
  createdAt: number;
  seed: string;
  data?: FinalPredictionReport;
  error?: string;
}

interface JobInput {
  idea: string;
  financials: Record<string, unknown>;
}

// ─── Seed derivation (FIX: was static 12345) ─────────────────────────────────

/**
 * Derives a deterministic 32-bit seed from jobId.
 * Same jobId → same simulation. Different jobId → different simulation.
 * Fully auditable: store jobId, replay anytime.
 */
function deriveSeed(jobId: string): string {
  return createHash("sha256").update(jobId).digest("hex").slice(0, 16);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function enqueuePredictionJob(
  jobId: string,
  input: JobInput
): Promise<void> {
  const seed = deriveSeed(jobId);

  const initial: JobRecord = {
    status: "queued",
    createdAt: Date.now(),
    seed,
  };

  // Persist initial state before kicking off async work
  await redis.set(`job:${jobId}`, JSON.stringify(initial), { ex: JOB_TTL_SECONDS });

  // Fire async pipeline — intentionally not awaited by caller
  processJobAsync(jobId, seed, input).catch((err) => {
    console.error(`[job_queue] Unhandled error for job ${jobId}:`, err);
  });
}

export async function getJob(jobId: string): Promise<JobRecord | null> {
  const raw = await redis.get<string>(`job:${jobId}`);
  if (!raw) return null;
  try {
    return typeof raw === "string" ? JSON.parse(raw) : (raw as JobRecord);
  } catch {
    return null;
  }
}

// ─── Internal processor ───────────────────────────────────────────────────────

async function processJobAsync(
  jobId: string,
  seed: string,
  input: JobInput
): Promise<void> {
  // Mark as processing
  await setJobState(jobId, { status: "processing" });

  // FIX: flag para prevenir que el timeout dispare setJobState(failed)
  // DESPUÉS de que el job ya haya completado correctamente.
  let settled = false;

  // ── Timeout race (FIX: 2.5 min, ensures `failed` write before lambda dies) ──
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => {
        if (!settled) {
          reject(new Error(`Job ${jobId} exceeded ${JOB_TIMEOUT_MS / 1000}s timeout`));
        }
      },
      JOB_TIMEOUT_MS
    )
  );

  try {
    const report = await Promise.race([
      MasterPipeline.run({ jobId, seed, ...input }),
      timeoutPromise,
    ]);

    settled = true;
    await setJobState(jobId, {
      status: "completed",
      data: report,
    });
  } catch (err) {
    if (settled) {
      // El job completó pero el callback del timeout disparó tarde. Ignorar.
      console.warn(`[job_queue] Job ${jobId}: timeout disparado post-completion, ignorando`);
      return;
    }
    settled = true;
    const message = err instanceof Error ? err.message : "Unknown pipeline error";
    console.error(`[job_queue] Job ${jobId} failed:`, message);

    // This write must happen before Vercel kills the lambda.
    // At 2.5 min timeout + ~1s for this write, we have ~147s margin under 300s limit.
    await setJobState(jobId, {
      status: "failed",
      error: message,
    });
  }
}

async function setJobState(
  jobId: string,
  patch: Partial<JobRecord>
): Promise<void> {
  const existing = await getJob(jobId);
  const updated: JobRecord = {
    ...(existing ?? { status: "failed", createdAt: Date.now(), seed: "" }),
    ...patch,
  };
  await redis.set(`job:${jobId}`, JSON.stringify(updated), { ex: JOB_TTL_SECONDS });
}
