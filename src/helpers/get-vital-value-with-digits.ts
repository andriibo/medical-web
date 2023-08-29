import { TEMP_DIGITS as tempDigits } from '~constants/constants'

export const getVitalValueWithDigits = (value: number | boolean, type: string) => {
  if (typeof value === 'boolean') return value

  if (value === 0) return '-'

  const digits = type === 'temp' ? tempDigits : 0

  return value.toFixed(digits)
}
