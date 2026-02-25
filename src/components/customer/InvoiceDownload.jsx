import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, ExternalLink, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadInvoice, generateAndSaveInvoice } from '@/lib/invoice-generator';
export default function InvoiceDownload({ orderId, invoiceNumber, invoiceUrl, invoiceGeneratedAt, totalAmount, orderNumber }) {
    const { toast } = useToast();
    const [downloading, setDownloading] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    async function handleDownload() {
        setDownloading(true);
        try {
            await downloadInvoice(orderId);
            toast({
                title: 'Invoice downloaded',
                description: 'Your invoice PDF has been downloaded'
            });
        }
        catch (error) {
            console.error('Download error:', error);
            toast({
                variant: 'destructive',
                title: 'Download failed',
                description: error.message || 'Failed to download invoice. Please try again.'
            });
        }
        finally {
            setDownloading(false);
        }
    }
    async function handleRegenerate() {
        setRegenerating(true);
        try {
            await generateAndSaveInvoice(orderId);
            toast({
                title: 'Invoice generated',
                description: 'New invoice has been generated successfully'
            });
            // Reload the page to show updated invoice info
            window.location.reload();
        }
        catch (error) {
            toast({
                variant: 'destructive',
                title: 'Generation failed',
                description: error.message || 'Failed to generate invoice. Please try again.'
            });
        }
        finally {
            setRegenerating(false);
        }
    }
    const hasInvoice = !!invoiceNumber;
    return (<Card className="p-6">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText className="h-6 w-6 text-primary"/>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-lg">Tax Invoice</h4>
            {hasInvoice && (<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1"/>
                Generated
              </Badge>)}
          </div>

          {hasInvoice ? (<>
              <div className="text-sm text-muted-foreground mb-4 space-y-1">
                <p>
                  <span className="text-foreground font-medium">Invoice Number:</span> {invoiceNumber}
                </p>
                <p>
                  <span className="text-foreground font-medium">Amount:</span> ₹{totalAmount.toLocaleString('en-IN')}
                </p>
                {invoiceGeneratedAt && (<p>
                    <span className="text-foreground font-medium">Generated:</span>{' '}
                    {new Date(invoiceGeneratedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}
                  </p>)}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleDownload} disabled={downloading} size="sm">
                  {downloading ? (<>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                      Downloading...
                    </>) : (<>
                      <Download className="h-4 w-4 mr-2"/>
                      Download Invoice
                    </>)}
                </Button>

                {invoiceUrl && (<Button variant="outline" size="sm" onClick={() => window.open(invoiceUrl, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2"/>
                    View
                  </Button>)}
              </div>
            </>) : (<>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4"/>
                <AlertDescription>
                  Invoice is being generated and will be available shortly.
                </AlertDescription>
              </Alert>

              <Button onClick={handleRegenerate} disabled={regenerating} size="sm">
                {regenerating ? (<>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                    Generating...
                  </>) : (<>
                    <FileText className="h-4 w-4 mr-2"/>
                    Generate Invoice
                  </>)}
              </Button>
            </>)}
        </div>
      </div>
    </Card>);
}
