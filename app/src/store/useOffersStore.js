import { create } from 'zustand';
import { mockOffers } from '../data/mockOffers';

export const useOffersStore = create((set, get) => ({
  offers: [...mockOffers],
  updateOfferStatus: (id, status) =>
    set({ offers: get().offers.map(o => o.id === id ? { ...o, status } : o) }),
  getApprovedOffers: () => get().offers.filter(o => o.status === 'approved'),
  getPendingOffers: () => get().offers.filter(o => o.status === 'pending'),
}));
