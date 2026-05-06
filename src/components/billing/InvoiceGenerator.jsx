import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { appDataClient } from '@/lib/static-client';
import { Download, Mail, Printer, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadInvoice, printInvoice } from '@/lib/invoice-generator';
export function InvoiceGenerator({ projectId, data }) {
    const { toast } = useToast();
    const [downloading, setDownloading] = useState(false);
    const [printing, setPrinting] = useState(false);
    const handleDownload = async () => {
        setDownloading(true);
        try {
            await downloadInvoice(projectId);
            toast({
                title: 'Invoice Downloaded',
                description: 'Your invoice PDF has been downloaded.',
            });
        }
        catch (error) {
            console.error('Download failed:', error);
            toast({
                title: 'Download Failed',
                description: error.message || 'Failed to download invoice',
                variant: 'destructive',
            });
        }
        finally {
            setDownloading(false);
        }
    };
    const handlePrint = async () => {
        setPrinting(true);
        try {
            await printInvoice(projectId);
        }
        catch (error) {
            toast({
                title: 'Print Failed',
                description: error.message || 'Failed to open invoice for printing',
                variant: 'destructive',
            });
        }
        finally {
            setPrinting(false);
        }
    };
    const sendEmail = async () => {
        try {
            const { error } = await appDataClient.functions.invoke('send-invoice', {
                body: { projectId, email: data.customerEmail },
            });
            if (error)
                throw error;
            toast({
                title: 'Invoice Sent',
                description: 'Invoice has been sent successfully!',
            });
        }
        catch (error) {
            toast({
                title: 'Failed to Send',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'partial':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };
    return (<div className="space-y-6">
      {/* Actions */}
      <div className="flex gap-3 print:hidden">
        <Button variant="outline" onClick={handleDownload} disabled={downloading}>
          {downloading ? (<Loader2 className="h-4 w-4 mr-2 animate-spin"/>) : (<Download className="h-4 w-4 mr-2"/>)}
          Download PDF
        </Button>
        <Button variant="outline" onClick={sendEmail}>
          <Mail className="h-4 w-4 mr-2"/>
          Email Invoice
        </Button>
        <Button variant="outline" onClick={handlePrint} disabled={printing}>
          {printing ? (<Loader2 className="h-4 w-4 mr-2 animate-spin"/>) : (<Printer className="h-4 w-4 mr-2"/>)}
          Print
        </Button>
      </div>

      {/* Invoice */}
      <Card className="p-8 print:shadow-none print:border-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">
              INVOICE
            </h1>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>
                Invoice #: <span className="font-medium text-foreground">{data.invoiceNumber}</span>
              </p>
              <p>
                Date:{' '}
                <span className="font-medium text-foreground">
                  {new Date(data.invoiceDate).toLocaleDateString('en-IN')}
                </span>
              </p>
              <p>
                Due Date:{' '}
                <span className="font-medium text-foreground">
                  {new Date(data.dueDate).toLocaleDateString('en-IN')}
                </span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <h2 className="text-xl font-heading font-bold text-primary">
              Houspire
            </h2>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Interior Design Services</p>
              <p>Hyderabad, India</p>
              <p>hello@houspire.ai</p>
              <p>+91 70758 27625</p>
              <p className="mt-1 font-medium">
                GSTIN: 29XXXXX1234X1ZX
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bill To */}
        <div className="my-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Bill To:</p>
          <div className="text-sm">
            <p className="font-semibold">{data.customerName}</p>
            <p>{data.customerEmail}</p>
            <p>{data.customerPhone}</p>
            <p className="whitespace-pre-line">{data.customerAddress}</p>
          </div>
        </div>

        <Separator />

        {/* Items Table */}
        <div className="my-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium">Description</th>
                <th className="text-center py-3 font-medium">Qty</th>
                <th className="text-right py-3 font-medium">Unit Price</th>
                <th className="text-right py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (<tr key={index} className="border-b">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">₹{item.unitPrice.toLocaleString()}</td>
                  <td className="py-3 text-right font-medium">
                    ₹{item.total.toLocaleString()}
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>

        <Separator />

        {/* Totals */}
        <div className="my-6">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>₹{data.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%):</span>
                <span>₹{data.gst.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">₹{data.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Status */}
        <div className="my-6">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Payment Status</p>
              <p className="text-sm text-muted-foreground">
                {data.paymentMethod && `Method: ${data.paymentMethod}`}
                {data.transactionId && ` • Transaction ID: ${data.transactionId}`}
              </p>
            </div>
            <Badge className={getStatusColor(data.paymentStatus)}>
              {data.paymentStatus.toUpperCase()}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="mt-6 text-sm text-muted-foreground">
          <p className="font-medium mb-2">
            Payment Terms: Payment due within 7 days
          </p>
          <p className="mb-2">
            Note: Thank you for choosing Houspire! For any
            queries, contact hello@houspire.ai
          </p>
          <p className="text-xs italic">
            This is a computer-generated invoice and does not require a signature
          </p>
        </div>
      </Card>
    </div>);
}

