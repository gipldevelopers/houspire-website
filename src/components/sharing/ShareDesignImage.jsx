import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Share2, Copy, Instagram, Loader2, Smartphone, Square, } from 'lucide-react';
const FORMAT_CONFIG = {
    story: { width: 1080, height: 1920, label: 'Story (9:16)', icon: Smartphone },
    post: { width: 1080, height: 1080, label: 'Post (1:1)', icon: Square },
};
export function ShareDesignImage({ open, onOpenChange, beforeImage, afterImage, roomType, styleName, orderNumber, }) {
    const { toast } = useToast();
    const canvasRef = useRef(null);
    const [format, setFormat] = useState('story');
    const [generating, setGenerating] = useState(false);
    const [generatedDataUrl, setGeneratedDataUrl] = useState(null);
    const hasBefore = !!beforeImage;
    // Generate canvas whenever format changes or modal opens
    useEffect(() => {
        if (open && afterImage) {
            generateCanvas();
        }
    }, [open, format, afterImage, beforeImage]);
    const generateCanvas = async () => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        setGenerating(true);
        const config = FORMAT_CONFIG[format];
        canvas.width = config.width;
        canvas.height = config.height;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        try {
            // Background
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (hasBefore && beforeImage) {
                // Split view - Before/After
                const splitAngle = 5 * (Math.PI / 180); // 5 degrees
                const centerX = canvas.width / 2;
                // Load images
                const [beforeImg, afterImg] = await Promise.all([
                    loadImage(beforeImage),
                    loadImage(afterImage),
                ]);
                // Draw before (left side)
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(centerX + Math.tan(splitAngle) * canvas.height / 2, 0);
                ctx.lineTo(centerX - Math.tan(splitAngle) * canvas.height / 2, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();
                ctx.clip();
                drawCoverImage(ctx, beforeImg, 0, 0, canvas.width, canvas.height);
                ctx.restore();
                // Draw after (right side)
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(centerX + Math.tan(splitAngle) * canvas.height / 2, 0);
                ctx.lineTo(canvas.width, 0);
                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(centerX - Math.tan(splitAngle) * canvas.height / 2, canvas.height);
                ctx.closePath();
                ctx.clip();
                drawCoverImage(ctx, afterImg, 0, 0, canvas.width, canvas.height);
                ctx.restore();
                // Draw split line
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(centerX + Math.tan(splitAngle) * canvas.height / 2, 0);
                ctx.lineTo(centerX - Math.tan(splitAngle) * canvas.height / 2, canvas.height);
                ctx.stroke();
                // Labels
                ctx.font = 'bold 32px system-ui';
                ctx.textAlign = 'center';
                // Before label (left)
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(40, 60, 160, 50);
                ctx.fillStyle = '#ffffff';
                ctx.fillText('BEFORE', 120, 98);
                // After label (right)
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(canvas.width - 200, 60, 160, 50);
                ctx.fillStyle = '#ffffff';
                ctx.fillText('AFTER', canvas.width - 120, 98);
            }
            else {
                // Single after image
                const afterImg = await loadImage(afterImage);
                drawCoverImage(ctx, afterImg, 0, 0, canvas.width, canvas.height);
            }
            // Bottom bar with branding
            const barHeight = 140;
            const gradient = ctx.createLinearGradient(0, canvas.height - barHeight - 50, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.8)');
            gradient.addColorStop(1, 'rgba(0,0,0,0.95)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, canvas.height - barHeight - 50, canvas.width, barHeight + 50);
            // Branding text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px system-ui';
            ctx.textAlign = 'left';
            ctx.fillText('HOUSPIRE', 50, canvas.height - 80);
            ctx.font = '24px system-ui';
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillText(`${styleName} ${roomType}`, 50, canvas.height - 40);
            // Watermark
            ctx.font = '18px system-ui';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fillText('houspire.com', canvas.width - 50, canvas.height - 50);
            setGeneratedDataUrl(canvas.toDataURL('image/jpeg', 0.95));
        }
        catch (error) {
            console.error('Canvas generation error:', error);
            toast({
                title: 'Failed to generate image',
                description: 'Please try again',
                variant: 'destructive',
            });
        }
        finally {
            setGenerating(false);
        }
    };
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };
    const drawCoverImage = (ctx, img, x, y, w, h) => {
        const imgRatio = img.width / img.height;
        const canvasRatio = w / h;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (imgRatio > canvasRatio) {
            sw = img.height * canvasRatio;
            sx = (img.width - sw) / 2;
        }
        else {
            sh = img.width / canvasRatio;
            sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    };
    const handleDownload = () => {
        if (!generatedDataUrl)
            return;
        const link = document.createElement('a');
        link.download = `houspire-${styleName.toLowerCase().replace(/\s+/g, '-')}-${format}.jpg`;
        link.href = generatedDataUrl;
        link.click();
        toast({
            title: 'Image downloaded! 📥',
            description: 'Share it on your favorite platform',
        });
    };
    const handleShareWhatsApp = async () => {
        if (!generatedDataUrl)
            return;
        // Try native share first
        if (navigator.share && navigator.canShare) {
            try {
                const blob = await fetch(generatedDataUrl).then(r => r.blob());
                const file = new File([blob], 'houspire-design.jpg', { type: 'image/jpeg' });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: `My ${styleName} ${roomType} Design`,
                        text: `Check out my room transformation by Houspire! 🏠✨`,
                    });
                    return;
                }
            }
            catch (error) {
                console.log('Native share failed, falling back');
            }
        }
        // Fallback to WhatsApp link
        const text = encodeURIComponent(`Check out my ${styleName} ${roomType} design by Houspire! 🏠✨\n\nGet your room designed starting at ₹999: https://houspire.com`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };
    const handleCopyLink = () => {
        navigator.clipboard.writeText('https://houspire.com');
        toast({
            title: 'Link copied! 📋',
            description: 'Share the Houspire link with friends',
        });
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary"/>
            Share Your Transformation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selector */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v)} className="flex gap-4">
              {Object.entries(FORMAT_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            return (<div key={key} className="flex-1">
                    <RadioGroupItem value={key} id={key} className="sr-only"/>
                    <Label htmlFor={key} className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${format === key
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'}`}>
                      <Icon className={`h-8 w-8 mb-2 ${format === key ? 'text-primary' : 'text-muted-foreground'}`}/>
                      <span className="font-medium">{config.label}</span>
                    </Label>
                  </div>);
        })}
            </RadioGroup>
          </div>

          {/* Preview */}
          <div className="relative bg-muted rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
            {generating ? (<div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                <span className="text-sm text-muted-foreground">Generating image...</span>
              </div>) : generatedDataUrl ? (<img src={generatedDataUrl} alt="Share preview" className="max-h-[400px] w-auto object-contain"/>) : null}
            
            {/* Hidden canvas for generation */}
            <canvas ref={canvasRef} className="hidden"/>
          </div>

          {/* Share Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button onClick={handleDownload} disabled={!generatedDataUrl || generating} className="flex flex-col items-center gap-1 h-auto py-3">
              <Download className="h-5 w-5"/>
              <span className="text-xs">Download</span>
            </Button>

            <Button onClick={handleShareWhatsApp} disabled={!generatedDataUrl || generating} variant="outline" className="flex flex-col items-center gap-1 h-auto py-3 border-success/50 text-success hover:bg-success/10">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-xs">WhatsApp</span>
            </Button>

            <Button onClick={handleCopyLink} disabled={generating} variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
              <Copy className="h-5 w-5"/>
              <span className="text-xs">Copy Link</span>
            </Button>

            <Button onClick={() => {
            toast({
                title: 'Share on Instagram',
                description: 'Download the image and share it from your Instagram app',
            });
        }} disabled={generating} variant="outline" className="flex flex-col items-center gap-1 h-auto py-3 border-accent/50 text-accent hover:bg-accent/10">
              <Instagram className="h-5 w-5"/>
              <span className="text-xs">Instagram</span>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Tag @houspire on Instagram to be featured on our gallery!
          </p>
        </div>
      </DialogContent>
    </Dialog>);
}
