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
    <div className="flex min-h-screen bg-narges-bg">
      <Sidebar />
      <main className="flex-1 overflow-auto">
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
      </main>
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
          <div key={i} className="flex items-center justify-between pb-3 border-b border-narges-border">
            <span className="text-narges-text-secondary text-sm">{s.label}</span>
            <span className="font-medium">{s.value}</span>
          </div>
        ))}
        <button className="btn-primary w-full mt-4">حفظ الإعدادات</button>
      </div>
    </div>
  );
}
