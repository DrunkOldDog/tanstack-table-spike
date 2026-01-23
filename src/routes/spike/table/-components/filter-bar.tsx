import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterBarProps {
  // Symbol filter
  selectedSymbol: string
  onSymbolChange: (value: string) => void
  symbols: string[]
  // Volume filter
  volumeThreshold: string
  onVolumeChange: (value: string) => void
  // Date filter
  dateFrom: string
  onDateFromChange: (value: string) => void
  dateTo: string
  onDateToChange: (value: string) => void
  // Clear
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function FilterBar({
  selectedSymbol,
  onSymbolChange,
  symbols,
  volumeThreshold,
  onVolumeChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  hasActiveFilters,
  onClearFilters,
}: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
      {/* Symbol Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Symbol</label>
        <Select value={selectedSymbol} onValueChange={onSymbolChange}>
          <SelectTrigger className="w-[140px] border-gray-600 bg-gray-800 text-gray-200">
            <SelectValue placeholder="All Symbols" />
          </SelectTrigger>
          <SelectContent className="border-gray-600 bg-gray-800">
            <SelectItem value="all" className="text-gray-200">
              All Symbols
            </SelectItem>
            {symbols.map(symbol => (
              <SelectItem key={symbol} value={symbol} className="text-gray-200">
                {symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Volume Threshold Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Min Volume</label>
        <Select value={volumeThreshold} onValueChange={onVolumeChange}>
          <SelectTrigger className="w-[140px] border-gray-600 bg-gray-800 text-gray-200">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="border-gray-600 bg-gray-800">
            <SelectItem value="all" className="text-gray-200">
              All
            </SelectItem>
            <SelectItem value="1000000" className="text-gray-200">
              &gt; 1M
            </SelectItem>
            <SelectItem value="10000000" className="text-gray-200">
              &gt; 10M
            </SelectItem>
            <SelectItem value="50000000" className="text-gray-200">
              &gt; 50M
            </SelectItem>
            <SelectItem value="100000000" className="text-gray-200">
              &gt; 100M
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Date From</label>
        <input
          type="date"
          value={dateFrom}
          onChange={e => onDateFromChange(e.target.value)}
          className="rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Date To</label>
        <input
          type="date"
          value={dateTo}
          onChange={e => onDateToChange(e.target.value)}
          className="rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
