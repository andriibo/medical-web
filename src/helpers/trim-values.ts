export function trimValues<K extends string>(values: Record<K, any>): Record<K, any> {
  const result: Partial<Record<K, any>> = values

  console.log(values)

  for (const key in values) {
    console.log(values[key])

    if (Boolean(values[key]) && typeof values[key] === 'string') result[key] = values[key].trim()
  }

  return result as Record<K, any>
}
