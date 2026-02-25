import { NextResponse } from 'next/server';
import { MOCK_PROJECTS } from '@/lib/mock-data';

export async function GET(request) {
  return NextResponse.json({ projects: MOCK_PROJECTS });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ 
    project: { ...MOCK_PROJECTS[0], ...body, id: `proj-${Date.now()}` } 
  }, { status: 201 });
}
