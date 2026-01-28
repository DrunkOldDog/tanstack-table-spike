import { createColumnHelper } from '@tanstack/react-table'
import type { HouseData } from './types'
import {
  priceRangeFilter,
  areaRangeFilter,
  exactMatchFilter,
} from './filters'

const columnHelper = createColumnHelper<HouseData>()

export const columns = [
  columnHelper.accessor('price', {
    header: 'Price',
    cell: info => `₹${info.getValue().toLocaleString()}`,
    filterFn: priceRangeFilter,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('area', {
    header: 'Area (sqft)',
    cell: info => info.getValue().toLocaleString(),
    filterFn: areaRangeFilter,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('bedrooms', {
    header: 'Bedrooms',
    cell: info => info.getValue(),
    filterFn: exactMatchFilter,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('bathrooms', {
    header: 'Bathrooms',
    cell: info => info.getValue(),
    filterFn: exactMatchFilter,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('stories', {
    header: 'Stories',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('furnishingstatus', {
    header: 'Furnishing',
    cell: info => (
      <span className="capitalize text-purple-400">{info.getValue()}</span>
    ),
    filterFn: exactMatchFilter,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('mainroad', {
    header: 'Main Road',
    cell: info => (info.getValue() ? 'Yes' : 'No'),
  }),
  columnHelper.accessor('guestroom', {
    header: 'Guest Room',
    cell: info => (info.getValue() ? 'Yes' : 'No'),
  }),
  columnHelper.accessor('basement', {
    header: 'Basement',
    cell: info => (info.getValue() ? 'Yes' : 'No'),
  }),
  columnHelper.accessor('hotwaterheating', {
    header: 'Hot Water',
    cell: info => (info.getValue() ? 'Yes' : 'No'),
  }),
  columnHelper.accessor('airconditioning', {
    header: 'AC',
    cell: info => (info.getValue() ? 'Yes' : 'No'),
  }),
  columnHelper.accessor('parking', {
    header: 'Parking',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('prefarea', {
    header: 'Preferred Area',
    cell: info => (info.getValue() ? 'Yes' : 'No'),
  }),
]
