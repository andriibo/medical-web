export interface IDiagnosis {
  diagnosisId: string
  diagnosisName: string
  createdBy: string
  createdAt: string
}

export interface ICreateDiagnosisForm {
  diagnosisName: string
}

export interface ICreateDiagnosis extends ICreateDiagnosisForm {
  patientUserId: string
}

export type ICreateDiagnosesFormKeys = keyof ICreateDiagnosisForm
