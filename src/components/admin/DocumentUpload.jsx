import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, FileText, Download, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateDocumentFile, formatFileSize } from '@/lib/upload-validation';
export default function DocumentUpload({ title, description, icon, file, onChange, acceptedFormats = '.pdf,.xlsx,.xls,.csv', required = true }) {
    const { toast } = useToast();
    const [dragActive, setDragActive] = useState(false);
    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        }
        else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);
    const handleDrop = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFile(e.dataTransfer.files[0]);
        }
    }, []);
    const handleFileInput = useCallback(async (e) => {
        if (e.target.files && e.target.files[0]) {
            await handleFile(e.target.files[0]);
        }
    }, []);
    async function handleFile(newFile) {
        // Validate file
        const validation = validateDocumentFile(newFile);
        if (!validation.valid) {
            toast({
                variant: 'destructive',
                title: 'Invalid file',
                description: 'error' in validation ? validation.error : 'Invalid file'
            });
            return;
        }
        onChange(newFile);
        toast({
            title: 'File added',
            description: `${newFile.name} added successfully`
        });
    }
    function handleRemove() {
        onChange(null);
    }
    function handleDownload() {
        if (file) {
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }
    return (<Card className="p-6">
      <div className="flex items-start gap-4 mb-4">
        {icon && (<div className="p-3 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>)}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">{title}</h4>
            {required && <Badge variant="secondary">Required</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {!file ? (
        // Upload Zone
        <div className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'}
          `} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => document.getElementById(`doc-upload-${title}`)?.click()}>
          <input id={`doc-upload-${title}`} type="file" className="hidden" accept={acceptedFormats} onChange={handleFileInput}/>

          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary"/>
            </div>

            <div>
              <p className="font-medium text-foreground">
                {dragActive ? 'Drop file here' : 'Drag & drop document here'}
              </p>
              <p className="text-sm text-muted-foreground">or</p>
            </div>

            <div>
              <Button variant="outline" size="sm" onClick={(e) => {
                e.stopPropagation();
                document.getElementById(`doc-upload-${title}`)?.click();
            }}>
                <FileText className="h-4 w-4 mr-2"/>
                Browse Files
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Accepted formats: PDF, Excel, CSV</p>
              <p>Maximum file size: 10MB</p>
            </div>
          </div>
        </div>) : (
        // Uploaded File Display
        <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400"/>
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground"/>
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • Ready to upload
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4"/>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleRemove} className="text-destructive hover:text-destructive">
                  <X className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>)}
    </Card>);
}
