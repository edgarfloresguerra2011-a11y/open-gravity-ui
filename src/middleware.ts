/**
 * OpenGravity — Next.js middleware (Auth.js v5).
 *
 * Protege rutas que requieren autenticación:
 *   - /app/* → requiere sesión (si no, redirect a /login)
 *
 * Rutas públicas (no protege):
 *   - / (landing)
 *   - /login
 *   - /api/auth/* (NextAuth handlers)
 *   - /api/health, /api/cron/* (auth propia)
 *   - /privacy, /terms (legal)
 *
 * Nota: las rutas /api/* (excepto auth/health/cron) no se protegen aquí
 * porque el middleware de Auth.js v5 no las cubre bien. Cada ruta API
 * valida sesión internamente con `getSession()`.
 */

import { auth } from '@/lib/auth-config';

export default auth;

export const config = {
  matcher: ['/app/:path*'],
};
