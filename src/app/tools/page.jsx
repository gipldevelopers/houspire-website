'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Calculator, 
  FileText, 
  Layers, 
  Clock, 
  Compass,
  Download
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';

const tools = [
  {
    id: 'select-package',
    title: 'Design Packages',
    description: 'Explore our design packages starting at ₹499',
    icon: Compass,
    href: '/select-package',
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

const downloads = [
  {
    id: 'planning-checklist',
    title: 'Planning Checklist',
    description: 'Room-by-room checklist to prep before meeting your designer',
    href: '/downloads/planning-checklist.txt',
  },
  {
    id: 'budget-template',
    title: 'Budget Template',
    description: 'Simple budget sheet to map costs and priorities',
    href: '/downloads/budget-template.txt',
  },
  {
    id: 'timeline-planner',
    title: 'Timeline Planner',
    description: 'Milestone tracker for your design and execution phases',
    href: '/downloads/timeline-planner.txt',
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
      
      <div className="min-h-screen pt-20 pb-8" style={{ backgroundColor: "var(--color-primary-1)" }}>
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
              style={{ color: "var(--color-primary-2)" }}
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
        <section className="py-6 md:py-12">
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
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-2xl ${tool.bgColor}`}>
                            <tool.icon className={`h-6 w-6 ${tool.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1" style={{ color: "var(--color-primary-2)" }}>
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

        {/* Download Section */}
        <section className="py-6 md:py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "var(--color-primary-2)" }}>
                    Downloads
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: "var(--color-primary-2)" }}>
                    Grab free planning resources
                  </h2>
                  <p className="text-muted-foreground mt-2 max-w-xl">
                    Quick templates to speed up your planning, budgeting, and project timeline.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {downloads.map((item) => (
                  <Card
                    key={item.id}
                    className="h-full hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10">
                          <Download className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg" style={{ color: "var(--color-primary-2)" }}>{item.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <a
                        href={item.href}
                        download
                        className="btn-secondary mt-6 w-fit"
                      >
                        Download
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
{/*  */}
        {/* CTA Section */}
        <section className="py-6 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--color-primary-2)" }}>
              Ready to start your project?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Use our planning tools to prepare, then connect with our designers for a professional consultation.
            </p>
            <Link 
              href="/select-package"
              className="btn-primary"
            >
              Choose Your Package
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
