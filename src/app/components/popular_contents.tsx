"use client";
import { useState, useRef } from "react";

function CardSlider({ items }: { items: any[] }) {
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 3;
  const total = items.length;
  const trackRef = useRef<HTMLDivElement>(null);

  // For smooth sliding, use translateX and a fixed width per card
  const CARD_WIDTH = 320; // px, adjust as needed for your design
  const CARD_GAP = 5; // px

  // Handle wrap-around for prev/next
  const prev = () => {
    setStartIdx((prevIdx) =>
      prevIdx === 0 ? total - visibleCount : prevIdx - 1
    );
  };

  const next = () => {
    setStartIdx((prevIdx) =>
      prevIdx + visibleCount >= total ? 0 : prevIdx + 1
    );
  };

  // Prepare the cards array for seamless wrap-around
  // To avoid jump, duplicate the first (visibleCount-1) cards at the end and last (visibleCount-1) at the start
  const extendedItems = [
    ...items.slice(-visibleCount + 1),
    ...items,
    ...items.slice(0, visibleCount - 1),
  ];
  // The index in extendedItems to start the visible window
  const sliderStart = startIdx + (visibleCount - 1);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maxWidth: `${
          CARD_WIDTH * visibleCount + CARD_GAP * (visibleCount - 1)
        }px`,
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
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 flex-1">
                {item.description}
              </p>
              <span className="text-xs text-purple-600 dark:text-purple-400">
                {item.tech}
              </span>
            </div>
          </div>
        ))}
      </div>
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
    </div>
  );
}

export default function PopularContents() {
  const projects = [
    {
      title: "Image Classifier API",
      description:
        "A RESTful API for image classification using deep learning, deployed with Docker and FastAPI.",
      tech: "Python, TensorFlow, FastAPI, Docker",
    },
    {
      title: "NLP Chatbot",
      description:
        "Conversational AI chatbot for customer support, leveraging transformer models and custom intent recognition.",
      tech: "Python, PyTorch, HuggingFace, NLP",
    },
    {
      title: "ML Pipeline Automation",
      description:
        "Automated end-to-end ML pipeline for data preprocessing, training, and deployment using CI/CD tools.",
      tech: "Python, Scikit-learn, MLflow, GitHub Actions",
    },
    {
      title: "Portfolio Website",
      description:
        "Personal portfolio built with Next.js, Tailwind CSS, and deployed on Vercel.",
      tech: "Next.js, Tailwind CSS, Vercel",
    },
    {
      title: "Data Visualization Dashboard",
      description:
        "Interactive dashboard for visualizing large datasets with D3.js and React.",
      tech: "React, D3.js, TypeScript",
    },
  ];

  const blogs = [
    {
      title: "Getting Started with Next.js",
      description: "A beginner's guide to building fast web apps with Next.js.",
      tech: "Next.js, React, Beginner",
    },
    {
      title: "TypeScript Tips for React Developers",
      description:
        "Level up your React codebase with these TypeScript best practices.",
      tech: "TypeScript, React, Tips",
    },
    {
      title: "Styling with Tailwind CSS",
      description: "How to use Tailwind CSS for rapid UI development.",
      tech: "Tailwind CSS, Styling, Frontend",
    },
    {
      title: "Deploying FastAPI Apps",
      description: "A step-by-step guide to deploying FastAPI applications.",
      tech: "FastAPI, Python, Deployment",
    },
    {
      title: "CI/CD for Machine Learning",
      description: "Automate your ML workflow with GitHub Actions and MLflow.",
      tech: "MLflow, GitHub Actions, MLOps",
    },
  ];

  return (
    <>
      <section className="px-6 sm:px-12 py-16">
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
      <section className="px-6 sm:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Blogs
          </h2>
          <div className="relative">
            <CardSlider items={blogs} />
          </div>
          <div className="text-center mt-8">
            <a
              href="/blogs"
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
