import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Upload, X, Send, Loader2, Info } from 'lucide-react';
const revisionSchema = z.object({
    content_type: z.enum(['render', 'budget', 'vendor', 'material', 'all']),
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
});
export function RevisionRequestForm({ projectId, onSuccess, onCancel, }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [contentType, setContentType] = useState('');
    const { register, handleSubmit, formState: { errors }, setValue, } = useForm({
        resolver: zodResolver(revisionSchema),
    });
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length + attachments.length > 5) {
            toast({
                title: 'Too many files',
                description: 'Maximum 5 attachments allowed',
                variant: 'destructive',
            });
            return;
        }
        setAttachments([...attachments, ...files]);
    };
    const removeAttachment = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };
    const onSubmit = async (data) => {
        if (!user) {
            toast({
                title: 'Please log in',
                description: 'You must be logged in to submit a revision request',
                variant: 'destructive',
            });
            return;
        }
        setSubmitting(true);
        try {
            // Create revision request
            const { data: revision, error: revisionError } = await supabase
                .from('revision_requests')
                .insert({
                project_id: projectId,
                user_id: user.id,
                content_type: data.content_type,
                title: data.title,
                description: data.description,
            })
                .select()
                .single();
            if (revisionError)
                throw revisionError;
            // Upload attachments if any
            if (attachments.length > 0 && revision) {
                for (const file of attachments) {
                    const fileName = `${Date.now()}-${file.name}`;
                    const filePath = `revisions/${revision.id}/${fileName}`;
                    const { error: uploadError } = await supabase.storage
                        .from('project-renders')
                        .upload(filePath, file);
                    if (!uploadError) {
                        const { data: urlData } = supabase.storage
                            .from('project-renders')
                            .getPublicUrl(filePath);
                        await supabase.from('revision_attachments').insert({
                            revision_request_id: revision.id,
                            file_url: urlData.publicUrl,
                            file_name: file.name,
                            file_type: file.type,
                            file_size: file.size,
                        });
                    }
                }
            }
            toast({
                title: 'Revision request submitted! 🔄',
                description: 'Our team will review your request shortly',
            });
            onSuccess();
        }
        catch (error) {
            toast({
                title: 'Failed to submit revision request',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setSubmitting(false);
        }
    };
    const contentTypeLabels = {
        render: 'Room Designs',
        budget: 'Budget Breakdown',
        vendor: 'Vendor Recommendations',
        material: 'Material Specifications',
        all: 'Everything',
    };
    return (<Card className="border-2 border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-purple-600"/>
          <CardTitle>Request Revision</CardTitle>
        </div>
        <CardDescription>
          Let us know what changes you'd like to see in your design
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Content Type */}
          <div className="space-y-2">
            <Label>What needs revision? *</Label>
            <Select value={contentType} onValueChange={(value) => {
            setContentType(value);
            setValue('content_type', value);
        }}>
              <SelectTrigger>
                <SelectValue placeholder="Select what to revise"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="render">Room Designs</SelectItem>
                <SelectItem value="budget">Budget Breakdown</SelectItem>
                <SelectItem value="vendor">Vendor Recommendations</SelectItem>
                <SelectItem value="material">Material Specifications</SelectItem>
                <SelectItem value="all">Everything</SelectItem>
              </SelectContent>
            </Select>
            {errors.content_type && (<p className="text-sm text-destructive">
                {errors.content_type.message}
              </p>)}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Request Title *</Label>
            <Input id="title" {...register('title')} placeholder="e.g., Change sofa color to grey" className="h-12"/>
            {errors.title && (<p className="text-sm text-destructive">{errors.title.message}</p>)}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea id="description" {...register('description')} placeholder="Describe exactly what changes you'd like..." rows={5}/>
            {errors.description && (<p className="text-sm text-destructive">
                {errors.description.message}
              </p>)}
            <p className="text-xs text-muted-foreground">
              Be specific: mention colors, furniture items, layout changes, etc.
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Reference Images (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" id="revision-files" disabled={attachments.length >= 5}/>
              <label htmlFor="revision-files" className="cursor-pointer inline-flex flex-col items-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2"/>
                <span className="text-sm text-muted-foreground">
                  Upload reference images (max 5)
                </span>
                <span className="text-xs text-muted-foreground">
                  {attachments.length}/5 uploaded
                </span>
              </label>
            </div>

            {/* Attachment List */}
            {attachments.length > 0 && (<div className="mt-4 space-y-2">
                {attachments.map((file, index) => (<div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm truncate">
                      {file.name}
                    </span>
                    <button type="button" onClick={() => removeAttachment(index)} className="text-destructive hover:text-destructive/80">
                      <X className="h-4 w-4"/>
                    </button>
                  </div>))}
              </div>)}
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"/>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Revision Guidelines
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• One free revision round is included</li>
                  <li>• Revisions must be reasonable in scope</li>
                  <li>• Additional revisions: ₹299 each</li>
                  <li>• Typical turnaround: 24-48 hours</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="flex-1 h-12">
              {submitting ? (<>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                  Submitting...
                </>) : (<>
                  <Send className="h-4 w-4 mr-2"/>
                  Submit Request
                </>)}
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" className="flex-1 h-12">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>);
}
