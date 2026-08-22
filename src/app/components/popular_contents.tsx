"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
} from "lucide-react";
import { useMediumPosts } from "../../hooks/useMediumPosts";

// Three cards visible on desktop, two on tablet, one on mobile. Widths are
// percentages of the track rather than fixed pixels, so the last visible card
// can never be clipped by a container narrower than the sum of the cards.
const SLIDE_WIDTH =
  "w-full sm:w-[calc((100%_-_1.25rem)/2)] lg:w-[calc((100%_-_2.5rem)/3)]";

interface CardItem {
  title: string;
  description: string;
  tags: string[];
  link: string;
  meta?: string;
}

const CARD_CLASSES =
  "group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-purple-700";

function ContentCard({
  item,
  variant,
}: {
  item: CardItem;
  variant: "project" | "post";
}) {
  const isExternal = item.link.startsWith("http");
  const Icon = variant === "project" ? Code2 : FileText;
  const visibleTags = item.tags.slice(0, 3);
  const hiddenTagCount = item.tags.length - visibleTags.length;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white ${
            variant === "project"
              ? "from-purple-500 to-indigo-500"
              : "from-sky-500 to-emerald-500"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        {item.meta && (
          <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
            {item.meta}
          </span>
        )}
      </div>

      {/* line-clamp rather than truncate: these titles wrap to two lines
          instead of being cut off mid-word with an ellipsis. */}
      <h3 className="mt-4 line-clamp-2 text-lg font-semibold leading-snug transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">
        {item.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {item.description}
      </p>

      {visibleTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
          {hiddenTagCount > 0 && (
            <span className="rounded-md px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
              +{hiddenTagCount}
            </span>
          )}
        </div>
      )}

      {/* mt-auto pins the footer to the bottom so every card in a row
          lines up regardless of description length. */}
      <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-800">
        <span className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 dark:text-purple-400">
          {variant === "project" ? "View project" : "Read post"}
          {isExternal ? (
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </span>
      </div>
    </>
  );

  // The whole card is the link target, so there is no nested anchor inside it.
  return isExternal ? (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className={CARD_CLASSES}
    >
      {body}
    </a>
  ) : (
    <Link href={item.link} className={CARD_CLASSES}>
      {body}
    </Link>
  );
}

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
  const projects: CardItem[] = [
    {
      title: "Image Classifier API",
      description:
        "A RESTful API for image classification using deep learning, deployed with Docker and FastAPI.",
      tags: ["Python", "TensorFlow", "FastAPI", "Docker"],
      link: "/projects",
    },
    {
      title: "NLP Chatbot",
      description:
        "Conversational AI chatbot for customer support, leveraging transformer models and custom intent recognition.",
      tags: ["Python", "PyTorch", "HuggingFace", "NLP"],
      link: "/projects",
    },
    {
      title: "ML Pipeline Automation",
      description:
        "Automated end-to-end ML pipeline for data preprocessing, training, and deployment using CI/CD tools.",
      tags: ["Python", "Scikit-learn", "MLflow", "GitHub Actions"],
      link: "/projects",
    },
    {
      title: "Portfolio Website",
      description:
        "Personal portfolio built with Next.js, Tailwind CSS, and deployed on Vercel.",
      tags: ["Next.js", "Tailwind CSS", "Vercel"],
      link: "/projects",
    },
    {
      title: "Data Visualization Dashboard",
      description:
        "Interactive dashboard for visualizing large datasets with D3.js and React.",
      tags: ["React", "D3.js", "TypeScript"],
      link: "/projects",
    },
  ];

  const {
    posts: mediumPosts,
    loading: blogsLoading,
    error: blogsError,
  } = useMediumPosts();

  // Six rather than three: with three cards visible there would be nothing to
  // slide, so the slider only earns its arrows once the feed has more posts.
  const blogs: CardItem[] = mediumPosts.slice(0, 6).map((post) => ({
    title: post.title,
    description: post.summary,
    tags: post.tags,
    link: post.link,
    meta: post.date,
  }));

  const projectSlider = useSliderControls(projects.length);
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
          {projects.map((project) => (
            <div
              key={project.title}
              className={`${SLIDE_WIDTH} shrink-0 snap-start`}
            >
              <ContentCard item={project} variant="project" />
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
              <div key={post.link} className={`${SLIDE_WIDTH} shrink-0 snap-start`}>
                <ContentCard item={post} variant="post" />
              </div>
            ))}
          </SliderTrack>
        )}
      </Section>
    </>
  );
}
