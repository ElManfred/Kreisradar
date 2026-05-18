'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const KreisRadarMap = dynamic(() => import('./components/KreisRadarMap'), { ssr: false });

const PLZ_DATA: Record<string, { ort: string; vg: string; lat: number; lng: number }> = {
  '67227': { ort: 'Frankenthal', vg: 'Frankenthal', lat: 49.533, lng: 8.354 },
  '67229': { ort: 'Frankenthal', vg: 'Frankenthal', lat: 49.533, lng: 8.354 },
  '67067': { ort: 'Ludwigshafen', vg: 'Ludwigshafen', lat: 49.477, lng: 8.445 },
  '67373': { ort: 'Dudenhofen', vg: 'Römerberg-Dudenhofen', lat: 49.367, lng: 8.432 },
  '67354': { ort: 'Römerberg', vg: 'Römerberg-Dudenhofen', lat: 49.35, lng: 8.4 },
  '67346': { ort: 'Speyer', vg: 'Speyer', lat: 49.317, lng: 8.431 },
  '67435': { ort: 'Neustadt a.d.W.', vg: 'Neustadt', lat: 49.352, lng: 8.139 },
  '67122': { ort: 'Altrip', vg: 'Rheinauen', lat: 49.435, lng: 8.499 },
  '67125': { ort: 'Dannstadt-Schauernheim', vg: 'Dannstadt-Schauernheim', lat: 49.433, lng: 8.318 },
  '67240': { ort: 'Bobenheim-Roxheim', vg: 'Maxdorf', lat: 49.566, lng: 8.35 },
  '67133': { ort: 'Maxdorf', vg: 'Maxdorf', lat: 49.517, lng: 8.274 },
  '67112': { ort: 'Mutterstadt', vg: 'Mutterstadt', lat: 49.435, lng: 8.357 },
};

const ABGEORDNETE = [
  {
    name: 'Isabel Mackensen-Geis',
    partei: 'SPD',
    ebene: 'Bundestag',
    wahlkreis: 'Ludwigshafen/Frankenthal',
    farbe: 'bg-red-50 border-red-200',
    textfarbe: 'text-red-900',
    parteifarbe: 'bg-red-500',
  },
  {
    name: 'Torbjörn Kartes',
    partei: 'CDU',
    ebene: 'Bundestag',
    wahlkreis: 'Ludwigshafen/Frankenthal',
    farbe: 'bg-slate-50 border-slate-200',
    textfarbe: 'text-slate-900',
    parteifarbe: 'bg-slate-700',
  },
  {
    name: 'Michael Frisch',
    partei: 'AfD',
    ebene: 'Bundestag',
    wahlkreis: 'Neustadt/Speyer',
    farbe: 'bg-blue-50 border-blue-200',
    textfarbe: 'text-blue-900',
    parteifarbe: 'bg-blue-600',
  },
  {
    name: 'Lea Heidbreder',
    partei: 'SPD',
    ebene: 'Landtag RLP',
    wahlkreis: 'Rhein-Pfalz-Kreis I',
    farbe: 'bg-red-50 border-red-200',
    textfarbe: 'text-red-900',
    parteifarbe: 'bg-red-500',
  },
];

const COCKPIT_MODULE = [
  { icon: '📋', titel: 'Amtsblätter', beschreibung: 'Aktuelle Bekanntmachungen & Ausschreibungen', tag: 'Neu', tagFarbe: 'bg-emerald-100 text-emerald-700' },
  { icon: '🏛️', titel: 'Meine Abgeordneten', beschreibung: 'Bund & Land · Abstimmungsverhalten', tag: '', tagFarbe: '' },
  { icon: '🗳️', titel: 'Wahlergebnisse', beschreibung: 'Kommunal bis Ortsgemeindeebene', tag: '', tagFarbe: '' },
  { icon: '📊', titel: 'Statistik', beschreibung: 'Bevölkerung · Wirtschaft · Trends', tag: '', tagFarbe: '' },
  { icon: '💰', titel: 'Rechnungshof', beschreibung: 'Kommunalbericht · Prüfungsbefunde', tag: 'Neu', tagFarbe: 'bg-emerald-100 text-emerald-700' },
  { icon: '📰', titel: 'Nachrichten', beschreibung: 'Regional · SWR · RPR1 · mrn-news', tag: '', tagFarbe: '' },
  { icon: '📲', titel: 'WhatsApp-Kanal', beschreibung: 'Meldungen direkt aufs Handy', tag: 'Bald', tagFarbe: 'bg-amber-100 text-amber-700' },
  { icon: '🤖', titel: 'KI-Assistent', beschreibung: 'Direkt in öffentliche Dokumente fragen', tag: 'Phase 2', tagFarbe: 'bg-slate-100 text-slate-500' },
];

type OrtData = { ort: string; vg: string; lat: number; lng: number };

export default function Home() {
  const [suche, setSuche] = useState('');
  const [ergebnis, setErgebnis] = useState<OrtData | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [cockpitOffen, setCockpitOffen] = useState(false);
  const [fehler, setFehler] = useState('');

  function handleSuche(wert?: string) {
    const eingabe = (wert ?? suche).trim().split(' ')[0];
    setFehler('');

    const plzMatch = PLZ_DATA[eingabe];
    if (plzMatch) {
      setErgebnis(plzMatch);
      setFlyTo([plzMatch.lat, plzMatch.lng]);
      setCockpitOffen(true);
      return;
    }
    const ortMatch = Object.values(PLZ_DATA).find(
      (d) => d.ort.toLowerCase() === eingabe.toLowerCase()
    );
    if (ortMatch) {
      setErgebnis(ortMatch);
      setFlyTo([ortMatch.lat, ortMatch.lng]);
      setCockpitOffen(true);
      return;
    }
    setFehler('Ort oder PLZ nicht gefunden. Versuche z.B. „67373" oder „Dudenhofen".');
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📡</span>
          <div>
            <h1 className="text-xl font-bold leading-none">KreisRadar</h1>
            <p className="text-slate-400 text-xs">Rhein-Pfalz-Kreis</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-slate-300">
          <a href="#karte" className="hover:text-white transition">Karte</a>
          <a href="#abgeordnete" className="hover:text-white transition">Abgeordnete</a>
          <a href="#" className="hover:text-white transition">Über uns</a>
        </nav>
        <span className="text-xs bg-emerald-600 px-3 py-1 rounded-full font-medium">Kostenlos & öffentlich</span>
      </header>

      {/* Hero */}
      <section className="bg-slate-900 text-white px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Dein Kreis. Transparent.
        </h2>
        <p className="text-slate-300 mb-8 max-w-xl mx-auto text-base leading-relaxed">
          Alle öffentlichen Informationen für deinen Ort — Amtsblätter, Abgeordnete,
          Wahlergebnisse und mehr. Einfach PLZ oder Ort eingeben.
        </p>

        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSuche()}
            placeholder="PLZ oder Ortsname … z.B. 67373"
            className="flex-1 px-4 py-3 rounded-lg text-slate-900 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            onClick={() => handleSuche()}
            className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 px-5 py-3 rounded-lg font-semibold text-sm transition"
          >
            Suchen
          </button>
        </div>

        {fehler && <p className="text-red-400 text-sm mt-3">{fehler}</p>}

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {['67373 Dudenhofen', '67354 Römerberg', '67346 Speyer', '67227 Frankenthal'].map((s) => (
            <button
              key={s}
              onClick={() => { setSuche(s); handleSuche(s); }}
              className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-full transition"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Karte */}
        <section id="karte" className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">🗺️ Rhein-Pfalz-Kreis</h3>
            <span className="text-xs text-slate-400">OpenStreetMap · Klicke auf einen Ort oder nutze die Suche oben</span>
          </div>
          <div className="h-80">
            <KreisRadarMap flyTo={flyTo} />
          </div>
        </section>

        {/* Bürger-Cockpit */}
        {cockpitOffen && ergebnis && (
          <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">📍 Bürger-Cockpit: {ergebnis.ort}</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Verbandsgemeinde {ergebnis.vg} · Rhein-Pfalz-Kreis · Rheinland-Pfalz
                </p>
              </div>
              <button
                onClick={() => setCockpitOffen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Informationshierarchie */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
              <p className="text-xs text-slate-500 mb-2 font-medium">Verwaltungsebenen:</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">🇩🇪 Bundestag</span>
                <span className="text-slate-300">›</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md">🏛️ Landtag RLP</span>
                <span className="text-slate-300">›</span>
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md">🏢 Rhein-Pfalz-Kreis</span>
                <span className="text-slate-300">›</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">🏘️ VG {ergebnis.vg}</span>
                <span className="text-slate-300">›</span>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-semibold">📍 {ergebnis.ort}</span>
              </div>
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
              {COCKPIT_MODULE.map((m) => (
                <div
                  key={m.titel}
                  className="border border-slate-200 rounded-xl p-4 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="text-2xl mb-2">{m.icon}</div>
                  <div className="font-semibold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors">{m.titel}</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">{m.beschreibung}</div>
                  {m.tag && (
                    <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${m.tagFarbe}`}>
                      {m.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Abgeordnete */}
        <section id="abgeordnete" className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">🏛️ Abgeordnete im Rhein-Pfalz-Kreis</h3>
            <p className="text-xs text-slate-400 mt-0.5">Bundestag & Landtag RLP · Quellen: bundestag.de · landtag.rlp.de · abgeordnetenwatch.de</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {ABGEORDNETE.map((a) => (
              <div key={a.name} className={`border rounded-xl p-4 ${a.farbe}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className={`font-semibold text-sm ${a.textfarbe}`}>{a.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{a.wahlkreis}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-white text-xs px-2 py-0.5 rounded-full ${a.parteifarbe}`}>{a.partei}</span>
                    <span className="text-xs text-slate-400">{a.ebene}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs bg-white/80 hover:bg-white border border-slate-200 px-3 py-1 rounded-lg transition">
                    Profil →
                  </button>
                  <button className="text-xs bg-white/80 hover:bg-white border border-slate-200 px-3 py-1 rounded-lg transition">
                    Abstimmungen →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Medien-Lücken-Banner */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 items-start">
          <span className="text-2xl shrink-0">📰</span>
          <div>
            <h4 className="font-semibold text-amber-900">Lokale Medien-Lücke — KreisRadar als Antwort</h4>
            <p className="text-sm text-amber-700 mt-1 leading-relaxed">
              RNF (Rhein-Neckar Fernsehen) hat im Dezember 2025 Insolvenz angemeldet.
              Die Rheinpfalz ist hinter der Paywall. KreisRadar bündelt öffentlich zugängliche
              Informationen — kostenlos, transparent und für alle Bürgerinnen und Bürger.
            </p>
          </div>
        </section>

      </main>

      <footer className="bg-slate-900 text-slate-400 text-center text-xs py-8 mt-12 space-y-1">
        <p>KreisRadar Rhein-Pfalz · Alle Daten aus öffentlichen Quellen · Kein kommerzieller Betrieb</p>
        <p>Karte: © <a href="https://www.openstreetmap.org/copyright" className="underline hover:text-slate-200">OpenStreetMap</a> Contributors · Konzept: Mai 2026</p>
      </footer>

    </div>
  );
}
