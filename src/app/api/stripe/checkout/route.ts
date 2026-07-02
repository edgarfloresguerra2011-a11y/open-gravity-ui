import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, apiLimiter } from '@/lib/rate_limiter';
import { requireOGSession } from '@/lib/session';
import { createCheckoutSession } from '@/lib/stripe';
import { readJsonBody } from '@/lib/auth';

/**
 * POST /api/stripe/checkout
 * Body: { plan: 'pro' | 'agency' }
 *
 * Crea una Stripe Checkout Session y devuelve la URL a la que redirigir.
 */
export async function POST(req: NextRequest) {
    const limited = await checkRateLimit(req, apiLimiter);
    if (limited) return limited;

    const [session, authError] = await requireOGSession();
    if (authError) return authError;

    const [body, bodyError] = await readJsonBody(req, 4 * 1024);
    if (bodyError) return bodyError;

    const { plan } = (body ?? {}) as { plan?: string };
    if (plan !== 'pro' && plan !== 'agency') {
        return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    // No permitir upgrade si ya está en ese plan
    if (session!.plan === plan) {
        return NextResponse.json({ error: 'Ya estás en este plan' }, { status: 400 });
    }

    const origin = req.nextUrl.origin;

    try {
        const { url } = await createCheckoutSession({
            userId: session!.userId,
            email: session!.user.email!,
            plan,
            successUrl: `${origin}/app/billing?success=1&plan=${plan}`,
            cancelUrl: `${origin}/app/billing?canceled=1`,
        });

        return NextResponse.json({ url });
    } catch (e: any) {
        console.error('[stripe/checkout] error:', e.message);
        return NextResponse.json(
            { error: 'No se pudo crear la sesión de pago' },
            { status: 500 }
        );
    }
}
