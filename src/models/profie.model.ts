import { Gender } from '~/enums/gender.enum'

export interface IPatientProfile {
  userId: string
  avatar: string
  email: string
  firstName: string
  lastName: string
  phone: string
  dob: string
  gender: Gender
  height: number
  weight: number
}

export interface IUpdatePatientProfile extends Omit<IPatientProfile, 'email' | 'avatar'> {}

export type UpdatePatientProfileKeys = keyof IUpdatePatientProfile

export interface ICaregiverProfile {
  avatar: string
  email: string
  firstName: string
  lastName: string
  phone: string
}

export interface IDoctorProfile extends ICaregiverProfile {
  institution: string
}

export interface IPatientDoctors extends IDoctorProfile {
  accessId: string
}

export interface IPatientCaregivers extends ICaregiverProfile {
  accessId: string
}

export interface IDoctorPatients extends IPatientProfile {
  accessId: string
}

export interface IUpdateDoctorProfile extends Omit<IDoctorProfile, 'email' | 'avatar'> {}

export interface IUpdateCaregiverProfile extends Omit<ICaregiverProfile, 'email' | 'avatar'> {}

export type UpdateDoctorProfileKeys = keyof IUpdateDoctorProfile

export type UpdateCaregiverProfileKeys = keyof IUpdateCaregiverProfile
