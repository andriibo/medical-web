import { IUserModel } from '~models/user.model'

export interface IMedicationItem {
  genericName: string
  brandNames: string[]
}

export interface IMedication extends IMedicationItem {
  medicationId: string
  createdAt: string
  createdByUser: IUserModel
}

export interface ICreateMedicationForm {
  medicationName: IMedicationItem
}

export interface ICreateMedication extends IMedicationItem {
  patientUserId: string
}

export type CreateMedicationFormKeys = keyof ICreateMedicationForm
