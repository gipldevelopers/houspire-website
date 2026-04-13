import Link from 'next/link';
import { ArrowRight, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { urgencyStories } from '@/lib/urgency';

export function UrgencyPreviewSection() {
  const stories = urgencyStories.slice(0, 3);

  return (
    <section id="urgency" className="bg-[#f8fafc] py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-500">
                Fixed in 72 hours
              </span>
            </div>
            <h2 className="text-[clamp(32px,5vw,52px)] font-black tracking-[-0.03em] leading-[1.05] text-[#1D1D1F]">
              Real stories from homeowners
            </h2>
            <p className="text-lg text-[#6E6E73] font-medium leading-[1.5] mt-4 max-w-[55ch]">
              From contractor ghosts to budget nightmares, we provide the clarity you need to finish your home without the stress.
            </p>
          </div>

          <Button asChild variant="ghost" className="rounded-full h-12 px-6 w-fit text-primary font-bold hover:bg-primary/5 group">
            <Link href="/urgency">
              See all stories
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stories.map((story) => (
            <Link
              key={story.slug}
              href={`/urgency/${story.slug}`}
              className="group flex flex-col rounded-[2rem] overflow-hidden border border-black/[0.05] bg-white hover:shadow-[0_24px_48px_rgba(0,0,0,0.08)] transition-all duration-500"
            >
              <div className="relative aspect-[16/11] bg-[#F5F5F7] overflow-hidden">
                <img
                  src={story.image || '/placeholder.svg'}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Floating Tags */}
                <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 pointer-events-none">
                  <div className="inline-flex items-center w-fit bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                    Problem: {story.problem_tag}
                  </div>
                  <div className="inline-flex items-center w-fit bg-white/95 backdrop-blur text-green-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg border border-green-100">
                    <CheckCircle2 className="h-3 w-3 mr-1.5" />
                    Solved in 72 hours
                  </div>
                </div>
              </div>

              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-1 w-1 rounded-full bg-orange-500" />
                  <p className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest">
                    {story.person.name} • {story.person.city}
                  </p>
                </div>
                
                <h3 className="text-xl font-bold text-[#1D1D1F] leading-[1.2] tracking-tight group-hover:text-primary transition-colors">
                  {story.title}
                </h3>
                
                <p className="text-[15px] text-[#6E6E73] leading-[1.6] mt-3 flex-1 font-medium">
                  {story.summary}
                </p>
                
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm font-black text-primary uppercase tracking-[0.1em] border-b-2 border-primary/20 group-hover:border-primary transition-all">
                    {story.cta_text}
                  </span>
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
