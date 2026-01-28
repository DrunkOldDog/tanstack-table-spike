import type { SortingState } from '@tanstack/react-table'

/**
 * Converts TanStack Table's SortingState to a URL-friendly string format.
 * Single: "price.desc"
 * Multi:  "price.desc,date.asc"
 */
export const sortingStateToParam = (
  sorting: SortingState,
): string | undefined => {
  if (!sorting || sorting.length === 0) return undefined
  return sorting.map((s) => `${s.id}.${s.desc ? 'desc' : 'asc'}`).join(',')
}

/**
 * Converts a URL sort param string back to TanStack Table's SortingState.
 * Supports both single and multi-column sorting.
 * Input format: "price.desc" or "price.desc,date.asc"
 */
export const sortingParamToState = (sortBy?: string): SortingState => {
  if (!sortBy) return []
  return sortBy.split(',').map((part) => {
    const [id, order] = part.split('.')
    return { id, desc: order === 'desc' }
  })
}
