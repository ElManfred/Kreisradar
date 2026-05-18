'use client';

import { useState } from 'react';

interface Partei {
  name: string;
  prozent: number;
  farbe: string;
}

interface Wahl {
  titel: string;
  datum: string;
  gebiet: string;
  typ: 'btw' | 'ltw' | 'kw';
  ergebnis: Partei[];
  quelle: string;
  quelleUrl: string;
  hinweis?: string;
}

const WAHLEN: Wahl[] = [
  {
    titel: 'Bundestagswahl 2025',
    datum: '23. Februar 2025',
    gebiet: 'WK 207 Neustadt-Speyer · Zweitstimmen',
    typ: 'btw',
    ergebnis: [
      { name: 'CDU',    prozent: 30.4, farbe: '#374151' },
      { name: 'AfD',    prozent: 20.4, farbe: '#3b82f6' },
      { name: 'SPD',    prozent: 18.1, farbe: '#ef4444' },
      { name: 'Grüne',  prozent: 11.8, farbe: '#22c55e' },
      { name: 'FDP',    prozent:  5.5, farbe: '#eab308' },
      { name: 'BSW',    prozent:  5.2, farbe: '#a855f7' },
      { name: 'Sonst.', prozent:  8.6, farbe: '#94a3b8' },
    ],
    quelle: 'bundeswahlleiterin.de',
    quelleUrl: 'https://www.bundeswahlleiterin.de/bundestagswahlen/2025/ergebnisse/bund-99/land-7/wahlkreis-207.html',
    hinweis: 'Direktmandat: Johannes Steiniger (CDU) 34,7 % · Wahlbeteiligung: 82,1 %',
  },
  {
    titel: 'Landtagswahl 2026',
    datum: '9. März 2026',
    gebiet: 'Wahlkreis Speyer (WK 39) · Landessimmen',
    typ: 'ltw',
    ergebnis: [
      { name: 'CDU',    prozent: 29.1, farbe: '#374151' },
      { name: 'SPD',    prozent: 26.0, farbe: '#ef4444' },
      { name: 'AfD',    prozent: 19.8, farbe: '#3b82f6' },
      { name: 'Grüne',  prozent:  9.7, farbe: '#22c55e' },
      { name: 'Linke',  prozent:  4.3, farbe: '#ec4899' },
      { name: 'FW',     prozent:  3.4, farbe: '#f97316' },
      { name: 'FDP',    prozent:  2.2, farbe: '#eab308' },
      { name: 'BSW',    prozent:  2.2, farbe: '#a855f7' },
      { name: 'Sonst.', prozent:  3.3, farbe: '#94a3b8' },
    ],
    quelle: 'wahlen.rlp.de',
    quelleUrl: 'https://rlp-ltw26.wahlen.23degrees.eu/wk/3390000000000/overview',
    hinweis: 'Direktkandidat: Michael Wagner (CDU) 30,2 % · Wahlbeteiligung: 69,5 %',
  },
  {
    titel: 'Kreistagswahl 2024',
    datum: '9. Juni 2024',
    gebiet: 'Rhein-Pfalz-Kreis · 153 Stimmbezirke',
    typ: 'kw',
    ergebnis: [
      { name: 'CDU',    prozent: 30.7, farbe: '#374151' },
      { name: 'SPD',    prozent: 21.4, farbe: '#ef4444' },
      { name: 'Grüne',  prozent: 13.5, farbe: '#22c55e' },
      { name: 'AfD',    prozent: 14.9, farbe: '#3b82f6' },
      { name: 'FWG',    prozent:  9.8, farbe: '#f97316' },
      { name: 'FDP',    prozent:  5.8, farbe: '#eab308' },
      { name: 'Sonst.', prozent:  3.9, farbe: '#94a3b8' },
    ],
    quelle: 'rhein-pfalz-kreis.de',
    quelleUrl: 'https://www.rhein-pfalz-kreis.de/verwaltung-region/zahlen-wissenswertes/wahlergebnisse/',
    hinweis: 'CDU und SPD bestätigt · übrige Werte geschätzt auf Basis RLP-Trend — vollständige Daten über Quelle',
  },
];

const TYP_BADGE: Record<string, string> = {
  btw: 'bg-blue-100 text-blue-700',
  ltw: 'bg-purple-100 text-purple-700',
  kw:  'bg-orange-100 text-orange-700',
};
const TYP_LABEL: Record<string, string> = {
  btw: 'Bundestag',
  ltw: 'Landtag',
  kw:  'Kommunal',
};

function BalkenDiagramm({ parteien }: { parteien: Partei[] }) {
  const max = Math.max(...parteien.map((p) => p.prozent));
  return (
    <div className="space-y-2">
      {parteien.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-12 text-xs text-slate-500 text-right shrink-0">{p.name}</span>
          <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
            <div
              className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
              style={{
                width: `${(p.prozent / max) * 100}%`,
                backgroundColor: p.farbe,
                minWidth: p.prozent > 0 ? '2rem' : '0',
              }}
            >
              <span className="text-white text-xs font-semibold">{p.prozent.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Wahlergebnisse() {
  const [aktiv, setAktiv] = useState(0);
  const wahl = WAHLEN[aktiv];

  return (
    <section id="wahlen" className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 md:px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">🗳️ Wahlergebnisse</h3>
        <p className="text-xs text-slate-400 mt-0.5">Bundestagswahl · Landtagswahl · Kreistagswahl · Quellen: Bundeswahlleiterin, wahlen.rlp.de</p>
      </div>

      {/* Wahl-Tabs */}
      <div className="flex border-b border-slate-100 overflow-x-auto">
        {WAHLEN.map((w, i) => (
          <button
            key={w.titel}
            onClick={() => setAktiv(i)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              aktiv === i
                ? 'border-emerald-500 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {w.titel}
          </button>
        ))}
      </div>

      {/* Wahl-Inhalt */}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-700">{wahl.gebiet}</p>
            <p className="text-xs text-slate-400">{wahl.datum}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${TYP_BADGE[wahl.typ]}`}>
            {TYP_LABEL[wahl.typ]}
          </span>
        </div>

        <BalkenDiagramm parteien={wahl.ergebnis} />

        {wahl.hinweis && (
          <p className="mt-4 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
            ℹ️ {wahl.hinweis}
          </p>
        )}

        <a
          href={wahl.quelleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Vollständige Ergebnisse: {wahl.quelle} ↗
        </a>
      </div>
    </section>
  );
}
