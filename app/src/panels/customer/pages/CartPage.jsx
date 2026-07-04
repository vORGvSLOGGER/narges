import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trash2, Plus, Minus, Tag, TicketPercent, X } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../../../store/useCartStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { useLoyaltyStore } from '../../../store/useLoyaltyStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { createOrder, validateCoupon } from '../../../lib/api';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { isSupabaseConfigured } from '../../../lib/supabase';
import { formatSAR } from '../../../utils/formatters';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'cash', label: 'نقداً', icon: '💵' },
  { id: 'card', label: 'بطاقة بنكية', icon: '💳' },
  { id: 'stc_pay', label: 'STC Pay', icon: '📱' },
  { id: 'apple_pay', label: 'Apple Pay', icon: '🍎' },
];

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, clearCart } = useCartStore();
  const addOrder = useOrderStore(s => s.addOrder);
  const { addPoints, pendingDiscount, clearPendingDiscount } = useLoyaltyStore();
  const { session, user, profile } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [address, setAddress] = useState('حي الروضة، شارع الأمير محمد، مبنى 12');
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null); // { code, discount }
  const [couponBusy, setCouponBusy] = useState(false);
  const delivery = useSettingsStore((s) => s.settings.delivery);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  // رسوم وعتبة التوصيل المجاني من إعدادات الأدمن
  const FREE_DELIVERY_AT = delivery.freeAt;
  const freeDelivery = subtotal >= FREE_DELIVERY_AT;
  const deliveryFee = items.length > 0 && !freeDelivery ? delivery.fee : 0;
  const couponDiscount = coupon ? Math.min(coupon.discount, subtotal) : 0;

  const applyCoupon = async () => {
    setCouponBusy(true);
    try {
      const c = await validateCoupon(couponCode, subtotal);
      setCoupon({ code: c.code, discount: c.discount });
      toast.success(`قسيمة ${c.code} مفعّلة 🎟️`);
    } catch (err) {
      setCoupon(null);
      toast.error(err.message);
    } finally {
      setCouponBusy(false);
    }
  };
  const loyaltyDiscount = pendingDiscount;
  const total = Math.max(0, subtotal + deliveryFee - loyaltyDiscount - couponDiscount);

  const handleConfirmOrder = async () => {
    if (!items.length || placing) return;

    // يتطلب تسجيل الدخول عند تفعيل Supabase
    if (isSupabaseConfigured && !session) {
      toast('سجّل الدخول لإتمام الطلب');
      navigate('/login', { state: { from: '/Customer/cart' } });
      return;
    }

    const customerName = profile?.full_name || 'عميل نرجس';
    const customerPhone = profile?.phone || '';
    const orderItems = items.map(i => ({ productId: i.id, nameAr: i.nameAr, qty: i.qty, unitPrice: i.price, totalPrice: i.price * i.qty }));

    setPlacing(true);
    let createdId = null;
    try {
      // الحفظ في Supabase (عند التهيئة وتسجيل الدخول)
      if (isSupabaseConfigured && user) {
        const dbOrder = await createOrder({
          customerName,
          customerPhone,
          address: { street: address, district: 'حي الروضة', city: 'الرياض' },
          items: orderItems,
          subtotal,
          deliveryFee,
          discount: loyaltyDiscount + couponDiscount,
          total,
          paymentMethod,
          notes: coupon ? `قسيمة: ${coupon.code}` : '',
        }, user.id);
        createdId = dbOrder?.id || null;
      }
    } catch (err) {
      toast.error('تعذّر حفظ الطلب: ' + err.message);
      setPlacing(false);
      return;
    }

    // سجل محلي لتتبّع الطلب في الواجهة — نستخدم نفس مُعرّف القاعدة عند توفّره
    const order = addOrder({
      ...(createdId ? { id: createdId } : {}),
      customerName,
      customerPhone,
      deliveryAddress: { street: address, district: 'حي الروضة', city: 'الرياض' },
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
    });
    addPoints(total);
    clearPendingDiscount();
    clearCart();
    setPlacing(false);
    navigate(`/Customer/tracking/${order.id}`, { replace: true, state: { placed: true } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-narges-bg flex flex-col">
        <div className="bg-narges-surface px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-40">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center">
            <ArrowRight size={18} />
          </button>
          <h1 className="text-lg font-bold">سلة التسوق</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <span className="text-7xl">🛒</span>
          <h2 className="text-xl font-bold text-narges-text">السلة فارغة</h2>
          <p className="text-narges-text-secondary text-center">أضف منتجات من المتجر لتظهر هنا</p>
          <button onClick={() => navigate('/Customer')} className="btn-primary px-8">تسوق الآن</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-narges-bg flex flex-col pb-40">
      {/* Header */}
      <div className="bg-narges-surface px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center">
          <ArrowRight size={18} />
        </button>
        <h1 className="text-lg font-bold flex-1">سلة التسوق</h1>
        <span className="text-sm text-narges-text-secondary">{items.length} منتج</span>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Items */}
        <div className="card divide-y divide-narges-border">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3">
              <img src={item.image} alt={item.nameAr} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-narges-text line-clamp-2">{item.nameAr}</p>
                <p className="text-narges-green font-bold mt-1">{formatSAR(item.price)}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button onClick={() => removeItem(item.id)} className="text-red-400 active:scale-90 transition-transform">
                  <Trash2 size={14} />
                </button>
                <div className="flex items-center gap-2 bg-narges-bg rounded-lg p-0.5">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-md bg-narges-surface flex items-center justify-center">
                    <Minus size={12} />
                  </button>
                  <span className="w-5 text-center font-bold text-sm">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-md bg-narges-light flex items-center justify-center">
                    <Plus size={12} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Free delivery progress */}
        <div className={`card p-4 ${freeDelivery ? 'border-narges-green/40' : ''}`}>
          {freeDelivery ? (
            <p className="text-sm font-bold text-narges-green flex items-center gap-2">
              🎉 مبروك! التوصيل مجاني على هذا الطلب
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold text-narges-text flex items-center gap-2">
                🚚 أضف <span className="text-narges-orange font-bold">{formatSAR(FREE_DELIVERY_AT - subtotal)}</span> للتوصيل المجاني
              </p>
              <div className="h-2 bg-narges-surface2 rounded-full overflow-hidden mt-2.5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_AT) * 100)}%`, background: 'linear-gradient(90deg,#FF7A00,#FF9D3D)' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Address */}
        <div className="card p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span>📍</span> عنوان التوصيل
          </h3>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narges-light"
            placeholder="أدخل عنوانك..."
          />
        </div>

        {/* Payment Method */}
        <div className="card p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span>💳</span> طريقة الدفع
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map(m => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === m.id ? 'border-narges-green bg-narges-green/10' : 'border-narges-border bg-narges-surface'
                }`}
              >
                <span>{m.icon}</span>
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Coupon */}
        <div className="card p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <TicketPercent size={17} className="text-narges-orange" /> قسيمة خصم
          </h3>
          {coupon ? (
            <div className="flex items-center justify-between bg-narges-green/10 border border-narges-green/30 rounded-xl px-3 py-2.5 anim-pop">
              <span className="text-sm font-bold text-narges-green">🎟️ {coupon.code} — خصم {formatSAR(couponDiscount)}</span>
              <button onClick={() => { setCoupon(null); setCouponCode(''); }} className="text-narges-text-secondary">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="أدخل رمز القسيمة"
                dir="ltr"
                className="flex-1 border border-narges-border rounded-xl px-3 py-2.5 text-sm text-center font-bold tracking-widest focus:outline-none focus:border-narges-light"
              />
              <button
                onClick={applyCoupon}
                disabled={couponBusy || !couponCode.trim()}
                className="btn-primary py-2.5 px-5 text-sm disabled:opacity-50"
              >
                {couponBusy ? '...' : 'تطبيق'}
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="card p-4 space-y-2">
          <h3 className="font-bold mb-3">ملخص الطلب</h3>
          <div className="flex justify-between text-sm">
            <span className="text-narges-text-secondary">المجموع الفرعي</span>
            <span>{formatSAR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-narges-text-secondary">رسوم التوصيل</span>
            {deliveryFee === 0 && items.length > 0
              ? <span className="text-narges-green font-bold">مجاني 🎉</span>
              : <span>{formatSAR(deliveryFee)}</span>}
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-sm text-narges-green font-medium">
              <span>خصم قسيمة {coupon.code} 🎟️</span>
              <span>- {formatSAR(couponDiscount)}</span>
            </div>
          )}
          {loyaltyDiscount > 0 && (
            <div className="flex justify-between text-sm text-narges-orange font-medium">
              <span>خصم الولاء 🎁</span>
              <span>- {formatSAR(loyaltyDiscount)}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between font-bold text-base">
            <span>الإجمالي</span>
            <span className="text-narges-green">{formatSAR(total)}</span>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-narges-surface border-t shadow-lg">
        <button onClick={handleConfirmOrder} disabled={placing} className="w-full btn-primary text-lg disabled:opacity-60">
          {placing ? 'جارٍ تأكيد الطلب...' : `تأكيد الطلب — ${formatSAR(total)}`}
        </button>
      </div>
    </div>
  );
}
