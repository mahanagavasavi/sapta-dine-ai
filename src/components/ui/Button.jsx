function getButtonClasses({ variant, size, fullWidth, className }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-zinc-500/60'

  const variants = {
    primary:
      'bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200',
    secondary:
      'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900',
    ghost:
      'text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:active:bg-zinc-800',
    danger:
      'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  }

  return [
    base,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    fullWidth ? 'w-full' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={getButtonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </button>
  )
}

