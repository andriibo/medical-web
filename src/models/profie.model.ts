import { GenderEnum } from '~/enums/gender.enum'

export interface IPatientProfile {
  email: string
  firstName: string
  lastName: string
  phone: string
  dob: string
  gender: GenderEnum
  height: number
  weight: number
}

export interface IUpdatePatientProfile extends Omit<IPatientProfile, 'email'> {}

export type UpdatePatientProfileKeys = keyof IUpdatePatientProfile

export interface IDoctorProfile {
  email: string
  firstName: string
  lastName: string
  phone: string
  institution: string
}

export interface IUpdateDoctorProfile extends Omit<IDoctorProfile, 'email'> {}

export type IUpdateDoctorProfileKeys = keyof IUpdateDoctorProfile
