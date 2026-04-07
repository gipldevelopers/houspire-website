'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dataGet } from '@/lib/frontend-data';
import { useToast } from '@/hooks/use-toast';
import { downloadAllFiles } from '@/lib/downloadUtils';
import {
  Download,
  Eye,
  Image as ImageIcon,
  DollarSign,
  Store,
  ExternalLink,
  Clock,
  Loader2,
  FileText,
  MapPin,
  Phone,
  Mail,
  Package,
} from 'lucide-react';

export function PublishedContent({ projectId }) {
  const { toast } = useToast();
  const [content, setContent] = useState([]);
  const [budget, setBudget] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchPublishedContent();

    // Poll for new content (replacing real-time subscription)
    const interval = setInterval(() => {
      fetchPublishedContent();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [projectId]);

  const fetchPublishedContent = async () => {
    setLoading(true);

    try {
      // Fetch all published content in parallel
      const [contentData, budgetData, vendorsData, materialsData] = await Promise.all([
        dataGet(`/projects/${projectId}/files?published=true`),
        dataGet(`/projects/${projectId}/budget?published=true`),
        dataGet(`/projects/${projectId}/vendors?published=true`),
        dataGet(`/projects/${projectId}/materials?published=true`),
      ]);

      if (contentData) setContent(contentData);
      if (budgetData) setBudget(budgetData);
      if (vendorsData) setVendors(vendorsData);
      if (materialsData) setMaterials(materialsData);

      // Show toast if new content is available
      if (contentData && contentData.length > 0) {
        toast({
          title: 'New Content Available! 🎨',
          description: 'Your designer just published new content',
        });
      }
    } catch (error) {
      console.error('Failed to fetch published content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    setDownloading(true);
    
    try {
      await downloadAllFiles(projectId, content, budget, vendors, materials);
      
      toast({
        title: 'Download complete! 📦',
        description: 'All files have been downloaded as a ZIP',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  const renders = content.filter(c => c.content_type === 'render');
  const moodboards = content.filter(c => c.content_type === 'moodboard');
  const floorplans = content.filter(c => c.content_type === 'floorplan');
  const documents = content.filter(c => c.content_type === 'document');

  const grandTotal = budget.reduce((sum, item) => sum + (item.total_price || 0), 0);

  const hasContent = content.length > 0 || budget.length > 0 || vendors.length > 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading your design package...</p>
      </div>
    );
  }

  if (!hasContent) {
    return (
      <Card className="p-12 text-center">
        <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-xl font-semibold mb-2">Design in progress</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          Your designer is working on your 3D renders and budget breakdown. 
          You'll be notified when they're ready!
        </p>
        <Badge variant="outline" className="gap-2">
          <Clock className="h-3 w-3" />
          Expected within 72 hours
        </Badge>
      </Card>
    );
  }

  const totalItems = content.length + budget.length + vendors.length + materials.length;

  return (
    <div className="space-y-4">
      {/* Download All Button */}
      {hasContent && (
        <div className="flex justify-end">
          <Button
            onClick={handleDownloadAll}
            disabled={downloading}
            className="gap-2"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating ZIP...
              </>
            ) : (
              <>
                <Package className="h-4 w-4" />
                Download All ({totalItems} items)
              </>
            )}
          </Button>
        </div>
      )}

      <Tabs defaultValue={renders.length > 0 ? 'renders' : budget.length > 0 ? 'budget' : 'vendors'} className="w-full">
        <TabsList className="w-full justify-start mb-6 bg-muted/50 p-1 rounded-lg">
        {renders.length > 0 && (
          <TabsTrigger value="renders" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            3D Renders ({renders.length})
          </TabsTrigger>
        )}
        {moodboards.length > 0 && (
          <TabsTrigger value="moodboards" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Moodboards ({moodboards.length})
          </TabsTrigger>
        )}
        {floorplans.length > 0 && (
          <TabsTrigger value="floorplans" className="gap-2">
            <FileText className="h-4 w-4" />
            Floor Plans ({floorplans.length})
          </TabsTrigger>
        )}
        {budget.length > 0 && (
          <TabsTrigger value="budget" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Budget
          </TabsTrigger>
        )}
        {vendors.length > 0 && (
          <TabsTrigger value="vendors" className="gap-2">
            <Store className="h-4 w-4" />
            Vendors ({vendors.length})
          </TabsTrigger>
        )}
      </TabsList>

      {/* Renders Tab */}
      {renders.length > 0 && (
        <TabsContent value="renders">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renders.map((render) => (
              <Card key={render.id} className="overflow-hidden group">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={render.file_url} 
                    alt={render.file_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => window.open(render.file_url, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-medium truncate">{render.file_name}</p>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(render.file_url, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = render.file_url;
                        link.download = render.file_name;
                        link.click();
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      )}

      {/* Moodboards Tab */}
      {moodboards.length > 0 && (
        <TabsContent value="moodboards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moodboards.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted">
                  <img 
                    src={item.file_url} 
                    alt={item.file_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="font-medium">{item.file_name}</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2 w-full"
                    onClick={() => window.open(item.file_url, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Full Size
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      )}

      {/* Floor Plans Tab */}
      {floorplans.length > 0 && (
        <TabsContent value="floorplans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {floorplans.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.file_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.file_size ? `${(item.file_size / 1024).toFixed(1)} KB` : 'Floor plan'}
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => window.open(item.file_url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      )}

      {/* Budget Tab */}
      {budget.length > 0 && (
        <TabsContent value="budget">
          <Card className="overflow-hidden">
            <div className="p-6 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Budget Breakdown</h3>
                  <p className="text-sm text-muted-foreground">Itemized cost estimate for your design</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Estimate</p>
                  <p className="text-2xl font-bold text-primary">₹{grandTotal.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="divide-y">
              {budget.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.item_name}</p>
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Qty: {item.quantity || 1} × ₹{(item.unit_price || 0).toLocaleString()}
                    </p>
                  </div>
                  <p className="font-semibold text-lg">₹{(item.total_price || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-primary/5 border-t">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Grand Total</span>
                <span className="text-xl font-bold text-primary">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      )}

      {/* Vendors Tab */}
      {vendors.length > 0 && (
        <TabsContent value="vendors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.map((vendor) => (
              <Card key={vendor.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold">{vendor.name}</h4>
                        <Badge variant="outline" className="mt-1">{vendor.category}</Badge>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5 text-sm">
                      {vendor.contact_person && (
                        <p className="text-muted-foreground">Contact: {vendor.contact_person}</p>
                      )}
                      {vendor.phone && (
                        <a href={`tel:${vendor.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {vendor.phone}
                        </a>
                      )}
                      {vendor.email && (
                        <a href={`mailto:${vendor.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {vendor.email}
                        </a>
                      )}
                      {vendor.items_supplied && (
                        <p className="text-muted-foreground">Items: {vendor.items_supplied}</p>
                      )}
                      {vendor.price_range && (
                        <p className="text-muted-foreground">Price range: {vendor.price_range}</p>
                      )}
                    </div>

                    {vendor.address && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 w-full"
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(vendor.address || '')}`, '_blank')}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        View on Map
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      )}
      </Tabs>
    </div>
  );
}


