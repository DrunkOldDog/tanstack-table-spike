import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/spike/table/')({
  beforeLoad: () => {
    throw Route.redirect({
      to: './daily-etf',
    })
  },
})
