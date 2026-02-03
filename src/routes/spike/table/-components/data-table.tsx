import { flexRender, type Table as TanStackTable } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getPinningStyles } from './table-utils'
import { cn } from '@/lib/utils'

interface DataTableProps<T> {
  table: TanStackTable<T>
  sticky?: boolean
}

export function DataTable<T>({ table, sticky = true }: DataTableProps<T>) {
  return (
    <div className="rounded-md border max-h-[70vh] overflow-auto">
      <Table>
        <TableHeader className={cn(sticky && 'sticky top-0 z-20 bg-background')}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'bg-background',
                      header.column.getCanSort() && 'cursor-pointer select-none',
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    style={getPinningStyles(header.column)}
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
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => {
                  const isPinned = cell.column.getIsPinned()

                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(isPinned && 'bg-background')}
                      style={getPinningStyles(cell.column)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
