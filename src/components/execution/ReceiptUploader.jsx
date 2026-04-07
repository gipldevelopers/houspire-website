import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useDropzone } from 'react-dropzone';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, FileText, Image as ImageIcon, Check, Receipt as ReceiptIcon, Download, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
export function ReceiptUploader({ projectId, productId, productName, onUploadComplete }) {
    const [uploading, setUploading] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [receiptDetails, setReceiptDetails] = useState({
        amount_paid: '',
        purchase_date: new Date().toISOString().split('T')[0],
        vendor_name: '',
    });
    const [viewingReceipt, setViewingReceipt] = useState(null);
    const { toast } = useToast();
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
        }
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
            'application/pdf': ['.pdf'],
        },
        maxSize: 10 * 1024 * 1024,
        multiple: false,
        onDrop,
    });
    const fetchReceipts = useCallback(async () => {
        let query = appDataClient
            .from('receipts')
            .select('*')
            .eq('project_id', projectId);
        if (productId) {
            query = query.eq('product_id', productId);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data) {
            setReceipts(data);
        }
    }, [projectId, productId]);
    useEffect(() => {
        fetchReceipts();
    }, [fetchReceipts]);
    const handleUpload = async () => {
        if (!selectedFile) {
            toast({
                title: 'No file selected',
                description: 'Please select a receipt to upload',
                variant: 'destructive',
            });
            return;
        }
        if (!receiptDetails.amount_paid || !receiptDetails.vendor_name) {
            toast({
                title: 'Missing details',
                description: 'Please fill in all receipt details',
                variant: 'destructive',
            });
            return;
        }
        setUploading(true);
        try {
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${projectId}/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await appDataClient.storage
                .from('receipts')
                .upload(fileName, selectedFile);
            if (uploadError)
                throw uploadError;
            const { data: urlData } = appDataClient.storage
                .from('receipts')
                .getPublicUrl(fileName);
            const { error: receiptError } = await appDataClient
                .from('receipts')
                .insert({
                project_id: projectId,
                product_id: productId || null,
                product_name: productName || null,
                file_url: urlData.publicUrl,
                file_name: selectedFile.name,
                amount_paid: parseFloat(receiptDetails.amount_paid),
                purchase_date: receiptDetails.purchase_date,
                vendor_name: receiptDetails.vendor_name,
            });
            if (receiptError)
                throw receiptError;
            toast({
                title: 'Receipt uploaded!',
                description: 'Your purchase has been documented',
            });
            setSelectedFile(null);
            setReceiptDetails({
                amount_paid: '',
                purchase_date: new Date().toISOString().split('T')[0],
                vendor_name: '',
            });
            if (onUploadComplete) {
                onUploadComplete();
            }
            fetchReceipts();
        }
        catch (error) {
            toast({
                title: 'Upload failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setUploading(false);
        }
    };
    const deleteReceipt = async (receiptId, fileUrl) => {
        try {
            const filePath = fileUrl.split('/receipts/')[1];
            if (filePath) {
                await appDataClient.storage.from('receipts').remove([filePath]);
            }
            await appDataClient.from('receipts').delete().eq('id', receiptId);
            toast({
                title: 'Receipt deleted',
                description: 'The receipt has been removed',
            });
            fetchReceipts();
        }
        catch (error) {
            toast({
                title: 'Delete failed',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    return (<div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <ReceiptIcon className="h-5 w-5 text-primary"/>
          <h3 className="font-semibold">Upload Receipt</h3>
        </div>

        <div className="space-y-4">
          {/* File Dropzone */}
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${selectedFile ? 'bg-muted' : ''}`}>
            <input {...getInputProps()}/>
            {selectedFile ? (<div className="flex items-center justify-center gap-3">
                {selectedFile.type.startsWith('image/') ? (<ImageIcon className="h-10 w-10 text-muted-foreground"/>) : (<FileText className="h-10 w-10 text-muted-foreground"/>)}
                <div className="text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
            }}>
                  <X className="h-4 w-4"/>
                </Button>
              </div>) : (<div className="space-y-2">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground"/>
                <p className="font-medium">
                  {isDragActive ? 'Drop here' : 'Drag & drop receipt here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse (PNG, JPG, PDF up to 10MB)
                </p>
              </div>)}
          </div>

          {/* Receipt Details */}
          {selectedFile && (<>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Amount Paid *</Label>
                  <Input type="number" placeholder="₹0" value={receiptDetails.amount_paid} onChange={(e) => setReceiptDetails({
                ...receiptDetails,
                amount_paid: e.target.value
            })}/>
                </div>
                <div className="space-y-2">
                  <Label>Purchase Date *</Label>
                  <Input type="date" value={receiptDetails.purchase_date} onChange={(e) => setReceiptDetails({
                ...receiptDetails,
                purchase_date: e.target.value
            })}/>
                </div>
                <div className="space-y-2">
                  <Label>Vendor Name *</Label>
                  <Input placeholder="Store name" value={receiptDetails.vendor_name} onChange={(e) => setReceiptDetails({
                ...receiptDetails,
                vendor_name: e.target.value
            })}/>
                </div>
              </div>

              <Button onClick={handleUpload} disabled={uploading} className="w-full">
                {uploading ? (<>Uploading...</>) : (<>
                    <Upload className="mr-2 h-4 w-4"/>
                    Upload Receipt
                  </>)}
              </Button>
            </>)}
        </div>
      </Card>

      {/* Receipts List */}
      {receipts.length > 0 && (<Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Check className="h-5 w-5 text-green-500"/>
            <h3 className="font-semibold">Uploaded Receipts ({receipts.length})</h3>
          </div>

          <div className="space-y-3">
            {receipts.map((receipt) => (<div key={receipt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {receipt.file_name.toLowerCase().endsWith('.pdf') ? (<FileText className="h-8 w-8 text-red-500"/>) : (<ImageIcon className="h-8 w-8 text-blue-500"/>)}
                  
                  <div>
                    <p className="font-medium">{receipt.product_name || 'Receipt'}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{Number(receipt.amount_paid).toLocaleString()}
                      <span className="mx-1">•</span>
                      {new Date(receipt.purchase_date).toLocaleDateString()}
                      <span className="mx-1">•</span>
                      {receipt.vendor_name}
                    </p>
                  </div>

                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Check className="h-3 w-3 mr-1"/>
                    Verified
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setViewingReceipt(receipt)}>
                    View
                  </Button>
                  <a href={receipt.file_url} download target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4"/>
                    </Button>
                  </a>
                  <Button variant="ghost" size="icon" onClick={() => deleteReceipt(receipt.id, receipt.file_url)}>
                    <Trash2 className="h-4 w-4 text-destructive"/>
                  </Button>
                </div>
              </div>))}
          </div>
        </Card>)}

      {/* Receipt Viewer Modal */}
      <Dialog open={!!viewingReceipt} onOpenChange={() => setViewingReceipt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
          </DialogHeader>

          {viewingReceipt && (<div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Product:</span>
                  <p className="font-medium">{viewingReceipt.product_name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p className="font-medium">₹{Number(viewingReceipt.amount_paid).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Vendor:</span>
                  <p className="font-medium">{viewingReceipt.vendor_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium">
                    {new Date(viewingReceipt.purchase_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {viewingReceipt.file_name.toLowerCase().endsWith('.pdf') ? (<div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg">
                  <FileText className="h-16 w-16 text-red-500 mb-4"/>
                  <p className="font-medium">PDF Receipt</p>
                  <a href={viewingReceipt.file_url} download target="_blank" rel="noopener noreferrer">
                    <Button className="mt-2">
                      <Download className="mr-2 h-4 w-4"/>
                      Download PDF
                    </Button>
                  </a>
                </div>) : (<img src={viewingReceipt.file_url} alt="Receipt" className="w-full rounded-lg"/>)}
            </div>)}
        </DialogContent>
      </Dialog>
    </div>);
}

