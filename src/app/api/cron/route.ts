import { NextRequest, NextResponse } from 'next/server';
import { createCronJob, listCronJobs, toggleCronJob, deleteCronJob, markCronJobRun } from '@/lib/tools';
import { checkRateLimit, apiLimiter } from '@/lib/rate_limiter';
import { readJsonBody } from '@/lib/auth';

const MAX_NAME = 100;
const MAX_DESC = 500;
const MAX_ACTION = 2000;
const SAFE_NAME_RE = /^[a-zA-Z0-9_\-. ]+$/;

export async function GET(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;
        const jobs = await listCronJobs();
        return NextResponse.json({ jobs });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const [body, bodyError] = await readJsonBody(req, 8 * 1024);
        if (bodyError) return bodyError;

        const b = (body ?? {}) as {
            name?: string;
            description?: string;
            schedule?: string;
            action?: string;
            enabled?: boolean;
        };

        const name = (b.name ?? 'Untitled Job').toString();
        if (!SAFE_NAME_RE.test(name) || name.length > MAX_NAME) {
            return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 });
        }

        const job = await createCronJob({
            name,
            description: (b.description ?? '').toString().substring(0, MAX_DESC),
            schedule: (b.schedule ?? 'daily').toString().substring(0, 50),
            action: (b.action ?? '').toString().substring(0, MAX_ACTION),
            enabled: b.enabled !== false,
        });
        return NextResponse.json(job);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const [body, bodyError] = await readJsonBody(req, 8 * 1024);
        if (bodyError) return bodyError;

        const b = (body ?? {}) as { id?: string; action?: string; enabled?: boolean; result?: string };
        if (!b.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        if (b.id.length > 200) return NextResponse.json({ error: 'ID demasiado largo' }, { status: 400 });

        if (b.action === 'toggle') {
            await toggleCronJob(b.id, b.enabled === true);
        } else if (b.action === 'run') {
            const result = (b.result ?? 'Executed').toString().substring(0, 1000);
            await markCronJobRun(b.id, result);
        } else {
            return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
        }
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const id = req.nextUrl.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        if (id.length > 200) return NextResponse.json({ error: 'ID demasiado largo' }, { status: 400 });
        await deleteCronJob(id);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
