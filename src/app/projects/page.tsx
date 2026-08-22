import type { Metadata } from "next";
import ContentCard from "@/components/ContentCard";
import { projects, projectHref } from "@/data/projects";

const description =
  "Machine learning, signal processing, and web projects by Aman Kumar.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects" },
  openGraph: { title: "Projects", description, url: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Projects</h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          A mix of machine learning and signal-processing work alongside a few
          things I have built for the web. Each one has a write-up covering the
          approach, results and limitations — with links to the live demo and
          the source.
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
            href={projectHref(project)}
            // Source stays on the card even though the detail page also links
            // it — engineers reading a portfolio want the code without a hop.
            secondary={{ href: project.repoUrl, label: "Source" }}
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
