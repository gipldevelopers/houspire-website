import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, ShoppingBag, Users, ExternalLink } from 'lucide-react';
export default function DocumentsView({ designFiles, budgetFileUrl, shoppingListUrl, vendorList }) {
    function handleDownload(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    function openDocument(url) {
        window.open(url, '_blank');
    }
    const budgetUrl = designFiles?.budget?.url || budgetFileUrl;
    const shoppingUrl = designFiles?.shopping_list?.url || shoppingListUrl;
    const vendorUrl = designFiles?.vendor_list?.url || (typeof vendorList === 'string' ? vendorList : null);
    const hasDocuments = budgetUrl || shoppingUrl || vendorUrl;
    if (!hasDocuments) {
        return (<Card className="p-12 text-center">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50"/>
        <h3 className="text-lg font-semibold mb-2">No Documents Available</h3>
        <p className="text-muted-foreground">
          Documents will appear here once your design is delivered.
        </p>
      </Card>);
    }
    return (<div className="space-y-6">
      {/* Budget Document */}
      {budgetUrl && (<Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-blue-600"/>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">Budget Breakdown</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed cost breakdown for furniture, materials, and labor
              </p>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">What's included:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Itemized furniture costs with brands/models</li>
                  <li>• Material costs (paint, flooring, fixtures)</li>
                  <li>• Labor and installation charges</li>
                  <li>• Contingency buffer</li>
                  <li>• Grand total with applicable taxes</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openDocument(budgetUrl)}>
                  <ExternalLink className="h-4 w-4 mr-1"/>
                  View Document
                </Button>
                <Button size="sm" onClick={() => handleDownload(budgetUrl, 'budget-breakdown.pdf')}>
                  <Download className="h-4 w-4 mr-1"/>
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </Card>)}

      {budgetUrl && (shoppingUrl || vendorUrl) && <Separator />}

      {/* Shopping List */}
      {shoppingUrl && (<Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="h-6 w-6 text-green-600"/>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">Shopping List</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete list of items to purchase with specifications and links
              </p>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">What's included:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Product names, brands, and model numbers</li>
                  <li>• Dimensions and detailed specifications</li>
                  <li>• Color and finish options</li>
                  <li>• Purchase links (Amazon, IKEA, local stores)</li>
                  <li>• Quantity needed for each item</li>
                  <li>• Alternative options if primary unavailable</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openDocument(shoppingUrl)}>
                  <ExternalLink className="h-4 w-4 mr-1"/>
                  View List
                </Button>
                <Button size="sm" onClick={() => handleDownload(shoppingUrl, 'shopping-list.pdf')}>
                  <Download className="h-4 w-4 mr-1"/>
                  Download
                </Button>
              </div>
            </div>
          </div>
        </Card>)}

      {shoppingUrl && vendorUrl && <Separator />}

      {/* Vendor Contacts */}
      {vendorUrl && (<Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-purple-600"/>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">Vendor Contacts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Trusted professionals for executing your design
              </p>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">What's included:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Verified carpenters and contractors</li>
                  <li>• Painters and electricians</li>
                  <li>• Furniture suppliers and vendors</li>
                  <li>• Contact information and specialties</li>
                  <li>• Service areas and estimated rates</li>
                  <li>• Designer recommendations and notes</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openDocument(vendorUrl)}>
                  <ExternalLink className="h-4 w-4 mr-1"/>
                  View Contacts
                </Button>
                <Button size="sm" onClick={() => handleDownload(vendorUrl, 'vendor-contacts.pdf')}>
                  <Download className="h-4 w-4 mr-1"/>
                  Download
                </Button>
              </div>
            </div>
          </div>
        </Card>)}

      {/* Download All Button */}
      <Card className="p-6 bg-muted/30">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h4 className="font-semibold">Download All Files</h4>
            <p className="text-sm text-muted-foreground">
              Get all design files in one go
            </p>
          </div>
          <Button onClick={() => {
            if (budgetUrl)
                handleDownload(budgetUrl, 'budget.pdf');
            if (shoppingUrl)
                handleDownload(shoppingUrl, 'shopping-list.pdf');
            if (vendorUrl)
                handleDownload(vendorUrl, 'vendors.pdf');
        }}>
            <Download className="h-4 w-4 mr-2"/>
            Download All Documents
          </Button>
        </div>
      </Card>
    </div>);
}
