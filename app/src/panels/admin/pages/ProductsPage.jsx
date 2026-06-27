import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { products as initialProducts } from '../../../data/products';
import { categories } from '../../../data/categories';
import { formatSAR } from '../../../utils/formatters';

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const filtered = products.filter(p => {
    const matchSearch = p.nameAr.includes(search);
    const matchCat = filterCat === 'all' || p.categoryId === filterCat;
    return matchSearch && matchCat;
  });

  const handleEdit = (p) => { setEditProduct(p); setShowModal(true); };
  const handleDelete = (id) => {
    if (confirm('هل تريد حذف هذا المنتج؟')) {
      setProducts(ps => ps.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المنتجات</h1>
          <p className="text-narjis-text-secondary text-sm">{products.length} منتج في المتجر</p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          إضافة منتج
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm flex-1 min-w-48">
          <Search size={16} className="text-narjis-text-secondary" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث عن منتج..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="bg-white rounded-xl px-3 py-2 shadow-sm text-sm focus:outline-none border-none"
        >
          <option value="all">جميع الأقسام</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-narjis-bg">
              <tr className="text-narjis-text-secondary text-xs">
                <th className="text-right px-4 py-3 font-medium">المنتج</th>
                <th className="text-right px-4 py-3 font-medium">القسم</th>
                <th className="text-right px-4 py-3 font-medium">السعر</th>
                <th className="text-right px-4 py-3 font-medium">المخزون</th>
                <th className="text-right px-4 py-3 font-medium">الحالة</th>
                <th className="text-center px-4 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => {
                const cat = categories.find(c => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="hover:bg-narjis-bg/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.nameAr} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium">{p.nameAr}</p>
                          <p className="text-xs text-narjis-text-secondary">{p.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-narjis-bg px-2 py-1 rounded-lg">
                        {cat?.icon} {cat?.nameAr}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-bold text-narjis-green">{formatSAR(p.price)}</p>
                        {p.isOffer && <p className="text-xs text-gray-400 line-through">{formatSAR(p.originalPrice)}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${p.stockQty < 10 ? 'text-red-500' : 'text-narjis-text'}`}>
                        {p.stockQty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.inStock ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">متوفر</span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">نفد</span>
                        )}
                        {p.isOffer && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">عرض</span>}
                        {p.isFeatured && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">مميز</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(p)} className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b">
              <h2 className="font-bold text-lg">{editProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-narjis-text-secondary block mb-1">اسم المنتج (عربي)</label>
                <input
                  defaultValue={editProduct?.nameAr}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narjis-light"
                  placeholder="مثال: حليب ألمراعي 2 لتر"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-narjis-text-secondary block mb-1">السعر (ر.س)</label>
                  <input type="number" defaultValue={editProduct?.price} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narjis-light" />
                </div>
                <div>
                  <label className="text-sm font-medium text-narjis-text-secondary block mb-1">سعر قبل الخصم</label>
                  <input type="number" defaultValue={editProduct?.originalPrice} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narjis-light" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-narjis-text-secondary block mb-1">القسم</label>
                <select defaultValue={editProduct?.categoryId} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narjis-light">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-narjis-text-secondary block mb-1">الوحدة</label>
                  <input defaultValue={editProduct?.unit} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narjis-light" placeholder="كيلو / قطعة / علبة" />
                </div>
                <div>
                  <label className="text-sm font-medium text-narjis-text-secondary block mb-1">الكمية</label>
                  <input type="number" defaultValue={editProduct?.stockQty} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narjis-light" />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked={editProduct?.isOffer} className="w-4 h-4 rounded accent-narjis-light" />
                  <span className="text-sm">عرض خاص</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked={editProduct?.isFeatured} className="w-4 h-4 rounded accent-narjis-light" />
                  <span className="text-sm">منتج مميز</span>
                </label>
              </div>
            </div>
            <div className="p-5 border-t flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 btn-outline">إلغاء</button>
              <button onClick={() => setShowModal(false)} className="flex-1 btn-primary">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
