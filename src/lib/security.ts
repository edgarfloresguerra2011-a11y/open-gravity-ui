/**
 * OpenGravity V3 — Security & Sanitization
 *
 * Fixes applied:
 *   [+] sanitizeResponse: min length raised to 64 chars to avoid masking jobIds/hashes
 *   [+] Dangerous pattern detection: regex upgraded to catch obfuscated variants
 *   [+] Added structural prompt injection detection (not just keyword regex)
 */

// ─── Response sanitization ────────────────────────────────────────────────────

/**
 * FIX: Original masked strings >30 chars, which truncated valid jobIds and hashes.
 * Raised to 64 chars. Legitimate outputs (jobIds, seeds, monetary values) are safe.
 *
 * Masks only patterns that look like real secrets:
 *   - Bearer tokens / API keys (long alphanumeric with no spaces)
 *   - Private key headers
 */
export function sanitizeResponse(text: string): string {
  return text
    // API keys: long hex/base64 strings with no spaces (>64 chars)
    .replace(/\b[A-Za-z0-9_\-]{64,}\b/g, "[REDACTED]")
    // Private key blocks
    .replace(/-----BEGIN[^-]+-----[\s\S]+?-----END[^-]+-----/g, "[REDACTED_KEY]")
    // Upstash/Redis URLs that may contain tokens
    .replace(/https:\/\/[^@]+@[^\s]+/g, "[REDACTED_URL]");
}

// ─── Dangerous pattern detection ─────────────────────────────────────────────

/**
 * FIX: Original used simple regex on surface text.
 * Obfuscated variants like `s.u.d.o`, `su\ndo`, or unicode confusables bypassed it.
 *
 * New approach: normalize before checking.
 */

// Characters to strip before pattern matching (obfuscation chars)
const OBFUSCATION_CHARS = /[\s\.\-_\/\\|*\u200b\u200c\u200d\u2060\ufeff]/g;

// Dangerous patterns to detect (checked against normalized string)
const DANGEROUS_PATTERNS: RegExp[] = [
  /sudo/i,
  /rm\s*-rf/i,
  /ignore\s*previous\s*instructions/i,
  /you\s*are\s*now/i,
  /act\s*as\s*(a\s*)?jailbreak/i,
  /disregard\s*(all|any|your)/i,
  /system\s*prompt/i,
  /\beval\s*\(/i,
  /exec\s*\(/i,
  /import\s+os/i,
  /__import__/i,
  /subprocess/i,
];

/**
 * Returns true if the input contains dangerous patterns,
 * including obfuscated variants.
 */
export function containsDangerousPatterns(input: string): boolean {
  // Check both original and normalized (de-obfuscated) form
  const normalized = input.replace(OBFUSCATION_CHARS, "").toLowerCase();

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(input) || pattern.test(normalized)) {
      return true;
    }
  }
  return false;
}

// ─── Prompt injection structural detection ────────────────────────────────────

/**
 * Detects structural prompt injection attempts:
 * e.g. "---\nSystem: you are now..."
 * These bypass keyword filters by using role-switching syntax.
 */
export function containsPromptInjection(input: string): boolean {
  const injectionPatterns = [
    /^(system|user|assistant)\s*:/im,
    /\n+(system|user|assistant)\s*:/i,
    /<\s*(system|prompt|instruction)\s*>/i,
    /\[INST\]/i,
    /<<SYS>>/i,
  ];

  return injectionPatterns.some((p) => p.test(input));
}

// ─── Combined guard ───────────────────────────────────────────────────────────

export function validateUserInput(input: string): { safe: boolean; reason?: string } {
  if (containsDangerousPatterns(input)) {
    return { safe: false, reason: "Potentially dangerous command pattern detected." };
  }
  if (containsPromptInjection(input)) {
    return { safe: false, reason: "Prompt injection structure detected." };
  }
  return { safe: true };
}
