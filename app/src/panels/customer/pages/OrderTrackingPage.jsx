import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Phone, MessageCircle, CheckCircle2, Clock, Package, Truck, Home } from 'lucide-react';
import { useOrderStore } from '../../../store/useOrderStore';
import { isSupabaseConfigured } from '../../../lib/supabase';
import { STATUS_LABELS } from '../../../data/mockOrders';
import { formatSAR, formatTimeLeft } from '../../../utils/formatters';

const STATUS_STEPS = ['confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];
const STEP_ICONS = { confirmed: CheckCircle2, preparing: Package, ready: Package, picked_up: Truck, delivered: Home };
const STEP_LABELS = { confirmed: 'تأكيد الطلب', preparing: 'جاري التحضير', ready: 'جاهز للاستلام', picked_up: 'في الطريق إليك', delivered: 'تم التسليم' };

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus, loadOrderById } = useOrderStore();
  const [order, setOrder] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const local = getOrderById(id);
    if (local) { setOrder(local); return; }
    // غير موجود محلياً (مثلاً بعد تحديث الصفحة) → نجلبه من القاعدة
    loadOrderById(id).then((o) => o && setOrder(o));
  }, [id, tick]);

  // متابعة الحالة: مع Supabase نُحدّث من القاعدة (الكاشير/المندوب يتحكمون)؛
  // بدونها نُحاكي التقدّم محلياً للعرض.
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSupabaseConfigured) {
        loadOrderById(id).then((o) => o && setOrder(o));
        return;
      }
      const current = getOrderById(id);
      if (!current || current.status === 'delivered') return;
      const idx = STATUS_STEPS.indexOf(current.status);
      if (idx < STATUS_STEPS.length - 1) {
        updateOrderStatus(id, STATUS_STEPS[idx + 1]);
        setTick(t => t + 1);
      }
    }, isSupabaseConfigured ? 10000 : 7000);
    return () => clearInterval(interval);
  }, [id]);

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-narjis-text-secondary">جاري تحميل الطلب...</p>
      </div>
    </div>
  );

  const currentStepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-narjis-bg">
      {/* Map Placeholder */}
      <div className="relative h-56 bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">🗺️</div>
            <p className="text-narjis-text-secondary text-sm">تتبع طلبك على الخريطة</p>
          </div>
        </div>
        {/* Animated delivery icon */}
        {order.status === 'picked_up' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
            <div className="w-12 h-12 bg-narjis-green rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🚗</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Order Status Card */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-narjis-text-secondary">طلب رقم</p>
              <p className="font-bold text-narjis-green">{order.id}</p>
            </div>
            {order.status !== 'delivered' && (
              <div className="text-left">
                <p className="text-xs text-narjis-text-secondary">الوصول خلال</p>
                <p className="font-bold text-narjis-orange text-lg">{formatTimeLeft(order.estimatedDeliveryAt)}</p>
              </div>
            )}
            {order.status === 'delivered' && (
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                تم التسليم ✓
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {STATUS_STEPS.map((step, idx) => {
              const StepIcon = STEP_ICONS[step];
              const isDone = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step} className={`flex items-center gap-3 transition-all ${isDone ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCurrent ? 'bg-narjis-green text-white shadow-md' : isDone ? 'bg-green-100 text-narjis-green' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <StepIcon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-narjis-green' : 'text-narjis-text'}`}>
                      {STEP_LABELS[step]}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="text-xs text-narjis-orange font-medium animate-pulse">جاري...</span>
                  )}
                  {isDone && idx < currentStepIdx && (
                    <CheckCircle2 size={16} className="text-green-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Card */}
        {order.driverName && (
          <div className="card p-4">
            <h3 className="font-bold mb-3">المندوب</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-narjis-green rounded-full flex items-center justify-center text-white text-xl font-bold">
                {order.driverName[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{order.driverName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm text-narjis-text-secondary">4.8 (234 توصيلة)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-narjis-bg flex items-center justify-center">
                  <Phone size={18} className="text-narjis-green" />
                </button>
                <button className="w-10 h-10 rounded-xl bg-narjis-bg flex items-center justify-center">
                  <MessageCircle size={18} className="text-narjis-green" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="card p-4">
          <h3 className="font-bold mb-3">تفاصيل الطلب</h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-narjis-text">{item.nameAr} × {item.qty}</span>
                <span className="font-medium">{formatSAR(item.totalPrice)}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>الإجمالي</span>
              <span className="text-narjis-green">{formatSAR(order.total)}</span>
            </div>
          </div>
        </div>

        <button onClick={() => navigate('/Customer')} className="w-full btn-outline">
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}
