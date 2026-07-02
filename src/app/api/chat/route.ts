import { NextRequest, NextResponse } from 'next/server';
import { buildStreamPayload } from '@/lib/ai_logic';
import { checkRateLimit, chatLimiter } from '@/lib/rate_limiter';
import { validateUserInput } from '@/lib/security';
import { readJsonBody } from '@/lib/auth';

export const runtime = 'nodejs'; // Ensure Node.js runtime for streaming
export const maxDuration = 60;

interface ChatMessage {
    role: 'system' | 'assistant' | 'user' | 'tool';
    content: string;
}

const MAX_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 8000;

export async function POST(req: NextRequest) {
    try {
        // 1. Rate limit (FIX A1 — antes no tenía)
        const limited = await checkRateLimit(req, chatLimiter);
        if (limited) return limited;

        // 2. Body parse con límite de tamaño (anti-DoS)
        const [body, bodyError] = await readJsonBody(req, 256 * 1024); // 256KB max
        if (bodyError) return bodyError;

        const { messages } = (body ?? {}) as { messages?: ChatMessage[] };

        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "No messages provided" },
                { status: 400 }
            );
        }

        // 3. Validación de cada mensaje
        if (messages.length > MAX_MESSAGES) {
            return NextResponse.json(
                { error: `Demasiados mensajes (máx ${MAX_MESSAGES})` },
                { status: 413 }
            );
        }

        for (const m of messages) {
            if (!m || typeof m.content !== 'string' || m.content.length === 0) {
                return NextResponse.json(
                    { error: "Mensaje inválido (content vacío)" },
                    { status: 400 }
                );
            }
            if (m.content.length > MAX_MESSAGE_LENGTH) {
                return NextResponse.json(
                    { error: `Mensaje demasiado largo (máx ${MAX_MESSAGE_LENGTH} chars)` },
                    { status: 413 }
                );
            }
            // Validar el último mensaje del usuario contra patrones peligrosos
            if (m.role === 'user') {
                const validation = validateUserInput(m.content);
                if (!validation.safe) {
                    return NextResponse.json(
                        { error: validation.reason ?? "Input rechazado por seguridad" },
                        { status: 400 }
                    );
                }
            }
        }

        const { apiUrl, headers, body: upstreamBody, engine } = await buildStreamPayload(messages);

        // Call DeepSeek (or fallback) with stream: true
        const upstreamRes = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(upstreamBody),
        });

        if (!upstreamRes.ok || !upstreamRes.body) {
            const errText = await upstreamRes.text();
            console.error('UPSTREAM_ERROR:', upstreamRes.status, errText);
            // Return a non-streaming fallback error
            const errorPayload = `data: ${JSON.stringify({ content: "❌ Error del motor: " + errText.substring(0, 200), engine })}\n\ndata: [DONE]\n\n`;
            return new Response(errorPayload, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        }

        // Pipe the SSE stream directly from DeepSeek → Client
        const transformStream = new TransformStream({
            transform(chunk, controller) {
                controller.enqueue(chunk);
            },
        });

        const reader = upstreamRes.body.getReader();
        const writer = transformStream.writable.getWriter();

        // Pump data through
        (async () => {
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        // Send engine info as final SSE event
                        const encoder = new TextEncoder();
                        await writer.write(encoder.encode(`data: ${JSON.stringify({ engine })}\n\n`));
                        await writer.close();
                        break;
                    }
                    await writer.write(value);
                }
            } catch (e) {
                console.error('STREAM_PIPE_ERROR:', e);
                await writer.abort(e as Error);
            }
        })();

        return new Response(transformStream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        console.error('CHAT_API_ERROR:', message);
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}
