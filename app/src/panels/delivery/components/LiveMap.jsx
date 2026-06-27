import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const storeIcon = new L.DivIcon({
  html: '<div style="font-size:28px;line-height:1;">🏪</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const customerIcon = new L.DivIcon({
  html: '<div style="font-size:28px;line-height:1;">🏠</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const driverIcon = new L.DivIcon({
  html: '<div style="background:#1B5E20;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🚗</div>',
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const STORE_POS = [24.7236, 46.6753];

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(positions, { padding: [40, 40] });
    }
  }, []);
  return null;
}

export default function LiveMap({ customerLat = 24.7100, customerLng = 46.6600, driverLat, driverLng }) {
  const customerPos = [customerLat, customerLng];
  const driverPos = driverLat ? [driverLat, driverLng] : [24.7180, 46.6700];

  return (
    <MapContainer
      center={driverPos}
      zoom={14}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds positions={[STORE_POS, customerPos, driverPos]} />
      <Marker position={STORE_POS} icon={storeIcon}>
        <Popup>🏪 نرجس سوبرماركت</Popup>
      </Marker>
      <Marker position={customerPos} icon={customerIcon}>
        <Popup>🏠 موقع العميل</Popup>
      </Marker>
      <Marker position={driverPos} icon={driverIcon}>
        <Popup>🚗 موقعك الحالي</Popup>
      </Marker>
    </MapContainer>
  );
}
