import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// محفظة رصيد العميل: يشحن مبلغاً الآن ويستخدمه للدفع لاحقاً
export const useWalletStore = create(
  persist(
    (set, get) => ({
      balance: 0,
      history: [],

      topUp: (amount) => {
        const val = Math.round(Number(amount) * 100) / 100;
        if (!val || val <= 0) return false;
        set(s => ({
          balance: Math.round((s.balance + val) * 100) / 100,
          history: [
            { id: Date.now(), type: 'topup', amount: val, description: 'شحن رصيد', date: new Date().toISOString() },
            ...s.history,
          ],
        }));
        return true;
      },

      // خصم قيمة طلب من الرصيد — يرجع false إذا الرصيد لا يكفي
      pay: (amount, description = 'دفع طلب') => {
        const val = Math.round(Number(amount) * 100) / 100;
        if (!val || val <= 0 || get().balance < val) return false;
        set(s => ({
          balance: Math.round((s.balance - val) * 100) / 100,
          history: [
            { id: Date.now(), type: 'pay', amount: -val, description, date: new Date().toISOString() },
            ...s.history,
          ],
        }));
        return true;
      },
    }),
    { name: 'narges-wallet', storage: createJSONStorage(() => localStorage) }
  )
);
