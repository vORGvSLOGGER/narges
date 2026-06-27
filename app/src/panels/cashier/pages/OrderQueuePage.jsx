import { useNavigate } from 'react-router-dom';
import { Clock, Package } from 'lucide-react';
import { useOrderStore } from '../../../store/useOrderStore';
import { formatRelativeTime, formatSAR } from '../../../utils/formatters';
import { STATUS_LABELS, STATUS_COLORS, PAYMENT_LABELS } from '../../../data/mockOrders';

const CASHIER_STATUSES = ['pending', 'confirmed', 'preparing', 'ready'];
const STATUS_BG = {
  pending: 'border-yellow-200 bg-yellow-50',
  confirmed: 'border-blue-200 bg-blue-50',
  preparing: 'border-purple-200 bg-purple-50',
  ready: 'border-green-200 bg-green-50',
};

export default function OrderQueuePage() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrderStore();
  const queueOrders = orders.filter(o => CASHIER_STATUSES.includes(o.status));

  const counts = CASHIER_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  const handleAdvance = (e, order) => {
    e.stopPropagation();
    const steps = ['pending', 'confirmed', 'preparing', 'ready'];
    const idx = steps.indexOf(order.status);
    if (idx < steps.length - 1) updateOrderStatus(order.id, steps[idx + 1]);
  };

  return (
    <div className="min-h-screen bg-narjis-bg">
      {/* Header */}
      <div className="bg-narjis-green px-4 pt-12 pb-5">
        <h1 className="text-white text-2xl font-bold">لوحة الكاشير</h1>
        <p className="text-white/70 text-sm mt-1">سوبرماركت نرجس — فرع الرياض</p>

        {/* Status Summary */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {CASHIER_STATUSES.map(s => {
            const colors = STATUS_COLORS[s];
            return (
              <div key={s} className="bg-white/20 rounded-xl p-2 text-center">
                <p className="text-white font-bold text-xl">{counts[s]}</p>
                <p className="text-white/70 text-xs">{STATUS_LABELS[s]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="p-4">
        {queueOrders.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl">✅</span>
            <p className="mt-3 text-narjis-text font-medium">لا توجد طلبات معلقة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {queueOrders.map(order => (
              <div
                key={order.id}
                onClick={() => navigate(`/cashier/order/${order.id}`)}
                className={`card border-2 cursor-pointer hover:shadow-md transition-shadow ${STATUS_BG[order.status] || ''}`}
              >
                <div className="p-4">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-narjis-green">{order.id}</p>
                      <p className="text-xs text-narjis-text-secondary">{order.customerName}</p>
                    </div>
                    <div className="text-left">
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]?.bg} ${STATUS_COLORS[order.status]?.text}`}>
                        {STATUS_LABELS[order.status]}
                      </div>
                      <p className="text-xs text-narjis-text-secondary mt-1 text-left">
                        <Clock size={10} className="inline ml-0.5" />
                        {formatRelativeTime(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1 mb-3">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs">
                        <Package size={10} className="text-narjis-text-secondary flex-shrink-0" />
                        <span className="text-narjis-text flex-1 truncate">{item.nameAr}</span>
                        <span className="text-narjis-text-secondary">×{item.qty}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-narjis-text-secondary">+{order.items.length - 3} منتجات أخرى</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-black/5">
                    <span className="text-xs text-narjis-text-secondary">{PAYMENT_LABELS[order.paymentMethod]}</span>
                    <span className="font-bold text-narjis-green text-sm">{formatSAR(order.total)}</span>
                  </div>

                  {/* Advance Button */}
                  {order.status !== 'ready' && (
                    <button
                      onClick={(e) => handleAdvance(e, order)}
                      className="w-full mt-3 bg-narjis-light text-white text-sm font-medium py-2 rounded-lg active:scale-95 transition-transform"
                    >
                      تقدم إلى: {STATUS_LABELS[['pending', 'confirmed', 'preparing', 'ready'][['pending', 'confirmed', 'preparing', 'ready'].indexOf(order.status) + 1]] || ''}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
