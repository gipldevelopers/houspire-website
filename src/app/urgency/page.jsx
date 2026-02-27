import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { urgencyStories } from '@/lib/urgency';

export default function UrgencyPage() {
  return (
    <>
      <SEOHead
        title="Urgency Stories"
        description="Real urgent scenarios from homeowners â€” and how Houspire helped them get clarity (scope, budgets, shopping) in 72 hours."
        url="https://houspire.ai/urgency"
        keywords={['urgent interior design', 'renovation help', 'budget breakdown', 'contractor shortlist', 'move-in checklist']}
      />

      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-3xl">
            <Badge className="mb-4">Urgency</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              When you need answers fast.
            </h1>
            <p className="text-muted-foreground text-lg mt-4 leading-relaxed">
              These are real situations where homeowners were stuck â€” and got a clear plan they could execute quickly.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link href="/select-package">Get your plan</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {urgencyStories.map((story) => (
              <Link
                key={story.slug}
                href={`/urgency/${story.slug}`}
                className="group rounded-2xl overflow-hidden border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                  <img
                    src={story.image || '/placeholder.svg'}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{story.person.city}</Badge>
                    <Badge variant="outline">{story.delivery}</Badge>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground leading-snug">
                    {story.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    {story.summary}
                  </p>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                    Read story <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

