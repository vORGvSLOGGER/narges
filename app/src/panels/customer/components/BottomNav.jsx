import { Settings, LogIn, UserPlus, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { useLoyaltyStore } from '../../../store/useLoyaltyStore';
import { isSupabaseConfigured } from '../../../lib/supabase';

// الشريط السفلي = اختصار بروفايل العميل (لا تبويبات مكررة):
// يمين: الاسم وجواله (يفتح حسابي) — يسار: رصيد نقاطه ثم زر الإعدادات.
// للزائر: زرّا تسجيل الدخول وإنشاء حساب.
export default function BottomNav() {
  const navigate = useNavigate();
  const { session, user, profile } = useAuthStore();
  const points = useLoyaltyStore((s) => s.points);
  const loggedIn = !isSupabaseConfigured || !!session;

  if (!loggedIn) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-narges-surface border-t border-narges-border safe-area-pb">
        <div className="flex items-center gap-2.5 px-4 py-2.5">
          <button
            onClick={() => navigate('/login', { state: { from: '/Customer' } })}
            className="flex-1 bg-narges-green text-white font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-narges-green active:scale-[0.98] transition-transform"
          >
            <LogIn size={16} /> تسجيل الدخول
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="flex-1 border-2 border-narges-green text-narges-green font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
          >
            <UserPlus size={16} /> إنشاء حساب
          </button>
        </div>
      </div>
    );
  }

  const name = profile?.full_name || user?.email?.split('@')[0] || 'زائر نرجس';
  const phone = profile?.phone || '';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-narges-surface border-t border-narges-border safe-area-pb">
      <div className="flex items-center gap-2 px-4 py-2">
        {/* الاسم + الجوال → حسابي */}
        <button
          onClick={() => navigate('/Customer/profile')}
          className="flex items-center gap-2.5 flex-1 min-w-0 text-right active:scale-[0.98] transition-transform"
        >
          <span className="w-9 h-9 rounded-full bg-narges-green/15 text-narges-green font-bold flex items-center justify-center flex-shrink-0">
            {name[0]}
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-bold text-narges-text truncate leading-tight">{name}</span>
            {phone ? (
              <span dir="ltr" className="block text-[11px] text-narges-text-secondary truncate leading-tight">{phone}</span>
            ) : (
              <span className="block text-[11px] text-narges-text-secondary truncate leading-tight">حسابي</span>
            )}
          </span>
        </button>

        {/* الرصيد → الولاء */}
        <button
          onClick={() => navigate('/Customer/loyalty')}
          className="flex items-center gap-1.5 bg-narges-green/10 text-narges-green rounded-full px-3 py-1.5 active:scale-95 transition-transform flex-shrink-0"
        >
          <Gift size={14} />
          <span className="text-[13px] font-bold tabular-nums">{points.toLocaleString('en-US')}</span>
          <span className="text-[10px] font-semibold">نقطة</span>
        </button>

        {/* الإعدادات */}
        <button
          onClick={() => navigate('/Customer/settings')}
          className="w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
        >
          <Settings size={17} className="text-narges-text-secondary" />
        </button>
      </div>
    </div>
  );
}
