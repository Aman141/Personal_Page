import Intro from "./components/intro";
import PopularContents from "./components/popular_contents";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Intro Section */}
      <Intro />
      <PopularContents />
    </div>
  );
}
