import { VitalsTypeFilterKeys, VitalType, VitalTypeKeys, VitalUnits } from '~/enums/vital-type.enum'
import { IThresholds } from '~models/threshold.model'
import { IUserModel } from '~models/user.model'

export interface IVitalsData {
  vitals: IVital[]
  thresholds: IThresholds[]
  users: IUserModel[]
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
  units: VitalUnits
  type: VitalTypeKeys
}

export interface IVitalsSettings {
  title: VitalType
  icon: string
  units: VitalUnits
  type: VitalTypeKeys
}

export interface IVitalsHistoryCard {
  timestamp: number
  isTempNormal: boolean
  isHrNormal: boolean
  isSpo2Normal: boolean
  isRrNormal: boolean
  items: IVitalsHistoryCardItems[]
}

export interface IVitalsHistoryCardItems {
  title: VitalType
  value: number | boolean
  isNormal?: boolean
  icon: string
  units: VitalUnits
  type: VitalTypeKeys
  threshold?: IVitalsHistoryCardThreshold[]
}

interface IVitalsHistoryCardThreshold {
  min: number
  max?: number
  title?: string
}

export interface IVitalChart {
  temp: IVitalChartModel[]
  hr: IVitalChartModel[]
  spo2: IVitalChartModel[]
  rr: IVitalChartModel[]
}

export interface IVitalChartSettings {
  abnormalValues: boolean
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

export interface IVitalsAbsolute {
  minHr: number
  maxHr: number
  minTemp: number
  maxTemp: number
  minSpo2: number
  maxSpo2: number
  minRr: number
  maxRr: number
  minDbp: number
  maxDbp: number
  minSbp: number
  maxSbp: number
}

export type IVitalsFilterTypes = Record<VitalsTypeFilterKeys, boolean>
