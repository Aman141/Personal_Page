"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useMediumPosts } from "../../hooks/useMediumPosts";
import { featuredProjects, projectLink } from "@/data/projects";
import ContentCard, { type ContentCardItem } from "@/components/ContentCard";

// Three cards visible on desktop, two on tablet, one on mobile. Widths are
// percentages of the track rather than fixed pixels, so the last visible card
// can never be clipped by a container narrower than the sum of the cards.
const SLIDE_WIDTH =
  "w-full sm:w-[calc((100%_-_1.25rem)/2)] lg:w-[calc((100%_-_2.5rem)/3)]";

// Scroll position drives the arrows, rather than an index the component owns,
// so trackpad/touch swipes and arrow clicks can never disagree about where the
// slider is. `count` is a dependency because the blog feed arrives after mount.
function useSliderControls(count: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    // Catches viewport resizes, which change how many cards fit.
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync, count]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = card ? card.offsetWidth + gap : el.clientWidth;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return { trackRef, canPrev, canNext, scrollByCard };
}

const ARROW_CLASSES =
  "rounded-full border border-gray-300 p-1.5 text-gray-600 transition hover:border-purple-400 hover:text-purple-600 disabled:pointer-events-none disabled:opacity-30 dark:border-gray-700 dark:text-gray-400 dark:hover:border-purple-600 dark:hover:text-purple-400";

function SliderTrack({
  trackRef,
  children,
}: {
  trackRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    // overflow-x:auto forces overflow-y to clip, so the vertical padding gives
    // the cards' hover lift and shadow room to render without being cut off.
    // The negative inline margin cancels the padding so cards stay flush with
    // the section heading.
    <div
      ref={trackRef}
      className="no-scrollbar -mx-2 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-2 pt-1 pb-3"
    >
      {children}
    </div>
  );
}

function Section({
  title,
  ctaLabel,
  ctaHref,
  controls,
  children,
}: {
  title: string;
  ctaLabel: string;
  ctaHref: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="px-6 py-10 sm:px-12 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          <div className="flex items-center gap-4">
            {controls}
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:underline dark:text-purple-400"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

// Arrows sit in the section header rather than floating over the cards, so they
// never cover content or block a card's click target.
function SliderArrows({
  label,
  canPrev,
  canNext,
  onScroll,
}: {
  label: string;
  canPrev: boolean;
  canNext: boolean;
  onScroll: (direction: 1 | -1) => void;
}) {
  if (!canPrev && !canNext) return null;
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onScroll(-1)}
        disabled={!canPrev}
        aria-label={`Previous ${label}`}
        className={ARROW_CLASSES}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onScroll(1)}
        disabled={!canNext}
        aria-label={`Next ${label}`}
        className={ARROW_CLASSES}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
      {children}
    </div>
  );
}

export default function PopularContents() {
  const {
    posts: mediumPosts,
    loading: blogsLoading,
    error: blogsError,
  } = useMediumPosts();

  // Six rather than three: with three cards visible there would be nothing to
  // slide, so the slider only earns its arrows once the feed has more posts.
  const blogs: (ContentCardItem & { link: string })[] = mediumPosts
    .slice(0, 6)
    .map((post) => ({
      title: post.title,
      description: post.summary,
      tags: post.tags,
      link: post.link,
      meta: post.date,
    }));

  const projectSlider = useSliderControls(featuredProjects.length);
  const blogSlider = useSliderControls(blogs.length);

  return (
    <>
      <Section
        title="Featured Projects"
        ctaLabel="See all projects"
        ctaHref="/projects"
        controls={
          <SliderArrows
            label="projects"
            canPrev={projectSlider.canPrev}
            canNext={projectSlider.canNext}
            onScroll={projectSlider.scrollByCard}
          />
        }
      >
        <SliderTrack trackRef={projectSlider.trackRef}>
          {featuredProjects.map((project) => (
            <div
              key={project.slug}
              className={`${SLIDE_WIDTH} shrink-0 snap-start`}
            >
              <ContentCard
                item={project}
                variant="project"
                href={projectLink(project)}
                secondary={
                  project.demoUrl
                    ? { href: project.repoUrl, label: "Source" }
                    : undefined
                }
              />
            </div>
          ))}
        </SliderTrack>
      </Section>

      <Section
        title="Featured Blog"
        ctaLabel="See all blogs"
        ctaHref="/blog"
        controls={
          <SliderArrows
            label="posts"
            canPrev={blogSlider.canPrev}
            canNext={blogSlider.canNext}
            onScroll={blogSlider.scrollByCard}
          />
        }
      >
        {blogsLoading && (
          <div className="flex gap-5 overflow-hidden">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${SLIDE_WIDTH} h-56 shrink-0 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900`}
              />
            ))}
          </div>
        )}
        {!blogsLoading && blogsError && <EmptyState>{blogsError}</EmptyState>}
        {!blogsLoading && !blogsError && blogs.length === 0 && (
          <EmptyState>No posts yet — check back soon.</EmptyState>
        )}
        {!blogsLoading && !blogsError && blogs.length > 0 && (
          <SliderTrack trackRef={blogSlider.trackRef}>
            {blogs.map((post) => (
              <div
                key={post.link}
                className={`${SLIDE_WIDTH} shrink-0 snap-start`}
              >
                <ContentCard item={post} variant="post" href={post.link} />
              </div>
            ))}
          </SliderTrack>
        )}
      </Section>
    </>
  );
}
