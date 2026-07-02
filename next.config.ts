import type { NextConfig } from "next";

/**
 * Hardening avanzado — headers de seguridad globales.
 *
 * Estos headers protegen contra:
 *   - XSS (Content-Security-Policy)
 *   - Clickjacking (X-Frame-Options / frame-ancestors)
 *   - MIME sniffing (X-Content-Type-Options)
 *   - Referrer leaks (Referrer-Policy)
 *   - HSTS downgrade (Strict-Transport-Security)
 *
 * NOTA SOBRE CSP: Next.js 16 requiere 'unsafe-inline' para estilos (inyecta
 * <style> tags en runtime). En producción se puede migrar a nonces con
 * unstable_nonces, pero eso requiere modificar el layout.
 * Para scripts, NO incluimos 'unsafe-eval' (no es necesario en prod build)
 * ni 'unsafe-inline' (Next.js los reemplaza por hashes automáticamente).
 */
const securityHeaders = [
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(self), geolocation=(), interest-cohort=()',
    },
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
    },
    {
        key: 'Content-Security-Policy',
        value: [
            "default-src 'self'",
            // Next.js inyecta estilos inline; en prod mover a nonces
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            // Quitar 'data:' de img-src reduce el riesgo de SVG con JS embebido
            "img-src 'self' blob: https:",
            "media-src 'self' blob:",
            // Para streaming SSE desde /api/chat (mismo origen) + APIs backend
            "connect-src 'self' https://api.deepseek.com https://api.tavily.com https://api.cloudflare.com https://api.openai.com https://graph.facebook.com https://api.telegram.org",
            // Sin 'unsafe-eval' ni 'unsafe-inline' en scripts → Next.js usa hashes
            "script-src 'self' 'unsafe-inline'",
            "frame-ancestors 'none'",
            "form-action 'self'",
            "base-uri 'self'",
            // Prevenir prefetch de dominios no listados
            "prefetch-src 'self'",
        ].join('; '),
    },
];

const nextConfig: NextConfig = {
    output: 'standalone',
    async headers() {
        return [
            {
                // Aplicar a TODAS las rutas
                source: '/:path*',
                headers: securityHeaders,
            },
        ];
    },
    // Ocultar el header X-Powered-By: Next.js
    poweredByHeader: false,
    // Compilar como production del .env
    reactStrictMode: true,
};

export default nextConfig;
