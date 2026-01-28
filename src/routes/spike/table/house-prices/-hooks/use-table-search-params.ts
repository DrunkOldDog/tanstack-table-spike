import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { cleanEmptyParams } from '../../-lib/clean-params'

const routeApi = getRouteApi('/spike/table/house-prices/')

export type TableSearchParams = {
  bedrooms?: string
  bathrooms?: string
  furnishingstatus?: string
  priceMin?: string
  priceMax?: string
  areaMin?: string
  areaMax?: string
  globalFilter?: string
  sortBy?: string
}

export function useTableSearchParams() {
  const navigate = useNavigate({ from: '/spike/table/house-prices/' })
  const searchParams = routeApi.useSearch() as TableSearchParams

  const setSearchParams = (partial: Partial<TableSearchParams>) =>
    navigate({
      to: '.',
      search: (prev) => cleanEmptyParams({ ...prev, ...partial }),
      replace: true,
    })

  const resetSearchParams = () =>
    navigate({
      to: '.',
      search: {},
      replace: true,
    })

  return { searchParams, setSearchParams, resetSearchParams }
}
