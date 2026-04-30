'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { dataGet } from '@/lib/frontend-data';
import { useToast } from '@/hooks/use-toast';
import {
  Gift,
  Users,
  Copy,
  Share2,
  Mail,
  MessageCircle,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle,
  Award,
  Check,
} from 'lucide-react';

export default function Referrals() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);
  const [credits, setCredits] = useState([]);
  const [copied, setCopied] = useState(false);

  const fetchReferralData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get referral stats
      const referralData = await dataGet('/referrals');
      setStats(referralData);
      setReferrals(referralData.referrals || []);

      // Get credits
      const creditsData = await dataGet('/referrals/credits');
      setCredits(creditsData.credits || []);
    } catch (error) {
      console.error('Error loading referral data:', error);
      toast({
        title: 'Error loading referral data',
        description: error.message || 'Failed to load referral information',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      fetchReferralData();
      return;
    }

    setLoading(false);
    setStats(null);
    setReferrals([]);
    setCredits([]);
  }, [user, authLoading]);

  const copyReferralLink = async () => {
    if (!stats?.shareUrl) return;
    try {
      await navigator.clipboard.writeText(stats.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Link copied! 📋',
        description: 'Share it with your friends',
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the link manually',
        variant: 'destructive',
      });
    }
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `🏠 I've been using Houspire for interior design and it's been great!\n\nThey create photorealistic room designs, itemized budgets, and connect you with verified contractors — all delivered in 72 hours.\n\nUse my code "${stats?.code}" for ₹500 OFF your first project!\n\n${stats?.shareUrl}`
    );
    window.open(`https://wa.me/?text=${message}`);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Get ₹500 OFF Professional Interior Design');
    const body = encodeURIComponent(
      `Hey!\n\nI've been using Houspire for interior design — they deliver photorealistic room designs, detailed budgets, and verified contractor contacts within 72 hours.\n\nUse my referral code "${stats?.code}" to get ₹500 OFF your first project.\n\nCheck it out: ${stats?.shareUrl}\n\nHappy designing!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-8" style={{ backgroundColor: "var(--color-primary-1)" }}>
        <SEOHead
          title="Refer & Earn | Houspire"
          description="Invite friends to Houspire and both of you get rewards. Learn how the referral program works."
        />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="p-8 text-center">
              <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2 tracking-tight" style={{ color: "var(--color-primary-2)" }}>Refer Friends, Earn Rewards</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Share Houspire with friends. They get a discount on their first project and you earn referral credits when they complete payment.
              </p>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-5">
                <IndianRupee className="h-8 w-8 text-primary mb-3" />
                <h2 className="font-bold tracking-tight mb-1" style={{ color: "var(--color-primary-2)" }}>You Earn Rs500</h2>
                <p className="text-sm text-muted-foreground">
                  Get referral credit for each successful referral.
                </p>
              </Card>
              <Card className="p-5">
                <Users className="h-8 w-8 text-primary mb-3" />
                <h2 className="font-bold tracking-tight mb-1" style={{ color: "var(--color-primary-2)" }}>Friends Save Rs500</h2>
                <p className="text-sm text-muted-foreground">
                  Your friend gets an instant discount using your code.
                </p>
              </Card>
              <Card className="p-5">
                <Award className="h-8 w-8 text-primary mb-3" />
                <h2 className="font-bold tracking-tight mb-1" style={{ color: "var(--color-primary-2)" }}>Grow Your Tier</h2>
                <p className="text-sm text-muted-foreground">
                  More referrals unlock better rewards and bonuses.
                </p>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="font-bold tracking-tight mb-4" style={{ color: "var(--color-primary-2)" }}>How it works</h2>
              <div className="grid md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                <p>1. Sign in and get your unique referral link.</p>
                <p>2. Share it on WhatsApp, email, or social media.</p>
                <p>3. Earn credits after your friend completes payment.</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="btn-primary" onClick={() => router.push('/login')}>Sign In to Start Referring</button>
                <button className="btn-secondary" onClick={() => router.push('/signup')}>Create Account</button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Refer & Earn | Houspire"
        description="Share Houspire with friends and earn rewards. Get ₹500 for every friend who signs up!"
      />
      
      <div className="min-h-screen pt-20 pb-8" style={{ backgroundColor: "var(--color-primary-1)" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <Gift className="h-4 w-4" />
                Referral Program
              </div>
              <h1 className="text-4xl font-bold mb-2 tracking-tight" style={{ color: "var(--color-primary-2)" }}>
                Refer & Earn
              </h1>
              <p className="text-lg text-muted-foreground">
                Share Houspire with friends and earn rewards together!
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">₹{stats?.totalEarnings || 0}</p>
                <p className="text-sm text-muted-foreground">Total Earned</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold">{stats?.successfulReferrals || 0}</p>
                <p className="text-sm text-muted-foreground">Successful</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold">{stats?.pendingReferrals || 0}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold">Bronze</p>
                <p className="text-sm text-muted-foreground">Current Tier</p>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Referral Code Card */}
                <Card className="p-6">
                  <h2 className="font-bold tracking-tight mb-4" style={{ color: "var(--color-primary-2)" }}>Your Referral Link</h2>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <Input
                      value={stats?.shareUrl || 'Loading...'}
                      readOnly
                      className="flex-1 bg-muted/50 text-sm"
                    />
                    <button onClick={copyReferralLink} className="btn-primary shrink-0">
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={shareViaWhatsApp} className="btn-secondary w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </button>
                    <button onClick={shareViaEmail} className="btn-secondary w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </button>
                    <button onClick={copyReferralLink} className="btn-secondary w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </button>
                  </div>
                </Card>

                {/* Referral History */}
                <Card className="p-6">
                  <h2 className="font-bold tracking-tight mb-4" style={{ color: "var(--color-primary-2)" }}>Referral History</h2>
                  {referrals.length > 0 ? (
                    <div className="space-y-3">
                      {referrals.map(referral => (
                        <div
                          key={referral.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div>
                            <p className="font-medium">
                              {referral.user?.name || referral.user?.email || 'Referral'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(referral.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            className={
                              referral.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {referral.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="font-medium">No referrals yet</p>
                      <p className="text-sm">
                        Start sharing your code to earn rewards!
                      </p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* How it Works */}
                <Card className="p-6">
                  <h2 className="font-bold tracking-tight mb-4" style={{ color: "var(--color-primary-2)" }}>How It Works</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        1
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Share your unique referral link
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        2
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Friend signs up and completes payment
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        3
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You both get rewards based on your tier!
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Credits */}
                <Card className="p-6">
                  <h2 className="font-bold tracking-tight mb-4" style={{ color: "var(--color-primary-2)" }}>Your Credits</h2>
                  {credits.length > 0 ? (
                    <div className="space-y-3">
                      {credits.slice(0, 5).map(credit => (
                        <div
                          key={credit.id}
                          className="flex items-center justify-between p-2 rounded border"
                        >
                          <div>
                            <p className="text-sm font-medium">{credit.description || credit.source}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(credit.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="font-bold text-green-600">
                            +₹{credit.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No credits yet</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Terms */}
            <Card className="p-6">
              <h2 className="font-bold tracking-tight mb-4" style={{ color: "var(--color-primary-2)" }}>Program Terms</h2>
              <div className="text-sm text-muted-foreground grid md:grid-cols-2 gap-2">
                <p>• Rewards based on your current tier level</p>
                <p>• Credits are valid for 1 year from date of issue</p>
                <p>• Credits can be used on any Houspire package</p>
                <p>• No limit on number of referrals</p>
                <p>• Credits are issued after friend completes payment</p>
                <p>• Self-referrals and fake accounts are not allowed</p>
                <p>• Tier bonuses awarded at milestone completion</p>
                <p>• Referral links expire after 90 days of inactivity</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}


