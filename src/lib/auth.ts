/**
 * OpenGravity — Capa de Autenticación Compartida
 *
 * Principios:
 *   1. Denegar por defecto (fail-closed). Si CRON_SECRET falta, 401 — no bypass.
 *   2. Constant-time comparison para evitar timing attacks.
 *   3. Rate limiting separado por tipo de endpoint.
 *   4. Helper único `requireCronAuth` para que todas las rutas cron sean consistentes.
 */

import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

// ─── Comparación constante-tiempo para secrets ───────────────────────────────

/**
 * Compara dos strings en tiempo constante para evitar timing attacks.
 * Devuelve false si alguno está vacío o si difieren en longitud.
 *
 * Exportada para que otras rutas (webhook/telegram, etc.) la usen directamente.
 */
export function safeCompare(a: string, b: string): boolean {
    if (!a || !b) return false;
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return timingSafeEqual(aBuf, bBuf);
}

// ─── Auth para Vercel Cron jobs ───────────────────────────────────────────────

/**
 * Verifica que la request venga de Vercel Cron (o de un caller autorizado).
 *
 * Vercel Cron envía `Authorization: Bearer <CRON_SECRET>`.
 * Si CRON_SECRET no está configurado, la ruta se considera bloqueada
 * (fail-closed) — antes el `if (process.env.CRON_SECRET && ...)` permitía bypass.
 *
 * Uso:
 *   const authError = requireCronAuth(req);
 *   if (authError) return authError;
 */
export function requireCronAuth(req: NextRequest): NextResponse | null {
    const expected = process.env.CRON_SECRET;
    if (!expected) {
        console.error("[AUTH] CRON_SECRET no configurado — ruta cron bloqueada por seguridad");
        return NextResponse.json(
            { error: "Servicio no configurado (CRON_SECRET ausente)" },
            { status: 503 }
        );
    }

    const authHeader = req.headers.get("authorization") ?? "";
    const provided = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : "";

    if (!safeCompare(provided, expected)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return null;
}

// ─── Auth para API key simple (clientes internos) ────────────────────────────

/**
 * Verifica una API key en header `X-API-Key`.
 * Útil para endpoints consumidos por scripts (Lead Sniper worker, ingesta, etc.)
 */
export function requireApiKey(req: NextRequest): NextResponse | null {
    const expected = process.env.OG_API_KEY;
    if (!expected) {
        console.error("[AUTH] OG_API_KEY no configurado — endpoint bloqueado");
        return NextResponse.json(
            { error: "Servicio no configurado (API key ausente)" },
            { status: 503 }
        );
    }

    const provided = req.headers.get("x-api-key") ?? "";
    if (!safeCompare(provided, expected)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return null;
}

// ─── Auth para webhooks firmados (HMAC) ──────────────────────────────────────

/**
 * Verifica firma HMAC-SHA256 de un webhook.
 * El caller debe enviar:
 *   header X-Signature: hex(hmac_sha256(secret, raw_body))
 *
 * Uso:
 *   const raw = await req.text();
 *   const err = requireWebhookSignature(req, raw);
 *   if (err) return err;
 *   const body = JSON.parse(raw);
 */
export function requireWebhookSignature(
    req: NextRequest,
    rawBody: string
): NextResponse | null {
    const secret = process.env.WEBHOOK_SECRET;
    if (!secret) {
        console.error("[AUTH] WEBHOOK_SECRET no configurado — webhook bloqueado");
        return NextResponse.json(
            { error: "Webhook secret no configurado" },
            { status: 503 }
        );
    }

    const provided = req.headers.get("x-signature") ?? "";
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

    if (!safeCompare(provided, expected)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    return null;
}

// ─── Helper para limitar tamaño de body (anti-DoS) ───────────────────────────

/**
 * Lee el body JSON rechazando payloads mayores a maxBytes.
 * Defecto: 1MB. Para endpoints de texto libre (chat, research) usar 16KB.
 *
 * Uso:
 *   const [body, error] = await readJsonBody(req, 16 * 1024);
 *   if (error) return error;
 *   // body: unknown
 */
export async function readJsonBody(
    req: NextRequest,
    maxBytes = 1_000_000
): Promise<[unknown | null, NextResponse | null]> {
    try {
        const raw = await req.text();
        if (raw.length > maxBytes) {
            return [
                null,
                NextResponse.json(
                    { error: `Body demasiado grande (máx ${maxBytes} bytes)` },
                    { status: 413 }
                ),
            ];
        }
        return [JSON.parse(raw), null];
    } catch {
        return [
            null,
            NextResponse.json({ error: "JSON inválido" }, { status: 400 }),
        ];
    }
}
