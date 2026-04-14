import Link from 'next/link';
import { ArrowRight, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { urgencyStories } from '@/lib/urgency';

export function UrgencyPreviewSection() {
  const stories = urgencyStories.slice(0, 3);

  return (
    <section id="urgency" className="bg-background py-6 md:py-10">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
                Fixed in 72 hours
              </span>
            </div>
            <h2 className="text-[clamp(24px,3.5vw,36px)] font-black tracking-[-0.03em] leading-[1.1] text-[#1D1D1F]">
              Real stories from homeowners
            </h2>
            <p className="text-base text-[#6E6E73] font-medium leading-[1.5] mt-2 max-w-[55ch]">
              From contractor ghosts to budget nightmares, we provide clarity without the stress.
            </p>
          </div>

          <Button asChild variant="ghost" className="rounded-full h-10 px-5 w-fit text-primary font-bold hover:bg-primary/5 group">
            <Link href="/urgency">
              See all stories
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stories.map((story) => (
            <Link
              key={story.slug}
              href={`/urgency/${story.slug}`}
              className="group flex flex-col rounded-[1.5rem] overflow-hidden border border-black/[0.05] bg-white hover:shadow-[0_24px_48px_rgba(0,0,0,0.08)] transition-all duration-500"
            >
              <div className="relative aspect-[16/9] bg-muted overflow-hidden">
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

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-1 w-1 rounded-full bg-orange-500" />
                  <p className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-widest">
                    {story.person.name} • {story.person.city}
                  </p>
                </div>
                
                <h3 className="text-lg font-bold text-[#1D1D1F] leading-[1.2] tracking-tight group-hover:text-primary transition-colors">
                  {story.title}
                </h3>
                
                <p className="text-[14px] text-[#6E6E73] leading-[1.5] mt-2 flex-1 font-medium line-clamp-2">
                  {story.summary}
                </p>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-black text-primary uppercase tracking-[0.1em] border-b border-primary/20 group-hover:border-primary transition-all">
                    {story.cta_text}
                  </span>
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <ArrowRight className="h-4 w-4" />
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
