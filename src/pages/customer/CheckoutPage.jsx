import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import SectionTitle from '../../components/ui/SectionTitle.jsx'
import { useCartStore } from '../../features/cart/cart.store.js'
import { getCartLines, getSubtotal } from '../../features/cart/cart.utils.js'
import { useMenuStore } from '../../features/menu/menu.store.js'
import { createOrder } from '../../services/orderService.js'

function formatPriceINR(value) {
  const amount = Number(value || 0)
  return `₹${amount}`
}

export default function CheckoutPage() {
  const navigate = useNavigate()

  const itemsById = useCartStore((s) => s.itemsById)
  const clearCart = useCartStore((s) => s.clearCart)

  const menuItems = useMenuStore((s) => s.menuItems)
  const fetchMenuItems = useMenuStore((s) => s.fetchMenuItems)

  const lines = useMemo(() => {
    return getCartLines({ itemsById, menuItems })
  }, [itemsById, menuItems])

  const subtotal = useMemo(() => {
    return getSubtotal({ itemsById, menuItems })
  }, [itemsById, menuItems])

  const canPlaceOrder = lines.length > 0

  async function handlePlaceOrder() {
    if (!canPlaceOrder) return

try {
  const items = lines.map((l) => ({
    itemId: l.itemId,
    qty: l.qty,
  }))

  const order = await createOrder({
    tableNumber: 1,
    totalPrice: subtotal,
    items,
  })
  console.log("ORDER CREATED:", order)
  clearCart()

  navigate(`/order/${order.id}`)
} catch (error) {
  console.error("ORDER ERROR FULL:", JSON.stringify(error, null, 2))

  alert('Failed to place order')
}
  }

  useEffect(() => {
    if (!menuItems.length) {
      fetchMenuItems()
    }
  }, [menuItems.length, fetchMenuItems])

  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Sapta Dine AI
            </p>
            <h1 className="truncate text-base font-semibold">Checkout</h1>
          </div>
          <Link
            to="/cart"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            Back
          </Link>
        </div>
      </header>

      <main className="px-4 py-4">
        {lines.length ? (
          <>
            <SectionTitle title="Order summary" subtitle={`${lines.length} item types`} />

            <div className="mt-3 space-y-3">
              <Card className="p-4">
                <div className="space-y-2">
                  {lines.map((l) => (
                    <div key={l.itemId} className="flex items-center justify-between">
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        {l.name} × {l.qty}
                      </p>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {formatPriceINR(l.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">Subtotal</p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatPriceINR(subtotal)}
                    </p>
                  </div>
                </div>
              </Card>

              <Button fullWidth onClick={handlePlaceOrder}>
                Place order
              </Button>

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                This is a mock checkout for the MVP (no payment/auth yet).
              </p>
            </div>
          </>
        ) : (
          <EmptyState
            title="Nothing to checkout"
            description="Add items to your cart first."
            action={
              <Link to="/">
                <Button>Browse menu</Button>
              </Link>
            }
          />
        )}
      </main>
    </div>
  )
}

