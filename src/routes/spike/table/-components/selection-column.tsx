import type { ColumnDef } from '@tanstack/react-table'

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
        <div className={alignClass[align]}>
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            ref={(el) => {
              if (el) {
                el.indeterminate = table.getIsSomePageRowsSelected()
              }
            }}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="h-4 w-4 cursor-pointer rounded border-gray-500 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
          />
        </div>
      )
    },
    cell: ({ row, table }) => {
      const checkboxProps = config.getCheckboxProps?.(row.original)
      const isDisabled = checkboxProps?.disabled ?? !row.getCanSelect()

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const handler = row.getToggleSelectedHandler()
        handler(e)

        if (config.onSelect) {
          const selectedRows = table
            .getSelectedRowModel()
            .rows.map((r: { original: T }) => r.original)

          // After toggle, the selection state will be inverted
          const willBeSelected = !row.getIsSelected()
          const updatedSelectedRows = willBeSelected
            ? [...selectedRows, row.original]
            : selectedRows.filter((r: T) => r !== row.original)

          config.onSelect(
            row.original,
            willBeSelected,
            updatedSelectedRows,
            e.nativeEvent,
          )
        }
      }

      return (
        <div className={alignClass[align]}>
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={isDisabled}
            onChange={handleChange}
            className="h-4 w-4 cursor-pointer rounded border-gray-500 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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
