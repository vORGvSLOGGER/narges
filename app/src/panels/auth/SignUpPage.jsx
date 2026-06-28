import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { isSupabaseConfigured } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const navigate = useNavigate();
  const signUp = useAuthStore((s) => s.signUp);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      toast.error('Supabase غير مهيأ. أضف مفاتيح البيئة أولاً.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setLoading(true);
    try {
      const data = await signUp(form);
      if (data.session) {
        toast.success('تم إنشاء الحساب');
        navigate('/Customer', { replace: true });
      } else {
        toast.success('تم إنشاء الحساب! تحقق من بريدك لتأكيد الحساب ثم سجّل الدخول.');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      toast.error(err.message === 'User already registered' ? 'هذا البريد مسجّل مسبقاً' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-narges-bg flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-narges-green rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🌷</div>
          <h1 className="text-2xl font-bold text-narges-text">إنشاء حساب</h1>
          <p className="text-narges-text-secondary text-sm mt-1">انضم إلى نرجس سوبرماركت</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-5 space-y-4">
          <Field icon={User} label="الاسم الكامل" value={form.fullName} onChange={set('fullName')} placeholder="محمد العتيبي" required />
          <Field icon={Phone} label="رقم الجوال" value={form.phone} onChange={set('phone')} placeholder="05xxxxxxxx" dir="ltr" />
          <Field icon={Mail} label="البريد الإلكتروني" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" dir="ltr" required />
          <Field icon={Lock} label="كلمة المرور" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" dir="ltr" required />

          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <Loader2 size={18} className="animate-spin" />}
            إنشاء الحساب
          </button>
        </form>

        <p className="text-center text-sm text-narges-text-secondary mt-4">
          لديك حساب؟{' '}
          <Link to="/login" className="text-narges-light font-medium">سجّل الدخول</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder, dir, required }) {
  return (
    <div>
      <label className="text-xs text-narges-text-secondary mb-1 block">{label}</label>
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-narges-light">
        <Icon size={16} className="text-narges-text-secondary" />
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          dir={dir}
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}
