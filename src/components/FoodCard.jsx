import Badge from './ui/Badge.jsx'
import Button from './ui/Button.jsx'
import Card from './ui/Card.jsx'

function formatPriceINR(value) {
  const amount = Number(value || 0)
  return `₹${amount}`
}

export default function FoodCard({ item, onAdd }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {item.name}
            </h3>
            {item.isVeg ? <Badge variant="success">Veg</Badge> : null}
            {item.spiceLevel >= 3 ? <Badge variant="warning">Spicy</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {item.description}
          </p>
          <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {formatPriceINR(item.price)}
          </p>
        </div>

        <div className="shrink-0">
          <Button size="sm" variant="secondary" onClick={() => onAdd?.(item)}>
            Add
          </Button>
        </div>
      </div>
    </Card>
  )
}

