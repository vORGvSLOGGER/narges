import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// لو المتغيرات غير مضبوطة، يبقى supabase = null وتعمل طبقة الـ API على البيانات الوهمية (fallback).
export const isSupabaseConfigured = Boolean(url && anonKey);

// مهلة زمنية لكل طلب: لو المشروع نائم/بطيء لا تتعلّق الواجهة للأبد.
// عند التجاوز أو فشل الشبكة نُرجع Response 5xx اصطناعياً (لا نرفض أبداً)،
// فيعامله supabase-js كخطأ → تعمل آلية fallback للبيانات المحلية فوراً.
const REQUEST_TIMEOUT_MS = 8000;

function fetchWithTimeout(input, init = {}) {
  return new Promise((resolve) => {
    const controller = new AbortController();
    let settled = false;
    const finish = (res) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(res);
    };
    const timer = setTimeout(() => {
      controller.abort();
      finish(new Response(JSON.stringify({ message: 'request timeout', code: 'timeout' }), {
        status: 504,
        headers: { 'Content-Type': 'application/json' },
      }));
    }, REQUEST_TIMEOUT_MS);

    fetch(input, { ...init, signal: controller.signal })
      .then((res) => finish(res))
      .catch((err) => finish(new Response(JSON.stringify({ message: String(err && err.message || err), code: 'network' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })));
  });
}

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: { fetch: fetchWithTimeout },
    })
  : null;
