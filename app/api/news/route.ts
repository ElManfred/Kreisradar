import Parser from 'rss-parser';

export const revalidate = 86400;

const parser = new Parser({ timeout: 10000 });

const FEEDS = {
  kreis:  'https://www.mrn-news.de/tag/rhein-pfalz-kreis/feed/',
  speyer: 'https://www.mrn-news.de/tag/speyer/feed/',
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
