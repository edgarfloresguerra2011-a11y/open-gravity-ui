/**
 * OpenGravity — NextAuth v5 configuration (Auth.js).
 *
 * v5 API: usa `auth()` en lugar de `getServerSession()`.
 *
 * Providers:
 *   - GitHub OAuth (producción)
 *   - Google OAuth (producción)
 *   - Credentials dev (solo si NODE_ENV !== 'production')
 *
 * Env vars:
 *   - AUTH_SECRET (obligatorio)
 *   - AUTH_GITHUB_ID, AUTH_GITHUB_SECRET (opcional, pero recomendado)
 *   - AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET (opcional, pero recomendado)
 *   - DEV_LOGIN_EMAIL (opcional, para customizar el dev login)
 */

import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

// En dev sin OAuth configurado, dejamos un login mínimo
const DEV_EMAIL = process.env.DEV_LOGIN_EMAIL || 'dev@opengravity.local';

// Lista de providers activos — se construye dinámicamente
const providers: NextAuthConfig['providers'] = [];

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  );
}

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

// Fallback de dev: si no hay OAuth configurado Y estamos en dev, habilitar credentials
if (isDev && providers.length === 0) {
  providers.push(
    Credentials({
      name: 'Dev Login',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: DEV_EMAIL,
        },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string) || DEV_EMAIL;
        if (!email) return null;
        return {
          id: `dev_${Buffer.from(email).toString('hex').slice(0, 12)}`,
          email,
          name: email.split('@')[0],
        };
      },
    })
  );
  console.warn('[auth] Modo dev activo: OAuth no configurado. Login de desarrollo habilitado.');
}

// Bandera exportada para que el login page pueda mostrar el warning
// providers[0] puede ser una función o un objeto — usamos una heurística simple
function isCredentialsOnly(providers: NextAuthConfig['providers']): boolean {
  if (providers.length !== 1) return false;
  const p = providers[0] as any;
  // Credentials provider tiene type 'credentials' u opciones con credentials
  return p?.type === 'credentials' || (typeof p === 'function' && p.name === 'Credentials');
}
export const isDevLoginEnabled = isDev && isCredentialsOnly(providers);
export const hasGitHubOAuth = !!(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
export const hasGoogleOAuth = !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      // Primera vez que el user hace login
      if (user?.id) {
        token.userId = user.id;
        token.plan = 'free';
      }
      if (account?.provider) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.userId as string;
        (session as { userId?: string }).userId = token.userId as string;
        (session as { plan?: string }).plan = (token.plan as string) ?? 'free';
      }
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;
      const isOnApp = pathname.startsWith('/app');
      const isOnLogin = pathname.startsWith('/login');

      // En dev sin OAuth, NO bloquear /app — el usuario puede explorar
      if (isOnApp && !isLoggedIn && isDevLoginEnabled) {
        return true; // permitir acceso en dev mode sin sesión
      }

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
  if (isProd) {
    if (!process.env.AUTH_SECRET) {
      throw new Error('AUTH_SECRET no configurado. Genera con: openssl rand -hex 32');
    }
    if (!hasGitHubOAuth && !hasGoogleOAuth) {
      console.warn('[auth] PRODUCCIÓN sin OAuth providers configurados — el login NO funcionará.');
    }
  }
}
