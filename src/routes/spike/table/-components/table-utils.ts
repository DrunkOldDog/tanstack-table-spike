import type { CSSProperties } from 'react'
import type { Column } from '@tanstack/react-table'

/**
 * Get pinning styles for a column
 */
export function getPinningStyles<T>(
  column: Column<T, unknown>,
  options?: { flex?: boolean },
): CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinned =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinned =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinned
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinned
        ? '4px 0 4px -4px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    // Flex-specific styles for virtualized table
    ...(options?.flex && {
      minWidth: column.getSize(),
      maxWidth: column.getSize(),
      flex: isPinned ? 'none' : '1',
    }),
  }
}
