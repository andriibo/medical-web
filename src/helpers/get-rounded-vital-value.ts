import { TEMP_DIGITS as tempDigits } from '~constants/constants'

export const getRoundedVitalValue = (value: number | null, type: string) => {
  if (value === null) return '-'

  const digits = type === 'temp' ? tempDigits : 0

  return value.toFixed(digits)
}
