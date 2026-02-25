import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useIntakeStore } from '@/stores/intakeStore';
import { getRoomPreferences, getCombinedRoomPreferences } from '@/lib/roomPreferencesConfig';
export function Step3Requirements({ onNext, onBack, roomType, selectedRooms }) {
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
    const { mustHaves, avoid, existingFurniture, budgetMin, budgetMax, whatYouLove, whatFrustrates, setRequirements, } = useIntakeStore();
    const [localMustHaves, setLocalMustHaves] = useState(mustHaves);
    const [localAvoid, setLocalAvoid] = useState(avoid);
    const [localBudget, setLocalBudget] = useState([budgetMin, budgetMax]);
    const [localExisting, setLocalExisting] = useState(existingFurniture);
    const [localLove, setLocalLove] = useState(whatYouLove);
    const [localFrustrates, setLocalFrustrates] = useState(whatFrustrates);
    const toggleMustHave = (item) => {
        setLocalMustHaves(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };
    const toggleAvoid = (item) => {
        setLocalAvoid(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };
    const handleNext = () => {
        setRequirements({
            mustHaves: localMustHaves,
            avoid: localAvoid,
            existingFurniture: localExisting,
            budgetMin: localBudget[0],
            budgetMax: localBudget[1],
            whatYouLove: localLove,
            whatFrustrates: localFrustrates,
        });
        onNext();
    };
    return (<div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold mb-2">Your Requirements</h2>
        <p className="text-muted-foreground">Help us understand your needs and preferences</p>
      </div>

      {/* Must-Haves */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Must-Have Features</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {mustHaveOptions.map((item) => (<label key={item} className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors">
              <Checkbox checked={localMustHaves.includes(item)} onCheckedChange={() => toggleMustHave(item)}/>
              <span className="text-sm">{item}</span>
            </label>))}
        </div>
      </div>

      {/* Avoid */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Things to Avoid</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {avoidOptions.map((item) => (<label key={item} className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors">
              <Checkbox checked={localAvoid.includes(item)} onCheckedChange={() => toggleAvoid(item)}/>
              <span className="text-sm">{item}</span>
            </label>))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Your Budget Range</Label>
        <div className="px-2">
          <Slider value={localBudget} onValueChange={(value) => setLocalBudget(value)} min={50000} max={800000} step={10000} className="py-4"/>
          <div className="flex justify-between text-sm">
            <div className="text-muted-foreground">
              Min: <span className="font-semibold text-foreground">₹{(localBudget[0] / 1000).toFixed(0)}k</span>
            </div>
            <div className="text-muted-foreground">
              Max: <span className="font-semibold text-foreground">₹{(localBudget[1] / 1000).toFixed(0)}k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Open-Ended Questions */}
      <div className="space-y-2">
        <Label htmlFor="love">What do you love about this room currently?</Label>
        <Textarea id="love" placeholder="E.g., The natural light, the view from the window, etc." value={localLove} onChange={(e) => setLocalLove(e.target.value)} rows={3} className="mt-2"/>
      </div>

      <div className="space-y-2">
        <Label htmlFor="frustrates">What frustrates you about this room?</Label>
        <Textarea id="frustrates" placeholder="E.g., Lack of storage, feels cluttered, dark lighting, etc." value={localFrustrates} onChange={(e) => setLocalFrustrates(e.target.value)} rows={3} className="mt-2"/>
      </div>

      <div className="space-y-2">
        <Label htmlFor="existing">Existing Furniture You Want to Keep (Optional)</Label>
        <Textarea id="existing" placeholder="E.g., Teak wood bed, vintage dresser, etc." value={localExisting} onChange={(e) => setLocalExisting(e.target.value)} rows={2} className="mt-2"/>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button size="lg" onClick={handleNext} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          Choose Your Designer
        </Button>
      </div>
    </div>);
}
