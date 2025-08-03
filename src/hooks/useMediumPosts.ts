"use client";
import { useEffect, useState } from "react";

// You can change this to your Medium username
const MEDIUM_USERNAME = "aman-ai"; // e.g. "aman141kumar-ak" for https://medium.com/@aman141kumar-ak

export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  link: string;
  date: string;
  tags: string[];
  thumbnail?: string;
};

interface RSSItem {
  guid?: string;
  link?: string;
  title: string;
  description: string;
  pubDate?: string;
  categories?: string[];
  thumbnail?: string;
}

async function fetchMediumPosts(username: string): Promise<BlogPost[]> {
  // Medium doesn't have a public REST API, but you can fetch the RSS feed and parse it
  const rssUrl = `https://medium.com/feed/@${username}`;
  const res = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  );
  if (!res.ok) throw new Error("Failed to fetch Medium posts");
  const data = await res.json();

  // Map RSS items to BlogPost
  return (data.items || []).map((item: RSSItem, idx: number) => ({
    id: item.guid || item.link || idx.toString(),
    title: item.title,
    summary: item.description.replace(/<[^>]+>/g, "").slice(0, 180) + "...",
    link: item.link || "",
    date: item.pubDate ? new Date(item.pubDate).toISOString().slice(0, 10) : "",
    tags: item.categories || [],
    thumbnail: item.thumbnail,
  }));
}

export function useMediumPosts(username: string = MEDIUM_USERNAME) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchMediumPosts(username)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load blog posts from Medium.");
        setLoading(false);
      });
  }, [username]);

  return { posts, loading, error };
} 