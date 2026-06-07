import { Outlet } from 'react-router-dom'

export default function AppShell() {
  return (
    <div className="min-h-dvh bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto min-h-dvh w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}

