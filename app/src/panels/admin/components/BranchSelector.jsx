import { useBranchStore } from '../../../store/useBranchStore';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function BranchSelector() {
  const { branches, activeBranchId, setActiveBranch } = useBranchStore();
  const [open, setOpen] = useState(false);
  const active = branches.find(b => b.id === activeBranchId);

  return (
    <div className="relative px-3 py-2 border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white/10 rounded-xl px-3 py-2 text-sm"
      >
        <div className="flex items-center gap-2">
          <span className="text-white text-xs">🏪</span>
          <span className="text-white font-medium truncate text-xs">{active?.nameAr}</span>
        </div>
        <ChevronDown size={14} className={`text-white/60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-white rounded-xl shadow-xl overflow-hidden z-50">
          {branches.map(b => (
            <button
              key={b.id}
              onClick={() => { setActiveBranch(b.id); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-right transition-colors ${
                b.id === activeBranchId ? 'bg-green-50 text-narges-green font-bold' : 'text-narges-text hover:bg-narges-bg'
              }`}
            >
              <span>{b.city}</span>
              <span className="flex-1 truncate">{b.nameAr}</span>
              {b.id === activeBranchId && <span className="text-narges-green text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
