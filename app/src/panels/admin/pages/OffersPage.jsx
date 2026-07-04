import { useState, useEffect, useCallback } from 'react';
import { Search, Tag, Flame, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProducts, updateProduct } from '../../../lib/api';
import { formatSAR } from '../../../utils/formatters';

const PRESETS = [10, 15, 20, 25, 30, 50];

export default function OffersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setProducts(await fetchProducts());
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);

  const onOffer = products.filter((p) => p.isOffer);
  const list = (search
    ? products.filter((p) => p.nameAr.includes(search))
    : onOffer.length
      ? [...onOffer, ...products.filter((p) => !p.isOffer)]
      : products
  ).slice(0, 40);

  // تفعيل خصم بنسبة مئوية على منتج — يظهر فوراً للعملاء
  const applyDiscount = async (p, pct) => {
    setBusyId(p.id);
    try {
      const base = p.isOffer ? p.originalPrice : p.price;
      const newPrice = Math.round(base * (1 - pct / 100) * 4) / 4; // تقريب لربع ريال
      await updateProduct(p.id, { price: newPrice, originalPrice: base, isOffer: true });
      setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, price: newPrice, originalPrice: base, isOffer: true } : x)));
      toast.success(`عرض ${pct}% على «${p.nameAr}» 🔥`);
    } catch (e) {
      toast.error('تعذّر التفعيل: ' + e.message);
    } finally {
      setBusyId(null);
    }
  };

  // إنهاء العرض وإرجاع السعر الأصلي
  const endOffer = async (p) => {
    setBusyId(p.id);
    try {
      await updateProduct(p.id, { price: p.originalPrice, isOffer: false });
      setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, price: p.originalPrice, isOffer: false } : x)));
      toast.success('انتهى العرض ورجع السعر الأصلي');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة العروض</h1>
          <p className="text-narges-text-secondary text-sm mt-0.5">فعّل خصماً على أي منتج — يظهر للعملاء فوراً مع شارة الخصم</p>
        </div>
        <div className="flex items-center gap-2 bg-narges-orange/10 text-narges-orange px-3 py-2 rounded-xl text-sm font-bold">
          <Flame size={16} /> {onOffer.length} عرض نشط
        </div>
      </div>

      <div className="flex items-center gap-2 bg-narges-surface border border-narges-border rounded-xl px-3 py-2 max-w-md">
        <Search size={16} className="text-narges-text-secondary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن منتج لتفعيل عرض عليه..." className="flex-1 bg-transparent text-sm focus:outline-none" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-2xl skeleton" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {list.map((p) => {
            const pct = p.isOffer && p.originalPrice > 0 ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
            return (
              <div key={p.id} className={`card p-3.5 flex items-center gap-3 anim-fade-up ${p.isOffer ? 'border-narges-orange/40' : ''}`}>
                <img src={p.image} alt={p.nameAr} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{p.nameAr}</p>
                  <p className="text-xs text-narges-text-secondary mt-0.5">
                    <span className="font-bold text-narges-green">{formatSAR(p.price)}</span>
                    {p.isOffer && <span className="line-through mr-2 text-narges-muted">{formatSAR(p.originalPrice)}</span>}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.isOffer ? (
                      <>
                        <span className="badge-offer">-{pct}% نشط</span>
                        <button disabled={busyId === p.id} onClick={() => endOffer(p)} className="flex items-center gap-1 text-[11px] font-bold bg-narges-surface2 text-narges-text px-2.5 py-1 rounded-full disabled:opacity-50">
                          <X size={11} /> إنهاء العرض
                        </button>
                      </>
                    ) : (
                      PRESETS.map((d) => (
                        <button key={d} disabled={busyId === p.id} onClick={() => applyDiscount(p, d)} className="text-[11px] font-bold bg-narges-green/10 text-narges-green hover:bg-narges-green hover:text-white px-2.5 py-1 rounded-full transition-colors disabled:opacity-50">
                          -{d}%
                        </button>
                      ))
                    )}
                  </div>
                </div>
                {p.isOffer && <Tag size={18} className="text-narges-orange shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
