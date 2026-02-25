import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/auth/verify-email - Verify email with token
export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find user by verification token
    // TODO: Add emailVerificationToken to User model
    const user = await prisma.user.findFirst({
      where: {
        // emailVerificationToken: token,
        emailVerified: null, // Not yet verified
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        // emailVerificationToken: null,
      },
    });

    return NextResponse.json({
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/auth/resend-verification - Resend verification email
export async function PUT(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({
        message: 'If an account exists with this email, a verification link has been sent.',
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: 'Email is already verified',
      });
    }

    // Generate verification token
    // TODO: Generate and store verification token
    // TODO: Send verification email

    return NextResponse.json({
      message: 'If an account exists with this email, a verification link has been sent.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
