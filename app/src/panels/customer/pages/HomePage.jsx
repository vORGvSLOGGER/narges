import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { fetchCategories, fetchFeatured, fetchOffers } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import { useLoyaltyStore, TIERS } from '../../../store/useLoyaltyStore';
import ProductCard from '../components/ProductCard';
import FlashDeals from '../components/FlashDeals';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const TIER_ICONS = { bronze: '🥉', silver: '🥈', gold: '🥇' };

// بطاقتا العروض (تطابق نظام التصميم)
const promos = [
  { id: 1, badge: 'عرض اليوم', title: 'خصم حتى 30%', sub: 'على الفواكه والخضار', emoji: '🏷️', grad: 'linear-gradient(120deg,#FF7A00,#FF9D3D)' },
  { id: 2, badge: 'حصري للأعضاء', title: 'توصيل مجاني', sub: 'لطلبات فوق 75 ر.س', emoji: '🚚', grad: 'linear-gradient(120deg,#0E1217,#2E7D32)' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: featuredAll, loading: loadingFeatured } = useFetch(fetchFeatured, [], []);
  const { data: offersAll, loading: loadingOffers } = useFetch(fetchOffers, [], []);
  const { data: categories } = useFetch(fetchCategories, [], []);
  const featured = (featuredAll || []).slice(0, 8);
  const offers = (offersAll || []).slice(0, 8);
  const points = useLoyaltyStore(s => s.points);
  const tier = useLoyaltyStore(s => TIERS.findLast(t => s.points >= t.minPoints) || TIERS[0]);

  // تقدّم المستوى التالي
  const nextTier = TIERS.find(t => t.minPoints > points);
  const floor = tier.minPoints;
  const ceil = nextTier ? nextTier.minPoints : tier.minPoints;
  const pct = nextTier ? Math.min(100, Math.round(((points - floor) / (ceil - floor)) * 100)) : 100;
  const remaining = nextTier ? ceil - points : 0;

  return (
    <div className="min-h-screen bg-narges-bg pb-24">
      <TopBar />

      <div className="px-4 pt-3 space-y-5">
        {/* بطاقة الولاء */}
        <button
          onClick={() => navigate('/Customer/loyalty')}
          className="w-full text-right rounded-3xl p-5 text-white relative overflow-hidden shadow-narges-green"
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
              <div className="h-full bg-narges-surface rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-[11px] mt-1.5 text-white/95">
              <span>{nextTier ? `${remaining} نقطة تفصلك عن ${nextTier.label}` : 'أعلى مستوى 🎉'}</span>
              <span>{pct}%</span>
            </div>
          </div>
        </button>

        {/* بطاقات العروض */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1">
          {promos.map(b => (
            <div
              key={b.id}
              className="flex-shrink-0 w-60 rounded-[20px] p-4 text-white relative overflow-hidden"
              style={{ background: b.grad }}
            >
              <span className="absolute -top-4 -left-2 text-[80px] opacity-[0.16] leading-none">{b.emoji}</span>
              <span className="relative inline-block bg-white/25 text-[11px] font-bold px-2.5 py-1 rounded-full">{b.badge}</span>
              <p className="relative font-bold text-[19px] mt-2.5 leading-snug">{b.title}<br />{b.sub}</p>
            </div>
          ))}
        </div>

        {/* عروض الفلاش (عدّاد تنازلي) */}
        <FlashDeals products={offers} />

        {/* الأقسام */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-narges-text">تسوّق حسب القسم</h2>
            <button onClick={() => navigate('/Customer/categories')} className="text-narges-green text-xs font-bold flex items-center gap-0.5">
              عرض الكل <ChevronLeft size={15} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-x-1.5 gap-y-4">
            {categories.slice(0, 8).map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/Customer/category/${cat.id}`)}
                className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <div className="w-[60px] h-[60px] rounded-[19px] flex items-center justify-center text-[28px]" style={{ backgroundColor: cat.color }}>
                  {cat.icon}
                </div>
                <span className="text-[11px] text-narges-text-secondary font-semibold text-center leading-tight">{cat.nameAr}</span>
              </button>
            ))}
          </div>
        </section>

        {/* العروض الحصرية */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-narges-text">🔥 العروض الحصرية</h2>
            <button className="text-narges-green text-xs font-bold flex items-center gap-0.5">عرض الكل <ChevronLeft size={15} /></button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {loadingOffers && offers.length === 0
              ? [1, 2, 3].map(i => <div key={i} className="flex-shrink-0 w-40 h-56 card animate-pulse" />)
              : offers.map(p => (
                  <div key={p.id} className="flex-shrink-0 w-40">
                    <ProductCard product={p} size="small" />
                  </div>
                ))}
          </div>
        </section>

        {/* الأكثر مبيعاً */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-narges-text">⭐ الأكثر مبيعاً</h2>
            <button className="text-narges-green text-xs font-bold flex items-center gap-0.5">عرض الكل <ChevronLeft size={15} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {loadingFeatured && featured.length === 0
              ? [1, 2, 3, 4].map(i => <div key={i} className="h-60 card animate-pulse" />)
              : featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
