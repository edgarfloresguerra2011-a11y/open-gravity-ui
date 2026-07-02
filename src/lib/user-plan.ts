/**
 * OpenGravity — User plan persistence.
 *
 * Guarda el plan del usuario y su stripeCustomerId en Redis:
 *   og:user:{userId}:plan → 'free' | 'pro' | 'agency'
 *   og:user:{userId}:stripe_customer → 'cus_...'
 *
 * El JWT de NextAuth se sincroniza leyendo este store.
 */

import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const PLAN_KEY = (userId: string) => `og:user:${userId}:plan`;
const STRIPE_KEY = (userId: string) => `og:user:${userId}:stripe_customer`;

export type Plan = 'free' | 'pro' | 'agency';

export async function getUserPlan(userId: string): Promise<Plan> {
    const plan = await redis.get<Plan>(PLAN_KEY(userId));
    return plan ?? 'free';
}

export async function setUserPlan(userId: string, plan: Plan): Promise<void> {
    await redis.set(PLAN_KEY(userId), plan);
}

export async function getStripeCustomerId(userId: string): Promise<string | null> {
    return await redis.get<string>(STRIPE_KEY(userId));
}

export async function setStripeCustomerId(userId: string, customerId: string): Promise<void> {
    await redis.set(STRIPE_KEY(userId), customerId);
}

/**
 * Busca el userId asociado a un stripeCustomerId (para webhooks).
 * Hace un scan inverso — en producción sería mejor mantener un índice:
 *   og:stripe:{customerId} → userId
 */
export async function findUserIdByStripeCustomer(customerId: string): Promise<string | null> {
    // Índice directo
    const userId = await redis.get<string>(`og:stripe:${customerId}`);
    if (userId) return userId;

    // Fallback: scan (no recomendado en prod)
    // Para mantener simple, devolvemos null si no está en índice
    return null;
}

export async function setStripeCustomerIndex(customerId: string, userId: string): Promise<void> {
    await redis.set(`og:stripe:${customerId}`, userId);
}
