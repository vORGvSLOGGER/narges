import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { fetchCategories, fetchByCategory } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';
import { useCartStore } from '../../../store/useCartStore';
import { ShoppingCart } from 'lucide-react';

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: categories } = useFetch(fetchCategories, [], []);
  const { data: products, loading } = useFetch(() => fetchByCategory(id), [id], []);
  const category = (categories || []).find(c => c.id === id) || { nameAr: '...', icon: '📦', subcategories: [] };
  const allProducts = products || [];
  const [activeSubcat, setActiveSubcat] = useState(searchParams.get('sub') || 'all');
  const items = useCartStore(s => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  const displayed = activeSubcat === 'all'
    ? allProducts
    : allProducts.filter(p => p.subcategoryId === activeSubcat);

  return (
    <div className="min-h-screen bg-narges-bg anim-fade-up pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-narges-surface shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center">
            <ArrowRight size={18} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">{category.icon}</span>
            <h1 className="text-lg font-bold text-narges-text">{category.nameAr}</h1>
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

        {/* Subcategories */}
        {category.subcategories?.length > 0 && (
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveSubcat('all')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeSubcat === 'all' ? 'bg-narges-light text-white' : 'bg-narges-bg text-narges-text'
              }`}
            >
              الكل ({allProducts.length})
            </button>
            {category.subcategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcat(sub.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeSubcat === sub.id ? 'bg-narges-light text-white' : 'bg-narges-bg text-narges-text'
                }`}
              >
                {sub.nameAr}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="px-4 pt-4">
        {loading ? (
          <div className="text-center py-20 text-narges-text-secondary">
            <span className="text-4xl block mb-3 animate-pulse">⏳</span>
            <p>جاري التحميل...</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 text-narges-text-secondary">
            <span className="text-5xl block mb-3">📦</span>
            <p>لا توجد منتجات في هذا القسم</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {displayed.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
