export function buildMenuIndex(menuItems) {
  const index = {}
  ;(menuItems || []).forEach((item) => {
    index[item.id] = item
  })
  return index
}

export function getCartLines({ itemsById, menuItems }) {
  const index = buildMenuIndex(menuItems)

  return Object.entries(itemsById || {})
    .map(([itemId, qty]) => {
      const item = index[itemId]
      if (!item) return null

      const safeQty = Math.max(0, Number(qty || 0))
      if (safeQty <= 0) return null

      const unitPrice = Number(item.price || 0)
      return {
        itemId,
        name: item.name,
        price: unitPrice,
        qty: safeQty,
        lineTotal: unitPrice * safeQty,
        isVeg: Boolean(item.isVeg),
      }
    })
    .filter(Boolean)
}

export function getSubtotal({ itemsById, menuItems }) {
  return getCartLines({ itemsById, menuItems }).reduce(
    (sum, line) => sum + line.lineTotal,
    0,
  )
}

