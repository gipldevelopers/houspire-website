import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Download, Maximize2, Check, RotateCcw, CheckCircle } from 'lucide-react';
import ImageLightbox from './ImageLightbox';
export default function RoomGallery({ roomName, files, onApprove, onRequestChanges, isApproved = false, isLoading = false }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    function handlePrevious() {
        setCurrentIndex(prev => (prev === 0 ? files.length - 1 : prev - 1));
    }
    function handleNext() {
        setCurrentIndex(prev => (prev === files.length - 1 ? 0 : prev + 1));
    }
    function handleDownload(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    function openLightbox(index) {
        setLightboxIndex(index ?? currentIndex);
        setLightboxOpen(true);
    }
    if (!files || files.length === 0) {
        return (<Card className="p-12 text-center">
        <p className="text-muted-foreground">No images available for this room</p>
      </Card>);
    }
    const currentFile = files[currentIndex];
    return (<div className="space-y-4">
      {/* Main Image Display */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-muted">
          <img src={currentFile.url} alt={`${roomName} design - View ${currentIndex + 1}`} className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => openLightbox()}/>

          {/* Navigation Arrows */}
          {files.length > 1 && (<>
              <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background shadow-md" onClick={handlePrevious}>
                <ChevronLeft className="h-6 w-6"/>
              </Button>
              <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background shadow-md" onClick={handleNext}>
                <ChevronRight className="h-6 w-6"/>
              </Button>
            </>)}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {files.length}
          </div>

          {/* View Angle Badge */}
          {currentFile.angle && (<Badge className="absolute top-4 left-4 capitalize bg-background/80 text-foreground">
              {currentFile.angle}
            </Badge>)}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="ghost" size="icon" className="bg-background/80 hover:bg-background" onClick={() => openLightbox()}>
              <Maximize2 className="h-4 w-4"/>
            </Button>
            <Button variant="ghost" size="icon" className="bg-background/80 hover:bg-background" onClick={() => handleDownload(currentFile.url, `${roomName}-${currentIndex + 1}.jpg`)}>
              <Download className="h-4 w-4"/>
            </Button>
          </div>
        </div>
      </Card>

      {/* Thumbnail Strip */}
      {files.length > 1 && (<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {files.map((file, index) => (<button key={index} onClick={() => setCurrentIndex(index)} onDoubleClick={() => openLightbox(index)} className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-muted-foreground/50'}`}>
              <img src={file.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
              {index === currentIndex && (<div className="absolute inset-0 bg-primary/10"/>)}
            </button>))}
        </div>)}

      {/* Room Actions */}
      {(onApprove || onRequestChanges) && !isApproved && (<Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div>
              <h4 className="font-semibold">{roomName}</h4>
              <p className="text-sm text-muted-foreground">
                {files.length} design view{files.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              {onRequestChanges && (<Button variant="outline" size="sm" onClick={onRequestChanges} disabled={isLoading}>
                  <RotateCcw className="h-4 w-4 mr-1"/>
                  Request Changes
                </Button>)}
              {onApprove && (<Button size="sm" onClick={onApprove} disabled={isLoading}>
                  <Check className="h-4 w-4 mr-1"/>
                  {isLoading ? 'Approving...' : 'Approve Room'}
                </Button>)}
            </div>
          </div>
        </Card>)}

      {isApproved && (<Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="h-5 w-5"/>
            <span className="font-medium">{roomName} - Approved</span>
          </div>
        </Card>)}

      {/* Lightbox */}
      <ImageLightbox images={files} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} roomName={roomName}/>
    </div>);
}
