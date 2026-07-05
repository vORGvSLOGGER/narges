import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Building2 } from 'lucide-react';
import { fetchBrands } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import BottomNav from '../components/BottomNav';

const SORTS = [
  { id: 'alpha', label: 'أبجدي أ-ي' },
  { id: 'oldest', label: 'الأقدم تأسيساً' },
];

export default function BrandsPage() {
  const navigate = useNavigate();
  const { data: brands, loading } = useFetch(fetchBrands, [], []);
  const [sort, setSort] = useState('alpha');

  const sorted = [...(brands || [])].sort((a, b) => {
    if (sort === 'oldest') return (a.foundedYear || 9999) - (b.foundedYear || 9999);
    return a.nameAr.localeCompare(b.nameAr, 'ar');
  });

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-narges-bg pb-24 anim-fade-up">
      {/* الترويسة */}
      <div className="sticky top-0 z-40 bg-narges-surface shadow-narges-sm px-4 py-3 flex items-center gap-2">
        <Building2 size={18} className="text-narges-green" />
        <h1 className="text-lg font-bold flex-1">الشركات</h1>
        <span className="text-xs font-bold text-narges-green bg-narges-green/10 px-2.5 py-1 rounded-full">
          {sorted.length} شركة شريكة
        </span>
      </div>

      {/* شرائح الفرز */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pt-3 pb-1">
        {SORTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSort(s.id)}
            className={`flex-shrink-0 text-xs font-bold px-3.5 py-2 rounded-full transition-colors ${
              sort === s.id
                ? 'bg-narges-green text-white shadow-narges-green'
                : 'bg-narges-surface border border-narges-border text-narges-text-secondary'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* البطاقات */}
      <div className="px-4 pt-3 space-y-3">
        {loading && sorted.length === 0
          ? [1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-2xl skeleton" />)
          : sorted.map((b, i) => (
              <button
                key={b.id}
                onClick={() => navigate(`/Customer/brand/${b.id}`)}
                className={`w-full card card-press p-4 flex items-center gap-3 text-right anim-fade-up anim-d${Math.min(i + 1, 6)}`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                  style={{ backgroundColor: b.tint }}
                >
                  {b.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-narges-text">{b.nameAr}</p>
                    <span className="text-[10px] text-narges-muted" dir="ltr">{b.nameEn}</span>
                  </div>
                  <p className="text-[11px] text-narges-text-secondary mt-0.5">
                    {b.country} · تأسست {b.foundedYear} <span className="text-narges-muted">({year - b.foundedYear} عاماً)</span>
                  </p>
                  <p className="text-[11px] text-narges-muted mt-1 line-clamp-1">💡 {b.blurb}</p>
                </div>
                <div className="text-left shrink-0">
                  <p className="font-bold text-narges-green text-lg leading-none">{b.productCount}</p>
                  <p className="text-[10px] text-narges-text-secondary">منتج</p>
                  <ChevronLeft size={14} className="text-narges-muted mt-1 mr-auto" />
                </div>
              </button>
            ))}
      </div>

      <BottomNav />
    </div>
  );
}
