import { useParams, useNavigate } from 'react-router-dom';
import { Phone, Navigation, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useOrderStore } from '../../../store/useOrderStore';
import { formatSAR } from '../../../utils/formatters';
import { PAYMENT_LABELS } from '../../../data/mockOrders';

export default function ActiveDeliveryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrderStore();
  const order = getOrderById(id);
  const [step, setStep] = useState('to_store'); // to_store → picked_up → delivered

  if (!order) return <div className="min-h-screen flex items-center justify-center">الطلب غير موجود</div>;

  const handlePickedUp = () => {
    updateOrderStatus(id, 'picked_up');
    setStep('to_customer');
  };

  const handleDelivered = () => {
    updateOrderStatus(id, 'delivered');
    navigate('/driver');
  };

  return (
    <div className="min-h-screen bg-narjis-bg flex flex-col">
      {/* Map Placeholder */}
      <div className="relative flex-1 bg-gradient-to-br from-green-50 to-blue-50 min-h-64">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="text-6xl animate-bounce">🚗</div>
          <div className="bg-white rounded-2xl px-4 py-2 shadow text-sm font-medium text-narjis-green">
            {step === 'to_store' ? '📍 توجه إلى المتجر' : '🏠 توجه إلى العميل'}
          </div>
        </div>

        {/* Store & Customer markers */}
        <div className="absolute top-4 right-4 bg-white rounded-xl p-2 shadow text-xs">
          <p className="font-bold">🏪 نرجس سوبرماركت</p>
          <p className="text-narjis-text-secondary">حي العليا، الرياض</p>
        </div>
        <div className="absolute top-4 left-4 bg-white rounded-xl p-2 shadow text-xs">
          <p className="font-bold">🏠 {order.customerName}</p>
          <p className="text-narjis-text-secondary">{order.deliveryAddress.district}</p>
        </div>
      </div>

      {/* Order Info */}
      <div className="bg-white rounded-t-3xl p-5 space-y-4 shadow-lg">
        {/* Customer */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-narjis-green rounded-full flex items-center justify-center text-white text-xl font-bold">
            {order.customerName[0]}
          </div>
          <div className="flex-1">
            <p className="font-bold">{order.customerName}</p>
            <p className="text-sm text-narjis-text-secondary">{order.deliveryAddress.street}</p>
          </div>
          <a href={`tel:${order.customerPhone}`} className="w-11 h-11 bg-narjis-bg rounded-xl flex items-center justify-center">
            <Phone size={20} className="text-narjis-green" />
          </a>
        </div>

        {/* Items Summary */}
        <div className="bg-narjis-bg rounded-xl p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-narjis-text-secondary">{order.items.length} منتج</span>
            <span className="font-bold text-narjis-green">{formatSAR(order.total)}</span>
          </div>
          <p className="text-xs text-narjis-text-secondary mt-1">
            الدفع: {PAYMENT_LABELS[order.paymentMethod]}
            {order.paymentMethod === 'cash' && ' (استلم النقد)'}
          </p>
        </div>

        {/* Action Button */}
        {step === 'to_store' ? (
          <button
            onClick={handlePickedUp}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={20} />
            استلمت الطلب من المتجر
          </button>
        ) : (
          <button
            onClick={handleDelivered}
            className="w-full bg-narjis-orange text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
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
    </div>
  );
}
