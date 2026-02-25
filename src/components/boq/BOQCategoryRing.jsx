import { motion } from 'framer-motion';
export function BOQCategoryRing({ percentage, color, size = 80, strokeWidth = 8, label, amount, }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (<div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="absolute inset-0" width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth}/>
        </svg>
        
        {/* Progress circle */}
        <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
          <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 0.8, ease: 'easeOut' }}/>
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold">{Math.round(percentage)}%</span>
        </div>
      </div>
      
      {label && (<span className="text-xs text-muted-foreground text-center max-w-[80px] truncate">
          {label}
        </span>)}
      {amount && (<span className="text-xs font-medium">{amount}</span>)}
    </div>);
}
export function BOQCostBar({ categories, total }) {
    return (<div className="space-y-3">
      <div className="flex h-4 rounded-full overflow-hidden bg-muted">
        {categories.map((cat, i) => {
            const width = (cat.amount / total) * 100;
            return (<motion.div key={cat.name} initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 0.5, delay: i * 0.1 }} className="h-full first:rounded-l-full last:rounded-r-full" style={{ backgroundColor: cat.color }} title={`${cat.name}: ${Math.round(width)}%`}/>);
        })}
      </div>
      
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (<div key={cat.name} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}/>
            <span className="text-muted-foreground">{cat.name}</span>
          </div>))}
      </div>
    </div>);
}
