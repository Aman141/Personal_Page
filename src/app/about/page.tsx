import type { Metadata } from "next";
import Link from "next/link";
import { aboutFacts } from "@/data/site";

const description =
  "AI Engineer at EvoLogics working on underwater acoustic detection and tracking. Previously LLM evaluation at Validaitor. M.Sc. Computational Science and Engineering, TUM.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About", description, url: "/about" },
};

const experience = [
  {
    period: "2025 – Present",
    org: "EvoLogics",
    role: "AI Engineer",
    points: [
      "Designing AI algorithms for underwater event detection, object localization and tracking from acoustic data.",
      "Working on solutions for real-world marine challenges.",
    ],
  },
  {
    period: "2023 – 2024",
    org: "Validaitor",
    role: "AI Software Engineer",
    points: [
      "Led the development of evaluation frameworks for LLMs.",
      "Worked across the stack using Django and Node.js.",
      "Helped shape tools for AI safety and governance.",
    ],
  },
];

const education = [
  {
    period: "2020 – 2023",
    org: "TUM",
    qualification: "M.Sc. Computational Science and Engineering",
    note: "Specialised in machine learning and deep learning for graphics, sequences and crowd modelling.",
  },
  {
    period: "2014 – 2018",
    org: "IIT (BHU)",
    qualification: "B.Tech. Mechanical Engineering",
    note: "Where I first fell in love with optimization and probability.",
  },
];

// prettier-ignore
const skills = [
  "Python", "C++", "SQL", "TensorFlow", "PyTorch", "Sklearn", "Pandas",
  "NumPy", "React", "Django", "Node.js", "Docker", "Git", "MLOps",
  "Computer Vision", "NLP", "Data Analysis", "Pytest", "TypeScript",
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-surface-subtle pt-22 pb-25">
        <div className="shell flex flex-wrap items-start gap-x-18 gap-y-12">
          <div className="min-w-0 flex-[1_1_27.5rem]">
            <p className="mono-label mb-5 text-[12px] tracking-[0.14em] text-ink-muted">
              About
            </p>
            <h1 className="m-0 mb-7 max-w-[40ch] text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.36] font-light tracking-[-0.014em] text-pretty">
              I work on machine learning for underwater acoustics — turning
              noisy hydrophone data into detections and tracks that hold up in
              the field.
            </h1>
            <p className="m-0 mb-5 max-w-[64ch] text-[17px] leading-[1.72] font-light text-ink-muted text-pretty">
              Most of the work is not the model. It is the feature pipeline in
              front of it, the Bayesian layer where uncertainty actually
              matters, and the interface behind it so results are usable by
              people who did not train anything. The projects in the index each
              isolate one of those pieces.
            </p>
            <p className="m-0 max-w-[64ch] text-[17px] leading-[1.72] font-light text-ink-muted text-pretty">
              Away from the screen: a camera, long routes across Europe, and
              German somewhere between B1 and fluent. I write up what I learn on
              Medium, mostly about the tools everyone uses and few people read
              the manual for.
            </p>

            <dl className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-px overflow-hidden rounded-xl border border-line-subtle bg-line-subtle">
              {aboutFacts.map(({ label, value }) => (
                <div key={label} className="bg-surface p-5.5">
                  <dt className="mono-label mb-2 text-[11px] tracking-[0.14em] text-ink-faint">
                    {label}
                  </dt>
                  <dd className="text-base font-light">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Gradient panels stand in for photographs. To use real images,
              swap each for a next/image with an explicit `sizes` — the portrait
              renders at ~340px and the two squares at ~163px. */}
          <div className="flex min-w-[16.25rem] flex-[0_1_21.25rem] flex-col gap-3.5">
            <div className="overflow-hidden rounded-2xl border border-line-subtle bg-surface">
              <div className="aspect-4/5 bg-[image:var(--gradient-diagonal)]" />
              <p className="mono-label p-4.5 text-[12px] tracking-[0.06em] text-ink-muted">
                Aman Kumar · Berlin
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="aspect-square rounded-xl border border-line-subtle bg-[image:var(--gradient-primary)]" />
              <div className="aspect-square rounded-xl border border-line-subtle bg-[image:var(--gradient-deep)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface pt-20 pb-8">
        <div className="shell">
          <p className="mono-label mb-3.5 text-[12px] tracking-[0.14em] text-ink-muted">
            Experience
          </p>
          <div className="border-t border-line">
            {experience.map(({ period, org, role, points }) => (
              <div
                key={org}
                className="flex flex-wrap gap-x-10 gap-y-4 border-b border-line-subtle py-8"
              >
                <p className="mono-label flex-[0_1_9rem] pt-1.5 text-[12px] tracking-[0.08em] text-ink-faint">
                  {period}
                </p>
                <div className="min-w-0 flex-[1_1_20rem]">
                  <h2 className="m-0 text-2xl font-normal tracking-[-0.012em]">
                    {org}
                  </h2>
                  <p className="mono-label mt-2 text-[12px] tracking-[0.08em] text-action">
                    {role}
                  </p>
                  <ul className="mt-4 flex max-w-[64ch] flex-col gap-2.5">
                    {points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3.5 text-base leading-relaxed font-light text-ink-muted text-pretty"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface pt-12 pb-8">
        <div className="shell">
          <p className="mono-label mb-3.5 text-[12px] tracking-[0.14em] text-ink-muted">
            Education
          </p>
          <div className="border-t border-line">
            {education.map(({ period, org, qualification, note }) => (
              <div
                key={org}
                className="flex flex-wrap gap-x-10 gap-y-4 border-b border-line-subtle py-8"
              >
                <p className="mono-label flex-[0_1_9rem] pt-1.5 text-[12px] tracking-[0.08em] text-ink-faint">
                  {period}
                </p>
                <div className="min-w-0 flex-[1_1_20rem]">
                  <h2 className="m-0 text-2xl font-normal tracking-[-0.012em]">
                    {org}
                  </h2>
                  <p className="mt-2 text-base font-light">{qualification}</p>
                  <p className="mt-2 max-w-[60ch] text-base leading-relaxed font-light text-ink-muted text-pretty">
                    {note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface pt-12 pb-24">
        <div className="shell">
          <p className="mono-label mb-3.5 text-[12px] tracking-[0.14em] text-ink-muted">
            Skills &amp; tools
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <li
                key={skill}
                className="mono-label rounded border border-line-subtle bg-surface-subtle px-2.5 py-1.5 text-[11px] tracking-[0.05em] text-ink-muted"
              >
                {skill}
              </li>
            ))}
          </ul>

          <Link
            href="/projects"
            className="mono-label mt-10 inline-block border-b border-line pb-1 text-[12px] tracking-[0.08em] transition-colors hover:text-action"
          >
            See the work →
          </Link>
        </div>
      </section>
    </div>
  );
}
