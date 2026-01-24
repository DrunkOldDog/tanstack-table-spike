import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { columns } from './-lib/columns'
import { fuzzyFilter } from './-lib/filters'
import { useStockData } from './-hooks/use-stock-data'
import { useTableFilters } from './-hooks/use-table-filters'
import { GlobalSearch } from './-components/global-search'
import { FilterBar } from './-components/filter-bar'
import { ActiveFilters } from './-components/active-filters'
import { DataTable } from './-components/data-table'
import { VirtualDataTable } from './-components/virtual-data-table'

export const Route = createFileRoute('/spike/table/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [useVirtualization, setUseVirtualization] = useState(true)
  const { data, loading } = useStockData()
  const filters = useTableFilters(data)

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters: filters.columnFilters,
      globalFilter: filters.debouncedGlobalFilter,
    },
    onColumnFiltersChange: filters.setColumnFilters,
    onGlobalFilterChange: filters.setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: { fuzzy: fuzzyFilter },
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
              Trading Surveillance
            </h1>
            <p className="text-sm text-gray-400">
              {table.getFilteredRowModel().rows.length.toLocaleString()} of{' '}
              {data.length.toLocaleString()} records
            </p>
          </div>

          {/* Virtualization Toggle */}
          <button
            onClick={() => setUseVirtualization(!useVirtualization)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              useVirtualization
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {useVirtualization ? 'Virtual: ON' : 'Virtual: OFF'}
            <span className="ml-2 text-xs opacity-75">
              (~{useVirtualization ? '30' : table.getFilteredRowModel().rows.length.toLocaleString()} DOM rows)
            </span>
          </button>
        </div>

        <GlobalSearch
          value={filters.globalFilter}
          onChange={filters.setGlobalFilter}
        />

        <FilterBar
          selectedSymbol={filters.selectedSymbol}
          onSymbolChange={filters.setSelectedSymbol}
          symbols={filters.uniqueSymbols}
          volumeThreshold={filters.volumeThreshold}
          onVolumeChange={filters.setVolumeThreshold}
          dateFrom={filters.dateFrom}
          onDateFromChange={filters.setDateFrom}
          dateTo={filters.dateTo}
          onDateToChange={filters.setDateTo}
          hasActiveFilters={filters.hasActiveFilters}
          onClearFilters={filters.clearAllFilters}
        />

        <ActiveFilters
          selectedSymbol={filters.selectedSymbol}
          onClearSymbol={() => filters.setSelectedSymbol('all')}
          volumeThreshold={filters.volumeThreshold}
          onClearVolume={() => filters.setVolumeThreshold('all')}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          onClearDates={() => {
            filters.setDateFrom('')
            filters.setDateTo('')
          }}
          globalFilter={filters.globalFilter}
          onClearGlobalFilter={() => filters.setGlobalFilter('')}
          hasActiveFilters={filters.hasActiveFilters}
        />

        {useVirtualization ? (
          <VirtualDataTable table={table} />
        ) : (
          <DataTable table={table} />
        )}
      </div>
    </div>
  )
}
