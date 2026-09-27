"use client";

import { useState } from "react";
import {
  CORPUS,
  SAMPLE_QUERIES,
  retrieve,
  type Hit,
} from "@/data/retrieval-demo";

const IDLE_ANSWER =
  "Run a query and the answer will be assembled from the passages above — nothing else.";

const ABSTAIN_ANSWER =
  "Nothing in the index scored above threshold, so there is no grounded answer to give. In the real pipeline this is where the model should abstain rather than guess.";

/**
 * A miniature of the RAGdemo pipeline that runs entirely in the browser.
 *
 * It is deliberately not a re-implementation: the real project embeds with
 * all-MiniLM-L6-v2 and searches FAISS, neither of which fits in a tab. What
 * carries over is the behaviour worth demonstrating — passages come back with
 * scores, the answer is assembled only from those passages, and a query that
 * matches nothing produces an abstention instead of an invention.
 *
 * The copy around it says so plainly. A visitor should not leave thinking they
 * just queried a language model.
 */
export default function RetrievalDemo() {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[] | null>(null);

  const run = (q: string) => setHits(retrieve(q));

  const reset = () => {
    setQuery("");
    setHits(null);
  };

  const answer =
    hits === null
      ? IDLE_ANSWER
      : hits.length > 0
        ? `${hits[0].text} (Grounded in ${hits.map((h) => h.id).join(", ")}.)`
        : ABSTAIN_ANSWER;

  return (
    <section className="mt-15 bg-abyss py-20">
      <div className="shell">
        <p className="mono-label mb-4.5 text-[12px] tracking-[0.16em] text-accent">
          Live demo · runs in your browser
        </p>
        <h2 className="m-0 mb-3 max-w-[26ch] text-[clamp(1.625rem,3vw,2.5rem)] leading-[1.08] font-light tracking-[-0.018em] text-white">
          Ask the retriever a question.
        </h2>
        <p className="mb-8.5 max-w-[60ch] text-base leading-relaxed font-light text-white/60">
          A miniature of the pipeline: the query is scored against a small
          indexed corpus, the top passages come back with their scores, and the
          answer is assembled only from what was retrieved.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,18.75rem),1fr))] items-start gap-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              run(query);
            }}
            className="rounded-[18px] border border-white/14 bg-white/6 p-6"
          >
            <label
              htmlFor="retrieval-query"
              className="mono-label mb-3 block text-[11px] tracking-[0.14em] text-white/50"
            >
              Query
            </label>
            <input
              id="retrieval-query"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. how was the EEG model evaluated?"
              className="w-full rounded-lg border border-white/20 bg-black/30 px-4 py-3.5 text-base text-white outline-none placeholder:text-white/35 focus:border-accent"
            />

            <div className="mt-3.5 flex flex-wrap gap-2.5">
              <button
                type="submit"
                className="rounded-lg bg-accent px-5 py-3 text-[15px] text-deep transition-colors hover:bg-accent-soft"
              >
                Retrieve →
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-white/22 px-5 py-3 text-[15px] text-white/70 transition-colors hover:bg-white/8"
              >
                Reset
              </button>
            </div>

            <p className="mono-label mt-6.5 mb-2.5 text-[11px] tracking-[0.12em] text-white/40">
              Try one
            </p>
            <div className="flex flex-col gap-2">
              {SAMPLE_QUERIES.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setQuery(sample);
                    run(sample);
                  }}
                  className="border-b border-accent/20 pb-2 text-left text-sm text-accent transition-colors hover:text-white"
                >
                  {sample}
                </button>
              ))}
            </div>
          </form>

          <div className="flex flex-col gap-3.5">
            <div className="rounded-[18px] border border-white/14 bg-white/6 p-6">
              <div className="mb-3.5 flex items-baseline justify-between gap-4">
                <h3 className="mono-label m-0 text-[11px] font-normal tracking-[0.14em] text-white/50">
                  Retrieved passages
                </h3>
                <p className="mono-label text-[11px] tracking-[0.08em] text-white/40">
                  {hits === null
                    ? `${CORPUS.length} chunks indexed`
                    : `${hits.length} of ${CORPUS.length} chunks`}
                </p>
              </div>

              {/* aria-live so the result is announced: the button that ran the
                  query keeps focus, so nothing else would tell a screen-reader
                  user that anything happened. */}
              <div aria-live="polite" className="flex flex-col gap-3">
                {hits !== null && hits.length === 0 && (
                  <p className="text-sm leading-relaxed font-light text-white/60">
                    No passage scored above threshold.
                  </p>
                )}
                {(hits ?? []).map((hit) => (
                  <div
                    key={hit.id}
                    className="border-l-2 border-accent py-0.5 pl-3.5"
                  >
                    <p className="mono-label mb-1.5 text-[11px] tracking-[0.08em] text-accent">
                      {hit.id} · score {hit.score}
                    </p>
                    <p className="text-sm leading-relaxed font-light text-white/78">
                      {hit.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[18px] border border-accent/28 bg-teal/40 p-6">
              <h3 className="mono-label m-0 mb-3 text-[11px] font-normal tracking-[0.14em] text-accent">
                Grounded answer
              </h3>
              <p
                aria-live="polite"
                className="text-base leading-relaxed font-light text-white"
              >
                {answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
