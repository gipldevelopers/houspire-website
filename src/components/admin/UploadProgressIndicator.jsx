import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader2 } from 'lucide-react';
export default function UploadProgressIndicator({ progress }) {
    const isComplete = progress.percentage === 100;
    return (<Card className="p-6 bg-primary/5 border-primary/20">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          {isComplete ? (<CheckCircle2 className="h-6 w-6 text-emerald-500"/>) : (<Loader2 className="h-6 w-6 text-primary animate-spin"/>)}
          <div>
            <h4 className="font-semibold text-foreground">
              {isComplete ? 'Upload Complete!' : 'Uploading Designs...'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {isComplete
            ? 'All files uploaded successfully'
            : `Uploading file ${progress.current} of ${progress.total}`}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress.percentage}%</span>
          </div>
          <Progress value={progress.percentage} className="h-2"/>
        </div>

        {/* Current File */}
        {!isComplete && progress.currentFile && (<div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin"/>
            <span className="truncate">{progress.currentFile}</span>
          </div>)}

        {/* Complete Message */}
        {isComplete && (<div className="pt-2 border-t border-primary/10">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Files uploaded successfully
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Notifying customer and updating order status...
            </p>
          </div>)}
      </div>
    </Card>);
}
