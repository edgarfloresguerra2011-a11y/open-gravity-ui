import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import { db } from '@/lib/storage';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Lead Sniper Cron Job
 * Ejecuta el script de scraping de Python para recolectar leads de LLC y Software.
 */
export async function GET(req: NextRequest) {
    try {
        // 1. Verificar autorización (Opcional, recomendado para Vercel Cron)
        const authHeader = req.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('[Cron] Iniciando Lead Sniper...');

        // 2. Ruta al script de Python (Ajustada al entorno local de scratch)
        // Nota: En producción real, esto requeriría un worker o una API externa,
        // pero para el entorno actual de Edison en local, ejecutamos el script directo.
        const scriptPath = path.join(process.cwd(), '..', 'lead_sniper_tax_software.py');

        // Ejecutamos el script. Usamos python o python3 según el sistema.
        const { stdout, stderr } = await execAsync(`python "${scriptPath}"`);

        if (stderr && !stdout) {
            console.error('[LeadSniper Cron] Error:', stderr);
            return NextResponse.json({ error: 'Scraping failed', details: stderr }, { status: 500 });
        }

        // 3. Registrar la ejecución en el historial de Cron Jobs
        await db.collection('cron_jobs').add({
            name: 'Lead Sniper LLC/Software',
            type: 'lead_scraping',
            status: 'success',
            output: stdout.substring(0, 500), // Guardar log corto
            timestamp: new Date()
        });

        return NextResponse.json({
            success: true,
            message: 'Lead Sniper ejecutado correctamente',
            summary: stdout.split('\n').slice(-3).join(' ') // Últimas líneas del log
        });

    } catch (e: any) {
        console.error('CRON_SNIPER_ERROR:', e);

        // Registrar error
        await db.collection('cron_jobs').add({
            name: 'Lead Sniper LLC/Software',
            type: 'lead_scraping',
            status: 'failed',
            error: e.message,
            timestamp: new Date()
        });

        return NextResponse.json({ error: e.message || 'Fatal Error Scraping' }, { status: 500 });
    }
}
