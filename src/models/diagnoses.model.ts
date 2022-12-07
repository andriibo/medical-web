export interface IDiagnosis {
  diagnosisId: string
  diagnosisName: string
  createdAt: string
  createdByUser: {
    userId: string
    email: string
    firstName: string
    lastName: string
  }
}

export interface ICreateDiagnosisForm {
  diagnosisName: string
}

export interface ICreateDiagnosis extends ICreateDiagnosisForm {
  patientUserId: string
}

export type ICreateDiagnosesFormKeys = keyof ICreateDiagnosisForm
