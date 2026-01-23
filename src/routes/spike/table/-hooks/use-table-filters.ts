import { useEffect, useMemo, useState } from 'react'
import type { ColumnFiltersState } from '@tanstack/react-table'
import type { StockData } from '../-lib/types'
import { useDebounce } from './use-debounce'

export function useTableFilters(data: StockData[]) {
  // Filter states
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const debouncedGlobalFilter = useDebounce(globalFilter, 300)

  // Individual filter states for controlled inputs
  const [selectedSymbol, setSelectedSymbol] = useState<string>('all')
  const [volumeThreshold, setVolumeThreshold] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  // Extract unique symbols for the select dropdown
  const uniqueSymbols = useMemo(() => {
    return [...new Set(data.map(d => d.Name))].sort()
  }, [data])

  // Update column filters when individual filters change
  useEffect(() => {
    const newFilters: ColumnFiltersState = []

    if (selectedSymbol && selectedSymbol !== 'all') {
      newFilters.push({ id: 'Name', value: selectedSymbol })
    }

    if (volumeThreshold && volumeThreshold !== 'all') {
      newFilters.push({ id: 'volume', value: volumeThreshold })
    }

    if (dateFrom || dateTo) {
      newFilters.push({
        id: 'date',
        value: {
          from: dateFrom ? new Date(dateFrom).getTime() : undefined,
          to: dateTo ? new Date(dateTo).getTime() : undefined,
        },
      })
    }

    setColumnFilters(newFilters)
  }, [selectedSymbol, volumeThreshold, dateFrom, dateTo])

  const clearAllFilters = () => {
    setSelectedSymbol('all')
    setVolumeThreshold('all')
    setDateFrom('')
    setDateTo('')
    setGlobalFilter('')
  }

  const hasActiveFilters =
    selectedSymbol !== 'all' ||
    volumeThreshold !== 'all' ||
    dateFrom !== '' ||
    dateTo !== '' ||
    globalFilter !== ''

  return {
    // Table state
    columnFilters,
    setColumnFilters,
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
