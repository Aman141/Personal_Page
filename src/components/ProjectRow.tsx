import Link from "next/link";
import type { Project } from "@/data/projects";
import { projectHref, projectNumber } from "@/data/projects";

/**
 * The work-index row on /projects.
 *
 * The row carries two destinations — the detail page and the repo — so the
 * whole-row target is a stretched-link overlay on the title rather than an
 * anchor wrapped around everything. Nesting the "Source" anchor inside a
 * wrapping one would be invalid HTML; here it just needs `relative z-10` to
 * sit above the overlay.
 */
export default function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="group relative flex flex-wrap items-start gap-x-8 gap-y-4.5 border-b border-line-subtle py-8 pr-4.5 transition-colors hover:bg-surface-subtle">
      <p className="mono-label flex-[0_0_2rem] pt-1.5 text-[13px] tracking-[0.06em] text-ink-faint">
        {projectNumber(project.slug)}
      </p>

      <div className="min-w-0 flex-[1_1_18.75rem]">
        <h3 className="m-0 mb-2 text-2xl font-normal tracking-[-0.012em]">
          <Link
            href={projectHref(project)}
            className="after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h3>

        <p className="m-0 max-w-[64ch] text-base leading-relaxed font-light text-ink-muted text-pretty">
          {project.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="mono-label rounded border border-line-subtle bg-surface-subtle px-2.5 py-1 text-[11px] tracking-[0.05em] text-ink-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-[0_1_10.625rem] flex-col gap-2.5 pt-1.5">
        <span className="text-[15px] text-action">View project →</span>
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mono-label relative z-10 self-start text-[12px] tracking-[0.06em] text-ink-faint transition-colors hover:text-ink"
        >
          Source ↗
        </a>
      </div>
    </article>
  );
}
