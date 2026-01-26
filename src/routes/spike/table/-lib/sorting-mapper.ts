import type { SortingState } from '@tanstack/react-table'

/**
 * Converts TanStack Table's SortingState to a URL-friendly string format.
 * Format: "columnId.asc" or "columnId.desc"
 */
export const sortingStateToParam = (
  sorting: SortingState,
): string | undefined => {
  if (!sorting || sorting.length === 0) return undefined
  const sort = sorting[0]
  return `${sort.id}.${sort.desc ? 'desc' : 'asc'}`
}

/**
 * Converts a URL sort param string back to TanStack Table's SortingState.
 * Input format: "columnId.asc" or "columnId.desc"
 */
export const sortingParamToState = (sortBy?: string): SortingState => {
  if (!sortBy) return []
  const [id, order] = sortBy.split('.')
  return [{ id, desc: order === 'desc' }]
}
