import { ManipulateType } from 'dayjs'

import { VitalPeriodKeys } from '~/enums/vital-period.enum'
import { VitalsChartTabKeys, VitalType, VitalTypeKeys, VitalUnits } from '~/enums/vital-type.enum'
import iconBloodPressure from '~images/icon-blood-pressure.png'
import iconHeartRate from '~images/icon-heart-rate.png'
import iconRespiration from '~images/icon-respiration.png'
import iconSaturation from '~images/icon-saturation.png'
import iconTemperature from '~images/icon-temperature.png'
import { IThresholdsChartKeys, ThresholdsBloodPressureKeys } from '~models/threshold.model'

export const BASE_API = import.meta.env.REACT_APP_API_URL

export const ACCOUNT_DELETION_DELAY = 30

export const DATE_FORMAT = 'YYYY/MM/DD'
export const DATE_FORMAT_FOR_SENDING = DATE_FORMAT.replaceAll('/', '-')

export const HISTORY_START_TIME_OFFSET_SEC = 30
export const HISTORY_START_REQUEST_TIME_OFFSET_SEC = 300
export const HISTORY_REQUEST_DELAY_SEC = 60

export const NURSE_SPECIALTY_OPTIONS = ['Nurse', 'Nurse Practitioner']

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

type VitalBpThresholds = {
  title: string
  min: ThresholdsBloodPressureKeys
  max: ThresholdsBloodPressureKeys
}

type VitalSettingsType = {
  [key in VitalTypeKeys]: {
    title: VitalType
    icon?: string
    units: VitalUnits
    min?: IThresholdsChartKeys
    max?: IThresholdsChartKeys
    bpMinMax?: VitalBpThresholds[]
  }
}

export const VITAL_SETTINGS: VitalSettingsType = {
  hr: {
    title: VitalType.hr,
    icon: iconHeartRate,
    units: VitalUnits.hr,
    min: 'minHr',
    max: 'maxHr',
  },
  temp: {
    title: VitalType.temp,
    icon: iconTemperature,
    units: VitalUnits.temp,
    max: 'maxTemp',
    min: 'minTemp',
  },
  spo2: {
    title: VitalType.spo2,
    icon: iconSaturation,
    units: VitalUnits.spo2,
    min: 'minSpo2',
  },
  rr: {
    title: VitalType.rr,
    icon: iconRespiration,
    units: VitalUnits.rr,
    max: 'maxRr',
    min: 'minRr',
  },
  fall: {
    title: VitalType.fall,
    units: VitalUnits.fall,
  },
  bp: {
    title: VitalType.bp,
    icon: iconBloodPressure,
    units: VitalUnits.bp,
    bpMinMax: [
      {
        title: 'DBP',
        min: 'minDbp',
        max: 'maxDbp',
      },
      {
        title: 'SBP',
        min: 'minSbp',
        max: 'maxSbp',
      },
    ],
  },
}
