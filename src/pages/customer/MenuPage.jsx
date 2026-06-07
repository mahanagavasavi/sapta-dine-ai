import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CategoryChips from '../../components/CategoryChips.jsx'
import FoodCard from '../../components/FoodCard.jsx'
import BottomBar from '../../components/ui/BottomBar.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { useCartStore } from '../../features/cart/cart.store.js'
import { getMenuItems } from '../../services/menuService.js'
import { filterMenuItems } from '../../features/menu/menu.selectors.js'


export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategoryId, setActiveCategoryId] = useState('all')
  const [query, setQuery] = useState('')
  const addItem = useCartStore((s) => s.addItem)
  const totalItems = useCartStore((s) => s.getTotalItems())

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(menuItems.map((item) => item.category)),
    ]
  
    return [
      { id: 'all', name: 'All' },
      ...uniqueCategories.map((category) => ({
        id: category,
        name: category,
      })),
    ]
  }, [menuItems])
  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true)
  
        const data = await getMenuItems()

        console.log("MENU ITEMS STATE:", menuItems)
        setMenuItems(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load menu')
      } finally {
        setLoading(false)
      }
    }
  
    loadMenu()
  }, [])

  const visibleItems = useMemo(() => {
    return filterMenuItems({
      items: menuItems,
      categoryId: activeCategoryId,
      query,
    })
  }, [menuItems,activeCategoryId, query])

  if (loading) {
    return (
      <div className="p-4">
        Loading menu...
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    )
  }
       

  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Sapta Dine AI
            </p>
            <h1 className="truncate text-base font-semibold">Menu</h1>
          </div>
          <Link
            to="/cart"
            className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 active:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Cart {totalItems ? `(${totalItems})` : ''}
          </Link>
        </div>
      </header>
     

      <main className="px-4 py-4">
        <CategoryChips
          categories={categories}
          activeId={activeCategoryId}
          onChange={setActiveCategoryId}
        />

        <div className="mt-3">
          <Input
            id="menu-search"
            placeholder="Search burgers, fries, drinks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mt-4 space-y-3 pb-4">
          {visibleItems.length ? (
            visibleItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onAdd={() => {
                  addItem(item.id)
                }}
              />
            ))
          ) : (
            <EmptyState
              title="No items found"
              description="Try a different search or category."
            />
          )}
        </div>
      </main>

      {totalItems ? (
        <BottomBar>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {totalItems} item{totalItems === 1 ? '' : 's'} in cart
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Review your cart and place the order
              </p>
            </div>
            <Link to="/cart">
              <Button size="md">View cart</Button>
            </Link>
          </div>
        </BottomBar>
      ) : null}
    </div>
  )
}

