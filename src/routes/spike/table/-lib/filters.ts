import type { FilterFn, SortingFn } from '@tanstack/react-table'
import { rankItem, compareItems } from '@tanstack/match-sorter-utils'
import { sortingFns } from '@tanstack/react-table'
import type { StockData } from './types'

// Fuzzy filter function using match-sorter-utils
export const fuzzyFilter: FilterFn<StockData> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// Fuzzy sort function - ranks better matches higher
export const fuzzySort: SortingFn<StockData> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!,
    )
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

// Volume threshold filter - filters rows where volume >= threshold
export const volumeThresholdFilter: FilterFn<StockData> = (
  row,
  columnId,
  threshold,
) => {
  const volume = row.getValue<number>(columnId)
  if (!threshold || threshold === 'all') return true
  return volume >= Number(threshold)
}

// Date range filter - filters rows within date range
export const dateRangeFilter: FilterFn<StockData> = (row, columnId, range) => {
  const date = row.getValue<number>(columnId)
  const { from, to } = range as { from?: number; to?: number }
  if (from && date < from) return false
  if (to && date > to) return false
  return true
}
