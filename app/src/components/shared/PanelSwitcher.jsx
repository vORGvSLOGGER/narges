import { useAuthStore, PANELS } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const panels = [
  { id: PANELS.CUSTOMER, label: 'العميل', icon: '🛒', path: '/customer' },
  { id: PANELS.DRIVER, label: 'المندوب', icon: '🚗', path: '/driver' },
  { id: PANELS.CASHIER, label: 'الكاشير', icon: '💳', path: '/cashier' },
  { id: PANELS.ADMIN, label: 'الإدارة', icon: '📊', path: '/admin' },
];

export default function PanelSwitcher() {
  const { activePanel, setPanel } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-narjis-green shadow-lg">
      <div className="flex items-center justify-center gap-1 px-2 py-1">
        <span className="text-white/60 text-xs ml-2 hidden sm:block">عرض تجريبي:</span>
        {panels.map(p => (
          <button
            key={p.id}
            onClick={() => { setPanel(p.id); navigate(p.path); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${activePanel === p.id
                ? 'bg-white text-narjis-green shadow'
                : 'text-white/80 hover:bg-white/10'
              }`}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
