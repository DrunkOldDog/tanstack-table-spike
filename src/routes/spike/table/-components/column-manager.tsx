import type { Table } from '@tanstack/react-table'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { LayoutGrid } from 'lucide-react'
import type { StockData } from '../-lib/types'

interface ColumnManagerProps {
  table: Table<StockData>
}

export function ColumnManager({ table }: ColumnManagerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600">
          <span>
            <LayoutGrid size={16} className="text-white" />
          </span>
          Columns
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56">
        <PopoverHeader>
          <PopoverTitle>Column Visibility</PopoverTitle>
          <PopoverDescription>Toggle columns on/off</PopoverDescription>
        </PopoverHeader>
        <div className="mt-4 flex flex-col gap-3">
          {table.getAllLeafColumns().map((column) => {
            const canHide = column.getCanHide()
            return (
              <label
                key={column.id}
                className={`flex items-center gap-3 text-sm ${
                  !canHide ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
              >
                <Checkbox
                  checked={column.getIsVisible()}
                  disabled={!canHide}
                  onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
                />
                <span>{column.columnDef.header as string}</span>
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
