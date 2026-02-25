import { useState, useEffect } from 'react';
import { Users, Award, Briefcase, Star } from 'lucide-react';
import { getSiteStats } from '@/lib/social-proof-service';
import { motion } from 'framer-motion';
export function LiveStatsCounter() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadStats();
    }, []);
    async function loadStats() {
        setLoading(true);
        const data = await getSiteStats();
        setStats(data);
        setLoading(false);
    }
    if (loading || !stats) {
        return null;
    }
    const statItems = [
        {
            icon: Users,
            value: stats.total_customers,
            label: 'Happy Customers',
            suffix: '+'
        },
        {
            icon: Award,
            value: stats.total_designs_delivered,
            label: 'Designs Delivered',
            suffix: '+'
        },
        {
            icon: Briefcase,
            value: stats.active_projects,
            label: 'Active Projects',
            suffix: ''
        },
        {
            icon: Star,
            value: stats.average_rating,
            label: 'Average Rating',
            suffix: '',
            subtext: `from ${stats.total_reviews} reviews`
        }
    ];
    return (<section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Trusted by Thousands
          </h2>
          <p className="text-muted-foreground">
            Join our growing community of happy customers
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Icon className="h-6 w-6 text-primary"/>
                </div>
                <motion.p className="text-3xl md:text-4xl font-bold text-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 + 0.2 }}>
                  {typeof item.value === 'number' && item.value % 1 === 0
                    ? item.value.toLocaleString()
                    : item.value}
                  {item.suffix}
                </motion.p>
                <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
                {item.subtext && (<p className="text-xs text-muted-foreground">{item.subtext}</p>)}
              </motion.div>);
        })}
        </div>
      </div>
    </section>);
}
