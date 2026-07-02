/**
 * OpenGravity — Session helpers (Auth.js v5).
 *
 * Wrapper sobre `auth()` que:
 *   1. Expone el tipo Session con userId + plan.
 *   2. Provee helpers para Route Handlers y Server Components.
 */

import { auth, getSession } from './auth-config';

export interface OpenGravitySession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  userId: string;
  plan: 'free' | 'pro' | 'agency';
}

/**
 * Devuelve la sesión actual o null si no está autenticado.
 * Server Component / Route Handler only.
 */
export async function getOGSession(): Promise<OpenGravitySession | null> {
  const session = await getSession();
  if (!session?.user) return null;
  return session as unknown as OpenGravitySession;
}

/**
 * Helper para rutas API que requieren usuario autenticado.
 * Devuelve [session, null] si OK, o [null, errorResponse] si no auth.
 *
 * Uso:
 *   const [session, error] = await requireSession();
 *   if (error) return error;
 *   // session.userId disponible
 */
export async function requireOGSession(): Promise<[OpenGravitySession | null, Response | null]> {
  const session = await getOGSession();
  if (!session) {
    return [
      null,
      new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    ];
  }
  return [session, null];
}

/**
 * Verifica si el usuario tiene un plan mínimo.
 */
export function hasPlan(session: OpenGravitySession, minPlan: 'free' | 'pro' | 'agency'): boolean {
  const planRank = { free: 0, pro: 1, agency: 2 };
  return planRank[session.plan] >= planRank[minPlan];
}

// Re-export para uso en middleware
export { auth };
