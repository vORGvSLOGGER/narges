import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { isSupabaseConfigured } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((s) => s.signIn);
  const resendConfirmation = useAuthStore((s) => s.resendConfirmation);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
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
      const { profile } = await signIn({ email, password });
      toast.success('أهلاً بعودتك! 🌷');
      const role = profile?.role;
      const dest = role === 'admin' ? '/Admin' : role === 'cashier' ? '/Cashier' : role === 'delivery' ? '/Delivery' : from;
      navigate(dest, { replace: true });
    } catch (err) {
      if (err.message === 'Invalid login credentials') {
        toast.error('بيانات الدخول غير صحيحة');
      } else if (err.message === 'Email not confirmed') {
        toast.error('فعّل بريدك أولاً — أعدنا إرسال رابط التفعيل');
        resendConfirmation(email).catch(() => {});
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-narges-bg flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* زخارف خلفية */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-narges-green/15 blur-3xl" />
      <div className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-narges-orange/10 blur-3xl" />

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-7 anim-fade-up">
          <div className="anim-float w-18 h-18 w-[72px] h-[72px] rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-narges-green"
            style={{ background: 'linear-gradient(135deg,#1B5E20,#2E7D32 55%,#66BB6A)' }}>
            🌷
          </div>
          <h1 className="text-2xl font-bold text-narges-text">أهلاً بعودتك</h1>
          <p className="text-narges-text-secondary text-sm mt-1">سجّل دخولك إلى نرجس سوبرماركت</p>
        </div>

        <form onSubmit={handleSubmit} className="anim-fade-up anim-d1 card p-5 space-y-4 rounded-3xl">
          <AuthField icon={Mail} label="البريد الإلكتروني" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" dir="ltr" required />

          <div>
            <label className="text-xs text-narges-text-secondary mb-1 block">كلمة المرور</label>
            <div className="flex items-center gap-2 border border-narges-border rounded-xl px-3 py-3 bg-narges-bg/50 focus-within:border-narges-green focus-within:ring-2 focus-within:ring-narges-green/15 transition-all">
              <Lock size={16} className="text-narges-text-secondary flex-shrink-0" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 min-w-0 w-full bg-transparent text-sm focus:outline-none"
                dir="ltr"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="flex-shrink-0 text-narges-muted">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            تسجيل الدخول
          </button>
        </form>

        <p className="anim-fade-up anim-d2 text-center text-sm text-narges-text-secondary mt-5">
          ليس لديك حساب؟{' '}
          <Link to="/signup" className="text-narges-green font-bold">أنشئ حساباً</Link>
        </p>
        <button onClick={() => navigate('/Customer')} className="anim-fade-up anim-d3 w-full text-center text-xs text-narges-text-secondary mt-3 underline underline-offset-4">
          المتابعة كزائر
        </button>
      </div>
    </div>
  );
}

export function AuthField({ icon: Icon, label, type = 'text', value, onChange, placeholder, dir, required }) {
  return (
    <div>
      <label className="text-xs text-narges-text-secondary mb-1 block">{label}</label>
      <div className="flex items-center gap-2 border border-narges-border rounded-xl px-3 py-3 bg-narges-bg/50 focus-within:border-narges-green focus-within:ring-2 focus-within:ring-narges-green/15 transition-all">
        <Icon size={16} className="text-narges-text-secondary flex-shrink-0" />
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          dir={dir}
          className="flex-1 min-w-0 w-full bg-transparent text-sm focus:outline-none placeholder:text-narges-muted"
        />
      </div>
    </div>
  );
}
