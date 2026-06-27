import { ShoppingCart, Search, MapPin } from 'lucide-react';
import { useCartStore } from '../../../store/useCartStore';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ onSearchClick, onCartClick }) {
  const items = useCartStore(s => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const navigate = useNavigate();

  return (
    <div className="sticky top-8 z-40 bg-white shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo + Location */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-narjis-green rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">ن</span>
          </div>
          <div>
            <p className="text-xs text-narjis-text-secondary leading-none">التوصيل إلى</p>
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-narjis-light" />
              <span className="text-sm font-semibold text-narjis-text">حي الروضة، الرياض</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick || (() => navigate('/Customer/search'))}
            className="w-9 h-9 rounded-xl bg-narjis-bg flex items-center justify-center"
          >
            <Search size={18} className="text-narjis-text" />
          </button>
          <button
            onClick={onCartClick || (() => navigate('/Customer/cart'))}
            className="relative w-9 h-9 rounded-xl bg-narjis-bg flex items-center justify-center"
          >
            <ShoppingCart size={18} className="text-narjis-text" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-narjis-orange text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
