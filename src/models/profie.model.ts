import { Gender } from '~/enums/gender.enum'
import { PatientCategory } from '~/enums/patient-category.enum'
import { UserRoles } from '~/enums/user-roles.enum'
import { Modify } from '~/types/modify.type'

export interface IPatientProfile {
  userId: string
  avatar: string | null
  email: string
  firstName: string
  lastName: string
  phone: string
  dob: string
  gender: Gender
  height: number
  weight: number
  deletedAt: number
  passwordUpdatedAt: number
}

export interface IUpdatePatientProfile {
  firstName: string
  lastName: string
  phone: string
  dob: string
  gender: Gender
  height: number
  weight: number
}

export interface IUpdatePatientProfileForm
  extends Modify<
    IUpdatePatientProfile,
    {
      height: number | string
      weight: number | string
    }
  > {}

export type UpdatePatientProfileKeys = keyof IUpdatePatientProfile

export interface ICaregiverProfile {
  userId: string
  email: string
  firstName: string
  lastName: string
  phone: string
  avatar: string | null
  role: UserRoles
  deletedAt: number | null
  passwordUpdatedAt: number
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
  lastConnected: number | null
  category: PatientCategory
}

export interface IUpdateDoctorProfile extends Omit<IDoctorProfile, 'email' | 'avatar'> {}

export interface IUpdateCaregiverProfile extends Omit<ICaregiverProfile, 'email' | 'avatar'> {}

export type UpdateDoctorProfileKeys = keyof IUpdateDoctorProfile

export type UpdateCaregiverProfileKeys = keyof IUpdateCaregiverProfile
