import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
export function MaterialComparisonChart({ tiers, categoryName }) {
    const maintenanceToNumber = (maintenance) => {
        switch (maintenance) {
            case 'Low': return 5;
            case 'Medium': return 3;
            case 'High': return 1;
            default: return 3;
        }
    };
    const chartData = [
        { attribute: 'Durability', budget: tiers[0]?.durability || 0, standard: tiers[1]?.durability || 0, premium: tiers[2]?.durability || 0 },
        { attribute: 'Aesthetics', budget: tiers[0]?.aesthetics || 0, standard: tiers[1]?.aesthetics || 0, premium: tiers[2]?.aesthetics || 0 },
        { attribute: 'Easy Care', budget: maintenanceToNumber(tiers[0]?.maintenance || 'Medium'), standard: maintenanceToNumber(tiers[1]?.maintenance || 'Medium'), premium: maintenanceToNumber(tiers[2]?.maintenance || 'Medium') },
        { attribute: 'Value', budget: 5, standard: 4, premium: 3 },
        { attribute: 'Lifespan', budget: 2, standard: 4, premium: 5 },
    ];
    return (<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-xl p-4 md:p-6 border">
      <h3 className="text-lg font-semibold mb-4 text-center">{categoryName} Comparison</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid strokeDasharray="3 3"/>
            <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 12 }}/>
            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }}/>
            <Radar name="Budget" dataKey="budget" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.2}/>
            <Radar name="Standard" dataKey="standard" stroke="hsl(142, 76%, 36%)" fill="hsl(142, 76%, 36%)" fillOpacity={0.2}/>
            <Radar name="Premium" dataKey="premium" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.2}/>
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>);
}
