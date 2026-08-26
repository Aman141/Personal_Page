import Link from "next/link";
import PostRow from "@/components/PostRow";
import type { BlogPost } from "@/lib/medium";

/** A preview, not the archive — /blog carries the full feed. */
const PREVIEW_COUNT = 3;

export default function WritingPreview({
  posts,
  error,
}: {
  posts: BlogPost[];
  error: string | null;
}) {
  return (
    <section className="bg-surface pt-22 pb-28">
      <div className="shell flex flex-wrap items-start gap-x-16 gap-y-10">
        <div className="min-w-0 flex-[1_1_17.5rem]">
          <p className="mono-label mb-3.5 text-[12px] tracking-[0.14em] text-ink-muted">
            Writing
          </p>
          <h2 className="m-0 text-[clamp(1.625rem,2.8vw,2.375rem)] leading-[1.1] font-light tracking-[-0.015em]">
            Notes on the tools I use daily.
          </h2>
          <Link
            href="/blog"
            className="mono-label mt-5.5 inline-block border-b border-line pb-1 text-[12px] tracking-[0.08em] transition-colors hover:text-action"
          >
            All posts →
          </Link>
        </div>

        <div className="min-w-0 flex-[2_1_26.25rem]">
          {/* A feed outage degrades this section rather than the page: the
              fetch already returns an error instead of throwing, so all that
              is left is to say so. */}
          {error ? (
            <p className="border-t border-line py-7 text-base font-light text-ink-muted">
              {error}
            </p>
          ) : (
            posts
              .slice(0, PREVIEW_COUNT)
              .map((post) => <PostRow key={post.id} post={post} />)
          )}
        </div>
      </div>
    </section>
  );
}
