import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import SearchPage from './pages/SearchPage';
import LoyaltyPage from './pages/LoyaltyPage';

export default function CustomerApp() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="category/:id" element={<CategoryPage />} />
      <Route path="product/:id" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="tracking/:id" element={<OrderTrackingPage />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="loyalty" element={<LoyaltyPage />} />
      <Route path="*" element={<Navigate to="/Customer" replace />} />
    </Routes>
  );
}
