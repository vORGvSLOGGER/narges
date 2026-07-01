import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useOrderStore } from '../../../store/useOrderStore';
import { formatSAR, formatRelativeTime } from '../../../utils/formatters';
import { PAYMENT_LABELS } from '../../../data/mockOrders';
import StatusBadge from '../../../components/shared/StatusBadge';

const ALL_STATUSES = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'];
const STATUS_LABELS_LOCAL = { all: 'الكل', pending: 'انتظار', confirmed: 'مؤكد', preparing: 'يُحضَّر', ready: 'جاهز', picked_up: 'في الطريق', delivered: 'مسلّم', cancelled: 'ملغي' };

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders } = useOrderStore();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">الطلبات</h1>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === s ? 'bg-narges-green text-white' : 'bg-narges-surface text-narges-text shadow-sm'
            }`}
          >
            {STATUS_LABELS_LOCAL[s]}
            {' '}({s === 'all' ? orders.length : orders.filter(o => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-narges-bg">
              <tr className="text-narges-text-secondary text-xs">
                <th className="text-right px-4 py-3 font-medium">رقم الطلب</th>
                <th className="text-right px-4 py-3 font-medium">العميل</th>
                <th className="text-right px-4 py-3 font-medium">الحالة</th>
                <th className="text-right px-4 py-3 font-medium">الدفع</th>
                <th className="text-left px-4 py-3 font-medium">الإجمالي</th>
                <th className="text-left px-4 py-3 font-medium">الوقت</th>
                <th className="text-center px-4 py-3 font-medium">عرض</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-narges-border">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-narges-bg/30 transition-colors">
                  <td className="px-4 py-3 font-bold text-narges-green">{o.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{o.customerName}</p>
                    <p className="text-xs text-narges-text-secondary">{o.deliveryAddress.district}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-xs text-narges-text-secondary">{PAYMENT_LABELS[o.paymentMethod]}</td>
                  <td className="px-4 py-3 text-left font-bold text-narges-green">{formatSAR(o.total)}</td>
                  <td className="px-4 py-3 text-left text-xs text-narges-text-secondary">{formatRelativeTime(o.createdAt)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/cashier/order/${o.id}`)}
                      className="w-8 h-8 rounded-lg bg-narges-bg flex items-center justify-center mx-auto hover:bg-narges-lighter/20 transition-colors"
                    >
                      <Eye size={14} className="text-narges-green" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
