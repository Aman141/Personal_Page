import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { featuredProjects } from "@/data/projects";

/**
 * `border-t` is doing the job the four-cell "now" strip used to. That strip sat
 * between this section and the hero and every cell of it repeated something the
 * hero already said, so it went; but it was also the only thing marking where
 * the hero ended, and `--hero-bg` and `--surface` are both #ffffff in light
 * mode, so removing it left no boundary at all on the right-hand side, where
 * the hero wash has faded to transparent.
 */
export default function FeaturedWork() {
  return (
    <section className="border-t border-line bg-surface pt-28 pb-8">
      <div className="shell">
        {/* The eyebrow IS the heading. The display line above it used to be the
            `h2` and the eyebrow a decorative `p`; with the display line gone,
            leaving the eyebrow as a `p` would skip the page from `h1` straight
            to the card titles' `h3`. `m-0 font-normal` undoes the UA styles the
            element brings with it — the mono-label look is unchanged. */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="mono-label m-0 text-[12px] font-normal tracking-[0.14em] text-ink-muted">
            Selected work
          </h2>

          <Link
            href="/projects"
            className="mono-label border-b border-line pb-1 text-[12px] tracking-[0.08em] transition-colors hover:text-action"
          >
            Work index →
          </Link>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,18.75rem),1fr))] gap-5">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
