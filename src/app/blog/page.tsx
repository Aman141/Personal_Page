"use client";
import { useMediumPosts, BlogPost } from "../../hooks/useMediumPosts";

const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block cursor-pointer border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800 shadow hover:shadow-lg transition mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
      tabIndex={0}
      aria-label={`Read blog post: ${post.title}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <span className="text-xs text-gray-500">{post.date}</span>
      </div>
      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt=""
          className="w-full h-48 object-cover rounded mb-2"
          loading="lazy"
        />
      )}
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
    </a>
  );
};

export default function BlogPage() {
  const { posts, loading, error } = useMediumPosts();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">📝 Blog</h1>
      {loading && (
        <div className="text-center text-gray-500">Loading posts...</div>
      )}
      {error && <div className="text-center text-red-500">{error}</div>}
      <div>
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      {!loading && posts.length === 0 && !error && (
        <div className="text-center text-gray-500">No blog posts found.</div>
      )}
    </main>
  );
}
