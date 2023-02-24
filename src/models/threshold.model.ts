import { VitalType } from '~/enums/vital-type.enum'
import { IUserModel } from '~models/user.model'

export interface IThresholdsResponse {
  threshold: IThresholds
  users: IUserModel[]
}

export interface IThresholds {
  minHr: number
  maxHr: number
  hrSetBy: string | null
  hrSetAt: number
  minTemp: number
  maxTemp: number
  tempSetBy: string | null
  tempSetAt: number
  minSpo2: number
  spo2SetBy: string | null
  spo2SetAt: number
  minRr: number
  maxRr: number
  rrSetBy: string | null
  rrSetAt: number
  minDbp: number
  maxDbp: number
  dbpSetBy: string | null
  dbpSetAt: number
  minSbp: number
  maxSbp: number
  sbpSetBy: string | null
  sbpSetAt: number
  minMap: number
  maxMap: number
  mapSetBy: string | null
  mapSetAt: number
  thresholdsId: string
  isPending: boolean
}

export interface IThresholdData {
  title: VitalType
  icon: string
  className?: string
  values: IThresholdListValues | IThresholdListValues[]
  setBy: IUserModel | null
  units: string
  onClick?: () => void
}

export interface IThresholdListValues {
  min: number
  max?: number
  title?: string
}

export interface IThresholdsCommon {
  min: number
  max: number
}

export interface IThresholdsSaturation {
  min: number
}

export interface IThresholdsBloodPressure {
  minDBP: number
  maxDBP: number
  minSBP: number
  maxSBP: number
}

export type ThresholdsCommonKeys = keyof IThresholdsCommon
export type ThresholdsSaturationKeys = keyof IThresholdsSaturation
export type ThresholdsBloodPressureKeys = keyof IThresholdsBloodPressure
