/**
 * OpenGravity V3 — POST /api/predict
 * FIX: Rate limiting applied before any pipeline work.
 * FIX: Security validation (dangerous patterns + prompt injection) integrated.
 *
 * Changes from original:
 *   [+] checkRateLimit guard at entry point
 *   [+] enqueuePredictionJob now awaited (was fire-and-forget sync bug)
 *   [+] Input validation before enqueue (Structural + Patterns)
 *   [+] Semantic validation (min 10 chars)
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { checkRateLimit, predictLimiter } from "@/lib/rate_limiter";
import { enqueuePredictionJob } from "@/lib/job_queue";
import { validateUserInput } from "@/lib/security";

export async function POST(req: NextRequest) {
  // ── 1. Rate limit check (must be first — before any compute) ──────────────
  const limited = await checkRateLimit(req, predictLimiter);
  if (limited) return limited;

  // ── 2. Parse & validate input ─────────────────────────────────────────────
  let body: { idea?: string; financials?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const idea = body.idea?.trim();

  // A. Semantic Validation
  if (!idea || typeof idea !== "string" || idea.length < 10) {
    return NextResponse.json(
      { error: "Field 'idea' is required and must be at least 10 characters." },
      { status: 422 }
    );
  }

  if (idea.length > 2000) {
    return NextResponse.json(
      { error: "Field 'idea' must not exceed 2000 characters." },
      { status: 422 }
    );
  }

  // B. Security Gate (Dangerous patterns & Prompt injection)
  const validation = validateUserInput(idea);
  if (!validation.safe) {
    console.warn(`[SECURITY] Blocked proposal: ${validation.reason}`);
    return NextResponse.json(
      { error: validation.reason },
      { status: 400 }
    );
  }

  // ── 3. Enqueue job (FIXED: properly awaited) ──────────────────────────────
  const jobId = randomUUID();

  try {
    // We pass the sanitized/validated idea
    await enqueuePredictionJob(jobId, {
      idea: idea,
      financials: body.financials ?? {},
    });
  } catch (err) {
    console.error("[predict] Failed to enqueue job:", err);
    return NextResponse.json(
      { error: "Failed to start simulation. Please try again." },
      { status: 503 }
    );
  }

  // ── 4. Return jobId immediately (frontend starts polling) ─────────────────
  return NextResponse.json({ jobId, status: "queued" }, { status: 202 });
}
