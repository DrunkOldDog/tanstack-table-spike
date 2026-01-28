import { useRef } from 'react'
import { flexRender, type Table } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

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
    <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
      <div
        ref={tableContainerRef}
        className="max-h-[70vh] overflow-auto"
      >
        {/* Header - uses flex to match body layout */}
        <div className="sticky top-0 z-10 flex w-full bg-gray-700/95 backdrop-blur">
          {table.getHeaderGroups().map(headerGroup =>
            headerGroup.headers.map(header => (
              <div
                key={header.id}
                className={`flex-1 px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-300 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-white' : ''
                  }`}
                onClick={header.column.getToggleSortingHandler()}
              >
                <div className="flex items-center gap-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: <span className="text-blue-400">↑</span>,
                    desc: <span className="text-blue-400">↓</span>,
                  }[header.column.getIsSorted() as string] ?? (
                      header.column.getCanSort() ? (
                        <span className="text-gray-600">↕</span>
                      ) : null
                    )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Virtualized Body */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const row = rows[virtualRow.index]
            return (
              <div
                key={row.id}
                data-index={virtualRow.index}
                ref={node => rowVirtualizer.measureElement(node)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="flex border-b border-gray-700 transition-colors hover:bg-gray-700/30"
              >
                {row.getVisibleCells().map(cell => (
                  <div
                    key={cell.id}
                    className="flex-1 px-6 py-4 text-sm text-gray-200"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
