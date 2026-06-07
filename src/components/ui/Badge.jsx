function getBadgeClasses({ variant, className }) {
  const base =
    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-tight'

  const variants = {
    neutral:
      'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200',
    success:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
    warning:
      'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    danger:
      'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
  }

  return [base, variants[variant] || variants.neutral, className || '']
    .filter(Boolean)
    .join(' ')
}

export default function Badge({ children, variant = 'neutral', className }) {
  return (
    <span className={getBadgeClasses({ variant, className })}>{children}</span>
  )
}

