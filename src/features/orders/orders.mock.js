export const ORDER_STATUSES = ['placed', 'accepted', 'preparing', 'ready', 'served']

export const ORDER_STATUS_LABELS = {
  placed: 'Placed',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
}

export function isValidStatus(status) {
  return ORDER_STATUSES.includes(status)
}

