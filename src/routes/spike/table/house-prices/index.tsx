import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { z } from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'

import { columns } from './-lib/columns'
import {
  fuzzyFilter,
  priceRangeFilter,
  areaRangeFilter,
  exactMatchFilter,
} from './-lib/filters'
import {
  sortingParamToState,
  sortingStateToParam,
} from '../-lib/sorting-mapper'
import { useHouseData } from './-hooks/use-house-data'
import { useTableFilters } from './-hooks/use-table-filters'
import { useTableSearchParams } from './-hooks/use-table-search-params'
import { GlobalSearch } from '../-components/global-search'
import { FilterBar } from './-components/filter-bar'
import { ActiveFilters } from './-components/active-filters'
import { DataTable } from './-components/data-table'
import { ColumnManager } from '../-components/column-manager'

const tableSearchSchema = z.object({
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  furnishingstatus: z.string().optional(),
  priceMin: z.string().optional(),
  priceMax: z.string().optional(),
  areaMin: z.string().optional(),
  areaMax: z.string().optional(),
  globalFilter: z.string().optional(),
  sortBy: z.string().optional(),
})

export const Route = createFileRoute('/spike/table/house-prices/')({
  validateSearch: zodValidator(tableSearchSchema),
  component: RouteComponent,
})

function RouteComponent() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const { data, loading } = useHouseData()
  const filters = useTableFilters(data)
  const { searchParams, setSearchParams } = useTableSearchParams()

  // Derive sorting state from URL params
  const sorting = useMemo<SortingState>(
    () => sortingParamToState(searchParams.sortBy),
    [searchParams.sortBy],
  )

  // Handle sorting change by updating URL
  const handleSortingChange = (
    updaterOrValue: SortingState | ((prev: SortingState) => SortingState),
  ) => {
    const newSorting =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(sorting)
        : updaterOrValue
    setSearchParams({ sortBy: sortingStateToParam(newSorting) })
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters: filters.columnFilters,
      globalFilter: filters.debouncedGlobalFilter,
      sorting,
      columnVisibility,
    },
    onColumnFiltersChange: filters.setColumnFilters,
    onGlobalFilterChange: filters.setGlobalFilter,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: 'fuzzy',
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-xl text-gray-400">Loading data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              House Prices Dataset
            </h1>
            <p className="text-sm text-gray-400">
              {table.getFilteredRowModel().rows.length.toLocaleString()} of{' '}
              {data.length.toLocaleString()} records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ColumnManager table={table} />
          </div>
        </div>

        <GlobalSearch
          value={filters.globalFilter}
          onChange={filters.setGlobalFilter}
        />

        <FilterBar
          bedrooms={filters.bedrooms}
          onBedroomsChange={filters.setBedrooms}
          bedroomsOptions={filters.uniqueBedrooms}
          bathrooms={filters.bathrooms}
          onBathroomsChange={filters.setBathrooms}
          bathroomsOptions={filters.uniqueBathrooms}
          furnishingstatus={filters.furnishingstatus}
          onFurnishingStatusChange={filters.setFurnishingStatus}
          furnishingStatusOptions={filters.uniqueFurnishingStatus}
          priceMin={filters.priceMin}
          onPriceMinChange={filters.setPriceMin}
          priceMax={filters.priceMax}
          onPriceMaxChange={filters.setPriceMax}
          areaMin={filters.areaMin}
          onAreaMinChange={filters.setAreaMin}
          areaMax={filters.areaMax}
          onAreaMaxChange={filters.setAreaMax}
          hasActiveFilters={filters.hasActiveFilters}
          onClearFilters={filters.clearAllFilters}
        />

        <ActiveFilters
          bedrooms={filters.bedrooms}
          onClearBedrooms={() => filters.setBedrooms('all')}
          bathrooms={filters.bathrooms}
          onClearBathrooms={() => filters.setBathrooms('all')}
          furnishingstatus={filters.furnishingstatus}
          onClearFurnishingStatus={() => filters.setFurnishingStatus('all')}
          priceMin={filters.priceMin}
          priceMax={filters.priceMax}
          onClearPrice={() => {
            filters.setPriceMin('')
            filters.setPriceMax('')
          }}
          areaMin={filters.areaMin}
          areaMax={filters.areaMax}
          onClearArea={() => {
            filters.setAreaMin('')
            filters.setAreaMax('')
          }}
          globalFilter={filters.globalFilter}
          onClearGlobalFilter={() => filters.setGlobalFilter('')}
          hasActiveFilters={filters.hasActiveFilters}
        />

        <DataTable table={table} />
      </div>
    </div>
  )
}
