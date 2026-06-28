import { useState } from 'react';
import { MapPin, Package, DollarSign, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../../../store/useOrderStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { formatSAR, formatRelativeTime } from '../../../utils/formatters';
import { STATUS_LABELS } from '../../../data/mockOrders';

export default function AvailableOrdersPage() {
  const navigate = useNavigate();
  const { driverOnline, setDriverOnline } = useAuthStore();
  const { getPendingOrders, updateOrderStatus, assignDriver } = useOrderStore();
  const pendingOrders = getPendingOrders();
  const [acceptedId, setAcceptedId] = useState(null);

  const handleAccept = (orderId) => {
    assignDriver(orderId, 'd001', 'خالد العتيبي');
    updateOrderStatus(orderId, 'picked_up');
    setAcceptedId(orderId);
    navigate(`/Delivery/delivery/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-narges-bg">
      {/* Header */}
      <div className="bg-narges-green px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white font-bold text-xl">مرحباً، خالد 👋</h1>
            <p className="text-white/70 text-sm mt-0.5">مندوب توصيل نرجس</p>
          </div>
          <div className="text-left">
            <p className="text-white/70 text-xs">الأرباح اليوم</p>
            <p className="text-white font-bold text-xl">{formatSAR(187)}</p>
          </div>
        </div>

        {/* Online Toggle */}
        <div className={`rounded-2xl p-4 flex items-center justify-between ${driverOnline ? 'bg-white/20' : 'bg-white/10'}`}>
          <div>
            <p className="text-white font-semibold">{driverOnline ? '🟢 متاح للتوصيل' : '🔴 غير متاح'}</p>
            <p className="text-white/70 text-xs mt-0.5">{driverOnline ? `${pendingOrders.length} طلب في الانتظار` : 'سيتوقف وصول الطلبات'}</p>
          </div>
          <button
            onClick={() => setDriverOnline(!driverOnline)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${driverOnline ? 'bg-narges-light' : 'bg-white/30'}`}
          >
            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${driverOnline ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Orders */}
      <div className="px-4 pt-4">
        {!driverOnline ? (
          <div className="text-center py-16">
            <span className="text-6xl">😴</span>
            <p className="mt-3 text-narges-text font-medium">أنت في وضع عدم التوفر</p>
            <p className="text-narges-text-secondary text-sm">فعّل التوفر لاستقبال الطلبات</p>
          </div>
        ) : pendingOrders.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl">🎉</span>
            <p className="mt-3 text-narges-text font-medium">لا يوجد طلبات الآن</p>
            <p className="text-narges-text-secondary text-sm">ستصلك إشعارات عند وصول طلب جديد</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-bold text-narges-text">{pendingOrders.length} طلبات تنتظرك</p>
            {pendingOrders.map(order => (
              <div key={order.id} className="card overflow-hidden">
                {/* Order Header */}
                <div className="bg-narges-bg px-4 py-2 flex items-center justify-between">
                  <span className="font-bold text-narges-green text-sm">{order.id}</span>
                  <span className="text-xs text-narges-text-secondary">{formatRelativeTime(order.createdAt)}</span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Customer */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-narges-green rounded-xl flex items-center justify-center text-white font-bold">
                      {order.customerName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{order.customerName}</p>
                      <div className="flex items-center gap-1 text-narges-text-secondary">
                        <MapPin size={11} />
                        <span className="text-xs">{order.deliveryAddress.district}، {order.deliveryAddress.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-narges-bg rounded-xl p-2 text-center">
                      <Package size={14} className="mx-auto text-narges-green mb-1" />
                      <p className="text-xs font-bold">{order.items.length}</p>
                      <p className="text-xs text-narges-text-secondary">منتج</p>
                    </div>
                    <div className="bg-narges-bg rounded-xl p-2 text-center">
                      <DollarSign size={14} className="mx-auto text-narges-orange mb-1" />
                      <p className="text-xs font-bold">{formatSAR(order.deliveryFee)}</p>
                      <p className="text-xs text-narges-text-secondary">عمولة</p>
                    </div>
                    <div className="bg-narges-bg rounded-xl p-2 text-center">
                      <MapPin size={14} className="mx-auto text-blue-500 mb-1" />
                      <p className="text-xs font-bold">3.2 كم</p>
                      <p className="text-xs text-narges-text-secondary">مسافة</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(order.id)}
                      className="flex-1 bg-narges-light text-white font-bold py-2.5 rounded-xl active:scale-95 transition-transform"
                    >
                      قبول الطلب ✓
                    </button>
                    <button className="flex-1 bg-red-50 text-red-500 font-bold py-2.5 rounded-xl active:scale-95 transition-transform border border-red-100">
                      رفض ✗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
