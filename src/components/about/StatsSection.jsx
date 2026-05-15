'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';

const problems = [
  {
    number: '01',
    title: 'Quotes that keep changing',
    points: [
      "You approve one number to get started.",
      "Then new costs, upgrades, and “unexpected” expenses slowly start appearing once work begins.",
    ], 
  },
  {
    number: '02',
    title: "You’re forced to trust blindly",
    description: "Most homeowners don’t really know:",
    points: [
      "if materials are overpriced",
      "if the budget is realistic",
      "or whether they’re being pushed toward choices that benefit someone else",
    ],
    afterText: "So you’re left depending entirely on the designer or vendor to guide every major decision",
  },
  {
    number: '03',
    title: 'Decisions made without clarity',
    points: [
      "You’re expected to finalise colours, layouts, finishes, and materials before you’ve actually seen your home come together realistically.",
      "You spend lakhs based on imagination.",
    ],
  },
  {
    number: '04',
    title: 'Everyone imagines the home differently',
    points: [
      "One person wants modern.",
      "Another wants warmth.",
      "Someone else is worried about budget.",
    ],
    afterText:"Without a clear visual plan, small disagreements quickly become stressful and emotional.",
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
              <div className="text-sm text-muted-foreground leading-relaxed">
                <p>{item.description}</p>
                {item.points && (
                  <ul className="mt-2 space-y-1 list-disc list-outside ml-4">
                    {item.points.map((point, pIdx) => (
                      <li key={pIdx}>{point}</li>
                    ))}
                  </ul>
                )}
                {item.afterText && (
                  <p className="mt-2">{item.afterText}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
