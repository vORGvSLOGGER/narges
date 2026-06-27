import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const PANELS = {
  CUSTOMER: 'customer',
  DELIVERY: 'delivery',
  CASHIER: 'cashier',
  ADMIN: 'admin',
};

export const useAuthStore = create((set, get) => ({
  // ---- تبديل اللوحات (أداة تطوير، يبقى كما هو) ----
  activePanel: PANELS.CUSTOMER,
  setPanel: (panel) => set({ activePanel: panel }),
  driverOnline: false,
  setDriverOnline: (val) => set({ driverOnline: val }),

  // ---- مصادقة Supabase ----
  session: null,
  user: null,
  profile: null, // { id, full_name, phone, role }
  authLoading: true,

  // يُستدعى مرة عند إقلاع التطبيق
  initAuth: async () => {
    if (!isSupabaseConfigured) {
      set({ authLoading: false });
      return;
    }
    const { data } = await supabase.auth.getSession();
    await get()._applySession(data.session);

    supabase.auth.onAuthStateChange((_event, session) => {
      get()._applySession(session);
    });
  },

  // داخلي: يطبّق الجلسة ويجلب الملف الشخصي
  _applySession: async (session) => {
    if (!session) {
      set({ session: null, user: null, profile: null, authLoading: false });
      return;
    }
    set({ session, user: session.user });
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();
    set({ profile: profile || null, authLoading: false });
  },

  signUp: async ({ email, password, fullName, phone }) => {
    if (!isSupabaseConfigured) throw new Error('Supabase غير مهيأ');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    if (error) throw error;
    return data;
  },

  signIn: async ({ email, password }) => {
    if (!isSupabaseConfigured) throw new Error('Supabase غير مهيأ');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },
}));
