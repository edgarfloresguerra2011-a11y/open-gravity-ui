/**
 * OpenGravity V3 — Simulation Runner (Monte Carlo Core)
 *
 * Fixes applied:
 *   [+] Price no longer deduced as "5% of avg wealth" — comes from user input / Fase 1
 *   [+] Market sample scaled to TAM — no more 8-20 person volatility
 *   [+] Elasticity sign enforced (must be negative — economics 101)
 *   [+] Log CAC saturation threshold derived from TAM, not hardcoded 1000
 *   [+] Shock range dynamically linked to Trust Score (was hardcoded ±10%)
 *   [+] P10/P50/P90 computed across all 1000 runs, not just last run
 */

import { createHash } from "crypto";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SimulationInput {
  jobId: string;
  seed: string;
  price: number;                  // FIX: from user input, not deduced
  baseCac: number;
  fixedOpEx: number;
  initialCash: number;
  estimatedTAM: number;
  marketRefPrice: number;         // Competitor reference price from Fase 1
  elasticity: number;             // Must be < 0; enforced below
  churnRate: number;
  conversionRate: number;
  researchTrustScore: number;     // Drives shock range
  horizonMonths?: number;
}

export interface PercentileStats {
  p10: number;
  p50: number;
  p90: number;
}

export interface SimulationResult {
  ltv: PercentileStats;
  cac: PercentileStats;
  drawdown: PercentileStats;
  bankruptcyRate: number;
  breakEvenMonth: number;         // Median break-even
  iterationsRun: number;
  seed: string;
  inputs: SimulationInput;        // Persist inputs for auditing/synthesis
}

// ─── PRNG (Mulberry32 — deterministic, auditable) ─────────────────────────────

function mulberry32(seedHex: string): () => number {
  // Convert first 8 hex chars to a 32-bit integer seed
  let a = parseInt(seedHex.slice(0, 8), 16);
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Percentile calculator ────────────────────────────────────────────────────

function percentile(sorted: number[], p: number): number {
  const idx = Math.floor((p / 100) * (sorted.length - 1));
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
}

function toStats(values: number[]): PercentileStats {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    p10: Math.round(percentile(sorted, 10)),
    p50: Math.round(percentile(sorted, 50)),
    p90: Math.round(percentile(sorted, 90)),
  };
}

// ─── Core runner ─────────────────────────────────────────────────────────────

export function runMonteCarlo(input: SimulationInput): SimulationResult {
  const {
    price,
    baseCac,
    fixedOpEx,
    initialCash,
    estimatedTAM,
    marketRefPrice,
    churnRate,
    conversionRate,
    researchTrustScore,
    horizonMonths = 24,
    seed,
  } = input;

  // ── Elasticity guard (FIX: must be negative) ──────────────────────────────
  const elasticity = input.elasticity < 0 ? input.elasticity : -Math.abs(input.elasticity);

  // ── Shock range linked to Trust Score (FIX: was hardcoded ±10%) ──────────
  // trust=1.0 → shock=±3%  |  trust=0.2 → shock=±24%
  const shockAmplitude = 0.03 + (1 - researchTrustScore) * (0.24 - 0.03);

  // ── PRNG seeded from jobId ────────────────────────────────────────────────
  const prng = mulberry32(seed);

  // ── Market sample size scaled to TAM (FIX: was 8-20, causing volatility) ──
  // Use 0.01% of TAM as sample, clamped between 500 and 50,000 agents
  const sampleSize = Math.min(50_000, Math.max(500, Math.floor(estimatedTAM * 0.0001)));

  // ── CAC saturation threshold from TAM (FIX: was magic number 1000) ────────
  // CAC starts scaling when we've hit 5% of addressable market
  const saturationThreshold = estimatedTAM * 0.05;

  // ── Simulation collections ─────────────────────────────────────────────────
  const ITERATIONS = 1000;
  const ltvRuns: number[] = [];
  const cacRuns: number[] = [];
  const drawdownRuns: number[] = [];
  let bankruptcyCount = 0;
  const breakEvenMonths: number[] = [];

  for (let i = 0; i < ITERATIONS; i++) {
    let cash = initialCash;
    let users = 0;
    let peakCash = initialCash;
    let maxDrawdown = 0;
    let breakEvenMonth = -1;
    let totalRevenue = 0;
    let totalCacSpend = 0;
    let bankrupt = false;

    for (let month = 1; month <= horizonMonths; month++) {
      // Macro shock for this month
      const shock = 1.0 + (prng() - 0.5) * 2 * shockAmplitude;

      // Demand with price elasticity
      const demandMultiplier =
        Math.pow(price / marketRefPrice, elasticity) * shock;

      // Log-scale CAC saturation (FIX: uses TAM-derived threshold)
      const currentCac =
        baseCac * (1.0 + Math.log10(1 + users / saturationThreshold));

      // New users this month
      const potentialReach = sampleSize * conversionRate * demandMultiplier;
      const newUsers = Math.max(0, Math.round(potentialReach));
      users = Math.max(0, users + newUsers - Math.round(users * churnRate));

      // Financials
      const revenue = users * price;
      const acquisitionCost = newUsers * currentCac;
      const burn = fixedOpEx + acquisitionCost;
      const netCashflow = revenue - burn;
      cash += netCashflow;
      totalRevenue += revenue;
      totalCacSpend += acquisitionCost;

      // Break-even detection
      if (breakEvenMonth === -1 && netCashflow > 0) {
        breakEvenMonth = month;
      }

      // Drawdown tracking
      if (cash > peakCash) peakCash = cash;
      const drawdown = peakCash - cash;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;

      // Bankruptcy
      if (cash < 0) {
        bankruptcyCount++;
        bankrupt = true;
        break;
      }
    }

    // Record run metrics
    const avgCac = users > 0 ? totalCacSpend / Math.max(users, 1) : baseCac;
    const ltv = users > 0 ? (totalRevenue / users) * (1 / churnRate) : 0;

    ltvRuns.push(Math.round(ltv));
    cacRuns.push(Math.round(avgCac));
    drawdownRuns.push(Math.round(maxDrawdown));
    if (!bankrupt && breakEvenMonth !== -1) {
      breakEvenMonths.push(breakEvenMonth);
    }
  }

  // Median break-even (from successful runs only)
  const sortedBE = [...breakEvenMonths].sort((a, b) => a - b);
  const medianBE =
    sortedBE.length > 0
      ? sortedBE[Math.floor(sortedBE.length / 2)]
      : horizonMonths; // didn't break even in any successful run

  return {
    ltv: toStats(ltvRuns),
    cac: toStats(cacRuns),
    drawdown: toStats(drawdownRuns),
    bankruptcyRate: bankruptcyCount / ITERATIONS,
    breakEvenMonth: medianBE,
    iterationsRun: ITERATIONS,
    seed,
    inputs: input,
  };
}
