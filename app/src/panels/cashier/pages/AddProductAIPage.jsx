import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { categories } from '../../../data/categories';
import { buildGeminiContext } from '../../../data/productCatalog';
import toast from 'react-hot-toast';

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;

async function analyzeProductImage(base64, mimeType) {
  if (!GEMINI_KEY) {
    await new Promise(r => setTimeout(r, 1800));
    return {
      nameAr: 'حليب المراعي كامل الدسم',
      unit: 'لتر',
      price: 9.5,
      categoryId: 'dairy-eggs',
      confidence: 0.92,
    };
  }
  const { brandsText, pricesText, productsText } = buildGeminiContext();
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { mimeType, data: base64 } },
            { text: `انت خبير في منتجات السوبرماركت السعودي. حلل هذه الصورة بدقة عالية.

الماركات الشائعة في السوق السعودي:
${brandsText}

نطاقات الاسعار المعتادة بالريال السعودي:
${pricesText}

امثلة على منتجات شائعة للمرجع:
${productsText}

بناء على هذا السياق، اعطني معلومات المنتج في الصورة بالتنسيق التالي فقط (JSON):
{"nameAr":"اسم المنتج بالعربي مع الماركة والحجم","unit":"الوحدة (كيلو او قطعة او لتر او علبة او كيس)","price":السعر_المقترح_بالريال_رقم_فقط,"categoryId":"من هذه الاقسام: fruits-veg او dairy-eggs او meat-poultry او bakery او beverages او grains-staples او cleaning او personal-care او frozen او snacks","confidence":نسبة_الثقة_0_الى_1}
اجب بـ JSON فقط بدون اي نص اضافي.` }
          ]
        }]
      }),
    }
  );
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const jsonStr = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
}

export default function AddProductAIPage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nameAr: '', unit: 'قطعة', price: '', categoryId: '', stockQty: '50' });

  const handleFile = (file) => {
    if (!file?.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      setError(null);
      setResult(null);
      setLoading(true);
      try {
        const base64 = dataUrl.split(',')[1];
        const info = await analyzeProductImage(base64, file.type);
        setResult(info);
        setForm(f => ({
          ...f,
          nameAr: info.nameAr || '',
          unit: info.unit || 'قطعة',
          price: info.price?.toString() || '',
          categoryId: info.categoryId || '',
        }));
        toast.success('تم تحليل الصورة بنجاح!');
      } catch (err) {
        setError('فشل تحليل الصورة. حاول مرة أخرى أو أدخل البيانات يدوياً.');
        toast.error('فشل التحليل');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSave = () => {
    if (!form.nameAr || !form.price || !form.categoryId) {
      toast.error('يرجى إكمال جميع الحقول');
      return;
    }
    toast.success(`تم إضافة "${form.nameAr}" بنجاح!`);
    navigate('/Cashier');
  };

  return (
    <div className="min-h-screen bg-narjis-bg pb-10">
      {/* Header */}
      <div className="bg-narjis-green px-4 pt-12 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <ArrowRight size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-white font-bold text-lg">إضافة منتج بالصورة</h1>
            <p className="text-white/70 text-xs">الذكاء الاصطناعي يملأ البيانات تلقائياً</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Upload Zone */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="relative border-2 border-dashed border-narjis-light rounded-2xl overflow-hidden cursor-pointer active:scale-98 transition-transform bg-white"
          style={{ minHeight: 200 }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={e => handleFile(e.target.files[0])}
          />
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-52 object-contain" />
          ) : (
            <div className="flex flex-col items-center justify-center h-52 gap-3">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                <Camera size={32} className="text-narjis-light" />
              </div>
              <div className="text-center">
                <p className="font-bold text-narjis-text">التقط صورة أو ارفع من المعرض</p>
                <p className="text-sm text-narjis-text-secondary mt-1">PNG، JPG مدعوم</p>
              </div>
              <button className="flex items-center gap-2 bg-narjis-light text-white text-sm px-4 py-2 rounded-xl">
                <Upload size={14} />
                اختر صورة
              </button>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
              <Loader2 size={36} className="text-white animate-spin" />
              <p className="text-white font-medium text-sm">جاري تحليل الصورة...</p>
            </div>
          )}
        </div>

        {/* AI Result Banner */}
        {result && !loading && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
            <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700 font-medium">
              تم التعرف على المنتج بثقة {Math.round((result.confidence || 0.9) * 100)}%
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!GEMINI_KEY && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
            <strong>ملاحظة:</strong> لم يتم ضبط مفتاح Gemini API. أضف VITE_GEMINI_KEY في ملف .env لتفعيل التحليل الفعلي. الآن يعمل في وضع المحاكاة.
          </div>
        )}

        {/* Form */}
        <div className="card p-4 space-y-3">
          <h3 className="font-bold">بيانات المنتج</h3>

          <div>
            <label className="text-xs text-narjis-text-secondary mb-1 block">اسم المنتج *</label>
            <input
              value={form.nameAr}
              onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
              placeholder="مثال: حليب ألمراعي كامل الدسم"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narjis-light"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-narjis-text-secondary mb-1 block">السعر (ر.س) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narjis-light"
              />
            </div>
            <div>
              <label className="text-xs text-narjis-text-secondary mb-1 block">الوحدة</label>
              <select
                value={form.unit}
                onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narjis-light bg-white"
              >
                {['قطعة', 'كيلو', 'لتر', 'علبة', 'كرتون', 'باكيت'].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-narjis-text-secondary mb-1 block">القسم *</label>
              <select
                value={form.categoryId}
                onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narjis-light bg-white"
              >
                <option value="">اختر القسم</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nameAr}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-narjis-text-secondary mb-1 block">الكمية في المخزن</label>
              <input
                type="number"
                value={form.stockQty}
                onChange={e => setForm(f => ({ ...f, stockQty: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-narjis-light"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full btn-primary mt-2"
          >
            حفظ المنتج في المخزن
          </button>
        </div>
      </div>
    </div>
  );
}
