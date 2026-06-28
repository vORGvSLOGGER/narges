import { create } from 'zustand';
import { mockOrders, ORDER_STATUS } from '../data/mockOrders';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  fetchOrders,
  fetchOrderById as apiFetchOrderById,
  updateOrderStatus as apiUpdateStatus,
  assignDriver as apiAssignDriver,
} from '../lib/api';

export const useOrderStore = create((set, get) => ({
  // عند تفعيل Supabase نبدأ فارغين ثم نحمّل من القاعدة؛ وإلا نستخدم الوهمي.
  orders: isSupabaseConfigured ? [] : [...mockOrders],
  activeOrderId: null,
  loading: false,
  loaded: false,

  // تحميل الطلبات من Supabase (للموظفين). يبقى الوهمي عند عدم التهيئة.
  loadOrders: async (filter = {}) => {
    if (!isSupabaseConfigured) {
      set({ loaded: true });
      return get().orders;
    }
    set({ loading: true });
    const rows = await fetchOrders(filter);
    if (rows) set({ orders: rows, loading: false, loaded: true });
    else set({ loading: false, loaded: true });
    return get().orders;
  },

  // جلب طلب واحد (يُحدّث المتجر المحلي أيضاً)
  loadOrderById: async (id) => {
    if (!isSupabaseConfigured) return get().orders.find((o) => o.id === id);
    const order = await apiFetchOrderById(id);
    if (order) {
      set({ orders: [order, ...get().orders.filter((o) => o.id !== order.id)] });
    }
    return order;
  },

  // إضافة طلب للمتجر المحلي (يُستخدم بعد إنشاء الطلب في القاعدة أو في وضع المحاكاة)
  addOrder: (orderData) => {
    const newOrder = {
      id: orderData.id || `ORD-2025-${String(get().orders.length + 1).padStart(3, '0')}`,
      status: orderData.status || ORDER_STATUS.PENDING,
      createdAt: orderData.createdAt || new Date().toISOString(),
      estimatedDeliveryAt: orderData.estimatedDeliveryAt || new Date(Date.now() + 40 * 60000).toISOString(),
      deliveredAt: null,
      driverId: null,
      driverName: null,
      cashierId: null,
      deliveryFee: 10,
      discount: 0,
      ...orderData,
    };
    set({ orders: [newOrder, ...get().orders.filter((o) => o.id !== newOrder.id)], activeOrderId: newOrder.id });
    return newOrder;
  },

  // تحديث الحالة: تحديث متفائل محلياً + حفظ في القاعدة عند التهيئة
  updateOrderStatus: (orderId, status) => {
    set({
      orders: get().orders.map((o) =>
        o.id === orderId
          ? { ...o, status, ...(status === ORDER_STATUS.DELIVERED ? { deliveredAt: new Date().toISOString() } : {}) }
          : o
      ),
    });
    if (isSupabaseConfigured) {
      apiUpdateStatus(orderId, status).catch((e) => console.warn('[orders] updateStatus:', e.message));
    }
  },

  assignDriver: (orderId, driverId, driverName) => {
    set({
      orders: get().orders.map((o) => (o.id === orderId ? { ...o, driverId, driverName } : o)),
    });
    if (isSupabaseConfigured) {
      apiAssignDriver(orderId, driverId).catch((e) => console.warn('[orders] assignDriver:', e.message));
    }
  },

  getOrderById: (id) => get().orders.find((o) => o.id === id),
  getPendingOrders: () => get().orders.filter((o) => o.status === ORDER_STATUS.PENDING || o.status === ORDER_STATUS.CONFIRMED),
  getActiveOrders: () => get().orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)),
  getByStatus: (status) => get().orders.filter((o) => o.status === status),
}));
