import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { searchProducts } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { data: results } = useFetch(
    () => (query.length > 1 ? searchProducts(query) : Promise.resolve([])),
    [query],
    []
  );

  return (
    <div className="min-h-screen bg-narges-bg">
      {/* Search Bar */}
      <div className="sticky top-0 z-40 bg-narges-surface px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center">
          <ArrowRight size={18} />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-narges-bg rounded-xl px-3 py-2.5">
          <Search size={16} className="text-narges-text-secondary" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X size={16} className="text-narges-text-secondary" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 pt-4">
        {query.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl">🔍</span>
            <p className="mt-3 text-narges-text-secondary">ابحث عن منتجاتك المفضلة</p>
          </div>
        )}
        {query.length > 1 && results.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl">😕</span>
            <p className="mt-3 text-narges-text font-medium">لا نتائج لـ "{query}"</p>
            <p className="text-narges-text-secondary text-sm mt-1">جرب كلمة بحث مختلفة</p>
          </div>
        )}
        {results.length > 0 && (
          <>
            <p className="text-sm text-narges-text-secondary mb-3">{results.length} نتيجة لـ "{query}"</p>
            <div className="grid grid-cols-2 gap-3">
              {results.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
