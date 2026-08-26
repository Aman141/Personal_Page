import Hero from "./components/hero";
import NowStrip from "./components/now_strip";
import FeaturedWork from "./components/featured_work";
import WritingPreview from "./components/writing_preview";
import { getMediumPosts } from "@/lib/medium";

export default async function Home() {
  // Fetched here rather than inside the section that renders it: Hero has to
  // be a client component for the persona carousel, but the feed stays on the
  // server so posts land in the HTML for crawlers.
  const { posts, error } = await getMediumPosts();

  return (
    <div>
      <Hero />
      <NowStrip />
      <FeaturedWork />
      <WritingPreview posts={posts} error={error} />
    </div>
  );
}
