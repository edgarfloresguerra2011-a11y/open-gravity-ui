/**
 * OpenGravity V3 — Shared Types
 * Central type definitions consumed across the pipeline.
 */

// Core Payloads
export type { FinalPredictionReport } from './prediction_synthesizer';
export type { QuantPayload, PredictionCycleResult } from './ai_logic';

// Simulation Types
export type { SimulationResult, SimulationInput, PercentileStats } from './simulation_runner';

// Research Types
export type { DeepResearchResult } from './skill_executor';

// Persona Types
export type { MarketPersonas, ClientPersona } from './persona_generator';
