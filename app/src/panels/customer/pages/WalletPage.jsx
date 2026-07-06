import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Wallet, Plus, Clock } from 'lucide-react';
import { useWalletStore } from '../../../store/useWalletStore';
import { formatSAR, formatDate } from '../../../utils/formatters';
import BottomNav from '../components/BottomNav';
import toast from 'react-hot-toast';

const QUICK_AMOUNTS = [25, 50, 100, 200];

export default function WalletPage() {
  const navigate = useNavigate();
  const { balance, history, topUp } = useWalletStore();
  const [custom, setCustom] = useState('');

  const doTopUp = (amount) => {
    if (topUp(amount)) {
      toast.success(`تم شحن ${formatSAR(amount)} في محفظتك 💳`);
      setCustom('');
    } else {
      toast.error('أدخل مبلغاً صحيحاً');
    }
  };

  return (
    <div className="min-h-screen bg-narges-bg anim-fade-up pb-24 overflow-x-hidden">
      {/* Header */}
      <div className="bg-narges-green px-4 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <ArrowRight size={18} className="text-white" />
          </button>
          <h1 className="text-white font-bold text-xl">محفظتي</h1>
        </div>
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">رصيدك الحالي</p>
            <p className="text-white font-bold text-3xl mt-1">{formatSAR(balance)}</p>
          </div>
          <span className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Wallet size={24} className="text-white" />
          </span>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4 max-w-md mx-auto w-full">
        {/* الشحن */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Plus size={18} className="text-narges-green" />
            <h3 className="font-bold">اشحن رصيدك</h3>
          </div>
          <p className="text-sm text-narges-text-secondary mb-3">
            اشحن الآن واستخدم رصيدك للدفع في طلباتك القادمة مباشرة من السلة.
          </p>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => doTopUp(a)}
                className="py-2.5 rounded-xl border-2 border-narges-green/40 text-narges-green font-bold text-sm active:scale-95 transition-transform"
              >
                {a} ر.س
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="مبلغ آخر..."
              dir="ltr"
              className="flex-1 min-w-0 border border-narges-border rounded-xl px-3 py-2.5 text-sm text-center font-bold focus:outline-none focus:border-narges-green bg-transparent"
            />
            <button
              onClick={() => doTopUp(custom)}
              disabled={!custom || Number(custom) <= 0}
              className="btn-primary py-2.5 px-5 text-sm disabled:opacity-50"
            >
              شحن
            </button>
          </div>
        </div>

        {/* السجل */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-narges-text-secondary" />
            <h3 className="font-bold">سجل المحفظة</h3>
          </div>
          {history.length === 0 ? (
            <p className="text-center text-narges-text-secondary text-sm py-4">لا توجد عمليات بعد — اشحن رصيدك الأول!</p>
          ) : (
            <div className="space-y-2">
              {history.map(h => (
                <div key={h.id} className="flex items-center justify-between py-2 border-b border-narges-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{h.description}</p>
                    <p className="text-xs text-narges-text-secondary">{formatDate(h.date)}</p>
                  </div>
                  <span className={`font-bold text-sm ${h.amount > 0 ? 'text-narges-green' : 'text-red-500'}`}>
                    {h.amount > 0 ? '+' : ''}{formatSAR(Math.abs(h.amount))}{h.amount < 0 ? '-' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
