// Standalone Simulation Runner for Scenarios
import { createHash } from "crypto";

function mulberry32(seedHex) {
  let a = parseInt(seedHex.slice(0, 8), 16);
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function percentile(sorted, p) {
  const idx = Math.floor((p / 100) * (sorted.length - 1));
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
}

function toStats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    p10: Math.round(percentile(sorted, 10)),
    p50: Math.round(percentile(sorted, 50)),
    p90: Math.round(percentile(sorted, 90)),
  };
}

function runMonteCarlo(input) {
  const { price, baseCac, fixedOpEx, initialCash, estimatedTAM, marketRefPrice, churnRate, conversionRate, researchTrustScore, horizonMonths = 24, seed } = input;
  const elasticity = input.elasticity < 0 ? input.elasticity : -Math.abs(input.elasticity);
  const shockAmplitude = 0.03 + (1 - researchTrustScore) * (0.24 - 0.03);
  const prng = mulberry32(seed);
  const sampleSize = Math.min(50_000, Math.max(500, Math.floor(estimatedTAM * 0.0001)));
  const saturationThreshold = estimatedTAM * 0.05;

  const ITERATIONS = 1000;
  const ltvRuns = [];
  const cacRuns = [];
  const drawdownRuns = [];
  let bankruptcyCount = 0;
  const breakEvenMonths = [];

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
      const shock = 1.0 + (prng() - 0.5) * 2 * shockAmplitude;
      const demandMultiplier = Math.pow(price / marketRefPrice, elasticity) * shock;
      const currentCac = baseCac * (1.0 + Math.log10(1 + users / saturationThreshold));
      const potentialReach = sampleSize * conversionRate * demandMultiplier;
      const newUsers = Math.max(0, Math.round(potentialReach));
      users = Math.max(0, users + newUsers - Math.round(users * churnRate));
      const revenue = users * price;
      const acquisitionCost = newUsers * currentCac;
      const burn = fixedOpEx + acquisitionCost;
      const netCashflow = revenue - burn;
      cash += netCashflow;
      totalRevenue += revenue;
      totalCacSpend += acquisitionCost;
      if (breakEvenMonth === -1 && netCashflow > 0) breakEvenMonth = month;
      if (cash > peakCash) peakCash = cash;
      const drawdown = peakCash - cash;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
      if (cash < 0) { bankruptcyCount++; bankrupt = true; break; }
    }
    const avgCac = users > 0 ? totalCacSpend / Math.max(users, 1) : baseCac;
    const ltv = users > 0 ? (totalRevenue / users) * (1 / churnRate) : 0;
    ltvRuns.push(Math.round(ltv));
    cacRuns.push(Math.round(avgCac));
    drawdownRuns.push(Math.round(maxDrawdown));
    if (!bankrupt && breakEvenMonth !== -1) breakEvenMonths.push(breakEvenMonth);
  }
  const sortedBE = [...breakEvenMonths].sort((a, b) => a - b);
  const medianBE = sortedBE.length > 0 ? sortedBE[Math.floor(sortedBE.length / 2)] : horizonMonths;

  return { ltv: toStats(ltvRuns), cac: toStats(cacRuns), drawdown: toStats(drawdownRuns), bankruptcyRate: bankruptcyCount / ITERATIONS, breakEvenMonth: medianBE, iterationsRun: ITERATIONS };
}

// ─── Scenarios ──────────────────────────────────────────────────────────────

const BASE = {
  jobId: "test-job-001",
  seed: "a1b2c3d4e5f60000",
  price: 49,
  baseCac: 38,
  fixedOpEx: 8200,   
  initialCash: 50000,
  estimatedTAM: 200000,
  marketRefPrice: 45,
  elasticity: -1.3,
  churnRate: 0.051,
  conversionRate: 0.024,
  researchTrustScore: 0.84,
  horizonMonths: 24,
};

const VIABLE = {
  ...BASE,
  price: 99,
  baseCac: 40,
  churnRate: 0.02,
  initialCash: 100000,
  estimatedTAM: 500000,
  fixedOpEx: 3000,
};

const VIABLE_LEAN = {
  ...BASE,
  fixedOpEx: 2000,
};

const scenarios = [
  { name: "BASE (High OpEx)", input: BASE },
  { name: "VIABLE (Premium)", input: VIABLE },
  { name: "VIABLE_LEAN (Minimum OpEx)", input: VIABLE_LEAN }
];

console.log("=== OpenGravity V3 Simulation Results ===\n");

scenarios.forEach(s => {
  const r = runMonteCarlo(s.input);
  console.log(`SCENARIO: ${s.name}`);
  console.log(`  - Bankruptcy Rate: ${(r.bankruptcyRate * 100).toFixed(1)}%`);
  console.log(`  - Median Break-even: ${r.breakEvenMonth} months`);
  console.log(`  - LTV (P50): $${r.ltv.p50}`);
  console.log(`  - CAC (P50): $${r.cac.p50}`);
  console.log(`  - LTV/CAC Ratio: ${(r.ltv.p50 / Math.max(r.cac.p50, 1)).toFixed(2)}x`);
  console.log(`  - Max Drawdown (P50): $${r.drawdown.p50}`);
  console.log("------------------------------------------");
});
