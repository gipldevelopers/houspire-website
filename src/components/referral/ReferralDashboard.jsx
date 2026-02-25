import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, Share2, Mail, TrendingUp, Users, Gift, Award, CheckCircle2, Clock, MessageCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getReferralTiers, getEnhancedReferralStats, getReferralActivity, shareReferral, calculateTierProgress } from '@/lib/referral-gamification-service';
export function ReferralDashboard() {
    const { user } = useAuth();
    const [tiers, setTiers] = useState([]);
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sharing, setSharing] = useState(false);
    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);
    async function loadData() {
        if (!user)
            return;
        setLoading(true);
        const [tiersData, statsData, activityData] = await Promise.all([
            getReferralTiers(),
            getEnhancedReferralStats(user.id),
            getReferralActivity(user.id)
        ]);
        setTiers(tiersData);
        setStats(statsData);
        setActivity(activityData);
        setLoading(false);
    }
    async function handleShare(method) {
        if (!stats)
            return;
        setSharing(true);
        const success = await shareReferral(stats.referral_code, method);
        if (success && method === 'copy') {
            toast({
                title: 'Link copied!',
                description: 'Your referral link has been copied to clipboard'
            });
        }
        setSharing(false);
    }
    function formatPrice(price) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price);
    }
    if (loading) {
        return (<div className="space-y-6">
        <Skeleton className="h-32 w-full"/>
        <Skeleton className="h-48 w-full"/>
        <Skeleton className="h-64 w-full"/>
      </div>);
    }
    if (!stats) {
        return (<Card className="p-8 text-center">
        <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Referral Code Yet</h3>
        <p className="text-muted-foreground mb-4">
          Complete your first order to get your referral code
        </p>
        <Button onClick={() => window.location.href = '/select-package'}>
          Start Your Project
        </Button>
      </Card>);
    }
    const { currentTier, nextTier, progress } = calculateTierProgress(stats.successful_referrals, tiers);
    return (<div className="space-y-6">
      {/* Header with Tier Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Referral Program</h2>
          <p className="text-muted-foreground">
            Invite friends and earn rewards
          </p>
        </div>
        {currentTier && (<Badge className="text-lg py-1.5 px-3" style={{ backgroundColor: currentTier.badge_color + '20', color: currentTier.badge_color }}>
            {currentTier.badge_icon} {currentTier.tier.toUpperCase()}
          </Badge>)}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="h-4 w-4"/>
            <span className="text-sm">Total Referrals</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.successful_referrals}</p>
          <p className="text-xs text-muted-foreground">{stats.pending_referrals} pending</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Gift className="h-4 w-4"/>
            <span className="text-sm">Total Earnings</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatPrice(stats.total_earnings)}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Award className="h-4 w-4"/>
            <span className="text-sm">Per Referral</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatPrice(currentTier?.reward_per_referral || 500)}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4"/>
            <span className="text-sm">Next Tier</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {nextTier ? `${stats.next_tier?.referrals_needed} more` : 'Max!'}
          </p>
        </Card>
      </div>

      {/* Share Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Share Your Referral Link</h3>
        
        <div className="flex gap-2 mb-4">
          <Input value={stats.share_url} readOnly className="bg-muted"/>
          <Button variant="outline" onClick={() => handleShare('copy')} disabled={sharing}>
            <Copy className="h-4 w-4"/>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => handleShare('whatsapp')} className="flex-1 min-w-[120px]">
            <MessageCircle className="h-4 w-4 mr-2"/>
            WhatsApp
          </Button>
          <Button variant="outline" onClick={() => handleShare('email')} className="flex-1 min-w-[120px]">
            <Mail className="h-4 w-4 mr-2"/>
            Email
          </Button>
          <Button variant="outline" onClick={() => handleShare('twitter')} className="flex-1 min-w-[120px]">
            <Share2 className="h-4 w-4 mr-2"/>
            Twitter
          </Button>
        </div>
      </Card>

      {/* Progress to Next Tier */}
      {nextTier && (<Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">
              Progress to {nextTier.tier.toUpperCase()} Tier
            </h3>
            <Badge variant="secondary">
              {stats.next_tier?.referrals_needed} more referrals
            </Badge>
          </div>
          <Progress value={progress} className="h-3 mb-3"/>
          <p className="text-sm text-muted-foreground">
            Unlock {formatPrice(nextTier.bonus_reward)} bonus when you reach {nextTier.tier} tier!
          </p>
        </Card>)}

      {/* Tier Benefits */}
      <div className="grid md:grid-cols-4 gap-4">
        {tiers.map(tier => {
            const isCurrentTier = tier.tier === currentTier?.tier;
            const isUnlocked = stats.successful_referrals >= tier.min_referrals;
            return (<Card key={tier.id} className={`p-4 relative ${isCurrentTier ? 'ring-2 ring-primary' : ''} ${!isUnlocked ? 'opacity-60' : ''}`}>
              <div className="text-center mb-3">
                <span className="text-3xl">{tier.badge_icon}</span>
                <h4 className="font-semibold text-foreground capitalize mt-1">{tier.tier}</h4>
                <p className="text-xs text-muted-foreground">{tier.min_referrals}+ referrals</p>
              </div>

              <div className="text-center mb-3">
                <p className="text-lg font-bold text-foreground">
                  {formatPrice(tier.reward_per_referral)}
                </p>
                <p className="text-xs text-muted-foreground">per referral</p>
                {tier.bonus_reward > 0 && (<Badge variant="secondary" className="mt-1 text-xs">
                    +{formatPrice(tier.bonus_reward)} bonus
                  </Badge>)}
              </div>

              {isCurrentTier && (<Badge className="absolute -top-2 -right-2 bg-primary">
                  Current
                </Badge>)}
            </Card>);
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Recent Referrals</h3>
        
        {activity.length === 0 ? (<p className="text-center text-muted-foreground py-8">
            No referrals yet. Start sharing your link!
          </p>) : (<div className="space-y-3">
            {activity.map(item => (<div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  {item.status === 'completed' ? (<CheckCircle2 className="h-5 w-5 text-emerald-500"/>) : (<Clock className="h-5 w-5 text-amber-500"/>)}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.status === 'completed' ? 'Successful Referral' : 'Pending'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })}
                    </p>
                  </div>
                </div>

                <Badge variant={item.status === 'completed' ? 'default' : 'secondary'} className={item.status === 'completed' ? 'bg-emerald-500' : ''}>
                  {item.status === 'completed' ? 'Earned' : 'Pending'}
                </Badge>
              </div>))}
          </div>)}
      </Card>
    </div>);
}
