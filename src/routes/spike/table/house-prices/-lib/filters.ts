import type { FilterFn } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { HouseData } from './types'

// Fuzzy filter function using match-sorter-utils
export const fuzzyFilter: FilterFn<HouseData> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// Price range filter
export const priceRangeFilter: FilterFn<HouseData> = (
  row,
  columnId,
  range,
) => {
  const price = row.getValue<number>(columnId)
  const { min, max } = range as { min?: number; max?: number }
  if (min !== undefined && price < min) return false
  if (max !== undefined && price > max) return false
  return true
}

// Area range filter
export const areaRangeFilter: FilterFn<HouseData> = (row, columnId, range) => {
  const area = row.getValue<number>(columnId)
  const { min, max } = range as { min?: number; max?: number }
  if (min !== undefined && area < min) return false
  if (max !== undefined && area > max) return false
  return true
}

// Exact match filter for bedrooms, bathrooms, furnishingstatus
export const exactMatchFilter: FilterFn<HouseData> = (
  row,
  columnId,
  value,
) => {
  if (!value || value === 'all') return true
  return String(row.getValue(columnId)) === String(value)
}
