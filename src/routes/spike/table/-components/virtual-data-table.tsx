import { useRef } from 'react'
import { flexRender, type Table } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { getPinningStyles } from './table-utils'
import { cn } from '@/lib/utils'

interface VirtualDataTableProps<T> {
  table: Table<T>
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
    <div className="overflow-hidden rounded-md border">
      <div ref={tableContainerRef} className="max-h-[70vh] overflow-auto">
        {/* Header - uses flex to match body layout */}
        <div className="sticky top-0 z-20 flex w-full bg-background border-b">
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => {
              const isPinned = header.column.getIsPinned()
              const align = header.column.columnDef.meta?.align ?? 'left'

              return (
                <div
                  key={header.id}
                  className={cn(
                    'h-10 px-2 text-sm font-medium text-foreground flex items-center',
                    header.column.getCanSort() && 'cursor-pointer select-none',
                    isPinned && 'bg-background z-10',
                    align === 'center' && 'justify-center',
                    align === 'right' && 'justify-end',
                  )}
                  style={getPinningStyles(header.column)}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{
                      asc: <span className="text-primary">↑</span>,
                      desc: <span className="text-primary">↓</span>,
                    }[header.column.getIsSorted() as string] ??
                      (header.column.getCanSort() ? (
                        <span className="text-muted-foreground">↕</span>
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
                data-state={row.getIsSelected() && 'selected'}
                ref={(node) => rowVirtualizer.measureElement(node)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="flex border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {row.getVisibleCells().map((cell) => {
                  const isPinned = cell.column.getIsPinned()
                  const align = cell.column.columnDef.meta?.align ?? 'left'

                  return (
                    <div
                      key={cell.id}
                      className={cn(
                        'p-2 text-sm flex items-center',
                        isPinned && 'bg-background',
                        align === 'center' && 'justify-center',
                        align === 'right' && 'justify-end',
                      )}
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
