import { NextRequest, NextResponse } from 'next/server';
import { listSkills, installSkill, deleteSkill } from '@/lib/tools';
import { checkRateLimit, apiLimiter } from '@/lib/rate_limiter';
import { readJsonBody } from '@/lib/auth';

const MAX_SKILL_NAME = 100;
const MAX_SKILL_DESC = 500;
const SAFE_NAME_RE = /^[a-zA-Z0-9_\-. ]+$/;

export async function GET(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;
        const skills = await listSkills();
        return NextResponse.json({ skills });
    } catch (error) {
        console.error('[skills] GET error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const [body, bodyError] = await readJsonBody(req, 16 * 1024);
        if (bodyError) return bodyError;

        const b = (body ?? {}) as {
            name?: string;
            description?: string;
            mcpUri?: string;
            capabilities?: string[];
        };

        const name = (b.name ?? '').toString().trim();
        if (!name || name.length > MAX_SKILL_NAME || !SAFE_NAME_RE.test(name)) {
            return NextResponse.json(
                { error: 'Nombre de skill inválido' },
                { status: 400 }
            );
        }
        const description = (b.description ?? '').toString().substring(0, MAX_SKILL_DESC);
        const mcpUri = (b.mcpUri ?? '').toString().substring(0, 300);

        const skill = await installSkill({
            name,
            description,
            mcpUri,
            capabilities: Array.isArray(b.capabilities)
                ? b.capabilities.slice(0, 20).map(c => c.toString().substring(0, 50))
                : [],
        });
        return NextResponse.json({ skill });
    } catch (error) {
        console.error('[skills] POST error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        if (id.length > 200) return NextResponse.json({ error: 'ID demasiado largo' }, { status: 400 });
        await deleteSkill(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[skills] DELETE error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
