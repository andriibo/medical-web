import { TimesPreDayKeys } from '~/enums/times-pre-day.enum'

export interface IMedicationItem {
  genericName: string
  brandNames: string[]
}

export interface IMedicationDosage {
  dose: number | '' | null
  timesPerDay: TimesPreDayKeys | '' | null
}

export interface IMedicationModel extends IMedicationItem, IMedicationDosage {}

export interface IMedication extends IMedicationModel {
  medicationId: string
  createdBy: string
  createdAt: string
}

export interface ICreateMedicationForm extends IMedicationDosage {
  medicationName: {
    genericName: string
    brandNames: string[]
  }
  dose: number | ''
  timesPerDay: TimesPreDayKeys | ''
}

export interface ICreateMedication extends IMedicationModel {
  patientUserId: string
}

export interface IUpdateMedication {
  medication: IMedicationModel
  medicationId: string
}

export type CreateMedicationFormKeys = keyof ICreateMedicationForm
