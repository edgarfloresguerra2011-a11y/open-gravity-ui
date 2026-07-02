import { NextRequest, NextResponse } from 'next/server';
import { runDeepResearch } from '@/lib/skill_executor';
import { checkRateLimit, researchLimiter } from '@/lib/rate_limiter';
import { validateUserInput } from '@/lib/security';
import { readJsonBody } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 60; // Mayor límite de timeout debido al paralelismo

const MAX_TOPIC_LENGTH = 300;
const MAX_CONTEXT_LENGTH = 2000;

export async function POST(req: NextRequest) {
    try {
        // 1. Rate limit (FIX A1) — muy estricto porque cada request dispara 5 crawlers
        const limited = await checkRateLimit(req, researchLimiter);
        if (limited) return limited;

        // 2. Body parse con límite de tamaño
        const [body, bodyError] = await readJsonBody(req, 16 * 1024); // 16KB max
        if (bodyError) return bodyError;

        const { topic, context } = (body ?? {}) as { topic?: string; context?: string };

        if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
            return NextResponse.json(
                { error: 'Se requiere el parámetro "topic" (mínimo 3 caracteres).' },
                { status: 400 }
            );
        }
        if (topic.length > MAX_TOPIC_LENGTH) {
            return NextResponse.json(
                { error: `"topic" no puede exceder ${MAX_TOPIC_LENGTH} caracteres.` },
                { status: 413 }
            );
        }
        if (context && context.length > MAX_CONTEXT_LENGTH) {
            return NextResponse.json(
                { error: `"context" no puede exceder ${MAX_CONTEXT_LENGTH} caracteres.` },
                { status: 413 }
            );
        }

        // 3. Security gate (FIX — antes no validaba)
        const validation = validateUserInput(topic + ' ' + (context ?? ''));
        if (!validation.safe) {
            return NextResponse.json(
                { error: validation.reason ?? "Input rechazado" },
                { status: 400 }
            );
        }

        console.log(`[DeepResearch API] Investigando: "${topic.substring(0, 80)}" | Contexto: "${(context || 'N/A').substring(0, 80)}"`);

        // FASE 1: Research Agent — 5 ángulos de investigación paralelos
        const research = await runDeepResearch(topic, context || "");

        // FASE 2: Retorno estructurado al orquestador o frontend
        return NextResponse.json({
            success: true,
            topic,
            context,
            research: {
                totalSourcesProcessed: [
                    research.overview,
                    research.trends,
                    research.keyPlayers,
                    research.dataMetrics,
                    research.challenges,
                ].reduce((acc, r) => acc + r.sources.length, 0),
                searchTimeMs: research.totalSearchTime,
                topOverviewSources:  research.overview.sources.slice(0, 3),
                topMetricsSources:   research.dataMetrics.sources.slice(0, 3),
                topTrendsSources:    research.trends.sources.slice(0, 3),
                rawSynthesis:        research.rawSynthesis,
            },
        });

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Error desconocido de red';
        console.error('[DeepResearch API] Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
