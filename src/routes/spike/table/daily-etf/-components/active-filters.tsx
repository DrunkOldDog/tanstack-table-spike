interface ActiveFiltersProps {
  selectedSymbol: string
  onClearSymbol: () => void
  volumeThreshold: string
  onClearVolume: () => void
  dateFrom: string
  dateTo: string
  onClearDates: () => void
  globalFilter: string
  onClearGlobalFilter: () => void
  hasActiveFilters: boolean
}

export function ActiveFilters({
  selectedSymbol,
  onClearSymbol,
  volumeThreshold,
  onClearVolume,
  dateFrom,
  dateTo,
  onClearDates,
  globalFilter,
  onClearGlobalFilter,
  hasActiveFilters,
}: ActiveFiltersProps) {
  if (!hasActiveFilters) return null

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {selectedSymbol !== 'all' && (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400">
          Symbol: {selectedSymbol}
          <button onClick={onClearSymbol} className="ml-1 hover:text-blue-300">
            ×
          </button>
        </span>
      )}
      {volumeThreshold !== 'all' && (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
          Volume: &gt; {Number(volumeThreshold).toLocaleString()}
          <button onClick={onClearVolume} className="ml-1 hover:text-green-300">
            ×
          </button>
        </span>
      )}
      {(dateFrom || dateTo) && (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-400">
          Date: {dateFrom || '...'} → {dateTo || '...'}
          <button onClick={onClearDates} className="ml-1 hover:text-purple-300">
            ×
          </button>
        </span>
      )}
      {globalFilter && (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400">
          Search: "{globalFilter}"
          <button
            onClick={onClearGlobalFilter}
            className="ml-1 hover:text-yellow-300"
          >
            ×
          </button>
        </span>
      )}
    </div>
  )
}
