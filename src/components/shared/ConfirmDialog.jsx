import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info, CheckCircle, XCircle, Loader2 } from 'lucide-react';
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger', loading = false, }) {
    if (!isOpen)
        return null;
    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return <XCircle className="h-6 w-6 text-destructive"/>;
            case 'warning':
                return <AlertTriangle className="h-6 w-6 text-yellow-600"/>;
            case 'success':
                return <CheckCircle className="h-6 w-6 text-green-600"/>;
            default:
                return <Info className="h-6 w-6 text-blue-600"/>;
        }
    };
    const getIconBg = () => {
        switch (variant) {
            case 'danger':
                return 'bg-destructive/10';
            case 'warning':
                return 'bg-yellow-100 dark:bg-yellow-900/30';
            case 'success':
                return 'bg-green-100 dark:bg-green-900/30';
            default:
                return 'bg-blue-100 dark:bg-blue-900/30';
        }
    };
    const getConfirmButtonVariant = () => {
        return variant === 'danger' ? 'destructive' : 'default';
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className={`w-12 h-12 rounded-full ${getIconBg()} flex items-center justify-center mx-auto mb-4`}>
            {getIcon()}
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">{description}</p>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
              {cancelText}
            </Button>
            <Button variant={getConfirmButtonVariant()} className="flex-1" onClick={onConfirm} disabled={loading}>
              {loading ? (<>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                  Processing...
                </>) : (confirmText)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>);
}
