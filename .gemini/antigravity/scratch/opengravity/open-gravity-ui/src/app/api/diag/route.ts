import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    // LLAVES HARDCODEADAS PARA PRUEBA REAL
    const cfAcc = "faf93cd2a0d373573de88591bcc95323";
    const cfTok = "WNdzigd4NGha4SbQ4b1ZEn1bO9axJkfs67krrgyn";

    const tests = [
        { name: "Workers AI (Llama test)", model: "@cf/meta/llama-3-8b-instruct", payload: { messages: [{ role: 'user', content: 'hi' }] } },
        { name: "Workers AI (Speech test)", model: "@cf/deepgram/aura-2-es", payload: { text: "hola" } },
        { name: "Workers AI (MeloTTS test)", model: "@cf/myshell-ai/melotts", payload: { text: "hola", lang: "es" } }
    ];

    const results = [];

    for (const test of tests) {
        try {
            const start = Date.now();
            const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cfAcc}/ai/run/${test.model}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${cfTok}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(test.payload)
            });
            const success = res.ok;
            const resData = await res.text();

            results.push({
                test: test.name,
                model: test.model,
                status: res.status,
                ok: success,
                type: res.headers.get('content-type'),
                response_sample: resData.substring(0, 200),
                latency: `${Date.now() - start}ms`
            });
        } catch (e: any) {
            results.push({ test: test.name, error: e.message });
        }
    }

    return NextResponse.json({
        timestamp: new Date().toISOString(),
        account: cfAcc,
        token_preview: cfTok.substring(0, 5) + "...",
        results
    });
}
