import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { checkRateLimit, apiLimiter } from '@/lib/rate_limiter';
import { requireOGSession } from '@/lib/session';
import { getSimulation } from '@/lib/simulations';

/**
 * GET /api/simulations/[jobId]/pdf
 *
 * Genera un PDF descargable con el reporte de simulación.
 * Requiere sesión — solo el dueño del job puede descargarlo.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    const limited = await checkRateLimit(req, apiLimiter);
    if (limited) return limited;

    const [session, authError] = await requireOGSession();
    if (authError) return authError;

    const { jobId } = await params;
    if (!jobId || jobId.length > 100) {
        return NextResponse.json({ error: 'jobId inválido' }, { status: 400 });
    }

    const simulation = await getSimulation(session!.userId, jobId);
    if (!simulation) {
        return NextResponse.json({ error: 'Simulación no encontrada' }, { status: 404 });
    }

    if (simulation.status !== 'completed') {
        return NextResponse.json({ error: 'Simulación no completada' }, { status: 400 });
    }

    // Generar PDF
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
            Title: `OpenGravity Report — ${simulation.idea.substring(0, 60)}`,
            Author: 'OpenGravity',
            Subject: 'Predicción de viabilidad de negocio',
            Creator: 'OpenGravity',
        },
    });

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    const buffer = await new Promise<Buffer>((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        buildPdf(doc, simulation);
        doc.end();
    });

    const safeIdea = simulation.idea.substring(0, 40).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `opengravity-${safeIdea}-${jobId.substring(0, 8)}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'private, no-cache',
        },
    });
}

function buildPdf(doc: PDFKit.PDFDocument, sim: any) {
    const pageWidth = doc.page.width - 100;
    let y = doc.y;

    // ─── HEADER ─────────────────────────────────────────────────────────────
    doc.fillColor('#0F172A')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('OpenGravity', 50, y);

    doc.fillColor('#10B981')
        .fontSize(10)
        .font('Helvetica')
        .text('REPORTE DE VIABILIDAD — MONTE CARLO V3', 50, y + 28);

    y += 60;

    doc.fillColor('#64748B')
        .fontSize(9)
        .text(`Generado: ${new Date(sim.completedAt ?? sim.createdAt).toLocaleString('es-ES')}`, 50, y);
    doc.text(`Job ID: ${sim.jobId}`, 50, y + 12);
    y += 35;

    // Separador
    doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(50, y).lineTo(pageWidth + 50, y).stroke();
    y += 20;

    // ─── IDEA ───────────────────────────────────────────────────────────────
    doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text('IDEA DE NEGOCIO', 50, y);
    y += 15;
    doc.fillColor('#0F172A').fontSize(13).font('Helvetica-Bold').text(sim.idea, 50, y, {
        width: pageWidth,
    });
    y += doc.heightOfString(sim.idea, { width: pageWidth }) + 25;

    // ─── VEREDICTO ──────────────────────────────────────────────────────────
    if (sim.narrativePayload?.executiveSummary || sim.marketVerdict) {
        doc.strokeColor('#E5E7EB').moveTo(50, y).lineTo(pageWidth + 50, y).stroke();
        y += 20;

        doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text('VEREDICTO', 50, y);
        y += 15;

        // Score big
        const score = sim.viabilityScore ?? 0;
        const verdictColor = score >= 70 ? '#10B981' : score >= 45 ? '#F5A623' : '#FF6B4A';
        doc.fillColor(verdictColor).fontSize(48).font('Helvetica-Bold').text(`${score}/100`, 50, y);
        doc.fillColor('#0F172A').fontSize(14).text(sim.marketVerdict ?? 'Sin veredicto', 50, y + 50);
        y += 80;

        // Executive summary
        const summary = sim.narrativePayload?.executiveSummary;
        if (summary) {
            doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text('RESUMEN EJECUTIVO', 50, y);
            y += 15;
            doc.fillColor('#1F2937').fontSize(10).font('Helvetica').text(summary, 50, y, {
                width: pageWidth,
                align: 'justify',
            });
            y += doc.heightOfString(summary, { width: pageWidth, align: 'justify' }) + 20;
        }
    }

    // ─── MÉTRICAS CUANTITATIVAS ─────────────────────────────────────────────
    if (sim.quantPayload) {
        const q = sim.quantPayload;
        if (y > 700) { doc.addPage(); y = 50; }

        doc.strokeColor('#E5E7EB').moveTo(50, y).lineTo(pageWidth + 50, y).stroke();
        y += 20;

        doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text('MÉTRICAS — PERCENTILES P10/P50/P90', 50, y);
        y += 20;

        // Tabla
        const col1 = 50;
        const col2 = 50 + pageWidth * 0.35;
        const col3 = 50 + pageWidth * 0.55;
        const col4 = 50 + pageWidth * 0.75;

        // Header
        doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold');
        doc.text('Métrica', col1, y);
        doc.text('P10', col2, y, { width: 60, align: 'right' });
        doc.text('P50', col3, y, { width: 60, align: 'right' });
        doc.text('P90', col4, y, { width: 60, align: 'right' });
        y += 16;

        doc.strokeColor('#F3F4F6').lineWidth(0.5).moveTo(50, y).lineTo(pageWidth + 50, y).stroke();
        y += 8;

        // Rows
        const metrics = [
            { label: 'LTV', values: q.ltv },
            { label: 'CAC', values: q.cac },
            { label: 'Drawdown', values: q.drawdown },
        ];

        doc.fillColor('#1F2937').fontSize(10).font('Helvetica');
        for (const m of metrics) {
            if (m.values) {
                doc.text(m.label, col1, y);
                doc.text(`$${m.values.p10?.toLocaleString() ?? '-'}`, col2, y, { width: 60, align: 'right' });
                doc.text(`$${m.values.p50?.toLocaleString() ?? '-'}`, col3, y, { width: 60, align: 'right' });
                doc.text(`$${m.values.p90?.toLocaleString() ?? '-'}`, col4, y, { width: 60, align: 'right' });
                y += 18;
            }
        }
        y += 10;

        // KPIs
        if (q.bankruptcyRate !== undefined) {
            doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text('INDICADORES CLAVE', 50, y);
            y += 16;

            const kpis = [
                ['Tasa de bancarrota', `${(q.bankruptcyRate * 100).toFixed(1)}%`],
                ['Break-even (meses)', `${q.breakEvenMonth ?? '-'}`],
                ['Iteraciones', `${q.iterationsRun ?? 1000}`],
                ['Trust Score', `${((q.trustScore ?? 0) * 100).toFixed(0)}%`],
            ];

            doc.fillColor('#1F2937').fontSize(10).font('Helvetica');
            for (const [label, val] of kpis) {
                doc.text(label, col1, y);
                doc.text(val, col4 - 60, y, { width: 120, align: 'right' });
                y += 16;
            }
        }
    }

    // ─── RIESGOS Y RECOMENDACIONES ──────────────────────────────────────────
    if (sim.narrativePayload) {
        const n = sim.narrativePayload;

        if (Array.isArray(n.keyRisks) && n.keyRisks.length > 0) {
            if (y > 650) { doc.addPage(); y = 50; }
            y += 15;
            doc.strokeColor('#E5E7EB').moveTo(50, y).lineTo(pageWidth + 50, y).stroke();
            y += 20;

            doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text('RIESGOS CLAVE', 50, y);
            y += 16;

            doc.fillColor('#1F2937').fontSize(10).font('Helvetica');
            for (const risk of n.keyRisks) {
                const bullet = `• ${typeof risk === 'string' ? risk : risk.title}`;
                doc.text(bullet, 50, y, { width: pageWidth });
                y += doc.heightOfString(bullet, { width: pageWidth }) + 6;
            }
        }

        if (Array.isArray(n.recommendations) && n.recommendations.length > 0) {
            if (y > 650) { doc.addPage(); y = 50; }
            y += 15;
            doc.strokeColor('#E5E7EB').moveTo(50, y).lineTo(pageWidth + 50, y).stroke();
            y += 20;

            doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text('RECOMENDACIONES ESTRATÉGICAS', 50, y);
            y += 16;

            doc.fillColor('#1F2937').fontSize(10).font('Helvetica');
            for (const rec of n.recommendations) {
                const bullet = `→ ${rec}`;
                doc.text(bullet, 50, y, { width: pageWidth });
                y += doc.heightOfString(bullet, { width: pageWidth }) + 6;
            }
        }

        if (n.blackSwanWarning) {
            if (y > 680) { doc.addPage(); y = 50; }
            y += 15;
            doc.fillColor('#DC2626').fontSize(9).font('Helvetica-Bold').text('⚠ ALERTA DE CISNE NEGRO', 50, y);
            y += 16;
            doc.fillColor('#7F1D1D').fontSize(10).font('Helvetica').text(n.blackSwanWarning, 50, y, {
                width: pageWidth,
                align: 'justify',
            });
        }
    }

    // ─── FOOTER ─────────────────────────────────────────────────────────────
    const footerY = doc.page.height - 50;
    doc.strokeColor('#E5E7EB').lineWidth(0.5).moveTo(50, footerY).lineTo(pageWidth + 50, footerY).stroke();
    doc.fillColor('#9CA3AF').fontSize(8).font('Helvetica').text(
        `OpenGravity · Reporte generado por IA · No constituye asesoría financiera · Job ${sim.jobId.substring(0, 8)}`,
        50,
        footerY + 10,
        { width: pageWidth, align: 'center' }
    );
}
