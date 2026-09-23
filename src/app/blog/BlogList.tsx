import PostRow from "@/components/PostRow";
import type { BlogPost } from "@/lib/medium";

// No "use client": posts are fetched on the server and passed in, so titles and
// summaries land in the HTML for crawlers rather than appearing after hydration.
//
// The design lists posts as text rows with no thumbnail, so `post.thumbnail` is
// no longer read here. `safeThumbnail` in lib/medium.ts still filters and
// returns it — kept because it costs nothing and the field is the only thing
// that would need re-plumbing if images come back.

export default function BlogList({
  posts,
  error,
}: {
  posts: BlogPost[];
  error: string | null;
}) {
  if (error) {
    return (
      <p className="border-t border-line py-8 text-base font-light text-ink-muted">
        {error}
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="border-t border-line py-8 text-base font-light text-ink-muted">
        No posts yet.
      </p>
    );
  }

  return (
    // The rule belongs to the container, matching the work index: rows carry
    // their own bottom rule, so the list opens on a stronger line and closes
    // itself without a trailing spacer element.
    <div className="border-t border-line">
      {posts.map((post) => (
        <PostRow key={post.id} post={post} detailed />
      ))}
    </div>
  );
}
