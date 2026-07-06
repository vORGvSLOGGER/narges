import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Heart, Gift, Settings, Lock,
  ChevronLeft, ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useLoyaltyStore, TIERS } from '../../../store/useLoyaltyStore';
import { useFavoritesStore } from '../../../store/useFavoritesStore';
import { isSupabaseConfigured } from '../../../lib/supabase';
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
  const { session, user, profile } = useAuthStore();
  const points = useLoyaltyStore((s) => s.points);
  const tier = useLoyaltyStore((s) => TIERS.findLast((t) => s.points >= t.minPoints) || TIERS[0]);
  const favCount = useFavoritesStore((s) => s.ids.length);

  const loggedIn = !isSupabaseConfigured || !!session;
  const name = profile?.full_name || user?.email?.split('@')[0] || 'زائر نرجس';
  const staff = STAFF_PANEL[profile?.role];

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
              <p className="text-white/80 text-xs mt-0.5 truncate" dir="ltr">{profile?.phone || user?.email}</p>
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
        {/* بطاقة الولاء المصغّرة — مقفلة للزائر */}
        <button
          onClick={() => navigate(loggedIn ? '/Customer/loyalty' : '/login', loggedIn ? undefined : { state: { from: '/Customer/loyalty' } })}
          className="w-full card p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-narges-orange/10 flex items-center justify-center text-lg">
              {loggedIn ? '🎁' : <Lock size={17} className="text-narges-text-secondary" />}
            </span>
            <div className="text-right">
              <p className="text-sm font-bold text-narges-text">نقاط الولاء</p>
              <p className="text-xs text-narges-text-secondary">{loggedIn ? `مستوى ${tier.label}` : 'سجّل الدخول لفتح النقاط والإحالة'}</p>
            </div>
          </div>
          {loggedIn && <span className="font-bold text-narges-green text-lg">{points}</span>}
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
          <Row icon={Settings} label="الإعدادات" onClick={() => navigate('/Customer/settings')} />
        </div>

        <p className="text-center text-[11px] text-narges-muted pt-2">نرجس سوبرماركت — الإصدار 0.15</p>
      </div>

      <BottomNav />
    </div>
  );
}
