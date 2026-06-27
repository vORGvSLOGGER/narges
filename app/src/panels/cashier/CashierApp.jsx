import { Routes, Route, Navigate } from 'react-router-dom';
import OrderQueuePage from './pages/OrderQueuePage';
import ProcessOrderPage from './pages/ProcessOrderPage';
import AddProductAIPage from './pages/AddProductAIPage';

export default function CashierApp() {
  return (
    <Routes>
      <Route index element={<OrderQueuePage />} />
      <Route path="order/:id" element={<ProcessOrderPage />} />
      <Route path="add-product-ai" element={<AddProductAIPage />} />
      <Route path="*" element={<Navigate to="/Cashier" replace />} />
    </Routes>
  );
}
