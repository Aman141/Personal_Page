import Link from "next/link";
import PostRow from "@/components/PostRow";
import type { BlogPost } from "@/lib/medium";

/** A preview, not the archive — /blog carries the full feed. */
const PREVIEW_COUNT = 3;

/**
 * Structurally a copy of `FeaturedWork`: a label row with the section heading
 * on the left and the index link on the right, then the content full width.
 *
 * It used to be two columns — a narrow rail holding the eyebrow, a display
 * heading and the link, beside a wider column of rows. That split existed to
 * give the heading somewhere to sit. With the heading gone the rail had nothing
 * left in it but two mono labels and roughly 430px of empty space, so the
 * section now reads the same way as the one above it.
 *
 * Widening the rows is the point rather than a side effect: at the old column
 * width the longer titles wrapped to two lines, and the home page's compact
 * `PostRow` has no summary underneath to balance that against.
 */
export default function WritingPreview({
  posts,
  error,
}: {
  posts: BlogPost[];
  error: string | null;
}) {
  return (
    <section className="bg-surface pt-22 pb-28">
      <div className="shell">
        {/* As in FeaturedWork, the eyebrow is the real `h2` — the post titles
            below are `h3`, and nothing else here would carry the level. */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="mono-label m-0 text-[12px] font-normal tracking-[0.14em] text-ink-muted">
            Writing
          </h2>

          <Link
            href="/blog"
            className="mono-label border-b border-line pb-1 text-[12px] tracking-[0.08em] transition-colors hover:text-action"
          >
            All posts →
          </Link>
        </div>

        {/* `border-b` closes the list. Each compact row carries its own rule on
            top and none underneath, which read fine when the rows sat in a
            narrow column beside a heading; spanning the full shell they need an
            end, or the last title trails off into the footer's whitespace.
            A feed outage degrades this section rather than the page: the fetch
            already returns an error instead of throwing, so all that is left
            here is to say so. */}
        <div className="border-b border-line">
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
