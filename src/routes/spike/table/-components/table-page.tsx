import { useMemo, useState } from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type FilterFn,
  type OnChangeFn,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'

import {
  sortingParamToState,
  sortingStateToParam,
} from '../-lib/sorting-mapper'
import { GlobalSearch } from './global-search'
import { DataTable } from './data-table'
import { VirtualDataTable } from './virtual-data-table'
import { ColumnManager } from './column-manager'
import { Pagination, type PaginationProps } from './pagination'

type TableSearchParams = {
  sortBy?: string
}

type TableFiltersBase = {
  columnFilters: ColumnFiltersState
  setColumnFilters: OnChangeFn<ColumnFiltersState>
  globalFilter: string
  setGlobalFilter: (value: string) => void
  debouncedGlobalFilter: string
}

type TablePageProps<T, F extends TableFiltersBase> = {
  title: string
  data: T[]
  loading: boolean
  columns: ColumnDef<T, any>[]
  filters: F
  searchParams: TableSearchParams
  setSearchParams: (partial: Partial<TableSearchParams>) => void
  filterFns: Record<string, FilterFn<T>>
  renderFilterBar?: (filters: F) => React.ReactNode
  renderActiveFilters?: (filters: F) => React.ReactNode
  virtual?: boolean
  pagination?: Omit<PaginationProps<T>, 'table'> & {
    defaultCurrent?: number
    defaultPageSize?: number
  }
}

export function TablePage<T, F extends TableFiltersBase>({
  title,
  data,
  loading,
  columns,
  filters,
  searchParams,
  setSearchParams,
  filterFns,
  renderFilterBar,
  renderActiveFilters,
  virtual = false,
  pagination: paginationProps,
}: TablePageProps<T, F>) {
  const [useVirtualization, setUseVirtualization] = useState(virtual)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Initialize column pinning from column meta defaults
  const initialColumnPinning = useMemo<ColumnPinningState>(() => {
    const left: string[] = []
    const right: string[] = []

    columns.forEach((col) => {
      const accessorKey = 'accessorKey' in col ? (col.accessorKey as string) : undefined      
      const id = accessorKey ?? col.id
      const defaultPinned = col.meta?.defaultPinned
      if (id && defaultPinned === 'left') {
        left.push(id)
      } else if (id && defaultPinned === 'right') {
        right.push(id)
      }
    })

    return { left, right }
  }, [columns])

  const [columnPinning, setColumnPinning] =
    useState<ColumnPinningState>(initialColumnPinning)

  const sorting = useMemo<SortingState>(
    () => sortingParamToState(searchParams.sortBy),
    [searchParams.sortBy],
  )

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
      columnPinning,
    },
    initialState: {
      pagination: {
        pageIndex: (paginationProps?.defaultCurrent ?? 1) - 1,
        pageSize: paginationProps?.defaultPageSize ?? 10,
      },
    },
    onColumnFiltersChange: filters.setColumnFilters,
    onGlobalFilterChange: filters.setGlobalFilter,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(!useVirtualization && { getPaginationRowModel: getPaginationRowModel() }),
    filterFns,
    globalFilterFn: 'fuzzy',
    // Multi-column sorting
    enableMultiSort: true,
    maxMultiSortColCount: 3,
    // Column pinning
    enableColumnPinning: true,
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
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-sm text-gray-400">
              {table.getFilteredRowModel().rows.length.toLocaleString()} of{' '}
              {data.length.toLocaleString()} records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ColumnManager table={table} />

            {virtual ? (
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
                  (~
                  {useVirtualization
                    ? '30'
                    : table.getFilteredRowModel().rows.length.toLocaleString()}{' '}
                  DOM rows)
                </span>
              </button>
            ) : null}
          </div>
        </div>

        <GlobalSearch
          value={filters.globalFilter}
          onChange={filters.setGlobalFilter}
        />

        {renderFilterBar?.(filters)}

        {renderActiveFilters?.(filters)}

        {virtual && useVirtualization ? (
          <VirtualDataTable table={table} />
        ) : (
          <>
            <DataTable table={table} />
            <Pagination table={table} {...paginationProps} />
          </>
        )}
      </div>
    </div>
  )
}
