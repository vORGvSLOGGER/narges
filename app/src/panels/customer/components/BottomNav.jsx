import { Home, ShoppingCart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../../../store/useCartStore';

// الترتيب في RTL: أول عنصر = أقصى اليمين. السلة يمين، الرئيسية بالوسط، حسابي يسار.
const navItems = [
  { icon: ShoppingCart, label: 'السلة', path: '/Customer/cart' },
  { icon: Home, label: 'الرئيسية', path: '/Customer' },
  { icon: User, label: 'حسابي', path: '/Customer/profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-narges-surface border-t border-narges-border safe-area-pb">
      <div className="flex items-center justify-around px-4 py-2">
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
              <span className="relative">
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                {path === '/Customer/cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -left-2 min-w-[16px] h-4 px-1 bg-narges-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </span>
              <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
