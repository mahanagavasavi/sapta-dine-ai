import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '../features/orders/orders.mock.js'

function getStepState({ currentStatus, stepStatus }) {
  const currentIndex = ORDER_STATUSES.indexOf(currentStatus)
  const stepIndex = ORDER_STATUSES.indexOf(stepStatus)

  if (stepIndex < 0) return 'upcoming'
  if (currentIndex < 0) return 'upcoming'

  if (stepIndex < currentIndex) return 'done'
  if (stepIndex === currentIndex) return 'active'
  return 'upcoming'
}

export default function OrderStatusTimeline({ status }) {
  return (
    <div className="space-y-3">
      {ORDER_STATUSES.map((step) => {
        const state = getStepState({ currentStatus: status, stepStatus: step })

        const dotClass =
          state === 'done'
            ? 'bg-emerald-500'
            : state === 'active'
              ? 'bg-zinc-900 dark:bg-zinc-50'
              : 'bg-zinc-200 dark:bg-zinc-800'

        const textClass =
          state === 'active'
            ? 'text-zinc-900 dark:text-zinc-50'
            : 'text-zinc-600 dark:text-zinc-300'

        return (
          <div key={step} className="flex items-center gap-3">
            <span className={['h-2.5 w-2.5 rounded-full', dotClass].join(' ')} />
            <p className={['text-sm font-medium', textClass].join(' ')}>
              {ORDER_STATUS_LABELS[step] || step}
            </p>
          </div>
        )
      })}
    </div>
  )
}

