"use client";
import { useState, useRef } from "react";
import { useMediumPosts } from "../../hooks/useMediumPosts";

interface CardItem {
  title: string;
  description: string;
  tech: string;
  link: string;
}

function CardSlider({ items }: { items: CardItem[] }) {
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 3;
  const total = items.length;
  const trackRef = useRef<HTMLDivElement>(null);

  // For smooth sliding, use translateX and a fixed width per card
  const CARD_WIDTH = 320; // px, adjust as needed for your design
  const CARD_GAP = 5; // px

  // If we have fewer items than visible count, don't use slider functionality
  const shouldUseSlider = total > visibleCount;

  // Handle wrap-around for prev/next
  const prev = () => {
    if (!shouldUseSlider) return;
    setStartIdx((prevIdx) =>
      prevIdx === 0 ? total - visibleCount : prevIdx - 1
    );
  };

  const next = () => {
    if (!shouldUseSlider) return;
    setStartIdx((prevIdx) =>
      prevIdx + visibleCount >= total ? 0 : prevIdx + 1
    );
  };

  // Prepare the cards array for seamless wrap-around
  // To avoid jump, duplicate the first (visibleCount-1) cards at the end and last (visibleCount-1) at the start
  const extendedItems = shouldUseSlider
    ? [
        ...items.slice(-visibleCount + 1),
        ...items,
        ...items.slice(0, visibleCount - 1),
      ]
    : items;
  // The index in extendedItems to start the visible window
  const sliderStart = shouldUseSlider ? startIdx + (visibleCount - 1) : 0;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maxWidth:
          total === 1
            ? `${CARD_WIDTH}px`
            : `${CARD_WIDTH * visibleCount + CARD_GAP * (visibleCount - 1)}px`,
        margin: "0 auto",
      }}
    >
      <div
        ref={trackRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          width: `${
            extendedItems.length * CARD_WIDTH +
            (extendedItems.length - 1) * CARD_GAP
          }px`,
          transform: `translateX(-${sliderStart * (CARD_WIDTH + CARD_GAP)}px)`,
          gap: `${CARD_GAP}px`,
        }}
      >
        {extendedItems.map((item, idx) => (
          <div
            key={item.title + idx}
            className="flex-shrink-0"
            style={{ width: `${CARD_WIDTH}px` }}
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                {/* Left section - Visual element */}
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-400 to-yellow-400 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>

                {/* Right section - Text content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200 truncate">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded">
                      {item.tech}
                    </span>
                    {item.link && (
                      <a
                        href={item.link}
                        className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors"
                      >
                        View
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {shouldUseSlider && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 shadow transition z-10"
            style={{ transform: "translateY(-50%)" }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 shadow transition z-10"
            style={{ transform: "translateY(-50%)" }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

export default function PopularContents() {
  const projects: CardItem[] = [
    {
      title: "Image Classifier API",
      description:
        "A RESTful API for image classification using deep learning, deployed with Docker and FastAPI.",
      tech: "Python, TensorFlow, FastAPI, Docker",
      link: "/projects/image-classifier-api",
    },
    {
      title: "NLP Chatbot",
      description:
        "Conversational AI chatbot for customer support, leveraging transformer models and custom intent recognition.",
      tech: "Python, PyTorch, HuggingFace, NLP",
      link: "/projects/nlp-chatbot",
    },
    {
      title: "ML Pipeline Automation",
      description:
        "Automated end-to-end ML pipeline for data preprocessing, training, and deployment using CI/CD tools.",
      tech: "Python, Scikit-learn, MLflow, GitHub Actions",
      link: "/projects/ml-pipeline-automation",
    },
    {
      title: "Portfolio Website",
      description:
        "Personal portfolio built with Next.js, Tailwind CSS, and deployed on Vercel.",
      tech: "Next.js, Tailwind CSS, Vercel",
      link: "/projects/portfolio-website",
    },
    {
      title: "Data Visualization Dashboard",
      description:
        "Interactive dashboard for visualizing large datasets with D3.js and React.",
      tech: "React, D3.js, TypeScript",
      link: "/projects/data-visualization-dashboard",
    },
  ];

  const {
    posts: mediumPosts,
    loading: blogsLoading,
    error: blogsError,
  } = useMediumPosts("aman-ai");

  if (blogsLoading) {
    return <div>Loading...</div>;
  }

  if (blogsError) {
    return <div>Error: {blogsError}</div>;
  }

  const blogs: CardItem[] = mediumPosts.slice(0, 3).map((post) => ({
    title: post.title,
    description: post.summary,
    link: post.link,
    tech: post.tags.join(", "),
  }));

  return (
    <>
      <section className="flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Projects
          </h2>
          <div className="relative">
            <CardSlider items={projects} />
          </div>
          <div className="text-center mt-8">
            <a
              href="/projects"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline"
            >
              See all projects
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
      <section className="flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Blog</h2>
          <div className="relative">
            <CardSlider items={blogs} />
          </div>
          <div className="text-center mt-8">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline"
            >
              See all blogs
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
