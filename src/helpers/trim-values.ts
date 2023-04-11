export function trimValues<U extends object, T extends Record<keyof U, any>>(values: T): T {
  const result: T = values

  for (const key in values) {
    if (Boolean(values[key]) && typeof values[key] === 'string') result[key] = values[key].trim()
  }

  return result
}
