import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export type RowSelectionAlign = 'left' | 'center' | 'right'

export interface RowSelectionConfig<T> {
  align?: RowSelectionAlign
  columnWidth?: string | number
  fixed?: boolean
  hideSelectAll?: boolean
  selectedRowKeys?: (string | number)[]
  onSelect?: (
    record: T,
    selected: boolean,
    selectedRows: T[],
    nativeEvent: Event,
  ) => void
  onChange?: (selectedRowKeys: string[], selectedRows: T[]) => void
  getCheckboxProps?: (record: T) => { disabled?: boolean }
}

const alignClass: Record<RowSelectionAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function createSelectionColumn<T>(
  config: RowSelectionConfig<T>,
): ColumnDef<T, unknown> {
  const { align = 'center', columnWidth = 48, hideSelectAll = false } = config

  return {
    id: '__selection__',
    size: typeof columnWidth === 'number' ? columnWidth : parseInt(columnWidth, 10) || 48,
    enableSorting: false,
    enableColumnFilter: false,
    meta: {
      ...(config.fixed && { defaultPinned: 'left' as const }),
    },
    header: ({ table }) => {
      if (hideSelectAll) {
        return null
      }

      return (
        <div className={cn('flex', alignClass[align])}>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      )
    },
    cell: ({ row, table }) => {
      const checkboxProps = config.getCheckboxProps?.(row.original)
      const isDisabled = checkboxProps?.disabled ?? !row.getCanSelect()

      const handleCheckedChange = (checked: boolean) => {
        row.toggleSelected(checked)

        if (config.onSelect) {
          const selectedRows = table
            .getSelectedRowModel()
            .rows.map((r: { original: T }) => r.original)

          const updatedSelectedRows = checked
            ? [...selectedRows, row.original]
            : selectedRows.filter((r: T) => r !== row.original)

          // Create a synthetic event for compatibility
          const syntheticEvent = new Event('change')
          config.onSelect(row.original, checked, updatedSelectedRows, syntheticEvent)
        }
      }

      return (
        <div className={cn('flex', alignClass[align])}>
          <Checkbox
            checked={row.getIsSelected()}
            disabled={isDisabled}
            onCheckedChange={handleCheckedChange}
            aria-label="Select row"
          />
        </div>
      )
    },
  }
}

/**
 * Convert selectedRowKeys array to RowSelectionState object
 */
export function rowKeysToState(keys: (string | number)[]): Record<string, boolean> {
  return keys.reduce(
    (acc, key) => {
      acc[String(key)] = true
      return acc
    },
    {} as Record<string, boolean>,
  )
}

/**
 * Convert RowSelectionState object to selectedRowKeys array
 */
export function stateToRowKeys(state: Record<string, boolean>): string[] {
  return Object.entries(state)
    .filter(([, selected]) => selected)
    .map(([key]) => key)
}
