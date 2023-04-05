import dayjs from 'dayjs'

import { DATE_FORMAT } from '~constants/constants'

export const convertToUtc = (date: string) => `${dayjs(date).format(DATE_FORMAT)}T00:00:00.000Z`
