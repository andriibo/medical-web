export interface IDiagnoses {
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

export interface ICreateDiagnosesForm {
  diagnosisName: string
}

export interface ICreateDiagnoses extends ICreateDiagnosesForm {
  patientUserId: string
}

export type ICreateDiagnosesFormKeys = keyof ICreateDiagnosesForm
