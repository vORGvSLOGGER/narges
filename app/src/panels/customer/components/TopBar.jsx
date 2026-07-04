import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../../store/useSettingsStore';

export default function TopBar({ onSearchClick }) {
  const navigate = useNavigate();
  const site = useSettingsStore((s) => s.settings.site);

  return (
    <div className="sticky top-0 z-40 bg-narges-surface shadow-narges-sm">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        {/* الشعار + الموقع */}
        <button onClick={() => navigate('/Customer/profile')} className="flex items-center gap-2 text-right active:scale-[0.98] transition-transform">
          <div className="w-9 h-9 bg-narges-green rounded-xl flex items-center justify-center shadow-narges-green">
            <span className="text-white font-bold text-lg">ن</span>
          </div>
          <div>
            <p className="text-xs text-narges-text-secondary leading-none">التوصيل إلى</p>
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-narges-light" />
              <span className="text-sm font-semibold text-narges-text">{site.district}، {site.city}</span>
            </div>
          </div>
        </button>

        {/* البحث */}
        <button
          onClick={onSearchClick || (() => navigate('/Customer/search'))}
          className="w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center active:scale-90 transition-transform"
        >
          <Search size={18} className="text-narges-text" />
        </button>
      </div>
    </div>
  );
}
