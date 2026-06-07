export default function CategoryChips({
  categories,
  activeId,
  onChange,
  className,
}) {
  return (
    <div
      className={[
        'flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]',
        '[&::-webkit-scrollbar]:hidden',
        className || '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {(categories || []).map((c) => {
        const isActive = c.id === activeId
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange?.(c.id)}
            className={[
              'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition',
              isActive
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900'
                : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900',
            ].join(' ')}
          >
            {c.name}
          </button>
        )
      })}
    </div>
  )
}

