import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Gift, Clock, Lock, LogIn, UserPlus, BadgeCheck } from 'lucide-react';
import { useLoyaltyStore, TIERS } from '../../../store/useLoyaltyStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { isSupabaseConfigured } from '../../../lib/supabase';
import { formatDate } from '../../../utils/formatters';
import toast from 'react-hot-toast';

const TIER_ICONS = { bronze: '🥉', silver: '🥈', gold: '🥇' };

// تجزئة djb2 لمعرّف الحساب → 8 رموز من أبجدية غير ملتبسة (بدون O/0/I/1) بصيغة NRJS-XXXXXXXX.
// ثابت لكل حساب وفريد عملياً، ولا يمكن استنتاج بياناته منه.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function makeReferralCode(userId) {
  const seed = userId || 'narges-demo-user';
  let h1 = 5381, h2 = 52711;
  for (let i = 0; i < seed.length; i++) {
    h1 = ((h1 * 33) ^ seed.charCodeAt(i)) >>> 0;
    h2 = ((h2 * 37) ^ seed.charCodeAt(seed.length - 1 - i)) >>> 0;
  }
  let out = '';
  for (let i = 0; i < 8; i++) {
    const n = i < 4 ? h1 >>> (i * 8) : h2 >>> ((i - 4) * 8);
    out += CODE_ALPHABET[n % CODE_ALPHABET.length];
  }
  return `NRJS-${out}`;
}

export default function LoyaltyPage() {
  const navigate = useNavigate();
  const { user, profile, session } = useAuthStore();
  const { points, history, redeemAll, pendingDiscount } = useLoyaltyStore();
  const loyalty = useSettingsStore((s) => s.settings.loyalty);
  const loggedIn = !isSupabaseConfigured || !!session;

  const tier = TIERS.findLast((t) => points >= t.minPoints) || TIERS[0];
  const nextTier = TIERS.find((t) => t.minPoints > points);
  const progressPct = nextTier
    ? Math.min(100, ((points - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100)
    : 100;
  const discountValue = Math.floor(points / 100) * (loyalty.redeemPer100 || 5);

  // رمز إحالة إنجليزي مولّد آلياً بالكامل من معرّف الحساب — لا يحمل أي جزء من الاسم أو الجوال
  const referralCode = makeReferralCode(user?.id);

  // ---- شاشة القفل للزائر ----
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-narges-bg anim-fade-up">
        <div className="px-4 pt-12">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narges-surface shadow-narges-sm flex items-center justify-center">
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center px-6 pt-16 text-center">
          <div className="anim-float w-20 h-20 rounded-3xl bg-narges-green/10 flex items-center justify-center mb-5">
            <Lock size={36} className="text-narges-green" />
          </div>
          <h1 className="text-xl font-bold text-narges-text">نقاط الولاء والإحالة مقفلة</h1>
          <p className="text-sm text-narges-text-secondary mt-2 leading-relaxed max-w-xs">
            سجّل دخولك لتجمع نقاطاً مع كل طلب فوق {loyalty.minEarnOrder ?? 30} ر.س،
            وتحوّلها لخصم بالريال، وتحصل على رمز إحالة باسمك تدعو به أصدقاءك.
          </p>
          <div className="w-full max-w-xs space-y-2.5 mt-8">
            <button
              onClick={() => navigate('/login', { state: { from: '/Customer/loyalty' } })}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <LogIn size={17} /> تسجيل الدخول
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="w-full border-2 border-narges-green text-narges-green font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <UserPlus size={17} /> إنشاء حساب جديد
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleRedeem = () => {
    if (discountValue <= 0) {
      toast.error('تحتاج 100 نقطة على الأقل لاستخدام الخصم');
      return;
    }
    const d = redeemAll();
    toast.success(`حصلت على خصم ${d} ر.س على طلبك القادم — وعادت نقاطك للصفر`);
  };

  const copyReferral = () => {
    navigator.clipboard?.writeText(referralCode);
    toast.success('تم نسخ رمز الإحالة!');
  };

  return (
    <div className="min-h-screen bg-narges-bg pb-24 anim-fade-up">
      {/* Header */}
      <div className="bg-narges-green px-4 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <ArrowRight size={18} className="text-white" />
          </button>
          <h1 className="text-white font-bold text-xl">نظام الولاء</h1>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm">مستواك الحالي</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl">{TIER_ICONS[tier.id]}</span>
                <span className="text-white font-bold text-2xl">{tier.label}</span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-white/70 text-sm">نقاطك</p>
              <p className="text-white font-bold text-3xl">{points}</p>
            </div>
          </div>

          {nextTier ? (
            <>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-narges-surface rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="text-white/70 text-xs">
                {nextTier.minPoints - points} نقطة للوصول إلى {nextTier.label} {TIER_ICONS[nextTier.id]}
              </p>
            </>
          ) : (
            <p className="text-white/80 text-sm font-medium">وصلت لأعلى مستوى! 🎉</p>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* خصم قيد الاستخدام */}
        {pendingDiscount > 0 && (
          <div className="card p-4 border-2 border-narges-green flex items-center gap-3">
            <BadgeCheck size={22} className="text-narges-green flex-shrink-0" />
            <p className="text-sm font-semibold text-narges-text">
              عندك خصم <span className="text-narges-green font-bold">{pendingDiscount} ر.س</span> جاهز — ينطبق تلقائياً على طلبك القادم.
            </p>
          </div>
        )}

        {/* استخدام الخصم */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift size={18} className="text-narges-orange" />
            <h3 className="font-bold">حوّل نقاطك لخصم</h3>
          </div>
          <div className="flex items-center justify-between bg-narges-bg rounded-xl p-3 mb-3">
            <span className="text-sm">خصمك الحالي</span>
            <span className="font-bold text-narges-green text-lg">{discountValue} ر.س</span>
          </div>
          <button
            onClick={handleRedeem}
            disabled={discountValue <= 0}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              discountValue > 0
                ? 'bg-narges-orange text-white active:scale-95'
                : 'bg-narges-surface2 text-narges-muted cursor-not-allowed'
            }`}
          >
            {discountValue > 0 ? `استخدم خصم ${discountValue} ر.س الآن` : 'اجمع 100 نقطة لتفتح الخصم'}
          </button>
          <ul className="text-[11px] text-narges-text-secondary mt-3 space-y-1 pr-4 list-disc leading-relaxed">
            <li>تكسب {loyalty.earnPerSar || 1} نقطة لكل ريال — على الطلبات فوق {loyalty.minEarnOrder ?? 30} ر.س فقط.</li>
            <li>كل 100 نقطة = خصم {loyalty.redeemPer100 || 5} ر.س (خصم بالريال وليس نسبة).</li>
            <li>عند استخدام الخصم تعود نقاطك إلى الصفر وتبدأ التجميع من جديد.</li>
            <li>النقاط لا تُستبدل بمبلغ نقدي.</li>
          </ul>
        </div>

        {/* المستويات */}
        <div className="card p-4">
          <h3 className="font-bold mb-3">مستويات الولاء</h3>
          <div className="space-y-2">
            {TIERS.map(t => (
              <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl ${tier.id === t.id ? 'bg-narges-green/10 border border-narges-light' : 'bg-narges-bg'}`}>
                <span className="text-xl">{TIER_ICONS[t.id]}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{t.label}</p>
                  <p className="text-xs text-narges-text-secondary">
                    {t.maxPoints === Infinity ? `${t.minPoints}+ نقطة` : `${t.minPoints} - ${t.maxPoints} نقطة`}
                  </p>
                </div>
                {tier.id === t.id && (
                  <span className="text-xs bg-narges-green/10 text-narges-green font-bold px-2 py-0.5 rounded-full">مستواك</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* الإحالة */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star size={18} className="text-narges-light" />
            <h3 className="font-bold">دعوة الأصدقاء</h3>
          </div>
          <p className="text-sm text-narges-text-secondary mb-4">
            رمزك الخاص — ادع صديقاً واحصلا على 50 نقطة لكل منكما عند أول طلب له.
          </p>
          <div className="flex items-center gap-2 bg-narges-bg rounded-xl p-3">
            <span className="flex-1 font-mono font-bold text-narges-green tracking-widest text-center" dir="ltr">{referralCode}</span>
            <button onClick={copyReferral} className="bg-narges-green text-white text-xs px-3 py-1.5 rounded-lg font-medium">
              نسخ
            </button>
          </div>
        </div>

        {/* السجل */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-narges-text-secondary" />
            <h3 className="font-bold">سجل النقاط</h3>
          </div>
          {history.length === 0 ? (
            <p className="text-center text-narges-text-secondary text-sm py-4">لا يوجد سجل بعد — اطلب لتبدأ التجميع!</p>
          ) : (
            <div className="space-y-2">
              {history.map(h => (
                <div key={h.id} className="flex items-center justify-between py-2 border-b border-narges-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{h.description}</p>
                    <p className="text-xs text-narges-text-secondary">{formatDate(h.date)}</p>
                  </div>
                  <span className={`font-bold text-sm ${h.points > 0 ? 'text-narges-green' : 'text-red-500'}`}>
                    {h.points > 0 ? '+' : ''}{h.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
