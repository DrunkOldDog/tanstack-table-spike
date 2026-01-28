import { createColumnHelper } from '@tanstack/react-table'
import type { StockData } from './types'
import { volumeThresholdFilter, dateRangeFilter } from './filters'

const columnHelper = createColumnHelper<StockData>()

export const columns = [
  columnHelper.accessor('Name', {
    header: 'Symbol',
    cell: info => (
      <span className="font-semibold text-blue-400">{info.getValue()}</span>
    ),
    filterFn: 'fuzzy',
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
    filterFn: dateRangeFilter,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('open', {
    header: 'Open',
    cell: info => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor('high', {
    header: 'High',
    cell: info => (
      <span className="text-green-400">${info.getValue().toFixed(2)}</span>
    ),
  }),
  columnHelper.accessor('low', {
    header: 'Low',
    cell: info => (
      <span className="text-red-400">${info.getValue().toFixed(2)}</span>
    ),
  }),
  columnHelper.accessor('close', {
    header: 'Close',
    cell: info => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor('volume', {
    header: 'Volume',
    cell: info => info.getValue().toLocaleString(),
    filterFn: volumeThresholdFilter,
    enableGlobalFilter: false,
  }),
]
