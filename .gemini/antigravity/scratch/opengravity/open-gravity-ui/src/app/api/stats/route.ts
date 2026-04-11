import { NextResponse } from 'next/server';
import { getAgentStats } from '@/lib/tools';

export async function GET() {
    try {
        const stats = await getAgentStats();
        return NextResponse.json(stats);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
