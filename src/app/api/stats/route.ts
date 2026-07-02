import { NextRequest, NextResponse } from 'next/server';
import { getAgentStats } from '@/lib/tools';
import { checkRateLimit, apiLimiter } from '@/lib/rate_limiter';

export async function GET(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;
        const stats = await getAgentStats();
        return NextResponse.json(stats);
    } catch (e: any) {
        console.error('[stats] error:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
