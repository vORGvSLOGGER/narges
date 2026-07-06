import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Loader2, MailCheck, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { isSupabaseConfigured } from '../../lib/supabase';
import { AuthField } from './LoginPage';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const navigate = useNavigate();
  const signUp = useAuthStore((s) => s.signUp);
  const resendConfirmation = useAuthStore((s) => s.resendConfirmation);
  const [awaitingEmail, setAwaitingEmail] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPass, setShowPass] = useState(false);
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
        toast.success('تم إنشاء الحساب 🌷');
        navigate('/Customer', { replace: true });
      } else {
        setAwaitingEmail(true);
      }
    } catch (err) {
      toast.error(err.message === 'User already registered' ? 'هذا البريد مسجّل مسبقاً' : err.message);
    } finally {
      setLoading(false);
    }
  };

  if (awaitingEmail) {
    return (
      <div className="min-h-screen bg-narges-bg flex flex-col items-center justify-center px-5 anim-fade-up relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-narges-green/15 blur-3xl" />
        <div className="w-full max-w-sm text-center card p-8 rounded-3xl relative">
          <div className="anim-float w-16 h-16 bg-narges-green/10 text-narges-green rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MailCheck size={30} />
          </div>
          <h1 className="text-xl font-bold text-narges-text">تحقق من بريدك ✉️</h1>
          <p className="text-sm text-narges-text-secondary mt-2 leading-relaxed">
            أرسلنا رابط تفعيل من <b>نرجس سوبرماركت</b> إلى
            <span dir="ltr" className="block font-bold text-narges-text mt-1 break-all">{form.email}</span>
            افتح الرسالة واضغط رابط التفعيل، ثم عُد وسجّل الدخول.
          </p>
          <button onClick={() => navigate('/login', { replace: true })} className="w-full btn-primary mt-6">
            الذهاب لتسجيل الدخول
          </button>
          <button
            disabled={resending}
            onClick={async () => {
              setResending(true);
              try { await resendConfirmation(form.email); toast.success('أُعيد إرسال رابط التفعيل'); }
              catch (err) { toast.error(err.message); }
              finally { setResending(false); }
            }}
            className="w-full text-xs text-narges-text-secondary mt-3 disabled:opacity-50"
          >
            {resending ? 'جارٍ الإرسال...' : 'لم تصلك الرسالة؟ أعد الإرسال'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-narges-bg flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-narges-green/15 blur-3xl" />
      <div className="absolute -bottom-28 -right-20 w-80 h-80 rounded-full bg-narges-orange/10 blur-3xl" />

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-6 anim-fade-up">
          <div className="anim-float w-[72px] h-[72px] rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-narges-green"
            style={{ background: 'linear-gradient(135deg,#1B5E20,#2E7D32 55%,#66BB6A)' }}>
            🌷
          </div>
          <h1 className="text-2xl font-bold text-narges-text">إنشاء حساب</h1>
          <p className="text-narges-text-secondary text-sm mt-1">انضم إلى نرجس سوبرماركت واكسب نقاطاً مع كل طلب</p>
        </div>

        <form onSubmit={handleSubmit} className="anim-fade-up anim-d1 card p-5 space-y-4 rounded-3xl">
          <AuthField icon={User} label="الاسم الكامل" value={form.fullName} onChange={set('fullName')} placeholder="فلان الفلاني" required />
          <AuthField icon={Phone} label="رقم الجوال" type="tel" value={form.phone} onChange={set('phone')} placeholder="05xxxxxxxx" dir="ltr" />
          <AuthField icon={Mail} label="البريد الإلكتروني" type="email" value={form.email} onChange={set('email')} placeholder="example@email.com" dir="ltr" required />

          <div>
            <label className="text-xs text-narges-text-secondary mb-1 block">كلمة المرور</label>
            <div className="flex items-center gap-2 border border-narges-border rounded-xl px-3 py-3 bg-narges-bg/50 focus-within:border-narges-green focus-within:ring-2 focus-within:ring-narges-green/15 transition-all">
              <Lock size={16} className="text-narges-text-secondary flex-shrink-0" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={form.password}
                onChange={set('password')}
                placeholder="6 أحرف على الأقل"
                dir="ltr"
                className="flex-1 min-w-0 w-full bg-transparent text-sm focus:outline-none placeholder:text-narges-muted"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="flex-shrink-0 text-narges-muted">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            إنشاء الحساب
          </button>
        </form>

        <p className="anim-fade-up anim-d2 text-center text-sm text-narges-text-secondary mt-5">
          لديك حساب؟{' '}
          <Link to="/login" className="text-narges-green font-bold">سجّل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
