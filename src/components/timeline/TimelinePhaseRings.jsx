import { motion } from 'framer-motion';
import { Palette, ShoppingCart, Hammer, Sparkles } from 'lucide-react';
const phaseConfig = [
    { icon: Palette, color: 'text-blue-500', strokeColor: 'stroke-blue-500', bgColor: 'bg-blue-500' },
    { icon: ShoppingCart, color: 'text-amber-500', strokeColor: 'stroke-amber-500', bgColor: 'bg-amber-500' },
    { icon: Hammer, color: 'text-emerald-500', strokeColor: 'stroke-emerald-500', bgColor: 'bg-emerald-500' },
    { icon: Sparkles, color: 'text-purple-500', strokeColor: 'stroke-purple-500', bgColor: 'bg-purple-500' },
];
export function TimelinePhaseRings({ phases, totalWeeks }) {
    return (<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {phases.map((phase, idx) => {
            const config = phaseConfig[idx % phaseConfig.length];
            const Icon = config.icon;
            const percentage = (phase.weeks / totalWeeks) * 100;
            const circumference = 2 * Math.PI * 40; // radius = 40
            const strokeDashoffset = circumference - (percentage / 100) * circumference;
            return (<motion.div key={phase.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="flex flex-col items-center text-center">
            {/* Ring */}
            <div className="relative w-24 h-24 md:w-28 md:h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted"/>
                {/* Progress circle */}
                <motion.circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" strokeLinecap="round" className={config.strokeColor} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1, delay: idx * 0.15, ease: 'easeOut' }} style={{
                    strokeDasharray: circumference,
                }}/>
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Icon className={`h-5 w-5 md:h-6 md:w-6 ${config.color} mb-1`}/>
                <span className="text-lg md:text-xl font-bold">{Math.round(percentage)}%</span>
              </div>
            </div>

            {/* Label */}
            <div className="mt-3 space-y-1">
              <p className="text-sm font-medium leading-tight">{phase.name}</p>
              <p className="text-xs text-muted-foreground">
                {phase.weeks} week{phase.weeks !== 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>);
        })}
    </div>);
}
