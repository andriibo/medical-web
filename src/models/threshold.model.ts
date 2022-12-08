import { IUserModel } from '~models/user.model'

export interface IThresholdModel {
  thresholdName: string
  value: number
  setAtTimestamp: number
  setByUser: IUserModel
}
