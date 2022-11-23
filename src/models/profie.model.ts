import { GenderEnum } from '~/enums/gender.enum'

export interface IPatientProfile {
  avatar: string
  email: string
  firstName: string
  lastName: string
  phone: string
  dob: string
  gender: GenderEnum
  height: number
  weight: number
}

export interface IUpdatePatientProfile extends Omit<IPatientProfile, 'email' | 'avatar'> {}

export type UpdatePatientProfileKeys = keyof IUpdatePatientProfile

export interface IDoctorProfile {
  avatar: string
  email: string
  firstName: string
  lastName: string
  phone: string
  institution: string
}

export interface IUpdateDoctorProfile extends Omit<IDoctorProfile, 'email' | 'avatar'> {}

export type UpdateDoctorProfileKeys = keyof IUpdateDoctorProfile
