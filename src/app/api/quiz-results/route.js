import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/quiz-results - Get quiz results for current user
export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const quizResult = await prisma.quizResult.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ quizResult });
  } catch (error) {
    console.error('Get quiz results error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/quiz-results - Save quiz results
export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const quizResult = await prisma.quizResult.upsert({
      where: {
        userId: user.id,
      },
      update: {
        styles: body.styles,
        colors: body.colors,
        vibe: body.vibe,
        personality: body.personality,
        lifestyle: body.lifestyle,
        budget: body.budget,
        primaryDesigner: body.primaryDesigner,
        allMatches: body.allMatches,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        styles: body.styles,
        colors: body.colors,
        vibe: body.vibe,
        personality: body.personality,
        lifestyle: body.lifestyle,
        budget: body.budget,
        primaryDesigner: body.primaryDesigner,
        allMatches: body.allMatches,
      },
    });

    return NextResponse.json({ quizResult }, { status: 201 });
  } catch (error) {
    console.error('Save quiz results error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
