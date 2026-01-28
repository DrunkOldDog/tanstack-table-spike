import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import type { HouseData } from '../-lib/types'
import csvUrl from '../house_prices_dataset.csv?url'

function parseCSV(csvString: string): HouseData[] {
  const result = Papa.parse<HouseData>(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  })
  return result.data
}

export function useHouseData() {
  const [data, setData] = useState<HouseData[]>([])
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
