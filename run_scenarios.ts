import { runMonteCarlo, SimulationInput } from "./src/lib/simulation_runner";

const BASE: SimulationInput = {
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

const VIABLE: SimulationInput = {
  ...BASE,
  price: 99,
  baseCac: 40,
  churnRate: 0.02,
  initialCash: 100000,
  estimatedTAM: 500000,
  fixedOpEx: 3000,
};

const VIABLE_LEAN: SimulationInput = {
  ...BASE,
  fixedOpEx: 2000,
};

const INVIABLE: SimulationInput = {
  ...BASE,
  price: 9,
  baseCac: 150,
  initialCash: 10000,
  churnRate: 0.15,
};

const scenarios = [
  { name: "BASE (High OpEx)", input: BASE },
  { name: "VIABLE (Premium)", input: VIABLE },
  { name: "VIABLE_LEAN (Minimum OpEx)", input: VIABLE_LEAN },
  { name: "INVIABLE (Extreme Churn/Low Price)", input: INVIABLE }
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
