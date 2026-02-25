'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiPost, apiDelete } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';

export function ProjectTags({ 
  projectId, 
  tags = [], 
  onTagsChange, 
  editable = true 
}) {
  const { toast } = useToast();
  const [newTag, setNewTag] = useState('');
  const [addingTag, setAddingTag] = useState(false);

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    setAddingTag(true);

    try {
      await apiPost(`/api/projects/${projectId}/tags`, {
        tag: newTag.trim().toLowerCase(),
      });

      toast({ title: 'Tag added!' });
      setNewTag('');
      onTagsChange();
    } catch (error) {
      toast({
        title: 'Failed to add tag',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setAddingTag(false);
    }
  };

  const handleRemoveTag = async (tag) => {
    try {
      await apiDelete(`/api/projects/${projectId}/tags`, {
        tag: tag,
      });

      toast({ title: 'Tag removed' });
      onTagsChange();
    } catch (error) {
      toast({
        title: 'Failed to remove tag',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-foreground">Tags</h4>

      {/* Existing Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="group flex items-center gap-1 pr-1"
            >
              {tag}
              {editable && (
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Add Tag */}
      {editable && (
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag..."
            className="h-9 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            disabled={addingTag}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddTag}
            disabled={addingTag || !newTag.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {tags.length === 0 && !editable && (
        <p className="text-sm text-muted-foreground">No tags</p>
      )}
    </div>
  );
}
