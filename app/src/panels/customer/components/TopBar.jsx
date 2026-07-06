import { ShoppingCart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useCartStore } from '../../../store/useCartStore';

export default function TopBar() {
  const navigate = useNavigate();
  const site = useSettingsStore((s) => s.settings.site);
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));

  return (
    <div className="sticky top-0 z-40 bg-narges-surface shadow-narges-sm">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        {/* الشعار + الموقع */}
        <div className="flex items-center gap-2 text-right">
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
        </div>

        {/* السلة */}
        <button
          onClick={() => navigate('/Customer/cart')}
          className="relative w-10 h-10 rounded-xl bg-narges-bg flex items-center justify-center active:scale-90 transition-transform"
        >
          <ShoppingCart size={19} className="text-narges-text" />
          {cartCount > 0 && (
            <span className="anim-pop absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] px-1 bg-narges-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
