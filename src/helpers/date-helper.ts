import dayjs, { Dayjs } from 'dayjs'

import { DATE_FORMAT_FOR_SENDING } from '~constants/constants'

export const convertToUtc = (date: string) => `${dayjs(date).format(DATE_FORMAT_FOR_SENDING)}T00:00:00.000Z`

export const resetSeconds = (date: Dayjs | null) => dayjs(date).set('seconds', 0)
