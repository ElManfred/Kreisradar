'use client';

import { useEffect, useState } from 'react';

interface NewsItem {
  title: string;
  link: string;
  date: string;
}

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat('de-DE', {
      day: 'numeric', month: 'short', year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return '';
  }
}

export default function NachrichtenFeed({ typ }: { typ: 'kreis' | 'kreisfrei' }) {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then((r) => r.json())
      .then((data) => {
        setItems(typ === 'kreisfrei' ? data.speyer : data.kreis);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [typ]);

  const quelle = typ === 'kreisfrei'
    ? { label: 'mrn-news.de/speyer', url: 'https://www.mrn-news.de/tag/speyer/' }
    : { label: 'mrn-news.de/rhein-pfalz-kreis', url: 'https://www.mrn-news.de/tag/rhein-pfalz-kreis/' };

  return (
    <div className="px-4 md:px-6 py-4 border-t border-slate-100">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
        Aktuelle Meldungen
      </p>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!loading && (!items || items.length === 0) && (
        <p className="text-sm text-slate-500">Keine aktuellen Meldungen verfügbar.</p>
      )}

      {!loading && items && items.length > 0 && (
        <>
          <div className="divide-y divide-slate-100">
            {items.slice(0, 5).map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 py-2.5 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors group"
              >
                <span className="text-sm text-slate-700 group-hover:text-emerald-700 transition-colors leading-snug flex-1">
                  {item.title}
                </span>
                <span className="text-xs text-slate-400 shrink-0 mt-0.5 whitespace-nowrap">
                  {formatDate(item.date)}
                </span>
              </a>
            ))}
          </div>
          <a
            href={quelle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Alle Meldungen: {quelle.label} ↗
          </a>
        </>
      )}
    </div>
  );
}
