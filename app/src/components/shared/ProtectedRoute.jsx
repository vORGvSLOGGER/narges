import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { isSupabaseConfigured } from '../../lib/supabase';

// يحمي مساراً حسب الدور.
// roles: مصفوفة أدوار مسموح بها (مثل ['admin','cashier']). إن لم تُمرّر، يكفي تسجيل الدخول.
// ملاحظة: لو Supabase غير مهيأ، نسمح بالمرور (وضع تطوير) حتى لا تتعطل اللوحات.
export default function ProtectedRoute({ roles, children }) {
  const location = useLocation();
  const { session, profile, authLoading } = useAuthStore();

  if (!isSupabaseConfigured) return children;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-narges-text-secondary">
        <span className="animate-pulse">جاري التحقق...</span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(profile?.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-6">
        <span className="text-5xl">🔒</span>
        <p className="font-bold text-narges-text">لا تملك صلاحية الوصول لهذه اللوحة</p>
        <p className="text-sm text-narges-text-secondary">دورك الحالي: {profile?.role || 'غير محدد'}</p>
        <Navigate to="/Customer" replace />
      </div>
    );
  }

  return children;
}
