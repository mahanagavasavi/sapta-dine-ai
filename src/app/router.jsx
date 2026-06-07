import { createBrowserRouter } from 'react-router-dom'
import AppShell from './layout/AppShell.jsx'
import AdminMenuPage from '../pages/admin/AdminMenuPage.jsx'
import AdminOrdersPage from '../pages/admin/AdminOrdersPage.jsx'
import CartPage from '../pages/customer/CartPage.jsx'
import CheckoutPage from '../pages/customer/CheckoutPage.jsx'
import MenuPage from '../pages/customer/MenuPage.jsx'
import OrderStatusPage from '../pages/customer/OrderStatusPage.jsx'
import TestSupabase from '../pages/TestSupabase.jsx'
function NotFoundPage() {
  return (
    <div className="min-h-dvh bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <main className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-lg font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          The page you’re looking for doesn’t exist.
        </p>
      </main>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <MenuPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/order/:orderId', element: <OrderStatusPage /> },
      { path: '/admin', element: <AdminOrdersPage /> },
      { path: '/admin/menu', element: <AdminMenuPage /> },
      {
        path: "/test",
        element: <TestSupabase />,
      },
      { path: '*', element: <NotFoundPage /> },
      
    ],
  },
])

