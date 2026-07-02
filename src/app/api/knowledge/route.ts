import { NextRequest, NextResponse } from 'next/server';
import { saveKnowledge, searchKnowledge, getAllKnowledge, deleteKnowledge, updateKnowledge } from '@/lib/tools';
import { checkRateLimit, apiLimiter } from '@/lib/rate_limiter';
import { readJsonBody } from '@/lib/auth';

const MAX_QUERY_LENGTH = 500;
const MAX_CONTENT_LENGTH = 32 * 1024; // 32KB por entry de knowledge

export async function GET(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const query = req.nextUrl.searchParams.get('q');
        if (query) {
            if (query.length > MAX_QUERY_LENGTH) {
                return NextResponse.json({ error: 'Query demasiado larga' }, { status: 400 });
            }
            const results = await searchKnowledge(query);
            return NextResponse.json({ items: results });
        }
        const items = await getAllKnowledge();
        return NextResponse.json({ items });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const [body, bodyError] = await readJsonBody(req, MAX_CONTENT_LENGTH + 4 * 1024);
        if (bodyError) return bodyError;

        const b = (body ?? {}) as {
            title?: string;
            content?: string;
            tags?: string[];
            source?: string;
            importance?: string;
        };

        const title = (b.title ?? 'Untitled').toString().substring(0, 300);
        const content = (b.content ?? '').toString();
        if (content.length > MAX_CONTENT_LENGTH) {
            return NextResponse.json(
                { error: `Content demasiado grande (máx ${MAX_CONTENT_LENGTH})` },
                { status: 413 }
            );
        }
        // Sanitizar tags: máx 10 tags, cada una 50 chars
        const tags = Array.isArray(b.tags)
            ? b.tags.slice(0, 10).map(t => t.toString().substring(0, 50))
            : [];

        const entry = await saveKnowledge({
            title,
            content,
            tags,
            source: (b.source ?? 'user').toString() as 'user' | 'agent' | 'system',
            importance: (b.importance ?? 'medium').toString() as 'low' | 'medium' | 'high' | 'critical',
        });
        return NextResponse.json(entry);
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
        await deleteKnowledge(id);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const [body, bodyError] = await readJsonBody(req, MAX_CONTENT_LENGTH + 4 * 1024);
        if (bodyError) return bodyError;

        const b = (body ?? {}) as { id?: string };
        if (!b.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        if (b.id.length > 200) return NextResponse.json({ error: 'ID demasiado largo' }, { status: 400 });
        await updateKnowledge(b.id, b);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
