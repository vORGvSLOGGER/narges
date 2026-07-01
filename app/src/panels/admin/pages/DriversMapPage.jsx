import { Suspense, lazy } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockDrivers } from '../../../data/mockDrivers';
import { Phone, Star } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STATUS_CONFIG = {
  active: { label: 'متاح', color: 'bg-green-100 text-green-700', dot: '#4CAF50' },
  delivering: { label: 'يوصّل', color: 'bg-blue-100 text-blue-700', dot: '#2196F3' },
  offline: { label: 'غير متاح', color: 'bg-narges-surface2 text-narges-text-secondary', dot: '#9E9E9E' },
};

function makeDriverIcon(status) {
  const dot = STATUS_CONFIG[status]?.dot || '#9E9E9E';
  return new L.DivIcon({
    html: `<div style="background:${dot};border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white;">🚗</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function DriversMapPage() {
  const active = mockDrivers.filter(d => d.status !== 'offline').length;

  return (
    <div className="p-6 space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">تتبع المناديب</h1>
          <p className="text-narges-text-secondary text-sm mt-0.5">{active} من {mockDrivers.length} مناديب متاحين الآن</p>
        </div>
        <div className="flex gap-3">
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: v.dot }} />
              <span className="text-xs text-narges-text-secondary">{v.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden" style={{ height: 360 }}>
        <MapContainer center={[24.7136, 46.6753]} zoom={12} style={{ width: '100%', height: '100%' }} zoomControl>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mockDrivers.map(d => (
            <Marker key={d.id} position={[d.lat, d.lng]} icon={makeDriverIcon(d.status)}>
              <Popup>
                <div className="text-right" dir="rtl" style={{ minWidth: 160 }}>
                  <p className="font-bold">{d.name}</p>
                  <p className="text-xs text-narges-text-secondary">{d.vehicle}</p>
                  <p className="text-xs mt-1">⭐ {d.rating} • {d.ordersToday} توصيلة اليوم</p>
                  <p className="text-xs font-medium mt-1" style={{ color: STATUS_CONFIG[d.status]?.dot }}>
                    {STATUS_CONFIG[d.status]?.label}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {mockDrivers.map(d => {
          const cfg = STATUS_CONFIG[d.status];
          return (
            <div key={d.id} className="card p-4 flex items-center gap-3">
              <div className="w-11 h-11 bg-narges-green rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {d.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{d.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-narges-text-secondary">{d.rating} • {d.ordersToday} اليوم</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                <a href={`tel:${d.phone}`}>
                  <Phone size={14} className="text-narges-text-secondary" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
