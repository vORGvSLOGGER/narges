import { useParams, useNavigate } from 'react-router-dom';
import { Phone, CheckCircle2 } from 'lucide-react';
import { useState, Suspense, lazy } from 'react';
import { useOrderStore } from '../../../store/useOrderStore';
import { formatSAR } from '../../../utils/formatters';
import { PAYMENT_LABELS } from '../../../data/mockOrders';
import ChatWidget from '../components/ChatWidget';

const LiveMap = lazy(() => import('../components/LiveMap'));

export default function ActiveDeliveryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrderStore();
  const order = getOrderById(id);
  const [step, setStep] = useState('to_store');

  if (!order) return <div className="min-h-screen flex items-center justify-center">الطلب غير موجود</div>;

  const handlePickedUp = () => {
    updateOrderStatus(id, 'picked_up');
    setStep('to_customer');
  };

  const handleDelivered = () => {
    updateOrderStatus(id, 'delivered');
    navigate('/Delivery');
  };

  return (
    <div className="min-h-screen bg-narges-bg flex flex-col">
      {/* Live Map */}
      <div className="relative h-64 bg-gray-100">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
            <div className="text-center">
              <div className="text-5xl animate-bounce">🚗</div>
              <p className="text-sm text-narges-text-secondary mt-2">جاري تحميل الخريطة...</p>
            </div>
          </div>
        }>
          <LiveMap
            customerLat={24.7100}
            customerLng={46.6600}
            driverLat={step === 'to_store' ? 24.7250 : 24.7180}
            driverLng={step === 'to_store' ? 46.6900 : 46.6750}
          />
        </Suspense>

        {/* Status Pill */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-xl px-4 py-1.5 shadow-lg text-sm font-medium text-narges-green z-10">
          {step === 'to_store' ? '📍 توجه إلى المتجر' : '🏠 توجه إلى العميل'}
        </div>
      </div>

      {/* Order Info */}
      <div className="bg-white rounded-t-3xl -mt-4 p-5 space-y-4 shadow-lg flex-1">
        {/* Customer */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-narges-green rounded-full flex items-center justify-center text-white text-xl font-bold">
            {order.customerName[0]}
          </div>
          <div className="flex-1">
            <p className="font-bold">{order.customerName}</p>
            <p className="text-sm text-narges-text-secondary">{order.deliveryAddress.street}</p>
          </div>
          <a href={`tel:${order.customerPhone}`} className="w-11 h-11 bg-narges-bg rounded-xl flex items-center justify-center">
            <Phone size={20} className="text-narges-green" />
          </a>
        </div>

        {/* Items Summary */}
        <div className="bg-narges-bg rounded-xl p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-narges-text-secondary">{order.items.length} منتج</span>
            <span className="font-bold text-narges-green">{formatSAR(order.total)}</span>
          </div>
          <p className="text-xs text-narges-text-secondary mt-1">
            الدفع: {PAYMENT_LABELS[order.paymentMethod]}
            {order.paymentMethod === 'cash' && ' (استلم النقد)'}
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3">
          <div className={`flex-1 h-1.5 rounded-full ${step === 'to_store' ? 'bg-narges-green' : 'bg-narges-lighter'}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step === 'to_customer' ? 'bg-narges-green' : 'bg-gray-200'}`} />
        </div>

        {/* Action Button */}
        {step === 'to_store' ? (
          <button onClick={handlePickedUp} className="w-full btn-primary flex items-center justify-center gap-2">
            <CheckCircle2 size={20} />
            استلمت الطلب من المتجر
          </button>
        ) : (
          <button
            onClick={handleDelivered}
            className="w-full bg-narges-orange text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <CheckCircle2 size={20} />
            تم التسليم للعميل ✓
          </button>
        )}

        {order.notes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <p className="text-xs font-medium text-yellow-800">ملاحظة العميل:</p>
            <p className="text-sm text-yellow-700 mt-0.5">{order.notes}</p>
          </div>
        )}
      </div>

      <ChatWidget customerName={order.customerName} />
    </div>
  );
}
