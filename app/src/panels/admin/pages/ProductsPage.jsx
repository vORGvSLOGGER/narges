import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct } from '../../../lib/api';
import { formatSAR } from '../../../utils/formatters';

const EMPTY = { nameAr: '', price: '', originalPrice: '', categoryId: '', unit: 'قطعة', stockQty: '50', isOffer: false, isFeatured: false, image: '' };
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=300&q=80';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    const [p, c] = await Promise.all([fetchProducts(), fetchCategories()]);
    setProducts(p);
    setCats(c);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const filtered = products.filter((p) => {
    const matchSearch = p.nameAr.includes(search);
    const matchCat = filterCat === 'all' || p.categoryId === filterCat;
    return matchSearch && matchCat;
  });

  const openNew = () => { setEditId(null); setForm({ ...EMPTY, categoryId: cats[0]?.id || '' }); setShowModal(true); };
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      nameAr: p.nameAr, price: String(p.price), originalPrice: String(p.originalPrice ?? p.price),
      categoryId: p.categoryId, unit: p.unit || 'قطعة', stockQty: String(p.stockQty ?? 0),
      isOffer: !!p.isOffer, isFeatured: !!p.isFeatured, image: p.image || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف هذا المنتج؟')) return;
    const prev = products;
    setProducts((ps) => ps.filter((p) => p.id !== id));
    try { await deleteProduct(id); toast.success('تم حذف المنتج'); }
    catch (e) { setProducts(prev); toast.error('تعذّر الحذف: ' + e.message); }
  };

  const handleSave = async () => {
    if (!form.nameAr || !form.price || !form.categoryId) { toast.error('أكمل الاسم والسعر والقسم'); return; }
    setSaving(true);
    const payload = {
      nameAr: form.nameAr,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice || form.price),
      categoryId: form.categoryId,
      unit: form.unit,
      stockQty: Number(form.stockQty) || 0,
      inStock: (Number(form.stockQty) || 0) > 0,
      isOffer: form.isOffer,
      isFeatured: form.isFeatured,
      image: form.image || DEFAULT_IMG,
    };
    try {
      if (editId) { await updateProduct(editId, payload); toast.success('تم تحديث المنتج'); }
      else { await createProduct(payload); toast.success('تمت إضافة المنتج'); }
      setShowModal(false);
      await reload();
    } catch (e) {
      toast.error('تعذّر الحفظ: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المنتجات</h1>
          <p className="text-narges-text-secondary text-sm">{loading ? 'جاري التحميل...' : `${products.length} منتج في المتجر`}</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          إضافة منتج
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-narges-surface rounded-xl px-3 py-2 shadow-sm flex-1 min-w-48">
          <Search size={16} className="text-narges-text-secondary" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث عن منتج..." className="flex-1 bg-transparent text-sm focus:outline-none" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="bg-narges-surface rounded-xl px-3 py-2 shadow-sm text-sm focus:outline-none border-none">
          <option value="all">جميع الأقسام</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-narges-bg">
              <tr className="text-narges-text-secondary text-xs">
                <th className="text-right px-4 py-3 font-medium">المنتج</th>
                <th className="text-right px-4 py-3 font-medium">القسم</th>
                <th className="text-right px-4 py-3 font-medium">السعر</th>
                <th className="text-right px-4 py-3 font-medium">المخزون</th>
                <th className="text-right px-4 py-3 font-medium">الحالة</th>
                <th className="text-center px-4 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-narges-border">
              {filtered.map((p) => {
                const cat = cats.find((c) => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="hover:bg-narges-bg/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.nameAr} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium">{p.nameAr}</p>
                          <p className="text-xs text-narges-text-secondary">{p.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-narges-bg px-2 py-1 rounded-lg">{cat?.icon} {cat?.nameAr}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-bold text-narges-green">{formatSAR(p.price)}</p>
                        {p.isOffer && <p className="text-xs text-narges-muted line-through">{formatSAR(p.originalPrice)}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${p.stockQty < 10 ? 'text-red-500' : 'text-narges-text'}`}>{p.stockQty}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.inStock ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">متوفر</span>
                                   : <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">نفد</span>}
                        {p.isOffer && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">عرض</span>}
                        {p.isFeatured && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">مميز</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
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
          {!loading && filtered.length === 0 && (
            <p className="text-center text-narges-text-secondary py-10 text-sm">لا توجد منتجات مطابقة</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-narges-surface rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b">
              <h2 className="font-bold text-lg">{editId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-narges-text-secondary block mb-1">اسم المنتج (عربي)</label>
                <input value={form.nameAr} onChange={set('nameAr')} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narges-light" placeholder="مثال: حليب المراعي 2 لتر" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-narges-text-secondary block mb-1">السعر (ر.س)</label>
                  <input type="number" value={form.price} onChange={set('price')} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narges-light" />
                </div>
                <div>
                  <label className="text-sm font-medium text-narges-text-secondary block mb-1">سعر قبل الخصم</label>
                  <input type="number" value={form.originalPrice} onChange={set('originalPrice')} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narges-light" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-narges-text-secondary block mb-1">القسم</label>
                <select value={form.categoryId} onChange={set('categoryId')} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narges-light">
                  <option value="" disabled>اختر القسم</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-narges-text-secondary block mb-1">الوحدة</label>
                  <input value={form.unit} onChange={set('unit')} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narges-light" placeholder="كيلو / قطعة / علبة" />
                </div>
                <div>
                  <label className="text-sm font-medium text-narges-text-secondary block mb-1">الكمية</label>
                  <input type="number" value={form.stockQty} onChange={set('stockQty')} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narges-light" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-narges-text-secondary block mb-1">رابط الصورة (اختياري)</label>
                <input value={form.image} onChange={set('image')} className="w-full border border-narges-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narges-light" placeholder="https://..." />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isOffer} onChange={set('isOffer')} className="w-4 h-4 rounded accent-narges-light" />
                  <span className="text-sm">عرض خاص</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} className="w-4 h-4 rounded accent-narges-light" />
                  <span className="text-sm">منتج مميز</span>
                </label>
              </div>
            </div>
            <div className="p-5 border-t flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 btn-outline">إلغاء</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary disabled:opacity-60">{saving ? 'جارٍ الحفظ...' : 'حفظ'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
