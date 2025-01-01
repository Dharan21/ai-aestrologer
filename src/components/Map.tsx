import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// // Fix for default marker icon
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "/marker-icon-2x.png",
//   iconUrl: "/marker-icon.png",
//   shadowUrl: "/marker-shadow.png",
// });

const customIcon = new L.Icon({
  iconUrl: "/marker-icon.png", // Path to your single marker image
  iconSize: [60, 60], // Double the size of the icon (from 30x30 to 60x60)
  iconAnchor: [30, 45], // Slightly above the center-bottom of the doubled icon to align it better
  popupAnchor: [0, -60], // Adjust popup position to be above the new icon size
});

interface MapProps {
  onLocationChange: (location: { lat: number; lng: number }) => void;
}

function LocationMarker({ onLocationChange }: MapProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon}></Marker>
  );
}

export default function Map({ onLocationChange }: MapProps) {
  return (
    <MapContainer
      center={[30, 77]}
      zoom={3}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationChange={onLocationChange} />
    </MapContainer>
  );
}
