import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useOrderStore } from '../../store/useOrderStore';
import OrderQueuePage from './pages/OrderQueuePage';
import ProcessOrderPage from './pages/ProcessOrderPage';
import AddProductAIPage from './pages/AddProductAIPage';

export default function CashierApp() {
  const loadOrders = useOrderStore((s) => s.loadOrders);
  useEffect(() => { loadOrders(); }, [loadOrders]);
  return (
    <Routes>
      <Route index element={<OrderQueuePage />} />
      <Route path="order/:id" element={<ProcessOrderPage />} />
      <Route path="add-product-ai" element={<AddProductAIPage />} />
      <Route path="*" element={<Navigate to="/Cashier" replace />} />
    </Routes>
  );
}
