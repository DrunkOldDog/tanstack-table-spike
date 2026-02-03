import { flexRender, type Table } from '@tanstack/react-table'
import { getPinningStyles } from './table-utils'

interface DataTableProps<T> {
  table: Table<T>
  sticky?: boolean
}

export function DataTable<T>({ table, sticky = true }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full">
          <thead
            className={`${sticky ? 'sticky top-0' : ''} z-10 bg-gray-700/95 backdrop-blur`}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isPinned = header.column.getIsPinned()

                  return (
                    <th
                      key={header.id}
                      className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-300 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-white' : ''} ${isPinned ? 'bg-gray-700' : ''}`}
                      onClick={header.column.getToggleSortingHandler()}
                      style={getPinningStyles(header.column)}
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
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors hover:bg-gray-700/30"
              >
                {row.getVisibleCells().map((cell) => {
                  const isPinned = cell.column.getIsPinned()

                  return (
                    <td
                      key={cell.id}
                      className={`px-6 py-4 text-sm text-gray-200 ${isPinned ? 'bg-gray-800' : ''}`}
                      style={getPinningStyles(cell.column)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
