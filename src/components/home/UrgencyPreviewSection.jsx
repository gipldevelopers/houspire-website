import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { urgencyStories } from '@/lib/urgency';

export function UrgencyPreviewSection() {
  const stories = urgencyStories.slice(0, 3);

  return (
    <section id="urgency" className="bg-white py-[56px] md:py-[72px]">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold tracking-[0.04em] uppercase text-[#6E6E73]">
              In a rush?
            </p>
            <h2 className="text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.025em] leading-[1.1] text-[#1D1D1F] mt-2">
              Urgent home decisions, solved fast.
            </h2>
            <p className="text-[17px] text-[#6E6E73] leading-[1.5] mt-3 max-w-[62ch]">
              Real stories from homeowners who needed clarity quickly â€” scope, budgets, and a plan you can execute.
            </p>
          </div>

          <Button asChild variant="outline" className="rounded-full h-11 px-6 w-fit">
            <Link href="/urgency">
              See all stories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stories.map((story) => (
            <Link
              key={story.slug}
              href={`/urgency/${story.slug}`}
              className="group rounded-2xl overflow-hidden border border-black/[0.08] bg-white hover:shadow-[0_18px_60px_rgba(0,0,0,0.10)] transition-shadow"
            >
              <div className="relative aspect-[16/10] bg-[#F5F5F7] overflow-hidden">
                <img
                  src={story.image || '/placeholder.svg'}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-white/90 text-[#1D1D1F] border border-black/10 backdrop-blur">
                    Urgency
                  </Badge>
                  <Badge variant="secondary" className="bg-black/70 text-white border-0 backdrop-blur">
                    <Clock className="h-3 w-3 mr-1" />
                    {story.delivery}
                  </Badge>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs text-[#6E6E73] mb-2">
                  {story.person.name} â€¢ {story.person.city} â€¢ {story.person.homeType}
                </p>
                <h3 className="text-lg font-semibold text-[#1D1D1F] leading-snug">
                  {story.title}
                </h3>
                <p className="text-[14px] text-[#6E6E73] leading-[1.55] mt-2">
                  {story.summary}
                </p>
                <div className="mt-4 text-[14px] font-medium text-[#E8662E] group-hover:underline">
                  Read the full story
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

