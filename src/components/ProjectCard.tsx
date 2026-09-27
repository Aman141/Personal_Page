import Link from "next/link";
import type { Project } from "@/data/projects";
import { projectHref, projectNumber } from "@/data/projects";

/**
 * The home page's featured-work card. Three of these share a row, so it reads
 * from `short` rather than `description` — the long version wraps to five or
 * six lines at this width and pushes the "Open" affordance out of alignment
 * with its neighbours.
 *
 * The whole card is clickable via a stretched-link overlay rather than a
 * wrapping anchor, matching the row on /projects: it keeps the markup open to
 * a second link inside the card later without nesting anchors.
 */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex flex-col gap-3.5 rounded-[20px] border border-line-subtle bg-surface-subtle p-7 transition-colors hover:border-line hover:bg-surface">
      <p className="mono-label text-[12px] tracking-[0.1em] text-ink-faint">
        {projectNumber(project.slug)} / {project.kind}
      </p>

      <h3 className="m-0 text-[23px] font-normal tracking-[-0.012em]">
        <Link
          href={projectHref(project)}
          className="after:absolute after:inset-0"
        >
          {project.title}
        </Link>
      </h3>

      <p className="m-0 text-[15px] leading-relaxed font-light text-ink-muted text-pretty">
        {project.short}
      </p>

      <p className="mono-label mt-auto pt-2.5 text-[12px] tracking-[0.06em] text-action">
        Open →
      </p>
    </article>
  );
}
