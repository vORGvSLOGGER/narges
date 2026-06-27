import { create } from 'zustand';
import { mockOrders, ORDER_STATUS } from '../data/mockOrders';

export const useOrderStore = create((set, get) => ({
  orders: [...mockOrders],
  activeOrderId: null,

  addOrder: (orderData) => {
    const newOrder = {
      id: `ORD-2025-${String(get().orders.length + 1).padStart(3, '0')}`,
      status: ORDER_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      estimatedDeliveryAt: new Date(Date.now() + 40 * 60000).toISOString(),
      deliveredAt: null,
      driverId: null,
      driverName: null,
      cashierId: null,
      deliveryFee: 10,
      discount: 0,
      ...orderData,
    };
    set({ orders: [newOrder, ...get().orders], activeOrderId: newOrder.id });
    return newOrder;
  },

  updateOrderStatus: (orderId, status) => {
    set({
      orders: get().orders.map(o =>
        o.id === orderId
          ? { ...o, status, ...(status === ORDER_STATUS.DELIVERED ? { deliveredAt: new Date().toISOString() } : {}) }
          : o
      )
    });
  },

  assignDriver: (orderId, driverId, driverName) => {
    set({
      orders: get().orders.map(o =>
        o.id === orderId ? { ...o, driverId, driverName } : o
      )
    });
  },

  getOrderById: (id) => get().orders.find(o => o.id === id),
  getPendingOrders: () => get().orders.filter(o => o.status === ORDER_STATUS.PENDING || o.status === ORDER_STATUS.CONFIRMED),
  getActiveOrders: () => get().orders.filter(o => !['delivered', 'cancelled'].includes(o.status)),
  getByStatus: (status) => get().orders.filter(o => o.status === status),
}));
