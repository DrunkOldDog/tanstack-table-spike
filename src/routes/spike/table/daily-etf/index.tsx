import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'

import { columns } from './-lib/columns'
import { fuzzyFilter } from './-lib/filters'
import { useStockData } from './-hooks/use-stock-data'
import { useTableFilters } from './-hooks/use-table-filters'
import { useTableSearchParams } from './-hooks/use-table-search-params'
import { FilterBar } from './-components/filter-bar'
import { ActiveFilters } from '../-components/active-filters'
import { TablePage } from '../-components/table-page'

const tableSearchSchema = z.object({
  symbol: z.string().optional(),
  volumeThreshold: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  globalFilter: z.string().optional(),
  sortBy: z.string().optional(),
})

export const Route = createFileRoute('/spike/table/daily-etf/')({
  validateSearch: zodValidator(tableSearchSchema),
  component: RouteComponent,
})

function RouteComponent() {
  const { data, loading } = useStockData()
  const filters = useTableFilters(data)
  const { searchParams, setSearchParams } = useTableSearchParams()

  return (
    <TablePage
      title="Trading Surveillance"
      data={data}
      loading={loading}
      columns={columns}
      filters={filters}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
      filterFns={{ fuzzy: fuzzyFilter }}
      virtual
      renderFilterBar={(tableFilters) => (
        <FilterBar
          selectedSymbol={tableFilters.selectedSymbol}
          onSymbolChange={tableFilters.setSelectedSymbol}
          symbols={tableFilters.uniqueSymbols}
          volumeThreshold={tableFilters.volumeThreshold}
          onVolumeChange={tableFilters.setVolumeThreshold}
          dateFrom={tableFilters.dateFrom}
          onDateFromChange={tableFilters.setDateFrom}
          dateTo={tableFilters.dateTo}
          onDateToChange={tableFilters.setDateTo}
          hasActiveFilters={tableFilters.hasActiveFilters}
          onClearFilters={tableFilters.clearAllFilters}
        />
      )}
      renderActiveFilters={(tableFilters) => (
        <ActiveFilters
          selectedSymbol={tableFilters.selectedSymbol}
          onClearSymbol={() => tableFilters.setSelectedSymbol('all')}
          volumeThreshold={tableFilters.volumeThreshold}
          onClearVolume={() => tableFilters.setVolumeThreshold('all')}
          dateFrom={tableFilters.dateFrom}
          dateTo={tableFilters.dateTo}
          onClearDates={() => {
            tableFilters.setDateFrom('')
            tableFilters.setDateTo('')
          }}
          globalFilter={tableFilters.globalFilter}
          onClearGlobalFilter={() => tableFilters.setGlobalFilter('')}
          hasActiveFilters={tableFilters.hasActiveFilters}
        />
      )}
    />
  )
}
