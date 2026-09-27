import type { Metadata } from "next";
import WorkIndex from "./WorkIndex";
import { projects } from "@/data/projects";

const description =
  "Machine learning, signal processing, and web projects by Aman Kumar.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects" },
  openGraph: { title: "Projects", description, url: "/projects" },
};

// The heading counts the projects out loud. Derived rather than written as a
// literal, so adding a seventh entry to projects.ts cannot leave the page
// claiming six. Falls back to the digit past twelve.
// prettier-ignore
const NUMBER_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
];
const spell = (n: number) => NUMBER_WORDS[n] ?? String(n);

export default function ProjectsPage() {
  return (
    <div className="min-h-[80vh] bg-surface pt-21 pb-15">
      <div className="shell">
        <WorkIndex projects={projects}>
          <div>
            <p className="mono-label mb-3.5 text-[12px] tracking-[0.14em] text-ink-muted">
              Work index
            </p>
            <h1 className="m-0 max-w-[24ch] text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.06] font-light tracking-[-0.018em]">
              {spell(projects.length)} projects, from raw signal to shipped
              interface.
            </h1>
          </div>
        </WorkIndex>
      </div>
    </div>
  );
}
