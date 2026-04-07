import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { appDataClient } from '@/lib/static-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { X, Link2, Copy, Share2, Eye, Calendar, Lock, Download, CheckCircle, Loader2, } from 'lucide-react';
export function ShareProjectModal({ projectId, onClose }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [settings, setSettings] = useState({
        password: '',
        expiresInDays: '7',
        maxViews: '',
        allowDownload: true,
    });
    const handleCreateShare = async () => {
        setLoading(true);
        try {
            const expiresInDays = parseInt(settings.expiresInDays);
            const expiresAt = expiresInDays > 0
                ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
                : null;
            const maxViews = settings.maxViews ? parseInt(settings.maxViews) : null;
            const { data, error } = await appDataClient
                .from('project_shares')
                .insert({
                project_id: projectId,
                created_by: user?.id,
                password: settings.password || null,
                expires_at: expiresAt,
                max_views: maxViews,
                allow_download: settings.allowDownload,
                share_token: crypto.randomUUID().replace(/-/g, '').slice(0, 24),
            })
                .select()
                .single();
            if (error)
                throw error;
            const url = `${window.location.origin}/shared/${data.share_token}`;
            setShareUrl(url);
            toast({
                title: 'Share link created! 🔗',
                description: 'Your project is ready to share',
            });
        }
        catch (error) {
            toast({
                title: 'Failed to create share link',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast({
            title: 'Link copied! 📋',
            description: 'Share link has been copied to clipboard',
        });
        setTimeout(() => setCopied(false), 2000);
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5"/>
            Share Project
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4"/>
          </Button>
        </CardHeader>

        <CardContent>
          {!shareUrl ? (<div className="space-y-6">
              {/* Password Protection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4"/>
                  Password Protection (Optional)
                </Label>
                <Input type="password" placeholder="Enter password" value={settings.password} onChange={(e) => setSettings({ ...settings, password: e.target.value })}/>
                <p className="text-xs text-muted-foreground">
                  Add a password to restrict access
                </p>
              </div>

              {/* Expiry */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4"/>
                  Link Expires In
                </Label>
                <Select value={settings.expiresInDays} onValueChange={(value) => setSettings({ ...settings, expiresInDays: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="0">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max Views */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Eye className="h-4 w-4"/>
                  Maximum Views (Optional)
                </Label>
                <Input type="number" placeholder="No limit" value={settings.maxViews} onChange={(e) => setSettings({ ...settings, maxViews: e.target.value })}/>
                <p className="text-xs text-muted-foreground">
                  Limit how many times this link can be viewed
                </p>
              </div>

              {/* Allow Download */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-muted-foreground"/>
                  <div>
                    <p className="font-medium">Allow Downloads</p>
                    <p className="text-sm text-muted-foreground">
                      Let viewers download project files
                    </p>
                  </div>
                </div>
                <Switch checked={settings.allowDownload} onCheckedChange={(checked) => setSettings({ ...settings, allowDownload: checked })}/>
              </div>

              {/* Create Button */}
              <Button onClick={handleCreateShare} disabled={loading} className="w-full h-12">
                {loading ? (<>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                    Creating Link...
                  </>) : (<>
                    <Link2 className="h-4 w-4 mr-2"/>
                    Create Share Link
                  </>)}
              </Button>
            </div>) : (<div className="space-y-6">
              {/* Success State */}
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400"/>
                </div>
                <h3 className="text-lg font-semibold mb-2">Share Link Created!</h3>
                <p className="text-sm text-muted-foreground">
                  Anyone with this link can view your project
                </p>
              </div>

              {/* Share URL */}
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="font-mono text-sm"/>
                <Button onClick={handleCopy} variant="outline">
                  {copied ? (<>
                      <CheckCircle className="h-4 w-4 mr-1"/>
                      Copied!
                    </>) : (<>
                      <Copy className="h-4 w-4 mr-1"/>
                      Copy
                    </>)}
                </Button>
              </div>

              {/* Settings Summary */}
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2">Link Settings:</p>
                <div className="flex flex-wrap gap-2">
                  {settings.password && (<Badge variant="outline" className="gap-1">
                      <Lock className="h-3 w-3"/>
                      Password Protected
                    </Badge>)}
                  {parseInt(settings.expiresInDays) > 0 && (<Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3"/>
                      Expires in {settings.expiresInDays} days
                    </Badge>)}
                  {settings.maxViews && (<Badge variant="outline" className="gap-1">
                      <Eye className="h-3 w-3"/>
                      Max {settings.maxViews} views
                    </Badge>)}
                  {settings.allowDownload && (<Badge variant="outline" className="gap-1">
                      <Download className="h-3 w-3"/>
                      Downloads Enabled
                    </Badge>)}
                </div>
              </div>

              <Button onClick={onClose} variant="outline" className="w-full h-12">
                Done
              </Button>
            </div>)}
        </CardContent>
      </Card>
    </div>);
}

