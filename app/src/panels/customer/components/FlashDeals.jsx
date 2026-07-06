import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

// الثواني المتبقية حتى منتصف الليل (تنتهي عروض اليوم)
function secondsToMidnight() {
  const now = new Date();
  const mid = new Date(now);
  mid.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((mid - now) / 1000));
}

const pad = (n) => String(n).padStart(2, '0');

export default function FlashDeals({ products = [], onAll }) {
  const [left, setLeft] = useState(secondsToMidnight());

  useEffect(() => {
    const t = setInterval(() => setLeft(secondsToMidnight()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!products.length) return null;

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;

  return (
    <section>
      {/* الترويسة + المؤقّت */}
      <div
        className="flex items-center justify-between rounded-2xl px-4 py-3 mb-3 text-white"
        style={{ background: 'linear-gradient(120deg,#FF7A00,#FF9D3D)' }}
      >
        <div>
          <p className="font-bold text-[15px] leading-tight">⚡ عروض تنتهي الليلة</p>
          <p className="text-white/85 text-[11px] mt-0.5">خصومات يومية — الحق قبل انتهاء الوقت</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
        <div dir="ltr" className="flex items-center gap-1">
          {[pad(h), pad(m), pad(s)].map((v, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="font-bold text-white/80">:</span>}
              <span className="bg-black/25 rounded-lg px-2 py-1 font-bold text-sm tabular-nums min-w-[34px] text-center">
                {v}
              </span>
            </span>
          ))}
        </div>
        {onAll && (
          <button onClick={onAll} className="bg-white/20 border border-white/30 rounded-full px-3 py-0.5 text-[11px] font-bold active:scale-95 transition-transform">
            عرض الكل ←
          </button>
        )}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {products.slice(0, 8).map((p) => (
          <div key={p.id} className="flex-shrink-0 w-40">
            <ProductCard product={p} size="small" />
          </div>
        ))}
      </div>
    </section>
  );
}
