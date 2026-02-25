import { NextResponse } from 'next/server';
import { MOCK_USER } from '@/lib/mock-data';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      user: {
        ...MOCK_USER,
        name: name || MOCK_USER.profile.fullName
      },
      token: 'mock-jwt-token-for-demo',
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
