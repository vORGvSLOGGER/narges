import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useSettingsStore } from './useSettingsStore';

// المستويات = حالة/مكانة فقط. المكافأة الوحيدة خصم بالريال من النقاط (لا نسب، لا استبدال نقدي).
const TIERS = [
  { id: 'bronze', label: 'برونزي', minPoints: 0, maxPoints: 499, color: '#CD7F32' },
  { id: 'silver', label: 'فضي', minPoints: 500, maxPoints: 999, color: '#9E9E9E' },
  { id: 'gold', label: 'ذهبي', minPoints: 1000, maxPoints: Infinity, color: '#FFD700' },
];

export { TIERS };

export const useLoyaltyStore = create(
  persist(
    (set, get) => ({
      points: 0,
      history: [],
      pendingDiscount: 0,

      // يكسب نقاطاً فقط إذا تجاوز الطلب الحد الأدنى (يشجع الشراء الأكبر)
      addPoints: (orderTotal) => {
        const loyalty = useSettingsStore.getState().settings.loyalty;
        const minOrder = loyalty.minEarnOrder ?? 30;
        if (orderTotal < minOrder) return 0;
        const rate = loyalty.earnPerSar || 1;
        const earned = Math.floor(orderTotal * rate);
        set(s => ({
          points: s.points + earned,
          history: [
            { id: Date.now(), type: 'earn', points: earned, description: `طلب بقيمة ${orderTotal.toFixed(0)} ر.س`, date: new Date().toISOString() },
            ...s.history,
          ],
        }));
        return earned;
      },

      // قيمة الخصم الحالية بالريال (كل 100 نقطة = X ر.س من إعدادات الأدمن)
      discountValue: () => {
        const per100 = useSettingsStore.getState().settings.loyalty.redeemPer100 || 5;
        return Math.floor(get().points / 100) * per100;
      },

      // استخدام الخصم = تصفير النقاط بالكامل. خصم بالريال على الطلب القادم، لا يُستبدل نقداً.
      redeemAll: () => {
        const discount = get().discountValue();
        if (discount <= 0) return 0;
        set(s => ({
          points: 0,
          pendingDiscount: discount,
          history: [
            { id: Date.now(), type: 'redeem', points: -s.points, description: `خصم ${discount} ر.س — تصفير النقاط`, date: new Date().toISOString() },
            ...s.history,
          ],
        }));
        return discount;
      },

      clearPendingDiscount: () => set({ pendingDiscount: 0 }),
    }),
    { name: 'narges-loyalty', storage: createJSONStorage(() => localStorage) }
  )
);
