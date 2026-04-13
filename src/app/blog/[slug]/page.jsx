import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogBySlug, getRelatedPosts } from "../blogData";

export const generateStaticParams = () =>
  blogPosts.map((post) => ({ slug: post.slug }));

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, 3);

  return (
    <div className="relative pt-28 pb-20 bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_transparent_55%)]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-semibold text-foreground hover:text-primary transition-apple-fast"
        >
          <span className="mr-2 inline-block h-px w-6 bg-foreground/60" />
          Back to journal
        </Link>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="font-semibold text-primary">{post.category}</span>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="mt-3 text-3xl md:text-5xl font-semibold text-foreground leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-5xl">
            {post.summary}
          </p>
          <div className="mt-4 text-xs text-muted-foreground">
            Written by {post.author}
          </div>
        </div>
      </div>

      <div className="relative mt-10 max-w-6xl mx-auto px-6">
        <div className="relative h-[260px] md:h-[420px] w-full overflow-hidden rounded-3xl border border-border/60 shadow-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 mt-12">
        <p className="text-lg text-foreground leading-relaxed">{post.intro}</p>

        <div className="mt-10 space-y-8">
          {post.sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                {section.title}
              </h2>
              <div className="mt-3 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                {section.paragraphs.map((text, index) => (
                  <p key={`${section.title}-${index}`}>{text}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-foreground">Key takeaways</p>
          <div className="mt-4 grid gap-3">
            {post.takeaways.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-slate-50 px-4 py-3 text-sm text-muted-foreground"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 mt-14">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Project gallery
          </h2>
          <span className="text-xs text-muted-foreground">
            {post.gallery.length} images
          </span>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {post.gallery.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative h-56 md:h-64 w-full overflow-hidden rounded-2xl border border-border/60 shadow-sm"
            >
              <Image
                src={image}
                alt={`${post.title} gallery ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 mt-16">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          More from the journal
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="group rounded-2xl border border-border/60 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-apple"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">{item.category}</span>
                  <span>{item.readTime}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
