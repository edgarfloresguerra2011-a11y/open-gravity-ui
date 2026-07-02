import { NextRequest, NextResponse } from 'next/server';
import { saveFile, readFile, listFiles, deleteFile, updateFile } from '@/lib/tools';
import { checkRateLimit, apiLimiter } from '@/lib/rate_limiter';
import { readJsonBody } from '@/lib/auth';

const MAX_FILE_CONTENT = 256 * 1024; // 256KB
const MAX_FILENAME_LENGTH = 200;
const SAFE_FILENAME_RE = /^[a-zA-Z0-9_\-. ]+$/;

export async function GET(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const id = req.nextUrl.searchParams.get('id');
        if (id) {
            if (id.length > 200) {
                return NextResponse.json({ error: 'ID demasiado largo' }, { status: 400 });
            }
            const file = await readFile(id);
            if (!file) return NextResponse.json({ error: 'File not found' }, { status: 404 });
            return NextResponse.json(file);
        }
        const dir = req.nextUrl.searchParams.get('path') || '/';
        if (dir.length > 200) {
            return NextResponse.json({ error: 'Path demasiado largo' }, { status: 400 });
        }
        const files = await listFiles(dir);
        return NextResponse.json({ files });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const [body, bodyError] = await readJsonBody(req, MAX_FILE_CONTENT + 8 * 1024);
        if (bodyError) return bodyError;

        const b = (body ?? {}) as {
            name?: string;
            path?: string;
            content?: string;
            mimeType?: string;
        };

        const name = (b.name ?? 'untitled.txt').toString();
        if (name.length > MAX_FILENAME_LENGTH) {
            return NextResponse.json({ error: 'Filename demasiado largo' }, { status: 400 });
        }
        // Path traversal protection: solo permitir nombre seguro
        if (!SAFE_FILENAME_RE.test(name)) {
            return NextResponse.json(
                { error: 'Filename contiene caracteres no permitidos' },
                { status: 400 }
            );
        }
        const content = b.content ?? '';
        if (content.length > MAX_FILE_CONTENT) {
            return NextResponse.json(
                { error: `Contenido demasiado grande (máx ${MAX_FILE_CONTENT} bytes)` },
                { status: 413 }
            );
        }

        const result = await saveFile(
            name,
            (b.path ?? '/').toString().substring(0, 200),
            content,
            (b.mimeType ?? 'text/plain').toString().substring(0, 100)
        );
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const [body, bodyError] = await readJsonBody(req, MAX_FILE_CONTENT + 8 * 1024);
        if (bodyError) return bodyError;

        const b = (body ?? {}) as { id?: string; content?: string };
        if (!b.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        if (b.id.length > 200) {
            return NextResponse.json({ error: 'ID demasiado largo' }, { status: 400 });
        }
        if (typeof b.content !== 'string' || b.content.length > MAX_FILE_CONTENT) {
            return NextResponse.json(
                { error: `Content inválido o demasiado grande (máx ${MAX_FILE_CONTENT})` },
                { status: 400 }
            );
        }
        await updateFile(b.id, b.content);
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
        if (id.length > 200) {
            return NextResponse.json({ error: 'ID demasiado largo' }, { status: 400 });
        }
        await deleteFile(id);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
