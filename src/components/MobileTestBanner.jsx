import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDeviceType, isIOS, isAndroid, isTouchDevice } from '@/lib/deviceDetect';
import { X, Smartphone } from 'lucide-react';
/**
 * Development-only banner showing device info
 * Automatically hidden in production
 */
export function MobileTestBanner() {
    const [visible, setVisible] = useState(true);
    const [deviceInfo, setDeviceInfo] = useState({
        type: 'desktop',
        width: 0,
        height: 0,
        os: 'unknown',
        touch: false,
    });
    useEffect(() => {
        const updateDeviceInfo = () => {
            setDeviceInfo({
                type: getDeviceType(),
                width: window.innerWidth,
                height: window.innerHeight,
                os: isIOS() ? 'iOS' : isAndroid() ? 'Android' : 'Other',
                touch: isTouchDevice(),
            });
        };
        updateDeviceInfo();
        window.addEventListener('resize', updateDeviceInfo);
        return () => window.removeEventListener('resize', updateDeviceInfo);
    }, []);
    // Only show in development
    if (process.env.NODE_ENV === 'production' || !visible)
        return null;
    return (<div className="fixed bottom-4 left-4 z-[9999] bg-foreground text-background rounded-lg p-3 shadow-xl text-xs max-w-xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Smartphone className="h-3.5 w-3.5"/>
          <Badge variant="secondary" className="bg-accent text-accent-foreground text-[10px]">
            Dev Mode
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setVisible(false)} className="h-5 w-5 text-background/70 hover:text-background hover:bg-transparent p-0">
          <X className="h-3.5 w-3.5"/>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-background/80">
        <div className="flex justify-between">
          <span>Device:</span>
          <span className="font-medium text-background">{deviceInfo.type}</span>
        </div>
        <div className="flex justify-between">
          <span>Screen:</span>
          <span className="font-medium text-background">{deviceInfo.width}×{deviceInfo.height}</span>
        </div>
        <div className="flex justify-between">
          <span>OS:</span>
          <span className="font-medium text-background">{deviceInfo.os}</span>
        </div>
        <div className="flex justify-between">
          <span>Touch:</span>
          <span className="font-medium text-background">{deviceInfo.touch ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </div>);
}
