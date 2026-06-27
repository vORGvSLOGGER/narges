import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { categories } from '../../../data/categories';
import { getByCategory } from '../../../data/products';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';
import { useCartStore } from '../../../store/useCartStore';
import { ShoppingCart } from 'lucide-react';

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const category = categories.find(c => c.id === id) || categories[0];
  const allProducts = getByCategory(id || category.id);
  const [activeSubcat, setActiveSubcat] = useState('all');
  const items = useCartStore(s => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  const displayed = activeSubcat === 'all'
    ? allProducts
    : allProducts.filter(p => p.subcategoryId === activeSubcat);

  return (
    <div className="min-h-screen bg-narjis-bg pb-20">
      {/* Header */}
      <div className="sticky top-8 z-40 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narjis-bg flex items-center justify-center">
            <ArrowRight size={18} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">{category.icon}</span>
            <h1 className="text-lg font-bold text-narjis-text">{category.nameAr}</h1>
          </div>
          <button
            onClick={() => navigate('/customer/cart')}
            className="relative w-9 h-9 rounded-xl bg-narjis-bg flex items-center justify-center"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-narjis-orange text-white text-xs font-bold rounded-full flex items-center justify-center">
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
                activeSubcat === 'all' ? 'bg-narjis-light text-white' : 'bg-narjis-bg text-narjis-text'
              }`}
            >
              الكل ({allProducts.length})
            </button>
            {category.subcategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcat(sub.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeSubcat === sub.id ? 'bg-narjis-light text-white' : 'bg-narjis-bg text-narjis-text'
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
        {displayed.length === 0 ? (
          <div className="text-center py-20 text-narjis-text-secondary">
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
