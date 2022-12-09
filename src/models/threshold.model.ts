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

export type ThresholdsObj = {
  [key in thresholdNameKeys]?: IThresholdModel
}

export interface IThresholdModel {
  thresholdName: thresholdNameKeys
  value: number
  setAtTimestamp: number
  setByUser: IUserModel
}
