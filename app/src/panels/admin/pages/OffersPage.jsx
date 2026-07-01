import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Tag } from 'lucide-react';
import { useOffersStore } from '../../../store/useOffersStore';
import { formatDate } from '../../../utils/formatters';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: { label: 'بانتظار الاعتماد', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  approved: { label: 'معتمد', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const FILTER_TABS = [
  { id: 'all', label: 'الكل' },
  { id: 'pending', label: 'بانتظار الاعتماد' },
  { id: 'approved', label: 'المعتمدة' },
  { id: 'rejected', label: 'المرفوضة' },
];

export default function OffersPage() {
  const { offers, updateOfferStatus } = useOffersStore();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? offers : offers.filter(o => o.status === filter);

  const handleApprove = (id, name) => {
    updateOfferStatus(id, 'approved');
    toast.success(`تم اعتماد عرض "${name}"`);
  };

  const handleReject = (id, name) => {
    updateOfferStatus(id, 'rejected');
    toast.error(`تم رفض عرض "${name}"`);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة العروض</h1>
          <p className="text-narges-text-secondary text-sm mt-0.5">
            {offers.filter(o => o.status === 'pending').length} عرض بانتظار الاعتماد
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-narges-green px-3 py-2 rounded-xl text-sm font-medium">
          <Tag size={16} />
          <span>{offers.filter(o => o.status === 'approved').length} عرض نشط</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {FILTER_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === t.id ? 'bg-narges-green text-white' : 'bg-narges-surface text-narges-text-secondary border border-narges-border'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Offers List */}
      <div className="space-y-3">
        {filtered.map(offer => {
          const cfg = STATUS_CONFIG[offer.status];
          const StatusIcon = cfg.icon;
          return (
            <div key={offer.id} className="card p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold">{offer.productName}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-narges-text-secondary">اقترحه: {offer.proposedBy}</p>
                  {offer.notes && (
                    <p className="text-xs text-narges-text-secondary mt-1">ملاحظة: {offer.notes}</p>
                  )}
                </div>
                <div className="text-left flex-shrink-0">
                  <div className="bg-narges-orange/10 text-narges-orange font-bold text-lg px-3 py-1 rounded-xl text-center">
                    {offer.discountPct}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm bg-narges-bg rounded-xl p-3 mb-3">
                <div>
                  <span className="text-narges-text-secondary">السعر الأصلي: </span>
                  <span className="line-through text-narges-text-secondary">{offer.originalPrice} ر.س</span>
                </div>
                <div>
                  <span className="text-narges-text-secondary">بعد الخصم: </span>
                  <span className="font-bold text-narges-green">{offer.newPrice.toFixed(2)} ر.س</span>
                </div>
                <div className="text-xs text-narges-text-secondary">
                  حتى: {new Date(offer.validUntil).toLocaleDateString('ar-SA')}
                </div>
              </div>

              {offer.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(offer.id, offer.productName)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-narges-green text-white py-2 rounded-xl text-sm font-bold"
                  >
                    <CheckCircle2 size={16} />
                    اعتماد
                  </button>
                  <button
                    onClick={() => handleReject(offer.id, offer.productName)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-bold border border-red-100"
                  >
                    <XCircle size={16} />
                    رفض
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl">🏷️</span>
            <p className="mt-3 font-medium text-narges-text">لا توجد عروض في هذا القسم</p>
          </div>
        )}
      </div>
    </div>
  );
}
