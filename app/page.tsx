'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Wahlergebnisse from './components/Wahlergebnisse';

const KreisRadarMap = dynamic(() => import('./components/KreisRadarMap'), { ssr: false });

type OrtTyp = 'kreis' | 'kreisfrei';

interface OrtData {
  ort: string;
  vg: string | null;
  typ: OrtTyp;
  lat: number;
  lng: number;
}

// Alle Orte im Rhein-Pfalz-Kreis + Speyer als kreisfreie Stadt
const PLZ_DATA: Record<string, OrtData> = {
  // Verbandsfreie Stadt
  '67105': { ort: 'Schifferstadt',          vg: null,                    typ: 'kreis',    lat: 49.382, lng: 8.373 },

  // Verbandsfreie Gemeinden
  '67122': { ort: 'Altrip',                 vg: null,                    typ: 'kreis',    lat: 49.441, lng: 8.502 },
  '67240': { ort: 'Bobenheim-Roxheim',      vg: null,                    typ: 'kreis',    lat: 49.570, lng: 8.349 },
  '67459': { ort: 'Böhl-Iggelheim',         vg: null,                    typ: 'kreis',    lat: 49.393, lng: 8.310 },
  '67245': { ort: 'Lambsheim',              vg: null,                    typ: 'kreis',    lat: 49.530, lng: 8.287 },
  '67117': { ort: 'Limburgerhof',           vg: null,                    typ: 'kreis',    lat: 49.413, lng: 8.383 },
  '67112': { ort: 'Mutterstadt',            vg: null,                    typ: 'kreis',    lat: 49.438, lng: 8.356 },
  '67141': { ort: 'Neuhofen',               vg: null,                    typ: 'kreis',    lat: 49.422, lng: 8.461 },

  // VG Dannstadt-Schauernheim
  '67125': { ort: 'Dannstadt-Schauernheim', vg: 'Dannstadt-Schauernheim', typ: 'kreis',   lat: 49.431, lng: 8.317 },
  '67126': { ort: 'Hochdorf-Assenheim',     vg: 'Dannstadt-Schauernheim', typ: 'kreis',   lat: 49.451, lng: 8.299 },
  '67127': { ort: 'Rödersheim-Gronau',      vg: 'Dannstadt-Schauernheim', typ: 'kreis',   lat: 49.442, lng: 8.277 },

  // VG Lambsheim-Heßheim
  '67259': { ort: 'Heßheim / Beindersheim', vg: 'Lambsheim-Heßheim',     typ: 'kreis',   lat: 49.551, lng: 8.311 },
  '67258': { ort: 'Heßheim',                vg: 'Lambsheim-Heßheim',     typ: 'kreis',   lat: 49.552, lng: 8.272 },

  // VG Maxdorf
  '67133': { ort: 'Maxdorf',                vg: 'Maxdorf',               typ: 'kreis',   lat: 49.516, lng: 8.274 },
  '67134': { ort: 'Birkenheide',            vg: 'Maxdorf',               typ: 'kreis',   lat: 49.519, lng: 8.253 },
  '67136': { ort: 'Fußgönheim',             vg: 'Maxdorf',               typ: 'kreis',   lat: 49.474, lng: 8.268 },

  // VG Rheinauen
  '67166': { ort: 'Otterstadt',             vg: 'Rheinauen',             typ: 'kreis',   lat: 49.362, lng: 8.453 },
  '67165': { ort: 'Waldsee',                vg: 'Rheinauen',             typ: 'kreis',   lat: 49.362, lng: 8.460 },

  // VG Römerberg-Dudenhofen
  '67354': { ort: 'Römerberg',              vg: 'Römerberg-Dudenhofen',  typ: 'kreis',   lat: 49.351, lng: 8.396 },
  '67373': { ort: 'Dudenhofen',             vg: 'Römerberg-Dudenhofen',  typ: 'kreis',   lat: 49.367, lng: 8.432 },
  '67374': { ort: 'Hanhofen',               vg: 'Römerberg-Dudenhofen',  typ: 'kreis',   lat: 49.389, lng: 8.438 },
  '67376': { ort: 'Harthausen',             vg: 'Römerberg-Dudenhofen',  typ: 'kreis',   lat: 49.373, lng: 8.460 },

  // Speyer — kreisfreie Stadt (eigene Informationsbasis)
  '67346': { ort: 'Speyer',                 vg: null,                    typ: 'kreisfrei', lat: 49.318, lng: 8.431 },
  '67347': { ort: 'Speyer',                 vg: null,                    typ: 'kreisfrei', lat: 49.318, lng: 8.431 },
};

// Ortsname → PLZ-Lookup
const ORT_INDEX: Record<string, string> = {};
Object.entries(PLZ_DATA).forEach(([plz, d]) => {
  const key = d.ort.toLowerCase();
  if (!ORT_INDEX[key]) ORT_INDEX[key] = plz;
});

const ABGEORDNETE = [
  {
    name: 'Prof. Dr. Armin Grau', partei: 'Grüne', ebene: 'Bundestag',
    wahlkreis: 'WK 206 Ludwigshafen/Frankenthal · über Landesliste',
    parteifarbe: 'bg-green-600', farbe: 'bg-green-50 border-green-200', textfarbe: 'text-green-900',
    profilUrl: 'https://www.abgeordnetenwatch.de/profile/armin-grau',
    awUrl: 'https://www.abgeordnetenwatch.de/profile/armin-grau/abstimmungen',
  },
  {
    name: 'Johannes Steiniger', partei: 'CDU', ebene: 'Bundestag',
    wahlkreis: 'WK 207 Neustadt-Speyer · Direktmandat (34,7 %)',
    parteifarbe: 'bg-slate-700', farbe: 'bg-slate-50 border-slate-200', textfarbe: 'text-slate-900',
    profilUrl: 'https://www.abgeordnetenwatch.de/profile/johannes-steiniger',
    awUrl: 'https://www.abgeordnetenwatch.de/profile/johannes-steiniger/abstimmungen',
  },
  {
    name: 'Isabel Mackensen-Geis', partei: 'SPD', ebene: 'Bundestag',
    wahlkreis: 'WK 207 Neustadt-Speyer · über Landesliste',
    parteifarbe: 'bg-red-500', farbe: 'bg-red-50 border-red-200', textfarbe: 'text-red-900',
    profilUrl: 'https://www.bundestag.de/abgeordnete/biografien/M/mackensen_geis_isabel-1045928',
    awUrl: 'https://www.abgeordnetenwatch.de/profile/isabel-mackensen-geis',
  },
  {
    name: 'Landtag RLP', partei: 'RLP', ebene: 'Landtag RLP',
    wahlkreis: 'Rhein-Pfalz-Kreis · alle Abgeordneten',
    parteifarbe: 'bg-purple-600', farbe: 'bg-purple-50 border-purple-200', textfarbe: 'text-purple-900',
    profilUrl: 'https://www.landtag.rlp.de/de/parlament/abgeordnete/abgeordnetensuche/',
    awUrl: 'https://www.abgeordnetenwatch.de/rheinland-pfalz/abgeordnete',
  },
];

interface Modul {
  icon: string;
  titel: string;
  beschreibung: string;
  tag: string;
  tagFarbe: string;
  url: string | null;
}

const MRN_MODULE: Modul[] = [
  { icon: '🌐', titel: 'MRN-Nachrichten',     beschreibung: 'mrn-news.de · 265.000+ Meldungen',   tag: '',           tagFarbe: '',                               url: 'https://www.mrn-news.de/' },
  { icon: '🗄️', titel: 'MRN-Datenportal',     beschreibung: '360 offene Datensätze · CKAN-API',   tag: 'Open Data',  tagFarbe: 'bg-cyan-100 text-cyan-700',       url: 'https://daten.digitale-mrn.de/' },
  { icon: '🚲', titel: 'Mobilität & ÖPNV',    beschreibung: 'VRN · NextBike · Fahrplan',           tag: '',           tagFarbe: '',                               url: 'https://www.vrn.de/' },
  { icon: '🏭', titel: 'Wirtschaft & Arbeit', beschreibung: 'IHK-Konjunktur · 160.000 Betriebe',  tag: '',           tagFarbe: '',                               url: 'https://www.pfalz.ihk24.de/' },
];

const COCKPIT_MODULE_KREIS: Modul[] = [
  { icon: '📋', titel: 'Amtsblätter',         beschreibung: 'Kreis & VG-Bekanntmachungen',        tag: '',           tagFarbe: '',                               url: 'https://www.rhein-pfalz-kreis.de/aktuelles/bekanntmachungen/' },
  { icon: '🏛️', titel: 'Meine Abgeordneten',  beschreibung: 'Bund & Land · Abstimmungsverhalten', tag: '',           tagFarbe: '',                               url: 'https://www.abgeordnetenwatch.de/' },
  { icon: '🗳️', titel: 'Wahlergebnisse',       beschreibung: 'Kommunal bis Ortsgemeindeebene',     tag: '',           tagFarbe: '',                               url: 'https://wahlen.rlp.de/' },
  { icon: '📊', titel: 'Statistik',            beschreibung: 'Bevölkerung · Wirtschaft · Trends',  tag: '',           tagFarbe: '',                               url: 'https://www.meine-heimat-statistik.de/' },
  { icon: '💰', titel: 'Rechnungshof',         beschreibung: 'Kommunalbericht · Prüfungsbefunde',  tag: '',           tagFarbe: '',                               url: 'https://www.rechnungshof.rlp.de/de/veroeffentlichungen/berichte/' },
  { icon: '📰', titel: 'Nachrichten',          beschreibung: 'SWR Aktuell · RPR1 · mrn-news',      tag: '',           tagFarbe: '',                               url: 'https://www.swr.de/swraktuell/rheinland-pfalz/ludwigshafen/index.html' },
  { icon: '📲', titel: 'WhatsApp-Kanal',       beschreibung: 'Meldungen direkt aufs Handy',         tag: 'Bald',       tagFarbe: 'bg-amber-100 text-amber-700',     url: null },
  { icon: '🤖', titel: 'KI-Assistent',         beschreibung: 'Direkt in öffentliche Dokumente',    tag: 'Phase 2',    tagFarbe: 'bg-slate-100 text-slate-500',     url: null },
];

const COCKPIT_MODULE_SPEYER: Modul[] = [
  { icon: '📋', titel: 'Amtsblatt Speyer',    beschreibung: 'speyer.de · wöchentliche Ausgaben',  tag: '',           tagFarbe: '',                               url: 'https://www.speyer.de/de/rathaus/verwaltung/amtsblatt/' },
  { icon: '🏛️', titel: 'Stadtrat',             beschreibung: '44 Sitze · Fraktionen · Beschlüsse', tag: '',           tagFarbe: '',                               url: 'https://www.speyer.de/de/rathaus/stadtrat-und-gremien/' },
  { icon: '🗳️', titel: 'Wahlergebnisse',       beschreibung: 'OB-Wahl · Stadtratswahl · Bundestag', tag: '',          tagFarbe: '',                               url: 'https://wahlen.rlp.de/' },
  { icon: '📊', titel: 'Statistik',            beschreibung: 'Bevölkerung · Wirtschaft · Trends',  tag: '',           tagFarbe: '',                               url: 'https://www.meine-heimat-statistik.de/' },
  { icon: '💰', titel: 'Rechnungshof',         beschreibung: 'Kommunalbericht · Prüfungsbefunde',  tag: '',           tagFarbe: '',                               url: 'https://www.rechnungshof.rlp.de/de/veroeffentlichungen/berichte/' },
  { icon: '🏰', titel: 'Dom & Tourismus',      beschreibung: 'UNESCO-Welterbe · Veranstaltungen',  tag: '',           tagFarbe: '',                               url: 'https://www.speyer.de/de/tourismus/' },
  { icon: '📲', titel: 'WhatsApp-Kanal',       beschreibung: 'Speyer-Meldungen aufs Handy',         tag: 'Bald',       tagFarbe: 'bg-amber-100 text-amber-700',     url: null },
  { icon: '🤖', titel: 'KI-Assistent',         beschreibung: 'Direkt in öffentliche Dokumente',    tag: 'Phase 2',    tagFarbe: 'bg-slate-100 text-slate-500',     url: null },
];

const SCHNELLAUSWAHL = [
  '67373 Dudenhofen', '67346 Speyer', '67105 Schifferstadt', '67133 Maxdorf',
];

function ModulKarte({ m, hoverFarbe }: { m: Modul; hoverFarbe: 'emerald' | 'cyan' }) {
  const hover = hoverFarbe === 'cyan'
    ? 'border-cyan-100 bg-cyan-50/30 hover:border-cyan-400 group-hover:text-cyan-700'
    : 'border-slate-200 hover:border-emerald-400 group-hover:text-emerald-700';

  const inner = (
    <>
      <div className="text-2xl mb-2">{m.icon}</div>
      <div className={`font-semibold text-sm text-slate-800 transition-colors ${hover.split(' ').slice(-1)}`}>{m.titel}</div>
      <div className="text-xs text-slate-500 mt-1 leading-relaxed">{m.beschreibung}</div>
      {m.tag && <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${m.tagFarbe}`}>{m.tag}</span>}
    </>
  );

  const base = `border rounded-xl p-4 transition-all group ${hover.split(' ').slice(0, -1).join(' ')}`;

  if (m.url) {
    return (
      <a href={m.url} target="_blank" rel="noopener noreferrer" className={`${base} hover:shadow-md block`}>
        {inner}
      </a>
    );
  }
  return (
    <div className={`${base} opacity-60 cursor-not-allowed`} title="Demnächst verfügbar">
      {inner}
    </div>
  );
}

export default function Home() {
  const [suche, setSuche] = useState('');
  const [ergebnis, setErgebnis] = useState<OrtData | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [cockpitOffen, setCockpitOffen] = useState(false);
  const [fehler, setFehler] = useState('');

  function suchen(wert?: string) {
    const eingabe = (wert ?? suche).trim().split(' ')[0];
    setFehler('');

    const plzMatch = PLZ_DATA[eingabe];
    if (plzMatch) {
      setErgebnis(plzMatch);
      setFlyTo([plzMatch.lat, plzMatch.lng]);
      setCockpitOffen(true);
      return;
    }
    const ortKey = eingabe.toLowerCase();
    const ortPlz = ORT_INDEX[ortKey];
    if (ortPlz) {
      const ortMatch = PLZ_DATA[ortPlz];
      setErgebnis(ortMatch);
      setFlyTo([ortMatch.lat, ortMatch.lng]);
      setCockpitOffen(true);
      return;
    }
    setFehler(`„${eingabe}" nicht gefunden. Versuche z.B. 67373, 67346 oder „Speyer".`);
  }

  const module = ergebnis?.typ === 'kreisfrei' ? COCKPIT_MODULE_SPEYER : COCKPIT_MODULE_KREIS;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-slate-900 text-white px-4 md:px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">📡</span>
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-none">KreisRadar</h1>
            <p className="text-slate-400 text-xs truncate">Rhein-Pfalz-Kreis & Speyer</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-slate-300 shrink-0">
          <a href="#karte" className="hover:text-white transition">Karte</a>
          <a href="#abgeordnete" className="hover:text-white transition">Abgeordnete</a>
          <a href="#" className="hover:text-white transition">Über uns</a>
        </nav>
        <span className="text-xs bg-emerald-600 px-2 md:px-3 py-1 rounded-full font-medium shrink-0 whitespace-nowrap">
          <span className="hidden sm:inline">Kostenlos & öffentlich</span>
          <span className="sm:hidden">Kostenlos</span>
        </span>
      </header>

      {/* Hero */}
      <section className="bg-slate-900 text-white px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Dein Kreis. Transparent.</h2>
        <p className="text-slate-300 mb-8 max-w-xl mx-auto text-base leading-relaxed">
          Alle öffentlichen Informationen für deinen Ort — Amtsblätter, Abgeordnete,
          Wahlergebnisse und mehr. Einfach PLZ oder Ort eingeben.
        </p>

        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && suchen()}
            placeholder="PLZ oder Ort … z.B. 67373 oder Speyer"
            className="flex-1 px-4 py-3 rounded-lg bg-white text-slate-900 placeholder-slate-400 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            onClick={() => suchen()}
            className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 px-5 py-3 rounded-lg font-semibold text-sm transition"
          >
            Suchen
          </button>
        </div>

        {fehler && <p className="text-red-400 text-sm mt-3">{fehler}</p>}

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {SCHNELLAUSWAHL.map((s) => (
            <button
              key={s}
              onClick={() => { setSuche(s); suchen(s); }}
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
          <div className="px-4 md:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-800 shrink-0">🗺️ Rhein-Pfalz-Kreis & Speyer</h3>
            <span className="text-xs text-slate-400 hidden sm:block">OpenStreetMap · Suche oben oder klicke auf die Karte</span>
          </div>
          <div className="h-64 md:h-80">
            <KreisRadarMap flyTo={flyTo} />
          </div>
        </section>

        {/* Bürger-Cockpit */}
        {cockpitOffen && ergebnis && (
          <section className="bg-white rounded-2xl shadow-sm overflow-hidden">

            {/* Cockpit-Header — unterschiedlich für Kreis vs. kreisfreie Stadt */}
            {ergebnis.typ === 'kreisfrei' ? (
              <div className="px-6 py-4 bg-violet-50 border-b border-violet-100 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">📍 Bürger-Cockpit: {ergebnis.ort}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-violet-200 text-violet-800 px-2 py-0.5 rounded-full font-semibold">Kreisfreie Stadt</span>
                    <span className="text-sm text-slate-500">Rheinland-Pfalz · eigene Informationsbasis</span>
                  </div>
                </div>
                <button onClick={() => setCockpitOffen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
              </div>
            ) : (
              <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">📍 Bürger-Cockpit: {ergebnis.ort}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {ergebnis.vg ? `VG ${ergebnis.vg} · ` : 'Verbandsfreie Gemeinde · '}
                    Rhein-Pfalz-Kreis · Rheinland-Pfalz
                  </p>
                </div>
                <button onClick={() => setCockpitOffen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
              </div>
            )}

            {/* Informationshierarchie */}
            <div className="px-4 md:px-6 py-3 bg-slate-50 border-b border-slate-100">
              <p className="text-xs text-slate-500 mb-2 font-medium">Verwaltungsebenen:</p>
              <div className="overflow-x-auto pb-1">
                {ergebnis.typ === 'kreisfrei' ? (
                  <div className="flex gap-1.5 text-xs min-w-max">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md whitespace-nowrap">🇩🇪 Bundestag</span>
                    <span className="text-slate-300 self-center">›</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md whitespace-nowrap">🏛️ Landtag RLP</span>
                    <span className="text-slate-300 self-center">›</span>
                    <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-md font-semibold whitespace-nowrap">🏙️ {ergebnis.ort} (kreisfrei)</span>
                  </div>
                ) : (
                  <div className="flex gap-1.5 text-xs min-w-max">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md whitespace-nowrap">🇩🇪 Bundestag</span>
                    <span className="text-slate-300 self-center">›</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md whitespace-nowrap">🏛️ Landtag RLP</span>
                    <span className="text-slate-300 self-center">›</span>
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md whitespace-nowrap">🏢 Rhein-Pfalz-Kreis</span>
                    {ergebnis.vg && (<><span className="text-slate-300 self-center">›</span><span className="bg-green-100 text-green-700 px-2 py-1 rounded-md whitespace-nowrap">🏘️ VG {ergebnis.vg}</span></>)}
                    <span className="text-slate-300 self-center">›</span>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-semibold whitespace-nowrap">📍 {ergebnis.ort}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lokale Module */}
            <div className="px-4 md:px-6 pt-5 pb-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Lokale Informationen</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-6 pb-4">
              {module.map((m) => <ModulKarte key={m.titel} m={m} hoverFarbe="emerald" />)}
            </div>

            {/* MRN-Module */}
            <div className="px-4 md:px-6 pt-3 pb-2 border-t border-slate-100 mt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Metropolregion Rhein-Neckar</p>
                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">2,4 Mio. Einwohner</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-6 pb-6">
              {MRN_MODULE.map((m) => <ModulKarte key={m.titel} m={m} hoverFarbe="cyan" />)}
            </div>

            {/* Speyer-Hinweis */}
            {ergebnis.typ === 'kreisfrei' && (
              <div className="mx-6 mb-6 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 text-sm text-violet-800">
                <strong>Hinweis:</strong> Speyer ist eine kreisfreie Stadt — sie gehört keinem Landkreis an und hat eine vollständig eigene Verwaltungsstruktur mit eigenem Stadtrat, eigenem Amtsblatt (speyer.de) und eigenem Haushalt.
              </div>
            )}
          </section>
        )}

        {/* Wahlergebnisse */}
        <Wahlergebnisse />

        {/* Metropolregion Rhein-Neckar */}
        <section id="mrn" className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">🌐 Metropolregion Rhein-Neckar</h3>
              <p className="text-xs text-slate-400 mt-0.5">2,4 Mio. Einwohner · BW, RLP & Hessen · <span className="hidden sm:inline">Rhein-Pfalz-Kreis & Speyer gehören dazu</span><span className="sm:hidden">inkl. Rhein-Pfalz-Kreis & Speyer</span></p>
            </div>
            <span className="text-xs bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full font-medium hidden md:block">Open Data</span>
          </div>

          {/* Fakten-Leiste */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 border-b border-slate-100">
            {[
              { zahl: '2,4 Mio.', label: 'Einwohner' },
              { zahl: '95,3 Mrd. €', label: 'Wirtschaftsleistung' },
              { zahl: '360', label: 'offene Datensätze' },
              { zahl: '265.000+', label: 'Nachrichten (mrn-news)' },
            ].map((f) => (
              <div key={f.label} className="px-5 py-4 text-center">
                <div className="text-lg font-bold text-cyan-700">{f.zahl}</div>
                <div className="text-xs text-slate-500 mt-0.5">{f.label}</div>
              </div>
            ))}
          </div>

          {/* MRN-Quellen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {[
              { icon: '🗄️', titel: 'Datenportal Rhein-Neckar', beschreibung: '360 offene Datensätze zu Mobilität, Umwelt, Wirtschaft und Lebensqualität. CKAN-API für maschinellen Zugriff.', quelle: 'daten.digitale-mrn.de', tag: 'API verfügbar', tagFarbe: 'bg-cyan-100 text-cyan-700',     url: 'https://daten.digitale-mrn.de/' },
              { icon: '📰', titel: 'MRN-News',                  beschreibung: 'Größtes regionales Nachrichtenportal der Metropolregion. Über 265.000 Meldungen, 1 Mio. Besucher/Monat.',        quelle: 'mrn-news.de',           tag: 'Kostenlos',    tagFarbe: 'bg-emerald-100 text-emerald-700', url: 'https://www.mrn-news.de/' },
              { icon: '🗺️', titel: 'Metropolatlas',             beschreibung: 'Interaktive Karte der Metropolregion mit Raumordnungs- und Planungsdaten für alle 290 Gemeinden.',              quelle: 'm-r-n.com',             tag: 'Karte',        tagFarbe: 'bg-blue-100 text-blue-700',       url: 'https://www.m-r-n.com/' },
              { icon: '🚲', titel: 'Mobilität & VRN',           beschreibung: 'Fahrradverleihstationen (NextBike), ÖPNV-Daten, BMVI-Förderprojekte und Verkehrsmodell der Region.',            quelle: 'vrn.de',                tag: 'Open Data',   tagFarbe: 'bg-cyan-100 text-cyan-700',       url: 'https://www.vrn.de/' },
            ].map((q) => (
              <a key={q.titel} href={q.url} target="_blank" rel="noopener noreferrer"
                className="border border-slate-200 rounded-xl p-4 hover:border-cyan-400 hover:shadow-md transition-all block group">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl shrink-0">{q.icon}</span>
                  <span className="font-semibold text-sm text-slate-800 group-hover:text-cyan-700 transition-colors">{q.titel}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-auto ${q.tagFarbe}`}>{q.tag}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{q.beschreibung}</p>
                <p className="text-xs text-cyan-600 mt-2 font-medium">{q.quelle} ↗</p>
              </a>
            ))}
          </div>
        </section>

        {/* Abgeordnete */}
        <section id="abgeordnete" className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">🏛️ Abgeordnete in der Region</h3>
            <p className="text-xs text-slate-400 mt-0.5">Bundestag & Landtag RLP · Quellen: bundestag.de · landtag.rlp.de · abgeordnetenwatch.de</p>
          </div>
          <div className="mx-6 mt-4 mb-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-700">
            <strong>Hinweis WK 206:</strong> Das Direktmandat Ludwigshafen/Frankenthal ist vakant — CDU-Sieger Sertac Bilgin zieht aufgrund der Wahlrechtsreform 2025 nicht in den Bundestag ein.
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
                  <a href={a.profilUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-white/80 hover:bg-white border border-slate-200 px-3 py-1 rounded-lg transition">Profil →</a>
                  <a href={a.awUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-white/80 hover:bg-white border border-slate-200 px-3 py-1 rounded-lg transition">Abstimmungen →</a>
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
        <p>KreisRadar · Rhein-Pfalz-Kreis & Speyer · Alle Daten aus öffentlichen Quellen</p>
        <p>Karte: © <a href="https://www.openstreetmap.org/copyright" className="underline hover:text-slate-200">OpenStreetMap</a> Contributors · Konzept: Mai 2026</p>
      </footer>

    </div>
  );
}
