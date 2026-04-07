import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Link2, Copy, Check, Eye, Download, Users, TrendingUp, X, AlertCircle, BarChart3, } from 'lucide-react';
export function ShareLinkManager({ shareId, projectId, shareToken, expiresAt, isActive, onUpdate, }) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [expiryDays, setExpiryDays] = useState('7');
    const [settingExpiry, setSettingExpiry] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const shareLink = `${window.location.origin}/shared/${shareToken}`;
    useEffect(() => {
        fetchAnalytics();
    }, [projectId]);
    const fetchAnalytics = async () => {
        try {
            const { data, error } = await appDataClient.rpc('get_project_share_analytics', {
                p_project_id: projectId,
            });
            if (error)
                throw error;
            if (data && data.length > 0) {
                setAnalytics(data[0]);
            }
        }
        catch (error) {
            console.error('Failed to fetch analytics:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
            title: 'Link copied! 📋',
        });
    };
    const handleSetExpiry = async () => {
        setSettingExpiry(true);
        try {
            const days = parseInt(expiryDays);
            const newExpiry = new Date();
            newExpiry.setDate(newExpiry.getDate() + days);
            const { data, error } = await appDataClient.rpc('update_share_expiry', {
                p_share_id: shareId,
                p_expires_at: newExpiry.toISOString(),
            });
            if (error)
                throw error;
            toast({
                title: 'Expiry updated! ⏰',
                description: `Link will expire in ${expiryDays} days`,
            });
            onUpdate?.();
        }
        catch (error) {
            toast({
                title: 'Failed to set expiry',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setSettingExpiry(false);
        }
    };
    const handleDeactivate = async () => {
        if (!confirm('Deactivate this share link? It will no longer be accessible.'))
            return;
        try {
            const { error } = await appDataClient.rpc('deactivate_share_link', {
                p_share_id: shareId,
            });
            if (error)
                throw error;
            toast({
                title: 'Link deactivated',
                description: 'This share link is no longer valid',
            });
            onUpdate?.();
        }
        catch (error) {
            toast({
                title: 'Failed to deactivate link',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const isExpired = expiresAt && new Date(expiresAt) < new Date();
    const isInactive = !isActive || isExpired;
    return (<Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link2 className="h-5 w-5"/>
          Share Link Management
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Link Status */}
        {isInactive && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5"/>
            <div>
              <p className="font-medium text-destructive">
                {isExpired ? 'Link Expired' : 'Link Deactivated'}
              </p>
              <p className="text-sm text-muted-foreground">
                This share link is no longer accessible
              </p>
            </div>
          </motion.div>)}

        {/* Share Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Share Link
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 rounded-lg bg-muted font-mono text-sm truncate">
              {shareLink}
            </div>
            <Button onClick={handleCopy} variant="outline" disabled={isInactive}>
              {copied ? (<>
                  <Check className="h-4 w-4 mr-1"/>
                  Copied
                </>) : (<>
                  <Copy className="h-4 w-4 mr-1"/>
                  Copy
                </>)}
            </Button>
          </div>
        </div>

        {/* Expiry Settings */}
        {!isInactive && (<div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Update Expiry
            </label>
            <div className="flex gap-2">
              <Select value={expiryDays} onValueChange={setExpiryDays}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSetExpiry} disabled={settingExpiry} variant="outline">
                {settingExpiry ? 'Updating...' : 'Update'}
              </Button>
            </div>

            {expiresAt && !isExpired && (<p className="text-xs text-muted-foreground">
                Current expiry: {new Date(expiresAt).toLocaleString()}
              </p>)}
          </div>)}

        {/* Deactivate Button */}
        {!isInactive && (<Button onClick={handleDeactivate} variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <X className="h-4 w-4 mr-2"/>
            Deactivate Link
          </Button>)}

        {/* Analytics */}
        {!loading && analytics && (<div className="pt-4 border-t space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="h-4 w-4"/>
              Link Analytics
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Eye className="h-4 w-4"/>
                  <span className="text-xs">Views</span>
                </div>
                <p className="text-2xl font-bold">
                  {analytics.total_views || 0}
                </p>
              </div>

              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Users className="h-4 w-4"/>
                  <span className="text-xs">Visitors</span>
                </div>
                <p className="text-2xl font-bold">
                  {analytics.unique_visitors || 0}
                </p>
              </div>

              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Download className="h-4 w-4"/>
                  <span className="text-xs">Downloads</span>
                </div>
                <p className="text-2xl font-bold">
                  {analytics.total_downloads || 0}
                </p>
              </div>
            </div>

            {analytics.avg_views_per_day > 0 && (<div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4"/>
                Average {Number(analytics.avg_views_per_day).toFixed(1)} views per day
              </div>)}
          </div>)}
      </CardContent>
    </Card>);
}

