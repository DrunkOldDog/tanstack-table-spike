import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterBarProps {
  // Bedrooms filter
  bedrooms: string
  onBedroomsChange: (value: string) => void
  bedroomsOptions: number[]
  // Bathrooms filter
  bathrooms: string
  onBathroomsChange: (value: string) => void
  bathroomsOptions: number[]
  // Furnishing status filter
  furnishingstatus: string
  onFurnishingStatusChange: (value: string) => void
  furnishingStatusOptions: string[]
  // Price range filter
  priceMin: string
  onPriceMinChange: (value: string) => void
  priceMax: string
  onPriceMaxChange: (value: string) => void
  // Area range filter
  areaMin: string
  onAreaMinChange: (value: string) => void
  areaMax: string
  onAreaMaxChange: (value: string) => void
  // Clear
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function FilterBar({
  bedrooms,
  onBedroomsChange,
  bedroomsOptions,
  bathrooms,
  onBathroomsChange,
  bathroomsOptions,
  furnishingstatus,
  onFurnishingStatusChange,
  furnishingStatusOptions,
  priceMin,
  onPriceMinChange,
  priceMax,
  onPriceMaxChange,
  areaMin,
  onAreaMinChange,
  areaMax,
  onAreaMaxChange,
  hasActiveFilters,
  onClearFilters,
}: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
      {/* Bedrooms Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Bedrooms</label>
        <Select value={bedrooms} onValueChange={onBedroomsChange}>
          <SelectTrigger className="w-[140px] border-gray-600 bg-gray-800 text-gray-200">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="border-gray-600 bg-gray-800">
            <SelectItem value="all" className="text-gray-200">
              All
            </SelectItem>
            {bedroomsOptions.map(option => (
              <SelectItem key={option} value={String(option)} className="text-gray-200">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bathrooms Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Bathrooms</label>
        <Select value={bathrooms} onValueChange={onBathroomsChange}>
          <SelectTrigger className="w-[140px] border-gray-600 bg-gray-800 text-gray-200">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="border-gray-600 bg-gray-800">
            <SelectItem value="all" className="text-gray-200">
              All
            </SelectItem>
            {bathroomsOptions.map(option => (
              <SelectItem key={option} value={String(option)} className="text-gray-200">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Furnishing Status Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Furnishing</label>
        <Select value={furnishingstatus} onValueChange={onFurnishingStatusChange}>
          <SelectTrigger className="w-[160px] border-gray-600 bg-gray-800 text-gray-200">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="border-gray-600 bg-gray-800">
            <SelectItem value="all" className="text-gray-200">
              All
            </SelectItem>
            {furnishingStatusOptions.map(option => (
              <SelectItem key={option} value={option} className="text-gray-200 capitalize">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Price Min (₹)</label>
        <input
          type="number"
          value={priceMin}
          onChange={e => onPriceMinChange(e.target.value)}
          placeholder="Min"
          className="w-[140px] rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Price Max (₹)</label>
        <input
          type="number"
          value={priceMax}
          onChange={e => onPriceMaxChange(e.target.value)}
          placeholder="Max"
          className="w-[140px] rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Area Range Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Area Min (sqft)</label>
        <input
          type="number"
          value={areaMin}
          onChange={e => onAreaMinChange(e.target.value)}
          placeholder="Min"
          className="w-[140px] rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Area Max (sqft)</label>
        <input
          type="number"
          value={areaMax}
          onChange={e => onAreaMaxChange(e.target.value)}
          placeholder="Max"
          className="w-[140px] rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
