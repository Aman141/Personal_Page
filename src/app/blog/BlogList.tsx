import ContentCard from "@/components/ContentCard";
import type { BlogPost } from "@/lib/medium";

// No "use client": posts are fetched on the server and passed in, so titles and
// summaries land in the HTML for crawlers rather than appearing after hydration.

/** Single column at max-w-3xl, so the card fills the container on wide screens. */
const IMAGE_SIZES = "(max-width: 768px) 100vw, 768px";

export default function BlogList({
  posts,
  error,
}: {
  posts: BlogPost[];
  error: string | null;
}) {
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center text-gray-500">No blog posts found.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <ContentCard
          key={post.id}
          item={{
            title: post.title,
            description: post.summary,
            tags: post.tags,
            meta: post.date,
          }}
          variant="post"
          href={post.link}
          image={
            post.thumbnail
              ? { src: post.thumbnail, sizes: IMAGE_SIZES }
              : undefined
          }
        />
      ))}
    </div>
  );
}
