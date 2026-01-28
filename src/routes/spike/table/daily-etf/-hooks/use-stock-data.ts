import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import type { StockData } from '../-lib/types'
import csvUrl from '../daily_etfs_demo.csv?url'

function parseCSV(csvString: string): StockData[] {
  const result = Papa.parse<StockData>(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  })
  return result.data
}

export function useStockData() {
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

  return { data, loading }
}
