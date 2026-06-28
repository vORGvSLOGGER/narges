import { useAuthStore, PANELS } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const panels = [
  { id: PANELS.CUSTOMER, label: 'العميل', icon: '🛒', path: '/Customer' },
  { id: PANELS.DELIVERY, label: 'التوصيل', icon: '🚗', path: '/Delivery' },
  { id: PANELS.CASHIER, label: 'الكاشير', icon: '💳', path: '/Cashier' },
  { id: PANELS.ADMIN, label: 'الإدارة', icon: '📊', path: '/Admin' },
];

export default function PanelSwitcher() {
  const { activePanel, setPanel } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-narges-green shadow-lg">
      <div className="flex items-center justify-center gap-1 px-2 py-1">
        <span className="text-white/60 text-xs ml-2 hidden sm:block">عرض تجريبي:</span>
        {panels.map(p => (
          <button
            key={p.id}
            onClick={() => { setPanel(p.id); navigate(p.path); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${activePanel === p.id
                ? 'bg-white text-narges-green shadow'
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
