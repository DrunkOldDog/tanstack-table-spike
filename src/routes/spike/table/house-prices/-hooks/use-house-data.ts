import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { faker } from '@faker-js/faker'
import type { HouseData, HouseOwner } from '../-lib/types'
import csvUrl from '../house_prices_dataset.csv?url'

type CsvHouseData = Omit<HouseData, 'houseOwner'>

function generateHouseOwner(): HouseOwner {
  return {
    userId: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  }
}

function parseCSV(csvString: string): HouseData[] {
  const result = Papa.parse<CsvHouseData>(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  })

  return result.data.map((row) => ({
    ...row,
    houseOwner: generateHouseOwner(),
  }))
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
