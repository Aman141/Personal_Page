import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { getProject, projects } from "@/data/projects";

// In Next 15+, route params arrive as a Promise and must be awaited.
type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `/projects/${slug}`,
    },
  };
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xl font-semibold tracking-tight">{children}</h2>
  );
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);

  // Any slug not in projects.ts is a 404 rather than an empty shell.
  if (!project) notFound();

  const { detail } = project;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        All projects
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
            >
              Live demo
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:border-purple-400 hover:text-purple-600 dark:border-gray-700 dark:hover:border-purple-600 dark:hover:text-purple-400"
          >
            View source
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <p className="mt-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        {detail.overview}
      </p>

      {detail.features && (
        <section className="mt-10">
          <SectionHeading>What it does</SectionHeading>
          <ul className="space-y-2.5">
            {detail.features.map((feature) => (
              <li
                key={feature}
                className="flex gap-3 text-gray-700 dark:text-gray-300"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500"
                />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      {detail.approach && (
        <section className="mt-10">
          <SectionHeading>Approach</SectionHeading>
          <ul className="space-y-4">
            {detail.approach.map((step) => (
              <li
                key={step}
                className="flex gap-3 leading-relaxed text-gray-700 dark:text-gray-300"
              >
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500"
                />
                {step}
              </li>
            ))}
          </ul>
        </section>
      )}

      {detail.results && (
        <section className="mt-10">
          <SectionHeading>Results</SectionHeading>
          <dl className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-700">
            {detail.results.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 px-4 py-3"
              >
                <dt className="text-sm text-gray-600 dark:text-gray-400">
                  {label}
                </dt>
                <dd className="font-mono text-sm font-medium tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {detail.limitations && (
        // Deliberately as prominent as Results. Quoting a metric without its
        // caveat is the failure mode this section exists to prevent.
        <section className="mt-10">
          <SectionHeading>Limitations</SectionHeading>
          <ul className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
            {detail.limitations.map((limitation) => (
              <li
                key={limitation}
                className="flex gap-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
                />
                {limitation}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-800">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Built with
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {detail.stack.map((tool) => (
            <span
              key={tool}
              className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tool}
            </span>
          ))}
        </div>
      </section>
    </article>
  );
}
