import { NextResponse } from 'next/server';
import { MOCK_ORDERS } from '@/lib/mock-data';

export async function GET(request) {
  return NextResponse.json({ orders: MOCK_ORDERS });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ 
    order: { ...MOCK_ORDERS[0], ...body, id: `ord-${Date.now()}` } 
  }, { status: 201 });
}
