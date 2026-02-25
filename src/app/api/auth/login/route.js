import { NextResponse } from 'next/server';
import { MOCK_USER } from '@/lib/mock-data';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Mock successful login for any credentials
    return NextResponse.json({
      user: MOCK_USER,
      token: 'mock-jwt-token-for-demo',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
