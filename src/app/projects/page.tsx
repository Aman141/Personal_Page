import type { Metadata } from "next";
import ContentCard from "@/components/ContentCard";
import { projects, projectLink } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Machine learning, signal processing, and web projects by Aman Kumar.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Projects</h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          A mix of machine learning and signal-processing work alongside a few
          things I have built for the web. Each card links to a live demo where
          one exists, otherwise straight to the source.
        </p>
      </header>

      {/* Two columns rather than the home page's three: this page has the width
          to give each description room instead of clamping it. */}
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ContentCard
            key={project.slug}
            item={project}
            variant="project"
            href={projectLink(project)}
            secondary={
              project.demoUrl
                ? { href: project.repoUrl, label: "Source" }
                : undefined
            }
          />
        ))}
      </div>

      <p className="mt-10 text-sm text-gray-500 dark:text-gray-400">
        More on{" "}
        <a
          href="https://github.com/Aman141"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:underline dark:text-purple-400"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  );
}
