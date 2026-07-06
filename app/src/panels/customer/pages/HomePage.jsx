import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Truck, ShieldCheck, Gift, LayoutGrid } from 'lucide-react';
import { fetchCategories, fetchOffers, fetchProducts } from '../../../lib/api';
import { sortCategories } from '../../../data/categories';
import { useFetch } from '../../../lib/useFetch';
import { useSettingsStore } from '../../../store/useSettingsStore';
import ProductCard from '../components/ProductCard';
import FlashDeals from '../components/FlashDeals';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: offersAll, loading: loadingOffers } = useFetch(fetchOffers, [], []);
  const { data: categories } = useFetch(fetchCategories, [], []);
  const { data: allProducts } = useFetch(fetchProducts, [], []);
  const offers = (offersAll || []).slice(0, 8);
  const delivery = useSettingsStore((s) => s.settings.delivery);

  // كل الأقسام بترتيب مفهوم (طازج → بقالة → منزلية)، وتحت كل بنر صف منتجاته
  const catSections = useMemo(() => {
    const byCat = new Map();
    for (const p of allProducts || []) {
      if (!byCat.has(p.categoryId)) byCat.set(p.categoryId, []);
      byCat.get(p.categoryId).push(p);
    }
    return sortCategories(categories || [])
      .map((c) => ({ cat: c, products: (byCat.get(c.id) || []).slice(0, 8) }))
      .filter((s) => s.products.length > 0);
  }, [categories, allProducts]);

  const benefits = [
    { icon: Truck, t: 'توصيل سريع', s: `خلال ${delivery.etaMinutes} دقيقة` },
    { icon: Gift, t: 'توصيل مجاني', s: `فوق ${delivery.freeAt} ر.س` },
    { icon: ShieldCheck, t: 'دفع آمن', s: 'كل الوسائل' },
  ];

  return (
    <div className="min-h-screen bg-narges-bg pb-24 overflow-x-hidden">
      <TopBar />

      <div className="px-4 pt-3 space-y-5 max-w-md mx-auto w-full">
        {/* شريط البحث */}
        <button
          onClick={() => navigate('/Customer/search')}
          className="anim-fade-up w-full flex items-center gap-2.5 bg-narges-surface border border-narges-border rounded-2xl px-4 py-3 shadow-narges-sm active:scale-[0.99] transition-transform"
        >
          <Search size={18} className="text-narges-green" />
          <span className="text-sm text-narges-muted">ابحث عن منتج، قسم أو ماركة...</span>
        </button>

        {/* العروض أولاً — أول ما يجذب العميل */}
        {loadingOffers && offers.length === 0 ? (
          <div className="anim-fade-up anim-d1 h-56 rounded-[20px] skeleton" />
        ) : (
          <div className="anim-fade-up anim-d1"><FlashDeals products={offers} onAll={() => navigate('/Customer/offers')} /></div>
        )}

        {/* شريط المزايا */}
        <div className="anim-fade-up anim-d2 grid grid-cols-3 gap-2.5">
          {benefits.map((b, i) => (
            <div key={i} className="bg-narges-surface border border-narges-border rounded-2xl p-3 flex flex-col items-center text-center gap-1 shadow-narges-sm">
              <span className="w-8 h-8 rounded-full bg-narges-green/10 flex items-center justify-center">
                <b.icon size={16} className="text-narges-green" />
              </span>
              <span className="text-[11px] font-bold text-narges-text leading-tight">{b.t}</span>
              <span className="text-[9px] text-narges-text-secondary leading-tight">{b.s}</span>
            </div>
          ))}
        </div>

        {/* زر كل الأقسام — دخول سريع لصفحة الأقسام الفرعية */}
        <button
          onClick={() => navigate('/Customer/categories')}
          className="anim-fade-up anim-d3 w-full flex items-center justify-between bg-narges-surface border-2 border-dashed border-narges-green/40 rounded-2xl px-4 py-3 active:scale-[0.99] transition-transform"
        >
          <span className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-narges-green/10 flex items-center justify-center">
              <LayoutGrid size={17} className="text-narges-green" />
            </span>
            <span className="text-right">
              <span className="block text-sm font-bold text-narges-text">تصفّح جميع الأقسام</span>
              <span className="block text-[11px] text-narges-text-secondary">مع الأقسام الفرعية لكل قسم</span>
            </span>
          </span>
          <ChevronLeft size={18} className="text-narges-green" />
        </button>

        {/* بنر كل قسم + منتجاته — بالترتيب الذكي */}
        {catSections.length === 0
          ? [1, 2].map((i) => <div key={i} className="h-64 rounded-[20px] skeleton" />)
          : catSections.map(({ cat, products }, idx) => (
              <section key={cat.id} className={`anim-fade-up anim-d${Math.min(idx + 3, 6)}`}>
                <button
                  onClick={() => navigate(`/Customer/category/${cat.id}`)}
                  className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 mb-3 active:scale-[0.99] transition-transform"
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
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
                  {products.map((p) => (
                    <div key={p.id} className="flex-shrink-0 w-40">
                      <ProductCard product={p} size="small" />
                    </div>
                  ))}
                </div>
              </section>
            ))}
      </div>

      <BottomNav />
    </div>
  );
}
