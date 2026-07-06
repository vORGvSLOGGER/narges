import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Moon, MapPin, Phone, LogOut, Info, Settings } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { isDark, setDark } from '../../../lib/theme';
import BottomNav from '../components/BottomNav';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { session, signOut } = useAuthStore();
  const site = useSettingsStore((s) => s.settings.site);
  const [dark, setDarkState] = useState(isDark());

  const handleLogout = async () => {
    await signOut();
    navigate('/Customer');
  };

  return (
    <div className="min-h-screen bg-narges-bg anim-fade-up pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-narges-surface shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center active:scale-90 transition-transform">
            <ArrowRight size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-narges-green/10 flex items-center justify-center">
              <Settings size={18} className="text-narges-green" />
            </span>
            <h1 className="text-lg font-bold text-narges-text">الإعدادات</h1>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* المظهر */}
        <div className="card overflow-hidden">
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

        {/* معلومات المتجر */}
        <div className="card divide-y divide-narges-border overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="w-9 h-9 rounded-xl bg-narges-surface2 flex items-center justify-center">
              <MapPin size={17} className="text-narges-text" />
            </span>
            <span className="flex-1 text-sm font-semibold text-narges-text text-right">منطقة التوصيل</span>
            <span className="text-xs text-narges-text-secondary">{site.district}، {site.city}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="w-9 h-9 rounded-xl bg-narges-surface2 flex items-center justify-center">
              <Phone size={17} className="text-narges-text" />
            </span>
            <span className="flex-1 text-sm font-semibold text-narges-text text-right">تواصل معنا</span>
            <span dir="ltr" className="text-xs text-narges-text-secondary">{site.phone}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="w-9 h-9 rounded-xl bg-narges-surface2 flex items-center justify-center">
              <Info size={17} className="text-narges-text" />
            </span>
            <span className="flex-1 text-sm font-semibold text-narges-text text-right">إصدار التطبيق</span>
            <span className="text-xs text-narges-text-secondary">0.15</span>
          </div>
        </div>

        {/* الخروج */}
        {session && (
          <div className="card overflow-hidden">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500">
              <span className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                <LogOut size={17} />
              </span>
              <span className="flex-1 text-sm font-semibold text-right">تسجيل الخروج</span>
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
