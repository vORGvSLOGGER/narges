import { Plus, Minus, Star, Heart } from 'lucide-react';
import { useCartStore } from '../../../store/useCartStore';
import { useFavoritesStore } from '../../../store/useFavoritesStore';
import { useNavigate } from 'react-router-dom';
import { formatSAR } from '../../../utils/formatters';
import toast from 'react-hot-toast';

export default function ProductCard({ product, size = 'normal' }) {
  const addItem = useCartStore(s => s.addItem);
  const updateQty = useCartStore(s => s.updateQty);
  const qtyInCart = useCartStore(s => s.items.find(i => i.id === product.id)?.qty || 0);
  const isFav = useFavoritesStore(s => s.ids.includes(product.id));
  const toggleFav = useFavoritesStore(s => s.toggle);
  const navigate = useNavigate();
  const isSmall = size === 'small';

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product);
    if (qtyInCart === 0) {
      toast.success(`تمت الإضافة: ${product.nameAr}`, {
        duration: 1500,
        style: { fontFamily: 'IBM Plex Sans Arabic', direction: 'rtl', fontSize: '14px' }
      });
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    updateQty(product.id, qtyInCart - 1);
  };

  // صور المنتجات الحقيقية (packshot) تُعرض كاملة على خلفية بيضاء بدل القص
  const isPackshot = (product.image || '').includes('openfoodfacts');
  const handleImgError = (e) => {
    if (product.imageFallback && e.target.src !== product.imageFallback) {
      e.target.src = product.imageFallback;
    } else {
      e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80';
    }
  };

  const off = product.isOffer && product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => navigate(`/Customer/product/${product.id}`)}
      className={`anim-fade-up card-press bg-narges-surface border border-narges-border rounded-[20px] shadow-narges-sm cursor-pointer overflow-hidden flex flex-col p-2.5 ${isSmall ? 'w-40' : 'w-full'}`}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.nameAr}
          className={`w-full rounded-2xl ${isPackshot ? 'object-contain bg-white p-1' : 'object-cover'} ${isSmall ? 'h-[104px]' : 'h-[120px]'}`}
          loading="lazy"
          onError={handleImgError}
        />
        {off > 0 && (
          <span dir="ltr" className="absolute top-2 right-2 bg-narges-orange text-white text-[11px] font-bold px-2 py-1 rounded-full">
            -{off}%
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFav(product.id); }}
          className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
        >
          <Heart size={14} className={isFav ? 'text-red-500 fill-red-500' : 'text-white'} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 flex-1 pt-2">
        <p className="font-bold text-narges-text text-[13px] leading-snug line-clamp-2 min-h-[37px]">
          {product.nameAr}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-narges-text-secondary">
          <span>{product.unit}</span>
          <span>·</span>
          <Star size={11} className="text-yellow-400 fill-yellow-400" />
          <span>{product.rating}</span>
        </div>

        {/* Price + Add / Stepper */}
        <div className="flex items-end justify-between mt-auto pt-1.5">
          <div className="leading-tight">
            <span className="font-bold text-narges-green text-[15px]">{formatSAR(product.price)}</span>
            {off > 0 && (
              <span className="text-[11px] text-narges-muted line-through block leading-none mt-0.5">
                {formatSAR(product.originalPrice)}
              </span>
            )}
          </div>
          {qtyInCart === 0 ? (
            <button
              onClick={handleAdd}
              className="w-[34px] h-[34px] bg-narges-green rounded-xl flex items-center justify-center shadow-narges-green active:scale-90 transition-transform shrink-0"
            >
              <Plus size={20} className="text-white" strokeWidth={2.5} />
            </button>
          ) : (
            <div className="anim-pop flex items-center bg-narges-green rounded-xl shadow-narges-green shrink-0 h-[34px] overflow-hidden">
              <button
                onClick={handleAdd}
                className="w-[30px] h-full flex items-center justify-center active:bg-white/20 transition-colors"
              >
                <Plus size={16} className="text-white" strokeWidth={2.5} />
              </button>
              <span className="min-w-[22px] text-center text-white text-[13px] font-bold tabular-nums px-0.5">
                {qtyInCart}
              </span>
              <button
                onClick={handleRemove}
                className="w-[30px] h-full flex items-center justify-center active:bg-white/20 transition-colors"
              >
                <Minus size={16} className="text-white" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
