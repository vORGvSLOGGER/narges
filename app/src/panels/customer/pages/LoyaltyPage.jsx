import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Gift, Clock, ChevronLeft } from 'lucide-react';
import { useLoyaltyStore, TIERS } from '../../../store/useLoyaltyStore';
import { formatDate } from '../../../utils/formatters';
import toast from 'react-hot-toast';

const TIER_ICONS = { bronze: '🥉', silver: '🥈', gold: '🥇' };
const REFERRAL_CODE = 'NARGES-A7MED';

export default function LoyaltyPage() {
  const navigate = useNavigate();
  const { points, history, redeemPoints, tier: tierFn } = useLoyaltyStore();
  const tier = useLoyaltyStore(s => {
    const pts = s.points;
    return TIERS.findLast(t => pts >= t.minPoints) || TIERS[0];
  });
  const nextTier = TIERS.find(t => t.minPoints > points);
  const progressPct = nextTier
    ? Math.min(100, ((points - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100)
    : 100;
  const redeemableBlocks = Math.floor(points / 100);

  const handleRedeem = () => {
    if (redeemableBlocks < 1) {
      toast.error('تحتاج 100 نقطة على الأقل للاستبدال');
      return;
    }
    const discount = redeemPoints(100);
    toast.success(`تم استبدال 100 نقطة بخصم ${discount} ر.س على طلبك القادم!`);
  };

  const copyReferral = () => {
    navigator.clipboard?.writeText(REFERRAL_CODE);
    toast.success('تم نسخ رمز الإحالة!');
  };

  return (
    <div className="min-h-screen bg-narges-bg pb-24">
      {/* Header */}
      <div className="bg-narges-green px-4 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narges-surface/20 flex items-center justify-center">
            <ArrowRight size={18} className="text-white" />
          </button>
          <h1 className="text-white font-bold text-xl">نظام الولاء</h1>
        </div>

        {/* Tier Card */}
        <div className="bg-narges-surface/15 backdrop-blur-sm rounded-2xl p-5">
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

          {nextTier && (
            <>
              <div className="h-2 bg-narges-surface/20 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-narges-surface rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-white/70 text-xs">
                {nextTier.minPoints - points} نقطة للوصول إلى {nextTier.label} {TIER_ICONS[nextTier.id]}
              </p>
            </>
          )}
          {!nextTier && (
            <p className="text-white/80 text-sm font-medium">وصلت لأعلى مستوى! 🎉</p>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Tiers Info */}
        <div className="card p-4">
          <h3 className="font-bold mb-3">مستويات الولاء</h3>
          <div className="space-y-2">
            {TIERS.map(t => (
              <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl ${tier.id === t.id ? 'bg-green-50 border border-narges-light' : 'bg-narges-bg'}`}>
                <span className="text-xl">{TIER_ICONS[t.id]}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{t.label}</p>
                  <p className="text-xs text-narges-text-secondary">
                    {t.maxPoints === Infinity ? `${t.minPoints}+ نقطة` : `${t.minPoints} - ${t.maxPoints} نقطة`}
                  </p>
                </div>
                {t.discount > 0 && (
                  <span className="text-xs bg-narges-orange/10 text-narges-orange font-bold px-2 py-0.5 rounded-full">
                    خصم {t.discount}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Redeem */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift size={18} className="text-narges-orange" />
            <h3 className="font-bold">استبدال النقاط</h3>
          </div>
          <p className="text-sm text-narges-text-secondary mb-4">كل 100 نقطة = 5 ريال خصم على طلبك القادم</p>
          <div className="flex items-center justify-between bg-narges-bg rounded-xl p-3 mb-3">
            <span className="text-sm">النقاط القابلة للاستبدال</span>
            <span className="font-bold text-narges-green">{redeemableBlocks * 100} نقطة = {redeemableBlocks * 5} ر.س</span>
          </div>
          <button
            onClick={handleRedeem}
            disabled={redeemableBlocks < 1}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              redeemableBlocks >= 1
                ? 'bg-narges-orange text-white active:scale-95'
                : 'bg-narges-surface2 text-narges-muted cursor-not-allowed'
            }`}
          >
            استبدل 100 نقطة ← خصم 5 ر.س
          </button>
        </div>

        {/* Referral */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star size={18} className="text-narges-light" />
            <h3 className="font-bold">دعوة الأصدقاء</h3>
          </div>
          <p className="text-sm text-narges-text-secondary mb-4">ادع صديقاً واحصل على 50 نقطة لكل منكما عند أول طلب</p>
          <div className="flex items-center gap-2 bg-narges-bg rounded-xl p-3">
            <span className="flex-1 font-mono font-bold text-narges-green tracking-widest text-center">{REFERRAL_CODE}</span>
            <button
              onClick={copyReferral}
              className="bg-narges-green text-white text-xs px-3 py-1.5 rounded-lg font-medium"
            >
              نسخ
            </button>
          </div>
        </div>

        {/* History */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-narges-text-secondary" />
            <h3 className="font-bold">سجل النقاط</h3>
          </div>
          {history.length === 0 ? (
            <p className="text-center text-narges-text-secondary text-sm py-4">لا يوجد سجل بعد</p>
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
