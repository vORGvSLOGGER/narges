import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/shared/ProtectedRoute';
import CustomerApp from './panels/customer/CustomerApp';
import DeliveryApp from './panels/delivery/DeliveryApp';
import CashierApp from './panels/cashier/CashierApp';
import AdminApp from './panels/admin/AdminApp';
import LoginPage from './panels/auth/LoginPage';
import SignUpPage from './panels/auth/SignUpPage';
import { useAuthStore } from './store/useAuthStore';
import { useSettingsStore } from './store/useSettingsStore';

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const loadSettings = useSettingsStore((s) => s.load);
  useEffect(() => {
    initAuth();
    loadSettings();
  }, [initAuth, loadSettings]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/Customer" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/Customer/*" element={<CustomerApp />} />
        <Route
          path="/Delivery/*"
          element={
            <ProtectedRoute roles={['delivery', 'admin']}>
              <DeliveryApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Cashier/*"
          element={
            <ProtectedRoute roles={['cashier', 'admin']}>
              <CashierApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin/*"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminApp />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/Customer" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
