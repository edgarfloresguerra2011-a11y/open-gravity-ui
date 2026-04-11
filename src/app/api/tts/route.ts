import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

/**
 * Alice_Neural_Studio v3.5
 * Integramos Voces Gratuitas de Microsoft Azure Edge (¡Extrema calidad y sin API Keys!)
 */

export async function POST(req: NextRequest) {
    try {
        const { text, voice = 'es-CO-SalomeNeural' } = await req.json();
        console.log(`[TTS] Request received for text: "${text.substring(0, 50)}..." with voice: ${voice}`);

        // 1. Prioridad: Microsoft Edge Neural TTS
        try {
            const tts = new MsEdgeTTS();
            let selectedVoice = voice;

            // Mapeo selectivo para asegurar voces de alta calidad
            if (voice.includes('Salome')) selectedVoice = 'es-CO-SalomeNeural';
            if (voice.includes('Elvira')) selectedVoice = 'es-ES-ElviraNeural';
            if (voice === 'shimmer') selectedVoice = 'es-CO-SalomeNeural';

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
