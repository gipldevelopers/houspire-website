import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Download, Star, PartyPopper, Gift, HeadphonesIcon, } from 'lucide-react';
export default function CompletionConfirmation({ orderNumber, packageName, completedAt, onDownloadAll, onLeaveReview, onContactSupport, onGetReferral }) {
    return (<div className="space-y-6">
      {/* Success Header */}
      <Card className="p-8 text-center border-2 border-green-200 bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 dark:to-background">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600"/>
            </div>
            <PartyPopper className="absolute -top-2 -right-2 h-8 w-8 text-amber-500"/>
          </div>
        </div>

        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          🎉 Project Complete!
        </h1>

        <p className="text-muted-foreground text-lg mb-4">
          Congratulations! Your interior design project is now complete.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary" className="text-base px-3 py-1">
            {orderNumber}
          </Badge>
          <span className="text-muted-foreground">•</span>
          <Badge variant="outline" className="text-base px-3 py-1">
            {packageName}
          </Badge>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            Completed {new Date(completedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })}
          </span>
        </div>
      </Card>

      {/* What's Included */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">📦 Your Complete Design Package</h2>

        <p className="text-muted-foreground mb-6">
          All your design files are ready for download. You now have everything needed to bring your vision to life!
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
              ✨ What You Received:
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 4K Design Renders (all rooms)</li>
              <li>• Itemized Budget Breakdown</li>
              <li>• Complete Shopping List</li>
              <li>• Verified Vendor Contacts</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
              🚀 Next Steps:
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Download all files for reference</li>
              <li>• Start purchasing items</li>
              <li>• Contact vendors for execution</li>
              <li>• Share your feedback with us</li>
            </ul>
          </div>
        </div>

        <Button onClick={onDownloadAll} size="lg" className="w-full md:w-auto">
          <Download className="h-5 w-5 mr-2"/>
          Download All Design Files
        </Button>
      </Card>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Leave Review */}
        <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group" onClick={onLeaveReview}>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Star className="h-6 w-6 text-amber-600"/>
            </div>
            <h3 className="font-semibold mb-1">Leave a Review</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Share your experience and help others discover Houspire
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Write Review →
            </Button>
          </div>
        </Card>

        {/* Referral */}
        <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group" onClick={onGetReferral}>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Gift className="h-6 w-6 text-purple-600"/>
            </div>
            <h3 className="font-semibold mb-1">Refer & Earn</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get ₹500 credit when friends use your referral link
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Get Referral Link →
            </Button>
          </div>
        </Card>

        {/* Support */}
        <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group" onClick={onContactSupport}>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <HeadphonesIcon className="h-6 w-6 text-blue-600"/>
            </div>
            <h3 className="font-semibold mb-1">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Have questions about execution? We're here to help
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Contact Support →
            </Button>
          </div>
        </Card>
      </div>

      {/* Pro Tips */}
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <AlertDescription>
          <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">
            💡 Pro Tips for Execution:
          </h4>
          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
            <li>• Start with vendors who have long lead times (custom furniture, etc.)</li>
            <li>• Keep design renders handy while shopping to match colors/styles</li>
            <li>• Don't hesitate to reach out if you need clarification on anything</li>
            <li>• Share photos of your completed space - we'd love to see it!</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>);
}
