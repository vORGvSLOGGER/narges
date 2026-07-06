import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Flame } from 'lucide-react';
import { fetchOffers } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';
import { useCartStore } from '../../../store/useCartStore';

export default function OffersPage() {
  const navigate = useNavigate();
  const { data: offers, loading } = useFetch(fetchOffers, [], []);
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const list = offers || [];

  return (
    <div className="min-h-screen bg-narges-bg anim-fade-up pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-narges-surface shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center active:scale-90 transition-transform">
            <ArrowRight size={18} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="w-9 h-9 rounded-xl bg-narges-orange/10 flex items-center justify-center">
              <Flame size={18} className="text-narges-orange" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-narges-text leading-tight">كل العروض</h1>
              <p className="text-[11px] text-narges-text-secondary leading-tight">{list.length} منتج بخصم حصري</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/Customer/cart')}
            className="relative w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-narges-orange text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 pt-4">
        {loading && list.length === 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-60 rounded-[20px] skeleton" />)}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-20 text-narges-text-secondary">
            <span className="text-5xl block mb-3">🏷️</span>
            <p>لا توجد عروض حالياً — عد لنا قريباً!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
