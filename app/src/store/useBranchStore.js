import { create } from 'zustand';

export const useBranchStore = create((set, get) => ({
  branches: [
    { id: 1, nameAr: 'فرع الرياض الرئيسي', city: 'الرياض', lat: 24.7136, lng: 46.6753, phone: '0114561234', manager: 'محمد العمري' },
    { id: 2, nameAr: 'فرع جدة', city: 'جدة', lat: 21.3891, lng: 39.8579, phone: '0124789012', manager: 'عبدالله الشهري' },
    { id: 3, nameAr: 'فرع الدمام', city: 'الدمام', lat: 26.4207, lng: 50.0888, phone: '0138562345', manager: 'فيصل القحطاني' },
  ],
  activeBranchId: 1,
  setActiveBranch: (id) => set({ activeBranchId: id }),
  getActiveBranch: () => get().branches.find(b => b.id === get().activeBranchId),
}));
