import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code2, FileText } from "lucide-react";

// Shared by the home-page sliders and /projects. Deliberately has no "use
// client" directive: it holds no state, so it renders on the server for
// /projects and is bundled into the client component that owns the sliders.

export interface ContentCardItem {
  title: string;
  description: string;
  tags: string[];
  /** Small right-aligned label above the title — a post date, for example. */
  meta?: string;
}

const isExternal = (url: string) => /^https?:\/\//.test(url);

export default function ContentCard({
  item,
  variant,
  href,
  secondary,
}: {
  item: ContentCardItem;
  variant: "project" | "post";
  href: string;
  /** Optional second link, e.g. source when `href` points at a live demo. */
  secondary?: { href: string; label: string };
}) {
  const external = isExternal(href);
  const Icon = variant === "project" ? Code2 : FileText;
  const visibleTags = item.tags.slice(0, 3);
  const hiddenTagCount = item.tags.length - visibleTags.length;

  const stretchedLinkClasses = "absolute inset-0 rounded-xl";

  return (
    <div className="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-purple-700">
      {/* Stretched link: covers the whole card so the entire surface is
          clickable, while `secondary` below can still sit above it via z-10.
          A plain wrapping anchor would make that second link impossible,
          since anchors cannot nest. */}
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.title}
          className={stretchedLinkClasses}
        />
      ) : (
        <Link
          href={href}
          aria-label={item.title}
          className={stretchedLinkClasses}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white ${
            variant === "project"
              ? "from-purple-500 to-indigo-500"
              : "from-sky-500 to-emerald-500"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        {item.meta && (
          <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
            {item.meta}
          </span>
        )}
      </div>

      {/* line-clamp rather than truncate: these titles wrap to two lines
          instead of being cut off mid-word with an ellipsis. */}
      <h3 className="mt-4 line-clamp-2 text-lg font-semibold leading-snug transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">
        {item.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {item.description}
      </p>

      {visibleTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
          {hiddenTagCount > 0 && (
            <span className="rounded-md px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
              +{hiddenTagCount}
            </span>
          )}
        </div>
      )}

      {/* mt-auto pins the footer to the bottom so every card in a row lines up
          regardless of description length. */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <span className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 dark:text-purple-400">
          {variant === "project" ? "View project" : "Read post"}
          {external ? (
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </span>
        {secondary && (
          <a
            href={secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex shrink-0 items-center gap-1 text-xs text-gray-500 hover:text-purple-600 hover:underline dark:text-gray-400 dark:hover:text-purple-400"
          >
            {secondary.label}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
