import { NextRequest, NextResponse } from 'next/server';
import { runDeepResearch } from '@/lib/skill_executor';

export const runtime = 'nodejs';
export const maxDuration = 60; // Mayor límite de timeout debido al paralelismo

export async function POST(req: NextRequest) {
    try {
        const { topic, context } = await req.json();

        if (!topic) {
            return NextResponse.json(
                { error: 'Se requiere el parámetro "topic" (tema a investigar).' },
                { status: 400 }
            );
        }

        console.log(`[DeepResearch API] Investigando: "${topic}" | Contexto: "${context || 'N/A'}"`);

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
                rawSynthesis:        research.rawSynthesis, // Síntesis 360 para que la lea el Engine LLM
            },
        });

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Error desconocido de red';
        console.error('[DeepResearch API] Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
