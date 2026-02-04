import type { ColumnDef, RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'

/**
 * Extended column metadata inspired by ETK's DataGridColumn
 */
export interface ExtendedColumnMeta {
  /** Alignment of the column */
  align?: 'left' | 'center' | 'right'
  /** Class names for the column */
  classNames?: string
  /** Logical group for organizing columns in the manager */
  group?: string
  /** Label to use when exporting (falls back to header) */
  exportLabel?: string
  /** Raw title string when header is a ReactNode */
  rawTitle?: string
  /** Render function for empty/null values */
  emptyValueRender?: (info: unknown) => ReactNode
  /** Transform the value before display */
  transformValue?: <T>(value: T, record: unknown) => T
  /** Default visibility state */
  defaultHidden?: boolean
  /** Default pin position */
  defaultPinned?: 'left' | 'right' | false
}

/**
 * Extended ColumnDef that includes custom metadata
 */
export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  meta?: ExtendedColumnMeta
}

/**
 * Pin status type matching TanStack Table's pinning
 */
export type PinStatus = 'left' | 'right' | false

// Module augmentation for TanStack Table
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> extends ExtendedColumnMeta {}
}
