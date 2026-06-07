import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import CartItemRow from '../../components/CartItemRow.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import SectionTitle from '../../components/ui/SectionTitle.jsx'
import { useCartStore } from '../../features/cart/cart.store.js'
import { useMenuStore } from '../../features/menu/menu.store.js'
import { getCartLines, getSubtotal } from '../../features/cart/cart.utils.js'

function formatPriceINR(value) {
  const amount = Number(value || 0)
  return `₹${amount}`
}

export default function CartPage() {
  const itemsById = useCartStore((s) => s.itemsById)
  const addItem = useCartStore((s) => s.addItem)
  const setQty = useCartStore((s) => s.setQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const menuItems = useMenuStore((s) => s.menuItems)
  const fetchMenuItems = useMenuStore((s) => s.fetchMenuItems)

  console.log("CART ITEMS:", itemsById)
  console.log("MENU ITEMS:", menuItems)

  const lines = useMemo(() => {
    return getCartLines({ itemsById, menuItems })
  }, [itemsById, menuItems])

  const subtotal = useMemo(() => {
    return getSubtotal({ itemsById, menuItems })
  }, [itemsById, menuItems])

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
            <h1 className="truncate text-base font-semibold">Your cart</h1>
          </div>
          <Link
            to="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            Back
          </Link>
        </div>
      </header>

      <main className="px-4 py-4">
        <SectionTitle
          title="Items"
          subtitle={lines.length ? `${lines.length} item types` : 'No items yet'}
          right={
            lines.length ? (
              <button
                type="button"
                onClick={clearCart}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
              >
                Clear
              </button>
            ) : null
          }
        />

        <div className="mt-3 space-y-3">
          {lines.length ? (
            lines.map((line) => (
              <Card key={line.itemId} className="p-4">
                <CartItemRow
                  line={line}
                  onMinus={() => setQty(line.itemId, line.qty - 1)}
                  onPlus={() => addItem(line.itemId)}
                  onRemove={() => removeItem(line.itemId)}
                />
              </Card>
            ))
          ) : (
            <EmptyState
              title="Your cart is empty"
              description="Add some items from the menu to get started."
              action={
                <Link to="/">
                  <Button variant="primary">Browse menu</Button>
                </Link>
              }
            />
          )}
        </div>

        <div className="mt-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">Subtotal</p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {formatPriceINR(subtotal)}
              </p>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Taxes/fees will be added at checkout later in the MVP.
            </p>
          </Card>
        </div>

        <div className="mt-4">
          {lines.length ? (
            <Link to="/checkout">
              <Button fullWidth>Checkout</Button>
            </Link>
          ) : (
            <Button fullWidth disabled>
              Checkout
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
console.log("MENU STORE LOADED")


