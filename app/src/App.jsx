import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PanelSwitcher from './components/shared/PanelSwitcher';
import CustomerApp from './panels/customer/CustomerApp';
import DeliveryApp from './panels/delivery/DeliveryApp';
import CashierApp from './panels/cashier/CashierApp';
import AdminApp from './panels/admin/AdminApp';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <PanelSwitcher />
      <div className="pt-8">
        <Routes>
          <Route path="/" element={<Navigate to="/Customer" replace />} />
          <Route path="/Customer/*" element={<CustomerApp />} />
          <Route path="/Delivery/*" element={<DeliveryApp />} />
          <Route path="/Cashier/*" element={<CashierApp />} />
          <Route path="/Admin/*" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/Customer" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
