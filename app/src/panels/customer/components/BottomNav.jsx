import { Home, Grid3X3, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'الرئيسية', path: '/Customer' },
  { icon: Grid3X3, label: 'الأقسام', path: '/Customer/categories' },
  { icon: ShoppingCart, label: 'السلة', path: '/Customer/cart' },
  { icon: ClipboardList, label: 'طلباتي', path: '/Customer/orders' },
  { icon: User, label: 'حسابي', path: '/Customer/profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-narges-surface border-t border-narges-border safe-area-pb">
      <div className="flex items-center justify-around px-1.5 py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path || (path !== '/Customer' && location.pathname.startsWith(path));
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                active ? 'text-narges-green' : 'text-narges-muted'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
