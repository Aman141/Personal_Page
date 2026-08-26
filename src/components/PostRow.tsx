import type { BlogPost } from "@/lib/medium";

/**
 * The design's post row, shared by the home page's writing section and /blog.
 * Both render the same anatomy — a monospace meta line beside the title — so
 * this is one component with the excerpt made optional rather than two that
 * drift apart.
 *
 * The grid collapses to a single stacked column below ~170px of track space,
 * which is what happens inside the home page's narrower column. That is why
 * the home variant needs no separate layout.
 */
export function formatPostMeta(post: BlogPost) {
  const tags = post.tags.map((tag) => tag.toUpperCase()).join(", ");
  return tags ? `${post.date} · ${tags}` : post.date;
}

export default function PostRow({
  post,
  showExcerpt = false,
}: {
  post: BlogPost;
  showExcerpt?: boolean;
}) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-[repeat(auto-fit,minmax(min(100%,10.625rem),auto))] gap-x-10 gap-y-4 border-t border-line py-7 text-ink transition-colors"
    >
      <p className="mono-label pt-1.5 text-[12px] tracking-[0.08em] text-ink-faint">
        {formatPostMeta(post)}
      </p>
      <div>
        <h3
          className={`m-0 max-w-[44ch] font-normal tracking-[-0.014em] text-pretty transition-colors group-hover:text-action ${
            showExcerpt ? "text-[26px]" : "text-[23px]"
          }`}
        >
          {post.title}
        </h3>
        {showExcerpt && (
          <p className="mt-3 max-w-[66ch] text-base leading-relaxed font-light text-ink-muted text-pretty">
            {post.summary}
          </p>
        )}
      </div>
    </a>
  );
}
