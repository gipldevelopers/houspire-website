import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Globe, Clock, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
export function DuplicateGroupCard({ group, groupIndex, onToggleKeep }) {
    const hasDecisions = group.images.every(img => img.keepAction !== 'undecided');
    const keepCount = group.images.filter(img => img.keepAction === 'keep').length;
    const deleteCount = group.images.filter(img => img.keepAction === 'delete').length;
    return (<Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-muted-foreground"/>
          <span className="font-medium text-sm truncate max-w-[300px]" title={group.originalFilename}>
            {group.originalFilename}
          </span>
          <Badge variant="secondary" className="text-xs">
            {group.duplicateCount} copies
          </Badge>
        </div>
        {hasDecisions && (<div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-green-600">Keep: {keepCount}</span>
            <span className="text-destructive">Delete: {deleteCount}</span>
          </div>)}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {group.images.map((image, imageIndex) => (<div key={image.id} className={cn("relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer group", image.keepAction === 'keep' && "border-green-500 ring-2 ring-green-500/20", image.keepAction === 'delete' && "border-destructive ring-2 ring-destructive/20 opacity-60", image.keepAction === 'undecided' && "border-border hover:border-muted-foreground")} onClick={() => onToggleKeep(groupIndex, imageIndex)}>
            {/* Image Thumbnail */}
            <div className="aspect-square bg-muted relative">
              <img src={image.url} alt={image.title} className="w-full h-full object-cover" loading="lazy" onError={(e) => {
                e.target.src = '/placeholder.svg';
            }}/>
              
              {/* Published Badge */}
              {image.isPublished && (<div className="absolute top-1 right-1">
                  <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-green-600">
                    <Globe className="h-2.5 w-2.5 mr-0.5"/>
                    Published
                  </Badge>
                </div>)}

              {/* Action Overlay */}
              <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity", image.keepAction === 'keep' && "bg-green-500/20", image.keepAction === 'delete' && "bg-destructive/20")}>
                {image.keepAction === 'keep' && (<div className="bg-green-500 text-white rounded-full p-2">
                    <Check className="h-5 w-5"/>
                  </div>)}
                {image.keepAction === 'delete' && (<div className="bg-destructive text-white rounded-full p-2">
                    <X className="h-5 w-5"/>
                  </div>)}
              </div>

              {/* Hover Instruction */}
              {image.keepAction === 'undecided' && (<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Click to Keep</span>
                </div>)}
            </div>

            {/* Metadata */}
            <div className="p-2 space-y-1 bg-card">
              <p className="text-xs font-medium truncate" title={image.title}>
                {image.title || 'Untitled'}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3"/>
                {format(new Date(image.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
          </div>))}
      </div>

      {!hasDecisions && (<p className="text-xs text-muted-foreground mt-3 text-center">
          Click on an image to mark it as "Keep" — all others will be marked for deletion
        </p>)}
    </Card>);
}
