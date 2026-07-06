import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, ChevronLeft, LayoutGrid } from 'lucide-react';
import { fetchCategories } from '../../../lib/api';
import { sortCategories } from '../../../data/categories';
import { useFetch } from '../../../lib/useFetch';
import BottomNav from '../components/BottomNav';
import { useCartStore } from '../../../store/useCartStore';

// ميزة الصفحة: كل قسم يعرض أقسامه الفرعية مباشرة — ضغطة واحدة توصلك للفرعي الذي تريده
export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, loading } = useFetch(fetchCategories, [], []);
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const list = sortCategories(categories || []);

  return (
    <div className="min-h-screen bg-narges-bg anim-fade-up pb-24 overflow-x-hidden">
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
              <p className="text-[11px] text-narges-text-secondary leading-tight">{list.length} قسماً بأقسامها الفرعية</p>
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

      <div className="px-4 pt-4 space-y-4 max-w-md mx-auto w-full">
        {loading && list.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-2xl skeleton" />)}
          </div>
        ) : (
          list.map((cat, i) => (
            <section key={cat.id} className={`anim-fade-up anim-d${Math.min(i + 1, 6)}`}>
              {/* بنر القسم */}
              <button
                onClick={() => navigate(`/Customer/category/${cat.id}`)}
                className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 active:scale-[0.99] transition-transform"
                style={{ backgroundColor: cat.color }}
              >
                <span className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center text-2xl flex-shrink-0">
                  {cat.icon}
                </span>
                <span className="flex-1 text-right">
                  <span className="block font-bold text-[15px] text-gray-900">{cat.nameAr}</span>
                  <span className="block text-[11px] text-gray-700">{cat.productCount} منتج</span>
                </span>
                <span className="flex items-center gap-0.5 bg-white/70 text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  عرض الكل <ChevronLeft size={13} />
                </span>
              </button>

              {/* الأقسام الفرعية */}
              {cat.subcategories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5 px-0.5">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => navigate(`/Customer/category/${cat.id}?sub=${sub.id}`)}
                      className="card-press bg-narges-surface border border-narges-border rounded-full px-3.5 py-1.5 text-xs font-semibold text-narges-text shadow-narges-sm"
                    >
                      {sub.nameAr}
                    </button>
                  ))}
                </div>
              )}
            </section>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
