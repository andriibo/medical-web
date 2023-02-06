import { ManipulateType } from 'dayjs'

import { VitalPeriod, VitalPeriodKeys } from '~/enums/vital-period'

export const BASE_API = process.env.REACT_APP_API_URL

export const ACCOUNT_DELETION_DELAY = 30

export const DEFAULT_AVATAR = 'default-avatar.png'

type ObjectValues<T> = T[keyof T]

export type VitalTab = ObjectValues<typeof VITAL_TAB>

export const VITAL_TAB = {
  hr: 'HR',
  spo2: 'SPO2',
  rr: 'RR',
  temp: 'TEMP',
} as const

export type Sdd = typeof VITAL_TAB

const MES_TEX = {
  id: '1',
  text: 'Text',
}

type MessType = typeof MES_TEX

type Time = {
  [key in VitalPeriodKeys]: {
    label: string
    value: number
    unit: ManipulateType
  }
}

export const TIME_PERIOD: Time = {
  oneHour: {
    label: '1H',
    value: 1,
    unit: 'hour',
  },
  twelveHours: {
    label: '12H',
    value: 12,
    unit: 'hours',
  },
  day: {
    label: '24H',
    value: 1,
    unit: 'day',
  },
  week: {
    label: '7D',
    value: 7,
    unit: 'days',
  },
  month: {
    label: '30D',
    value: 1,
    unit: 'month',
  },
}
