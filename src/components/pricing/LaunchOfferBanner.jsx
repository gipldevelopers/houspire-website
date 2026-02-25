import { Zap } from 'lucide-react';
import Countdown from 'react-countdown';
import { motion } from 'framer-motion';
export function LaunchOfferBanner() {
    // Set launch offer end date (7 days from now for demo)
    const launchEndDate = new Date();
    launchEndDate.setDate(launchEndDate.getDate() + 7);
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span className="text-secondary-foreground">Offer Ended</span>;
        }
        else {
            return (<span className="font-mono text-lg font-bold text-secondary-foreground">
          {days}d {hours}h {minutes}m {seconds}s
        </span>);
        }
    };
    return (<div className="bg-gradient-to-r from-secondary via-secondary to-secondary/90 py-3">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 text-secondary-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 animate-pulse"/>
            <span className="font-semibold">
              🚀 LAUNCH OFFER: Limited to First 1,000 Customers
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-secondary-foreground/80">Ends in:</span>
            <Countdown date={launchEndDate} renderer={renderer}/>
          </div>

          <div className="text-sm bg-background/20 px-3 py-1 rounded-full">
            347 / 1,000 spots claimed
          </div>
        </motion.div>
      </div>
    </div>);
}
