import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'

import { columns } from './-lib/columns'
import { fuzzyFilter } from './-lib/filters'
import { useHouseData } from './-hooks/use-house-data'
import { useTableFilters } from './-hooks/use-table-filters'
import { useTableSearchParams } from './-hooks/use-table-search-params'
import { FilterBar } from './-components/filter-bar'
import { ActiveFilters } from './-components/active-filters'
import { TablePage } from '../-components/table-page'

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
  const { data, loading } = useHouseData()
  const filters = useTableFilters(data)
  const { searchParams, setSearchParams } = useTableSearchParams()

  return (
    <TablePage
      title="House Prices Dataset"
      data={data}
      loading={loading}
      columns={columns}
      filters={filters}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
      filterFns={{ fuzzy: fuzzyFilter }}
      renderFilterBar={(tableFilters) => (
        <FilterBar
          bedrooms={tableFilters.bedrooms}
          onBedroomsChange={tableFilters.setBedrooms}
          bedroomsOptions={tableFilters.uniqueBedrooms}
          bathrooms={tableFilters.bathrooms}
          onBathroomsChange={tableFilters.setBathrooms}
          bathroomsOptions={tableFilters.uniqueBathrooms}
          furnishingstatus={tableFilters.furnishingstatus}
          onFurnishingStatusChange={tableFilters.setFurnishingStatus}
          furnishingStatusOptions={tableFilters.uniqueFurnishingStatus}
          priceMin={tableFilters.priceMin}
          onPriceMinChange={tableFilters.setPriceMin}
          priceMax={tableFilters.priceMax}
          onPriceMaxChange={tableFilters.setPriceMax}
          areaMin={tableFilters.areaMin}
          onAreaMinChange={tableFilters.setAreaMin}
          areaMax={tableFilters.areaMax}
          onAreaMaxChange={tableFilters.setAreaMax}
          hasActiveFilters={tableFilters.hasActiveFilters}
          onClearFilters={tableFilters.clearAllFilters}
        />
      )}
      renderActiveFilters={(tableFilters) => (
        <ActiveFilters
          bedrooms={tableFilters.bedrooms}
          onClearBedrooms={() => tableFilters.setBedrooms('all')}
          bathrooms={tableFilters.bathrooms}
          onClearBathrooms={() => tableFilters.setBathrooms('all')}
          furnishingstatus={tableFilters.furnishingstatus}
          onClearFurnishingStatus={() => tableFilters.setFurnishingStatus('all')}
          priceMin={tableFilters.priceMin}
          priceMax={tableFilters.priceMax}
          onClearPrice={() => {
            tableFilters.setPriceMin('')
            tableFilters.setPriceMax('')
          }}
          areaMin={tableFilters.areaMin}
          areaMax={tableFilters.areaMax}
          onClearArea={() => {
            tableFilters.setAreaMin('')
            tableFilters.setAreaMax('')
          }}
          globalFilter={tableFilters.globalFilter}
          onClearGlobalFilter={() => tableFilters.setGlobalFilter('')}
          hasActiveFilters={tableFilters.hasActiveFilters}
        />
      )}
      getRowId={(row) => `${row.area}-${row.price}`}
      rowSelection={{
        fixed: true,
        hideSelectAll: true,
      }}
    />
  )
}
