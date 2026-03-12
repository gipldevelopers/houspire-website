"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { blogPosts } from "./blogData";

const buildCategoryStats = (posts) =>
  posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = useMemo(() => buildCategoryStats(blogPosts), []);
  const categoryList = useMemo(
    () => ["All", ...Object.keys(categories)],
    [categories]
  );

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return blogPosts;
    return blogPosts.filter((post) => post.category === activeCategory);
  }, [activeCategory]);

  const [featured, ...rest] = filteredPosts;
  const isFiltered = activeCategory !== "All";

  return (
    <div className="relative bg-[#f4f2ef] overflow-hidden">
      <section className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[28px] border border-black/5 bg-white shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] overflow-hidden">
            <div className="relative h-[320px] md:h-[440px]">
              <Image
                src={featured?.coverImage || "/images/living-room.png"}
                alt={featured?.title || "Houspire Journal"}
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.3em] font-semibold bg-white/80 text-foreground">
                  Featured
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] font-semibold bg-black/35 text-white">
                  {featured?.category || "Design"}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-2xl md:text-4xl font-semibold text-white max-w-2xl">
                  {featured?.title || "Houspire Journal"}
                </h1>
                <p className="mt-3 text-sm md:text-base text-white/80 max-w-2xl">
                  {featured?.summary ||
                    "Curated edits, renovation playbooks, and finish guides from the Houspire."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/70">
                  <span>{featured?.date || "March 2026"}</span>
                  <span>{featured?.readTime || "6 min read"}</span>
                  <span>Houspire</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-black/5 bg-white/90">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                    Blog
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Design notes, renovation playbooks, and curated interiors.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search articles..."
                      className="h-10 w-56 rounded-full border border-border/60 bg-[#f7f5f2] px-4 text-sm text-foreground placeholder:text-muted-foreground focus-ring"
                    />
                  </div>
                  <div className="rounded-full border border-border/60 bg-white px-3 py-2 text-xs font-semibold text-foreground">
                    Sort: Newest
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            {categoryList.map((label) => {
              const count =
                label === "All" ? blogPosts.length : categories[label] || 0;
              const isActive = label === activeCategory;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveCategory(label)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-apple-fast ${
                    isActive
                      ? "bg-foreground text-background border-foreground"
                      : "bg-white text-foreground border-border/60 hover:border-foreground/40"
                  }`}
                  aria-pressed={isActive}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Blog</h2>
            <span className="text-xs text-muted-foreground">
              {filteredPosts.length} articles
            </span>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-border/60 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-apple"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">{post.category}</span>
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {post.summary}
                  </p>
                </div>
              </Link>
            ))}
            {filteredPosts.length === 0 && (
              <div className="rounded-3xl border border-border/60 bg-white p-10 text-center text-muted-foreground md:col-span-3">
                No posts found for this category.
              </div>
            )}
          </div>

          
        </div>
      </section>

    </div>
  );
}
