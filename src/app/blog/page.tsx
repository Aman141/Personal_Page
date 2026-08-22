import type { Metadata } from "next";
import BlogList from "./BlogList";

const description =
  "Writing on machine learning, engineering, and the occasional side project.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog", description, url: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">📝 Blog</h1>
      <BlogList />
    </div>
  );
}
