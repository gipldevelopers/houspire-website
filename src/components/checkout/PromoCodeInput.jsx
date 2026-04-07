import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { appDataClient } from '@/lib/static-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tag, X, CheckCircle, Percent } from 'lucide-react';
export function PromoCodeInput({ amount, onApply, onRemove, appliedCode, }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [code, setCode] = useState('');
    const [validating, setValidating] = useState(false);
    const handleApply = async () => {
        if (!code.trim()) {
            toast({
                title: 'Please enter a promo code',
                variant: 'destructive',
            });
            return;
        }
        if (!user) {
            toast({
                title: 'Please sign in to use promo codes',
                variant: 'destructive',
            });
            return;
        }
        setValidating(true);
        try {
            const { data, error } = await appDataClient.rpc('validate_promo_code', {
                p_code: code.toUpperCase(),
                p_user_id: user.id,
                p_amount: amount,
            });
            if (error)
                throw error;
            const result = data?.[0];
            if (!result || !result.valid) {
                toast({
                    title: 'Invalid promo code',
                    description: result?.message || 'Code could not be validated',
                    variant: 'destructive',
                });
                return;
            }
            onApply({
                coupon_id: result.coupon_id,
                code: code.toUpperCase(),
                discount_type: result.discount_type,
                discount_value: Number(result.discount_value),
                discount_amount: Number(result.discount_amount),
                final_amount: Number(result.final_amount),
            });
            toast({
                title: 'Promo code applied! 🎉',
                description: `You saved ₹${Number(result.discount_amount).toFixed(0)}`,
            });
            setCode('');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to apply promo code',
                description: errorMessage,
                variant: 'destructive',
            });
        }
        finally {
            setValidating(false);
        }
    };
    const handleRemove = () => {
        onRemove();
        toast({
            title: 'Promo code removed',
        });
    };
    if (appliedCode) {
        return (<div className="border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400"/>
            </div>
            <div>
              <p className="font-medium text-green-700 dark:text-green-300">
                Promo Code Applied: {appliedCode.code}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {appliedCode.discount_type === 'percentage' ? (<>
                    <Percent className="h-3 w-3 inline mr-1"/>
                    {appliedCode.discount_value}% off
                  </>) : (<>₹{appliedCode.discount_value} off</>)}
                {' • '}
                You save ₹{appliedCode.discount_amount.toFixed(0)}
              </p>
            </div>
          </div>
          <Button onClick={handleRemove} variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100">
            <X className="h-4 w-4"/>
          </Button>
        </div>
      </div>);
    }
    return (<div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} onKeyDown={(e) => {
            if (e.key === 'Enter')
                handleApply();
        }} placeholder="Enter promo code" className="pl-10 h-12"/>
        </div>
        <Button onClick={handleApply} disabled={validating || !code.trim()} variant="outline" className="h-12 px-6">
          {validating ? (<>
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"/>
              Applying...
            </>) : ('Apply')}
        </Button>
      </div>
    </div>);
}

