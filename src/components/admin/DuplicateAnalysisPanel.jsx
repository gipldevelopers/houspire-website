import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DuplicateGroupCard } from './DuplicateGroupCard';
import { useDuplicateAnalysis } from '@/hooks/useDuplicateAnalysis';
import { X, Search, Loader2, Clock, Calendar, Globe, Trash2, AlertTriangle, Copy, TrendingDown, Layers } from 'lucide-react';
export function DuplicateAnalysisPanel({ isOpen, onClose, onComplete }) {
    const { groups, isScanning, isDeleting, stats, scan, applyBulkAction, toggleKeep, previewDeletions, executeDeletions, reset } = useDuplicateAnalysis();
    const [showConfirm, setShowConfirm] = useState(false);
    const [displayCount, setDisplayCount] = useState(20);
    if (!isOpen)
        return null;
    const preview = previewDeletions();
    const hasResults = groups.length > 0;
    const hasUndecided = groups.some(g => g.images.some(img => img.keepAction === 'undecided'));
    const handleClose = () => {
        reset();
        setDisplayCount(20);
        onClose();
    };
    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        const result = await executeDeletions();
        if (result.success && onComplete) {
            onComplete();
        }
    };
    return (<div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 md:inset-8 lg:inset-12 bg-background border rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <Copy className="h-5 w-5 text-primary"/>
            <h2 className="text-lg font-semibold">Duplicate Image Analysis</h2>
            {hasResults && (<Badge variant="outline" className="ml-2">
                {stats.groupCount} groups found
              </Badge>)}
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5"/>
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Initial State - Scan Button */}
          {!hasResults && !isScanning && (<div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="text-center space-y-2">
                <Layers className="h-16 w-16 text-muted-foreground mx-auto mb-4"/>
                <h3 className="text-xl font-semibold">Find Duplicate Images</h3>
                <p className="text-muted-foreground max-w-md">
                  Scan your gallery to detect duplicate images uploaded with different timestamps.
                  This helps clean up storage and improve gallery organization.
                </p>
              </div>
              <Button size="lg" onClick={scan} className="gap-2">
                <Search className="h-5 w-5"/>
                Start Scan
              </Button>
            </div>)}

          {/* Scanning State */}
          {isScanning && (<div className="flex flex-col items-center justify-center h-full gap-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary"/>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Analyzing Gallery...</h3>
                <p className="text-muted-foreground">
                  Scanning all images for duplicate filenames
                </p>
              </div>
            </div>)}

          {/* Results */}
          {hasResults && !isScanning && (<div className="space-y-6">
              {/* Stats Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Layers className="h-5 w-5 text-primary"/>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.groupCount}</p>
                      <p className="text-xs text-muted-foreground">Duplicate Groups</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-destructive/10">
                      <Copy className="h-5 w-5 text-destructive"/>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.extraCopies}</p>
                      <p className="text-xs text-muted-foreground">Extra Copies</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <TrendingDown className="h-5 w-5 text-green-600"/>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.potentialReduction}%</p>
                      <p className="text-xs text-muted-foreground">Potential Reduction</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <AlertTriangle className="h-5 w-5 text-orange-600"/>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{preview.count}</p>
                      <p className="text-xs text-muted-foreground">Marked for Deletion</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Bulk Actions */}
              <Card className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium">Bulk Actions:</span>
                  <Button variant="outline" size="sm" onClick={() => applyBulkAction('oldest')} disabled={isDeleting} className="gap-1">
                    <Clock className="h-4 w-4"/>
                    Keep Oldest
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => applyBulkAction('newest')} disabled={isDeleting} className="gap-1">
                    <Calendar className="h-4 w-4"/>
                    Keep Newest
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => applyBulkAction('published')} disabled={isDeleting} className="gap-1">
                    <Globe className="h-4 w-4"/>
                    Keep Published
                  </Button>
                  <div className="flex-1"/>
                  <Button variant="destructive" size="sm" onClick={() => setShowConfirm(true)} disabled={isDeleting || preview.count === 0 || hasUndecided} className="gap-1">
                    {isDeleting ? (<Loader2 className="h-4 w-4 animate-spin"/>) : (<Trash2 className="h-4 w-4"/>)}
                    Delete {preview.count} Images
                  </Button>
                </div>
                {hasUndecided && preview.count === 0 && (<p className="text-xs text-muted-foreground mt-2">
                    Use bulk actions above or click individual images to mark which to keep
                  </p>)}
              </Card>

              {/* Duplicate Groups List */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Duplicate Groups ({groups.length})
                </h3>
                {groups.slice(0, displayCount).map((group, idx) => (<DuplicateGroupCard key={group.originalFilename} group={group} groupIndex={idx} onToggleKeep={toggleKeep}/>))}
                {displayCount < groups.length && (<div className="text-center pt-4">
                    <Button variant="outline" onClick={() => setDisplayCount(prev => prev + 20)}>
                      Load More ({groups.length - displayCount} remaining)
                    </Button>
                  </div>)}
              </div>
            </div>)}
        </div>

        {/* Footer */}
        {hasResults && (<div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min(displayCount, groups.length)} of {groups.length} duplicate groups
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { reset(); scan(); }} disabled={isScanning || isDeleting}>
                <Search className="h-4 w-4 mr-2"/>
                Re-scan
              </Button>
              <Button variant="ghost" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>)}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleConfirmDelete} title="Delete Duplicate Images?" description={`You are about to permanently delete ${preview.count} duplicate images. This action cannot be undone. At least one copy of each image will be preserved.`} confirmText={`Delete ${preview.count} Images`} cancelText="Cancel" variant="danger" loading={isDeleting}/>
    </div>);
}
