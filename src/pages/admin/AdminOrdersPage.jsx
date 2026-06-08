import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Input from '../../components/ui/Input.jsx'
import SectionTitle from '../../components/ui/SectionTitle.jsx'
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from '../../features/orders/orders.mock.js'
import {
  getOrders,
  updateOrderStatus,
} from '../../services/orderService.js'
import { supabase } from '../../services/supabaseClient'

function getStatusVariant(status) {
  if (status === 'served') return 'success'
  if (status === 'ready') return 'success'
  if (status === 'preparing') return 'warning'
  if (status === 'accepted') return 'neutral'
  if (status === 'placed') return 'neutral'
  return 'neutral'
}

export default function AdminOrdersPage() {
  const [query, setQuery] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders()
        setOrders(data || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
  
    loadOrders()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        async () => {
          const data = await getOrders()
          setOrders(data || [])
        },
      )
      .subscribe()
  
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredOrders = useMemo(() => {
    const q = String(query || '').toLowerCase().trim()
  
    if (!q) return orders
  
    return orders.filter((o) => {
      const text =
        `${o.id} ${o.table_number} ${o.status}`.toLowerCase()
  
      return text.includes(q)
    })
  }, [orders, query])

  if (loading) {
    return (
      <div className="p-4">
        Loading orders...
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
            <h1 className="truncate text-base font-semibold">Admin · Orders</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/menu"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
            >
              Menu
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
          title="Orders"
          subtitle="No auth in MVP · demo dashboard"
        />

        <div className="mt-3">
          <Input
            id="admin-order-search"
            placeholder="Search by order id, table, or status…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mt-4 space-y-3">
          {filteredOrders.length ? (
            filteredOrders.map((o) => (
              <Card key={o.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        #{o.id}
                      </p>
                      <Badge variant={getStatusVariant(o.status)}>
                        {ORDER_STATUS_LABELS[o.status] || o.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                      Table {o.table_number} · Order Total ₹{o.total_price}
                    </p>
                                          <div className="mt-2 space-y-1">
                        {o.order_items?.map((item, index) => (
                          <p
                            key={index}
                            className="text-xs text-zinc-500 dark:text-zinc-400"
                          >
                            • {item.menu_items?.name} × {item.quantity}
                          </p>
                        ))}
                      </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(o.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Link
                    to={`/order/${o.id}`}
                    className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                  >
                    View
                  </Link>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {ORDER_STATUSES.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={o.status === status ? 'primary' : 'secondary'}
                      onClick={async () => {
                        await updateOrderStatus(o.id, status)
                      
                        const data = await getOrders()
                        setOrders(data)
                      }}
                    >
                      {ORDER_STATUS_LABELS[status] || status}
                    </Button>
                  ))}
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              title="No orders yet"
              description="Place an order from the customer flow, then it will show up here."
              action={
                <Link to="/">
                  <Button>Go to customer menu</Button>
                </Link>
              }
            />
          )}
        </div>
      </main>
    </div>
  )
}

