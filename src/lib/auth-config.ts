/**
 * OpenGravity — NextAuth v5 configuration (Auth.js).
 *
 * v5 API: usa `auth()` en lugar de `getServerSession()`.
 * Configuración central en este archivo.
 *
 * Providers:
 *   - GitHub OAuth
 *   - Google OAuth
 *
 * Env vars requeridas:
 *   - AUTH_SECRET (v5 lo llama así, no NEXTAUTH_SECRET)
 *   - AUTH_GITHUB_ID, AUTH_GITHUB_SECRET
 *   - AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
 */

import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Primera vez que el user hace login
      if (user?.id) {
        token.userId = user.id;
        token.plan = 'free'; // todos empiezan en free
      }
      if (account?.provider) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // Exponer userId + plan en la sesión del cliente
      if (session.user) {
        (session.user as { id?: string }).id = token.userId as string;
        (session as { userId?: string }).userId = token.userId as string;
        (session as { plan?: string }).plan = (token.plan as string) ?? 'free';
      }
      return session;
    },
    authorized({ auth, request }) {
      // Middleware helper: protege /app/*
      const isLoggedIn = !!auth?.user;
      const isOnApp = request.nextUrl.pathname.startsWith('/app');
      const isOnLogin = request.nextUrl.pathname.startsWith('/login');

      if (isOnApp && !isLoggedIn) {
        return Response.redirect(new URL('/login', request.nextUrl));
      }
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/app', request.nextUrl));
      }
      return true;
    },
    async signIn({ user }) {
      if (!user?.email) {
        console.warn('[auth] Sign-in bloqueado: user sin email');
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login?error=1',
  },
  events: {
    async signIn({ user, account }) {
      console.log(`[auth] Sign-in: ${user.email} via ${account?.provider}`);
    },
  },
};

// Instancia única que se usa en route handler + middleware + server components
export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);

// Helper para server components y route handlers
export async function getSession() {
  return await auth();
}

// Validación fail-fast
export function assertAuthEnv() {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.AUTH_SECRET) {
      throw new Error('AUTH_SECRET no configurado. Genera con: openssl rand -hex 32');
    }
    if (!process.env.AUTH_GITHUB_ID && !process.env.AUTH_GOOGLE_ID) {
      console.warn('[auth] Ningún OAuth provider configurado');
    }
  }
}
