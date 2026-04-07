import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, } from '@/components/ui/dialog';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, RotateCcw } from 'lucide-react';
import { ROOM_LABELS, STYLE_LABELS, BUDGET_LABELS } from '@/lib/houspireFilenameParser';
// Full style options matching the parser
const STYLES = Object.entries(STYLE_LABELS).map(([value, label]) => ({ value, label }));
// Full room type options matching the parser
const ROOM_TYPES = Object.entries(ROOM_LABELS).map(([value, label]) => ({ value, label }));
// Budget ranges
const BUDGET_RANGES = Object.entries(BUDGET_LABELS).map(([value, label]) => ({ value, label }));
// Difficulty levels
const DIFFICULTY_LEVELS = [
    { value: 'easy', label: 'Easy - Weekend Project' },
    { value: 'moderate', label: 'Moderate - 1-2 Weeks' },
    { value: 'complex', label: 'Complex - Professional Help Recommended' },
];
export function GalleryImageEditModal({ image, isOpen, onClose, onSave, }) {
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);
    const [aiGenerationFailed, setAiGenerationFailed] = useState(false);
    const [formData, setFormData] = useState({
        design_title: '',
        design_description: '',
        style_primary: '',
        room_type: '',
        budget_range: '',
        is_featured: false,
        key_features: '',
        why_it_works: '',
        difficulty_level: '',
        execution_time_weeks: '',
    });
    useEffect(() => {
        if (image) {
            setFormData({
                design_title: image.design_title || '',
                design_description: image.design_description || '',
                style_primary: image.style_primary || 'modern_minimalist',
                room_type: image.room_type || 'living_room',
                budget_range: image.budget_range || 'medium',
                is_featured: image.is_featured || false,
                key_features: image.key_features?.join(', ') || '',
                why_it_works: image.why_it_works || '',
                difficulty_level: image.difficulty_level || '',
                execution_time_weeks: image.execution_time_weeks?.toString() || '',
            });
        }
    }, [image]);
    const generateAIDetails = async () => {
        if (!image)
            return;
        setGeneratingAI(true);
        setAiGenerationFailed(false);
        try {
            const body = {
                imageUrl: image.cover_image_url,
                budgetRange: formData.budget_range,
                viewType: 'main',
                generateFull: true, // Request full details
            };
            // Don’t pass defaults into the prompt (can bias detection)
            if (!(formData.room_type === 'living_room' && formData.style_primary === 'modern_minimalist')) {
                body.roomType = formData.room_type;
                body.style = formData.style_primary;
            }
            // Use the edge function to generate AI details
            const { data, error } = await appDataClient.functions.invoke('generate-image-metadata', {
                body,
            });
            if (error) {
                console.error('Edge function error:', error);
                // Parse error for better messaging
                const errorMessage = error.message || 'Failed to generate AI details';
                const isRateLimit = errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit');
                const isCreditsExhausted = errorMessage.includes('402') || errorMessage.toLowerCase().includes('credits');
                if (isRateLimit) {
                    throw new Error('Rate limit reached. Please wait a moment and try again.');
                }
                else if (isCreditsExhausted) {
                    throw new Error('AI credits exhausted. Please add credits to continue.');
                }
                else {
                    throw new Error(errorMessage);
                }
            }
            if (data) {
                setFormData(prev => ({
                    ...prev,
                    design_description: data.description || prev.design_description,
                    why_it_works: data.whyItWorks || prev.why_it_works,
                    key_features: Array.isArray(data.keyFeatures)
                        ? data.keyFeatures.join(', ')
                        : prev.key_features,
                    difficulty_level: data.difficultyLevel || prev.difficulty_level,
                    execution_time_weeks: data.executionTimeWeeks?.toString() || prev.execution_time_weeks,
                    room_type: data.detectedRoomType || prev.room_type,
                    style_primary: data.detectedStyle || prev.style_primary,
                }));
                toast({ title: 'AI details generated! ✨' });
            }
        }
        catch (error) {
            console.error('AI generation error:', error);
            setAiGenerationFailed(true);
            toast({
                title: 'AI generation failed',
                description: error.message || 'Could not generate details. Click to retry.',
                variant: 'destructive',
            });
        }
        finally {
            setGeneratingAI(false);
        }
    };
    const handleSave = async () => {
        if (!image)
            return;
        setSaving(true);
        try {
            const { error } = await appDataClient
                .from('gallery_designs')
                .update({
                design_title: formData.design_title,
                design_description: formData.design_description || null,
                style_primary: formData.style_primary,
                room_type: formData.room_type,
                budget_range: formData.budget_range,
                is_featured: formData.is_featured,
                key_features: formData.key_features
                    ? formData.key_features.split(',').map((f) => f.trim())
                    : null,
                why_it_works: formData.why_it_works || null,
                difficulty_level: formData.difficulty_level || null,
                execution_time_weeks: formData.execution_time_weeks
                    ? parseInt(formData.execution_time_weeks)
                    : null,
            })
                .eq('id', image.id);
            if (error)
                throw error;
            toast({
                title: 'Image updated',
                description: 'Gallery image has been updated successfully.',
            });
            onSave();
            onClose();
        }
        catch (error) {
            console.error('Update error:', error);
            toast({
                title: 'Update failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setSaving(false);
        }
    };
    if (!image)
        return null;
    return (<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Gallery Image</DialogTitle>
          <DialogDescription>
            Update the details for this gallery image.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Image Preview */}
          <div className="flex justify-center">
            <img src={image.cover_image_url} alt={image.design_title} className="h-48 w-auto object-cover rounded-lg"/>
          </div>

          {/* AI Generate Button */}
          <div className="flex justify-center">
            <Button variant={aiGenerationFailed ? "destructive" : "outline"} onClick={generateAIDetails} disabled={generatingAI} className="gap-2">
              {generatingAI ? (<Loader2 className="h-4 w-4 animate-spin"/>) : aiGenerationFailed ? (<RotateCcw className="h-4 w-4"/>) : (<Wand2 className="h-4 w-4 text-purple-500"/>)}
              {generatingAI ? 'Generating...' : aiGenerationFailed ? 'Retry AI Generation' : 'Auto-Generate Details with AI'}
            </Button>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={formData.design_title} onChange={(e) => setFormData({ ...formData, design_title: e.target.value })} placeholder="Enter image title"/>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.design_description} onChange={(e) => setFormData({ ...formData, design_description: e.target.value })} placeholder="Enter a detailed description of this design" rows={3}/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Style */}
            <div className="space-y-2">
              <Label>Style</Label>
              <Select value={formData.style_primary} onValueChange={(value) => setFormData({ ...formData, style_primary: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style"/>
                </SelectTrigger>
                <SelectContent>
                  {STYLES.map((style) => (<SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <Label>Room Type</Label>
              <Select value={formData.room_type} onValueChange={(value) => setFormData({ ...formData, room_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type"/>
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map((room) => (<SelectItem key={room.value} value={room.value}>
                      {room.label}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Budget Range */}
            <div className="space-y-2">
              <Label>Budget Range</Label>
              <Select value={formData.budget_range} onValueChange={(value) => setFormData({ ...formData, budget_range: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget"/>
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_RANGES.map((budget) => (<SelectItem key={budget.value} value={budget.value}>
                      {budget.label}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            {/* Featured */}
            <div className="space-y-2">
              <Label>Featured</Label>
              <Select value={formData.is_featured ? 'yes' : 'no'} onValueChange={(value) => setFormData({ ...formData, is_featured: value === 'yes' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Featured?"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Difficulty Level */}
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={formData.difficulty_level} onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty"/>
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (<SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            {/* Execution Time */}
            <div className="space-y-2">
              <Label htmlFor="execution_time">Execution Time (weeks)</Label>
              <Input id="execution_time" type="number" min="1" max="52" value={formData.execution_time_weeks} onChange={(e) => setFormData({ ...formData, execution_time_weeks: e.target.value })} placeholder="e.g., 4"/>
            </div>
          </div>

          {/* Why It Works */}
          <div className="space-y-2">
            <Label htmlFor="why_it_works">Why This Design Works</Label>
            <Textarea id="why_it_works" value={formData.why_it_works} onChange={(e) => setFormData({ ...formData, why_it_works: e.target.value })} placeholder="Explain the design principles that make this space work..." rows={2}/>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <Label htmlFor="features">Key Features (comma-separated)</Label>
            <Input id="features" value={formData.key_features} onChange={(e) => setFormData({ ...formData, key_features: e.target.value })} placeholder="natural light, warm tones, minimal furniture, open layout"/>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (<>
                <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                Saving...
              </>) : ('Save Changes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}

