import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// الإعدادات الافتراضية — تعمل بدون قاعدة، وتُدمج فوقها قيم الأدمن من جدول settings
export const DEFAULT_SETTINGS = {
  site: { storeName: 'نرجس سوبرماركت', phone: '0112345678', city: 'الرياض', district: 'حي الروضة' },
  delivery: { fee: 10, freeAt: 75, minOrder: 20, etaMinutes: 40 },
  loyalty: { earnPerSar: 1, redeemPer100: 5, minEarnOrder: 30 },
  theme: { primary: '#2E7D32', accent: '#FF7A00', defaultMode: 'dark' },
};

// '#2E7D32' → '46 125 50' (صيغة متغيرات CSS)
function hexToRgbTriple(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

// تفتيح لون للوضع الداكن (تباين أفضل)
function lighten(hex, amt = 0.18) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const f = (c) => Math.min(255, Math.round(c + (255 - c) * amt));
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// حقن ألوان الأدمن كمتغيرات CSS (تغلب توكنات index.css في الوضعين)
export function applyThemeSettings(theme) {
  if (typeof document === 'undefined' || !theme) return;
  const p = hexToRgbTriple(theme.primary);
  const a = hexToRgbTriple(theme.accent);
  const pd = hexToRgbTriple(lighten(theme.primary));
  const ad = hexToRgbTriple(lighten(theme.accent, 0.12));
  let el = document.getElementById('narges-theme-overrides');
  if (!el) {
    el = document.createElement('style');
    el.id = 'narges-theme-overrides';
    document.head.appendChild(el);
  }
  el.textContent = `
:root{${p ? `--n-green:${p};` : ''}${a ? `--n-orange:${a};` : ''}}
html.dark{${pd ? `--n-green:${pd};` : ''}${ad ? `--n-orange:${ad};` : ''}}`;
  // الوضع الافتراضي من الإعدادات — فقط إن لم يختر المستخدم بنفسه
  try {
    if (!localStorage.getItem('narges-theme')) {
      document.documentElement.classList.toggle('dark', theme.defaultMode !== 'light');
    }
  } catch { /* تجاهل */ }
}

export const useSettingsStore = create((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loaded: false,
  saving: false,

  // تحميل من القاعدة عند الإقلاع + تطبيق الثيم
  load: async () => {
    if (!isSupabaseConfigured) {
      applyThemeSettings(DEFAULT_SETTINGS.theme);
      set({ loaded: true });
      return;
    }
    let data = null, error = null;
    try {
      ({ data, error } = await supabase.from('settings').select('key, value'));
    } catch (e) {
      error = e;
    }
    if (error) {
      console.warn('[settings] load:', error.message);
      applyThemeSettings(get().settings.theme);
      set({ loaded: true });
      return;
    }
    const merged = { ...DEFAULT_SETTINGS };
    for (const row of data || []) {
      merged[row.key] = { ...DEFAULT_SETTINGS[row.key], ...row.value };
    }
    applyThemeSettings(merged.theme);
    set({ settings: merged, loaded: true });
  },

  // حفظ قسم إعدادات (أدمن فقط عبر RLS)
  save: async (key, value) => {
    set({ saving: true });
    try {
      const merged = { ...get().settings, [key]: { ...get().settings[key], ...value } };
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('settings')
          .upsert({ key, value: merged[key], updated_at: new Date().toISOString() });
        if (error) throw error;
      }
      set({ settings: merged });
      if (key === 'theme') applyThemeSettings(merged.theme);
      return merged[key];
    } finally {
      set({ saving: false });
    }
  },
}));
