import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Upload, X, AlertCircle, Loader2 } from 'lucide-react';
export function FileUploadProgress({ files, onCancel, onRetry }) {
    if (files.length === 0)
        return null;
    const uploadingCount = files.filter(f => f.status === 'uploading').length;
    const completeCount = files.filter(f => f.status === 'complete').length;
    return (<Card>
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Upload className="h-4 w-4"/>
          Uploading Files ({completeCount}/{files.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <AnimatePresence>
          {files.map((file) => (<motion.div key={file.name} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {file.status === 'complete' ? (<CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0"/>) : file.status === 'error' ? (<AlertCircle className="h-4 w-4 text-destructive flex-shrink-0"/>) : (<Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0"/>)}
                  <span className="text-sm truncate">{file.name}</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {file.status === 'uploading' && (<span className="text-xs text-muted-foreground">{file.progress}%</span>)}
                  {file.status === 'uploading' && onCancel && (<button onClick={() => onCancel(file.name)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4"/>
                    </button>)}
                  {file.status === 'error' && onRetry && (<button onClick={() => onRetry(file.name)} className="text-xs text-primary hover:underline">
                      Retry
                    </button>)}
                </div>
              </div>

              {file.status === 'uploading' && (<Progress value={file.progress} className="h-1"/>)}

              {file.status === 'error' && file.errorMessage && (<p className="text-xs text-destructive">{file.errorMessage}</p>)}
            </motion.div>))}
        </AnimatePresence>
      </CardContent>
    </Card>);
}
