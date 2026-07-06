import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, ChevronLeft, LayoutGrid } from 'lucide-react';
import { fetchCategories } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import BottomNav from '../components/BottomNav';
import { useCartStore } from '../../../store/useCartStore';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, loading } = useFetch(fetchCategories, [], []);
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const list = categories || [];

  return (
    <div className="min-h-screen bg-narges-bg anim-fade-up pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-narges-surface shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center active:scale-90 transition-transform">
            <ArrowRight size={18} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="w-9 h-9 rounded-xl bg-narges-green/10 flex items-center justify-center">
              <LayoutGrid size={18} className="text-narges-green" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-narges-text leading-tight">جميع الأقسام</h1>
              <p className="text-[11px] text-narges-text-secondary leading-tight">{list.length} قسماً — كل احتياجات بيتك</p>
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

      <div className="px-4 pt-4">
        {loading && list.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-20 rounded-2xl skeleton" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/Customer/category/${cat.id}`)}
                className={`anim-fade-up anim-d${Math.min(i + 1, 6)} card-press w-full flex items-center gap-3.5 bg-narges-surface border border-narges-border rounded-2xl p-3.5 shadow-narges-sm text-right`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-narges-text text-[15px]">{cat.nameAr}</p>
                  <p className="text-xs text-narges-text-secondary mt-0.5 truncate">
                    {cat.productCount} منتج
                    {cat.subcategories?.length > 0 && ` · ${cat.subcategories.slice(0, 3).map((s) => s.nameAr).join('، ')}`}
                  </p>
                </div>
                <span className="w-8 h-8 rounded-full bg-narges-green/10 flex items-center justify-center flex-shrink-0">
                  <ChevronLeft size={16} className="text-narges-green" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
