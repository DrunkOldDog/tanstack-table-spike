import { flexRender, type Table } from '@tanstack/react-table'
import type { HouseData } from '../-lib/types'

interface DataTableProps {
  table: Table<HouseData>
}

export function DataTable({ table }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-700/95 backdrop-blur">
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
          <tbody className="divide-y divide-gray-700">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="transition-colors hover:bg-gray-700/30"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-200">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
