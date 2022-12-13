import { IUserModel } from '~models/user.model'

type thresholdNameKeys =
  | 'MinHR'
  | 'MaxHR'
  | 'MinTemp'
  | 'MaxTemp'
  | 'MinSpO2'
  | 'MinRR'
  | 'MaxRR'
  | 'MinDBP'
  | 'MaxDBP'
  | 'MinSBP'
  | 'MaxSBP'
  | 'MinMAP'
  | 'MaxMAP'

export type IThresholdsObj = {
  [key in thresholdNameKeys]: IThresholdModel
}

export interface IThresholdModel {
  thresholdName: thresholdNameKeys
  value: number
  setAtTimestamp: number
  setByUser: IUserModel
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
