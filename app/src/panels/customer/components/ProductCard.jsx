import { Plus, Star } from 'lucide-react';
import { useCartStore } from '../../../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { formatSAR } from '../../../utils/formatters';
import toast from 'react-hot-toast';

export default function ProductCard({ product, size = 'normal' }) {
  const addItem = useCartStore(s => s.addItem);
  const navigate = useNavigate();
  const isSmall = size === 'small';

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product);
    toast.success(`تمت الإضافة: ${product.nameAr}`, {
      duration: 1500,
      style: { fontFamily: 'IBM Plex Sans Arabic', direction: 'rtl', fontSize: '14px' }
    });
  };

  return (
    <div
      onClick={() => navigate(`/customer/product/${product.id}`)}
      className={`card cursor-pointer overflow-hidden flex flex-col ${isSmall ? 'w-36' : 'w-full'}`}
    >
      {/* Image */}
      <div className={`relative bg-gray-50 ${isSmall ? 'h-28' : 'h-36'}`}>
        <img
          src={product.image}
          alt={product.nameAr}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80'; }}
        />
        {product.isOffer && (
          <span className="absolute top-2 right-2 badge-offer">
            خصم {Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1 flex-1">
        <p className={`font-medium text-narges-text leading-tight line-clamp-2 ${isSmall ? 'text-xs' : 'text-sm'}`}>
          {product.nameAr}
        </p>
        <p className="text-xs text-narges-text-secondary">{product.unit}</p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star size={11} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-narges-text-secondary">{product.rating}</span>
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div>
            <span className={`font-bold text-narges-green ${isSmall ? 'text-sm' : 'text-base'}`}>
              {formatSAR(product.price)}
            </span>
            {product.isOffer && (
              <span className="text-xs text-gray-400 line-through block leading-none">
                {formatSAR(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="w-7 h-7 bg-narges-light rounded-lg flex items-center justify-center active:scale-90 transition-transform"
          >
            <Plus size={16} className="text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
