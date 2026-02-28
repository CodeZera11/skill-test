import { RSS_FEED_CONFIG } from "@/constants/rss";
import { RssNewsItem } from "@/types/rss";

const XML_ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

const escapeTagForRegex = (tag: string) => tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const decodeXmlEntities = (value: string) =>
  value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity.startsWith("#x")) {
      const codePoint = Number.parseInt(entity.slice(2), 16);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    if (entity.startsWith("#")) {
      const codePoint = Number.parseInt(entity.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    return XML_ENTITY_MAP[entity] ?? match;
  });

const stripCdata = (value: string) => value.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i, "$1").trim();

const extractTagValue = (xml: string, tagName: string) => {
  const safeTag = escapeTagForRegex(tagName);
  const regex = new RegExp(`<${safeTag}[^>]*>([\\s\\S]*?)</${safeTag}>`, "i");
  const match = xml.match(regex);

  if (!match?.[1]) return "";
  return decodeXmlEntities(stripCdata(match[1]));
};

const createStableId = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `rss-${Math.abs(hash)}`;
};

export const parseRssItems = (xml: string, limit: number): RssNewsItem[] => {
  const itemBlocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  const items: RssNewsItem[] = [];

  for (const block of itemBlocks) {
    if (items.length >= limit) break;

    const title = extractTagValue(block, "title");
    const link = extractTagValue(block, "link");
    const description =
      extractTagValue(block, "description") || extractTagValue(block, "content:encoded");
    const pubDate = extractTagValue(block, "pubDate");
    const guid = extractTagValue(block, "guid");

    const publishedAt = pubDate ? new Date(pubDate).getTime() : undefined;

    if (!title || !link) continue;

    items.push({
      id: createStableId(guid || link || title),
      title,
      description,
      link,
      publishedAt: Number.isNaN(publishedAt) ? undefined : publishedAt,
    });
  }

  return items;
};

export const fetchRssNews = async ({
  limit = RSS_FEED_CONFIG.newsPageLimit,
}: {
  limit?: number;
} = {}): Promise<RssNewsItem[]> => {
  const feedUrls = RSS_FEED_CONFIG.urls.filter(Boolean);
  if (feedUrls.length === 0) return [];

  const feedResults = await Promise.all(
    feedUrls.map(async (url) => {
      try {
        const response = await fetch(url, {
          next: { revalidate: RSS_FEED_CONFIG.revalidateSeconds },
        });

        if (!response.ok) {
          return [] as RssNewsItem[];
        }

        const xml = await response.text();
        return parseRssItems(xml, limit);
      } catch {
        return [] as RssNewsItem[];
      }
    })
  );

  const deduped = new Map<string, RssNewsItem>();
  for (const items of feedResults) {
    for (const item of items) {
      const dedupeKey = item.link.trim().toLowerCase() || item.id;
      if (!deduped.has(dedupeKey)) {
        deduped.set(dedupeKey, item);
      }
    }
  }

  return Array.from(deduped.values())
    .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
    .slice(0, limit);
};
