import type { CSSProperties } from 'react'
import { useRef } from 'react'
import { flexRender, type Column, type Table } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

interface VirtualDataTableProps<T> {
  table: Table<T>
}

/**
 * Get pinning styles for a column in a flex layout
 */
function getPinningStyles<T>(column: Column<T, unknown>): CSSProperties {
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
    minWidth: column.getSize(),
    maxWidth: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    flex: isPinned ? 'none' : '1',
  }
}

export function VirtualDataTable<T>({ table }: VirtualDataTableProps<T>) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 53,
    getScrollElement: () => tableContainerRef.current,
    overscan: 10,
  })

  return (
    <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
      <div ref={tableContainerRef} className="max-h-[70vh] overflow-auto">
        {/* Header - uses flex to match body layout */}
        <div className="sticky top-0 z-10 flex w-full bg-gray-700/95 backdrop-blur">
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => {
              const isPinned = header.column.getIsPinned()

              return (
                <div
                  key={header.id}
                  className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-300 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-white' : ''} ${isPinned ? 'bg-gray-700' : ''}`}
                  style={getPinningStyles(header.column)}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{
                      asc: (
                        <span className="flex items-center text-blue-400">
                          ↑
                        </span>
                      ),
                      desc: (
                        <span className="flex items-center text-blue-400">
                          ↓
                        </span>
                      ),
                    }[header.column.getIsSorted() as string] ??
                      (header.column.getCanSort() ? (
                        <span className="text-gray-600">↕</span>
                      ) : null)}
                  </div>
                </div>
              )
            }),
          )}
        </div>

        {/* Virtualized Body */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index]
            return (
              <div
                key={row.id}
                data-index={virtualRow.index}
                ref={(node) => rowVirtualizer.measureElement(node)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="flex border-b border-gray-700 transition-colors hover:bg-gray-700/30"
              >
                {row.getVisibleCells().map((cell) => {
                  const isPinned = cell.column.getIsPinned()

                  return (
                    <div
                      key={cell.id}
                      className={`px-6 py-4 text-sm text-gray-200 ${isPinned ? 'bg-gray-800' : ''}`}
                      style={getPinningStyles(cell.column)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
