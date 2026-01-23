import { useRef } from 'react'
import { flexRender, type Table } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { StockData } from '../-lib/types'

interface VirtualDataTableProps {
  table: Table<StockData>
}

export function VirtualDataTable({ table }: VirtualDataTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 53, // Estimated row height in px (py-4 = 16px * 2 + content)
    getScrollElement: () => tableContainerRef.current,
    overscan: 10, // Render 10 extra rows above/below viewport for smooth scrolling
  })

  return (
    <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
      <div
        ref={tableContainerRef}
        className="max-h-[70vh] overflow-auto"
      >
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-gray-700/95 backdrop-blur">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-300"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
              const row = rows[virtualRow.index]
              return (
                <tr
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
                  className="flex transition-colors hover:bg-gray-700/30"
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="flex-1 px-6 py-4 text-sm text-gray-200"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
