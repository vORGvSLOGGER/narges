import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavoritesStore } from '../../../store/useFavoritesStore';
import { fetchProducts } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const ids = useFavoritesStore((s) => s.ids);
  const { data: all, loading } = useFetch(fetchProducts, [], []);
  const favorites = (all || []).filter((p) => ids.includes(p.id));

  return (
    <div className="min-h-screen bg-narges-bg pb-24">
      <div className="sticky top-0 z-40 bg-narges-surface shadow-narges-sm px-4 py-3 flex items-center gap-2">
        <Heart size={18} className="text-red-500 fill-red-500" />
        <h1 className="text-lg font-bold flex-1">المفضلة</h1>
        <span className="text-xs text-narges-text-secondary">{favorites.length} منتج</span>
      </div>

      <div className="px-4 pt-4">
        {loading && ids.length > 0 && favorites.length === 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="card h-56 animate-pulse" />)}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <span className="text-6xl">🤍</span>
            <p className="font-bold text-narges-text">قائمتك فارغة</p>
            <p className="text-sm text-narges-text-secondary px-8">اضغط على القلب في أي منتج ليظهر هنا</p>
            <button onClick={() => navigate('/Customer')} className="btn-primary px-8 mt-2">اكتشف المنتجات</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favorites.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
