import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useOrderStore } from '../../store/useOrderStore';
import AvailableOrdersPage from './pages/AvailableOrdersPage';
import ActiveDeliveryPage from './pages/ActiveDeliveryPage';

export default function DeliveryApp() {
  const loadOrders = useOrderStore((s) => s.loadOrders);
  useEffect(() => { loadOrders(); }, [loadOrders]);
  return (
    <Routes>
      <Route index element={<AvailableOrdersPage />} />
      <Route path="delivery/:id" element={<ActiveDeliveryPage />} />
      <Route path="*" element={<Navigate to="/Delivery" replace />} />
    </Routes>
  );
}
