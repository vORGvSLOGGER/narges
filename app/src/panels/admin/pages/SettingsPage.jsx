import { useState, useEffect } from 'react';
import { Store, Truck, Gift, Palette, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettingsStore } from '../../../store/useSettingsStore';

function Section({ icon: Icon, title, desc, children, onSave, saving }) {
  return (
    <div className="card p-5 anim-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-xl bg-narges-green/10 text-narges-green flex items-center justify-center">
          <Icon size={19} />
        </span>
        <div className="flex-1">
          <h2 className="font-bold">{title}</h2>
          <p className="text-xs text-narges-text-secondary">{desc}</p>
        </div>
        <button onClick={onSave} disabled={saving} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5 disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} حفظ
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, ...props }) {
  return (
    <div>
      <label className="text-xs font-medium text-narges-text-secondary block mb-1">{label}</label>
      <input {...props} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narges-light" />
      {hint && <p className="text-[10px] text-narges-muted mt-1">{hint}</p>}
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-medium text-narges-text-secondary block mb-1">{label}</label>
      <div className="flex items-center gap-2 border border-narges-border rounded-xl px-3 py-2">
        <input type="color" value={value} onChange={onChange} className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer" />
        <input value={value} onChange={onChange} dir="ltr" className="flex-1 bg-transparent text-sm font-mono focus:outline-none" />
        <span className="w-6 h-6 rounded-full border border-narges-border" style={{ background: value }} />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, save, saving, load } = useSettingsStore();
  const [site, setSite] = useState(settings.site);
  const [delivery, setDelivery] = useState(settings.delivery);
  const [loyalty, setLoyalty] = useState(settings.loyalty);
  const [theme, setTheme] = useState(settings.theme);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    setSite(settings.site); setDelivery(settings.delivery);
    setLoyalty(settings.loyalty); setTheme(settings.theme);
  }, [settings]);

  const doSave = (key, value) => async () => {
    try {
      await save(key, value);
      toast.success('حُفظت الإعدادات — سرت على الموقع فوراً');
    } catch (e) {
      toast.error('تعذّر الحفظ: ' + e.message);
    }
  };
  const num = (v) => (v === '' ? 0 : Number(v));

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">إعدادات المنصة</h1>
        <p className="text-narges-text-secondary text-sm mt-0.5">كل تغيير هنا ينعكس على الموقع مباشرة — بدون أي كود</p>
      </div>

      <Section icon={Store} title="المتجر" desc="الاسم والهوية وبيانات التواصل" saving={saving} onSave={doSave('site', site)}>
        <Field label="اسم المتجر" value={site.storeName} onChange={(e) => setSite({ ...site, storeName: e.target.value })} />
        <Field label="رقم التواصل" dir="ltr" value={site.phone} onChange={(e) => setSite({ ...site, phone: e.target.value })} />
        <Field label="المدينة" value={site.city} onChange={(e) => setSite({ ...site, city: e.target.value })} />
        <Field label="الحي (يظهر في شريط التوصيل)" value={site.district} onChange={(e) => setSite({ ...site, district: e.target.value })} />
      </Section>

      <Section icon={Truck} title="التوصيل" desc="الرسوم والحدود ووقت الوصول" saving={saving} onSave={doSave('delivery', delivery)}>
        <Field label="رسوم التوصيل (ر.س)" type="number" value={delivery.fee} onChange={(e) => setDelivery({ ...delivery, fee: num(e.target.value) })} />
        <Field label="توصيل مجاني للطلبات فوق (ر.س)" type="number" value={delivery.freeAt} onChange={(e) => setDelivery({ ...delivery, freeAt: num(e.target.value) })} />
        <Field label="الحد الأدنى للطلب (ر.س)" type="number" value={delivery.minOrder} onChange={(e) => setDelivery({ ...delivery, minOrder: num(e.target.value) })} />
        <Field label="مدة الوصول المتوقعة (دقيقة)" type="number" value={delivery.etaMinutes} onChange={(e) => setDelivery({ ...delivery, etaMinutes: num(e.target.value) })} />
      </Section>

      <Section icon={Gift} title="الولاء" desc="معدلات كسب واستبدال النقاط" saving={saving} onSave={doSave('loyalty', loyalty)}>
        <Field label="نقاط لكل 1 ر.س إنفاق" type="number" step="0.1" value={loyalty.earnPerSar} onChange={(e) => setLoyalty({ ...loyalty, earnPerSar: num(e.target.value) })} />
        <Field label="قيمة كل 100 نقطة (ر.س خصم)" type="number" step="0.5" value={loyalty.redeemPer100} onChange={(e) => setLoyalty({ ...loyalty, redeemPer100: num(e.target.value) })} />
        <Field label="أقل قيمة طلب لكسب النقاط (ر.س)" type="number" value={loyalty.minEarnOrder ?? 30} onChange={(e) => setLoyalty({ ...loyalty, minEarnOrder: num(e.target.value) })} />
      </Section>

      <Section icon={Palette} title="المظهر والتصميم" desc="ألوان الهوية والوضع الافتراضي — تُطبَّق حيّاً" saving={saving} onSave={doSave('theme', theme)}>
        <ColorField label="اللون الأساسي (الأخضر)" value={theme.primary} onChange={(e) => setTheme({ ...theme, primary: e.target.value })} />
        <ColorField label="لون التمييز (العروض)" value={theme.accent} onChange={(e) => setTheme({ ...theme, accent: e.target.value })} />
        <div>
          <label className="text-xs font-medium text-narges-text-secondary block mb-1">الوضع الافتراضي للزوار</label>
          <select
            value={theme.defaultMode}
            onChange={(e) => setTheme({ ...theme, defaultMode: e.target.value })}
            className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narges-light"
          >
            <option value="dark">داكن 🌙</option>
            <option value="light">فاتح ☀️</option>
          </select>
        </div>
        <div className="flex items-end">
          <div className="w-full rounded-xl p-3 text-white text-sm font-bold text-center" style={{ background: `linear-gradient(120deg, ${theme.primary}, ${theme.accent})` }}>
            معاينة هوية {site.storeName}
          </div>
        </div>
      </Section>
    </div>
  );
}
