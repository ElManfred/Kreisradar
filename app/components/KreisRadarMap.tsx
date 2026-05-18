'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const RHEIN_PFALZ_CENTER: [number, number] = [49.44, 8.42];

function FlyToLocation({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 13, { duration: 1.5 });
  }, [coords, map]);
  return null;
}

interface Props {
  flyTo: [number, number] | null;
}

export default function KreisRadarMap({ flyTo }: Props) {
  return (
    <MapContainer
      center={RHEIN_PFALZ_CENTER}
      zoom={11}
      className="h-full w-full rounded-xl"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToLocation coords={flyTo} />
    </MapContainer>
  );
}
