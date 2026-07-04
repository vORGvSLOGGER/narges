import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, TicketPercent, Power } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../../lib/api';
import { formatSAR, formatDate } from '../../../utils/formatters';

const EMPTY = { code: '', type: 'percent', value: '', minSubtotal: '', maxUses: '', expiresAt: '', active: true };

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setCoupons(await fetchCoupons());
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSave = async () => {
    if (!form.code.trim() || !form.value) { toast.error('الرمز والقيمة مطلوبان'); return; }
    setSaving(true);
    try {
      await createCoupon({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minSubtotal: Number(form.minSubtotal) || 0,
        maxUses: Number(form.maxUses) || null,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        active: form.active,
      });
      toast.success('أُنشئت القسيمة 🎟️');
      setShowModal(false);
      setForm(EMPTY);
      await reload();
    } catch (e) {
      toast.error(e.message?.includes('duplicate') ? 'الرمز مستخدم مسبقاً' : 'تعذّر الحفظ: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c) => {
    try {
      await updateCoupon(c.id, { active: !c.active });
      setCoupons((cs) => cs.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));
    } catch (e) { toast.error(e.message); }
  };

  const handleDelete = async (c) => {
    if (!confirm(`حذف القسيمة ${c.code}؟`)) return;
    try {
      await deleteCoupon(c.id);
      setCoupons((cs) => cs.filter((x) => x.id !== c.id));
      toast.success('حُذفت');
    } catch (e) { toast.error(e.message); }
  };

  const expired = (c) => c.expiresAt && new Date(c.expiresAt) < new Date();

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">القسائم</h1>
          <p className="text-narges-text-secondary text-sm mt-0.5">أكواد خصم يدخلها العميل في السلة</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> قسيمة جديدة
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-2xl skeleton" />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="card p-12 text-center text-narges-text-secondary">
          <TicketPercent size={42} className="mx-auto mb-3 text-narges-muted" />
          لا توجد قسائم بعد — أنشئ أول قسيمة لعملائك
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {coupons.map((c) => (
            <div key={c.id} className={`card p-4 anim-fade-up ${!c.active || expired(c) ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <span dir="ltr" className="font-mono font-bold text-lg tracking-widest text-narges-green">{c.code}</span>
                <span className="badge-offer">{c.type === 'percent' ? `${c.value}%` : formatSAR(c.value)}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-narges-text-secondary mt-2">
                {c.minSubtotal > 0 && <span>حد أدنى: {formatSAR(c.minSubtotal)}</span>}
                {c.maxUses && <span>الاستخدام: {c.usedCount}/{c.maxUses}</span>}
                {c.expiresAt && <span className={expired(c) ? 'text-red-500 font-bold' : ''}>{expired(c) ? 'منتهية' : `تنتهي: ${formatDate(c.expiresAt)}`}</span>}
                {!c.active && <span className="text-red-500 font-bold">موقوفة</span>}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => toggleActive(c)} className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl ${c.active ? 'bg-narges-surface2 text-narges-text' : 'bg-narges-green text-white'}`}>
                  <Power size={13} /> {c.active ? 'إيقاف' : 'تفعيل'}
                </button>
                <button onClick={() => handleDelete(c)} className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-narges-surface rounded-2xl w-full max-w-md anim-pop">
            <div className="p-5 border-b border-narges-border"><h2 className="font-bold text-lg">قسيمة جديدة</h2></div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-narges-text-secondary block mb-1">الرمز (يُدخله العميل)</label>
                <input value={form.code} onChange={set('code')} dir="ltr" placeholder="WELCOME20" className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm text-center font-mono font-bold tracking-widest uppercase focus:outline-none focus:border-narges-light" />
              </div>
              <div>
                <label className="text-xs text-narges-text-secondary block mb-1">النوع</label>
                <select value={form.type} onChange={set('type')} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none">
                  <option value="percent">نسبة %</option>
                  <option value="fixed">مبلغ ثابت</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-narges-text-secondary block mb-1">{form.type === 'percent' ? 'النسبة %' : 'المبلغ ر.س'}</label>
                <input type="number" value={form.value} onChange={set('value')} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narges-light" />
              </div>
              <div>
                <label className="text-xs text-narges-text-secondary block mb-1">حد أدنى للسلة (اختياري)</label>
                <input type="number" value={form.minSubtotal} onChange={set('minSubtotal')} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-narges-text-secondary block mb-1">عدد مرات الاستخدام (اختياري)</label>
                <input type="number" value={form.maxUses} onChange={set('maxUses')} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-narges-text-secondary block mb-1">تاريخ الانتهاء (اختياري)</label>
                <input type="date" value={form.expiresAt} onChange={set('expiresAt')} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none" />
              </div>
            </div>
            <div className="p-5 border-t border-narges-border flex gap-3">
              <button onClick={() => { setShowModal(false); setForm(EMPTY); }} className="flex-1 btn-outline py-2.5">إلغاء</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary py-2.5 disabled:opacity-50">{saving ? 'جارٍ...' : 'إنشاء'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
