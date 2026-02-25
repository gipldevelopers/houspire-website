import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Ruler, Info } from 'lucide-react';
export function IntakeStep2Dimensions({ value, onChange, roomType, }) {
    const updateField = (field, val) => {
        onChange({ ...value, [field]: val });
    };
    const formatRoomType = (type) => {
        if (!type)
            return 'Room';
        return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Room Dimensions</h1>
        <p className="text-muted-foreground">
          Help us understand the size of your {formatRoomType(roomType).toLowerCase()}
        </p>
      </div>

      {/* Unit Selection */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Measurement Unit</Label>
        <RadioGroup value={value.unit} onValueChange={(val) => updateField('unit', val)} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="feet" id="feet"/>
            <Label htmlFor="feet" className="cursor-pointer">Feet</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="meters" id="meters"/>
            <Label htmlFor="meters" className="cursor-pointer">Meters</Label>
          </div>
        </RadioGroup>
      </Card>

      {/* Dimensions Inputs */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Ruler className="h-5 w-5 text-primary"/>
          <h3 className="font-semibold">Enter Dimensions</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="length">
              Length <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input id="length" type="number" placeholder="e.g., 15" value={value.length} onChange={(e) => updateField('length', e.target.value)} className="pr-10"/>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {value.unit === 'feet' ? 'ft' : 'm'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">
              Width <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input id="width" type="number" placeholder="e.g., 12" value={value.width} onChange={(e) => updateField('width', e.target.value)} className="pr-10"/>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {value.unit === 'feet' ? 'ft' : 'm'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <div className="relative">
              <Input id="height" type="number" placeholder="e.g., 10" value={value.height} onChange={(e) => updateField('height', e.target.value)} className="pr-10"/>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {value.unit === 'feet' ? 'ft' : 'm'}
              </span>
            </div>
          </div>
        </div>

        {/* Area Calculation */}
        {value.length && value.width && (<div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Approximate area:{' '}
              <span className="font-semibold text-foreground">
                {(parseFloat(value.length) * parseFloat(value.width)).toFixed(1)}{' '}
                {value.unit === 'feet' ? 'sq. ft' : 'sq. m'}
              </span>
            </p>
          </div>)}
      </Card>

      {/* Additional Notes */}
      <Card className="p-6">
        <Label htmlFor="notes" className="text-sm font-medium mb-3 block">
          Additional Details (Optional)
        </Label>
        <Textarea id="notes" placeholder="Any irregular shapes, alcoves, bay windows, or architectural features we should know about?" value={value.notes} onChange={(e) => updateField('notes', e.target.value)} rows={3}/>
      </Card>

      {/* Measurement Tips */}
      <Card className="p-4 bg-muted/50">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/>
          <div className="space-y-2 text-sm">
            <p className="font-medium">How to measure your room:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Measure the longest wall for length</li>
              <li>Measure the perpendicular wall for width</li>
              <li>Measure from floor to ceiling for height</li>
              <li>Don't worry about being exact - approximate is fine!</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);
}
