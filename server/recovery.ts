/**
 * Server-Side Recovery Code & Hash Utilities
 * Generates an unguessable 10-character recovery code using crypto.randomInt
 * from an unambiguous alphabet (no confusing letters like 0/O, 1/I).
 * Hashes with SHA-256 and a server-side pepper from RECOVERY_PEPPER.
 */
import crypto from 'crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 chars, no 0, O, 1, I
const isProd = process.env.NODE_ENV === 'production';

function getRecoveryPepper(): string {
  return (process.env.RECOVERY_PEPPER || '').trim();
}

// Check in production if RECOVERY_PEPPER is missing
if (isProd && !getRecoveryPepper()) {
  console.error('[Recovery Pepper] FATAL: RECOVERY_PEPPER environment variable is required in production.');
}

export function generateRecoveryCode(): string {
  const chars: string[] = [];
  for (let i = 0; i < 10; i++) {
    const idx = crypto.randomInt(0, ALPHABET.length);
    chars.push(ALPHABET[idx]);
  }
  return chars.join('');
}

export function hashRecoveryCode(code: string, customPepper?: string): string {
  const envPepper = getRecoveryPepper();
  if (isProd && !envPepper && customPepper === undefined) {
    throw new Error('FATAL: RECOVERY_PEPPER is missing in production.');
  }
  const pepper = customPepper !== undefined ? customPepper : (envPepper || 'dev_insecure_recovery_pepper_key_genovaprofile_2026');
  const normalized = (code || '').trim().toUpperCase();
  return crypto.createHash('sha256').update(`${normalized}:${pepper}`).digest('hex');
}

export function verifyRecoveryCode(inputCode: string, storedHash?: string | null, customPepper?: string): boolean {
  if (!inputCode || !storedHash) return false;
  const computed = hashRecoveryCode(inputCode, customPepper);
  const bufA = Buffer.from(computed, 'utf8');
  const bufB = Buffer.from(storedHash, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Format public customer receipt ID: GP-XXXX-XXXX-XXXX
 * Provides ~96 bits of cryptographic entropy.
 */
export function generateReceiptId(): string {
  const bytes = crypto.randomBytes(6).toString('hex').toUpperCase(); // 12 hex chars
  return `GP-${bytes.slice(0, 4)}-${bytes.slice(4, 8)}-${bytes.slice(8, 12)}`;
}
