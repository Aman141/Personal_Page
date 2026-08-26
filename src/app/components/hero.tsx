"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { personas } from "@/data/site";
import SonarCanvas from "./sonar_canvas";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const persona = personas[index];

  const step = (delta: number) =>
    setIndex((i) => (i + delta + personas.length) % personas.length);

  return (
    <section className="relative overflow-hidden bg-hero">
      <SonarCanvas />

      {/* Sits between the canvas and the copy, and flips with the theme:
          near-black opening to teal in dark, accent blue clearing to white in
          light. Either way it is dense at the left, where the headline sits,
          and transparent at the right, where the sweep is meant to show. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[image:var(--hero-wash)]"
      />

      <div className="shell relative flex min-h-[640px] flex-wrap items-center gap-x-16 gap-y-12 pt-26 pb-18">
        <div className="min-w-0 flex-[1_1_27.5rem]">
          {/* One live region around the whole rotating block: a screen reader
              hears the new role, headline and blurb as a single update rather
              than three interruptions. */}
          <div aria-live="polite">
            <p className="mono-label mb-6 text-[12px] tracking-[0.16em] text-hero-label">
              {persona.eyebrow}
            </p>
            {/* min-h on both of these holds the layout still while the copy
                swaps — without it the controls below jump by a line whenever a
                headline wraps differently. */}
            <h1 className="m-0 min-h-[2.1em] max-w-[20ch] text-[clamp(2.25rem,4.6vw,4.125rem)] leading-[1.04] font-light tracking-[-0.02em] text-balance text-ink">
              {persona.headline}
            </h1>
            <p className="mt-7 min-h-[3.3em] max-w-[50ch] text-lg leading-relaxed font-light text-ink-muted">
              {persona.body}
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-5">
            <div className="flex gap-2.5">
              {/* `border-ink/25` rather than a fixed white: --ink is #fff under
                  .dark and near-black in light, so one class covers both. */}
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous role"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors hover:bg-ink/8"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next role"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors hover:bg-ink/8"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Solid --deep in light: the accent is a near neighbour of the
                blue wash behind it and would stop reading as a filled button. */}
            <Link
              href={persona.href}
              className="inline-flex items-center gap-3 rounded-full bg-deep px-6.5 py-4 text-[15px] text-white transition-colors hover:bg-teal dark:bg-accent dark:text-deep dark:hover:bg-accent-soft"
            >
              {persona.ctaLabel}
              <span className="font-mono" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <p className="mono-label mt-10 text-[12px] tracking-[0.14em] text-ink-muted">
            {String(index + 1).padStart(2, "0")} —{" "}
            {String(personas.length).padStart(2, "0")}
          </p>
        </div>

        {/* Frosted white over the blue wash in light, the canvas's translucent
            white panel in dark. The two need different alphas rather than one
            token: over a light ground the panel has to be lighter than its
            backdrop, over a dark one it has to be lighter too — which is the
            same direction but a very different amount. */}
        <dl className="flex min-w-[16.25rem] flex-[0_1_21.25rem] flex-col gap-6.5 rounded-[20px] border border-white/70 bg-white/45 p-7.5 backdrop-blur-md dark:border-white/14 dark:bg-white/7">
          {persona.specs.map((spec) => (
            <div key={spec.label}>
              <dt className="mono-label mb-2.5 text-[11px] tracking-[0.16em] text-hero-label">
                {spec.label}
              </dt>
              <dd className="text-lg leading-snug font-light text-ink">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
