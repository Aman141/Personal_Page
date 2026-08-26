import type { Metadata } from "next";
import BlogList from "./BlogList";
import { getMediumPosts } from "@/lib/medium";

const description =
  "Writing on machine learning, engineering, and the occasional side project.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog", description, url: "/blog" },
};

export default async function BlogPage() {
  const { posts, error } = await getMediumPosts();

  return (
    <div className="min-h-[70vh] bg-surface pt-21 pb-25">
      <div className="shell">
        <p className="mono-label mb-3.5 text-[12px] tracking-[0.14em] text-ink-muted">
          Blog
        </p>
        <h1 className="m-0 mb-12 max-w-[24ch] text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.06] font-light tracking-[-0.018em]">
          Notes on the tools I use daily.
        </h1>
        <BlogList posts={posts} error={error} />
      </div>
    </div>
  );
}
