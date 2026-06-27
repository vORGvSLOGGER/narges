import { Routes, Route, Navigate } from 'react-router-dom';
import AvailableOrdersPage from './pages/AvailableOrdersPage';
import ActiveDeliveryPage from './pages/ActiveDeliveryPage';

export default function DriverApp() {
  return (
    <Routes>
      <Route index element={<AvailableOrdersPage />} />
      <Route path="delivery/:id" element={<ActiveDeliveryPage />} />
      <Route path="*" element={<Navigate to="/driver" replace />} />
    </Routes>
  );
}
