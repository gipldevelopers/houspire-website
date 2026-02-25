import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
export const LoadingButton = forwardRef(({ loading = false, loadingText = 'Loading...', children, disabled, ...props }, ref) => {
    return (<Button ref={ref} disabled={loading || disabled} {...props}>
        {loading ? (<>
            <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
            {loadingText}
          </>) : (children)}
      </Button>);
});
LoadingButton.displayName = 'LoadingButton';
