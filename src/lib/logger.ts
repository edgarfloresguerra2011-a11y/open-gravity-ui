/**
 * OpenGravity — Logger estructurado.
 *
 * Reemplaza console.log/error/warn con un logger que:
 *   1. Redacta automáticamente patrones tipo API key, token, bearer.
 *   2. Marca nivel (info/warn/error) con prefijo consistente.
 *   3. En producción, incluye timestamp ISO.
 *   4. Trunca strings largas para no saturar Vercel logs.
 */

const MAX_LOG_LENGTH = 2000;
const SECRET_PATTERNS: Array<{ re: RegExp; replacement: string }> = [
    { re: /sk-[A-Za-z0-9]{20,}/g, replacement: 'sk-[REDACTED]' },
    { re: /Bearer\s+[A-Za-z0-9_\-\.]{16,}/g, replacement: 'Bearer [REDACTED]' },
    { re: /AIza[0-9A-Za-z_\-]{35}/g, replacement: 'AIza-[REDACTED]' },
    { re: /[A-Fa-f0-9]{64,}/g, replacement: '[HASH_REDACTED]' },
    { re: /https:\/\/[^@\s]+@[^\s]+/g, replacement: '[URL_WITH_AUTH_REDACTED]' },
];

function redact(input: string): string {
    let out = input;
    for (const { re, replacement } of SECRET_PATTERNS) {
        out = out.replace(re, replacement);
    }
    return out;
}

function truncate(input: string): string {
    if (input.length <= MAX_LOG_LENGTH) return input;
    return input.substring(0, MAX_LOG_LENGTH) + '...[truncado]';
}

function formatMsg(level: string, msg: unknown, context?: unknown): string {
    const ts = new Date().toISOString();
    const msgStr = typeof msg === 'string' ? msg : JSON.stringify(msg);
    const ctxStr = context !== undefined
        ? ' ' + (typeof context === 'string' ? context : JSON.stringify(context))
        : '';
    return `[${ts}] ${level} ${redact(truncate(msgStr))}${ctxStr}`;
}

export const logger = {
    info(msg: unknown, context?: unknown) {
        console.log(formatMsg('INFO', msg, context));
    },
    warn(msg: unknown, context?: unknown) {
        console.warn(formatMsg('WARN', msg, context));
    },
    error(msg: unknown, context?: unknown) {
        console.error(formatMsg('ERROR', msg, context));
    },
    debug(msg: unknown, context?: unknown) {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(formatMsg('DEBUG', msg, context));
        }
    },
};
