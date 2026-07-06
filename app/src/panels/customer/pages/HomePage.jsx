import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Truck, ShieldCheck, Gift } from 'lucide-react';
import { fetchCategories, fetchFeatured, fetchOffers } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import { useLoyaltyStore, TIERS } from '../../../store/useLoyaltyStore';
import { useSettingsStore } from '../../../store/useSettingsStore';
import ProductCard from '../components/ProductCard';
import FlashDeals from '../components/FlashDeals';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const TIER_ICONS = { bronze: '🥉', silver: '🥈', gold: '🥇' };

const promos = [
  { id: 1, badge: 'عرض اليوم', title: 'خصم حتى 30%', sub: 'على الفواكه والخضار', emoji: '🏷️', grad: 'linear-gradient(120deg,#FF7A00,#FF9D3D)' },
  { id: 2, badge: 'حصري للأعضاء', title: 'توصيل مجاني', sub: 'لطلبات فوق 75 ر.س', emoji: '🚚', grad: 'linear-gradient(120deg,#0E1217,#2E7D32)' },
  { id: 3, badge: 'جديدنا', title: 'منتجات طازجة', sub: 'تصلك كل صباح', emoji: '🥬', grad: 'linear-gradient(120deg,#1565C0,#42A5F5)' },
];

// ترويسة قسم بشريط تمييز أخضر + رابط «عرض الكل»
function SectionHeader({ title, onAll }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-5 rounded-full bg-narges-green" />
        <h2 className="text-[17px] font-bold text-narges-text">{title}</h2>
      </div>
      {onAll && (
        <button onClick={onAll} className="text-narges-green text-xs font-bold flex items-center gap-0.5 active:scale-95 transition-transform">
          عرض الكل <ChevronLeft size={15} />
        </button>
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { data: featuredAll, loading: loadingFeatured } = useFetch(fetchFeatured, [], []);
  const { data: offersAll, loading: loadingOffers } = useFetch(fetchOffers, [], []);
  const { data: categories } = useFetch(fetchCategories, [], []);
  const featured = (featuredAll || []).slice(0, 8);
  const offers = (offersAll || []).slice(0, 8);
  const points = useLoyaltyStore((s) => s.points);
  const tier = useLoyaltyStore((s) => TIERS.findLast((t) => s.points >= t.minPoints) || TIERS[0]);
  const delivery = useSettingsStore((s) => s.settings.delivery);

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
        {/* شريط البحث البارز */}
        <button
          onClick={() => navigate('/Customer/search')}
          className="anim-fade-up w-full flex items-center gap-2.5 bg-narges-surface border border-narges-border rounded-2xl px-4 py-3 shadow-narges-sm active:scale-[0.99] transition-transform"
        >
          <Search size={18} className="text-narges-green" />
          <span className="text-sm text-narges-muted">ابحث عن منتج، قسم أو ماركة...</span>
        </button>

        {/* بطاقة الولاء */}
        <button
          onClick={() => navigate('/Customer/loyalty')}
          className="anim-fade-up anim-d1 w-full text-right rounded-3xl p-5 text-white relative overflow-hidden shadow-narges-green"
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

        {/* بطاقات العروض */}
        <div className="anim-fade-up anim-d2 flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1">
          {promos.map((b) => (
            <div key={b.id} className="flex-shrink-0 w-60 rounded-[20px] p-4 text-white relative overflow-hidden" style={{ background: b.grad }}>
              <span className="anim-float absolute -top-4 -left-2 text-[80px] opacity-[0.16] leading-none">{b.emoji}</span>
              <span className="relative inline-block bg-white/25 text-[11px] font-bold px-2.5 py-1 rounded-full">{b.badge}</span>
              <p className="relative font-bold text-[19px] mt-2.5 leading-snug">{b.title}<br />{b.sub}</p>
            </div>
          ))}
        </div>

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

        {/* الأقسام */}
        <section className="anim-fade-up anim-d4">
          <SectionHeader title="تسوّق حسب القسم" onAll={() => navigate('/Customer/categories')} />
          <div className="grid grid-cols-4 gap-x-2 gap-y-4">
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/Customer/category/${cat.id}`)}
                className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <div className="w-[62px] h-[62px] rounded-2xl flex items-center justify-center text-[28px] shadow-narges-sm" style={{ backgroundColor: cat.color }}>
                  {cat.icon}
                </div>
                <span className="text-[11px] text-narges-text-secondary font-semibold text-center leading-tight">{cat.nameAr}</span>
              </button>
            ))}
          </div>
        </section>

        {/* عروض الفلاش */}
        <div className="anim-fade-up anim-d5"><FlashDeals products={offers} /></div>

        {/* العروض الحصرية */}
        <section className="anim-fade-up anim-d6">
          <SectionHeader title="🔥 العروض الحصرية" onAll={() => navigate('/Customer/categories')} />
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {loadingOffers && offers.length === 0
              ? [1, 2, 3].map((i) => <div key={i} className="flex-shrink-0 w-40 h-56 rounded-[20px] skeleton" />)
              : offers.map((p) => (
                  <div key={p.id} className="flex-shrink-0 w-40">
                    <ProductCard product={p} size="small" />
                  </div>
                ))}
          </div>
        </section>

        {/* الأكثر مبيعاً */}
        <section className="anim-fade-up anim-d6">
          <SectionHeader title="⭐ الأكثر مبيعاً" onAll={() => navigate('/Customer/categories')} />
          <div className="grid grid-cols-2 gap-3">
            {loadingFeatured && featured.length === 0
              ? [1, 2, 3, 4].map((i) => <div key={i} className="h-60 rounded-[20px] skeleton" />)
              : featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
