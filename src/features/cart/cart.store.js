import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  itemsById: {},

  addItem: (itemId) => {
    if (!itemId) return

    set((state) => {
      const currentQty = state.itemsById[itemId] || 0
      return { itemsById: { ...state.itemsById, [itemId]: currentQty + 1 } }
    })
  },

  removeItem: (itemId) => {
    if (!itemId) return

    set((state) => {
      const next = { ...state.itemsById }
      delete next[itemId]
      return { itemsById: next }
    })
  },

  setQty: (itemId, qty) => {
    if (!itemId) return

    const nextQty = Math.max(0, Number(qty || 0))

    set((state) => {
      if (nextQty <= 0) {
        const next = { ...state.itemsById }
        delete next[itemId]
        return { itemsById: next }
      }

      return { itemsById: { ...state.itemsById, [itemId]: nextQty } }
    })
  },

  clearCart: () => set({ itemsById: {} }),

  getQty: (itemId) => {
    const { itemsById } = get()
    return itemsById[itemId] || 0
  },

  getTotalItems: () => {
    const { itemsById } = get()
    return Object.values(itemsById).reduce((sum, qty) => sum + qty, 0)
  },
}))

