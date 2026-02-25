import { NextResponse } from 'next/server';
import { MOCK_USER } from '@/lib/mock-data';

export async function GET(request) {
  return NextResponse.json({ user: MOCK_USER });
}
