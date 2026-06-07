import { create } from 'zustand'
import { getMenuItems } from '../../services/menuService'

export const useMenuStore = create((set) => ({
  menuItems: [],
  loading: false,
  error: null,

  fetchMenuItems: async () => {
    try {
      const data = await getMenuItems()

      set({
        menuItems: data || [],
        loading: false,
      })
    } catch (error) {
      console.error(error)

      set({
        error: error.message,
        loading: false,
      })
    }
  },
}))