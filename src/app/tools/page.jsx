'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Calculator, 
  FileText, 
  Layers, 
  Clock, 
  Compass
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';

const tools = [
  {
    id: 'planning-journey',
    title: 'Planning Journey',
    description: 'Guided step-by-step flow to plan your dream space',
    icon: Compass,
    href: '/style-quiz',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    id: 'cost-calculator',
    title: 'Cost Calculator',
    description: 'Estimate your budget based on room size and style',
    icon: Calculator,
    href: '/budget-calculator',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  {
    id: 'boq-viewer',
    title: 'BOQ Viewer',
    description: 'View sample bill of quantities breakdown',
    icon: FileText,
    href: '/boq-viewer',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  {
    id: 'material-guide',
    title: 'Material Guide',
    description: 'Compare material tiers and quality options',
    icon: Layers,
    href: '/material-guide',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  {
    id: 'timeline-estimator',
    title: 'Timeline Estimator',
    description: 'Estimate your project duration',
    icon: Clock,
    href: '/timeline-estimator',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function Tools() {
  return (
    <>
      <SEOHead 
        title="Planning Tools | Houspire"
        description="Free interior design tools to help you plan your dream space. Budget calculator, BOQ viewer, material guide, and timeline estimator."
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Planning Tools
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Everything you need to plan your interior design project
            </motion.p>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {tools.map((tool) => (
                <motion.div key={tool.id} variants={itemVariants}>
                  <Link href={tool.href}>
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 hover:border-primary/30">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-2xl ${tool.bgColor}`}>
                            <tool.icon className={`h-6 w-6 ${tool.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold text-lg mb-1 ${tool.id === 'planning-journey' ? 'text-primary' : ''}`}>
                              {tool.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to start your project?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Use our planning tools to prepare, then connect with our designers for a professional consultation.
            </p>
            <Link 
              href="/style-quiz"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium transition-all hover:bg-primary/90 hover:scale-105"
            >
              Take the Style Quiz
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
