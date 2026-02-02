import { useState } from 'react'
import type { Table } from '@tanstack/react-table'

type PaginationAlign = 'left' | 'center' | 'right'

export interface PaginationProps<T> {
  table: Table<T>
  align?: PaginationAlign
  current?: number
  disabled?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  showQuickJumper?: boolean
  showSizeChanger?: boolean
  total?: number
  onChange?: (page: number, pageSize: number) => void
}

export function Pagination<T>({
  table,
  align = 'right',
  current,
  disabled = false,
  pageSize: controlledPageSize,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = false,
  showSizeChanger = false,
  total: controlledTotal,
  onChange,
}: PaginationProps<T>) {
  const [jumpValue, setJumpValue] = useState('')

  const tableState = table.getState().pagination
  const pageIndex = current !== undefined ? current - 1 : tableState.pageIndex
  const pageSize = controlledPageSize ?? tableState.pageSize
  const total = controlledTotal ?? table.getFilteredRowModel().rows.length
  const pageCount = Math.ceil(total / pageSize)

  const handlePageChange = (newPage: number) => {
    if (current === undefined) {
      table.setPageIndex(newPage - 1)
    }
    onChange?.(newPage, pageSize)
  }

  const handlePageSizeChange = (newSize: number) => {
    const newPageCount = Math.ceil(total / newSize)
    const newPage = Math.min(pageIndex + 1, newPageCount)
    if (controlledPageSize === undefined) {
      table.setPageSize(newSize)
    }
    if (current === undefined && newPage !== pageIndex + 1) {
      table.setPageIndex(newPage - 1)
    }
    onChange?.(newPage, newSize)
  }

  const handleJump = () => {
    const jumpPage = parseInt(jumpValue, 10)
    if (!isNaN(jumpPage) && jumpPage >= 1 && jumpPage <= pageCount) {
      handlePageChange(jumpPage)
    }
    setJumpValue('')
  }

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const currentPage = pageIndex + 1

    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) pages.push(i)
    } else {
      pages.push(1)

      if (currentPage > 3) pages.push('ellipsis')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(pageCount - 1, currentPage + 1)

      for (let i = start; i <= end; i++) pages.push(i)

      if (currentPage < pageCount - 2) pages.push('ellipsis')

      pages.push(pageCount)
    }

    return pages
  }

  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[align]

  const buttonBase =
    'px-3 py-1.5 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const buttonDefault = `${buttonBase} text-gray-300 hover:bg-gray-700 hover:text-white`
  const buttonActive = `${buttonBase} bg-blue-600 text-white`

  if (pageCount === 0) return null

  const currentPage = pageIndex + 1
  const canPreviousPage = currentPage > 1
  const canNextPage = currentPage < pageCount

  return (
    <div className={`mt-4 flex items-center gap-2 ${alignClass}`}>
      {showSizeChanger && (
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          disabled={disabled}
          className="rounded border border-gray-600 bg-gray-800 px-2 py-1.5 text-sm text-gray-300 focus:border-blue-500 focus:outline-none disabled:opacity-50"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      )}

      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={disabled || !canPreviousPage}
        className={buttonDefault}
      >
        ←
      </button>

      {getPageNumbers().map((p, idx) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            disabled={disabled}
            className={p === currentPage ? buttonActive : buttonDefault}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={disabled || !canNextPage}
        className={buttonDefault}
      >
        →
      </button>

      {showQuickJumper && (
        <div className="ml-2 flex items-center gap-2">
          <span className="text-sm text-gray-400">Go to</span>
          <input
            type="number"
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJump()}
            disabled={disabled}
            min={1}
            max={pageCount}
            className="w-16 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-sm text-gray-300 focus:border-blue-500 focus:outline-none disabled:opacity-50"
          />
        </div>
      )}

      <span className="ml-2 text-sm text-gray-400">
        {pageIndex * pageSize + 1}-{Math.min((pageIndex + 1) * pageSize, total)} of {total}
      </span>
    </div>
  )
}
