/**
 * Removes undefined, empty string, and 'all' values from params object
 * to keep URL clean and avoid default values in the URL.
 */
export const cleanEmptyParams = <T extends Record<string, unknown>>(
  params: T,
): Partial<T> => {
  const cleaned = { ...params } as Record<string, unknown>

  Object.keys(cleaned).forEach((key) => {
    const value = cleaned[key]
    if (
      value === undefined ||
      value === '' ||
      value === 'all' ||
      (typeof value === 'number' && isNaN(value))
    ) {
      delete cleaned[key]
    }
  })

  return cleaned as Partial<T>
}
