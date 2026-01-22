import { createFileRoute } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Papa from 'papaparse'
import { useEffect, useState } from 'react'
import csvUrl from './daily_etfs_demo.csv?url'

type StockData = {
  date: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  Name: string
}

const columnHelper = createColumnHelper<StockData>()

const columns = [
  columnHelper.accessor('Name', {
    header: 'Symbol',
    cell: info => (
      <span className="font-semibold text-blue-400">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor('open', {
    header: 'Open',
    cell: info => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor('high', {
    header: 'High',
    cell: info => (
      <span className="text-green-400">${info.getValue().toFixed(2)}</span>
    ),
  }),
  columnHelper.accessor('low', {
    header: 'Low',
    cell: info => (
      <span className="text-red-400">${info.getValue().toFixed(2)}</span>
    ),
  }),
  columnHelper.accessor('close', {
    header: 'Close',
    cell: info => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor('volume', {
    header: 'Volume',
    cell: info => info.getValue().toLocaleString(),
  }),
]

function parseCSV(csvString: string): StockData[] {
  const result = Papa.parse<StockData>(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  })
  return result.data
}

export const Route = createFileRoute('/spike/table/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [data, setData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(csvUrl)
      .then(res => res.text())
      .then(csv => {
        setData(parseCSV(csv))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: { fuzzy: {} as any },
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-xl text-gray-400">Loading data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-2xl font-bold text-white">Stock Data</h1>
        <p className="mb-6 text-sm text-gray-400">
          {data.length.toLocaleString()} records
        </p>
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
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-200"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
