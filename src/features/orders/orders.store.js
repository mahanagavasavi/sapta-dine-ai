import { create } from 'zustand'
import { isValidStatus } from './orders.mock.js'

function createOrderId() {
  return `ord_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export const useOrdersStore = create((set, get) => ({
  ordersById: {},
  activeOrderId: null,

  placeOrder: ({ restaurantId = 'demo', tableId = 'T1', items = [] }) => {
    const orderId = createOrderId()
    const now = new Date().toISOString()

    const order = {
      id: orderId,
      restaurantId,
      tableId,
      items,
      status: 'placed',
      createdAt: now,
      updatedAt: now,
    }

    set((state) => ({
      ordersById: { ...state.ordersById, [orderId]: order },
      activeOrderId: orderId,
    }))

    return orderId
  },

  setOrderStatus: (orderId, status) => {
    if (!orderId || !isValidStatus(status)) return

    set((state) => {
      const existing = state.ordersById[orderId]
      if (!existing) return state

      const next = {
        ...existing,
        status,
        updatedAt: new Date().toISOString(),
      }

      return { ordersById: { ...state.ordersById, [orderId]: next } }
    })
  },

  getOrderById: (orderId) => {
    const { ordersById } = get()
    return ordersById[orderId] || null
  },
}))

