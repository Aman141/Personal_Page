import type { BlogPost } from "@/lib/medium";

/**
 * The design's post row, shared by the home page's writing section and /blog.
 *
 * `detailed` renders the /blog anatomy, which deliberately mirrors `ProjectRow`
 * on /projects so the two index pages read as siblings: a mono rail, then
 * title + summary + tag chips, then a right-hand action column, with the row
 * rule below and a tint on hover. Without the flag it is the compact two-part
 * preview the home page uses in its narrower column, and that variant is
 * intentionally left as it was.
 *
 * The rail is a FIXED basis in both variants, and that is load-bearing. It was
 * an auto-fit grid whose tracks used `auto` as their maximum, which both sizes
 * to content and absorbs free space — so each row's rail came out as wide as
 * that row's own title and excerpt made it, and titles started at a different x
 * on every row (measured 501px vs 537px on /blog).
 *
 * `flex-wrap` keeps the container-driven collapse to a stacked layout, which is
 * what lets the same component work unchanged in the narrower home column.
 */

/** Compact rail: the tags have nowhere else to go when there are no chips. */
export function formatPostMeta(post: BlogPost) {
  const tags = post.tags.map((tag) => tag.toUpperCase()).join(", ");
  return tags ? `${post.date} · ${tags}` : post.date;
}

export default function PostRow({
  post,
  detailed = false,
}: {
  post: BlogPost;
  detailed?: boolean;
}) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-wrap items-start text-ink transition-colors ${
        detailed
          ? "gap-x-8 gap-y-4.5 border-b border-line-subtle py-8 pr-4.5 hover:bg-surface-subtle"
          : "gap-x-10 gap-y-4 border-t border-line py-7"
      }`}
    >
      <p
        className={`mono-label pt-1.5 break-words text-ink-faint ${
          detailed
            ? "flex-[0_0_6rem] text-[13px] tracking-[0.06em]"
            : "flex-[0_0_10.625rem] text-[12px] tracking-[0.08em]"
        }`}
      >
        {detailed ? post.date : formatPostMeta(post)}
      </p>

      <div className="min-w-0 flex-[1_1_18.75rem]">
        <h3
          className={`m-0 font-normal tracking-[-0.012em] text-pretty ${
            detailed ? "mb-2 text-2xl" : "text-[23px]"
          }`}
        >
          {post.title}
        </h3>

        {detailed && (
          <>
            <p className="m-0 max-w-[64ch] text-base leading-relaxed font-light text-ink-muted text-pretty">
              {post.summary}
            </p>

            {post.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="mono-label rounded border border-line-subtle bg-surface-subtle px-2.5 py-1 text-[11px] tracking-[0.05em] text-ink-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {detailed && (
        <div className="flex flex-[0_1_10.625rem] flex-col gap-2.5 pt-1.5">
          <span className="text-[15px] text-action">Read post ↗</span>
        </div>
      )}
    </a>
  );
}
