import { RSS_FEED_CONFIG } from "@/constants/rss";
import { fetchRssNews, fetchRssTickerNews } from "@/lib/rss";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawLimit = Number.parseInt(searchParams.get("limit") ?? "", 10);
  const hasLimitParam = searchParams.has("limit");
  const rawPerFeedLimit = Number.parseInt(searchParams.get("perFeedLimit") ?? "", 10);
  const perFeedLimit =
    Number.isFinite(rawPerFeedLimit) && rawPerFeedLimit > 0 ? rawPerFeedLimit : undefined;
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? rawLimit
      : RSS_FEED_CONFIG.newsPageLimit;

  try {
    const items = perFeedLimit
      ? await fetchRssTickerNews({ perFeedLimit, limit: hasLimitParam ? limit : undefined })
      : await fetchRssNews({ limit });
    return NextResponse.json({ items });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load RSS feed";
    return NextResponse.json({ items: [], error: message }, { status: 500 });
  }
}
