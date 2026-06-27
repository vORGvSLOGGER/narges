import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Truck, Settings, Tag, MessageSquareWarning } from 'lucide-react';
import BranchSelector from './BranchSelector';

const navItems = [
  { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/Admin' },
  { icon: ShoppingBag, label: 'الطلبات', path: '/Admin/orders' },
  { icon: Package, label: 'المنتجات', path: '/Admin/products' },
  { icon: Truck, label: 'تتبع المناديب', path: '/Admin/drivers-map' },
  { icon: Tag, label: 'العروض', path: '/Admin/offers' },
  { icon: MessageSquareWarning, label: 'الشكاوي', path: '/Admin/complaints' },
  { icon: Settings, label: 'الإعدادات', path: '/Admin/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-narjis-green flex flex-col print:hidden">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">ن</span>
          </div>
          <div>
            <p className="text-white font-bold">نرجس</p>
            <p className="text-white/60 text-xs">لوحة الإدارة</p>
          </div>
        </div>
      </div>

      {/* Branch Selector */}
      <BranchSelector />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/Admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? 'bg-white text-narjis-green shadow'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            م
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">محمد العمري</p>
            <p className="text-white/50 text-xs">مدير المتجر</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
