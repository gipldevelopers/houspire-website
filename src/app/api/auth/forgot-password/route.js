import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// POST /api/auth/forgot-password - Send password reset email
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      // Still return success to prevent email enumeration
      return NextResponse.json({
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

    // Store reset token (you'll need to add resetToken and resetTokenExpiry fields to User model)
    // For now, we'll use a separate table or store in a cache
    // TODO: Add resetToken and resetTokenExpiry to User model in Prisma schema

    // Send email with reset link
    // TODO: Implement email sending (Resend, SendGrid, etc.)
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    
    console.log('Password reset link:', resetLink); // Remove in production

    // In production, send email here:
    // await sendEmail({
    //   to: email,
    //   subject: 'Reset your password',
    //   html: `Click here to reset your password: ${resetLink}`
    // });

    return NextResponse.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
