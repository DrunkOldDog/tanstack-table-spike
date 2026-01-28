import { createColumnHelper } from '@tanstack/react-table'
import type { HouseData } from './types'
import { priceRangeFilter, areaRangeFilter, exactMatchFilter } from './filters'
// Import to ensure module augmentation is applied
import '../../-lib/column.types'

const columnHelper = createColumnHelper<HouseData>()

export const columns = [
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => `₹${info.getValue().toLocaleString()}`,
    filterFn: priceRangeFilter,
    enableGlobalFilter: false,
    meta: {
      group: 'Property Info',
      exportLabel: 'Property Price',
      defaultPinned: 'left',
    },
  }),
  columnHelper.accessor('area', {
    header: 'Area (sqft)',
    cell: (info) => info.getValue().toLocaleString(),
    filterFn: areaRangeFilter,
    enableGlobalFilter: false,
    meta: {
      group: 'Property Info',
      exportLabel: 'Area in Square Feet',
    },
  }),
  columnHelper.accessor('bedrooms', {
    header: 'Bedrooms',
    cell: (info) => info.getValue(),
    filterFn: exactMatchFilter,
    enableGlobalFilter: false,
    meta: {
      group: 'Rooms',
      exportLabel: 'Number of Bedrooms',
    },
  }),
  columnHelper.accessor('bathrooms', {
    header: 'Bathrooms',
    cell: (info) => info.getValue(),
    filterFn: exactMatchFilter,
    enableGlobalFilter: false,
    meta: {
      group: 'Rooms',
      exportLabel: 'Number of Bathrooms',
    },
  }),
  columnHelper.accessor('stories', {
    header: 'Stories',
    cell: (info) => info.getValue(),
    meta: {
      group: 'Property Info',
      exportLabel: 'Number of Stories',
    },
  }),
  columnHelper.accessor('furnishingstatus', {
    header: 'Furnishing',
    cell: (info) => (
      <span className="capitalize text-purple-400">{info.getValue()}</span>
    ),
    filterFn: exactMatchFilter,
    enableGlobalFilter: false,
    meta: {
      group: 'Property Info',
      exportLabel: 'Furnishing Status',
    },
  }),
  columnHelper.accessor('mainroad', {
    header: 'Main Road',
    cell: (info) => (info.getValue() ? 'Yes' : 'No'),
    meta: {
      group: 'Location',
      exportLabel: 'Near Main Road',
    },
  }),
  columnHelper.accessor('guestroom', {
    header: 'Guest Room',
    cell: (info) => (info.getValue() ? 'Yes' : 'No'),
    meta: {
      group: 'Rooms',
      exportLabel: 'Has Guest Room',
    },
  }),
  columnHelper.accessor('basement', {
    header: 'Basement',
    cell: (info) => (info.getValue() ? 'Yes' : 'No'),
    meta: {
      group: 'Amenities',
      exportLabel: 'Has Basement',
    },
  }),
  columnHelper.accessor('hotwaterheating', {
    header: 'Hot Water',
    cell: (info) => (info.getValue() ? 'Yes' : 'No'),
    meta: {
      group: 'Amenities',
      exportLabel: 'Hot Water Heating',
    },
  }),
  columnHelper.accessor('airconditioning', {
    header: 'AC',
    cell: (info) => (info.getValue() ? 'Yes' : 'No'),
    meta: {
      group: 'Amenities',
      exportLabel: 'Air Conditioning',
    },
  }),
  columnHelper.accessor('parking', {
    header: 'Parking',
    cell: (info) => info.getValue(),
    meta: {
      group: 'Amenities',
      exportLabel: 'Parking Spaces',
    },
  }),
  columnHelper.accessor('prefarea', {
    header: 'Preferred Area',
    cell: (info) => (info.getValue() ? 'Yes' : 'No'),
    meta: {
      group: 'Location',
      exportLabel: 'In Preferred Area',
    },
  }),
]
