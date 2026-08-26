import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { featuredProjects } from "@/data/projects";

export default function FeaturedWork() {
  return (
    <section className="bg-surface pt-28 pb-8">
      <div className="shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mono-label mb-3.5 text-[12px] tracking-[0.14em] text-ink-muted">
              Selected work
            </p>
            {/* The count in this heading is only true while exactly three
                projects carry `featured` — see the note in projects.ts. */}
            <h2 className="m-0 max-w-[26ch] text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.08] font-light tracking-[-0.015em]">
              Three projects worth ten minutes of your time.
            </h2>
          </div>

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
