import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star } from 'lucide-react';
import { fetchCategories, fetchFeatured, fetchOffers } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import { useLoyaltyStore, TIERS } from '../../../store/useLoyaltyStore';
import ProductCard from '../components/ProductCard';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const TIER_ICONS = { bronze: '🥉', silver: '🥈', gold: '🥇' };

const offerBanners = [
  { id: 1, title: 'خصم 20% على الفواكه والخضروات', subtitle: 'لفترة محدودة', bg: 'from-green-600 to-green-400', emoji: '🥦' },
  { id: 2, title: 'توصيل مجاني على طلبات +100 ر.س', subtitle: 'طوال هذا الأسبوع', bg: 'from-orange-500 to-yellow-400', emoji: '🚗' },
  { id: 3, title: 'عروض يومية على الألبان', subtitle: 'أرخص سعر مضمون', bg: 'from-blue-600 to-blue-400', emoji: '🥛' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: featuredAll } = useFetch(fetchFeatured, [], []);
  const { data: offersAll } = useFetch(fetchOffers, [], []);
  const { data: categories } = useFetch(fetchCategories, [], []);
  const featured = (featuredAll || []).slice(0, 8);
  const offers = (offersAll || []).slice(0, 8);
  const points = useLoyaltyStore(s => s.points);
  const tier = useLoyaltyStore(s => TIERS.findLast(t => s.points >= t.minPoints) || TIERS[0]);

  return (
    <div className="min-h-screen bg-narjis-bg pb-20">
      <TopBar />

      <div className="px-4 pt-3 space-y-5">
        {/* Loyalty Banner */}
        <button
          onClick={() => navigate('/Customer/loyalty')}
          className="w-full flex items-center justify-between bg-gradient-to-l from-narjis-green to-narjis-green-mid rounded-2xl px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{TIER_ICONS[tier.id]}</span>
            <div className="text-right">
              <p className="text-white font-bold text-sm">نقاط الولاء</p>
              <p className="text-white/70 text-xs">مستوى {tier.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-xl">{points}</span>
            <span className="text-white/70 text-xs">نقطة</span>
            <ChevronLeft size={16} className="text-white/50" />
          </div>
        </button>
        {/* Hero Banners */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {offerBanners.map(b => (
            <div
              key={b.id}
              className={`flex-shrink-0 w-72 h-32 rounded-2xl bg-gradient-to-r ${b.bg} p-4 flex items-center justify-between cursor-pointer active:scale-98 transition-transform`}
            >
              <div className="text-white">
                <p className="font-bold text-base leading-tight">{b.title}</p>
                <p className="text-white/80 text-sm mt-1">{b.subtitle}</p>
                <button className="mt-2 bg-white/20 text-white text-xs px-3 py-1 rounded-full">اطلب الآن</button>
              </div>
              <span className="text-5xl">{b.emoji}</span>
            </div>
          ))}
        </div>

        {/* Categories Grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title mb-0">تسوق حسب القسم</h2>
            <button
              onClick={() => navigate('/Customer/categories')}
              className="text-narjis-light text-sm font-medium flex items-center gap-0.5"
            >
              الكل <ChevronLeft size={16} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {categories.slice(0, 8).map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/Customer/category/${cat.id}`)}
                className="flex flex-col items-center gap-1.5 p-2 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.icon}
                </div>
                <span className="text-xs text-narjis-text font-medium text-center leading-tight">{cat.nameAr}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Offers */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title mb-0">🔥 العروض الحصرية</h2>
            <button className="text-narjis-light text-sm font-medium flex items-center gap-0.5">
              الكل <ChevronLeft size={16} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {offers.map(p => (
              <div key={p.id} className="flex-shrink-0 w-36">
                <ProductCard product={p} size="small" />
              </div>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title mb-0">⭐ الأكثر مبيعاً</h2>
            <button className="text-narjis-light text-sm font-medium flex items-center gap-0.5">
              الكل <ChevronLeft size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
