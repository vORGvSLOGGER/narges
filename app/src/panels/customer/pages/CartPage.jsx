import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trash2, Plus, Minus, Tag } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../../../store/useCartStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { formatSAR } from '../../../utils/formatters';

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
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [address, setAddress] = useState('حي الروضة، شارع الأمير محمد، مبنى 12');

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = items.length > 0 ? 10 : 0;
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = () => {
    if (!items.length) return;
    const order = addOrder({
      customerName: 'أحمد العمري',
      customerPhone: '0501234567',
      deliveryAddress: { street: address, district: 'حي الروضة', city: 'الرياض' },
      items: items.map(i => ({ productId: i.id, nameAr: i.nameAr, qty: i.qty, unitPrice: i.price, totalPrice: i.price * i.qty })),
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
    });
    clearCart();
    navigate(`/customer/tracking/${order.id}`, { replace: true });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-narjis-bg flex flex-col">
        <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-8 z-40">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narjis-bg flex items-center justify-center">
            <ArrowRight size={18} />
          </button>
          <h1 className="text-lg font-bold">سلة التسوق</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <span className="text-7xl">🛒</span>
          <h2 className="text-xl font-bold text-narjis-text">السلة فارغة</h2>
          <p className="text-narjis-text-secondary text-center">أضف منتجات من المتجر لتظهر هنا</p>
          <button onClick={() => navigate('/customer')} className="btn-primary px-8">تسوق الآن</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-narjis-bg flex flex-col pb-40">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-8 z-40">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narjis-bg flex items-center justify-center">
          <ArrowRight size={18} />
        </button>
        <h1 className="text-lg font-bold flex-1">سلة التسوق</h1>
        <span className="text-sm text-narjis-text-secondary">{items.length} منتج</span>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Items */}
        <div className="card divide-y divide-gray-50">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3">
              <img src={item.image} alt={item.nameAr} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-narjis-text line-clamp-2">{item.nameAr}</p>
                <p className="text-narjis-green font-bold mt-1">{formatSAR(item.price)}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button onClick={() => removeItem(item.id)} className="text-red-400 active:scale-90 transition-transform">
                  <Trash2 size={14} />
                </button>
                <div className="flex items-center gap-2 bg-narjis-bg rounded-lg p-0.5">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
                    <Minus size={12} />
                  </button>
                  <span className="w-5 text-center font-bold text-sm">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-md bg-narjis-light flex items-center justify-center">
                    <Plus size={12} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="card p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span>📍</span> عنوان التوصيل
          </h3>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narjis-light"
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
                  paymentMethod === m.id ? 'border-narjis-light bg-green-50' : 'border-gray-100 bg-white'
                }`}
              >
                <span>{m.icon}</span>
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="card p-4 space-y-2">
          <h3 className="font-bold mb-3">ملخص الطلب</h3>
          <div className="flex justify-between text-sm">
            <span className="text-narjis-text-secondary">المجموع الفرعي</span>
            <span>{formatSAR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-narjis-text-secondary">رسوم التوصيل</span>
            <span>{formatSAR(deliveryFee)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-base">
            <span>الإجمالي</span>
            <span className="text-narjis-green">{formatSAR(total)}</span>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <button onClick={handleConfirmOrder} className="w-full btn-primary text-lg">
          تأكيد الطلب — {formatSAR(total)}
        </button>
      </div>
    </div>
  );
}
