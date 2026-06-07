export default function BottomBar({ children }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20">
      <div className="mx-auto w-full max-w-md px-4 pb-4">
        <div className="pointer-events-auto rounded-2xl border border-zinc-200 bg-white/90 p-2 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
          {children}
        </div>
      </div>
    </div>
  )
}

