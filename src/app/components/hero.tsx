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
    <section className="relative overflow-hidden bg-deep">
      <SonarCanvas />

      {/* Sits between the canvas and the copy. The sweep is legible at the
          right-hand edge and fully suppressed behind the headline, which is
          the only place contrast actually has to hold up. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(105deg,rgba(0,13,25,0.94)_0%,rgba(0,13,25,0.62)_48%,rgba(0,65,68,0.28)_100%)]"
      />

      <div className="shell relative flex min-h-[640px] flex-wrap items-center gap-x-16 gap-y-12 pt-26 pb-18">
        <div className="min-w-0 flex-[1_1_27.5rem]">
          {/* One live region around the whole rotating block: a screen reader
              hears the new role, headline and blurb as a single update rather
              than three interruptions. */}
          <div aria-live="polite">
            <p className="mono-label mb-6 text-[12px] tracking-[0.16em] text-accent">
              {persona.eyebrow}
            </p>
            {/* min-h on both of these holds the layout still while the copy
                swaps — without it the controls below jump by a line whenever a
                headline wraps differently. */}
            <h1 className="m-0 min-h-[2.1em] max-w-[20ch] text-[clamp(2.25rem,4.6vw,4.125rem)] leading-[1.04] font-light tracking-[-0.02em] text-balance text-white">
              {persona.headline}
            </h1>
            <p className="mt-7 min-h-[3.3em] max-w-[50ch] text-lg leading-relaxed font-light text-white/70">
              {persona.body}
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-5">
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous role"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/28 text-white transition-colors hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next role"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/28 text-white transition-colors hover:bg-white/10"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <Link
              href={persona.href}
              className="inline-flex items-center gap-3 rounded-full bg-accent px-6.5 py-4 text-[15px] text-deep transition-colors hover:bg-accent-soft"
            >
              {persona.ctaLabel}
              <span className="font-mono" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <p className="mono-label mt-10 text-[12px] tracking-[0.14em] text-white/45">
            {String(index + 1).padStart(2, "0")} —{" "}
            {String(personas.length).padStart(2, "0")}
          </p>
        </div>

        <dl className="flex min-w-[16.25rem] flex-[0_1_21.25rem] flex-col gap-6.5 rounded-[20px] border border-white/14 bg-white/7 p-7.5 backdrop-blur-md">
          {persona.specs.map((spec) => (
            <div key={spec.label}>
              <dt className="mono-label mb-2.5 text-[11px] tracking-[0.16em] text-accent">
                {spec.label}
              </dt>
              <dd className="text-lg leading-snug font-light text-white">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
