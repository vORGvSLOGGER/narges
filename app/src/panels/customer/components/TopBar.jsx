import { useState } from 'react';
import { ShoppingCart, Search, MapPin, Moon, Sun } from 'lucide-react';
import { useCartStore } from '../../../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { isDark, toggleDark } from '../../../lib/theme';

export default function TopBar({ onSearchClick, onCartClick }) {
  const items = useCartStore(s => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const navigate = useNavigate();
  const [dark, setDarkState] = useState(isDark());

  return (
    <div className="sticky top-0 z-40 bg-narges-surface shadow-narges-sm">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo + Location */}
        <button onClick={() => navigate('/Customer/profile')} className="flex items-center gap-2 text-right">
          <div className="w-9 h-9 bg-narges-green rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">ن</span>
          </div>
          <div>
            <p className="text-xs text-narges-text-secondary leading-none">التوصيل إلى</p>
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-narges-light" />
              <span className="text-sm font-semibold text-narges-text">حي الروضة، الرياض</span>
            </div>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkState(toggleDark())}
            title={dark ? 'الوضع الفاتح' : 'الوضع الداكن'}
            className="w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center"
          >
            {dark ? <Sun size={17} className="text-narges-text" /> : <Moon size={17} className="text-narges-text" />}
          </button>
          <button
            onClick={onSearchClick || (() => navigate('/Customer/search'))}
            className="w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center"
          >
            <Search size={18} className="text-narges-text" />
          </button>
          <button
            onClick={onCartClick || (() => navigate('/Customer/cart'))}
            className="relative w-9 h-9 rounded-xl bg-narges-bg flex items-center justify-center"
          >
            <ShoppingCart size={18} className="text-narges-text" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-narges-orange text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
