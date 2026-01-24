import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">
            Trillium Surveyor
            <span className="ml-3 text-lg font-normal text-gray-500">Table Spike</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Exploring TanStack Table + Virtual for high-performance data grids
            with filtering, sorting, and virtualization.
          </p>
        </div>

        {/* Main CTA */}
        <div className="mb-12 flex justify-center">
          <Link
            to="/spike/table"
            className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            View Table Demo
          </Link>
        </div>

        {/* Tech Stack */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Built with TanStack Start • TanStack Table • TanStack Virtual • shadcn/ui
          </p>
        </div>
      </div>
    </div>
  )
}
