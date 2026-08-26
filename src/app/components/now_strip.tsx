import { nowFacts } from "@/data/site";

/**
 * The four-cell band directly under the hero.
 *
 * Separators are the 1px grid gaps letting the container's lighter background
 * show through, rather than a `border-r` on each cell. The grid is `auto-fit`,
 * so which cell ends a row changes with viewport width — per-cell borders
 * leave a stray rule hanging at the end of every wrapped row.
 */
export default function NowStrip() {
  return (
    <section className="bg-abyss">
      <div className="shell">
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] gap-px bg-white/10">
          {nowFacts.map(({ label, value }) => (
            <div
              key={label}
              // first/last padding resets keep the outer text flush with the
              // shell edge, so this band lines up with the hero copy above it.
              className="bg-abyss px-6 py-7.5 first:pl-0 last:pr-0"
            >
              <dt className="mono-label mb-2.5 text-[11px] tracking-[0.14em] text-white/40">
                {label}
              </dt>
              <dd className="text-base font-light text-white">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
