import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, planFromPriceId, type PlanId } from '@/lib/stripe';
import {
    setUserPlan,
    setStripeCustomerId,
    setStripeCustomerIndex,
    findUserIdByStripeCustomer,
} from '@/lib/user-plan';

/**
 * POST /api/stripe/webhook
 *
 * Recibe eventos de Stripe. NO requiere auth (es Stripe quien llama).
 * Verifica firma con STRIPE_WEBHOOK_SECRET.
 *
 * Eventos manejados:
 *   - checkout.session.completed → activar plan
 *   - customer.subscription.updated → cambiar plan
 *   - customer.subscription.deleted → volver a free
 */
export async function POST(req: NextRequest) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
        console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET no configurado');
        return NextResponse.json({ error: 'Webhook no configurado' }, { status: 503 });
    }

    const signature = req.headers.get('stripe-signature') ?? '';
    const rawBody = await req.text();

    let event;
    try {
        event = verifyWebhookSignature(rawBody, signature, secret);
    } catch (e: any) {
        console.error('[stripe/webhook] signature verification failed:', e.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as any;
                const userId = session.client_reference_id ?? session.metadata?.userId;
                const customerId = session.customer as string;
                const plan = (session.metadata?.plan ?? 'pro') as PlanId;

                if (userId && customerId) {
                    await setUserPlan(userId, plan);
                    await setStripeCustomerId(userId, customerId);
                    await setStripeCustomerIndex(customerId, userId);
                    console.log(`[stripe/webhook] ${userId} → ${plan} (customer: ${customerId})`);
                }
                break;
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.created': {
                const sub = event.data.object as any;
                const customerId = sub.customer as string;
                const priceId = sub.items?.data?.[0]?.price?.id;
                const userId = await findUserIdByStripeCustomer(customerId);

                if (userId && priceId) {
                    const newPlan = planFromPriceId(priceId);
                    if (newPlan) {
                        await setUserPlan(userId, newPlan);
                        console.log(`[stripe/webhook] ${userId} → ${newPlan} (sub updated)`);
                    }
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const sub = event.data.object as any;
                const customerId = sub.customer as string;
                const userId = await findUserIdByStripeCustomer(customerId);

                if (userId) {
                    await setUserPlan(userId, 'free');
                    console.log(`[stripe/webhook] ${userId} → free (sub deleted)`);
                }
                break;
            }

            default:
                // Evento no manejado — log silencioso
                console.log(`[stripe/webhook] evento no manejado: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (e: any) {
        console.error('[stripe/webhook] handler error:', e.message);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
