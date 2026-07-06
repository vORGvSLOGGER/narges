import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Truck, ShieldCheck, Gift, Lock, LayoutGrid } from 'lucide-react';
import { fetchCategories, fetchOffers, fetchProducts } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import { useLoyaltyStore, TIERS } from '../../../store/useLoyaltyStore';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { isSupabaseConfigured } from '../../../lib/supabase';
import ProductCard from '../components/ProductCard';
import FlashDeals from '../components/FlashDeals';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const TIER_ICONS = { bronze: '🥉', silver: '🥈', gold: '🥇' };

export default function HomePage() {
  const navigate = useNavigate();
  const { data: offersAll, loading: loadingOffers } = useFetch(fetchOffers, [], []);
  const { data: categories } = useFetch(fetchCategories, [], []);
  const { data: allProducts } = useFetch(fetchProducts, [], []);
  const offers = (offersAll || []).slice(0, 8);
  const points = useLoyaltyStore((s) => s.points);
  const tier = useLoyaltyStore((s) => TIERS.findLast((t) => s.points >= t.minPoints) || TIERS[0]);
  const delivery = useSettingsStore((s) => s.settings.delivery);
  const session = useAuthStore((s) => s.session);
  const loggedIn = !isSupabaseConfigured || !!session;

  // منتجات كل قسم (بنر القسم + صف منتجاته)
  const catSections = useMemo(() => {
    const byCat = new Map();
    for (const p of allProducts || []) {
      if (!byCat.has(p.categoryId)) byCat.set(p.categoryId, []);
      byCat.get(p.categoryId).push(p);
    }
    return (categories || [])
      .map((c) => ({ cat: c, products: (byCat.get(c.id) || []).slice(0, 8) }))
      .filter((s) => s.products.length > 0)
      .slice(0, 6);
  }, [categories, allProducts]);

  const nextTier = TIERS.find((t) => t.minPoints > points);
  const floor = tier.minPoints;
  const ceil = nextTier ? nextTier.minPoints : tier.minPoints;
  const pct = nextTier ? Math.min(100, Math.round(((points - floor) / (ceil - floor)) * 100)) : 100;
  const remaining = nextTier ? ceil - points : 0;

  const benefits = [
    { icon: Truck, t: 'توصيل سريع', s: `خلال ${delivery.etaMinutes} دقيقة` },
    { icon: Gift, t: 'توصيل مجاني', s: `فوق ${delivery.freeAt} ر.س` },
    { icon: ShieldCheck, t: 'دفع آمن', s: 'كل الوسائل' },
  ];

  return (
    <div className="min-h-screen bg-narges-bg pb-24">
      <TopBar />

      <div className="px-4 pt-3 space-y-5">
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

        {/* بطاقة الولاء — مقفلة للزائر */}
        {loggedIn ? (
          <button
            onClick={() => navigate('/Customer/loyalty')}
            className="anim-fade-up anim-d2 w-full text-right rounded-3xl p-5 text-white relative overflow-hidden shadow-narges-green"
            style={{ background: 'linear-gradient(135deg,#1B5E20,#2E7D32 45%,#66BB6A)' }}
          >
            <div className="absolute -top-8 -left-5 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 left-10 w-24 h-24 rounded-full bg-white/[0.07]" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-white/90 text-xs">رصيد نقاط الولاء</p>
                <p className="text-3xl font-bold mt-0.5 leading-tight">
                  {points.toLocaleString('en-US')} <span className="text-sm font-semibold">نقطة</span>
                </p>
              </div>
              <span className="bg-white/[0.18] border border-white/30 px-3 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap">
                {TIER_ICONS[tier.id]} عضوية {tier.label}
              </span>
            </div>
            <div className="relative mt-4">
              <div className="h-2 bg-white/25 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-[11px] mt-1.5 text-white/95">
                <span>{nextTier ? `${remaining} نقطة تفصلك عن ${nextTier.label}` : 'أعلى مستوى 🎉'}</span>
                <span>{pct}%</span>
              </div>
            </div>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login', { state: { from: '/Customer' } })}
            className="anim-fade-up anim-d2 w-full text-right rounded-3xl p-5 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#37474F,#546E7A)' }}
          >
            <div className="absolute -top-8 -left-5 w-32 h-32 rounded-full bg-white/[0.08]" />
            <div className="relative flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0">
                <Lock size={20} />
              </span>
              <div className="flex-1">
                <p className="font-bold text-[15px]">نقاط الولاء مقفلة 🔒</p>
                <p className="text-white/80 text-xs mt-0.5">سجّل دخولك واكسب نقاطاً مع كل طلب تتحول لخصم بالريال</p>
              </div>
              <span className="bg-white text-narges-green text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">دخول</span>
            </div>
          </button>
        )}

        {/* شريط المزايا */}
        <div className="anim-fade-up anim-d3 grid grid-cols-3 gap-2.5">
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

        {/* زر كل الأقسام — وصول سريع قبل الأقسام */}
        <button
          onClick={() => navigate('/Customer/categories')}
          className="anim-fade-up anim-d4 w-full flex items-center justify-between bg-narges-surface border-2 border-dashed border-narges-green/40 rounded-2xl px-4 py-3 active:scale-[0.99] transition-transform"
        >
          <span className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-narges-green/10 flex items-center justify-center">
              <LayoutGrid size={17} className="text-narges-green" />
            </span>
            <span className="text-sm font-bold text-narges-text">تصفّح جميع الأقسام</span>
          </span>
          <ChevronLeft size={18} className="text-narges-green" />
        </button>

        {/* بنر كل قسم + منتجاته */}
        {catSections.length === 0
          ? [1, 2].map((i) => <div key={i} className="h-64 rounded-[20px] skeleton" />)
          : catSections.map(({ cat, products }, idx) => (
              <section key={cat.id} className={`anim-fade-up anim-d${Math.min(idx + 4, 6)}`}>
                {/* بنر القسم */}
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
                {/* منتجات القسم */}
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
