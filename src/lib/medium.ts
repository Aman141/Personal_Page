import { XMLParser } from "fast-xml-parser";

// Server-side Medium feed reader. Runs on the server so it hits Medium's RSS
// directly — the old client-side version had to proxy through
// api.rss2json.com purely to get around CORS, which meant posts were invisible
// to crawlers, a third-party outage blanked the section, and nothing could
// load until JS hydrated.

const MEDIUM_USERNAME = "aman-ai";
const FEED_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;

/** Medium posts change rarely; an hour of caching is plenty. */
const REVALIDATE_SECONDS = 3600;
const SUMMARY_LENGTH = 180;

export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  link: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  tags: string[];
  thumbnail?: string;
};

export type MediumFeed = {
  posts: BlogPost[];
  /** Non-null when the feed could not be read, so the UI can say so. */
  error: string | null;
};

// A single <item> or <category> parses to a bare value rather than an array,
// which is a classic source of "works with 2 tags, crashes with 1" bugs.
const parser = new XMLParser({
  ignoreAttributes: true,
  isArray: (name) => name === "item" || name === "category",
});

/**
 * next/image rejects any host absent from `images.remotePatterns`, and feed
 * bodies can embed images from anywhere, so anything off Medium's CDN is
 * dropped rather than risking a runtime error. Keep in step with
 * next.config.ts.
 */
function safeThumbnail(url: string): string | undefined {
  try {
    const { hostname, pathname } = new URL(url);
    if (!hostname.endsWith(".medium.com")) return undefined;
    // Medium appends a 1x1 view-tracking pixel to every post body.
    if (pathname.startsWith("/_/stat")) return undefined;
    return url;
  } catch {
    return undefined;
  }
}

function firstUsableImage(html: string): string | undefined {
  for (const match of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const url = safeThumbnail(match[1]);
    if (url) return url;
  }
  return undefined;
}

function decodeEntities(text: string): string {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&([a-z]+);/gi, (whole, name) => named[name.toLowerCase()] ?? whole);
}

/** The feed carries full post HTML in content:encoded and no <description>. */
function toSummary(html: string): string {
  const text = decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
  return text.length > SUMMARY_LENGTH
    ? `${text.slice(0, SUMMARY_LENGTH).trimEnd()}…`
    : text;
}

function toIsoDate(pubDate: unknown): string {
  const parsed = new Date(String(pubDate));
  return Number.isNaN(parsed.getTime())
    ? ""
    : parsed.toISOString().slice(0, 10);
}

type FeedItem = {
  title?: unknown;
  link?: unknown;
  guid?: unknown;
  pubDate?: unknown;
  category?: unknown[];
  "content:encoded"?: unknown;
};

function toPost(item: FeedItem, index: number): BlogPost | null {
  const link = String(item.link ?? "");
  const title = String(item.title ?? "").trim();
  if (!link || !title) return null;

  const content = String(item["content:encoded"] ?? "");

  return {
    id: String(item.guid ?? link ?? index),
    title,
    summary: toSummary(content),
    link,
    date: toIsoDate(item.pubDate),
    tags: (item.category ?? []).map((tag) => String(tag)),
    thumbnail: firstUsableImage(content),
  };
}

export async function getMediumPosts(): Promise<MediumFeed> {
  try {
    const response = await fetch(FEED_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return {
        posts: [],
        error: `Medium returned ${response.status} for the feed.`,
      };
    }

    const parsed = parser.parse(await response.text());
    const items: FeedItem[] = parsed?.rss?.channel?.item ?? [];

    const posts = items.map(toPost).filter((p): p is BlogPost => p !== null);
    return { posts, error: null };
  } catch (cause) {
    // Swallowed rather than thrown: a feed outage should degrade the blog
    // section, not fail the whole page render or break a production build.
    console.error("[medium] could not read feed", cause);
    return { posts: [], error: "Could not load posts from Medium." };
  }
}
