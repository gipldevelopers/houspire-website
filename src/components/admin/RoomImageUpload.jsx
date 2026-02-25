import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Eye, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateImageFile, validateImageDimensions, formatFileSize } from '@/lib/upload-validation';
const ANGLE_OPTIONS = [
    { value: 'front', label: 'Front View' },
    { value: 'corner', label: 'Corner View' },
    { value: 'detail', label: 'Detail Shot' },
    { value: 'full', label: 'Full Room' }
];
export default function RoomImageUpload({ roomName, files, onChange, minFiles = 2, maxFiles = 3 }) {
    const { toast } = useToast();
    const [dragActive, setDragActive] = useState(false);
    const [validating, setValidating] = useState(false);
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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await handleFiles(Array.from(e.dataTransfer.files));
        }
    }, [files]);
    const handleFileInput = useCallback(async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            await handleFiles(Array.from(e.target.files));
        }
    }, [files]);
    async function handleFiles(newFiles) {
        // Check max files limit
        if (files.length + newFiles.length > maxFiles) {
            toast({
                variant: 'destructive',
                title: 'Too many files',
                description: `Maximum ${maxFiles} images allowed per room`
            });
            return;
        }
        setValidating(true);
        const validFiles = [];
        for (const file of newFiles) {
            // Basic validation
            const basicValidation = validateImageFile(file);
            if (!basicValidation.valid) {
                toast({
                    variant: 'destructive',
                    title: 'Invalid file',
                    description: `${file.name}: ${'error' in basicValidation ? basicValidation.error : 'Invalid file'}`
                });
                continue;
            }
            // Dimension validation
            const dimensionValidation = await validateImageDimensions(file);
            if (!dimensionValidation.valid) {
                toast({
                    variant: 'destructive',
                    title: 'Image resolution too low',
                    description: `${file.name}: ${'error' in dimensionValidation ? dimensionValidation.error : 'Resolution too low'}`
                });
                continue;
            }
            // Create preview
            const preview = URL.createObjectURL(file);
            validFiles.push({
                file,
                preview,
                angle: 'front' // Default angle
            });
        }
        if (validFiles.length > 0) {
            onChange([...files, ...validFiles]);
            toast({
                title: 'Files added',
                description: `${validFiles.length} image(s) added successfully`
            });
        }
        setValidating(false);
    }
    function handleRemove(index) {
        const newFiles = [...files];
        // Revoke object URL to prevent memory leak
        if (newFiles[index].preview) {
            URL.revokeObjectURL(newFiles[index].preview);
        }
        newFiles.splice(index, 1);
        onChange(newFiles);
    }
    function handleAngleChange(index, angle) {
        const newFiles = [...files];
        newFiles[index].angle = angle;
        onChange(newFiles);
    }
    function handlePreview(file) {
        if (file.preview) {
            window.open(file.preview, '_blank');
        }
    }
    const canAddMore = files.length < maxFiles;
    return (<Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-foreground">{roomName}</h4>
          <p className="text-sm text-muted-foreground">
            Upload {minFiles}-{maxFiles} high-quality images (4K minimum)
          </p>
        </div>
        <Badge variant={files.length >= minFiles ? 'default' : 'secondary'}>
          {files.length}/{maxFiles} uploaded
        </Badge>
      </div>

      {/* Upload Zone */}
      {canAddMore && (<div className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'}
          `} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => document.getElementById(`file-upload-${roomName}`)?.click()}>
          <input id={`file-upload-${roomName}`} type="file" className="hidden" accept=".jpg,.jpeg,.png" multiple onChange={handleFileInput}/>

          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary"/>
            </div>

            <div>
              <p className="font-medium text-foreground">
                {dragActive ? 'Drop files here' : 'Drag & drop images here'}
              </p>
              <p className="text-sm text-muted-foreground">or</p>
            </div>

            <div>
              <Button variant="outline" size="sm" disabled={validating} onClick={(e) => {
                e.stopPropagation();
                document.getElementById(`file-upload-${roomName}`)?.click();
            }}>
                <ImageIcon className="h-4 w-4 mr-2"/>
                {validating ? 'Validating...' : 'Browse Files'}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• JPG or PNG format</p>
              <p>• Minimum 4K resolution (3840x2160)</p>
              <p>• Maximum 25MB per file</p>
              <p>• {minFiles}-{maxFiles} images per room</p>
            </div>
          </div>
        </div>)}

      {/* Uploaded Files */}
      {files.length > 0 && (<div className="mt-4 space-y-3">
          {files.map((uploadedFile, index) => (<div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              {/* Preview Thumbnail */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {uploadedFile.preview && (<img src={uploadedFile.preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover"/>)}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-foreground">
                  {uploadedFile.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(uploadedFile.file.size)}
                </p>

                {/* Angle Selection */}
                <div className="flex items-center gap-2 mt-2">
                  <Label className="text-xs text-muted-foreground">
                    View Angle:
                  </Label>
                  <Select value={uploadedFile.angle || 'front'} onValueChange={(value) => handleAngleChange(index, value)}>
                    <SelectTrigger className="h-7 w-28 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ANGLE_OPTIONS.map(option => (<SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePreview(uploadedFile)}>
                  <Eye className="h-4 w-4"/>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleRemove(index)}>
                  <X className="h-4 w-4"/>
                </Button>
              </div>
            </div>))}
        </div>)}
    </Card>);
}
