import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";

const staticRoutes = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/projects", priority: 0.8 },
  { path: "/blog", priority: 0.6 },
  { path: "/contact", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Detail pages are generated from the same data as the routes themselves, so
  // adding a project can never leave the sitemap out of date.
  const projectRoutes = projects.map(({ slug }) => ({
    path: `/projects/${slug}`,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes].map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
