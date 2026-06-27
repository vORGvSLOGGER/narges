import { Routes, Route, Navigate } from 'react-router-dom';
import OrderQueuePage from './pages/OrderQueuePage';
import ProcessOrderPage from './pages/ProcessOrderPage';

export default function CashierApp() {
  return (
    <Routes>
      <Route index element={<OrderQueuePage />} />
      <Route path="order/:id" element={<ProcessOrderPage />} />
      <Route path="*" element={<Navigate to="/cashier" replace />} />
    </Routes>
  );
}
