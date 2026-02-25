import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Package, Download, FileText, Image as ImageIcon, CheckCircle, FileSpreadsheet, Mail, Share2, Loader2 } from 'lucide-react';
export function DeliveryPackage({ projectId, projectName, onComplete }) {
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const { toast } = useToast();
    const [deliverables, setDeliverables] = useState([
        {
            id: 'renders',
            name: 'Room Designs Package',
            description: 'High-resolution photorealistic designs from all angles',
            type: 'images',
            icon: ImageIcon,
            included: true,
            status: 'ready',
        },
        {
            id: 'floor_plan',
            name: 'Floor Plan',
            description: 'Detailed floor plan with measurements',
            type: 'pdf',
            icon: FileText,
            included: true,
            status: 'ready',
        },
        {
            id: 'shopping_list',
            name: 'Shopping List',
            description: 'Complete product list with vendor details',
            type: 'excel',
            icon: FileSpreadsheet,
            included: true,
            status: 'ready',
        },
        {
            id: 'budget_breakdown',
            name: 'Budget Breakdown',
            description: 'Itemized budget with cost breakdown',
            type: 'excel',
            icon: FileSpreadsheet,
            included: true,
            status: 'ready',
        },
        {
            id: 'vendor_directory',
            name: 'Vendor Directory',
            description: 'Contact details for all recommended vendors',
            type: 'pdf',
            icon: FileText,
            included: true,
            status: 'ready',
        },
        {
            id: 'color_palette',
            name: 'Color Palette Guide',
            description: 'Paint colors with codes and brand names',
            type: 'pdf',
            icon: FileText,
            included: true,
            status: 'ready',
        },
        {
            id: 'material_specs',
            name: 'Material Specifications',
            description: 'Detailed specs for all materials used',
            type: 'pdf',
            icon: FileText,
            included: true,
            status: 'ready',
        },
        {
            id: 'implementation_guide',
            name: 'Implementation Timeline',
            description: 'Week-by-week execution guide',
            type: 'pdf',
            icon: FileText,
            included: true,
            status: 'ready',
        },
        {
            id: 'maintenance_guide',
            name: 'Maintenance Guide',
            description: 'Care instructions for furniture and materials',
            type: 'pdf',
            icon: FileText,
            included: true,
            status: 'ready',
        },
    ]);
    const generatePackage = async () => {
        setGenerating(true);
        setProgress(0);
        try {
            const includedItems = deliverables.filter(d => d.included);
            const totalItems = includedItems.length;
            for (let i = 0; i < totalItems; i++) {
                const item = includedItems[i];
                setDeliverables(prev => prev.map(d => d.id === item.id ? { ...d, status: 'generating' } : d));
                await new Promise(resolve => setTimeout(resolve, 1000));
                setDeliverables(prev => prev.map(d => d.id === item.id
                    ? { ...d, status: 'ready', fileUrl: `/delivery/${projectId}/${item.id}.${item.type}` }
                    : d));
                setProgress(((i + 1) / totalItems) * 100);
            }
            toast({
                title: 'Package Generated!',
                description: 'Your complete design package is ready to download',
            });
            if (onComplete) {
                onComplete();
            }
        }
        catch (error) {
            toast({
                title: 'Generation Failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setGenerating(false);
        }
    };
    const downloadAll = async () => {
        const includedItems = deliverables.filter(d => d.included && d.status === 'ready');
        toast({
            title: 'Downloading...',
            description: `Preparing ${includedItems.length} files for download`,
        });
        setTimeout(() => {
            toast({
                title: 'Download Complete!',
                description: 'All files have been downloaded',
            });
        }, 2000);
    };
    const shareViaEmail = () => {
        const subject = encodeURIComponent(`Your ${projectName} Design Package`);
        const body = encodeURIComponent(`Hi,\n\nYour complete interior design package is ready!\n\nProject: ${projectName}\nGenerated: ${new Date().toLocaleDateString()}\n\nBest regards,\nHouspire Team`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
    };
    const readyCount = deliverables.filter(d => d.status === 'ready' && d.included).length;
    const totalCount = deliverables.filter(d => d.included).length;
    const allReady = readyCount === totalCount && totalCount > 0;
    return (<div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Package className="h-8 w-8 text-primary"/>
            <div>
              <h2 className="text-2xl font-heading font-bold mb-2">
                Final Delivery Package
              </h2>
              <p className="text-muted-foreground">
                Everything you need to bring your design to life
              </p>
            </div>
          </div>
          {allReady && (<Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1"/>
              Ready
            </Badge>)}
        </div>
      </Card>

      {/* Generation Progress */}
      {generating && (<Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Generating Your Package...</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress}/>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin"/>
              This may take a few minutes. Please don't close this page.
            </p>
          </div>
        </Card>)}

      {/* Package Contents */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Package Contents</h3>
        <div className="space-y-3">
          {deliverables.map((item) => (<div key={item.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary"/>
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.status === 'generating' && (<Badge variant="outline" className="gap-1">
                    <Loader2 className="h-3 w-3 animate-spin"/>
                    Generating
                  </Badge>)}
                {item.status === 'ready' && (<>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1"/>
                      Ready
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4"/>
                    </Button>
                  </>)}
                {item.status === 'pending' && (<Badge variant="outline">Pending</Badge>)}
              </div>
            </div>))}
        </div>
      </Card>

      {/* Package Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {deliverables.filter(d => d.type === 'images').length}
          </p>
          <p className="text-sm text-muted-foreground">Image Sets</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {deliverables.filter(d => d.type === 'pdf').length}
          </p>
          <p className="text-sm text-muted-foreground">PDF Documents</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {deliverables.filter(d => d.type === 'excel').length}
          </p>
          <p className="text-sm text-muted-foreground">Spreadsheets</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {deliverables.length}
          </p>
          <p className="text-sm text-muted-foreground">Total Items</p>
        </Card>
      </div>

      <Separator />

      {/* Actions */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Download & Share</h3>
        
        {!allReady ? (<Button className="w-full" onClick={generatePackage} disabled={generating}>
            {generating ? (<>
                <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                Generating Package...
              </>) : (<>
                <Package className="h-4 w-4 mr-2"/>
                Generate Complete Package
              </>)}
          </Button>) : (<div className="space-y-3">
            <Button className="w-full" onClick={downloadAll}>
              <Download className="h-4 w-4 mr-2"/>
              Download All Files (ZIP)
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={shareViaEmail}>
                <Mail className="h-4 w-4 mr-2"/>
                Email Package
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2"/>
                Share Link
              </Button>
            </div>
          </div>)}
      </Card>

      {/* What's Included Details */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">What You'll Get</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="font-medium mb-2">Design Files</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• High-res photorealistic room designs</p>
              <p>• Multiple angle views</p>
              <p>• Close-up detail shots</p>
              <p>• Before/after comparisons</p>
            </div>
          </div>
          <div>
            <p className="font-medium mb-2">Planning Documents</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• Measured floor plans</p>
              <p>• Furniture placement guide</p>
              <p>• Electrical layout</p>
              <p>• Lighting plan</p>
            </div>
          </div>
          <div>
            <p className="font-medium mb-2">Shopping Resources</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• Complete product list</p>
              <p>• Vendor contact details</p>
              <p>• Direct purchase links</p>
              <p>• Alternative options</p>
            </div>
          </div>
          <div>
            <p className="font-medium mb-2">Execution Guides</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• Week-by-week timeline</p>
              <p>• Installation instructions</p>
              <p>• Contractor recommendations</p>
              <p>• Maintenance tips</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Support Info */}
      <Card className="p-6 border-primary/20 bg-primary/5">
        <h3 className="font-semibold mb-2">Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our support team is here to help you understand and use your design package.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2"/>
            Email Support
          </Button>
          <Button variant="outline" size="sm">
            Schedule Call
          </Button>
        </div>
      </Card>
    </div>);
}
