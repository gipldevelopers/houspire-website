import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, X, Plus, Palette, Link as LinkIcon } from 'lucide-react';
import { InspirationBoardSelector } from './InspirationBoardSelector';
import { getRoomPreferences, getCombinedRoomPreferences, colorOptions } from '@/lib/roomPreferencesConfig';
export function IntakeStep3Preferences({ value, onChange, roomType, selectedRooms, }) {
    const [newLink, setNewLink] = useState('');
    // Get dynamic options based on room type or selected rooms
    const { mustHaveOptions, avoidOptions } = useMemo(() => {
        // For multi-room packages, combine preferences from all selected rooms
        if (selectedRooms && selectedRooms.length > 1) {
            const combined = getCombinedRoomPreferences(selectedRooms);
            return {
                mustHaveOptions: combined.mustHave,
                avoidOptions: combined.avoid,
            };
        }
        // For single room, get room-specific preferences
        const prefs = getRoomPreferences(roomType || selectedRooms?.[0]);
        return {
            mustHaveOptions: prefs.mustHave,
            avoidOptions: prefs.avoid,
        };
    }, [roomType, selectedRooms]);
    const toggleItem = (field, item) => {
        const current = value[field];
        const updated = current.includes(item)
            ? current.filter((i) => i !== item)
            : [...current, item];
        onChange({ ...value, [field]: updated });
    };
    const toggleColor = (colorName) => {
        const current = value.colors;
        const updated = current.includes(colorName)
            ? current.filter((c) => c !== colorName)
            : [...current, colorName];
        onChange({ ...value, colors: updated });
    };
    const addLink = () => {
        if (newLink.trim()) {
            onChange({
                ...value,
                inspirationLinks: [...value.inspirationLinks, newLink.trim()],
            });
            setNewLink('');
        }
    };
    const removeLink = (link) => {
        onChange({
            ...value,
            inspirationLinks: value.inspirationLinks.filter((l) => l !== link),
        });
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Your Preferences</h1>
        <p className="text-muted-foreground">
          Tell us what you love and what to avoid
        </p>
      </div>

      {/* Must-Haves */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-primary"/>
          <h3 className="font-semibold">
            Must-Have Features <span className="text-destructive">*</span>
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Select features that are essential for your space
        </p>
        <div className="flex flex-wrap gap-2">
          {mustHaveOptions.map((item) => (<Badge key={item} variant={value.mustHave.includes(item) ? 'default' : 'outline'} className="cursor-pointer py-2 px-3" onClick={() => toggleItem('mustHave', item)}>
              {value.mustHave.includes(item) && (<Heart className="h-3 w-3 mr-1 fill-current"/>)}
              {item}
            </Badge>))}
        </div>
      </Card>

      {/* Things to Avoid */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <X className="h-5 w-5 text-destructive"/>
          <h3 className="font-semibold">Things to Avoid</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Select styles or elements you'd prefer not to have
        </p>
        <div className="flex flex-wrap gap-2">
          {avoidOptions.map((item) => (<Badge key={item} variant={value.avoid.includes(item) ? 'destructive' : 'outline'} className="cursor-pointer py-2 px-3" onClick={() => toggleItem('avoid', item)}>
              {value.avoid.includes(item) && <X className="h-3 w-3 mr-1"/>}
              {item}
            </Badge>))}
        </div>
      </Card>

      {/* Color Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-primary"/>
          <h3 className="font-semibold">Color Preferences</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Select color palettes you're drawn to
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {colorOptions.map((palette) => (<button key={palette.name} onClick={() => toggleColor(palette.name)} className={`p-3 rounded-lg border-2 transition-all ${value.colors.includes(palette.name)
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-transparent hover:border-muted-foreground/20'}`}>
              <div className="flex gap-1 mb-2 justify-center">
                {palette.colors.map((color, idx) => (<div key={idx} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}/>))}
              </div>
              <p className="text-xs font-medium">{palette.name}</p>
            </button>))}
        </div>
      </Card>

      {/* Inspiration Boards */}
      <InspirationBoardSelector selectedBoardIds={value.inspirationBoardIds || []} onSelectionChange={(ids) => onChange({ ...value, inspirationBoardIds: ids })}/>

      {/* Inspiration Links */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="h-5 w-5 text-primary"/>
          <h3 className="font-semibold">External Links (Optional)</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Add Pinterest, Instagram, or design website links you love
        </p>

        <div className="flex gap-2 mb-3">
          <Input placeholder="Paste a link here..." value={newLink} onChange={(e) => setNewLink(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLink()}/>
          <Button onClick={addLink} size="icon" variant="outline">
            <Plus className="h-4 w-4"/>
          </Button>
        </div>

        {value.inspirationLinks.length > 0 && (<div className="space-y-2">
            {value.inspirationLinks.map((link, idx) => (<div key={idx} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate flex-1">
                  {link}
                </a>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeLink(link)}>
                  <X className="h-4 w-4"/>
                </Button>
              </div>))}
          </div>)}
      </Card>

      {/* Additional Notes */}
      <Card className="p-6">
        <Label htmlFor="notes" className="font-semibold mb-3 block">
          Anything else we should know? (Optional)
        </Label>
        <Textarea id="notes" placeholder="Share any specific ideas, concerns, or requirements..." value={value.additionalNotes} onChange={(e) => onChange({ ...value, additionalNotes: e.target.value })} rows={4}/>
      </Card>
    </div>);
}
