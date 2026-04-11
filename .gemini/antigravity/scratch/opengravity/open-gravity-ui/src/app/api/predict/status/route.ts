/**
 * OpenGravity V3 — GET /api/predict/status?jobId=X
 *
 * Changes from original:
 *   [+] Rate limiting (120 req/min per IP — polling-safe)
 *   [+] getJob now properly awaited (was sync call against async Redis)
 *   [+] jobId format validation
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, statusLimiter } from "@/lib/rate_limiter";
import { getJob } from "@/lib/job_queue";

export async function GET(req: NextRequest) {
  // ── 1. Rate limit ─────────────────────────────────────────────────────────
  const limited = await checkRateLimit(req, statusLimiter);
  if (limited) return limited;

  // ── 2. Validate jobId param ───────────────────────────────────────────────
  const jobId = req.nextUrl.searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId parameter" }, { status: 400 });
  }

  // UUID v4 format check — prevents probing with arbitrary strings
  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  // Note: If using job_ prefix, adjust regex. The latest predict route uses raw UUID.
  if (!UUID_REGEX.test(jobId)) {
    return NextResponse.json({ error: "Invalid jobId format" }, { status: 400 });
  }

  // ── 3. Fetch job from Redis (FIXED: properly awaited) ─────────────────────
  let job: any;
  try {
    job = await getJob(jobId);
  } catch (err) {
    console.error("[status] Redis fetch failed:", err);
    return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
  }

  if (!job) {
    return NextResponse.json({ error: "Job not found or expired" }, { status: 404 });
  }

  // ── 4. Return job state ───────────────────────────────────────────────────
  // Only return quantPayload + narrativePayload to keep payload lean.
  return NextResponse.json({
    success: true,
    jobId,
    status: job.status,
    ...(job.status === "completed" && {
      quantPayload: job.data?.quantPayload ?? null,
      narrativePayload: job.data?.narrativePayload ?? job.data ?? null,
    }),
    ...(job.status === "failed" && {
      error: job.error ?? "Simulation failed",
    }),
  });
}
