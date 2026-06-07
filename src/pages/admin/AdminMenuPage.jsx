import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Input from '../../components/ui/Input.jsx'
import SectionTitle from '../../components/ui/SectionTitle.jsx'
import { mockCategories, mockMenuItems } from '../../features/menu/menu.mock.js'

function formatPriceINR(value) {
  const amount = Number(value || 0)
  return `₹${amount}`
}

export default function AdminMenuPage() {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState(() =>
    (mockMenuItems || []).map((i) => ({ ...i })),
  )

  const categoryById = useMemo(() => {
    const map = {}
    ;(mockCategories || []).forEach((c) => {
      map[c.id] = c
    })
    return map
  }, [])

  const visible = useMemo(() => {
    const q = String(query || '').toLowerCase().trim()
    if (!q) return items

    return items.filter((i) => {
      const text = `${i.name} ${i.description} ${i.categoryId} ${(i.tags || []).join(' ')}`.toLowerCase()
      return text.includes(q)
    })
  }, [items, query])

  function toggleAvailable(itemId) {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, available: !i.available } : i)),
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
            <h1 className="truncate text-base font-semibold">Admin · Menu</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
            >
              Orders
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
            >
              Customer
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        <SectionTitle
          title="Menu items"
          subtitle="Mock-only · Supabase integration later"
        />

        <div className="mt-3">
          <Input
            id="admin-menu-search"
            placeholder="Search items, tags, category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mt-4 space-y-3">
          {visible.length ? (
            visible.map((i) => (
              <Card key={i.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {i.name}
                      </p>
                      {i.isVeg ? <Badge variant="success">Veg</Badge> : null}
                      <Badge variant={i.available ? 'neutral' : 'danger'}>
                        {i.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                      {i.description}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatPriceINR(i.price)}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Category: {categoryById[i.categoryId]?.name || i.categoryId}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Button
                      size="sm"
                      variant={i.available ? 'secondary' : 'primary'}
                      onClick={() => toggleAvailable(i.id)}
                    >
                      {i.available ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              title="No items found"
              description="Try a different search."
            />
          )}
        </div>
      </main>
    </div>
  )
}

