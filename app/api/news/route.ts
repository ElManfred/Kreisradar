import Parser from 'rss-parser';
import gebiet07338 from '@/data/gebiete/07338000.json';
import gebiet07318 from '@/data/gebiete/07318000.json';

export const revalidate = 86400;

const parser = new Parser({ timeout: 10000 });

const FEEDS = {
  kreis:  gebiet07338.newsfeeds[0].url,
  speyer: gebiet07318.newsfeeds[0].url,
};

async function fetchFeed(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 86400, tags: ['news'] } });
    if (!res.ok) return [];
    const xml = await res.text();
    const feed = await parser.parseString(xml);
    return feed.items.slice(0, 8).map((item) => ({
      title: item.title ?? '',
      link:  item.link  ?? '',
      date:  item.pubDate ?? '',
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  const [kreis, speyer] = await Promise.all([
    fetchFeed(FEEDS.kreis),
    fetchFeed(FEEDS.speyer),
  ]);
  return Response.json({ kreis, speyer });
}
