import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Download, ExternalLink, RefreshCw, Loader2, CheckCircle2, XCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAndSaveInvoice, downloadInvoice } from '@/lib/invoice-generator';
export default function AdminInvoiceViewer({ orderId, invoiceNumber, invoiceUrl, invoiceGeneratedAt, totalAmount, onUpdate }) {
    const { toast } = useToast();
    const [regenerating, setRegenerating] = useState(false);
    const [downloading, setDownloading] = useState(false);
    async function handleRegenerate() {
        if (!confirm('Regenerate invoice?\n\n' +
            'This will create a new invoice PDF. The old invoice URL will be replaced.\n\n' +
            'Continue?')) {
            return;
        }
        setRegenerating(true);
        try {
            await generateAndSaveInvoice(orderId);
            toast({
                title: 'Invoice regenerated',
                description: 'New invoice has been generated successfully'
            });
            onUpdate?.();
        }
        catch (error) {
            console.error('Regeneration error:', error);
            toast({
                variant: 'destructive',
                title: 'Regeneration failed',
                description: error.message || 'Failed to regenerate invoice. Check console for details.'
            });
        }
        finally {
            setRegenerating(false);
        }
    }
    async function handleDownload() {
        setDownloading(true);
        try {
            await downloadInvoice(orderId);
            toast({
                title: 'Invoice downloaded',
                description: 'Invoice PDF has been downloaded'
            });
        }
        catch (error) {
            toast({
                variant: 'destructive',
                title: 'Download failed',
                description: error.message || 'Failed to download invoice'
            });
        }
        finally {
            setDownloading(false);
        }
    }
    function copyUrl() {
        if (invoiceUrl) {
            navigator.clipboard.writeText(invoiceUrl);
            toast({
                title: 'URL copied',
                description: 'Invoice URL copied to clipboard'
            });
        }
    }
    const hasInvoice = !!invoiceUrl;
    return (<Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary"/>
          </div>
          <div>
            <h4 className="font-semibold">Tax Invoice</h4>
            <p className="text-sm text-muted-foreground">
              {hasInvoice ? invoiceNumber : 'Not generated'}
            </p>
          </div>
        </div>

        {hasInvoice ? (<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1"/>
            Available
          </Badge>) : (<Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1"/>
            Missing
          </Badge>)}
      </div>

      {hasInvoice ? (<div className="space-y-4">
          <div className="text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">Invoice Number:</span>{' '}
              <span className="font-medium">{invoiceNumber}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Amount:</span>{' '}
              <span className="font-medium">₹{totalAmount.toLocaleString('en-IN')}</span>
            </p>
            {invoiceGeneratedAt && (<p>
                <span className="text-muted-foreground">Generated:</span>{' '}
                <span className="font-medium">{new Date(invoiceGeneratedAt).toLocaleString('en-IN')}</span>
              </p>)}
            {invoiceUrl && (<div className="flex items-center gap-2 mt-2">
                <span className="text-muted-foreground">URL:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[200px]">
                  {invoiceUrl}
                </code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyUrl}>
                  <Copy className="h-3 w-3"/>
                </Button>
              </div>)}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => window.open(invoiceUrl, '_blank')} variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2"/>
              View Invoice
            </Button>

            <Button onClick={handleDownload} variant="outline" size="sm" disabled={downloading}>
              {downloading ? (<Loader2 className="h-4 w-4 mr-2 animate-spin"/>) : (<Download className="h-4 w-4 mr-2"/>)}
              Download
            </Button>

            <Button onClick={handleRegenerate} variant="outline" size="sm" disabled={regenerating}>
              {regenerating ? (<>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                  Regenerating...
                </>) : (<>
                  <RefreshCw className="h-4 w-4 mr-2"/>
                  Regenerate
                </>)}
            </Button>
          </div>
        </div>) : (<div className="space-y-4">
          <Alert>
            <AlertDescription>
              Invoice has not been generated for this order. This usually happens if payment was completed before the invoice system was implemented.
            </AlertDescription>
          </Alert>

          <Button onClick={handleRegenerate} disabled={regenerating}>
            {regenerating ? (<>
                <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                Generating Invoice...
              </>) : (<>
                <FileText className="h-4 w-4 mr-2"/>
                Generate Invoice Now
              </>)}
          </Button>
        </div>)}
    </Card>);
}
