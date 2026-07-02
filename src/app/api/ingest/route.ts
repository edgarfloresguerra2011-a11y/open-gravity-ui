/**
 * OpenGravity v10 — Unified Ingestion API
 * Permite que scripts externos (ej: Lead Sniper worker) inyecten datos al Knowledge Graph.
 *
 * FIX DE SEGURIDAD: Ahora requiere API key (X-API-Key header).
 * El worker externo debe enviar OG_API_KEY en cada request.
 */

import { NextRequest, NextResponse } from 'next/server';
import { injectLeadAsNode, injectFileAsNode } from '@/lib/knowledge_graph';
import { checkRateLimit, apiLimiter } from '@/lib/rate_limiter';
import { requireApiKey, readJsonBody } from '@/lib/auth';

const MAX_INGEST_SIZE = 64 * 1024; // 64KB

export async function POST(req: NextRequest) {
    try {
        // 1. Rate limit
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        // 2. API key auth (FIX — antes era completamente pública)
        const authError = requireApiKey(req);
        if (authError) return authError;

        // 3. Body parse con límite
        const [body, bodyError] = await readJsonBody(req, MAX_INGEST_SIZE);
        if (bodyError) return bodyError;

        const { type, data } = (body ?? {}) as { type?: string; data?: unknown };
        if (!type || !data) {
            return NextResponse.json(
                { success: false, error: "Se requiere 'type' y 'data'." },
                { status: 400 }
            );
        }

        console.log(`[INGEST] Recibida carga útil: ${type}`);

        if (type === 'lead') {
            await injectLeadAsNode(data as { email: string; topic: string; source: string; timestamp: string });
            return NextResponse.json({ success: true, message: "Lead inyectado." });
        }

        if (type === 'file') {
            await injectFileAsNode(data as { name: string; path: string; mime: string; size: number; content_preview?: string });
            return NextResponse.json({ success: true, message: "Archivo/Asset inyectado." });
        }

        return NextResponse.json(
            { success: false, error: "Tipo no soportado. Use 'lead' o 'file'." },
            { status: 400 }
        );

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Error desconocido';
        console.error('[INGEST] Error:', message);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
