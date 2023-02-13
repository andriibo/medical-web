import { VitalPeriodKeys } from '~/enums/vital-period'
import { VitalType } from '~/enums/vital-type.enum'
import { IThresholds } from '~models/threshold.model'

export interface IVitalsData {
  vitals: IVital[]
  thresholds: IThresholds[]
}

export interface IVital {
  temp: number
  isTempNormal: boolean
  hr: number
  isHrNormal: boolean
  spo2: number
  isSpo2Normal: boolean
  rr: number
  isRrNormal: boolean
  fall: boolean
  timestamp: number
  thresholdsId: string
}

export interface IVitalsCard {
  timestamp: number
  title: VitalType
  value: string | number | null | undefined | boolean
  thresholds?: {
    min?: number
    max?: number
  }
  icon: string
  units: string
}

export interface IVitalsHistoryCard {
  title: VitalType
  value: number | boolean
  isNormal?: boolean
  icon: string
  units: string
  thresholds?: {
    min?: number
    max?: number
  }
}

export interface IVitalChart {
  temp: IVitalChartModel[]
  hr: IVitalChartModel[]
  spo2: IVitalChartModel[]
  rr: IVitalChartModel[]
}

export interface IVitalChartSettings {
  abnormalValues: boolean
  normalZone: boolean
  variance: boolean
}

export interface IVitalChartModel {
  value: number
  minStd: number
  maxStd: number
  timestamp: number
}

export interface IMyVitalsRequest {
  startDate: string
  endDate: string
}

export interface IPatientVitalsRequest extends IMyVitalsRequest {
  patientUserId: string
}
