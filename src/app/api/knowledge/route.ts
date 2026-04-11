import { NextRequest, NextResponse } from 'next/server';
import { saveKnowledge, searchKnowledge, getAllKnowledge, deleteKnowledge, updateKnowledge } from '@/lib/tools';

export async function GET(req: NextRequest) {
    try {
        const query = req.nextUrl.searchParams.get('q');
        if (query) {
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
        const body = await req.json();
        const entry = await saveKnowledge({
            title: body.title || 'Untitled',
            content: body.content,
            tags: body.tags || [],
            source: body.source || 'user',
            importance: body.importance || 'medium'
        });
        return NextResponse.json(entry);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        await deleteKnowledge(id);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        await updateKnowledge(body.id, body);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
