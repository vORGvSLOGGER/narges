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
import CouponsPage from './pages/CouponsPage';
import SettingsPage from './pages/SettingsPage';

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
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/Admin" replace />} />
          </Routes>
      </main>
    </div>
  );
}

