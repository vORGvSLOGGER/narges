import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fetchBrandById, fetchByBrand, fetchCategories } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';

export default function BrandPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: brand } = useFetch(() => fetchBrandById(id), [id]);
  const { data: products, loading } = useFetch(() => fetchByBrand(id), [id], []);
  const { data: categories } = useFetch(fetchCategories, [], []);
  const [activeCat, setActiveCat] = useState('all');

  // أقسام هذه الشركة فقط (مشتقة من منتجاتها)
  const catIds = [...new Set((products || []).map((p) => p.categoryId))];
  const brandCats = (categories || []).filter((c) => catIds.includes(c.id));
  const shown = activeCat === 'all' ? products : products.filter((p) => p.categoryId === activeCat);
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-narges-bg pb-24 anim-fade-up">
      {/* ترويسة الشركة */}
      <div className="px-4 pt-4 pb-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1B5E20,#2E7D32 55%,#66BB6A)' }}>
        <span className="anim-float absolute -top-2 -left-3 text-[90px] opacity-[0.14] leading-none">{brand?.logo}</span>
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
          <ArrowRight size={18} />
        </button>
        <div className="flex items-center gap-3 relative">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-4xl shadow-lg">
            {brand?.logo}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold">{brand?.nameAr}</h1>
            <p className="text-white/85 text-xs mt-0.5">
              {brand?.country} · منذ {brand?.foundedYear} ({brand ? year - brand.foundedYear : ''} عاماً)
            </p>
          </div>
          <span className="mr-auto bg-white/20 border border-white/30 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
            {products.length} منتج
          </span>
        </div>
        {brand?.blurb && <p className="relative text-white/90 text-[12px] mt-3 leading-relaxed">💡 {brand.blurb}</p>}
      </div>

      {/* أقسام الشركة */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pt-3 pb-1">
        <button
          onClick={() => setActiveCat('all')}
          className={`flex-shrink-0 text-xs font-bold px-3.5 py-2 rounded-full ${activeCat === 'all' ? 'bg-narges-green text-white' : 'bg-narges-surface border border-narges-border text-narges-text-secondary'}`}
        >
          الكل ({products.length})
        </button>
        {brandCats.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`flex-shrink-0 text-xs font-bold px-3.5 py-2 rounded-full ${activeCat === c.id ? 'bg-narges-green text-white' : 'bg-narges-surface border border-narges-border text-narges-text-secondary'}`}
          >
            {c.icon} {c.nameAr}
          </button>
        ))}
      </div>

      {/* المنتجات */}
      <div className="px-4 pt-3">
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-60 rounded-[20px] skeleton" />)}
          </div>
        ) : shown.length === 0 ? (
          <p className="text-center text-narges-text-secondary py-16 text-sm">لا منتجات في هذا القسم</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {shown.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
