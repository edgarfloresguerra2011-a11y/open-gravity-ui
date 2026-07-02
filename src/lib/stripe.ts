/**
 * OpenGravity — Stripe integration.
 *
 * Planes:
 *   - pro: $29/mes (USD)
 *   - agency: $99/mes (USD)
 *
 * Flujo:
 *   1. User click "Upgrade" → POST /api/stripe/checkout → URL de Stripe Checkout
 *   2. User paga en Stripe → redirect a /app/billing?success=1
 *   3. Stripe envía webhook → POST /api/stripe/webhook → actualizar plan en Redis
 *
 * Env vars:
 *   - STRIPE_SECRET_KEY
 *   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 *   - STRIPE_WEBHOOK_SECRET (whsec_...)
 */

import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
    if (!stripeInstance) {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) throw new Error('STRIPE_SECRET_KEY no configurado');
        stripeInstance = new Stripe(key, {
            // 2024-12-18.acacia
            apiVersion: '2024-12-18.acacia' as any,
            typescript: true,
        });
    }
    return stripeInstance;
}

// ─── Price IDs (configurar en Stripe Dashboard) ──────────────────────────────

export const STRIPE_PRICES = {
    pro: process.env.STRIPE_PRICE_PRO_ID ?? 'price_pro_placeholder',
    agency: process.env.STRIPE_PRICE_AGENCY_ID ?? 'price_agency_placeholder',
} as const;

export type PlanId = 'free' | 'pro' | 'agency';

/**
 * Crea una Checkout Session para upgrade de plan.
 */
export async function createCheckoutSession(params: {
    userId: string;
    email: string;
    plan: 'pro' | 'agency';
    successUrl: string;
    cancelUrl: string;
}): Promise<{ url: string }> {
    const stripe = getStripe();
    const priceId = STRIPE_PRICES[params.plan];

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: params.email,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        client_reference_id: params.userId,
        metadata: {
            userId: params.userId,
            plan: params.plan,
        },
        allow_promotion_codes: true,
        subscription_data: {
            metadata: {
                userId: params.userId,
                plan: params.plan,
            },
        },
    });

    return { url: session.url! };
}

/**
 * Crea una Customer Portal Session para que el user cancele/cambie su plan.
 */
export async function createPortalSession(params: {
    customerId: string;
    returnUrl: string;
}): Promise<{ url: string }> {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
        customer: params.customerId,
        return_url: params.returnUrl,
    });
    return { url: session.url };
}

/**
 * Mapea el plan desde el producto de Stripe (para usar en webhook).
 */
export function planFromPriceId(priceId: string): PlanId | null {
    if (priceId === STRIPE_PRICES.pro) return 'pro';
    if (priceId === STRIPE_PRICES.agency) return 'agency';
    return null;
}

/**
 * Verifica la firma del webhook (timing-safe).
 */
export function verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    secret: string
): Stripe.Event {
    const stripe = getStripe();
    return stripe.webhooks.constructEvent(
        payload,
        signature,
        secret
    );
}
