import { ManipulateType } from 'dayjs'

import { VitalPeriodKeys } from '~/enums/vital-period'
import { VitalsChartTabKeys } from '~/enums/vital-type.enum'
import { IThresholdsChartKeys } from '~models/threshold.model'

export const BASE_API = process.env.REACT_APP_API_URL

export const ACCOUNT_DELETION_DELAY = 30

export const DEFAULT_AVATAR = 'default-avatar.png'

type TimePeriod = {
  [key in VitalPeriodKeys]: {
    label: string
    value: number
    unit: ManipulateType
  }
}

export const TIME_PERIOD: TimePeriod = {
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
  range: {
    label: 'Range',
    value: 0,
    unit: 'month',
  },
}

type VitalThresholdType = {
  [key in VitalsChartTabKeys]: {
    max?: IThresholdsChartKeys
    min: IThresholdsChartKeys
  }
}

export const VITAL_THRESHOLDS_TYPE: VitalThresholdType = {
  hr: {
    max: 'maxHr',
    min: 'minHr',
  },
  rr: {
    max: 'maxRr',
    min: 'minRr',
  },
  spo2: {
    min: 'minSpo2',
  },
  temp: {
    max: 'maxTemp',
    min: 'minTemp',
  },
}
