import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Printer, CheckCircle } from 'lucide-react';
import { useOrderStore } from '../../../store/useOrderStore';
import { formatSAR, formatDate } from '../../../utils/formatters';
import { STATUS_LABELS, PAYMENT_LABELS } from '../../../data/mockOrders';
import StatusBadge from '../../../components/shared/StatusBadge';

export default function ProcessOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrderStore();
  const order = getOrderById(id);

  if (!order) return <div className="min-h-screen flex items-center justify-center">الطلب غير موجود</div>;

  const handlePrint = () => window.print();

  const handleAdvance = () => {
    const steps = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];
    const idx = steps.indexOf(order.status);
    if (idx < steps.length - 1) updateOrderStatus(id, steps[idx + 1]);
  };

  return (
    <div className="min-h-screen bg-narges-bg print:bg-narges-surface">
      {/* Header - hidden on print */}
      <div className="bg-narges-surface px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-40 print:hidden">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center">
          <ArrowRight size={18} />
        </button>
        <h1 className="text-lg font-bold flex-1">تفاصيل الطلب</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Receipt Header - for print */}
        <div className="card p-4 print:shadow-none print:border print:rounded-none">
          <div className="text-center mb-4 print:mb-6">
            <div className="w-16 h-16 bg-narges-green rounded-2xl flex items-center justify-center mx-auto mb-2 print:hidden">
              <span className="text-white text-3xl font-bold">ن</span>
            </div>
            <h2 className="font-bold text-xl text-narges-green">نرجس سوبرماركت</h2>
            <p className="text-sm text-narges-text-secondary">فاتورة ضريبية</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm border-y py-3 my-3">
            <div>
              <p className="text-narges-text-secondary text-xs">رقم الطلب</p>
              <p className="font-bold text-narges-green">{order.id}</p>
            </div>
            <div className="text-left">
              <p className="text-narges-text-secondary text-xs">التاريخ</p>
              <p className="font-medium text-xs">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-narges-text-secondary text-xs">العميل</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div className="text-left">
              <p className="text-narges-text-secondary text-xs">الدفع</p>
              <p className="font-medium">{PAYMENT_LABELS[order.paymentMethod]}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-narges-text-secondary text-xs border-b">
                <th className="text-right pb-2 font-medium">المنتج</th>
                <th className="text-center pb-2 font-medium">الكمية</th>
                <th className="text-left pb-2 font-medium">السعر</th>
                <th className="text-left pb-2 font-medium">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-narges-border">
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-2 text-narges-text">{item.nameAr}</td>
                  <td className="py-2 text-center text-narges-text-secondary">{item.qty}</td>
                  <td className="py-2 text-left">{formatSAR(item.unitPrice)}</td>
                  <td className="py-2 text-left font-medium">{formatSAR(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t mt-3 pt-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-narges-text-secondary">المجموع الفرعي</span>
              <span>{formatSAR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-narges-text-secondary">رسوم التوصيل</span>
              <span>{formatSAR(order.deliveryFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>خصم</span>
                <span>- {formatSAR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-1 border-t">
              <span>الإجمالي</span>
              <span className="text-narges-green">{formatSAR(order.total)}</span>
            </div>
          </div>

          {order.notes && (
            <div className="mt-3 bg-yellow-50 rounded-xl p-3 text-sm">
              <span className="font-medium">ملاحظة: </span>
              <span className="text-narges-text-secondary">{order.notes}</span>
            </div>
          )}
        </div>

        {/* Actions - hidden on print */}
        <div className="flex gap-3 print:hidden">
          <button onClick={handlePrint} className="flex-1 btn-outline flex items-center justify-center gap-2">
            <Printer size={18} />
            طباعة الفاتورة
          </button>
          {!['delivered', 'picked_up', 'cancelled'].includes(order.status) && (
            <button onClick={handleAdvance} className="flex-1 btn-primary flex items-center justify-center gap-2">
              <CheckCircle size={18} />
              تقدم الطلب
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
