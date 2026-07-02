import { NextRequest, NextResponse } from 'next/server';
import { Bot, webhookCallback } from 'grammy';
import { processAiMessage } from '@/lib/ai_logic';
import { checkRateLimit, apiLimiter } from '@/lib/rate_limiter';
import { validateUserInput } from '@/lib/security';
import { safeCompare } from '@/lib/auth';

/**
 * Webhook de Telegram.
 *
 * Telegram nos envía un header X-Telegram-Bot-Api-Secret-Token si lo configuramos
 * al setear el webhook (parámetro secret_token en setWebhook).
 *
 * FIX: Si TELEGRAM_WEBHOOK_SECRET está seteado, validar que coincida.
 * FIX: usa safeCompare (timing-safe) en lugar de !== para evitar timing attacks.
 * Esto previene que alguien llame /api/webhook/telegram con un mensaje falso.
 */
export async function POST(req: NextRequest) {
    try {
        const limited = await checkRateLimit(req, apiLimiter);
        if (limited) return limited;

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            return NextResponse.json({ error: 'No token' }, { status: 500 });
        }

        // Validar secret token de Telegram (si está configurado) — constant-time
        const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
        if (expectedSecret) {
            const providedSecret = req.headers.get('x-telegram-bot-api-secret-token') ?? '';
            if (!safeCompare(providedSecret, expectedSecret)) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        const bot = new Bot(botToken);

        bot.on('message:text', async (ctx) => {
            // FIX: validar input del usuario de Telegram antes de mandarlo al LLM
            const validation = validateUserInput(ctx.message.text);
            if (!validation.safe) {
                await ctx.reply('⚠️ Tu mensaje contiene patrones no permitidos.');
                return;
            }
            // Limitar longitud del mensaje
            const truncated = ctx.message.text.substring(0, 2000);
            const response = await processAiMessage(truncated);
            await ctx.reply(response?.reply || 'Error from AI');
        });

        return webhookCallback(bot, 'std/http')(req);
    } catch (e: any) {
        console.error('[telegram] webhook error:', e.message);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}
