import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { checkRateLimit, ttsLimiter } from '@/lib/rate_limiter';
import { readJsonBody } from '@/lib/auth';

/**
 * Alice_Neural_Studio v3.5
 * Integramos Voces Gratuitas de Microsoft Azure Edge (¡Extrema calidad y sin API Keys!)
 */

const MAX_TTS_TEXT_LENGTH = 1000;
const ALLOWED_VOICES = new Set([
    'es-CO-SalomeNeural',
    'es-ES-ElviraNeural',
    'es-MX-DaliaNeural',
    'es-AR-ElenaNeural',
    'es-CL-CatalinaNeural',
]);

export async function POST(req: NextRequest) {
    try {
        // 1. Rate limit (FIX A1)
        const limited = await checkRateLimit(req, ttsLimiter);
        if (limited) return limited;

        // 2. Body parse con límite
        const [body, bodyError] = await readJsonBody(req, 16 * 1024);
        if (bodyError) return bodyError;

        const { text, voice = 'es-CO-SalomeNeural' } = (body ?? {}) as {
            text?: string;
            voice?: string;
        };

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json({ error: "Texto requerido" }, { status: 400 });
        }
        if (text.length > MAX_TTS_TEXT_LENGTH) {
            return NextResponse.json(
                { error: `Texto demasiado largo (máx ${MAX_TTS_TEXT_LENGTH} caracteres)` },
                { status: 413 }
            );
        }
        // Validate voice against allowlist (FIX: prevención de SSRF/parameter injection)
        const selectedVoice = ALLOWED_VOICES.has(voice) ? voice : 'es-CO-SalomeNeural';

        console.log(`[TTS] Request: "${text.substring(0, 50)}..." voice=${selectedVoice}`);

        // 1. Prioridad: Microsoft Edge Neural TTS
        try {
            const tts = new MsEdgeTTS();
            await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
            const { audioStream } = tts.toStream(text);

            // Convertimos el stream a Buffer para evitar problemas de streaming en Vercel Serverless
            const chunks: Uint8Array[] = [];

            const audioBuffer = await new Promise<Buffer>((resolve, reject) => {
                audioStream.on('data', (chunk) => chunks.push(chunk));
                audioStream.on('end', () => resolve(Buffer.concat(chunks)));
                audioStream.on('error', (err) => {
                    console.error("[TTS] Stream Error:", err);
                    reject(err);
                });
                // Timeout de seguridad de 15 segundos (más robusto para redes lentas)
                setTimeout(() => reject(new Error("TTS Timeout - Microsoft Edge is slow")), 15000);
            });

            console.log(`[TTS] Success. Buffer size: ${audioBuffer.length} bytes`);

            if (audioBuffer.length === 0) {
                throw new Error("Empty audio buffer generated");
            }

            return new NextResponse(new Uint8Array(audioBuffer), {
                headers: {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': audioBuffer.length.toString(),
                    'Cache-Control': 'no-store'
                },
            });

        } catch (e: unknown) {
            const err = e as Error;
            console.error("[TTS] Edge TTS failed:", err.message);
        }

        // 2. Fallback: OpenAI TTS
        const openAiKey = process.env.OPENAI_API_KEY;
        if (openAiKey) {
            console.log("[TTS] Falling back to OpenAI...");
            const response = await fetch('https://api.openai.com/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openAiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'tts-1',
                    input: text,
                    voice: 'nova',
                }),
            });

            if (response.ok) {
                const audioBuffer = await response.arrayBuffer();
                return new NextResponse(audioBuffer, {
                    headers: { 'Content-Type': 'audio/mpeg' },
                });
            }
        }

        return NextResponse.json({ error: "No neural engine available" }, { status: 503 });

    } catch (error: unknown) {
        const err = error as Error;
        console.error("[TTS] Fatal error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
