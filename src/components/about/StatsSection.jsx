'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';

const problems = [
  {
    number: '01',
    title: 'Quotes that change',
    description:
      "You're shown one number to get you hooked. Another appears after you've signed.",
  },
  {
    number: '02',
    title: "Costs you can't explain",
    description:
      "Hidden margins buried in vendor rates you never asked about — and were never told.",
  },
  {
    number: '03',
    title: 'Decisions made blind',
    description:
      "You're asked to finalise colours, layouts, and materials before you've ever seen what they'll look like.",
  },
  {
    number: '04',
    title: 'Family fights, confusion',
    description:
      "Half the family wants one thing, the other half another — and nobody has a visual to align around.",
  },
];

export function StatsSection() {
  return (
    <section className="py-20 md:py-28 bg-[#FDFBF7]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground tracking-tight mb-4">
            The problem we're solving
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            We broke every unwritten rule of the interior design industry — and replaced it with one flat price, one honest plan, and complete clarity.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, idx) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-white border border-border/60 rounded-2xl p-7 hover:shadow-md hover:border-[#EC7446]/30 transition-all duration-300"
            >
              <span className="block text-5xl font-bold text-[#EC7446]/20 mb-4 leading-none select-none">
                {item.number}
              </span>
              <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
