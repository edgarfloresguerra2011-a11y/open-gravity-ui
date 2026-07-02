/**
 * OpenGravity — Storage Layer Central.
 *
 * FIX M1: Este archivo antes era un stub roto que hacia `export const db = {} as any`
 * y `/api/health` lo llamaba y crasheaba en runtime porque `{}.collection()` no existe.
 *
 * Ahora re-exporta desde storage.ts (Upstash Redis) para mantener compatibilidad
 * con cualquier código que aún importe desde firebaseAdmin.
 *
 * Si en el futuro se quiere usar Firebase Admin de verdad, este es el lugar
 * para inicializarlo — pero mientras tanto, todo pasa por Redis.
 */

export { db, getIsMock } from './storage';
