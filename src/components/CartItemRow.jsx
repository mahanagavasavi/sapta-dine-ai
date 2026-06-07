import Badge from './ui/Badge.jsx'
import Button from './ui/Button.jsx'

function formatPriceINR(value) {
  const amount = Number(value || 0)
  return `₹${amount}`
}

export default function CartItemRow({ line, onMinus, onPlus, onRemove }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {line.name}
          </p>
          {line.isVeg ? <Badge variant="success">Veg</Badge> : null}
        </div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {formatPriceINR(line.price)} × {line.qty} ={' '}
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            {formatPriceINR(line.lineTotal)}
          </span>
        </p>

        <div className="mt-2 flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={onMinus}>
            −
          </Button>
          <span className="w-8 text-center text-sm font-semibold">{line.qty}</span>
          <Button size="sm" variant="secondary" onClick={onPlus}>
            +
          </Button>
          <button
            type="button"
            onClick={onRemove}
            className="ml-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

