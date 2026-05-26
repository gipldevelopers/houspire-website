import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUrgencyStory, urgencyStories } from '@/lib/urgency';

export default async function UrgencyDetailPage({ params }) {
  const { slug } = await params;
  const story = getUrgencyStory(slug);

  if (!story) notFound();

  const otherStories = urgencyStories.filter((s) => s.slug !== story.slug).slice(0, 3);

  return (
    <>
      <SEOHead
        title={story.title}
        description={story.summary}
        url={`https://houspire.ai/urgency/${story.slug}`}
        keywords={['urgent renovation', 'interior design plan', 'budget breakdown', 'shopping list', 'verified contractors']}
      />

      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-10">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/urgency">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Urgency
            </Link>
          </Button>

          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="rounded-3xl overflow-hidden border bg-card">
                <div className="relative aspect-[16/10] bg-muted">
                  <img
                    src={story.image || '/placeholder.svg'}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                    <Badge>Urgency</Badge>
                    <Badge variant="secondary">{story.delivery}</Badge>
                    <Badge variant="outline">{story.person.city}</Badge>
                  </div>
                </div>
                <div className="p-7">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    {story.title}
                  </h1>
                  <p className="text-muted-foreground text-lg mt-3 leading-relaxed">
                    {story.summary}
                  </p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border bg-muted/30 p-5">
                      <p className="text-sm font-semibold text-foreground mb-2">Homeowner</p>
                      <p className="text-sm text-muted-foreground">
                        {story.person.name} â€¢ {story.person.homeType}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {story.person.city} â€¢ {story.person.room}
                      </p>
                    </div>
                    <div className="rounded-2xl border bg-muted/30 p-5">
                      <p className="text-sm font-semibold text-foreground mb-2">Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        A ready-to-execute plan in <span className="font-semibold text-foreground">{story.delivery}</span>.
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Renders, budget, shopping, and next steps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border bg-card p-6">
                <h2 className="text-xl font-bold text-foreground">What went wrong</h2>
                <ul className="mt-4 space-y-3">
                  {story.problem.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-0.5 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border bg-card p-6">
                <h2 className="text-xl font-bold text-foreground">What we delivered</h2>
                <ul className="mt-4 space-y-3">
                  {story.whatWeDid.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-0.5 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border bg-card p-6">
                <h2 className="text-xl font-bold text-foreground">Outcome</h2>
                <ul className="mt-4 space-y-3">
                  {story.results.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-0.5 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border bg-muted/30 p-6">
                <h3 className="text-lg font-bold text-foreground">Want the same clarity?</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Get photorealistic designs, an itemized budget, and shopping links â€” delivered fast.
                </p>
                <div className="mt-4">
                  <Button asChild size="lg" className="w-full">
                    <Link href="/select-package">
                      Start now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {otherStories.length > 0 && (
            <div className="mt-14">
              <h2 className="text-2xl font-bold text-foreground">More urgency stories</h2>
              <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherStories.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/urgency/${s.slug}`}
                    className="group rounded-2xl overflow-hidden border bg-card hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                      <img
                        src={s.image || '/placeholder.svg'}
                        alt={s.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">{s.person.city}</Badge>
                        <Badge variant="outline">{s.delivery}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground leading-snug">
                        {s.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                        {s.summary}
                      </p>
                      <div className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                        Read story <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

