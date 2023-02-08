import { VitalType } from '~/enums/vital-type.enum'
import { IUserModel } from '~models/user.model'

export interface IThresholds {
  minHr: number
  maxHr: number
  hrSetBy: IUserModel | null
  hrSetAt: number
  minTemp: number
  maxTemp: number
  tempSetBy: IUserModel | null
  tempSetAt: number
  minSpo2: number
  spo2SetBy: IUserModel | null
  spo2SetAt: number
  minRr: number
  maxRr: number
  rrSetBy: IUserModel | null
  rrSetAt: number
  minDbp: number
  maxDbp: number
  dbpSetBy: IUserModel | null
  dbpSetAt: number
  minSbp: number
  maxSbp: number
  sbpSetBy: IUserModel | null
  sbpSetAt: number
  minMap: number
  maxMap: number
  mapSetBy: IUserModel | null
  mapSetAt: number
  thresholdsId: string
  isPending: boolean
  createdAt: number
}

export interface IThresholdList {
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

export interface IThresholdsChart {
  minHr: number
  maxHr: number
  minTemp: number
  maxTemp: number
  minSpo2: number
  minRr: number
  maxRr: number
}

export type IThresholdsChartKeys = keyof IThresholdsChart
export type ThresholdsCommonKeys = keyof IThresholdsCommon
export type ThresholdsSaturationKeys = keyof IThresholdsSaturation
export type ThresholdsBloodPressureKeys = keyof IThresholdsBloodPressure
