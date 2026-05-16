import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest } from 'next/server';

const COOKIE_NAME = 'khongora_admin';
const SESSION_SALT = 'khongora-admin-v1';

export function getAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD ?? 'khongora-admin').trim();
}

export function createAdminSessionToken(): string {
  return createHmac('sha256', getAdminPassword())
    .update(SESSION_SALT)
    .digest('hex');
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = createAdminSessionToken();
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifyPassword(input: string): boolean {
  const password = input.trim();
  const expected = getAdminPassword();
  if (password.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifyAdminRequest(request: NextRequest): boolean {
  const header = request.headers.get('x-admin-key');
  if (header && verifyPassword(header)) return true;
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  return verifySessionToken(cookie);
}

export { COOKIE_NAME };
