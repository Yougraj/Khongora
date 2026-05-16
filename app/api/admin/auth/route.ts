import { NextRequest, NextResponse } from 'next/server';
import {
  COOKIE_NAME,
  createAdminSessionToken,
  verifyAdminRequest,
  verifyPassword,
} from '@/lib/admin-auth';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

export async function GET(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!verifyPassword(String(password ?? ''))) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, createAdminSessionToken(), COOKIE_OPTIONS);
    return response;
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
