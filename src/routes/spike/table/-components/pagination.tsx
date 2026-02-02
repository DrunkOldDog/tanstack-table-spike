import { useState, useEffect } from 'react'

type PaginationAlign = 'left' | 'center' | 'right'

export interface PaginationProps {
  align?: PaginationAlign
  current?: number
  defaultCurrent?: number
  defaultPageSize?: number
  disabled?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  showQuickJumper?: boolean
  showSizeChanger?: boolean
  total: number
  onChange?: (page: number, pageSize: number) => void
}

export function Pagination({
  align = 'right',
  current,
  defaultCurrent = 1,
  defaultPageSize = 10,
  disabled = false,
  pageSize: controlledPageSize,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = false,
  showSizeChanger = false,
  total,
  onChange,
}: PaginationProps) {
  const [internalPage, setInternalPage] = useState(defaultCurrent)
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize)
  const [jumpValue, setJumpValue] = useState('')

  const page = current ?? internalPage
  const pageSize = controlledPageSize ?? internalPageSize
  const totalPages = Math.ceil(total / pageSize)

  useEffect(() => {
    if (current !== undefined) {
      setInternalPage(current)
    }
  }, [current])

  useEffect(() => {
    if (controlledPageSize !== undefined) {
      setInternalPageSize(controlledPageSize)
    }
  }, [controlledPageSize])

  const handlePageChange = (newPage: number) => {
    if (disabled || newPage < 1 || newPage > totalPages) return
    if (current === undefined) {
      setInternalPage(newPage)
    }
    onChange?.(newPage, pageSize)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    if (disabled) return
    const newTotalPages = Math.ceil(total / newPageSize)
    const newPage = Math.min(page, newTotalPages)
    if (controlledPageSize === undefined) {
      setInternalPageSize(newPageSize)
    }
    if (current === undefined && newPage !== page) {
      setInternalPage(newPage)
    }
    onChange?.(newPage, newPageSize)
  }

  const handleJump = () => {
    const jumpPage = parseInt(jumpValue, 10)
    if (!isNaN(jumpPage) && jumpPage >= 1 && jumpPage <= totalPages) {
      handlePageChange(jumpPage)
    }
    setJumpValue('')
  }

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const showPages = 5

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)

      if (page > 3) pages.push('ellipsis')

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)

      for (let i = start; i <= end; i++) pages.push(i)

      if (page < totalPages - 2) pages.push('ellipsis')

      pages.push(totalPages)
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

  if (totalPages === 0) return null

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
        onClick={() => handlePageChange(page - 1)}
        disabled={disabled || page === 1}
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
            className={p === page ? buttonActive : buttonDefault}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={disabled || page === totalPages}
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
            max={totalPages}
            className="w-16 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-sm text-gray-300 focus:border-blue-500 focus:outline-none disabled:opacity-50"
          />
        </div>
      )}

      <span className="ml-2 text-sm text-gray-400">
        {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
      </span>
    </div>
  )
}
