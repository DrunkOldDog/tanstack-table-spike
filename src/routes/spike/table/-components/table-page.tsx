import { useEffect, useMemo, useState } from 'react'
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
  type RowSelectionState,
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
import {
  createSelectionColumn,
  rowKeysToState,
  stateToRowKeys,
  type RowSelectionConfig,
} from './selection-column'
import { TableSkeleton } from './table-skeleton'

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
  sticky?: boolean
  pagination?: Omit<PaginationProps<T>, 'table'> & {
    defaultCurrent?: number
    defaultPageSize?: number
  }
  rowSelection?: RowSelectionConfig<T>
  getRowId?: (row: T, index: number) => string
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
  sticky = true,
  pagination: paginationProps,
  rowSelection: rowSelectionConfig,
  getRowId,
}: TablePageProps<T, F>) {
  const [useVirtualization, setUseVirtualization] = useState(virtual)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Row selection state - controlled via selectedRowKeys or internal
  const isControlledSelection = rowSelectionConfig?.selectedRowKeys !== undefined
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>(
    () => rowKeysToState(rowSelectionConfig?.selectedRowKeys ?? []),
  )

  // Sync internal state when controlled selectedRowKeys changes
  useEffect(() => {
    if (isControlledSelection) {
      setInternalRowSelection(rowKeysToState(rowSelectionConfig.selectedRowKeys!))
    }
  }, [isControlledSelection, rowSelectionConfig?.selectedRowKeys])

  // Build columns with selection column if enabled
  const tableColumns = useMemo(() => {
    if (!rowSelectionConfig) return columns
    const selectionColumn = createSelectionColumn(rowSelectionConfig)
    return [selectionColumn, ...columns]
  }, [columns, rowSelectionConfig])

  // Initialize column pinning from column meta defaults
  const initialColumnPinning = useMemo<ColumnPinningState>(() => {
    const left: string[] = []
    const right: string[] = []

    // Add selection column to pinned left if fixed
    if (rowSelectionConfig?.fixed) {
      left.push('__selection__')
    }

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
  }, [columns, rowSelectionConfig?.fixed])

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

  const handleRowSelectionChange = (
    updaterOrValue: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState),
  ) => {
    const newSelection =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(internalRowSelection)
        : updaterOrValue

    if (!isControlledSelection) {
      setInternalRowSelection(newSelection)
    }

    // Call onChange callback with the new selection
    if (rowSelectionConfig?.onChange) {
      const selectedKeys = stateToRowKeys(newSelection)
      const selectedRows = data.filter((_, index) => {
        const rowId = getRowId ? getRowId(data[index], index) : String(index)
        return newSelection[rowId]
      })
      rowSelectionConfig.onChange(selectedKeys, selectedRows)
    }
  }

  const table = useReactTable({
    data,
    columns: tableColumns,
    getRowId,
    state: {
      columnFilters: filters.columnFilters,
      globalFilter: filters.debouncedGlobalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      ...(rowSelectionConfig && { rowSelection: internalRowSelection }),
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
    onRowSelectionChange: handleRowSelectionChange,
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
    // Row selection
    enableRowSelection: !!rowSelectionConfig,
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-sm text-gray-400">Loading...</p>
          </div>
          <TableSkeleton columns={columns.length} />
        </div>
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
            <DataTable table={table} sticky={sticky} />
            <Pagination table={table} {...paginationProps} />
          </>
        )}
      </div>
    </div>
  )
}
