import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Example: Get all projects
    // const projects = await prisma.project.findMany();
    
    return NextResponse.json({ 
      message: 'API is working!',
      // data: projects 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Example: Create a project
    // const project = await prisma.project.create({
    //   data: body
    // });
    
    return NextResponse.json({ 
      message: 'POST request received',
      // data: project 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
