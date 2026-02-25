import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Eye, Trash2, Send, CheckCircle, Image, FileText, Loader2, } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
export function ContentUploader({ projectId, conceptId, bucket, contentType = 'render', acceptedTypes = ['image/*'], maxFiles = 10, title, description, onUploadComplete, }) {
    const { toast } = useToast();
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    // Fetch existing content from database
    useEffect(() => {
        fetchExistingContent();
    }, [projectId, contentType]);
    const fetchExistingContent = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('project_content')
            .select('*')
            .eq('project_id', projectId)
            .eq('content_type', contentType)
            .order('created_at', { ascending: false });
        if (data && !error) {
            setFiles(data.map((item) => ({
                id: item.id,
                name: item.file_name,
                url: item.file_url,
                size: item.file_size || 0,
                type: contentType,
                uploaded_at: item.created_at,
                published: item.is_published || false,
            })));
        }
        setLoading(false);
    };
    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0)
            return;
        setUploading(true);
        setUploadProgress(0);
        const totalFiles = acceptedFiles.length;
        let completedFiles = 0;
        for (const file of acceptedFiles) {
            try {
                const fileName = `${projectId}/${contentType}/${Date.now()}_${file.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, file);
                if (uploadError)
                    throw uploadError;
                const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
                // Save to project_content table
                const { data: insertData, error: insertError } = await supabase
                    .from('project_content')
                    .insert({
                    project_id: projectId,
                    content_type: contentType,
                    file_name: file.name,
                    file_url: urlData.publicUrl,
                    file_size: file.size,
                    is_published: false,
                })
                    .select()
                    .single();
                if (insertError)
                    throw insertError;
                const newFile = {
                    id: insertData.id,
                    name: file.name,
                    url: urlData.publicUrl,
                    size: file.size,
                    type: file.type,
                    uploaded_at: new Date().toISOString(),
                    published: false,
                };
                setFiles((prev) => [newFile, ...prev]);
                completedFiles++;
                setUploadProgress((completedFiles / totalFiles) * 100);
            }
            catch (error) {
                toast({
                    title: 'Upload failed',
                    description: error.message,
                    variant: 'destructive',
                });
            }
        }
        setUploading(false);
        setUploadProgress(100);
        toast({
            title: 'Upload complete!',
            description: `${completedFiles} file(s) uploaded successfully`,
        });
        onUploadComplete?.();
    }, [projectId, bucket, contentType, toast, onUploadComplete]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
        maxFiles,
        disabled: uploading,
    });
    const handleDelete = async (file) => {
        try {
            // Delete from storage
            const storagePath = file.url.split(`${bucket}/`)[1];
            if (storagePath) {
                await supabase.storage.from(bucket).remove([storagePath]);
            }
            // Delete from database
            await supabase.from('project_content').delete().eq('id', file.id);
            setFiles((prev) => prev.filter((f) => f.id !== file.id));
            toast({
                title: 'Deleted',
                description: 'File removed successfully',
            });
        }
        catch (error) {
            toast({
                title: 'Delete failed',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const handlePublish = async (file) => {
        try {
            await supabase
                .from('project_content')
                .update({
                is_published: true,
                published_at: new Date().toISOString()
            })
                .eq('id', file.id);
            setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, published: true } : f)));
            toast({
                title: 'Published!',
                description: 'Content is now visible to customer',
            });
        }
        catch (error) {
            toast({
                title: 'Publish failed',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const handlePublishAll = async () => {
        const unpublishedIds = files.filter((f) => !f.published).map((f) => f.id);
        if (unpublishedIds.length === 0)
            return;
        try {
            await supabase
                .from('project_content')
                .update({
                is_published: true,
                published_at: new Date().toISOString()
            })
                .in('id', unpublishedIds);
            setFiles((prev) => prev.map((f) => ({ ...f, published: true })));
            // Send notification to customer
            try {
                await supabase.functions.invoke('send-notification', {
                    body: {
                        type: 'content_published',
                        project_id: projectId,
                        content_type: contentType,
                    },
                });
            }
            catch (error) {
                console.error('Failed to send notification:', error);
            }
            toast({
                title: 'All content published!',
                description: 'Customer has been notified',
            });
        }
        catch (error) {
            toast({
                title: 'Publish failed',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const formatFileSize = (bytes) => {
        if (bytes < 1024)
            return bytes + ' B';
        if (bytes < 1024 * 1024)
            return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };
    const unpublishedCount = files.filter((f) => !f.published).length;
    const publishedCount = files.filter((f) => f.published).length;
    if (loading) {
        return (<div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
      </div>);
    }
    return (<div className="space-y-4">
      {/* Stats Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500"/>
            {publishedCount} published
          </Badge>
          {unpublishedCount > 0 && (<Badge variant="secondary" className="gap-1">
              {unpublishedCount} pending
            </Badge>)}
        </div>
        {unpublishedCount > 0 && (<Button size="sm" onClick={handlePublishAll}>
            <Send className="h-4 w-4 mr-2"/>
            Publish All ({unpublishedCount})
          </Button>)}
      </div>

      {/* Upload Area */}
      <div {...getRootProps()} className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}>
        <input {...getInputProps()}/>
        <div className="flex flex-col items-center gap-3">
          {uploading ? (<>
              <Loader2 className="h-10 w-10 text-primary animate-spin"/>
              <p className="text-sm font-medium">Uploading...</p>
              <Progress value={uploadProgress} className="w-48 h-2"/>
            </>) : (<>
              <div className="p-3 rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary"/>
              </div>
              <div>
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Drag & drop or click to browse • Max {maxFiles} files
              </p>
            </>)}
        </div>
      </div>

      {/* Files Grid */}
      <AnimatePresence>
        {files.length > 0 && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (<motion.div key={file.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <Card className="overflow-hidden group">
                    <div className="relative aspect-square bg-muted">
                      {file.url && (file.type.startsWith('image/') || contentType === 'render' || contentType === 'moodboard') ? (<img src={file.url} alt={file.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center">
                          <FileText className="h-12 w-12 text-muted-foreground"/>
                        </div>)}

                      {file.published ? (<Badge className="absolute top-2 left-2 bg-emerald-600 gap-1">
                          <CheckCircle className="h-3 w-3"/>
                          Published
                        </Badge>) : (<Badge variant="secondary" className="absolute top-2 left-2">
                          Draft
                        </Badge>)}

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => window.open(file.url, '_blank')}>
                          <Eye className="h-4 w-4"/>
                        </Button>
                        {!file.published && (<Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handlePublish(file)}>
                            <Send className="h-4 w-4"/>
                          </Button>)}
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(file)}>
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>

                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </Card>
                </motion.div>))}
            </div>
          </motion.div>)}
      </AnimatePresence>

      {files.length === 0 && !uploading && (<div className="text-center py-8 text-muted-foreground">
          <Image className="h-12 w-12 mx-auto mb-2 opacity-50"/>
          <p>No files uploaded yet</p>
        </div>)}
    </div>);
}
