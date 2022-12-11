import { IUserModel } from '~models/user.model'

export interface IDiagnosis {
  diagnosisId: string
  diagnosisName: string
  createdAt: string
  createdByUser: IUserModel
}

export interface ICreateDiagnosisForm {
  diagnosisName: string
}

export interface ICreateDiagnosis extends ICreateDiagnosisForm {
  patientUserId: string
}

export type ICreateDiagnosesFormKeys = keyof ICreateDiagnosisForm
