import { createColumnHelper } from '@tanstack/react-table'
import type { StockData } from './types'
import { volumeThresholdFilter, dateRangeFilter } from './filters'
// Import to ensure module augmentation is applied
import '../../-lib/column.types'

const columnHelper = createColumnHelper<StockData>()

export const columns = [
  columnHelper.accessor('Name', {
    header: 'Symbol',
    cell: (info) => (
      <span className="font-semibold text-blue-400">{info.getValue()}</span>
    ),
    filterFn: 'fuzzy',
    enableSorting: false,
    enableHiding: false,
    meta: {
      group: 'Identity',
      exportLabel: 'Stock Symbol',
      defaultPinned: 'left',
    },
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    filterFn: dateRangeFilter,
    enableGlobalFilter: false,
    meta: {
      group: 'Identity',
      exportLabel: 'Trading Date',
    },
  }),
  columnHelper.accessor('open', {
    header: 'Open',
    cell: (info) => `$${info.getValue().toFixed(2)}`,
    meta: {
      group: 'Price',
      exportLabel: 'Opening Price',
    },
  }),
  columnHelper.accessor('high', {
    header: 'High',
    cell: (info) => (
      <span className="text-green-400">${info.getValue().toFixed(2)}</span>
    ),
    meta: {
      group: 'Price',
      exportLabel: 'High Price',
    },
  }),
  columnHelper.accessor('low', {
    header: 'Low',
    cell: (info) => (
      <span className="text-red-400">${info.getValue().toFixed(2)}</span>
    ),
    meta: {
      group: 'Price',
      exportLabel: 'Low Price',
    },
  }),
  columnHelper.accessor('close', {
    header: 'Close',
    cell: (info) => `$${info.getValue().toFixed(2)}`,
    meta: {
      group: 'Price',
      exportLabel: 'Closing Price',
    },
  }),
  columnHelper.accessor('volume', {
    header: 'Volume',
    cell: (info) => info.getValue().toLocaleString(),
    filterFn: volumeThresholdFilter,
    enableGlobalFilter: false,
    meta: {
      group: 'Trading',
      exportLabel: 'Trading Volume',
    },
  }),
]
