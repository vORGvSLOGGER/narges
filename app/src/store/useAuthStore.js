import { create } from 'zustand';

export const PANELS = {
  CUSTOMER: 'customer',
  DRIVER: 'driver',
  CASHIER: 'cashier',
  ADMIN: 'admin',
};

export const useAuthStore = create((set) => ({
  activePanel: PANELS.CUSTOMER,
  setPanel: (panel) => set({ activePanel: panel }),

  driverOnline: false,
  setDriverOnline: (val) => set({ driverOnline: val }),
}));
