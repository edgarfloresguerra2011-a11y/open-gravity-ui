import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';
import { checkRateLimit, apiLimiter } from '@/lib/rate_limiter';

/**
 * Health check real — verifica el estado de las dependencias críticas.
 *
 * Devuelve:
 *   200 OK si todo bien
 *   503 si alguna dependencia falla
 *
 * No exponer secrets — solo booleans.
 */
export async function GET(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const checks: Record<string, boolean | string> = {};

        // 1. Redis (Upstash) — write+read probe
        try {
            await db.collection('health_probe').doc('ping').set({
                ts: Date.now(),
            });
            const doc = await db.collection('health_probe').doc('ping').get();
            checks.redis = doc.exists;
        } catch (e: any) {
            checks.redis = `error: ${e.message.substring(0, 80)}`;
        }

        // 2. Variables de entorno críticas (boolean, no exponer valor)
        const required = [
            'DEEPSEEK_API_KEY',
            'TAVILY_API_KEY',
            'UPSTASH_REDIS_REST_URL',
            'UPSTASH_REDIS_REST_TOKEN',
            'CRON_SECRET',
        ];
        for (const key of required) {
            checks[`env_${key}`] = !!process.env[key];
        }

        const allOk = Object.values(checks).every(v => v === true);

        return NextResponse.json(
            {
                status: allOk ? 'ok' : 'degraded',
                timestamp: new Date().toISOString(),
                checks,
            },
            { status: allOk ? 200 : 503 }
        );
    } catch (e: any) {
        console.error('[health] error:', e);
        return NextResponse.json(
            { status: 'error', error: e.message },
            { status: 500 }
        );
    }
}
