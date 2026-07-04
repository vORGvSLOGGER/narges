import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Heart, Gift, Moon, LogOut, LogIn,
  ChevronLeft, ShieldCheck, UserPlus,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useLoyaltyStore, TIERS } from '../../../store/useLoyaltyStore';
import { useFavoritesStore } from '../../../store/useFavoritesStore';
import { isSupabaseConfigured } from '../../../lib/supabase';
import { isDark, setDark } from '../../../lib/theme';
import BottomNav from '../components/BottomNav';

const STAFF_PANEL = {
  admin: { label: 'لوحة الإدارة', path: '/Admin', icon: '📊' },
  cashier: { label: 'لوحة الكاشير', path: '/Cashier', icon: '💳' },
  delivery: { label: 'لوحة التوصيل', path: '/Delivery', icon: '🚗' },
};

function Row({ icon: Icon, label, value, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-right ${danger ? 'text-red-500' : 'text-narges-text'}`}
    >
      <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? 'bg-red-500/10' : 'bg-narges-surface2'}`}>
        <Icon size={17} />
      </span>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      {value !== undefined ? (
        <span className="text-xs text-narges-text-secondary">{value}</span>
      ) : (
        <ChevronLeft size={16} className="text-narges-muted" />
      )}
    </button>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { session, user, profile, signOut } = useAuthStore();
  const points = useLoyaltyStore((s) => s.points);
  const tier = useLoyaltyStore((s) => TIERS.findLast((t) => s.points >= t.minPoints) || TIERS[0]);
  const favCount = useFavoritesStore((s) => s.ids.length);
  const [dark, setDarkState] = useState(isDark());

  const loggedIn = !isSupabaseConfigured || !!session;
  const name = profile?.full_name || user?.email?.split('@')[0] || 'زائر نرجس';
  const staff = STAFF_PANEL[profile?.role];

  const handleLogout = async () => {
    await signOut();
    navigate('/Customer');
  };

  return (
    <div className="min-h-screen bg-narges-bg anim-fade-up pb-24">
      {/* Header card */}
      <div
        className="px-4 pt-8 pb-10 text-white"
        style={{ background: 'linear-gradient(135deg,#1B5E20,#2E7D32 45%,#66BB6A)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl font-bold">
            {name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg truncate">{name}</p>
            {session ? (
              <p className="text-white/80 text-xs mt-0.5 truncate" dir="ltr">{user?.email}</p>
            ) : (
              <p className="text-white/80 text-xs mt-0.5">سجّل دخولك لتجربة أكمل</p>
            )}
          </div>
          {staff && (
            <span className="bg-white/20 border border-white/30 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck size={12} /> موظف
            </span>
          )}
        </div>
      </div>

      <div className="px-4 -mt-5 space-y-4">
        {/* بطاقة الولاء المصغّرة */}
        <button
          onClick={() => navigate('/Customer/loyalty')}
          className="w-full card p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-narges-orange/10 flex items-center justify-center text-lg">🎁</span>
            <div className="text-right">
              <p className="text-sm font-bold text-narges-text">نقاط الولاء</p>
              <p className="text-xs text-narges-text-secondary">مستوى {tier.label}</p>
            </div>
          </div>
          <span className="font-bold text-narges-green text-lg">{points}</span>
        </button>

        {/* دخول الموظف للوحته */}
        {staff && (
          <button
            onClick={() => navigate(staff.path)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <span>{staff.icon}</span> الانتقال إلى {staff.label}
          </button>
        )}

        {/* القائمة */}
        <div className="card divide-y divide-narges-border overflow-hidden">
          <Row icon={ClipboardList} label="طلباتي" onClick={() => navigate('/Customer/orders')} />
          <Row icon={Heart} label="المفضلة" value={favCount ? `${favCount} منتج` : undefined} onClick={() => navigate('/Customer/favorites')} />
          <Row icon={Gift} label="مكافآتي ونقاطي" onClick={() => navigate('/Customer/loyalty')} />
          {/* الوضع الداكن */}
          <div className="w-full flex items-center gap-3 px-4 py-3.5">
            <span className="w-9 h-9 rounded-xl bg-narges-surface2 flex items-center justify-center">
              <Moon size={17} className="text-narges-text" />
            </span>
            <span className="flex-1 text-sm font-semibold text-narges-text text-right">الوضع الداكن</span>
            <button
              onClick={() => { setDark(!dark); setDarkState(!dark); }}
              className={`relative w-12 h-7 rounded-full transition-colors ${dark ? 'bg-narges-green' : 'bg-narges-surface2'}`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${dark ? 'right-1' : 'right-6'}`} />
            </button>
          </div>
        </div>

        {/* دخول / خروج */}
        {isSupabaseConfigured && !session ? (
          <div className="card overflow-hidden divide-y divide-narges-border">
            <Row icon={LogIn} label="تسجيل الدخول" onClick={() => navigate('/login', { state: { from: '/Customer/profile' } })} />
            <Row icon={UserPlus} label="إنشاء حساب جديد" onClick={() => navigate('/signup')} />
          </div>
        ) : session ? (
          <div className="card overflow-hidden">
            <Row icon={LogOut} label="تسجيل الخروج" danger onClick={handleLogout} />
          </div>
        ) : null}

        <p className="text-center text-[11px] text-narges-muted pt-2">نرجس سوبرماركت — الإصدار 0.9</p>
      </div>

      <BottomNav />
    </div>
  );
}
