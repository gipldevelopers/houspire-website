'use client';

import { motion } from 'framer-motion';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { useRouter } from 'next/navigation';

const ease = [0.25, 0.46, 0.45, 0.94];

const cards = [
  {
    title: '4K Room Designs',
    subtitle: 'Your rooms. Your style. Photorealistic.',
    image: '/styles/japanese-zen/portfolio-4-dining-room.png',
    dark: false,
    scrollTo: 'transformation',
  },
  {
    title: 'Budget Breakdown',
    subtitle: 'Good. Better. Best. Every item itemized.',
    image: '/styles/japanese-zen/portfolio-5-bathroom.png',
    dark: false,
    scrollTo: 'budget-estimator',
  },
  {
    title: 'Shopping Lists',
    subtitle: 'Direct purchase links for every piece.',
    image: '/styles/traditional-indian/portfolio-7-kids-bedroom.png',
    dark: true,
    scrollTo: 'pricing',
  },
  {
    title: 'Verified Contractors',
    subtitle: 'Trusted local professionals in your city.',
    image: '/styles/japanese-zen/portfolio-6-home-office.png',
    dark: false,
    scrollTo: 'pricing',
  },
];

export function DarkFeaturesSection() {
  const router = useRouter();

  const handleCardRedirect = (card) => {
    const params = new URLSearchParams({
      source: 'home-feature-card',
      featureTitle: card.title,
      featureSubtitle: card.subtitle,
      autostart: 'true',
    });
    router.push(`/style-quiz?${params.toString()}`);
  };

  return (
    <section id="features" className="bg-[#F5F5F7] py-[40px] md:py-[60px]">
      <div className="mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-6"
        >
          <p className="text-sm font-semibold tracking-[0.04em] uppercase text-[#6E6E73] mb-3">What you get</p>
          <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-[-0.025em] leading-[1.07] text-[#1D1D1F]">
            <TextGenerateEffect words="Everything you need." />
          </h2>
          <p className="text-[21px] text-[#6E6E73] leading-[1.38] mt-2">Nothing you don't.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: i * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              onClick={() => handleCardRedirect(card)}
              className={`rounded-2xl overflow-hidden flex flex-col ${
                card.dark ? 'bg-black' : 'bg-white'
              } cursor-pointer`}
            >
              <div className="px-6 pt-7 pb-3 text-center">
                <h3 className={`text-2xl font-bold tracking-[-0.02em] ${card.dark ? 'text-white' : 'text-[#1D1D1F]'}`}>
                  {card.title}
                </h3>
                <p className={`text-[15px] mt-2 ${card.dark ? 'text-white/70' : 'text-[#6E6E73]'}`}>
                  {card.subtitle}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardRedirect(card);
                  }}
                  className={`mt-3 text-[15px] font-medium ${card.dark ? 'text-white hover:underline' : 'text-[#E8662E] hover:underline'}`}
                >
                  Get started
                </button>
              </div>
              <div className="overflow-hidden" style={{ height: '240px' }}>
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

