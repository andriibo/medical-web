export interface IMedicationItem {
  genericName: string
  brandNames: string[]
}

export interface IMedication extends IMedicationItem {
  medicationId: string
  createdAt: string
  createdByUser: {
    userId: string
    email: string
    firstName: string
    lastName: string
  }
}

export interface ICreateMedicationForm {
  medicationName: IMedicationItem
}

export interface ICreateMedication extends IMedicationItem {
  patientUserId: string
}

export type ICreateMedicationFormKeys = keyof ICreateMedicationForm
