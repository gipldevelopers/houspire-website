import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/orders/[id] - Get a single order
export async function GET(request, { params }) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        project: {
          include: {
            concepts: {
              include: {
                conceptProducts: true,
              },
            },
          },
        },
        orderAddons: true,
        orderMilestones: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update an order
export async function PATCH(request, { params }) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const order = await prisma.order.updateMany({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: body,
    });

    if (order.count === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id: params.id },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
