import { NextRequest, NextResponse } from 'next/server';
import { Bot, webhookCallback } from 'grammy';
import { processAiMessage } from '@/lib/ai_logic';

// This route will handle Telegram Webhooks
export const POST = async (req: NextRequest) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return NextResponse.json({ error: 'No token' }, { status: 500 });

    const bot = new Bot(botToken);

    bot.on('message:text', async (ctx) => {
        const response = await processAiMessage(ctx.message.text);
        await ctx.reply(response?.reply || 'Error from AI');
    });

    return webhookCallback(bot, 'std/http')(req);
};
