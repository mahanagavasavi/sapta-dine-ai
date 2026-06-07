export default function Input({
  label,
  helperText,
  error,
  className,
  inputClassName,
  id,
  ...props
}) {
  const helper = error || helperText

  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
        >
          {label}
        </label>
      ) : null}

      <input
        id={id}
        className={[
          'h-11 w-full rounded-xl border bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition',
          'border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30',
          'disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500',
          'dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500',
          'dark:focus:border-zinc-600 dark:focus:ring-zinc-500/30 dark:disabled:bg-zinc-900/30',
          error ? 'border-red-300 focus:border-red-400 focus:ring-red-300/30' : '',
          inputClassName || '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />

      {helper ? (
        <p
          className={[
            'mt-1.5 text-xs',
            error ? 'text-red-600 dark:text-red-400' : 'text-zinc-500 dark:text-zinc-400',
          ].join(' ')}
        >
          {helper}
        </p>
      ) : null}
    </div>
  )
}

