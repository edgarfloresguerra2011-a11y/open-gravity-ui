import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, apiLimiter } from '@/lib/rate_limiter';
import { requireOGSession } from '@/lib/session';
import { createPortalSession } from '@/lib/stripe';
import { getStripeCustomerId } from '@/lib/user-plan';

/**
 * POST /api/stripe/portal
 * Redirige al Stripe Customer Portal para gestionar suscripción.
 */
export async function POST(req: NextRequest) {
    const limited = await checkRateLimit(req, apiLimiter);
    if (limited) return limited;

    const [session, authError] = await requireOGSession();
    if (authError) return authError;

    const customerId = await getStripeCustomerId(session!.userId);
    if (!customerId) {
        return NextResponse.json(
            { error: 'No tienes suscripción activa' },
            { status: 400 }
        );
    }

    try {
        const origin = req.nextUrl.origin;
        const { url } = await createPortalSession({
            customerId,
            returnUrl: `${origin}/app/billing`,
        });
        return NextResponse.json({ url });
    } catch (e: any) {
        console.error('[stripe/portal] error:', e.message);
        return NextResponse.json(
            { error: 'No se pudo abrir el portal' },
            { status: 500 }
        );
    }
}
