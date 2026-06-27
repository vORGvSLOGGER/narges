import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PanelSwitcher from './components/shared/PanelSwitcher';
import CustomerApp from './panels/customer/CustomerApp';
import DriverApp from './panels/driver/DriverApp';
import CashierApp from './panels/cashier/CashierApp';
import AdminApp from './panels/admin/AdminApp';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <PanelSwitcher />
      <div className="pt-8">
        <Routes>
          <Route path="/" element={<Navigate to="/customer" replace />} />
          <Route path="/customer/*" element={<CustomerApp />} />
          <Route path="/driver/*" element={<DriverApp />} />
          <Route path="/cashier/*" element={<CashierApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/customer" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
