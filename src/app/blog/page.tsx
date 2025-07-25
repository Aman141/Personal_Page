"use client";
import { useState } from "react";

type BlogPost = {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  tags: string[];
};

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    summary: "A beginner's guide to building fast web apps with Next.js.",
    content: `
      <h2 class="text-2xl font-bold mb-4">Getting Started with Next.js</h2>
      <p class="mb-3">Next.js is a powerful React framework for building server-rendered and statically generated web applications. In this post, we'll cover the basics to get you up and running.</p>
      <ul class="list-disc list-inside mb-3">
        <li>Project setup</li>
        <li>Pages and routing</li>
        <li>Styling with Tailwind CSS</li>
      </ul>
      <p>Ready to build something awesome? 🚀</p>
    `,
    date: "2024-06-01",
    tags: ["Next.js", "React", "Beginner"],
  },
  {
    id: 2,
    title: "TypeScript Tips for React Developers",
    summary:
      "Level up your React codebase with these TypeScript best practices.",
    content: `
      <h2 class="text-2xl font-bold mb-4">TypeScript Tips for React Developers</h2>
      <p class="mb-3">TypeScript can make your React apps more robust and maintainable. Here are some tips to get the most out of it:</p>
      <ol class="list-decimal list-inside mb-3">
        <li>Use strict types for props and state</li>
        <li>Leverage utility types like <code>Partial</code> and <code>Pick</code></li>
        <li>Type your event handlers</li>
      </ol>
      <p>Happy typing! 🎉</p>
    `,
    date: "2024-05-20",
    tags: ["TypeScript", "React", "Tips"],
  },
  {
    id: 3,
    title: "Styling with Tailwind CSS",
    summary: "How to use Tailwind CSS for rapid UI development.",
    content: `
      <h2 class="text-2xl font-bold mb-4">Styling with Tailwind CSS</h2>
      <p class="mb-3">Tailwind CSS lets you build beautiful UIs quickly with utility classes. In this post, we'll look at:</p>
      <ul class="list-disc list-inside mb-3">
        <li>Setting up Tailwind in your project</li>
        <li>Responsive design with ease</li>
        <li>Dark mode support</li>
      </ul>
      <p>Design faster, code less! 🎨</p>
    `,
    date: "2024-05-10",
    tags: ["Tailwind CSS", "Styling", "Frontend"],
  },
];

function BlogCard({ post, onClick }: { post: BlogPost; onClick: () => void }) {
  return (
    <div
      className="cursor-pointer border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800 shadow hover:shadow-lg transition mb-6"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      role="button"
      aria-label={`Read blog post: ${post.title}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <span className="text-xs text-gray-500">{post.date}</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-2">{post.summary}</p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function BlogModal({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full p-8 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:hover:text-white text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [openPost, setOpenPost] = useState<BlogPost | null>(null);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">📝 Blog</h1>
      <div>
        {blogPosts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            onClick={() => setOpenPost(post)}
          />
        ))}
      </div>
      {openPost && (
        <BlogModal post={openPost} onClose={() => setOpenPost(null)} />
      )}
    </main>
  );
}
