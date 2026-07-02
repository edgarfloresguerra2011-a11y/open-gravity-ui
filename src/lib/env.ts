/**
 * OpenGravity — Validación de variables de entorno al startup.
 *
 * Fail-fast: si una var crítica falta, lanzamos error con mensaje claro
 * en lugar de dejar que las rutas fallen una por una en runtime.
 *
 * Uso (al inicio de cualquier módulo que use env vars):
 *   import { assertEnv, isProd } from '@/lib/env';
 *   assertEnv(); // lanza si faltan vars críticas
 */

type EnvVarSpec = {
    name: string;
    required: boolean;
    /** Solo se valida en producción */
    prodOnly?: boolean;
    /** Para no exponer el valor, solo validar que esté presente */
    secret?: boolean;
    description: string;
};

const ENV_SPEC: EnvVarSpec[] = [
    // ── Storage (Upstash Redis) — crítico ───────────────────────────────────
    { name: 'UPSTASH_REDIS_REST_URL', required: true, secret: false, description: 'URL de Upstash Redis REST' },
    { name: 'UPSTASH_REDIS_REST_TOKEN', required: true, secret: true, description: 'Token de Upstash Redis' },

    // ── LLM ─────────────────────────────────────────────────────────────────
    { name: 'DEEPSEEK_API_KEY', required: true, secret: true, description: 'API key de DeepSeek (chat + síntesis)' },

    // ── Research ────────────────────────────────────────────────────────────
    { name: 'TAVILY_API_KEY', required: true, secret: true, description: 'API key de Tavily (deep research)' },

    // ── Auth ────────────────────────────────────────────────────────────────
    { name: 'CRON_SECRET', required: true, secret: true, description: 'Secret para Vercel Cron jobs (deny by default)' },
    { name: 'OG_API_KEY', required: false, secret: true, description: 'API key para ingesta externa (POST /api/ingest)' },

    // ── Opcionales (con fallback) ───────────────────────────────────────────
    { name: 'BRAVE_API_KEY', required: false, secret: true, description: 'Búsqueda web sin fallback a Jina' },
    { name: 'JINA_API_KEY', required: false, secret: true, description: 'Scraping mejorado' },
    { name: 'OPENAI_API_KEY', required: false, secret: true, description: 'Fallback TTS' },
    { name: 'TELEGRAM_BOT_TOKEN', required: false, secret: true, description: 'Webhook de Telegram' },
    { name: 'TELEGRAM_WEBHOOK_SECRET', required: false, secret: true, description: 'Validación de webhook Telegram' },
    { name: 'FB_PAGE_ID', required: false, secret: false, description: 'ID de página Facebook para cron poster' },
    { name: 'FB_PAGE_TOKEN', required: false, secret: true, description: 'Token de página Facebook' },
    { name: 'CLOUDFLARE_ACCOUNT_ID', required: false, secret: false, description: 'Workers AI para memoria' },
    { name: 'CLOUDFLARE_EMAIL', required: false, secret: false, description: 'Email de cuenta Cloudflare' },
    { name: 'CLOUDFLARE_GLOBAL_KEY', required: false, secret: true, description: 'API key global Cloudflare' },
    { name: 'GEMINI_KEY_1', required: false, secret: true, description: 'Fallback summarizer Gemini' },
    { name: 'LEAD_SNIPER_WEBHOOK_URL', required: false, secret: false, description: 'Webhook del worker Lead Sniper' },
    { name: 'LEAD_SNIPER_WEBHOOK_TOKEN', required: false, secret: true, description: 'Token del webhook Lead Sniper' },

    // ── Firebase Shop (facebook-poster cron) ────────────────────────────────
    { name: 'NEXT_PUBLIC_FB_SHOP_API_KEY', required: false, secret: false, description: 'Firebase config para shop (cambió de hardcoded)' },
    { name: 'NEXT_PUBLIC_FB_SHOP_PROJECT_ID', required: false, secret: false, description: 'Firebase project ID shop' },
];

export function isProd(): boolean {
    return process.env.NODE_ENV === 'production';
}

export interface EnvValidationResult {
    ok: boolean;
    missing: string[];
    missingRequired: string[];
    warnings: string[];
}

/**
 * Valida las env vars. Si throwOnError=true (default en prod), lanza si faltan
 * vars críticas. Si no, devuelve un resultado sin lanzar.
 */
export function validateEnv(throwOnError = false): EnvValidationResult {
    const missing: string[] = [];
    const missingRequired: string[] = [];
    const warnings: string[] = [];

    for (const spec of ENV_SPEC) {
        const value = process.env[spec.name];
        const isMissing = !value || value.trim() === '';

        if (isMissing && spec.required) {
            missing.push(spec.name);
            missingRequired.push(spec.name);
        } else if (isMissing && !spec.required) {
            missing.push(spec.name);
            // Warnings solo si la función asociada es probable que se use
            warnings.push(`Var opcional faltante: ${spec.name} — ${spec.description}`);
        }
    }

    if (missingRequired.length > 0 && throwOnError) {
        const msg = [
            '═══════════════════════════════════════════════════════════',
            '  VARIABLES DE ENTORNO CRÍTICAS FALTANTES',
            '═══════════════════════════════════════════════════════════',
            '',
            `Faltan: ${missingRequired.join(', ')}`,
            '',
            'Copia .env.example a .env y completa los valores.',
            '═══════════════════════════════════════════════════════════',
        ].join('\n');
        throw new Error(msg);
    }

    return {
        ok: missingRequired.length === 0,
        missing,
        missingRequired,
        warnings,
    };
}

// Singleton — valida una sola vez al cargar el módulo
let validated = false;
export function assertEnv(): void {
    if (validated) return;
    validated = true;
    if (isProd()) {
        validateEnv(true);
    } else {
        const result = validateEnv(false);
        if (result.missingRequired.length > 0) {
            console.warn(`[ENV] Vars críticas faltantes en dev: ${result.missingRequired.join(', ')}`);
        }
    }
}
