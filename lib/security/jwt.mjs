import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

if (!SECRET && process.env.NODE_ENV === 'production') {
  throw new Error(
    'JWT_SECRET is not set. Refusing to start in production without a real secret — set JWT_SECRET in your environment.'
  );
}

if (!SECRET) {
  console.warn(
    '[security] WARNING: JWT_SECRET is not set. Using an insecure development-only fallback. Set JWT_SECRET in .env.local before deploying.'
  );
}

const effectiveSecret = SECRET || 'dev-only-insecure-fallback';

export function verifyJwt(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, effectiveSecret);
  } catch {
    return null;
  }
}