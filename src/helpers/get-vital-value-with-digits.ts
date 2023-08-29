export const getVitalValueWithDigits = (value: number | boolean, type: string) => {
  if (value === 0) return '-'

  if (typeof value === 'boolean') return value

  const digits = type === 'temp' ? 1 : 0

  return value.toFixed(digits)
}
