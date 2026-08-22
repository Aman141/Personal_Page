import Intro from "./components/intro";
import PopularContents from "./components/popular_contents";
import { getMediumPosts } from "@/lib/medium";

export default async function Home() {
  // Fetched here rather than inside PopularContents: that component owns the
  // sliders and so must stay a client component, but the data it renders no
  // longer has to be client-fetched.
  const { posts, error } = await getMediumPosts();

  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Intro Section */}
      <Intro />
      <PopularContents posts={posts} postsError={error} />
    </div>
  );
}
