import { useMemo, useState, useEffect } from 'react'
import type { ColumnFiltersState } from '@tanstack/react-table'
import type { HouseData } from '../-lib/types'
import { useDebounce } from '../../-hooks/use-debounce'
import { useTableSearchParams } from './use-table-search-params'

export function useTableFilters(data: HouseData[]) {
  const { searchParams, setSearchParams, resetSearchParams } =
    useTableSearchParams()

  // Local state for global filter input (for debouncing)
  const [globalFilterInput, setGlobalFilterInput] = useState(
    searchParams.globalFilter ?? '',
  )
  const debouncedGlobalFilter = useDebounce(globalFilterInput, 300)

  // Sync debounced global filter to URL
  useEffect(() => {
    if (debouncedGlobalFilter !== (searchParams.globalFilter ?? '')) {
      setSearchParams({ globalFilter: debouncedGlobalFilter || undefined })
    }
  }, [debouncedGlobalFilter, searchParams.globalFilter, setSearchParams])

  // Sync URL globalFilter back to input when it changes externally
  useEffect(() => {
    if (searchParams.globalFilter !== undefined) {
      setGlobalFilterInput(searchParams.globalFilter)
    } else if (searchParams.globalFilter === undefined && globalFilterInput) {
      // URL was cleared externally (e.g., reset button)
      setGlobalFilterInput('')
    }
  }, [searchParams.globalFilter])

  // Extract unique values for dropdowns
  const uniqueBedrooms = useMemo(() => {
    return [...new Set(data.map((d) => d.bedrooms))].sort((a, b) => a - b)
  }, [data])

  const uniqueBathrooms = useMemo(() => {
    return [...new Set(data.map((d) => d.bathrooms))].sort((a, b) => a - b)
  }, [data])

  const uniqueFurnishingStatus = useMemo(() => {
    return [...new Set(data.map((d) => d.furnishingstatus))].sort()
  }, [data])

  // Build column filters from URL params
  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = []

    if (searchParams.bedrooms && searchParams.bedrooms !== 'all') {
      filters.push({ id: 'bedrooms', value: searchParams.bedrooms })
    }

    if (searchParams.bathrooms && searchParams.bathrooms !== 'all') {
      filters.push({ id: 'bathrooms', value: searchParams.bathrooms })
    }

    if (searchParams.furnishingstatus && searchParams.furnishingstatus !== 'all') {
      filters.push({ id: 'furnishingstatus', value: searchParams.furnishingstatus })
    }

    if (searchParams.priceMin || searchParams.priceMax) {
      filters.push({
        id: 'price',
        value: {
          min: searchParams.priceMin ? Number(searchParams.priceMin) : undefined,
          max: searchParams.priceMax ? Number(searchParams.priceMax) : undefined,
        },
      })
    }

    if (searchParams.areaMin || searchParams.areaMax) {
      filters.push({
        id: 'area',
        value: {
          min: searchParams.areaMin ? Number(searchParams.areaMin) : undefined,
          max: searchParams.areaMax ? Number(searchParams.areaMax) : undefined,
        },
      })
    }

    return filters
  }, [
    searchParams.bedrooms,
    searchParams.bathrooms,
    searchParams.furnishingstatus,
    searchParams.priceMin,
    searchParams.priceMax,
    searchParams.areaMin,
    searchParams.areaMax,
  ])

  // Filter setters that update URL
  const setBedrooms = (value: string) => {
    setSearchParams({ bedrooms: value === 'all' ? undefined : value })
  }

  const setBathrooms = (value: string) => {
    setSearchParams({ bathrooms: value === 'all' ? undefined : value })
  }

  const setFurnishingStatus = (value: string) => {
    setSearchParams({ furnishingstatus: value === 'all' ? undefined : value })
  }

  const setPriceMin = (value: string) => {
    setSearchParams({ priceMin: value || undefined })
  }

  const setPriceMax = (value: string) => {
    setSearchParams({ priceMax: value || undefined })
  }

  const setAreaMin = (value: string) => {
    setSearchParams({ areaMin: value || undefined })
  }

  const setAreaMax = (value: string) => {
    setSearchParams({ areaMax: value || undefined })
  }

  const setGlobalFilter = (value: string) => {
    setGlobalFilterInput(value)
  }

  const clearAllFilters = () => {
    setGlobalFilterInput('')
    resetSearchParams()
  }

  const bedrooms = searchParams.bedrooms ?? 'all'
  const bathrooms = searchParams.bathrooms ?? 'all'
  const furnishingstatus = searchParams.furnishingstatus ?? 'all'
  const priceMin = searchParams.priceMin ?? ''
  const priceMax = searchParams.priceMax ?? ''
  const areaMin = searchParams.areaMin ?? ''
  const areaMax = searchParams.areaMax ?? ''
  const globalFilter = globalFilterInput

  const hasActiveFilters =
    bedrooms !== 'all' ||
    bathrooms !== 'all' ||
    furnishingstatus !== 'all' ||
    priceMin !== '' ||
    priceMax !== '' ||
    areaMin !== '' ||
    areaMax !== '' ||
    globalFilter !== ''

  return {
    // Table state
    columnFilters,
    setColumnFilters: () => {}, // No-op, managed by URL params
    globalFilter,
    setGlobalFilter,
    debouncedGlobalFilter,

    // Individual filter values
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    furnishingstatus,
    setFurnishingStatus,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    areaMin,
    setAreaMin,
    areaMax,
    setAreaMax,

    // Derived values
    uniqueBedrooms,
    uniqueBathrooms,
    uniqueFurnishingStatus,
    hasActiveFilters,
    clearAllFilters,
  }
}
