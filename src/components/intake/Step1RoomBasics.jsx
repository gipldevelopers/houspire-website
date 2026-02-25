import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText } from 'lucide-react';
import { useIntakeStore } from '@/stores/intakeStore';
import { ROOM_TYPES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
export function Step1RoomBasics({ onNext }) {
    const { roomType, roomLength, roomWidth, roomHeight, photos, floorPlan, setRoomBasics, } = useIntakeStore();
    const { toast } = useToast();
    const [localPhotos, setLocalPhotos] = useState(photos);
    const [localFloorPlan, setLocalFloorPlan] = useState(floorPlan);
    const { getRootProps: getPhotoRootProps, getInputProps: getPhotoInputProps } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 10,
        onDrop: (acceptedFiles) => {
            setLocalPhotos([...localPhotos, ...acceptedFiles]);
        }
    });
    const { getRootProps: getFloorPlanRootProps, getInputProps: getFloorPlanInputProps } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            setLocalFloorPlan(acceptedFiles[0]);
        }
    });
    const removePhoto = (index) => {
        setLocalPhotos(localPhotos.filter((_, i) => i !== index));
    };
    const removeFloorPlan = () => {
        setLocalFloorPlan(null);
    };
    const handleNext = () => {
        if (!roomType) {
            toast({
                title: 'Room Type Required',
                description: 'Please select your room type',
                variant: 'destructive',
            });
            return;
        }
        if (localPhotos.length < 1 && !localFloorPlan) {
            toast({
                title: 'Photo or Floor Plan Required',
                description: 'Please upload at least 1 photo or a floor plan',
                variant: 'destructive',
            });
            return;
        }
        setRoomBasics({
            roomType,
            roomLength,
            roomWidth,
            roomHeight,
            photos: localPhotos,
            floorPlan: localFloorPlan,
        });
        onNext();
    };
    return (<div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold mb-2">Tell Us About Your Space</h2>
        <p className="text-muted-foreground">Let's start with the basics of your room</p>
      </div>

      {/* Room Type */}
      <div className="space-y-2">
        <Label>Room Type *</Label>
        <Select value={roomType} onValueChange={(value) => setRoomBasics({ roomType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your room type"/>
          </SelectTrigger>
          <SelectContent>
            {ROOM_TYPES.map((type) => (<SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {/* Upload Photos */}
      <div className="space-y-4">
        <Label>Upload Room Photos * (Min 1 required, or upload floor plan)</Label>
        <Card {...getPhotoRootProps()} className="border-2 border-dashed border-muted-foreground/25 p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
          <input {...getPhotoInputProps()}/>
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4"/>
          <p className="text-muted-foreground">
            Drag & drop photos here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Upload multiple angles of your room (JPG, PNG, WebP)
          </p>
        </Card>

        {/* Photo Previews */}
        {localPhotos.length > 0 && (<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {localPhotos.map((file, index) => (<div key={index} className="relative group">
                <img src={URL.createObjectURL(file)} alt={`Photo ${index + 1}`} className="w-full h-24 object-cover rounded-lg"/>
                <button type="button" onClick={() => removePhoto(index)} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="h-4 w-4"/>
                </button>
                <p className="text-xs text-center mt-1 text-muted-foreground truncate">
                  Photo {index + 1}
                </p>
              </div>))}
          </div>)}
        <p className="text-sm text-muted-foreground">
          {localPhotos.length} / 10 photos uploaded {localPhotos.length < 1 && !localFloorPlan && '(Need at least 1 photo or floor plan)'}
        </p>
      </div>

      {/* OR Floor Plan */}
      <div className="space-y-4">
        <Label>OR Upload Floor Plan (Optional)</Label>
        <Card {...getFloorPlanRootProps()} className="border-2 border-dashed border-muted-foreground/25 p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
          <input {...getFloorPlanInputProps()}/>
          <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2"/>
          <p className="text-muted-foreground">
            Upload floor plan (PDF or Image)
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            If you have architectural drawings, upload here
          </p>
        </Card>

        {localFloorPlan && (<div className="flex items-center justify-between p-3 bg-accent rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-secondary"/>
              <div>
                <p className="font-medium text-foreground">{localFloorPlan.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(localFloorPlan.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFloorPlan}>
              <X className="h-4 w-4"/>
            </Button>
          </div>)}
      </div>

      {/* Room Dimensions */}
      <div className="space-y-4">
        <Label>Room Dimensions (Optional but recommended)</Label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Input type="number" placeholder="Length (ft)" value={roomLength} onChange={(e) => setRoomBasics({ roomLength: e.target.value })}/>
          </div>
          <div>
            <Input type="number" placeholder="Width (ft)" value={roomWidth} onChange={(e) => setRoomBasics({ roomWidth: e.target.value })}/>
          </div>
          <div>
            <Input type="number" placeholder="Height (ft)" value={roomHeight} onChange={(e) => setRoomBasics({ roomHeight: e.target.value })}/>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          💡 Tip: Use your phone's Measure app for accurate dimensions
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={handleNext} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          Continue to Style Quiz
        </Button>
      </div>
    </div>);
}
