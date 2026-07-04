import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, PackageSearch, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOrderStore } from '../../../store/useOrderStore';
import { useCartStore } from '../../../store/useCartStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { isSupabaseConfigured } from '../../../lib/supabase';
import { fetchProducts } from '../../../lib/api';
import { formatSAR, formatRelativeTime } from '../../../utils/formatters';
import StatusBadge from '../../../components/shared/StatusBadge';
import BottomNav from '../components/BottomNav';

const ACTIVE = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up'];

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, loadOrders, loading } = useOrderStore();
  const addItem = useCartStore((s) => s.addItem);
  const session = useAuthStore((s) => s.session);
  const [reordering, setReordering] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // إعادة الطلب: نثري العناصر بصور المنتجات ثم نعبّئ السلة
  const handleReorder = async (order) => {
    setReordering(order.id);
    try {
      const all = await fetchProducts();
      const byId = Object.fromEntries(all.map((p) => [p.id, p]));
      let added = 0;
      for (const it of order.items || []) {
        const p = byId[it.productId] || {
          id: it.productId || `re-${Date.now()}-${added}`,
          nameAr: it.nameAr,
          price: it.unitPrice,
          unit: '',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80',
        };
        addItem(p, it.qty);
        added += it.qty;
      }
      toast.success(`أُضيف ${added} منتجاً للسلة 🛒`);
      navigate('/Customer/cart');
    } catch {
      toast.error('تعذّرت إعادة الطلب');
    } finally {
      setReordering(null);
    }
  };

  const needLogin = isSupabaseConfigured && !session;

  return (
    <div className="min-h-screen bg-narges-bg anim-fade-up pb-24">
      <div className="sticky top-0 z-40 bg-narges-surface shadow-narges-sm px-4 py-3">
        <h1 className="text-lg font-bold">طلباتي</h1>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {needLogin ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <PackageSearch size={56} className="text-narges-muted" />
            <p className="font-bold text-narges-text">سجّل الدخول لعرض طلباتك</p>
            <p className="text-sm text-narges-text-secondary">تاريخ طلباتك محفوظ في حسابك</p>
            <button onClick={() => navigate('/login', { state: { from: '/Customer/orders' } })} className="btn-primary px-8 mt-2">
              تسجيل الدخول
            </button>
          </div>
        ) : loading && orders.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl skeleton h-28" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <span className="text-6xl">🧾</span>
            <p className="font-bold text-narges-text">لا توجد طلبات بعد</p>
            <p className="text-sm text-narges-text-secondary">أول طلب لك يبعد دقائق فقط</p>
            <button onClick={() => navigate('/Customer')} className="btn-primary px-8 mt-2">تسوق الآن</button>
          </div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex items-center justify-between">
                <StatusBadge status={o.status} />
                <span className="text-xs text-narges-text-secondary">{formatRelativeTime(o.createdAt)}</span>
              </div>
              <p className="text-sm text-narges-text-secondary mt-2 line-clamp-1">
                {(o.items || []).slice(0, 2).map((i) => i.nameAr).join('، ')}
                {(o.items || []).length > 2 && ` +${o.items.length - 2}`}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-narges-green">{formatSAR(o.total)}</span>
                <div className="flex items-center gap-2">
                  {ACTIVE.includes(o.status) && (
                    <button
                      onClick={() => navigate(`/Customer/tracking/${o.id}`)}
                      className="flex items-center gap-1 text-xs font-bold text-narges-green bg-narges-green/10 px-3 py-2 rounded-xl"
                    >
                      تتبّع <ChevronLeft size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => handleReorder(o)}
                    disabled={reordering === o.id}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-narges-green px-3 py-2 rounded-xl disabled:opacity-60"
                  >
                    <RotateCcw size={13} />
                    {reordering === o.id ? 'جارٍ...' : 'اطلب مجدداً'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
