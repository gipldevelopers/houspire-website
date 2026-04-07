import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Clock, Download, Eye, X, History } from 'lucide-react';
export function RenderVersionHistory({ projectId, currentVersion = 1, className = '', }) {
    const { toast } = useToast();
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewVersion, setPreviewVersion] = useState(null);
    useEffect(() => {
        fetchVersions();
    }, [projectId]);
    const fetchVersions = async () => {
        try {
            const { data, error } = await appDataClient
                .from('render_versions')
                .select('*')
                .eq('project_id', projectId)
                .order('version_number', { ascending: false });
            if (error)
                throw error;
            setVersions(data || []);
        }
        catch (error) {
            console.error('Failed to load version history:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDownload = async (version) => {
        try {
            const response = await fetch(version.render_url);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `render-v${version.version_number}${version.view_name ? `-${version.view_name}` : ''}.png`;
            a.click();
            URL.revokeObjectURL(url);
            toast({
                title: 'Downloaded! 📥',
                description: `Version ${version.version_number} saved`,
            });
        }
        catch (error) {
            toast({
                title: 'Download failed',
                variant: 'destructive',
            });
        }
    };
    if (loading) {
        return (<Card className={`p-6 ${className}`}>
        <div className="flex items-center gap-3 animate-pulse">
          <div className="h-5 w-5 bg-muted rounded"/>
          <div className="h-5 w-32 bg-muted rounded"/>
        </div>
      </Card>);
    }
    if (versions.length === 0) {
        return (<Card className={`p-6 text-center ${className}`}>
        <History className="h-8 w-8 text-muted-foreground mx-auto mb-2"/>
        <p className="text-muted-foreground">No version history yet</p>
      </Card>);
    }
    return (<Card className={`overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground"/>
          <h3 className="font-semibold text-foreground">Version History</h3>
          <Badge variant="secondary">
            {versions.length} version{versions.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <Badge variant="outline">
          Current: v{currentVersion}
        </Badge>
      </div>

      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {versions.map((version, index) => (<motion.div key={version.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
            {/* Thumbnail */}
            <button onClick={() => setPreviewVersion(version)} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 group border border-border">
              <img src={version.render_url} alt={`Version ${version.version_number}`} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="h-5 w-5 text-white"/>
              </div>
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  Version {version.version_number}
                </span>
                {version.version_number === currentVersion && (<Badge variant="default" className="text-xs">
                    Current
                  </Badge>)}
                {version.view_name && (<Badge variant="outline" className="text-xs">
                    {version.view_name}
                  </Badge>)}
              </div>

              {version.changes_description && (<p className="text-sm text-muted-foreground mt-1 truncate">
                  {version.changes_description}
                </p>)}

              <p className="text-xs text-muted-foreground mt-1">
                {new Date(version.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })}
              </p>
            </div>

            {/* Actions */}
            <Button onClick={() => handleDownload(version)} variant="outline" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
              <Download className="h-4 w-4"/>
            </Button>
          </motion.div>))}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewVersion && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewVersion(null)} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <Button onClick={() => setPreviewVersion(null)} variant="ghost" size="sm" className="absolute top-4 right-4 text-white hover:bg-white/20">
              <X className="h-5 w-5"/>
            </Button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Version {previewVersion.version_number}
                </h3>
                {previewVersion.view_name && (<Badge variant="secondary">{previewVersion.view_name}</Badge>)}
              </div>

              <img src={previewVersion.render_url} alt={`Version ${previewVersion.version_number}`} className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}/>

              {previewVersion.changes_description && (<p className="text-muted-foreground mt-4 max-w-lg mx-auto">
                  {previewVersion.changes_description}
                </p>)}

              <p className="text-sm text-muted-foreground mt-2">
                {new Date(previewVersion.created_at).toLocaleDateString()}
              </p>
            </div>
          </motion.div>)}
      </AnimatePresence>
    </Card>);
}

