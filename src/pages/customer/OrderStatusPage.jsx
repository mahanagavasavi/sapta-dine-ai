import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import OrderStatusTimeline from '../../components/OrderStatusTimeline.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import SectionTitle from '../../components/ui/SectionTitle.jsx'
import { ORDER_STATUS_LABELS } from '../../features/orders/orders.mock.js'
import { supabase } from '../../services/supabaseClient.js'

export default function OrderStatusPage() {
  const { orderId } = useParams()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
  
    async function loadOrder() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()
    
        if (error) {
          console.error(error)
        } else {
          setOrder(data)
        }
      } finally {
        setLoading(false)
      }
    }
  
    loadOrder()
  
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log('STATUS UPDATE', payload)
          setOrder(payload.new)
        },
      )
      .subscribe()
  
    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId])

  const statusLabel = useMemo(() => {
    return ORDER_STATUS_LABELS[order?.status] || order?.status || ''
  }, [order])

  if (loading) {
    return (
      <div className="p-4">
        Loading order...
      </div>
    )
  }

  if (!order) {
    return (
      <div className="px-4 py-4">
        <EmptyState
          title="Order not found"
          description="Place an order first, then come back here."
          action={
            <Link to="/">
              <Button>Go to menu</Button>
            </Link>
          }
        />
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
            <h1 className="truncate text-base font-semibold">
              Order Status
            </h1>
          </div>

          <Link
            to="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Menu
          </Link>
        </div>
      </header>

      <main className="px-4 py-4">
        <SectionTitle
          title={`Order #${order.id}`}
          subtitle={statusLabel}
        />

        <div className="mt-3 space-y-3">
          <Card className="p-4">
            <OrderStatusTimeline status={order.status} />
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold">
              Table {order.table_number}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Total: ₹{order.total_price}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Created: {new Date(order.created_at).toLocaleString()}
            </p>
          </Card>
        </div>
      </main>
    </div>
  )
}