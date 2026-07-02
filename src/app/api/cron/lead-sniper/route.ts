import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';
import { requireCronAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

/**
 * Lead Sniper Cron Job — Endpoint de registro y orquestación.
 *
 * FIX CRÍTICO DE SEGURIDAD:
 *   La versión anterior ejecutaba `child_process.exec('python ...')` en un script
 *   fuera del repo (`../lead_sniper_tax_software.py`). Esto causaba dos problemas:
 *     1. Shell injection vía prompt → RCE
 *     2. Path inexistente en Vercel serverless (.. fuera de /var/task/)
 *
 *   Esta nueva versión solo funciona como endpoint de orquestación.
 *   El scraping real debe correr en un worker dedicado (Railway, Render,
 *   Cloud Run) y reportar resultados vía POST /api/ingest.
 *
 *   Para activar el disparo del worker externo, configurar LEAD_SNIPER_WEBHOOK_URL.
 */
export async function GET(req: NextRequest) {
    try {
        // 1. Auth — denegar por defecto
        const authError = requireCronAuth(req);
        if (authError) return authError;

        console.log('[Cron] Lead Sniper trigger recibido');

        // 2. Si hay webhook configurado, disparar el worker externo
        const webhookUrl = process.env.LEAD_SNIPER_WEBHOOK_URL;
        const webhookToken = process.env.LEAD_SNIPER_WEBHOOK_TOKEN;

        if (webhookUrl) {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 30_000);

                const res = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(webhookToken ? { 'Authorization': `Bearer ${webhookToken}` } : {}),
                    },
                    body: JSON.stringify({ trigger: 'lead_sniper', timestamp: Date.now() }),
                    signal: controller.signal,
                });
                clearTimeout(timeout);

                if (!res.ok) {
                    throw new Error(`Webhook responded ${res.status}`);
                }

                await db.collection('cron_jobs').add({
                    name: 'Lead Sniper LLC/Software',
                    type: 'lead_scraping',
                    status: 'dispatched',
                    timestamp: new Date(),
                });

                return NextResponse.json({
                    success: true,
                    message: 'Lead Sniper disparado en worker externo',
                });
            } catch (err: any) {
                await db.collection('cron_jobs').add({
                    name: 'Lead Sniper LLC/Software',
                    type: 'lead_scraping',
                    status: 'webhook_failed',
                    error: err.message,
                    timestamp: new Date(),
                });
                return NextResponse.json(
                    { error: `Webhook falló: ${err.message}` },
                    { status: 502 }
                );
            }
        }

        // 3. Sin webhook configurado — registrar como no-op
        await db.collection('cron_jobs').add({
            name: 'Lead Sniper LLC/Software',
            type: 'lead_scraping',
            status: 'skipped_no_webhook',
            timestamp: new Date(),
            note: 'Configurar LEAD_SNIPER_WEBHOOK_URL para activar el scraping real',
        });

        return NextResponse.json({
            success: false,
            message: 'Lead Sniper no ejecutado. Configura LEAD_SNIPER_WEBHOOK_URL en .env',
        });
    } catch (e: any) {
        console.error('CRON_SNIPER_ERROR:', e);
        await db.collection('cron_jobs').add({
            name: 'Lead Sniper LLC/Software',
            type: 'lead_scraping',
            status: 'failed',
            error: e.message,
            timestamp: new Date(),
        });
        return NextResponse.json({ error: e.message || 'Fatal Error' }, { status: 500 });
    }
}
