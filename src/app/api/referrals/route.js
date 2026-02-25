import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/referrals - Get referral code and stats
export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get or create referral code
    let referralCode = await prisma.referralCode.findUnique({
      where: { userId: user.id },
    });

    if (!referralCode) {
      // Generate a unique code
      const code = `${user.email?.split('@')[0] || 'user'}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      referralCode = await prisma.referralCode.create({
        data: {
          userId: user.id,
          code,
        },
      });
    }

    // Get referral stats - find all referral usages for this user's referral code
    const referralUsage = await prisma.referralUsage.findMany({
      where: {
        referralCodeId: referralCode.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const successfulReferrals = referralUsage.filter(r => r.status === 'completed').length;
    const pendingReferrals = referralUsage.filter(r => r.status === 'pending').length;
    const totalEarnings = referralUsage
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.rewardAmount || 500), 0);

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/signup?ref=${referralCode.code}`;

    return NextResponse.json({
      code: referralCode.code,
      shareUrl,
      successfulReferrals,
      pendingReferrals,
      totalEarnings,
      referrals: referralUsage,
    });
  } catch (error) {
    console.error('Get referrals error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
