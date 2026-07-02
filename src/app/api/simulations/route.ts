import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, apiLimiter } from '@/lib/rate_limiter';
import { getOGSession, requireOGSession } from '@/lib/session';
import { listUserSimulations, checkSimulationQuota } from '@/lib/simulations';

/**
 * GET /api/simulations
 * Devuelve las simulaciones del usuario autenticado + info de quota.
 */
export async function GET(req: NextRequest) {
    const limited = await checkRateLimit(req, apiLimiter);
    if (limited) return limited;

    const [session, authError] = await requireOGSession();
    if (authError) return authError;

    try {
        const userId = session!.userId;
        const [simulations, quota] = await Promise.all([
            listUserSimulations(userId, 20),
            checkSimulationQuota(userId, session!.plan),
        ]);

        return NextResponse.json({
            simulations,
            quota: {
                used: quota.used,
                quota: quota.quota,
                remaining: quota.remaining,
                plan: session!.plan,
            },
        });
    } catch (e: any) {
        console.error('[simulations] GET error:', e.message);
        return NextResponse.json({ error: 'Failed to fetch simulations' }, { status: 500 });
    }
}
