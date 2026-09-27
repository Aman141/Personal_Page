"use client";

import { useState } from "react";
import ProjectRow from "@/components/ProjectRow";
import type { Project, ProjectDomain } from "@/data/projects";

type Facet = ProjectDomain | "all";

const CHIPS: { key: Facet; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ml", label: "Machine learning" },
  { key: "signals", label: "Signals" },
  { key: "web", label: "Web" },
];

/**
 * Client-side filtering over the full list, which is already in the HTML:
 * every project is server-rendered and the chips only narrow what is shown, so
 * the page stays fully indexable and still works without JavaScript — just
 * without the filter.
 *
 * The page heading comes in as `children` so it can stay in the server
 * component; this owns only the chips that sit beside it and the rows below.
 */
export default function WorkIndex({
  projects,
  children,
}: {
  projects: Project[];
  children: React.ReactNode;
}) {
  const [facet, setFacet] = useState<Facet>("all");

  const visible =
    facet === "all"
      ? projects
      : projects.filter((p) => p.domains.includes(facet));

  return (
    <>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        {children}

        <div
          role="group"
          aria-label="Filter projects by domain"
          className="flex flex-wrap gap-2"
        >
          {CHIPS.map(({ key, label }) => {
            const active = key === facet;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFacet(key)}
                aria-pressed={active}
                className={`mono-label rounded-full border px-4.5 py-2.5 text-[12px] tracking-[0.06em] transition-colors ${
                  active
                    ? "border-deep bg-deep text-white dark:border-accent dark:bg-accent dark:text-deep"
                    : "border-line text-ink-muted hover:border-ink-faint hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-line">
        {visible.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
