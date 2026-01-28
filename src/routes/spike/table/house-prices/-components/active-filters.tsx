interface ActiveFiltersProps {
  bedrooms: string
  onClearBedrooms: () => void
  bathrooms: string
  onClearBathrooms: () => void
  furnishingstatus: string
  onClearFurnishingStatus: () => void
  priceMin: string
  priceMax: string
  onClearPrice: () => void
  areaMin: string
  areaMax: string
  onClearArea: () => void
  globalFilter: string
  onClearGlobalFilter: () => void
  hasActiveFilters: boolean
}

export function ActiveFilters({
  bedrooms,
  onClearBedrooms,
  bathrooms,
  onClearBathrooms,
  furnishingstatus,
  onClearFurnishingStatus,
  priceMin,
  priceMax,
  onClearPrice,
  areaMin,
  areaMax,
  onClearArea,
  globalFilter,
  onClearGlobalFilter,
  hasActiveFilters,
}: ActiveFiltersProps) {
  if (!hasActiveFilters) return null

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {bedrooms !== 'all' && (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400">
          Bedrooms: {bedrooms}
          <button onClick={onClearBedrooms} className="ml-1 hover:text-blue-300">
            ×
          </button>
        </span>
      )}
      {bathrooms !== 'all' && (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
          Bathrooms: {bathrooms}
          <button onClick={onClearBathrooms} className="ml-1 hover:text-green-300">
            ×
          </button>
        </span>
      )}
      {furnishingstatus !== 'all' && (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-400">
          Furnishing: {furnishingstatus}
          <button
            onClick={onClearFurnishingStatus}
            className="ml-1 hover:text-purple-300"
          >
            ×
          </button>
        </span>
      )}
      {(priceMin || priceMax) && (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-400">
          Price: {priceMin ? `₹${Number(priceMin).toLocaleString()}` : '...'} →{' '}
          {priceMax ? `₹${Number(priceMax).toLocaleString()}` : '...'}
          <button onClick={onClearPrice} className="ml-1 hover:text-orange-300">
            ×
          </button>
        </span>
      )}
      {(areaMin || areaMax) && (
        <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 px-3 py-1 text-xs text-teal-400">
          Area: {areaMin ? `${Number(areaMin).toLocaleString()}` : '...'} →{' '}
          {areaMax ? `${Number(areaMax).toLocaleString()}` : '...'} sqft
          <button onClick={onClearArea} className="ml-1 hover:text-teal-300">
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
