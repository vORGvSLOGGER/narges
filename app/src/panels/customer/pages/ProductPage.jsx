import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { fetchProductById } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import { useCartStore } from '../../../store/useCartStore';
import { formatSAR } from '../../../utils/formatters';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, loading } = useFetch(() => fetchProductById(id), [id]);
  const [qty, setQty] = useState(1);
  const { addItem, items } = useCartStore();
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-narges-text-secondary">
      <span className="animate-pulse">جاري التحميل...</span>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center text-narges-text-secondary">
      المنتج غير موجود
    </div>
  );

  const handleAddToCart = () => {
    addItem(product, qty);
    toast.success('تمت الإضافة للسلة!', {
      style: { fontFamily: 'IBM Plex Sans Arabic', direction: 'rtl' }
    });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-narges-surface flex flex-col">
      {/* Image */}
      <div className="relative h-72 bg-narges-bg">
        <img src={product.image} alt={product.nameAr} className="w-full h-full object-cover" />

        {/* Nav */}
        <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-narges-surface/90 backdrop-blur flex items-center justify-center shadow">
            <ArrowRight size={20} />
          </button>
          <button onClick={() => navigate('/Customer/cart')} className="relative w-10 h-10 rounded-xl bg-narges-surface/90 backdrop-blur flex items-center justify-center shadow">
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-narges-orange text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {product.isOffer && (
          <span className="absolute bottom-4 right-4 badge-offer text-sm px-3 py-1">
            خصم {Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 p-5 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-narges-text">{product.nameAr}</h1>
          <p className="text-narges-text-secondary text-sm mt-1">{product.unit}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold">{product.rating}</span>
          </div>
          <span className="text-sm text-narges-text-secondary">({product.reviewCount} تقييم)</span>
          <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
            {product.inStock ? '✓ متوفر' : 'نفد المخزون'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-narges-green">{formatSAR(product.price)}</span>
          {product.isOffer && (
            <span className="text-lg text-narges-muted line-through">{formatSAR(product.originalPrice)}</span>
          )}
        </div>

        {/* Quantity Picker */}
        <div className="flex items-center gap-4">
          <span className="font-medium text-narges-text">الكمية</span>
          <div className="flex items-center gap-3 bg-narges-bg rounded-xl p-1">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-lg bg-narges-surface shadow-sm flex items-center justify-center active:scale-90 transition-transform"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-bold text-lg">{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="w-9 h-9 rounded-lg bg-narges-light shadow-sm flex items-center justify-center active:scale-90 transition-transform"
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
        </div>

        <p className="text-narges-text-secondary text-sm leading-relaxed">
          منتج فاخر من أفضل المصادر المختارة بعناية لضمان أعلى جودة لعملائنا الكرام. يمكنك الطلب الآن والاستلام خلال 30-45 دقيقة.
        </p>
      </div>

      {/* Add to Cart Button */}
      <div className="p-4 pb-8 border-t bg-narges-surface">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ShoppingCart size={20} />
          إضافة للسلة — {formatSAR(product.price * qty)}
        </button>
      </div>
    </div>
  );
}
