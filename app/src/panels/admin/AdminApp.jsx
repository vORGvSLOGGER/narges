import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useOrderStore } from '../../store/useOrderStore';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import DriversMapPage from './pages/DriversMapPage';
import OffersPage from './pages/OffersPage';
import ComplaintsPage from './pages/ComplaintsPage';

export default function AdminApp() {
  const loadOrders = useOrderStore((s) => s.loadOrders);
  useEffect(() => { loadOrders(); }, [loadOrders]);
  return (
    <div className="flex min-h-screen bg-narjis-bg">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="pt-8">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="drivers-map" element={<DriversMapPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="settings" element={<SettingsPlaceholder />} />
            <Route path="*" element={<Navigate to="/Admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function DriversPlaceholder() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">المناديب</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: 'خالد العتيبي', deliveries: 234, rating: 4.8, status: 'active' },
          { name: 'عمر الزهراني', deliveries: 187, rating: 4.7, status: 'active' },
          { name: 'ماجد الغامدي', deliveries: 156, rating: 4.6, status: 'offline' },
          { name: 'سعد الحربي', deliveries: 98, rating: 4.5, status: 'offline' },
        ].map((d, i) => (
          <div key={i} className="card p-4 flex items-center gap-4">
            <div className="w-14 h-14 bg-narjis-green rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {d.name[0]}
            </div>
            <div className="flex-1">
              <p className="font-bold">{d.name}</p>
              <p className="text-sm text-narjis-text-secondary">{d.deliveries} توصيلة • ⭐ {d.rating}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${d.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {d.status === 'active' ? 'متاح' : 'غير متاح'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">الإعدادات</h1>
      <div className="card p-6 space-y-4 max-w-lg">
        {[
          { label: 'اسم المتجر', value: 'نرجس سوبرماركت' },
          { label: 'رقم الاتصال', value: '0112345678' },
          { label: 'رسوم التوصيل الأساسية', value: '10 ر.س' },
          { label: 'الحد الأدنى للطلب', value: '30 ر.س' },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between pb-3 border-b border-gray-50">
            <span className="text-narjis-text-secondary text-sm">{s.label}</span>
            <span className="font-medium">{s.value}</span>
          </div>
        ))}
        <button className="btn-primary w-full mt-4">حفظ الإعدادات</button>
      </div>
    </div>
  );
}
