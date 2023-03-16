export function trimValues<K extends string>(values: Record<K, any>): Record<K, any> {
  const result: Partial<Record<K, any>> = values

  for (const key in values) {
    if (typeof values[key] === 'string') result[key] = values[key].trim()
  }

  return result as Record<K, any>
}
