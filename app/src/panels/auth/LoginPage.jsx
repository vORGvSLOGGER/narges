import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { isSupabaseConfigured } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/Customer';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      toast.error('Supabase غير مهيأ. أضف مفاتيح البيئة أولاً.');
      return;
    }
    setLoading(true);
    try {
      await signIn({ email, password });
      toast.success('تم تسجيل الدخول');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message === 'Invalid login credentials' ? 'بيانات الدخول غير صحيحة' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-narges-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-narges-green rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🌷</div>
          <h1 className="text-2xl font-bold text-narges-text">نرجس سوبرماركت</h1>
          <p className="text-narges-text-secondary text-sm mt-1">سجّل الدخول للمتابعة</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-5 space-y-4">
          <div>
            <label className="text-xs text-narges-text-secondary mb-1 block">البريد الإلكتروني</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-narges-light">
              <Mail size={16} className="text-narges-text-secondary" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-transparent text-sm focus:outline-none"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-narges-text-secondary mb-1 block">كلمة المرور</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-narges-light">
              <Lock size={16} className="text-narges-text-secondary" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent text-sm focus:outline-none"
                dir="ltr"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <Loader2 size={18} className="animate-spin" />}
            تسجيل الدخول
          </button>
        </form>

        <p className="text-center text-sm text-narges-text-secondary mt-4">
          ليس لديك حساب؟{' '}
          <Link to="/signup" className="text-narges-light font-medium">أنشئ حساباً</Link>
        </p>
        <button onClick={() => navigate('/Customer')} className="w-full text-center text-xs text-narges-text-secondary mt-3">
          المتابعة كزائر
        </button>
      </div>
    </div>
  );
}
