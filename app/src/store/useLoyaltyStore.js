import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const TIERS = [
  { id: 'bronze', label: 'برونزي', minPoints: 0, maxPoints: 499, color: '#CD7F32', discount: 0 },
  { id: 'silver', label: 'فضي', minPoints: 500, maxPoints: 999, color: '#9E9E9E', discount: 5 },
  { id: 'gold', label: 'ذهبي', minPoints: 1000, maxPoints: Infinity, color: '#FFD700', discount: 10 },
];

function getTier(points) {
  return TIERS.findLast(t => points >= t.minPoints) || TIERS[0];
}

export { TIERS };

export const useLoyaltyStore = create(
  persist(
    (set, get) => ({
      points: 120,
      history: [
        { id: 1, type: 'earn', points: 85, description: 'طلب #ORD-2025-001', date: new Date(Date.now() - 2 * 86400000).toISOString() },
        { id: 2, type: 'earn', points: 35, description: 'طلب #ORD-2025-002', date: new Date(Date.now() - 86400000).toISOString() },
      ],
      pendingDiscount: 0,

      get tier() { return getTier(get().points); },

      addPoints: (orderTotal) => {
        const earned = Math.floor(orderTotal);
        set(s => ({
          points: s.points + earned,
          history: [
            { id: Date.now(), type: 'earn', points: earned, description: `طلب بقيمة ${orderTotal.toFixed(0)} ر.س`, date: new Date().toISOString() },
            ...s.history,
          ],
        }));
      },

      redeemPoints: (pointsToRedeem) => {
        const discount = (pointsToRedeem / 100) * 5;
        set(s => ({
          points: s.points - pointsToRedeem,
          pendingDiscount: discount,
          history: [
            { id: Date.now(), type: 'redeem', points: -pointsToRedeem, description: `خصم ${discount} ر.س`, date: new Date().toISOString() },
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
