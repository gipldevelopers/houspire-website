import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, FileText, Loader2 } from 'lucide-react';
export function AdminNotes({ projectId, initialNotes = '' }) {
    const { toast } = useToast();
    const [notes, setNotes] = useState(initialNotes || '');
    const [saving, setSaving] = useState(false);
    const handleSave = async () => {
        setSaving(true);
        try {
            // Store notes in project_inputs or a separate admin_notes field
            // For now, we'll update project_inputs with admin notes
            const { error } = await supabase
                .from('project_inputs')
                .upsert({
                project_id: projectId,
                what_frustrates: notes, // Using existing field temporarily
            }, {
                onConflict: 'project_id'
            });
            if (error)
                throw error;
            toast({
                title: 'Notes saved! 📝',
                description: 'Admin notes have been updated',
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save';
            toast({
                title: 'Failed to save notes',
                description: errorMessage,
                variant: 'destructive',
            });
        }
        finally {
            setSaving(false);
        }
    };
    return (<Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4"/>
          Admin Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add internal notes about this project..." rows={6}/>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? (<>
              <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
              Saving...
            </>) : (<>
              <Save className="h-4 w-4 mr-2"/>
              Save Notes
            </>)}
        </Button>
      </CardContent>
    </Card>);
}
