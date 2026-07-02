import { db } from './storage';
import { CF_MODELS } from './sub_agents';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: any;
}

export async function addMessage(role: 'user' | 'assistant' | 'system', content: string) {
    try {
        await db.collection('messages').add({
            role,
            content,
            timestamp: new Date()
        });

        // Lógica de Compresión Asíncrona (se ejecuta en background sin bloquear)
        setTimeout(() => triggerCompaction(), 100);
    } catch (error) {
        console.error('Local addMessage error:', error);
    }
}

let isCompacting = false;
async function triggerCompaction() {
    if (isCompacting) return;
    try {
        isCompacting = true;
        const snap = await db.collection('messages').get(); // Get ALL messages from mock

        if (snap.size <= 15) {
            isCompacting = false;
            return;
        }

        console.log(`[Memory] Starting compaction of ${snap.size} messages...`);
        // Sort chronologically (oldest first)
        const allDocs = [...snap.docs].sort((a: any, b: any) => {
            const dateA = a.data().timestamp ? new Date(a.data().timestamp).getTime() : 0;
            const dateB = b.data().timestamp ? new Date(b.data().timestamp).getTime() : 0;
            return dateA - dateB;
        });

        // We keep the last 5 messages, compress the rest + previous summaries
        const docsToCompress = allDocs.slice(0, allDocs.length - 5);
        const textToCompress = docsToCompress.map(d => `${d.data().role.toUpperCase()}: ${d.data().content}`).join('\n');

        // Fetch previous summary if exists
        const sumSnap = await db.collection('memory_summaries').doc('global').get();
        let prevSummary = '';
        if (sumSnap.exists) {
            prevSummary = sumSnap.data()?.content || '';
        }

        const prompt = `INSTRUCCIÓN CRÍTICA: Debes comprimir y resumir la siguiente conversación. 
Retén CUALQUIER información personal del usuario, requerimientos de proyectos cruzados o preferencias.
Formato: Devuelve SOLO 2 o 3 párrafos densos enumerando todo el hilo y detalles. Nunca escribas código, solo qué código se produjo.

RESUMEN PREVIO: ${prevSummary ? prevSummary : "Ninguno."}

NUEVOS MENSAJES A COMPRIMIR:
${textToCompress}`;

        // Llamar a Cloudflare AI o Gemini (Fallback local si no tenemos env)
        const summary = await callSummarizer(prompt);
        if (summary) {
            // Guardar el nuevo resumen comprimido
            await db.collection('memory_summaries').doc('global').set({ content: summary, updated: new Date() });

            // Borrar los mensajes crudos comprimidos
            for (const doc of docsToCompress) {
                await db.collection('messages').doc(doc.id).delete();
            }
            console.log('[Memory] Compaction successful, messages archived.');
        }
    } catch (e) {
        console.error('[Memory] Compaction Error:', e);
    } finally {
        isCompacting = false;
    }
}

async function callSummarizer(prompt: string): Promise<string> {
    try {
        // Obtenemos Env de Node local
        const env = process.env;
        const cfAcc = env.CLOUDFLARE_ACCOUNT_ID;
        const cfEmail = env.CLOUDFLARE_EMAIL;
        const cfKey = env.CLOUDFLARE_GLOBAL_KEY;
        const geminiKey = env.GEMINI_KEY_1;

        if (cfAcc && cfKey) {
            // Usa el más barato para compactar (Granite-4.0-micro)
            const model = CF_MODELS['ultra_cheap'][0].model;
            const payload = { messages: [{ role: 'user', content: prompt }] };
            const headers = { 'Content-Type': 'application/json', 'X-Auth-Email': cfEmail || '', 'X-Auth-Key': cfKey };
            const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cfAcc}/ai/run/${model}`, { method: 'POST', headers, body: JSON.stringify(payload) });
            const d = await r.json();
            return d?.result?.response || '';
        } else if (geminiKey) {
            const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const d = await r.json();
            return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
    } catch (e) { console.error('Summarizer call err:', e); }
    return "Error generando resumen.";
}

export async function getHistory(limit: number = 8): Promise<any[]> {
    try {
        // Enviar el resumen compactado primero y luego los ultimos N mensajes literales
        const messages: any[] = [];
        const sumSnap = await db.collection('memory_summaries').doc('global').get();
        if (sumSnap.exists && sumSnap.data()?.content) {
            messages.push({
                role: 'system',
                content: `[MEMORIA A MEDIO PLAZO (RESUMIDO)] Lo que debes recordar del usuario y pasado: ${sumSnap.data()?.content}`
            });
        }

        const snap = await db.collection('messages').get();
        const allDocs = [...snap.docs];
        // Sort chronologically newest first
        allDocs.sort((a: any, b: any) => {
            const dateA = a.data().timestamp ? new Date(a.data().timestamp).getTime() : 0;
            const dateB = b.data().timestamp ? new Date(b.data().timestamp).getTime() : 0;
            return dateB - dateA; // Descending
        });

        const crudos = allDocs.slice(0, limit).reverse().map((docItem: any) => ({
            role: docItem.data().role,
            content: docItem.data().content
        }));

        return messages.concat(crudos);
    } catch (error) {
        console.error('Local getHistory error:', error);
        return [];
    }
}

export async function clearHistory() {
    // In-memory/Local JSON way
    const snap = await db.collection('messages').get();
    for (const doc of snap.docs) {
        await db.collection('messages').doc(doc.id).delete();
    }
}
