import { useMemo, useState, useEffect } from 'react'
import type { ColumnFiltersState } from '@tanstack/react-table'
import type { StockData } from '../-lib/types'
import { useDebounce } from './use-debounce'
import { useTableSearchParams } from './use-table-search-params'

export function useTableFilters(data: StockData[]) {
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

  // Extract unique symbols for the select dropdown
  const uniqueSymbols = useMemo(() => {
    return [...new Set(data.map((d) => d.Name))].sort()
  }, [data])

  // Build column filters from URL params
  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = []

    if (searchParams.symbol && searchParams.symbol !== 'all') {
      filters.push({ id: 'Name', value: searchParams.symbol })
    }

    if (searchParams.volumeThreshold && searchParams.volumeThreshold !== 'all') {
      filters.push({ id: 'volume', value: searchParams.volumeThreshold })
    }

    if (searchParams.dateFrom || searchParams.dateTo) {
      filters.push({
        id: 'date',
        value: {
          from: searchParams.dateFrom
            ? new Date(searchParams.dateFrom).getTime()
            : undefined,
          to: searchParams.dateTo
            ? new Date(searchParams.dateTo).getTime()
            : undefined,
        },
      })
    }

    return filters
  }, [
    searchParams.symbol,
    searchParams.volumeThreshold,
    searchParams.dateFrom,
    searchParams.dateTo,
  ])

  // Filter setters that update URL
  const setSelectedSymbol = (value: string) => {
    setSearchParams({ symbol: value === 'all' ? undefined : value })
  }

  const setVolumeThreshold = (value: string) => {
    setSearchParams({ volumeThreshold: value === 'all' ? undefined : value })
  }

  const setDateFrom = (value: string) => {
    setSearchParams({ dateFrom: value || undefined })
  }

  const setDateTo = (value: string) => {
    setSearchParams({ dateTo: value || undefined })
  }

  const setGlobalFilter = (value: string) => {
    setGlobalFilterInput(value)
  }

  const clearAllFilters = () => {
    setGlobalFilterInput('')
    resetSearchParams()
  }

  const selectedSymbol = searchParams.symbol ?? 'all'
  const volumeThreshold = searchParams.volumeThreshold ?? 'all'
  const dateFrom = searchParams.dateFrom ?? ''
  const dateTo = searchParams.dateTo ?? ''
  const globalFilter = globalFilterInput

  const hasActiveFilters =
    selectedSymbol !== 'all' ||
    volumeThreshold !== 'all' ||
    dateFrom !== '' ||
    dateTo !== '' ||
    globalFilter !== ''

  return {
    // Table state
    columnFilters,
    setColumnFilters: () => {}, // No-op, managed by URL params, keeping this for compatibility with the table
    globalFilter,
    setGlobalFilter,
    debouncedGlobalFilter,

    // Individual filter values
    selectedSymbol,
    setSelectedSymbol,
    volumeThreshold,
    setVolumeThreshold,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,

    // Derived values
    uniqueSymbols,
    hasActiveFilters,
    clearAllFilters,
  }
}
