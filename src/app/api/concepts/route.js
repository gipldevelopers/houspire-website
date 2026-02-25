import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/concepts - Get concepts for a project
export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const concepts = await prisma.concept.findMany({
      where: { projectId },
      include: {
        conceptProducts: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ concepts });
  } catch (error) {
    console.error('Get concepts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/concepts - Create a new concept
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

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: body.projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const concept = await prisma.concept.create({
      data: {
        projectId: body.projectId,
        conceptName: body.conceptName || 'Concept 1',
        styleDirection: body.styleDirection,
        estimatedBudget: body.estimatedBudget || 100000,
        renderUrls: body.renderUrls || [],
        designerMessage: body.designerMessage,
      },
      include: {
        conceptProducts: true,
      },
    });

    return NextResponse.json({ concept }, { status: 201 });
  } catch (error) {
    console.error('Create concept error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
