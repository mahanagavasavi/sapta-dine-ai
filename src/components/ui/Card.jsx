export default function Card({ children, className }) {
  return (
    <div
      className={[
        'rounded-2xl border border-zinc-200 bg-white shadow-sm',
        'dark:border-zinc-800 dark:bg-zinc-950',
        className || '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

