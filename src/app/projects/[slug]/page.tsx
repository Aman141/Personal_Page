import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProject,
  projectHref,
  projectNumber,
  projects,
} from "@/data/projects";
import RetrievalDemo from "./RetrievalDemo";

// In Next 15+, route params arrive as a Promise and must be awaited.
type Params = { params: Promise<{ slug: string }> };

/**
 * The one project with a browser-runnable demo. Keyed by slug rather than a
 * flag on the data, because the demo is a bespoke component rather than
 * something any project could switch on.
 */
const DEMO_SLUG = "ragdemo";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  // This route's generateMetadata wins over not-found.tsx's when notFound() is
  // called below, so returning {} here would leave a 404 wearing the site's
  // default title and let it be indexed. Mirror the 404 metadata instead.
  if (!project) {
    return { title: "Page not found", robots: { index: false, follow: true } };
  }

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mono-label mb-4 text-[12px] tracking-[0.14em] text-ink-muted">
      {children}
    </p>
  );
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);

  // Any slug not in projects.ts is a 404 rather than an empty shell.
  if (!project) notFound();

  const { detail } = project;
  const index = projects.findIndex((p) => p.slug === slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <header className="bg-deep pt-18 pb-16">
        <div className="shell">
          <Link
            href="/projects"
            className="mono-label mb-10 inline-block text-[12px] tracking-[0.08em] text-white/55 transition-colors hover:text-accent"
          >
            ← Work index
          </Link>

          <div className="flex flex-wrap items-end gap-x-15 gap-y-10">
            <div className="min-w-0 flex-[1_1_27.5rem]">
              <p className="mono-label mb-5.5 text-[12px] tracking-[0.16em] text-accent">
                {projectNumber(slug)} &nbsp;/&nbsp; {project.kind}
              </p>
              <h1 className="m-0 max-w-[22ch] text-[clamp(2rem,4vw,3.625rem)] leading-[1.04] font-light tracking-[-0.02em] text-white">
                {project.title}
              </h1>
              <p className="mt-6.5 max-w-[60ch] text-lg leading-relaxed font-light text-white/70 text-pretty">
                {project.description}
              </p>
            </div>

            <div className="flex min-w-[15rem] flex-[0_1_18.75rem] flex-col gap-3">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between gap-2.5 rounded-lg border border-white/26 px-5 py-3.5 text-[15px] text-white transition-colors hover:bg-white/8"
              >
                Source code <span className="font-mono">↗</span>
              </a>
              {/* Only rendered when there is somewhere to go — a "Live site"
                  button that resolves to the page you are already on is worse
                  than no button. */}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between gap-2.5 rounded-lg bg-accent px-5 py-3.5 text-[15px] text-deep transition-colors hover:bg-accent-soft"
                >
                  Live site <span className="font-mono">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {detail.stats && (
        <section className="bg-surface">
          <div className="shell">
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(11.875rem,1fr))] border-b border-line-subtle">
              {detail.stats.map(({ label, value }) => (
                <div key={label} className="py-7.5 pr-6">
                  <dt className="mono-label mb-2.5 text-[11px] tracking-[0.14em] text-ink-faint">
                    {label}
                  </dt>
                  <dd className="font-mono text-xl text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="bg-surface pt-17 pb-5">
        <div className="shell flex flex-wrap items-start gap-x-15 gap-y-10">
          <div className="min-w-0 flex-[1_1_27.5rem]">
            <Eyebrow>How it works</Eyebrow>
            <p className="m-0 mb-5 max-w-[66ch] text-[17px] leading-[1.72] font-light text-ink-muted text-pretty">
              {detail.overview}
            </p>
            {detail.approach?.map((step) => (
              <p
                key={step}
                className="m-0 mb-5 max-w-[66ch] text-[17px] leading-[1.72] font-light text-ink-muted text-pretty"
              >
                {step}
              </p>
            ))}
          </div>

          <div className="min-w-[15rem] flex-[0_1_18.75rem] rounded-2xl border border-line-subtle bg-surface-subtle p-6">
            <h2 className="mono-label m-0 mb-3.5 text-[11px] font-normal tracking-[0.14em] text-ink-faint">
              Stack
            </h2>
            <ul className="flex flex-col gap-2.5">
              {detail.stack.map((tool) => (
                <li
                  key={tool}
                  className="border-b border-line-subtle pb-2.5 text-[15px] text-ink last:border-b-0 last:pb-0"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {detail.features && (
        <section className="bg-surface pt-8">
          <div className="shell">
            <Eyebrow>What it does</Eyebrow>
            <ul className="flex max-w-[70ch] flex-col gap-3">
              {detail.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3.5 text-[17px] leading-[1.7] font-light text-ink-muted text-pretty"
                >
                  <span
                    aria-hidden="true"
                    className="mt-3 h-1 w-1 shrink-0 rounded-full bg-accent"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {detail.results && (
        <section className="bg-surface pt-14">
          <div className="shell">
            <Eyebrow>Results</Eyebrow>
            <dl className="max-w-[46rem] divide-y divide-line-subtle overflow-hidden rounded-2xl border border-line-subtle">
              {detail.results.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 px-5 py-4"
                >
                  <dt className="text-sm text-ink-muted">{label}</dt>
                  <dd className="font-mono text-sm tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {detail.limitations && (
        // Kept as prominent as Results, which is the whole point of the section
        // — see rule 2 at the top of projects.ts. The design canvas has no
        // equivalent panel; dropping it to match would mean publishing the
        // headline figures without the caveats that qualify them.
        <section className="bg-surface pt-14">
          <div className="shell">
            <Eyebrow>Limitations</Eyebrow>
            <ul className="flex max-w-[70ch] flex-col gap-3.5 rounded-2xl border-l-2 border-accent bg-surface-subtle p-6">
              {detail.limitations.map((limitation) => (
                <li
                  key={limitation}
                  className="text-[15px] leading-relaxed font-light text-ink-muted text-pretty"
                >
                  {limitation}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {slug === DEMO_SLUG && <RetrievalDemo />}

      <section className="bg-surface pt-15 pb-22">
        <div className="shell flex justify-between gap-5 border-t border-line pt-7">
          <Link
            href={projectHref(previous)}
            className="mono-label text-[12px] tracking-[0.08em] transition-colors hover:text-action"
          >
            ← {previous.title}
          </Link>
          <Link
            href={projectHref(next)}
            className="mono-label text-right text-[12px] tracking-[0.08em] transition-colors hover:text-action"
          >
            {next.title} →
          </Link>
        </div>
      </section>
    </article>
  );
}
