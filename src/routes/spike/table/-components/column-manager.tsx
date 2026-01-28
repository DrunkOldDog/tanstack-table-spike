import { useMemo } from 'react'
import type { Column, Table } from '@tanstack/react-table'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LayoutGrid } from 'lucide-react'
import type { PinStatus } from '../-lib/column.types'

interface ColumnManagerProps<T> {
  table: Table<T>
}

type GroupedColumns<T> = Record<string, Column<T, unknown>[]>

export function ColumnManager<T>({ table }: ColumnManagerProps<T>) {
  // Group columns by their meta.group property
  const groupedColumns = useMemo<GroupedColumns<T>>(() => {
    const groups: GroupedColumns<T> = {}
    const ungroupedKey = 'Other'

    table.getAllLeafColumns().forEach((column) => {
      const group = column.columnDef.meta?.group || ungroupedKey
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(column)
    })

    return groups
  }, [table])

  const handlePinChange = (column: Column<T, unknown>, value: string) => {
    const pinValue: PinStatus = value === 'none' ? false : (value as 'left' | 'right')
    column.pin(pinValue)
  }

  const getPinValue = (column: Column<T, unknown>): string => {
    const pinned = column.getIsPinned()
    return pinned === false ? 'none' : pinned
  }

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
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Column Manager</PopoverTitle>
          <PopoverDescription>
            Toggle visibility and pin columns
          </PopoverDescription>
        </PopoverHeader>
        <div className="mt-4 max-h-[400px] overflow-y-auto">
          {Object.entries(groupedColumns).map(([groupName, columns]) => (
            <div key={groupName} className="mb-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {groupName}
              </h4>
              <div className="flex flex-col gap-2">
                {columns.map((column) => {
                  const canHide = column.getCanHide()
                  const canPin = column.getCanPin()

                  return (
                    <div
                      key={column.id}
                      className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5"
                    >
                      <label
                        className={`flex flex-1 items-center gap-2 text-sm ${!canHide ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        <Checkbox
                          checked={column.getIsVisible()}
                          disabled={!canHide}
                          onCheckedChange={(checked) =>
                            column.toggleVisibility(!!checked)
                          }
                        />
                        <span className="truncate">
                          {column.columnDef.header as string}
                        </span>
                      </label>
                      {canPin && (
                        <Select
                          value={getPinValue(column)}
                          onValueChange={(value) =>
                            handlePinChange(column, value)
                          }
                        >
                          <SelectTrigger className="h-2 w-20 text-xs">
                            <SelectValue placeholder="Pin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
